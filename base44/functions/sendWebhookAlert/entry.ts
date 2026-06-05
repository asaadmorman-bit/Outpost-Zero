import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify authentication
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { alert, config } = await req.json();

    if (!alert || !config) {
      return Response.json({ 
        error: 'Missing required parameters: alert and config' 
      }, { status: 400 });
    }

    let result;

    switch (config.webhook_type) {
      case 'slack':
        result = await sendSlackAlert(alert, config);
        break;
      case 'pagerduty':
        result = await sendPagerDutyAlert(alert, config);
        break;
      case 'teams':
        result = await sendTeamsAlert(alert, config);
        break;
      case 'webhook':
        result = await sendGenericWebhook(alert, config);
        break;
      case 'email':
        result = await sendEmailAlert(alert, config, base44);
        break;
      default:
        return Response.json({ 
          error: `Unsupported webhook type: ${config.webhook_type}` 
        }, { status: 400 });
    }

    // Update config with last triggered time
    await base44.asServiceRole.entities.AlertConfiguration.update(config.id, {
      last_triggered: new Date().toISOString(),
      alerts_sent_today: (config.alerts_sent_today || 0) + 1
    });

    return Response.json({ 
      success: true, 
      webhook_type: config.webhook_type,
      result 
    });

  } catch (error) {
    console.error('Webhook alert error:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});

async function sendSlackAlert(alert, config) {
  const severityEmoji = {
    critical: '🚨',
    high: '⚠️',
    medium: '⚡',
    low: 'ℹ️'
  };

  const severityColor = {
    critical: '#dc2626',
    high: '#ea580c',
    medium: '#eab308',
    low: '#3b82f6'
  };

  const slackMessage = {
    channel: config.configuration?.channel,
    username: 'Outpost Zero Security',
    icon_emoji: ':shield:',
    attachments: [{
      color: severityColor[alert.severity] || '#3b82f6',
      title: `${severityEmoji[alert.severity]} ${alert.title}`,
      text: alert.message,
      fields: [
        {
          title: 'Severity',
          value: alert.severity.toUpperCase(),
          short: true
        },
        {
          title: 'Source',
          value: alert.source || 'Unknown',
          short: true
        },
        {
          title: 'Alert Type',
          value: alert.alert_type.replace(/_/g, ' '),
          short: true
        },
        {
          title: 'Time',
          value: new Date().toLocaleString(),
          short: true
        }
      ],
      footer: 'Outpost Zero Security Platform',
      ts: Math.floor(Date.now() / 1000)
    }]
  };

  // Add details if enabled
  if (config.configuration?.include_details && alert.details) {
    slackMessage.attachments[0].fields.push({
      title: 'Details',
      value: JSON.stringify(alert.details, null, 2),
      short: false
    });
  }

  const response = await fetch(config.webhook_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slackMessage)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Slack API error: ${response.status} - ${errorText}`);
  }

  return { status: 'sent', platform: 'slack' };
}

async function sendPagerDutyAlert(alert, config) {
  const pagerDutyEvent = {
    routing_key: config.webhook_url.split('/').pop(), // Extract routing key from URL
    event_action: 'trigger',
    payload: {
      summary: alert.title,
      severity: alert.severity,
      source: 'Outpost Zero',
      custom_details: {
        message: alert.message,
        alert_type: alert.alert_type,
        alert_id: alert.alert_id,
        details: alert.details
      }
    }
  };

  const response = await fetch('https://events.pagerduty.com/v2/enqueue', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(pagerDutyEvent)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PagerDuty API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return { status: 'sent', platform: 'pagerduty', dedup_key: result.dedup_key };
}

async function sendTeamsAlert(alert, config) {
  const severityColor = {
    critical: 'attention',
    high: 'warning',
    medium: 'good',
    low: 'accent'
  };

  const teamsMessage = {
    '@type': 'MessageCard',
    '@context': 'https://schema.org/extensions',
    summary: alert.title,
    themeColor: severityColor[alert.severity] === 'attention' ? 'FF0000' :
                severityColor[alert.severity] === 'warning' ? 'FFA500' : '0078D7',
    sections: [{
      activityTitle: `🛡️ ${alert.title}`,
      activitySubtitle: `Severity: ${alert.severity.toUpperCase()}`,
      facts: [
        {
          name: 'Message',
          value: alert.message
        },
        {
          name: 'Source',
          value: alert.source || 'Unknown'
        },
        {
          name: 'Alert Type',
          value: alert.alert_type.replace(/_/g, ' ')
        },
        {
          name: 'Time',
          value: new Date().toLocaleString()
        }
      ]
    }]
  };

  const response = await fetch(config.webhook_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teamsMessage)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Teams API error: ${response.status} - ${errorText}`);
  }

  return { status: 'sent', platform: 'teams' };
}

async function sendGenericWebhook(alert, config) {
  const webhookPayload = {
    event: 'security_alert',
    timestamp: new Date().toISOString(),
    alert: {
      id: alert.alert_id,
      type: alert.alert_type,
      severity: alert.severity,
      title: alert.title,
      message: alert.message,
      source: alert.source,
      details: alert.details
    }
  };

  const response = await fetch(config.webhook_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webhookPayload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Webhook error: ${response.status} - ${errorText}`);
  }

  return { status: 'sent', platform: 'generic_webhook' };
}

async function sendEmailAlert(alert, config, base44) {
  // Use Base44's built-in email integration
  const emailBody = `
Security Alert from Outpost Zero

Title: ${alert.title}
Severity: ${alert.severity.toUpperCase()}
Message: ${alert.message}

Source: ${alert.source || 'Unknown'}
Alert Type: ${alert.alert_type.replace(/_/g, ' ')}
Time: ${new Date().toLocaleString()}

${alert.details ? `\nDetails:\n${JSON.stringify(alert.details, null, 2)}` : ''}

---
This is an automated alert from Outpost Zero Security Platform
  `;

  await base44.integrations.Core.SendEmail({
    to: config.webhook_url, // Use webhook_url as email address
    subject: `🚨 Security Alert: ${alert.title}`,
    body: emailBody,
    from_name: 'Outpost Zero Security'
  });

  return { status: 'sent', platform: 'email' };
}