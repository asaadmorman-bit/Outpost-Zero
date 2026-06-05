import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Play, Pause, Settings, Activity, Clock, CheckCircle, AlertCircle, Zap } from 'lucide-react';

const statusConfig = {
  active: { color: 'bg-green-500/20 text-green-400', icon: <Activity className="w-3 h-3" /> },
  idle: { color: 'bg-gray-500/20 text-gray-400', icon: <Clock className="w-3 h-3" /> },
  paused: { color: 'bg-yellow-500/20 text-yellow-400', icon: <Pause className="w-3 h-3" /> },
  error: { color: 'bg-red-500/20 text-red-400', icon: <AlertCircle className="w-3 h-3" /> },
  training: { color: 'bg-purple-500/20 text-purple-400', icon: <Zap className="w-3 h-3" /> },
};

const typeColors = {
  analyst: 'text-blue-400',
  responder: 'text-red-400',
  hunter: 'text-orange-400',
  compliance: 'text-green-400',
  orchestrator: 'text-purple-400',
  custom: 'text-cyan-400',
};

export default function AgentCard({ agent, onRun, onConfigure, isRunning }) {
  const status = statusConfig[agent.status] || statusConfig.idle;

  return (
    <Card className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Bot className={`w-6 h-6 ${typeColors[agent.agent_type] || 'text-blue-400'}`} />
            </div>
            <div>
              <CardTitle className="text-white text-base">{agent.name}</CardTitle>
              <p className="text-xs text-gray-400 capitalize">{agent.agent_type} Agent · {agent.model || 'claude-3-5-sonnet'}</p>
            </div>
          </div>
          <Badge className={`${status.color} flex items-center gap-1 text-xs`}>
            {status.icon} {agent.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{agent.description}</p>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-900/50 rounded p-2">
            <p className="text-white font-bold text-sm">{agent.executions_count || 0}</p>
            <p className="text-gray-400 text-xs">Runs</p>
          </div>
          <div className="bg-gray-900/50 rounded p-2">
            <p className="text-white font-bold text-sm">{agent.success_rate ? `${agent.success_rate}%` : 'N/A'}</p>
            <p className="text-gray-400 text-xs">Success</p>
          </div>
          <div className="bg-gray-900/50 rounded p-2">
            <p className="text-white font-bold text-sm">{(agent.integration_ids || []).length}</p>
            <p className="text-gray-400 text-xs">Integrations</p>
          </div>
        </div>

        {agent.tags && agent.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {agent.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs border-gray-600 text-gray-300">{tag}</Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2 border-t border-gray-700/50">
          <Button
            onClick={() => onRun(agent)}
            disabled={isRunning}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
            size="sm"
          >
            {isRunning ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isRunning ? 'Running...' : 'Run Agent'}
          </Button>
          <Button onClick={() => onConfigure(agent)} variant="outline" size="sm" className="border-gray-600 text-gray-300">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}