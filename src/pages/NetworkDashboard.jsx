import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Activity, AlertTriangle, Globe } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Mock Data
const trafficData = [
  { time: '10:00', ingress: 4.4, egress: 2.4 },
  { time: '11:00', ingress: 5.1, egress: 3.2 },
  { time: '12:00', ingress: 6.2, egress: 3.5 },
  { time: '13:00', ingress: 4.9, egress: 2.9 },
  { time: '14:00', ingress: 7.1, egress: 4.0 },
];
const topTalkersData = [
  { ip: '10.1.1.5', traffic: 1200 },
  { ip: '192.168.0.22', traffic: 980 },
  { ip: '172.16.5.101', traffic: 850 },
  { ip: '10.2.3.4', traffic: 720 },
];

export default function NetworkDashboard() {
  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Network className="w-8 h-8 text-blue-400" /> Network Operations Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader><CardTitle className="text-white text-sm">Total Traffic (24h)</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-blue-400">15.2 TB</p></CardContent>
          </Card>
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader><CardTitle className="text-white text-sm">Firewall Denies</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-orange-400">1,234,567</p></CardContent>
          </Card>
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader><CardTitle className="text-white text-sm">Network Anomalies</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-red-400">87</p></CardContent>
          </Card>
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader><CardTitle className="text-white text-sm">Connected Devices</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-green-400">10,543</p></CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader><CardTitle className="text-white">Ingress vs. Egress Traffic (GB)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                  <Line type="monotone" dataKey="ingress" stroke="#8884d8" />
                  <Line type="monotone" dataKey="egress" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader><CardTitle className="text-white">Top Talkers by Traffic (MB)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topTalkersData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis type="category" dataKey="ip" stroke="#9ca3af" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                  <Bar dataKey="traffic" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}