// Microsoft Defender API Client
// Backend function for integrating with Microsoft Defender for Endpoint, Cloud, and Identity
// Reference: https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/apis-intro

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Microsoft Graph Security API endpoints
const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';
const GRAPH_SECURITY_BASE = 'https://graph.microsoft.com/v1.0/security';

// Token cache
let tokenCache = {
  accessToken: null,
  expiresAt: null
};

/**
 * Get Azure AD token for Microsoft Graph Security API
 */
async function getGraphToken() {
  if (tokenCache.accessToken && tokenCache.expiresAt > Date.now()) {
    return tokenCache.accessToken;
  }

  const tenantId = Deno.env.get('AZURE_TENANT_ID');
  const clientId = Deno.env.get('AZURE_CLIENT_ID');
  const clientSecret = Deno.env.get('AZURE_CLIENT_SECRET');

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('Azure AD credentials not configured');
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'https://graph.microsoft.com/.default'
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to get Graph token: ${response.statusText}`);
  }

  const data = await response.json();
  
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000
  };

  return data.access_token;
}

/**
 * List security alerts from Microsoft Defender
 */
async function listAlerts(filter = {}) {
  const token = await getGraphToken();
  
  let url = `${GRAPH_SECURITY_BASE}/alerts_v2`;
  const params = new URLSearchParams();
  
  if (filter.severity) params.append('$filter', `severity eq '${filter.severity}'`);
  if (filter.top) params.append('$top', filter.top);
  if (filter.status) params.append('$filter', `status eq '${filter.status}'`);
  
  if (params.toString()) url += `?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to list alerts: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Get specific alert by ID
 */
async function getAlert(alertId) {
  const token = await getGraphToken();
  
  const response = await fetch(`${GRAPH_SECURITY_BASE}/alerts_v2/${alertId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get alert: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Update alert status
 */
async function updateAlert(alertId, updates) {
  const token = await getGraphToken();
  
  const response = await fetch(`${GRAPH_SECURITY_BASE}/alerts_v2/${alertId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    throw new Error(`Failed to update alert: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * List incidents from Microsoft 365 Defender
 */
async function listIncidents(filter = {}) {
  const token = await getGraphToken();
  
  let url = `${GRAPH_SECURITY_BASE}/incidents`;
  const params = new URLSearchParams();
  
  if (filter.status) params.append('$filter', `status eq '${filter.status}'`);
  if (filter.top) params.append('$top', filter.top);
  
  if (params.toString()) url += `?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to list incidents: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Get secure score
 */
async function getSecureScore() {
  const token = await getGraphToken();
  
  const response = await fetch(`${GRAPH_SECURITY_BASE}/secureScores?$top=1`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get secure score: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Run hunting query (Advanced Hunting)
 */
async function runHuntingQuery(query) {
  const token = await getGraphToken();
  
  const response = await fetch(`${GRAPH_SECURITY_BASE}/runHuntingQuery`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ Query: query })
  });

  if (!response.ok) {
    throw new Error(`Failed to run hunting query: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Isolate a machine (Defender for Endpoint)
 */
async function isolateMachine(machineId, comment = 'Isolated via Outpost Zero') {
  const token = await getGraphToken();
  
  const response = await fetch(
    `https://api.securitycenter.microsoft.com/api/machines/${machineId}/isolate`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Comment: comment,
        IsolationType: 'Full'
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to isolate machine: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Release machine from isolation
 */
async function unisolateMachine(machineId, comment = 'Released via Outpost Zero') {
  const token = await getGraphToken();
  
  const response = await fetch(
    `https://api.securitycenter.microsoft.com/api/machines/${machineId}/unisolate`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Comment: comment })
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to unisolate machine: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Get threat intelligence indicators
 */
async function getThreatIndicators(filter = {}) {
  const token = await getGraphToken();
  
  let url = `${GRAPH_SECURITY_BASE}/tiIndicators`;
  if (filter.top) url += `?$top=${filter.top}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get threat indicators: ${response.statusText}`);
  }

  return await response.json();
}

// Main request handler
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    // Verify user authentication
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { action } = body;

    switch (action) {
      case 'listAlerts': {
        const { filter } = body;
        const alerts = await listAlerts(filter);
        return Response.json(alerts);
      }

      case 'getAlert': {
        const { alertId } = body;
        const alert = await getAlert(alertId);
        return Response.json(alert);
      }

      case 'updateAlert': {
        const { alertId, updates } = body;
        const result = await updateAlert(alertId, updates);
        return Response.json(result);
      }

      case 'listIncidents': {
        const { filter } = body;
        const incidents = await listIncidents(filter);
        return Response.json(incidents);
      }

      case 'getSecureScore': {
        const score = await getSecureScore();
        return Response.json(score);
      }

      case 'runHuntingQuery': {
        const { query } = body;
        const results = await runHuntingQuery(query);
        return Response.json(results);
      }

      case 'isolateMachine': {
        const { machineId, comment } = body;
        const result = await isolateMachine(machineId, comment);
        return Response.json(result);
      }

      case 'unisolateMachine': {
        const { machineId, comment } = body;
        const result = await unisolateMachine(machineId, comment);
        return Response.json(result);
      }

      case 'getThreatIndicators': {
        const { filter } = body;
        const indicators = await getThreatIndicators(filter);
        return Response.json(indicators);
      }

      default:
        return Response.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Defender Client error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});