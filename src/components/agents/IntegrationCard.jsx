import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plug, Activity, CheckCircle, AlertCircle, Settings, Zap } from 'lucide-react';

const typeColors = {
  custom_sdk: 'text-cyan-400 bg-cyan-500/10',
  cots: 'text-blue-400 bg-blue-500/10',
  gots: 'text-green-400 bg-green-500/10',
  api: 'text-purple-400 bg-purple-500/10',
  webhook: 'text-orange-400 bg-orange-500/10',
  data_stream: 'text-pink-400 bg-pink-500/10',
};

const typeLabels = {
  custom_sdk: 'Custom SDK',
  cots: 'COTS',
  gots: 'GOTS',
  api: 'REST API',
  webhook: 'Webhook',
  data_stream: 'Data Stream',
};

export default function IntegrationCard({ integration, onTest, onConfigure, isTesting }) {
  const isHealthy = integration.status === 'active';

  return (
    <Card className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${typeColors[integration.type]?.split(' ')[1] || 'bg-gray-500/10'}`}>
              <Plug className={`w-5 h-5 ${typeColors[integration.type]?.split(' ')[0] || 'text-gray-400'}`} />
            </div>
            <div>
              <CardTitle className="text-white text-sm">{integration.name}</CardTitle>
              <p className="text-xs text-gray-400">{integration.vendor || 'Unknown vendor'}</p>
            </div>
          </div>
          <Badge className={`text-xs ${isHealthy ? 'bg-green-500/20 text-green-400' : integration.status === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
            {integration.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`text-xs border-gray-600 ${typeColors[integration.type]?.split(' ')[0] || 'text-gray-400'}`}>
            {typeLabels[integration.type] || integration.type}
          </Badge>
          {integration.health_score !== undefined && (
            <div className="flex items-center gap-1 text-xs">
              {integration.health_score >= 80 ? <CheckCircle className="w-3 h-3 text-green-400" /> : <AlertCircle className="w-3 h-3 text-red-400" />}
              <span className="text-gray-300">{integration.health_score}% health</span>
            </div>
          )}
        </div>

        {integration.capabilities && integration.capabilities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {integration.capabilities.slice(0, 3).map((cap, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">{cap}</span>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 truncate">{integration.endpoint_url || 'No endpoint configured'}</p>

        <div className="flex gap-2 pt-2 border-t border-gray-700/50">
          <Button onClick={() => onTest(integration)} disabled={isTesting} variant="outline" size="sm"
            className="flex-1 border-gray-600 text-gray-300 text-xs">
            {isTesting ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" /> : <Activity className="w-3 h-3 mr-1" />}
            Test
          </Button>
          <Button onClick={() => onConfigure(integration)} variant="outline" size="sm"
            className="flex-1 border-gray-600 text-gray-300 text-xs">
            <Settings className="w-3 h-3 mr-1" /> Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}