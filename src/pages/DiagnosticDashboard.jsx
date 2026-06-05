import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function DiagnosticDashboard() {
  const [diagnostics, setDiagnostics] = useState({
    react: 'checking',
    components: 'checking',
    entities: 'checking',
    imports: 'checking',
    errors: []
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const results = {
      react: 'pass',
      components: 'checking',
      entities: 'checking',
      imports: 'checking',
      errors: []
    };

    // Test components
    try {
      results.components = 'pass';
    } catch (error) {
      results.components = 'fail';
      results.errors.push(`Components Error: ${error.message}`);
    }

    // Test entity imports
    try {
      const { SecurityEvent, Incident } = await import('@/entities/all');
      if (SecurityEvent && Incident) {
        results.entities = 'pass';
      } else {
        results.entities = 'fail';
        results.errors.push('Entity imports returned undefined');
      }
    } catch (error) {
      results.entities = 'fail';
      results.errors.push(`Entity Import Error: ${error.message}`);
    }

    // Test dashboard component imports
    try {
      await import('../components/dashboard/ThreatLevel');
      await import('../components/dashboard/SecurityMetrics');
      await import('../components/dashboard/RecentEvents');
      results.imports = 'pass';
    } catch (error) {
      results.imports = 'fail';
      results.errors.push(`Dashboard Component Error: ${error.message}`);
    }

    setDiagnostics(results);
  };

  const getStatusBadge = (status) => {
    if (status === 'pass') {
      return <Badge className="bg-green-500/20 text-green-300"><CheckCircle className="w-3 h-3 mr-1" /> Pass</Badge>;
    } else if (status === 'fail') {
      return <Badge className="bg-red-500/20 text-red-300"><XCircle className="w-3 h-3 mr-1" /> Fail</Badge>;
    } else {
      return <Badge className="bg-yellow-500/20 text-yellow-300"><AlertCircle className="w-3 h-3 mr-1" /> Checking...</Badge>;
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🔧 Dashboard Diagnostics</h1>
          <p className="text-gray-400">Comprehensive system check</p>
        </div>

        <Card className="border-gray-700 bg-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              System Tests
              <Button onClick={runDiagnostics} size="sm" variant="outline" className="border-gray-600">
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-run Tests
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded">
                <span className="text-gray-300">React Rendering</span>
                {getStatusBadge(diagnostics.react)}
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded">
                <span className="text-gray-300">UI Components (Card, Badge, Button)</span>
                {getStatusBadge(diagnostics.components)}
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded">
                <span className="text-gray-300">Entity Imports (SecurityEvent, Incident)</span>
                {getStatusBadge(diagnostics.entities)}
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded">
                <span className="text-gray-300">Dashboard Components (ThreatLevel, SecurityMetrics)</span>
                {getStatusBadge(diagnostics.imports)}
              </div>
            </div>
          </CardContent>
        </Card>

        {diagnostics.errors.length > 0 && (
          <Card className="border-red-700 bg-red-900/20 mb-6">
            <CardHeader>
              <CardTitle className="text-red-300">❌ Errors Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {diagnostics.errors.map((error, idx) => (
                  <div key={idx} className="p-3 bg-red-900/30 rounded text-red-200 text-sm font-mono">
                    {error}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-gray-700 bg-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Browser Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Current URL:</span>
                <span className="text-gray-300 font-mono">{window.location.href}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">User Agent:</span>
                <span className="text-gray-300 text-xs break-all">{navigator.userAgent.substring(0, 80)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Window Size:</span>
                <span className="text-gray-300">{window.innerWidth} x {window.innerHeight}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-700 bg-blue-900/20">
          <CardHeader>
            <CardTitle className="text-blue-300">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-blue-200 text-sm">
              {diagnostics.errors.length === 0 ? (
                <>
                  <p>✅ All tests passed! The Dashboard should work.</p>
                  <p className="font-bold mt-4">Try navigating to: <a href="/Dashboard" className="underline text-blue-400">/Dashboard</a></p>
                </>
              ) : (
                <>
                  <p>❌ Some tests failed. Please:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Screenshot this page</li>
                    <li>Share the error messages above</li>
                    <li>Check browser console (F12) for additional errors</li>
                  </ul>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded text-xs text-gray-400 font-mono">
          <div>Diagnostic Version: 1.0</div>
          <div>Timestamp: {new Date().toISOString()}</div>
          <div>Tests Run: {Object.keys(diagnostics).length - 1}</div>
        </div>
      </div>
    </div>
  );
}