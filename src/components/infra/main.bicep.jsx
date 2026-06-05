
// Infrastructure as Code - Azure Bicep Template
// This file exports the Bicep template content for reference in the app

export const mainBicepTemplate = `
  // ==========================================================================
  // OUTPOST ZERO – AZURE ARCHITECTURE BICEP TEMPLATE
  // Microsoft ISV Success Program – April 2026 GTM Target
  // Full production version due 90 days post-launch (July 2026)
  // 
  // This template is structured according to the:
  // - Microsoft Cloud Adoption Framework (CAF)
  // - Azure Well-Architected Framework (WAF)
  // - Microsoft Responsible AI Principles
  // - Zero Trust Architecture Guide
  // - Microsoft Commercial Marketplace SaaS Fulfillment Requirements
  // - Microsoft Defender & Entra Integration Best Practices
  //
  // This Bicep file is intentionally divided into clear architectural layers:
  // 1. Observability & Logging (Log Analytics + App Insights)
  // 2. Security Foundation (Key Vault + Managed Identity)
  // 3. Frontend (React App on App Service or Static Web Apps)
  // 4. API Layer (App Service / Container Apps / AKS)
  // 5. Data Layer (Azure SQL / Cosmos)
  // 6. SaaS Offer Integration (Marketplace Fulfillment API endpoints)
  // ==========================================================================

  @description('Azure region for deployment.')
  param location string = resourceGroup().location

  @description('Resource name prefix to ensure uniqueness.')
  param namePrefix string = 'ozdemo'

  // --------------------------------------------------------------------------
  // Azure Well-Architected – Cost Optimization
  // SKU selection intentionally defaults to a low-cost option.
  // --------------------------------------------------------------------------
  @description('App Service plan SKU aligned with cost-optimized development environments.')
  @allowed([
    'F1'   // Free Tier (dev/test only)
    'B1'   // Basic Tier
    'P1v3' // Production, scale-ready
  ])
  param appServiceSku string = 'B1'

  // Name variables
  var appInsightsName = '\${namePrefix}-appi'
  var logAnalyticsName = '\${namePrefix}-law'
  var kvName = '\${namePrefix}-kv'
  var planName = '\${namePrefix}-plan'
  var frontendName = '\${namePrefix}-web'
  var apiName = '\${namePrefix}-api'
  var sqlServerName = '\${namePrefix}-sql'
  var sqlDbName = '\${namePrefix}-db'

  // ==========================================================================
  // 1. OBSERVABILITY LAYER – Azure Monitor + Log Analytics
  // --------------------------------------------------------------------------
  // CAF – Manage / Secure: Enables continuous monitoring, insights, alerts
  // WAF – Operational Excellence: Logging, telemetry, diagnostics
  // Marketplace – Mandatory for production ISV apps
  // ==========================================================================
  resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
    name: logAnalyticsName
    location: location
    sku: {
      name: 'PerGB2018'
    }
    properties: {
      retentionInDays: 30 // WAF Cost Optimization: Retention tuned for dev/test
    }
  }

  resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
    name: appInsightsName
    location: location
    kind: 'web'
    properties: {
      Application_Type: 'web'
      WorkspaceResourceId: logAnalytics.id
    }
  }

  // ==========================================================================
  // 2. SECURITY FOUNDATION – Key Vault + Managed Identity
  // --------------------------------------------------------------------------
  // Zero Trust – Protect secrets, enforce explicit verification
  // CAF Secure – Key Vault used for secrets, keys, certificates
  // WAF Security – No secrets in code or App Settings
  // ==========================================================================
  resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' = {
    name: kvName
    location: location
    properties: {
      tenantId: subscription().tenantId
      sku: {
        family: 'A'
        name: 'standard'
      }
      enableRbacAuthorization: true // Zero Trust: RBAC over ACL policies
      publicNetworkAccess: 'Enabled' // Production may toggle to Private Endpoints
      softDeleteRetentionInDays: 7
    }
  }

  // ==========================================================================
  // 3. COMPUTE – App Service Plan
  // --------------------------------------------------------------------------
  // CAF Ready – Landing zone-compatible compute foundation
  // WAF Reliability – Supports scaling and zoning
  // ==========================================================================
  resource plan 'Microsoft.Web/serverfarms@2022-09-01' = {
    name: planName
    location: location
    sku: {
      name: appServiceSku
      tier: contains(['F1', 'B1'], appServiceSku) ? 'Basic' : 'PremiumV3'
      size: appServiceSku
      capacity: 1
    }
  }

  // ==========================================================================
  // 4. FRONTEND – Outpost Zero Web UI (React/Vite)
  // --------------------------------------------------------------------------
  // Marketplace – Required customer-facing SaaS management UI
  // Zero Trust – Entra ID OIDC login enforced in production
  // WAF Performance – CDN-friendly static hosting
  // ==========================================================================
  resource web 'Microsoft.Web/sites@2022-09-01' = {
    name: frontendName
    location: location
    identity: {
      type: 'SystemAssigned' // Used for Key Vault & App Insights
    }
    properties: {
      serverFarmId: plan.id
      httpsOnly: true // Zero Trust Requirement
      siteConfig: {
        appSettings: [
          // Observability
          {
            name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
            value: appInsights.properties.ConnectionString
          }
          // Production will include OIDC config & API base URL
        ]
      }
    }
  }

  // ==========================================================================
  // 5. API LAYER – Stateless Backend
  // --------------------------------------------------------------------------
  // CAF Secure – API handles multi-tenant partitioning
  // WAF Reliability – Scalable stateless design
  // Marketplace – SaaS Fulfillment webhooks implemented here
  // ==========================================================================
  resource api 'Microsoft.Web/sites@2022-09-01' = {
    name: apiName
    location: location
    identity: {
      type: 'SystemAssigned'
    }
    properties: {
      serverFarmId: plan.id
      httpsOnly: true
      siteConfig: {
        appSettings: [
          {
            name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
            value: appInsights.properties.ConnectionString
          }
          {
            name: 'WEBSITE_RUN_FROM_PACKAGE'
            value: '1'
          }
        ]
      }
    }
  }

  // ==========================================================================
  // 6. DATA LAYER – Azure SQL Database / Cosmos DB Alternative
  // --------------------------------------------------------------------------
  // CAF Govern – Data residency & classification policies
  // WAF Security – Encryption at rest & TDE
  // Marketplace – Tenant data partitioning required
  // ==========================================================================
  resource sqlServer 'Microsoft.Sql/servers@2021-11-01-preview' = {
    name: sqlServerName
    location: location
    properties: {
      administratorLogin: 'sqladminuser'
      administratorLoginPassword: 'ChangeThisPassword123!' // Placeholder; replaced with KV reference in production
    }
  }

  resource sqlDb 'Microsoft.Sql/servers/databases@2021-11-01-preview' = {
    name: '\${sqlServer.name}/\${sqlDbName}'
    location: location
    sku: {
      name: 'GP_S_Gen5_2'
      tier: 'GeneralPurpose'
      capacity: 2
    }
    properties: {
      maxSizeBytes: 268435456000
    }
  }

  // ==========================================================================
  // OUTPUTS – Used by CI/CD + Entra + Marketplace Fulfillment Setup
  // ==========================================================================
  output frontendUrl string = 'https://\${web.name}.azurewebsites.net'
  output apiUrl string = 'https://\${api.name}.azurewebsites.net'
  output appInsightsConnectionString string = appInsights.properties.ConnectionString
  output keyVaultName string = keyVault.name
  output sqlServerHost string = '\${sqlServer.name}.database.windows.net'
  output sqlDatabaseName string = sqlDbName
`;

export default mainBicepTemplate;
