export default function EmergencyTest() {
  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#000000', 
      color: '#00ff00', 
      minHeight: '100vh',
      fontFamily: 'monospace'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>🚨 EMERGENCY TEST PAGE</h1>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>✅ If you can see this text, React is working!</p>
      <p style={{ fontSize: '16px', color: '#ffff00' }}>Current time: {new Date().toISOString()}</p>
      <p style={{ fontSize: '16px', color: '#ffff00' }}>Location: {typeof window !== 'undefined' ? window.location.href : 'unknown'}</p>
      
      <div style={{ marginTop: '30px', padding: '20px', border: '2px solid #00ff00', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Test Results:</h2>
        <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
          <div>✓ React: WORKING</div>
          <div>✓ JavaScript: WORKING</div>
          <div>✓ Page Routing: WORKING</div>
          <div>✓ Inline Styles: WORKING</div>
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#111111', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#ff6600' }}>NEXT STEPS:</h3>
        <ol style={{ fontSize: '14px', lineHeight: '2', paddingLeft: '20px' }}>
          <li>Take a screenshot of this page</li>
          <li>Press F12 and check console for ANY red errors</li>
          <li>Try navigating to: /Dashboard</li>
          <li>Report back what happens</li>
        </ol>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#330000', border: '1px solid #ff0000', borderRadius: '8px' }}>
        <p style={{ fontSize: '14px', color: '#ff6666' }}>
          <strong>IF YOU SEE THIS:</strong> Your app CAN render React components. 
          The white screen issue is in the Layout or Dashboard components specifically.
        </p>
      </div>
    </div>
  );
}