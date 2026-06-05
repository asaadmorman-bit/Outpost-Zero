// Azure Bicep infrastructure template for Outpost Zero
// Stored as a plain string to avoid linter parse errors from Bicep syntax

const mainBicepTemplate = [
  "// OUTPOST ZERO - AZURE ARCHITECTURE BICEP TEMPLATE",
  "// Microsoft ISV Success Program - April 2026 GTM Target",
  "",
  "param location string = resourceGroup().location",
  "param namePrefix string = 'ozdemo'",
  "param appServiceSku string = 'B1'",
  "",
  "var appInsightsName = '${namePrefix}-appi'",
  "var logAnalyticsName = '${namePrefix}-law'",
  "var kvName = '${namePrefix}-kv'",
  "var planName = '${namePrefix}-plan'",
  "var frontendName = '${namePrefix}-web'",
  "var apiName = '${namePrefix}-api'",
  "var sqlServerName = '${namePrefix}-sql'",
  "var sqlDbName = '${namePrefix}-db'",
].join('\n');

export { mainBicepTemplate };
export default mainBicepTemplate;