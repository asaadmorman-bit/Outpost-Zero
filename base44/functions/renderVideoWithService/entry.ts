import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { integrationId, script, storyboard, videoConfig } = await req.json();

        // Get the video service integration
        const integration = await base44.entities.VideoServiceIntegration.get(integrationId);

        if (!integration || integration.status !== 'connected') {
            return Response.json({ error: 'Video service not connected' }, { status: 400 });
        }

        let renderResult;

        // Route to the appropriate service
        switch (integration.service_provider) {
            case 'synthesia':
                renderResult = await renderWithSynthesia(integration, script, storyboard, videoConfig);
                break;
            case 'remotion':
                renderResult = await renderWithRemotion(integration, script, storyboard, videoConfig);
                break;
            case 'visla':
                renderResult = await renderWithVisla(integration, script, storyboard, videoConfig);
                break;
            default:
                return Response.json({ error: 'Unsupported video service' }, { status: 400 });
        }

        // Update usage metrics
        await base44.asServiceRole.entities.VideoServiceIntegration.update(integrationId, {
            usage_metrics: {
                ...integration.usage_metrics,
                videos_generated: (integration.usage_metrics?.videos_generated || 0) + 1,
                total_duration_minutes: (integration.usage_metrics?.total_duration_minutes || 0) + videoConfig.duration,
                credits_used: (integration.usage_metrics?.credits_used || 0) + (renderResult.credits_used || 1)
            },
            last_used: new Date().toISOString()
        });

        return Response.json({
            success: true,
            render_job_id: renderResult.job_id,
            status: renderResult.status,
            estimated_completion: renderResult.estimated_completion,
            video_url: renderResult.video_url
        });

    } catch (error) {
        console.error('Error rendering video:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});

async function renderWithSynthesia(integration, script, storyboard, videoConfig) {
    const apiKey = integration.credentials.api_key;
    
    // Call Synthesia API
    const response = await fetch('https://api.synthesia.io/v2/videos', {
        method: 'POST',
        headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            test: true, // Set to false for production
            input: [
                {
                    avatarSettings: {
                        horizontalAlign: "center",
                        scale: 1,
                        style: "rectangular",
                        seamless: false
                    },
                    avatar: integration.configuration?.default_avatar_id || "anna_costume1_cameraA",
                    backgroundSettings: {
                        videoSettings: {
                            shortBackgroundContentMatchMode: "freeze",
                            longBackgroundContentMatchMode: "trim"
                        }
                    },
                    scriptText: script.full_narration,
                    voice: integration.configuration?.default_voice_id || "en-US-Neural2-A"
                }
            ],
            title: videoConfig.title,
            description: videoConfig.description,
            visibility: "private"
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Synthesia API error: ${data.message || response.statusText}`);
    }

    return {
        job_id: data.id,
        status: 'rendering',
        estimated_completion: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        video_url: data.download || null,
        credits_used: 1
    };
}

async function renderWithRemotion(integration, script, storyboard, videoConfig) {
    const apiKey = integration.credentials.api_key;
    
    // Call Remotion Lambda API
    const response = await fetch('https://api.remotion.dev/lambda/render', {
        method: 'POST',
        headers: {
            'X-Remotion-Token': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            composition: 'SecurityDemo',
            serveUrl: 'https://your-remotion-bundle.com', // You'd need to host your Remotion project
            inputProps: {
                script: script,
                storyboard: storyboard,
                config: videoConfig
            },
            codec: 'h264',
            privacy: 'private'
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Remotion API error: ${data.message || response.statusText}`);
    }

    return {
        job_id: data.renderId,
        status: 'rendering',
        estimated_completion: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        video_url: data.url || null,
        credits_used: 1
    };
}

async function renderWithVisla(integration, script, storyboard, videoConfig) {
    const apiKey = integration.credentials.api_key;
    
    // Call Visla API (Note: This is a mock implementation as Visla's API docs aren't public)
    const response = await fetch('https://api.visla.us/v1/videos', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: videoConfig.title,
            script: script.full_narration,
            scenes: storyboard,
            style: videoConfig.style,
            resolution: videoConfig.resolution
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Visla API error: ${data.message || response.statusText}`);
    }

    return {
        job_id: data.video_id,
        status: 'rendering',
        estimated_completion: new Date(Date.now() + 12 * 60 * 1000).toISOString(),
        video_url: data.url || null,
        credits_used: 1
    };
}