import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, CheckCircle, AlertTriangle, Database, HardDrive, Key, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ReplicationMonitor({ healthData }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-600/20 border-green-500/50';
      case 'lagging': return 'text-yellow-400 bg-yellow-600/20 border-yellow-500/50';
      case 'broken': return 'text-red-400 bg-red-600/20 border-red-500/50';
      default: return 'text-gray-400 bg-gray-600/20 border-gray-500/50';
    }
  };

  const getServiceIcon = (serviceName) => {
    switch (serviceName) {
      case 'database': return Database;
      case 'cache': return Activity;
      case 'storage': return HardDrive;
      case 'secrets': return Key;
      default: return Settings;
    }
  };

  // Mock lag history for chart
  const lagHistory = [
    { time: '10m ago', database: 0.9, cache: 0.4, storage: 1.1 },
    { time: '8m ago', database: 0.7, cache: 0.3, storage: 1.3 },
    { time: '6m ago', database: 0.8, cache: 0.5, storage: 1.0 },
    { time: '4m ago', database: 0.6, cache: 0.2, storage: 1.2 },
    { time: '2m ago', database: 0.9, cache: 0.4, storage: 0.9 },
    { time: 'now', database: 0.8, cache: 0.3, storage: 1.2 }
  ];

  return (
    <div className="space-y-6">
      <Alert className="border-cyan-500/50 bg-cyan-500/10">
        <Activity className="h-5 w-5 text-cyan-400" />
        <AlertDescription className="text-cyan-200">
          <strong>Real-Time Monitoring:</strong> Replication health is monitored every 15 seconds. Automated alerts trigger if lag exceeds thresholds or replication breaks.
        </AlertDescription>
      </Alert>

      {/* Service Health Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {healthData.map((health) => {
          const Icon = getServiceIcon(health.service_name);
          const isHealthy = health.replication_status === 'healthy';
          
          return (
            <Card key={health.id} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    <Icon className="w-5 h-5 text-cyan-400" />
                    {health.service_name.charAt(0).toUpperCase() + health.service_name.slice(1)}
                  </CardTitle>
                  <Badge variant="outline" className={getStatusColor(health.replication_status)}>
                    {health.replication_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Primary:</span>
                    <span className="text-white">{health.primary_region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Secondary:</span>
                    <span className="text-white">{health.secondary_region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lag:</span>
                    <span className={isHealthy ? 'text-green-400 font-semibold' : 'text-yellow-400 font-semibold'}>
                      {health.replication_lag_seconds}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sync:</span>
                    <span className="text-white">{health.data_sync_percentage}%</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-gray-400">RPO</div>
                      <div className="text-green-400 font-semibold">{health.estimated_rpo_minutes} min</div>
                    </div>
                    <div>
                      <div className="text-gray-400">RTO</div>
                      <div className="text-green-400 font-semibold">{health.estimated_rto_minutes} min</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lag Trend Chart */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Replication Lag Trend (Last 10 Minutes)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lagHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" label={{ value: 'Seconds', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="database" stroke="#3b82f6" strokeWidth={2} name="Database" />
              <Line type="monotone" dataKey="cache" stroke="#8b5cf6" strokeWidth={2} name="Cache" />
              <Line type="monotone" dataKey="storage" stroke="#10b981" strokeWidth={2} name="Storage" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Threshold: 2s (DB), 5s (Cache), 10s (Storage)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replication Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-base">Database Replication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Zone-redundant HA in East US (automatic failover under 60s)
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Async geo-replication to West US 2 (under 1s lag)
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Point-in-time restore (any second within 35 days)
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Automated backup every hour (geo-redundant)
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-base">Storage Replication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Zone-redundant storage (ZRS) in primary region
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Geo-redundant replication to West US 2 (GRS)
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Immutable backups (WORM for compliance)
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Lifecycle management with auto-archival
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}