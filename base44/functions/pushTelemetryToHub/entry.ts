import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Build ThreatEvent payload matching the schema
    const payload = {
      timestamp: new Date().toISOString(),
      source_tool: 'Wazuh/OutpostZero',
      threat_score: 85,
      mitre_tactic: 'TA0001',
      mitre_tactic_name: 'Initial Access',
      mitre_technique: 'T1190',
      mitre_technique_name: 'Exploit Public-Facing Application',
      severity: 'high',
      event_type: 'intrusion_attempt',
      description: 'Compromised IoT gateway detected attempting initial access via exploitation of public-facing MQTT broker (CVE-2024-1337). Autonomous containment initiated.',
      source_ip: '203.0.113.47',
      destination_ip: '10.0.4.22',
      affected_asset: 'iot-gateway-prod-04',
      asset_type: 'IoT Gateway',
      location_data: {
        country: 'RU',
        region: 'Moscow Oblast',
        city: 'Khimki',
        latitude: 55.8894,
        longitude: 37.4306,
        isp: 'JSC Aeroflot',
        asn: 'AS25513',
      },
      indicators: [
        '203.0.113.47',
        'mqtt.malicious-c2.example.com',
        'sha256:a3f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
      ],
      response_actions: [
        'network_isolation',
        'firewall_rule_deployed',
        'alert_generated',
      ],
      autonomous_response: true,
      ttd_ms: 91,
      ecosystem: 'CyberDojo',
      originating_app: 'OutpostZero_PHDHub',
      researcher_note: 'PhD Research — The Sentinel Ecosystem. Simulated event for hub interoperability demonstration.',
    };

    // Change to https://asosint.io when deploying to live staging
    const HUB_API_URL = Deno.env.get('NEXT_PUBLIC_HUB_API_URL') || 'https://asosint.io';
    const response = await fetch(`${HUB_API_URL}/api/ingest-telemetry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source-App': 'OutpostZero',
        'X-Ecosystem': 'CyberDojo',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    return Response.json({
      success: response.ok,
      status: response.status,
      payload_sent: payload,
      hub_response: responseData,
      dispatched_at: new Date().toISOString(),
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});