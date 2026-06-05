import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Activity, AlertTriangle, Users } from 'lucide-react';

export default function DashboardSimple() {
  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Security Operations Center - Simple</h1>
          <p className="text-gray-400">Minimal dashboard for debugging</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-700 bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Critical Events</p>
                  <p className="text-3xl font-bold text-white">0</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Incidents</p>
                  <p className="text-3xl font-bold text-white">0</p>
                </div>
                <Shield className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Security Events</p>
                  <p className="text-3xl font-bold text-white">0</p>
                </div>
                <Activity className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">High-Risk Users</p>
                  <p className="text-3xl font-bold text-white">0</p>
                </div>
                <Users className="w-12 h-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-gray-700 bg-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">React Rendering</span>
                <Badge className="bg-green-500/20 text-green-300">✓ Working</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">UI Components</span>
                <Badge className="bg-green-500/20 text-green-300">✓ Loaded</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Styling (Tailwind)</span>
                <Badge className="bg-green-500/20 text-green-300">✓ Applied</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Page Location</span>
                <span className="text-gray-400 text-sm">{window.location.pathname}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-700 bg-yellow-900/20">
          <CardHeader>
            <CardTitle className="text-yellow-300">Debugging Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-yellow-200 space-y-2 text-sm">
              <p>✓ If you can see this page, React is working correctly</p>
              <p>✓ If the cards are styled with dark backgrounds, Tailwind is working</p>
              <p>✓ If icons are visible, Lucide React is loading</p>
              <p className="mt-4 font-bold">Next Step: Navigate to /Dashboard to test the full version</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}