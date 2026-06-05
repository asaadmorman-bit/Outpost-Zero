import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
  try {
    // Verify webhook signature
    const signature = req.headers.get('X-Evolv-Signature');
    const webhookSecret = Deno.env.get('EVOLV_WEBHOOK_SECRET');
    
    if (!signature || !webhookSecret) {
      return Response.json(
        { error: 'Missing signature or webhook secret not configured' },
        { status: 401 }
      );
    }

    // Parse incoming Evolv event
    const payload = await req.json();
    
    // Initialize Base44 SDK with service role (webhook doesn't have user context)
    const base44 = createClientFromRequest(req);
    
    // Validate the webhook signature
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(payload));
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );
    
    const expectedSignature = await crypto.subtle.sign('HMAC', key, data);
    const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    if (signature !== expectedSignatureHex) {
      console.error('Invalid webhook signature');
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Process the Evolv event
    const evolvEvent = {
      event_id: payload.event_id || `evt_${Date.now()}`,
      integration_id: payload.venue_id,
      venue_name: payload.venue_name,
      zone_id: payload.zone_id,
      entry_point: payload.entry_point,
      detection_timestamp: payload.timestamp || new Date().toISOString(),
      detection_type: payload.detection_type || 'unknown',
      confidence_score: payload.confidence || 0,
      threat_level: payload.threat_level || 'medium',
      person_info: payload.person_data || {},
      sensor_data: payload.sensor_data || {},
      status: 'detected',
      raw_event_data: payload
    };

    // Create weapon detection event
    const createdEvent = await base44.asServiceRole.entities.WeaponDetectionEvent.create(evolvEvent);

    // Auto-create incident if critical
    if (payload.threat_level === 'critical' || payload.detection_type === 'firearm') {
      const incident = await base44.asServiceRole.entities.Incident.create({
        incident_id: `inc_evolv_${Date.now()}`,
        title: `CRITICAL: ${payload.detection_type.toUpperCase()} Detected at ${payload.venue_name}`,
        description: `Evolv system detected ${payload.detection_type} at ${payload.entry_point}. Confidence: ${payload.confidence}%. Immediate investigation required.`,
        severity: 'critical',
        status: 'open',
        affected_assets: [payload.venue_name, payload.entry_point],
        attack_vector: 'Physical Security Threat',
        first_detected: payload.timestamp || new Date().toISOString()
      });

      // Update event with incident ID
      await base44.asServiceRole.entities.WeaponDetectionEvent.update(createdEvent.id, {
        incident_id: incident.incident_id,
        status: 'incident_created'
      });

      // Create alert
      await base44.asServiceRole.entities.Alert.create({
        alert_id: `alert_evolv_${Date.now()}`,
        alert_type: 'critical_incident',
        severity: 'critical',
        title: `Weapon Detected: ${payload.venue_name}`,
        message: `${payload.detection_type.toUpperCase()} detected at ${payload.entry_point}. Security team notified.`,
        details: payload,
        source: 'Evolv Technology',
        source_id: createdEvent.event_id,
        status: 'new'
      });
    }

    // Send success response back to Evolv
    return Response.json({
      status: 'success',
      event_id: createdEvent.event_id,
      incident_created: payload.threat_level === 'critical'
    }, { status: 200 });

  } catch (error) {
    console.error('Evolv webhook error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});