// ============================================================================
// Outpost Zero - Azure Infrastructure (Bicep)
// Aligned with Cloud Adoption Framework (CAF) and Well-Architected Framework
// ============================================================================
// Deploy: az deployment group create --resource-group <rg> --template-file main.bicep
// ============================================================================

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Environment name (dev, staging, prod)')
@allowed(['dev', 'staging', 'prod'])
param environment string = 'dev'

@description('Base name for resources')
param baseName string = 'outpostzero'

@description('Microsoft Entra tenant ID for authentication')
param entraTenantId string

@description('Microsoft Entra client ID for the app registration')
param entraClientId string

@description('Enable Application Insights')
param enableAppInsights bool = true

@description('App Service SKU')
@allowed(['B1', 'B2', 'S1', 'S2', 'P1v3', 'P2v3'])
param appServiceSku string = 'B1'

@description('Tags for all resources')
param tags object = {
  Environment: environment
  Application: 'OutpostZero'
  ManagedBy: 'Bicep'
  CostCenter: 'Security'
}

// ============================================================================
// Variables
// ============================================================================

var resourcePrefix = '${baseName}-${environment}'
var appServicePlanName = 'asp-${resourcePrefix}'
var webAppName = 'app-${resourcePrefix}'
var apiAppName = 'api-${resourcePrefix}'
var keyVaultName = 'kv-${take(resourcePrefix, 20)}'
var appInsightsName = 'appi-${resourcePrefix}'
var logAnalyticsName = 'log-${resourcePrefix}'
var storageAccountName = take(replace('st${baseName}${environment}', '-', ''), 24)

// ============================================================================
// Log Analytics Workspace (for Azure Monitor)
// ============================================================================

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsName
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: environment == 'prod' ? 90 : 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

// ============================================================================
// Application Insights
// ============================================================================

resource appInsights 'Microsoft.Insights/components@2020-02-02' = if (enableAppInsights) {
  name: appInsightsName
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

// ============================================================================
// Key Vault (for secrets management)
// ============================================================================

resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: keyVaultName
  location: location
  tags: tags
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enablePurgeProtection: environment == 'prod' ? true : false
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
}

// ============================================================================
// Storage Account (for logs, artifacts)
// ============================================================================

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  tags: tags
  sku: {
    name: environment == 'prod' ? 'Standard_GRS' : 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
}

// ============================================================================
// App Service Plan
// ============================================================================

resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: appServicePlanName
  location: location
  tags: tags
  sku: {
    name: appServiceSku
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// ============================================================================
// Web App (Frontend)
// ============================================================================

resource webApp 'Microsoft.Web/sites@2022-09-01' = {
  name: webAppName
  location: location
  tags: tags
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      alwaysOn: appServiceSku != 'B1'
      http20Enabled: true
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      appSettings: [
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: enableAppInsights ? appInsights.properties.ConnectionString : ''
        }
        {
          name: 'AZURE_TENANT_ID'
          value: entraTenantId
        }
        {
          name: 'AZURE_CLIENT_ID'
          value: entraClientId
        }
      ]
    }
  }
}

// ============================================================================
// API App (Backend)
// ============================================================================

resource apiApp 'Microsoft.Web/sites@2022-09-01' = {
  name: apiAppName
  location: location
  tags: tags
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      alwaysOn: appServiceSku != 'B1'
      http20Enabled: true
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      cors: {
        allowedOrigins: [
          'https://${webAppName}.azurewebsites.net'
        ]
        supportCredentials: true
      }
      appSettings: [
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: enableAppInsights ? appInsights.properties.ConnectionString : ''
        }
        {
          name: 'KEY_VAULT_URI'
          value: keyVault.properties.vaultUri
        }
        {
          name: 'AZURE_TENANT_ID'
          value: entraTenantId
        }
        {
          name: 'AZURE_CLIENT_ID'
          value: entraClientId
        }
      ]
    }
  }
}

// ============================================================================
// Key Vault Access for App Services (RBAC)
// ============================================================================

var keyVaultSecretsUserRole = '4633458b-17de-408a-b874-0445c86b69e6'

resource webAppKeyVaultAccess 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, webApp.id, keyVaultSecretsUserRole)
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', keyVaultSecretsUserRole)
    principalId: webApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

resource apiAppKeyVaultAccess 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, apiApp.id, keyVaultSecretsUserRole)
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', keyVaultSecretsUserRole)
    principalId: apiApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

// ============================================================================
// Diagnostic Settings
// ============================================================================

resource webAppDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'send-to-log-analytics'
  scope: webApp
  properties: {
    workspaceId: logAnalytics.id
    logs: [
      {
        category: 'AppServiceHTTPLogs'
        enabled: true
      }
      {
        category: 'AppServiceConsoleLogs'
        enabled: true
      }
      {
        category: 'AppServiceAppLogs'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}

// ============================================================================
// Outputs
// ============================================================================

output webAppUrl string = 'https://${webApp.properties.defaultHostName}'
output apiAppUrl string = 'https://${apiApp.properties.defaultHostName}'
output keyVaultName string = keyVault.name
output keyVaultUri string = keyVault.properties.vaultUri
output appInsightsConnectionString string = enableAppInsights ? appInsights.properties.ConnectionString : ''
output logAnalyticsWorkspaceId string = logAnalytics.id
output storageAccountName string = storageAccount.name