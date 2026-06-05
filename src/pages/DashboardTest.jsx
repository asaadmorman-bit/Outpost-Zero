import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardTest() {
  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Dashboard Test Page</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">✅ If you can see this, React is working!</p>
            <p className="text-gray-400 mt-2">This means the issue is in the Dashboard page itself.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}