// Placeholder for Azure Application Insights integration.
// In the POC, we don't import any SDK to keep the bundle simple and avoid unsupported packages in Base44.
//
// In production, wire this to the official JavaScript SDK for Application Insights and/or OpenTelemetry.
// - Track page views
// - Track API failures
// - Track custom events (e.g., new tenant onboarded, rule created, alert acknowledged)

const isDev = import.meta.env?.DEV ?? false;

export function trackEvent(name, properties) {
  if (isDev) {
    console.log("[telemetry:event]", name, properties || {});
  }
}

export function trackError(error, properties) {
  console.error("[telemetry:error]", error, properties || {});
}

export function trackPageView(pageName, properties) {
  if (isDev) {
    console.log("[telemetry:pageView]", pageName, properties || {});
  }
}

export function trackMetric(name, value, properties) {
  if (isDev) {
    console.log("[telemetry:metric]", name, value, properties || {});
  }
}

// Placeholder for initializing App Insights in production
export function initializeTelemetry(config) {
  console.log("[telemetry:init] Telemetry initialized (placeholder)", config);
  // In production, this would initialize the Application Insights SDK
  // with the connection string from Azure
}