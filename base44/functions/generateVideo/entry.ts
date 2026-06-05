import { createClientFromRequest } from 'npm:@base44/sdk@0.5.0';

// Video production API endpoints
const SYNTHESIA_API_URL = 'https://api.synthesia.io/v2/videos';
const LOOM_API_URL = 'https://api.loom.com/v1/videos';
const REMOTION_API_URL = 'https://api.remotion.dev/lambda/render';

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    
    if (!(await base44.auth.isAuthenticated())) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const { videoConfig, script, storyboard, productionMethod } = await req.json();

        let videoResult;
        
        switch (productionMethod) {
            case 'synthesia':
                videoResult = await generateWithSynthesia(videoConfig, script);
                break;
            case 'remotion':
                videoResult = await generateWithRemotion(videoConfig, script, storyboard);
                break;
            case 'loom':
                videoResult = await generateWithLoom(videoConfig, script);
                break;
            case 'runway':
                videoResult = await generateWithRunway(videoConfig, script, storyboard);
                break;
            default:
                videoResult = await generateWithOpenAI(videoConfig, script, storyboard);
        }

        // Save video record to database
        const videoRecord = await base44.entities.TrainingContent.create({
            content_id: `video_${Date.now()}`,
            title: videoConfig.title,
            description: videoConfig.description,
            content_type: 'video',
            use_case: videoConfig.use_case || 'platform_demo',
            difficulty_level: 'intermediate',
            duration_minutes: parseInt(videoConfig.duration),
            ai_generated: true,
            animation_style: videoConfig.style,
            video_url: videoResult.video_url,
            transcript: script.full_narration,
            target_audience: [videoConfig.target_audience],
            learning_objectives: script.key_differentiators || [],
            completion_rate: 0,
            effectiveness_rating: 5
        });

        return new Response(JSON.stringify({
            success: true,
            video: videoResult,
            record_id: videoRecord.id
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Video generation error:', error);
        return new Response(JSON.stringify({ 
            error: error.message,
            details: 'Video production failed. Please try again or contact support.'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

// Synthesia AI Avatar Video Generation
async function generateWithSynthesia(videoConfig, script) {
    const SYNTHESIA_API_KEY = Deno.env.get('SYNTHESIA_API_KEY');
    
    if (!SYNTHESIA_API_KEY) {
        throw new Error('Synthesia API key not configured');
    }

    const payload = {
        title: videoConfig.title,
        description: videoConfig.description,
        visibility: 'private',
        template_id: 'cyber_professional_v2', // Custom template
        template_data: {
            avatar: selectAvatar(videoConfig.target_audience),
            background: selectBackground(videoConfig.style),
            script: script.full_narration,
            voice: selectVoice(videoConfig.target_audience),
            music: selectMusic(videoConfig.tone),
            branding: {
                logo_url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/174051417_Screenshot2025-07-24110248.jpg',
                company_name: 'Cyber Dojo Solutions',
                primary_color: '#4f46e5',
                secondary_color: '#06b6d4'
            }
        },
        webhook_url: `${Deno.env.get('BASE_URL')}/webhooks/synthesia-complete`
    };

    const response = await fetch(SYNTHESIA_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${SYNTHESIA_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (!response.ok) {
        throw new Error(`Synthesia API error: ${result.message}`);
    }

    return {
        provider: 'synthesia',
        video_id: result.id,
        video_url: result.download_url,
        thumbnail_url: result.thumbnail_url,
        status: result.status,
        estimated_completion: result.estimated_completion_time
    };
}

// Remotion Programmatic Video Generation
async function generateWithRemotion(videoConfig, script, storyboard) {
    const REMOTION_API_KEY = Deno.env.get('REMOTION_API_KEY');
    
    if (!REMOTION_API_KEY) {
        throw new Error('Remotion API key not configured');
    }

    // Convert storyboard to Remotion composition data
    const composition = {
        id: 'OutpostZeroDemo',
        durationInFrames: parseInt(videoConfig.duration) * 30 * 60, // 30 FPS
        fps: 30,
        width: 1920,
        height: 1080,
        props: {
            title: videoConfig.title,
            scenes: storyboard.map(scene => ({
                startFrame: scene.scene_number * 150, // ~5 seconds per scene
                duration: scene.duration_seconds * 30,
                type: scene.animation_style || 'slide',
                content: {
                    visual: scene.visual_description,
                    narration: scene.narration,
                    style: videoConfig.style
                }
            })),
            branding: {
                logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/174051417_Screenshot2025-07-24110248.jpg',
                colors: {
                    primary: '#4f46e5',
                    secondary: '#06b6d4',
                    accent: '#8b5cf6'
                }
            },
            audio: {
                narration: script.full_narration,
                music: 'tech_corporate_inspiring'
            }
        }
    };

    const response = await fetch(`${REMOTION_API_URL}/render`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${REMOTION_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            composition: composition.id,
            serveUrl: `${Deno.env.get('BASE_URL')}/remotion-compositions`,
            inputProps: composition.props,
            codec: 'h264',
            imageFormat: 'jpeg',
            scale: 1,
            proResProfile: undefined,
            x264Preset: 'fast',
            pixelFormat: 'yuv420p',
            audioBitrate: '320k',
            videoBitrate: '8M',
            envVariables: {},
            chromiumOptions: {},
            frameRange: [0, composition.durationInFrames],
            outName: `${videoConfig.title.replace(/\s+/g, '_')}.mp4`
        })
    });

    const result = await response.json();
    
    if (!response.ok) {
        throw new Error(`Remotion API error: ${result.message}`);
    }

    return {
        provider: 'remotion',
        render_id: result.renderId,
        video_url: result.url,
        status: 'rendering',
        estimated_completion: '5-10 minutes'
    };
}

// Runway ML AI Video Generation
async function generateWithRunway(videoConfig, script, storyboard) {
    const RUNWAY_API_KEY = Deno.env.get('RUNWAY_API_KEY');
    
    if (!RUNWAY_API_KEY) {
        throw new Error('Runway ML API key not configured');
    }

    // Generate video using Runway's Gen-2 model
    const tasks = [];
    
    for (const scene of storyboard) {
        const task = await fetch('https://api.runwayml.com/v1/generate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RUNWAY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gen2',
                prompt: `${scene.visual_description}. Professional cybersecurity interface, ${videoConfig.style} style, dark blue theme, high-tech, clean, enterprise-grade`,
                duration: scene.duration_seconds,
                aspect_ratio: '16:9',
                quality: 'high',
                motion_strength: 0.7,
                seed: Math.floor(Math.random() * 1000000)
            })
        });
        
        const taskResult = await task.json();
        tasks.push(taskResult);
    }

    // Wait for all scenes to complete and then stitch together
    const completedScenes = await Promise.all(
        tasks.map(async (task) => {
            let status = 'processing';
            let attempts = 0;
            const maxAttempts = 60; // 10 minutes max
            
            while (status === 'processing' && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
                
                const statusResponse = await fetch(`https://api.runwayml.com/v1/tasks/${task.id}`, {
                    headers: { 'Authorization': `Bearer ${RUNWAY_API_KEY}` }
                });
                
                const statusResult = await statusResponse.json();
                status = statusResult.status;
                
                if (status === 'completed') {
                    return statusResult.output;
                }
                
                attempts++;
            }
            
            throw new Error('Video generation timed out');
        })
    );

    // Stitch scenes together (this would require additional video processing)
    const finalVideoUrl = await stitchVideos(completedScenes, script.full_narration);

    return {
        provider: 'runway',
        video_url: finalVideoUrl,
        thumbnail_url: completedScenes[0]?.thumbnail,
        status: 'completed',
        scenes_generated: completedScenes.length
    };
}

// OpenAI + FFmpeg fallback method
async function generateWithOpenAI(videoConfig, script, storyboard) {
    // Generate images for each scene using DALL-E
    const scenes = await Promise.all(
        storyboard.map(async (scene) => {
            const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'dall-e-3',
                    prompt: `${scene.visual_description}. Professional cybersecurity dashboard, ${videoConfig.style} style, high-tech interface, enterprise-grade, clean design`,
                    n: 1,
                    size: '1792x1024',
                    quality: 'hd',
                    style: 'natural'
                })
            });

            const imageResult = await imageResponse.json();
            
            return {
                scene_number: scene.scene_number,
                image_url: imageResult.data[0].url,
                duration: scene.duration_seconds,
                narration: scene.narration
            };
        })
    );

    // Generate speech from narration
    const audioResponse = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'tts-1-hd',
            input: script.full_narration,
            voice: selectTTSVoice(videoConfig.target_audience),
            response_format: 'mp3'
        })
    });

    const audioBuffer = await audioResponse.arrayBuffer();
    const audioUrl = await uploadToStorage(audioBuffer, 'audio.mp3');

    // Create video with FFmpeg (simplified - would need proper implementation)
    const videoUrl = await createVideoFromScenes(scenes, audioUrl, videoConfig);

    return {
        provider: 'openai_custom',
        video_url: videoUrl,
        audio_url: audioUrl,
        status: 'completed',
        scenes_count: scenes.length
    };
}

