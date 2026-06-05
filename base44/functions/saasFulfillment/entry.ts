// SaaS Fulfillment API Server for Microsoft Commercial Marketplace
// Implements the SaaS Fulfillment API v2 for Azure Marketplace integration
// Reference: https://docs.microsoft.com/en-us/azure/marketplace/partner-center-portal/pc-saas-fulfillment-api-v2

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Microsoft Marketplace API endpoints
const MARKETPLACE_API_BASE = 'https://marketplaceapi.microsoft.com/api';
const MARKETPLACE_API_VERSION = '2018-08-31';

// Token cache for marketplace API authentication
let tokenCache = {
  accessToken: null,
  expiresAt: null
};

/**
 * Get Azure AD token for Marketplace API authentication
 */
async function getMarketplaceToken() {
  // Check cache first
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
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: '20e940b3-4c77-4b0b-9a53-9e16a1b010a7/.default' // Marketplace API resource
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to get marketplace token: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Cache token (expire 5 minutes early)
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000
  };

  return data.access_token;
}

/**
 * Resolve a marketplace subscription token
 */
async function resolveSubscription(marketplaceToken) {
  const token = await getMarketplaceToken();
  
  const response = await fetch(
    `${MARKETPLACE_API_BASE}/saas/subscriptions/resolve?api-version=${MARKETPLACE_API_VERSION}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-ms-marketplace-token': marketplaceToken
      }
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to resolve subscription: ${error}`);
  }

  return await response.json();
}

/**
 * Activate a subscription after successful provisioning
 */
async function activateSubscription(subscriptionId, planId, quantity) {
  const token = await getMarketplaceToken();
  
  const response = await fetch(
    `${MARKETPLACE_API_BASE}/saas/subscriptions/${subscriptionId}/activate?api-version=${MARKETPLACE_API_VERSION}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        planId,
        quantity: quantity || 1
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to activate subscription: ${error}`);
  }

  return { success: true };
}

/**
 * Get subscription details
 */
async function getSubscription(subscriptionId) {
  const token = await getMarketplaceToken();
  
  const response = await fetch(
    `${MARKETPLACE_API_BASE}/saas/subscriptions/${subscriptionId}?api-version=${MARKETPLACE_API_VERSION}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get subscription: ${error}`);
  }

  return await response.json();
}

/**
 * List all available plans for a subscription
 */
async function listAvailablePlans(subscriptionId) {
  const token = await getMarketplaceToken();
  
  const response = await fetch(
    `${MARKETPLACE_API_BASE}/saas/subscriptions/${subscriptionId}/listAvailablePlans?api-version=${MARKETPLACE_API_VERSION}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to list plans: ${error}`);
  }

  return await response.json();
}

/**
 * Update subscription plan
 */
async function changePlan(subscriptionId, planId) {
  const token = await getMarketplaceToken();
  
  const response = await fetch(
    `${MARKETPLACE_API_BASE}/saas/subscriptions/${subscriptionId}?api-version=${MARKETPLACE_API_VERSION}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ planId })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to change plan: ${error}`);
  }

  // Returns operation location header for tracking
  return {
    operationLocation: response.headers.get('Operation-Location'),
    success: true
  };
}

/**
 * Update subscription quantity
 */
async function changeQuantity(subscriptionId, quantity) {
  const token = await getMarketplaceToken();
  
  const response = await fetch(
    `${MARKETPLACE_API_BASE}/saas/subscriptions/${subscriptionId}?api-version=${MARKETPLACE_API_VERSION}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to change quantity: ${error}`);
  }

  return {
    operationLocation: response.headers.get('Operation-Location'),
    success: true
  };
}

/**
 * Cancel/unsubscribe
 */
async function deleteSubscription(subscriptionId) {
  const token = await getMarketplaceToken();
  
  const response = await fetch(
    `${MARKETPLACE_API_BASE}/saas/subscriptions/${subscriptionId}?api-version=${MARKETPLACE_API_VERSION}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete subscription: ${error}`);
  }

  return {
    operationLocation: response.headers.get('Operation-Location'),
    success: true
  };
}

/**
 * Get operation status
 */
async function getOperationStatus(subscriptionId, operationId) {
  const token = await getMarketplaceToken();
  
  const response = await fetch(
    `${MARKETPLACE_API_BASE}/saas/subscriptions/${subscriptionId}/operations/${operationId}?api-version=${MARKETPLACE_API_VERSION}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get operation status: ${error}`);
  }

  return await response.json();
}

/**
 * Update operation status (for webhook acknowledgment)
 */
async function updateOperationStatus(subscriptionId, operationId, status) {
  const token = await getMarketplaceToken();
  
  const response = await fetch(
    `${MARKETPLACE_API_BASE}/saas/subscriptions/${subscriptionId}/operations/${operationId}?api-version=${MARKETPLACE_API_VERSION}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status // 'Success' or 'Failure'
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update operation status: ${error}`);
  }

  return { success: true };
}

/**
 * Provision a new customer in our system
 */
async function provisionCustomer(base44, subscriptionData) {
  // Create or update subscription record
  const existingSubs = await base44.asServiceRole.entities.StripeSubscription.filter({
    marketplace_subscription_id: subscriptionData.id
  });

  const subscriptionRecord = {
    marketplace_subscription_id: subscriptionData.id,
    marketplace_publisher_id: subscriptionData.publisherId,
    marketplace_offer_id: subscriptionData.offerId,
    marketplace_plan_id: subscriptionData.planId,
    purchaser_email: subscriptionData.purchaser?.emailId,
    purchaser_tenant_id: subscriptionData.purchaser?.tenantId,
    beneficiary_email: subscriptionData.beneficiary?.emailId,
    beneficiary_tenant_id: subscriptionData.beneficiary?.tenantId,
    quantity: subscriptionData.quantity,
    status: 'provisioning',
    term_start_date: subscriptionData.term?.startDate,
    term_end_date: subscriptionData.term?.endDate,
    is_free_trial: subscriptionData.isFreeTrial || false,
    is_test: subscriptionData.isTest || false,
    sandbox_type: subscriptionData.sandboxType
  };

  if (existingSubs.length > 0) {
    await base44.asServiceRole.entities.StripeSubscription.update(
      existingSubs[0].id,
      subscriptionRecord
    );
    return existingSubs[0].id;
  } else {
    const newSub = await base44.asServiceRole.entities.StripeSubscription.create(subscriptionRecord);
    return newSub.id;
  }
}

