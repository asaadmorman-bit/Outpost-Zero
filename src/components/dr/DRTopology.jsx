import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Database, Server, Activity, Zap, ArrowRight } from 'lucide-react';

export default function DRTopology() {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Multi-Region Topology</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Primary Region */}
          <div className="p-6 bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/50 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Badge className="bg-green-600 mb-2">PRIMARY REGION - ACTIVE</Badge>
                <h3 className="text-2xl font-bold text-white">Azure East US</h3>
                <p className="text-gray-300 text-sm">70% of global traffic</p>
              </div>
              <Activity className="w-12 h-12 text-green-400 animate-pulse" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <Server className="w-6 h-6 text-cyan-400 mb-2" />
                <div className="text-white font-semibold mb-1">AKS Cluster</div>
                <div className="text-xs text-gray-300">18 nodes (3 zones)</div>
                <Badge className="bg-green-600/20 text-green-300 text-xs mt-2">Active</Badge>
              </div>
              
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <Database className="w-6 h-6 text-blue-400 mb-2" />
                <div className="text-white font-semibold mb-1">PostgreSQL</div>
                <div className="text-xs text-gray-300">Primary + 3 replicas</div>
                <Badge className="bg-green-600/20 text-green-300 text-xs mt-2">Zone-redundant</Badge>
              </div>
              
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <Zap className="w-6 h-6 text-purple-400 mb-2" />
                <div className="text-white font-semibold mb-1">Redis Cache</div>
                <div className="text-xs text-gray-300">Premium 6-node cluster</div>
                <Badge className="bg-green-600/20 text-green-300 text-xs mt-2">Active</Badge>
              </div>
            </div>
          </div>

          {/* Replication Arrow */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4 text-gray-400">
              <div className="text-sm">Continuous Replication</div>
              <ArrowRight className="w-8 h-8 animate-pulse" />
              <div className="text-sm">Lag: 0.8s</div>
            </div>
          </div>

          {/* DR Region */}
          <div className="p-6 bg-gradient-to-br from-orange-600/20 to-orange-800/20 border border-orange-500/50 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Badge className="bg-orange-600/70 mb-2">DR REGION - PASSIVE</Badge>
                <h3 className="text-2xl font-bold text-white">Azure West US 2</h3>
                <p className="text-gray-300 text-sm">Standby for failover (0% traffic)</p>
              </div>
              <Cloud className="w-12 h-12 text-orange-400" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <Server className="w-6 h-6 text-cyan-400 mb-2" />
                <div className="text-white font-semibold mb-1">AKS Cluster</div>
                <div className="text-xs text-gray-300">3 nodes (standby)</div>
                <Badge className="bg-orange-600/20 text-orange-300 text-xs mt-2">Standby</Badge>
              </div>
              
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <Database className="w-6 h-6 text-blue-400 mb-2" />
                <div className="text-white font-semibold mb-1">PostgreSQL</div>
                <div className="text-xs text-gray-300">Read replica (async)</div>
                <Badge className="bg-orange-600/20 text-orange-300 text-xs mt-2">Replicating</Badge>
              </div>
              
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <Zap className="w-6 h-6 text-purple-400 mb-2" />
                <div className="text-white font-semibold mb-1">Redis Cache</div>
                <div className="text-xs text-gray-300">Geo-replica</div>
                <Badge className="bg-orange-600/20 text-orange-300 text-xs mt-2">Syncing</Badge>
              </div>
            </div>
          </div>

          {/* Failover Capabilities */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-base">Automated Failover Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Health Monitoring</div>
                  <div className="text-gray-400 text-xs">Checks every 15 seconds for region availability, service health, and replication lag</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Automatic Trigger</div>
                  <div className="text-gray-400 text-xs">Failover initiates automatically if primary region is unavailable for 2 minutes</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Database Promotion</div>
                  <div className="text-gray-400 text-xs">Read replica automatically promoted to primary with zero data loss</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Server className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Application Scaling</div>
                  <div className="text-gray-400 text-xs">DR AKS cluster scales from 3 to 18 nodes within 5 minutes</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Traffic Redirection</div>
                  <div className="text-gray-400 text-xs">Azure Traffic Manager redirects global traffic to DR region via DNS update</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}