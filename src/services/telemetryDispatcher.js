import fetch from 'node-fetch';

const targetUrl = process.env.THYREOS_ENDPOINT_INGEST_URL;
const machineToken = process.env.THYREOS_MACHINE_AUTH_TOKEN;

export async function dispatchEndpointTelemetry(telemetryPayload) {
  console.log(`[OUTPOST ZERO] Streaming process telemetry to THYREOS: ${targetUrl}`);
  
  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${machineToken}`
      },
      body: JSON.stringify(telemetryPayload)
    });

    if (response.ok) {
      console.log("[OUTPOST ZERO] Endpoint telemetry successfully ingested.");
    } else {
      console.error("[OUTPOST ZERO] THYREOS rejected payload. Status:", response.status);
    }
  } catch (error) {
    console.error("[OUTPOST ZERO] Connection to THYREOS failed:", error.message);
  }
}

// 🎯 SCENARIO TRIGGER: Run this to simulate the breach during the demo
/*
dispatchEndpointTelemetry({
  host: "GlobalTech-DC01",
  process: "powershell.exe",
  path: "C:\\Windows\\System32\\cmd.exe /c powershell.exe -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAAgAEkATwAuAE0AZQBtAG8AcgB5AFMAdAByAGUAYQBtACgAWwBDAG8AbgB2AGUAcgB0AF0AOgA6AEYAcgBvAG0AQgBhAHMAZQA2ADQAUwB0AHIAaQBuAGcAKAAiAEgA...",
  integrity: "CRITICAL_COMPROMISE",
  user: "SYSTEM"
});
*/