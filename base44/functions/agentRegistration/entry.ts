import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

/**
 * Agent Registration Endpoint
 * Called when a new agent is installed and needs to register with the server
 * 
 * POST /functions/agentRegistration
 * Body: {
 *   hostname: string,
 *   ip_address: string,
 *   os_type: string,
 *   os_version: string,
 *   agent_version: string,
 *   api_key: string (from installer),
 *   system_info: {...}
 * }
 */

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const registrationData = await req.json();

        const {
            hostname,
            ip_address,
            os_type,
            os_version,
            agent_version,
            api_key,
            system_info,
            deployment_group,
            tags
        } = registrationData;

        if (!hostname || !os_type || !api_key) {
            return Response.json({ 
                error: 'Missing required fields: hostname, os_type, api_key' 
            }, { status: 400 });
        }

        // Generate unique agent ID
        const agent_id = `agent_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        // Check if agent already exists (by hostname)
        const existingAgents = await base44.asServiceRole.entities.AgentDeployment.filter({
            hostname: hostname
        });

        let agent;

        if (existingAgents.length > 0) {
            // Update existing agent
            agent = existingAgents[0];
            await base44.asServiceRole.entities.AgentDeployment.update(agent.id, {
                ip_address: ip_address,
                os_version: os_version,
                agent_version: agent_version,
                status: 'online',
                last_heartbeat: new Date().toISOString(),
                installation_date: new Date().toISOString()
            });
            
            return Response.json({
                success: true,
                message: 'Agent re-registered successfully',
                agent_id: agent.agent_id,
                status: 'updated'
            });
        }

        // Create new agent registration
        agent = await base44.asServiceRole.entities.AgentDeployment.create({
            agent_id: agent_id,
            deployment_type: 'agent_based',
            endpoint_id: agent_id, // Use agent_id as endpoint_id initially
            hostname: hostname,
            ip_address: ip_address || 'unknown',
            os_type: os_type,
            os_version: os_version,
            agent_version: agent_version,
            installation_method: 'manual',
            status: 'online',
            last_heartbeat: new Date().toISOString(),
            heartbeat_interval_seconds: 60,
            configuration: {
                data_collection_enabled: true,
                log_collection: true,
                network_monitoring: true,
                process_monitoring: true,
                file_integrity_monitoring: false,
                behavioral_analysis: true,
                auto_response_enabled: false,
                update_channel: 'stable'
            },
            capabilities: {
                threat_detection: true,
                vulnerability_scanning: false,
                incident_response: true,
                forensics: false,
                isolation: true,
                remediation: false
            },
            deployment_group: deployment_group || 'default',
            tags: tags || [],
            auto_update_enabled: true,
            telemetry_enabled: true,
            encryption_enabled: true,
            communication_protocol: 'https',
            server_url: new URL(req.url).origin,
            api_key: api_key,
            installation_date: new Date().toISOString()
        });

        console.log(`New agent registered: ${agent_id} (${hostname})`);

        return Response.json({
            success: true,
            message: 'Agent registered successfully',
            agent_id: agent_id,
            server_url: new URL(req.url).origin,
            heartbeat_interval_seconds: 60,
            configuration: {
                data_collection_enabled: true,
                log_collection: true,
                network_monitoring: true,
                process_monitoring: true
            }
        });

    } catch (error) {
        console.error('Agent registration error:', error);
        return Response.json({ 
            error: error.message,
            details: 'Failed to register agent'
        }, { status: 500 });
    }
});