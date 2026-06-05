import React, { useState, useEffect } from 'react';

export default function DiagnosticTest() {
  const [info, setInfo] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setInfo({
        url: window.location.href,
        hostname: window.location.hostname,
        pathname: window.location.pathname,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        reactVersion: React.version,
        pageLoaded: true
      });
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      padding: '20px',
      fontFamily: 'monospace'
    }}>
      <h1 style={{ color: '#00ff00', marginBottom: '20px' }}>🚨 OUTPOST ZERO - DIAGNOSTIC TEST 🚨</h1>
      
      <div style={{ 
        backgroundColor: '#333', 
        padding: '20px', 
        borderRadius: '5px',
        marginBottom: '20px',
        border: '2px solid #00ff00'
      }}>
        <h2 style={{ color: '#00ff00' }}>✅ React App Successfully Loaded</h2>
        <p>If you can see this page, React is working correctly.</p>
      </div>

      <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3 style={{ color: '#ffff00' }}>🔍 Page Information:</h3>
        <pre style={{ backgroundColor: '#000', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(info, null, 2)}
        </pre>
      </div>

      {error && (
        <div style={{ backgroundColor: '#660000', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
          <h3 style={{ color: '#ff0000' }}>❌ Error Detected:</h3>
          <p>{error}</p>
        </div>
      )}

      <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '5px' }}>
        <h3 style={{ color: '#00ffff' }}>🛠️ Next Steps:</h3>
        <ol style={{ lineHeight: '1.6' }}>
          <li><strong>If you see this page on outpost-zero.com:</strong> React is working, but the routing system has issues</li>
          <li><strong>If you see this page on the base44 domain:</strong> The issue is specific to custom domain configuration</li>
          <li><strong>Share this diagnostic info with base44 support</strong> to help them fix the routing</li>
        </ol>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#000066', borderRadius: '5px' }}>
        <h3 style={{ color: '#ffffff' }}>📧 Copy this info for base44 support:</h3>
        <textarea 
          style={{ 
            width: '100%', 
            height: '200px', 
            backgroundColor: '#000', 
            color: '#00ff00', 
            border: '1px solid #333',
            padding: '10px',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}
          value={`OUTPOST ZERO DIAGNOSTIC REPORT
Generated: ${info.timestamp}

ISSUE: Blank screen after login on custom domain
URL: ${info.url}
Hostname: ${info.hostname}
Path: ${info.pathname}

DIAGNOSIS: React app loads successfully but dashboard/layout system fails
This suggests a routing configuration issue specific to custom domain setup.

REPRODUCTION STEPS:
1. Visit outpost-zero.com
2. Click login/authenticate
3. Expected: Dashboard appears
4. Actual: Blank white screen

TECHNICAL DETAILS:
${JSON.stringify(info, null, 2)}

REQUEST: Please configure custom domain routing to properly serve the application after authentication.`}
          readOnly
        />
      </div>
    </div>
  );
}