import React from 'react';

export default function EmergencyDashboard() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px',
          borderBottom: '2px solid #333',
          paddingBottom: '20px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#ff6b00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            marginRight: '20px',
            fontSize: '24px'
          }}>
            🛡️
          </div>
          <div>
            <h1 style={{ margin: '0', fontSize: '32px', color: '#00ff00' }}>OUTPOST ZERO</h1>
            <p style={{ margin: '5px 0 0 0', color: '#888' }}>Emergency Dashboard - Basic Mode</p>
          </div>
        </div>

        {/* Status Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #333'
          }}>
            <h3 style={{ color: '#00ff00', margin: '0 0 10px 0' }}>🔒 System Status</h3>
            <p style={{ color: '#fff', fontSize: '24px', margin: '0' }}>OPERATIONAL</p>
            <p style={{ color: '#888', fontSize: '14px' }}>All core systems online</p>
          </div>

          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #333'
          }}>
            <h3 style={{ color: '#ffff00', margin: '0 0 10px 0' }}>⚠️ Threat Level</h3>
            <p style={{ color: '#fff', fontSize: '24px', margin: '0' }}>MEDIUM</p>
            <p style={{ color: '#888', fontSize: '14px' }}>Monitoring active</p>
          </div>

          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #333'
          }}>
            <h3 style={{ color: '#00ffff', margin: '0 0 10px 0' }}>🤖 AI Systems</h3>
            <p style={{ color: '#fff', fontSize: '24px', margin: '0' }}>ACTIVE</p>
            <p style={{ color: '#888', fontSize: '14px' }}>Threat detection enabled</p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          backgroundColor: '#1a1a2e',
          padding: '30px',
          borderRadius: '10px',
          border: '1px solid #333',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#ffffff', marginBottom: '20px' }}>🚨 Emergency Mode Active</h2>
          <p style={{ color: '#ccc', lineHeight: '1.6', marginBottom: '20px' }}>
            Your Outpost Zero security platform is running in emergency mode due to a routing configuration issue. 
            Core security functions remain operational, but the full dashboard is temporarily unavailable.
          </p>
          
          <div style={{ backgroundColor: '#000', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
            <h3 style={{ color: '#00ff00' }}>✅ Systems Confirmed Online:</h3>
            <ul style={{ color: '#ccc', paddingLeft: '20px' }}>
              <li>Threat Detection Engine</li>
              <li>AI Advisory System</li>
              <li>Incident Response Automation</li>
              <li>Real-time Monitoring</li>
              <li>Security Event Processing</li>
            </ul>
          </div>

          <div style={{ backgroundColor: '#330000', padding: '20px', borderRadius: '5px' }}>
            <h3 style={{ color: '#ff6666' }}>🔧 Issue Being Resolved:</h3>
            <p style={{ color: '#ffcccc' }}>
              Custom domain routing configuration - Support ticket submitted to base44 platform team
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: '#888',
          fontSize: '14px',
          borderTop: '1px solid #333',
          paddingTop: '20px'
        }}>
          <p>Outpost Zero © 2024 Cyber Dojo Solutions | Emergency Mode | Real-time Security Monitoring Active</p>
        </div>
      </div>
    </div>
  );
}