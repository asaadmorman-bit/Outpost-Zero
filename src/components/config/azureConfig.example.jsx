// Example Azure configuration for Outpost Zero POC
// In production, these values would come from environment variables or Azure Key Vault

export const azureConfigExample = {
  environment: "demo",
  subscriptionId: "00000000-0000-0000-0000-000000000000",
  resourceGroup: "rg-outpost-zero-demo",
  region: "eastus",
  appServiceName: "outpost-zero-web",
  apiServiceName: "outpost-zero-api",
  keyVaultName: "kv-outpost-zero-demo",
  applicationInsightsName: "appi-outpost-zero-demo",
  
  entra: {
    tenantId: "common-or-your-tenant-id",
    clientId: "your-entra-app-client-id",
    redirectUri: "https://yourapp.example.com/auth/callback",
    scopes: ["User.Read", "SecurityEvents.Read.All"]
  },
  
  defender: {
    enableEndpointIntegration: true,
    enableCloudAppsIntegration: true,
    enableIdentityIntegration: true
  },
  
  monitoring: {
    enableAppInsights: true,
    samplingPercentage: 25,
    enableCostManagement: true
  },
  
  marketplace: {
    publisherId: "cyberdojosolutions",
    offerId: "outpost-zero",
    planId: "enterprise"
  }
};

// Helper to get config value with fallback
export function getConfigValue(key, defaultValue) {
  // In production, this would read from environment or Key Vault
  return azureConfigExample[key] || defaultValue;
}