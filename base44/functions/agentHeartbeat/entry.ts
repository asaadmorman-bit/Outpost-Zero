import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

/**
 * Agent Heartbeat Endpoint
 * Deployed agents call this endpoint to report their status
 * 
 * POST /functions/agentHeartbeat
 * Body: {
 *   agent_id: string,
 *   api_key: string,
 *   system_metrics: {...},
 *   agent_metrics: {...},
 *   status: string
 * }
 */

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Parse heartbeat data
        const heartbeatData = await req.json();
        
        const {
            agent_id,
            api_key,
            system_metrics,
            agent_metrics,
            active_threats,
            errors
        } = heartbeatData;

        if (!agent_id || !api_key) {
            return Response.json({ 
                error: 'Missing required fields: agent_id and api_key' 
            }, { status: 400 });
        }

        // Verify agent exists and API key matches
        const agents = await base44.asServiceRole.entities.AgentDeployment.filter({
            agent_id: agent_id
        });

        if (agents.length === 0) {
            return Response.json({ 
                error: 'Agent not found' 
            }, { status: 404 });
        }

        const agent = agents[0];

        // Verify API key (in production, this would be hashed)
        if (agent.api_key !== api_key) {
            return Response.json({ 
                error: 'Invalid API key' 
            }, { status: 401 });
        }

        // Determine agent status based on metrics
        let status = 'healthy';
        if (system_metrics.cpu_percent > 90 || system_metrics.memory_percent > 90) {
            status = 'warning';
        }
        if (active_threats > 0 || (errors && errors.length > 0)) {
            status = 'critical';
        }

        // Create heartbeat record
        await base44.asServiceRole.entities.AgentHeartbeat.create({
            heartbeat_id: `hb_${Date.now()}_${agent_id}`,
            agent_id: agent_id,
            timestamp: new Date().toISOString(),
            status: status,
            system_metrics: system_metrics,
            agent_metrics: agent_metrics,
            active_threats: active_threats || 0,
            configuration_version: agent.agent_version,
            errors: errors || []
        });

        // Update agent last_heartbeat and health_metrics
        await base44.asServiceRole.entities.AgentDeployment.update(agent.id, {
            last_heartbeat: new Date().toISOString(),
            status: active_threats > 0 ? 'degraded' : 'online',
            health_metrics: {
                cpu_usage: system_metrics.cpu_percent,
                memory_usage: system_metrics.memory_percent,
                disk_usage: system_metrics.disk_percent,
                network_latency_ms: system_metrics.network_latency_ms || 0,
                events_per_second: agent_metrics.events_collected / 60, // Approximate
                queue_depth: agent_metrics.queue_size
            }
        });

        // Check if agent needs updates
        const latestVersion = '2.0.0'; // In production, fetch from version registry
        const needsUpdate = agent.agent_version !== latestVersion && agent.auto_update_enabled;

        // Return configuration updates if needed
        return Response.json({
            success: true,
            message: 'Heartbeat received',
            agent_status: status,
            server_time: new Date().toISOString(),
            updates_available: needsUpdate,
            new_version: needsUpdate ? latestVersion : null,
            configuration_changes: false // Could include config updates here
        });

    } catch (error) {
        console.error('Agent heartbeat error:', error);
        return Response.json({ 
            error: error.message,
            details: 'Failed to process agent heartbeat'
        }, { status: 500 });
    }
});