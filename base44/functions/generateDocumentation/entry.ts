import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';
import Anthropic from 'npm:@anthropic-ai/sdk@0.20.0';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { documentation_type, style, include_sections, custom_prompt } = await req.json();

        // Try multiple possible key names
        const apiKey = Deno.env.get("ANTHROPIC_API_KEY") || 
                       Deno.env.get("anthrokeynew") || 
                       Deno.env.get("ANTHROPIC_KEY");
        
        if (!apiKey) {
            const allKeys = Object.keys(Deno.env.toObject());
            return Response.json({ 
                success: false,
                error: 'ANTHROPIC_API_KEY not found in environment variables.',
                debug_info: {
                    checked_names: ['ANTHROPIC_API_KEY', 'anthrokeynew', 'ANTHROPIC_KEY'],
                    available_keys: allKeys,
                    suggestion: 'The secret might be set in the dashboard but not deployed to this function yet.'
                }
            }, { status: 500 });
        }

        const anthropic = new Anthropic({
            apiKey: apiKey,
            timeout: 120000, // 2 minute timeout
        });

        console.log('Using API key:', apiKey.substring(0, 10) + '...');

        // Shorter, more focused system prompt
        const systemPrompt = `You are a documentation expert for Outpost Zero, an enterprise cybersecurity platform by Cyber Dojo Solutions, LLC.

Outpost Zero is a comprehensive SOC platform with: threat detection, incident response, AI advisory, SOAR automation, threat intelligence, user behavior analytics, compliance management (CMMC, RMF, NIST 800-53), attack simulations, quantum-safe security, agent-based monitoring, executive dashboards, and mobile security.

Write clear, professional, actionable documentation for cybersecurity professionals.`;

        let userPrompt = '';

        switch (documentation_type) {
            case 'readme':
                userPrompt = `Generate a concise README.md for Outpost Zero covering: overview, key features, installation, quick start, architecture, deployment options, support info, and licensing.

Style: ${style}
${custom_prompt || ''}`;
                break;

            case 'api_docs':
                userPrompt = `Generate API documentation for Outpost Zero covering: authentication (API keys, JWT), base URLs, key endpoints (events, incidents, threat intel, SOAR, UEBA, compliance), rate limits, error codes, and code examples.

Style: ${style}
${custom_prompt || ''}`;
                break;

            case 'user_guide':
                userPrompt = `Generate a user guide for Outpost Zero covering: getting started, dashboard navigation, incident management, investigations, AI Advisory Center, SOAR playbooks, threat intel setup, UEBA interpretation, compliance controls, alerting, reporting, and best practices.

Target: ${style === 'technical' ? 'SOC analysts' : 'security managers'}
${custom_prompt || ''}`;
                break;

            case 'deployment_guide':
                userPrompt = `Generate a deployment guide for Outpost Zero covering: system requirements, architecture planning, agent deployment methods, agentless monitoring, cloud deployment (AWS/Azure/GCP), on-premise setup, HA configuration, SSL/TLS setup, integrations, initial config, security hardening, and troubleshooting.

Style: ${style}
${custom_prompt || ''}`;
                break;

            case 'admin_guide':
                userPrompt = `Generate an admin guide for Outpost Zero covering: user management, RBAC, org settings, integration management, data sources, retention policies, performance tuning, license management, audit logging, backup/DR, monitoring, updates, security best practices, SSO integration, and API key management.

Style: ${style}
${custom_prompt || ''}`;
                break;

            case 'feature_doc':
                userPrompt = `Generate feature documentation for Outpost Zero covering these features: AI Advisory Center, SOAR platform, Threat Intelligence, UEBA, Incident Response, Compliance Management, Attack Simulations, Quantum-Safe Security, SDK Integration, Agent Deployment, Executive Dashboards.

For each: overview, configuration, usage, best practices, troubleshooting.

Style: ${style}
${custom_prompt || ''}`;
                break;

            case 'integration_guide':
                userPrompt = `Generate integration documentation for Outpost Zero covering: SIEM integrations (Splunk, QRadar, Sentinel), ticketing (Jira, ServiceNow), threat feeds (MISP, TAXII, VirusTotal), IAM/PAM tools, cloud security, endpoint protection, network security, MDM platforms, custom SDKs, and API integration.

Style: ${style}
${custom_prompt || ''}`;
                break;

            case 'compliance_guide':
                userPrompt = `Generate compliance documentation for Outpost Zero covering: supported frameworks (CMMC, RMF, JSIG, NIST 800-53, ISO 27001, SOC 2, HIPAA, PCI DSS), control mapping, evidence collection, compliance dashboard, audit prep, report generation, continuous monitoring, gap analysis, remediation, and certification support.

Style: ${style}
${custom_prompt || ''}`;
                break;

            default:
                userPrompt = custom_prompt || 'Generate comprehensive documentation for Outpost Zero.';
        }

        console.log('Calling Claude API...');

        // Use Claude 3 Haiku with reduced token limit for faster responses
        const message = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 3000, // Reduced for faster generation
            temperature: 0.3,
            system: systemPrompt,
            messages: [
                {
                    role: "user",
                    content: userPrompt
                }
            ]
        });

        const documentation = message.content[0].text;

        console.log('Documentation generated successfully');

        return Response.json({
            success: true,
            documentation,
            metadata: {
                documentation_type,
                style,
                generated_at: new Date().toISOString(),
                word_count: documentation.split(/\s+/).length,
                model: "claude-3-haiku-20240307"
            }
        });

    } catch (error) {
        console.error("Documentation generation error:", error);
        return Response.json({ 
            success: false,
            error: error.message,
            details: error.stack
        }, { status: 500 });
    }
});