// Main request handler
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const url = new URL(req.url);
    const body = req.method !== 'GET' ? await req.json().catch(() => ({})) : {};
    const { action } = body;

    // Handle different actions
    switch (action) {
      // Landing page redirect - resolve token and provision
      case 'resolve': {
        const { token: marketplaceToken } = body;
        
        if (!marketplaceToken) {
          return Response.json({ error: 'Marketplace token required' }, { status: 400 });
        }

        // Resolve the subscription
        const subscription = await resolveSubscription(marketplaceToken);
        
        // Provision in our system
        const internalId = await provisionCustomer(base44, subscription);
        
        // Activate with Microsoft
        await activateSubscription(subscription.id, subscription.planId, subscription.quantity);
        
        // Update our record to active
        await base44.asServiceRole.entities.StripeSubscription.update(internalId, {
          status: 'active'
        });

        return Response.json({
          success: true,
          subscription,
          internalId,
          redirectUrl: '/dashboard'
        });
      }

      // Get subscription details
      case 'getSubscription': {
        const { subscriptionId } = body;
        const subscription = await getSubscription(subscriptionId);
        return Response.json(subscription);
      }

      // List available plans
      case 'listPlans': {
        const { subscriptionId } = body;
        const plans = await listAvailablePlans(subscriptionId);
        return Response.json(plans);
      }

      // Change plan
      case 'changePlan': {
        const { subscriptionId, planId } = body;
        const result = await changePlan(subscriptionId, planId);
        return Response.json(result);
      }

      // Change quantity
      case 'changeQuantity': {
        const { subscriptionId, quantity } = body;
        const result = await changeQuantity(subscriptionId, quantity);
        return Response.json(result);
      }

      // Cancel subscription
      case 'cancel': {
        const { subscriptionId } = body;
        const result = await deleteSubscription(subscriptionId);
        
        // Update our record
        const subs = await base44.asServiceRole.entities.StripeSubscription.filter({
          marketplace_subscription_id: subscriptionId
        });
        if (subs.length > 0) {
          await base44.asServiceRole.entities.StripeSubscription.update(subs[0].id, {
            status: 'cancelled'
          });
        }
        
        return Response.json(result);
      }

      // Webhook handler for marketplace events
      case 'webhook': {
        const { 
          subscriptionId, 
          operationId, 
          action: webhookAction, 
          planId, 
          quantity,
          status: operationStatus 
        } = body;

        console.log(`Marketplace webhook: ${webhookAction} for ${subscriptionId}`);

        // Process based on webhook action
        switch (webhookAction) {
          case 'ChangePlan':
            // Customer changed plan - update our records
            await base44.asServiceRole.entities.StripeSubscription.filter({
              marketplace_subscription_id: subscriptionId
            }).then(async (subs) => {
              if (subs.length > 0) {
                await base44.asServiceRole.entities.StripeSubscription.update(subs[0].id, {
                  marketplace_plan_id: planId
                });
              }
            });
            break;

          case 'ChangeQuantity':
            // Customer changed quantity
            await base44.asServiceRole.entities.StripeSubscription.filter({
              marketplace_subscription_id: subscriptionId
            }).then(async (subs) => {
              if (subs.length > 0) {
                await base44.asServiceRole.entities.StripeSubscription.update(subs[0].id, {
                  quantity
                });
              }
            });
            break;

          case 'Unsubscribe':
            // Customer cancelled
            await base44.asServiceRole.entities.StripeSubscription.filter({
              marketplace_subscription_id: subscriptionId
            }).then(async (subs) => {
              if (subs.length > 0) {
                await base44.asServiceRole.entities.StripeSubscription.update(subs[0].id, {
                  status: 'cancelled'
                });
              }
            });
            break;

          case 'Suspend':
            // Subscription suspended (payment issues)
            await base44.asServiceRole.entities.StripeSubscription.filter({
              marketplace_subscription_id: subscriptionId
            }).then(async (subs) => {
              if (subs.length > 0) {
                await base44.asServiceRole.entities.StripeSubscription.update(subs[0].id, {
                  status: 'suspended'
                });
              }
            });
            break;

          case 'Reinstate':
            // Subscription reinstated after suspension
            await base44.asServiceRole.entities.StripeSubscription.filter({
              marketplace_subscription_id: subscriptionId
            }).then(async (subs) => {
              if (subs.length > 0) {
                await base44.asServiceRole.entities.StripeSubscription.update(subs[0].id, {
                  status: 'active'
                });
              }
            });
            break;

          case 'Renew':
            // Subscription renewed
            console.log(`Subscription ${subscriptionId} renewed`);
            break;
        }

        // Acknowledge the operation
        if (operationId) {
          await updateOperationStatus(subscriptionId, operationId, 'Success');
        }

        return Response.json({ success: true });
      }

      // Get operation status
      case 'operationStatus': {
        const { subscriptionId, operationId } = body;
        const status = await getOperationStatus(subscriptionId, operationId);
        return Response.json(status);
      }

      default:
        return Response.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('SaaS Fulfillment error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});