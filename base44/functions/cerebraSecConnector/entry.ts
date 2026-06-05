import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';

// Cross-platform connector to sync data between CerebraSec and Outpost Zero
Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { action, data } = body;

        switch (action) {
            case 'sync_threat_intel':
                return await syncThreatIntelligence(base44, data);
            case 'sync_user_behavior':
                return await syncUserBehavior(base44, data);
            case 'sync_incidents':
                return await syncIncidents(base44, data);
            case 'cross_validate_threats':
                return await crossValidateThreats(base44, data);
            default:
                return Response.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('CerebraSec connector error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});

async function syncThreatIntelligence(base44, data) {
    // Sync threat intelligence from CerebraSec to Outpost Zero
    const { threats } = data;
    
    const syncedThreats = [];
    
    for (const threat of threats) {
        const outpostThreat = {
            indicator: threat.neural_indicator,
            indicator_type: threat.type,
            threat_type: threat.category,
            confidence: threat.neural_confidence,
            source: 'cerebrasec_neural',
            description: `Neural network detection: ${threat.description}`,
            first_seen: threat.detected_at,
            last_seen: threat.last_active,
            tags: [...(threat.tags || []), 'neural_detected', 'cerebrasec'],
            mitre_techniques: threat.mitre_mapping || []
        };

        const created = await base44.entities.ThreatIntelligence.create(outpostThreat);
        syncedThreats.push(created);
    }

    // Also call CerebraSec API to send Outpost Zero threats
    await sendTocerebraSec('/api/v1/threats/sync', {
        source: 'outpost_zero',
        threats: syncedThreats.map(t => ({
            id: t.id,
            indicator: t.indicator,
            confidence: t.confidence,
            source: 'outpost_behavioral'
        }))
    });

    return Response.json({
        success: true,
        synced_threats: syncedThreats.length,
        message: 'Threat intelligence synchronized between platforms'
    });
}

async function syncUserBehavior(base44, data) {
    // Sync user behavior analytics between platforms
    const { behaviors } = data;
    
    for (const behavior of behaviors) {
        const outpostBehavior = {
            user_id: behavior.user_id,
            activity_type: behavior.activity,
            timestamp: behavior.timestamp,
            source_ip: behavior.source_ip,
            device_type: behavior.device_info?.type || 'unknown',
            location: behavior.location,
            anomaly_score: behavior.neural_anomaly_score,
            baseline_deviation: behavior.deviation_score,
            risk_factors: behavior.risk_indicators || [],
            normal_pattern: behavior.neural_anomaly_score < 30,
            details: {
                cerebrasec_analysis: behavior.neural_analysis,
                confidence: behavior.confidence
            }
        };

        await base44.entities.UserBehavior.create(outpostBehavior);
    }

    return Response.json({
        success: true,
        synced_behaviors: behaviors.length
    });
}

async function syncIncidents(base44, data) {
    // Create cross-platform incident correlation
    const { incident } = data;
    
    const outpostIncident = {
        incident_id: `cerebra_${incident.id}`,
        title: `Cross-Platform Alert: ${incident.title}`,
        description: `Neural analysis from CerebraSec: ${incident.description}`,
        severity: mapSeverity(incident.neural_severity),
        status: 'investigating',
        assigned_to: incident.assigned_analyst,
        affected_assets: incident.affected_systems || [],
        attack_vector: incident.attack_vector,
        mitre_tactics: incident.mitre_tactics || [],
        timeline: [{
            timestamp: incident.created_at,
            action: 'Neural Detection',
            details: 'Initial detection by CerebraSec neural network'
        }],
        soar_playbook: 'cross_platform_investigation'
    };

    const created = await base44.entities.Incident.create(outpostIncident);

    return Response.json({
        success: true,
        outpost_incident_id: created.id,
        cerebrasec_incident_id: incident.id
    });
}

async function crossValidateThreats(base44, data) {
    // Cross-validate threats between both platforms
    const { threat_id } = data;
    
    // Get threat from Outpost Zero
    const outpostThreat = await base44.entities.ThreatIntelligence.filter({
        indicator: threat_id
    });

    if (outpostThreat.length === 0) {
        return Response.json({
            validated: false,
            message: 'Threat not found in Outpost Zero database'
        });
    }

    // Send to CerebraSec for neural validation
    const cerebraResponse = await sendTocerebraSec('/api/v1/threats/validate', {
        indicator: threat_id,
        context: outpostThreat[0]
    });

    const validated = cerebraResponse.neural_confidence > 85;

    if (validated) {
        // Update threat with cross-validation
        await base44.entities.ThreatIntelligence.update(outpostThreat[0].id, {
            confidence: Math.min(100, outpostThreat[0].confidence + 15),
            tags: [...outpostThreat[0].tags, 'neural_validated'],
            description: `${outpostThreat[0].description} [Cross-validated by CerebraSec neural analysis]`
        });
    }

    return Response.json({
        validated,
        neural_confidence: cerebraResponse.neural_confidence,
        cross_platform_score: validated ? 95 : 60
    });
}

async function sendTocerebraSec(endpoint, data) {
    // Mock function - in reality, this would call the actual CerebraSec API
    const response = await fetch(`https://cerebrasec.base44.app${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('CEREBRASEC_API_KEY')}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`CerebraSec API error: ${response.statusText}`);
    }

    return await response.json();
}

function mapSeverity(neuralSeverity) {
    // Map CerebraSec neural severity to Outpost Zero severity
    const severityMap = {
        'neural_critical': 'critical',
        'neural_high': 'high',
        'neural_medium': 'medium',
        'neural_low': 'low'
    };
    return severityMap[neuralSeverity] || 'medium';
}