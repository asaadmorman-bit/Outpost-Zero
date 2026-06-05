import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Shield, Server, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Mock Data
const assetData = [
  { name: 'AWS', value: 400 },
  { name: 'Azure', value: 300 },
  { name: 'GCP', value: 300 },
];
const findingData = [
  { severity: 'Critical', count: 12 },
  { severity: 'High', count: 45 },
  { severity: 'Medium', count: 120 },
  { severity: 'Low', count: 350 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function CloudDashboard() {
  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Cloud className="w-8 h-8 text-purple-400" /> Cloud Security Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader><CardTitle className="text-white text-sm">Monitored Assets</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-purple-400">1,000</p></CardContent>
          </Card>
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader><CardTitle className="text-white text-sm">Critical Findings</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-red-400">12</p></CardContent>
          </Card>
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader><CardTitle className="text-white text-sm">Misconfigurations</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-orange-400">215</p></CardContent>
          </Card>
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader><CardTitle className="text-white text-sm">Compliance Score</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-green-400">88%</p></CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader><CardTitle className="text-white">Asset Distribution by Provider</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={assetData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
                    {assetData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader><CardTitle className="text-white">Security Findings by Severity</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={findingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="severity" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                  <Bar dataKey="count">
                    {findingData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.severity === 'Critical' ? '#ef4444' : entry.severity === 'High' ? '#f97316' : entry.severity === 'Medium' ? '#f59e0b' : '#22c55e'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}