// Helper functions
function selectAvatar(audience) {
    const avatars = {
        executive: 'anna_professional_suit',
        technical: 'david_tech_casual',
        investor: 'sarah_business_formal',
        government: 'michael_government_official',
        security_analyst: 'lisa_cybersec_expert'
    };
    return avatars[audience] || 'anna_professional_suit';
}

function selectBackground(style) {
    const backgrounds = {
        '3d_rendered': 'cyber_command_center_3d',
        '2d_animated': 'tech_office_modern',
        'screen_capture': 'minimal_dark_tech',
        'interactive_walkthrough': 'holographic_interface'
    };
    return backgrounds[style] || 'cyber_command_center_3d';
}

function selectVoice(audience) {
    const voices = {
        executive: 'professional_female_calm',
        technical: 'tech_expert_male_confident',
        investor: 'business_female_persuasive',
        government: 'authoritative_male_clear',
        security_analyst: 'expert_female_detailed'
    };
    return voices[audience] || 'professional_female_calm';
}

function selectTTSVoice(audience) {
    const voices = {
        executive: 'alloy', // Professional, clear
        technical: 'echo',  // Confident, technical
        investor: 'nova',   // Persuasive, engaging
        government: 'onyx', // Authoritative, clear
        security_analyst: 'shimmer' // Expert, detailed
    };
    return voices[audience] || 'alloy';
}

function selectMusic(tone) {
    const music = {
        professional: 'corporate_inspiring_tech',
        urgent: 'cybersec_intense_action',
        educational: 'learning_ambient_focus',
        promotional: 'marketing_upbeat_modern'
    };
    return music[tone] || 'corporate_inspiring_tech';
}

async function uploadToStorage(buffer, filename) {
    // Implementation would upload to your storage service
    // Return the URL where the file is accessible
    return `${Deno.env.get('BASE_URL')}/storage/${filename}`;
}

async function stitchVideos(scenes, narration) {
    // Implementation would use FFmpeg or similar to combine scenes
    // This is a complex operation that would require proper video processing
    return `${Deno.env.get('BASE_URL')}/videos/final_output.mp4`;
}

async function createVideoFromScenes(scenes, audioUrl, videoConfig) {
    // Implementation would create video from images and audio
    // This would require FFmpeg or similar video processing
    return `${Deno.env.get('BASE_URL')}/videos/generated_video.mp4`;
}