import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PlayCircle, 
  GitBranch, 
  CheckCircle, 
  XCircle, 
  Clock,
  Shield,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

export default function PipelineCard({ pipeline, onTrigger, onSelect, isSelected }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-400 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      success: 'bg-green-500/20 text-green-300 border-green-500/50',
      failed: 'bg-red-500/20 text-red-300 border-red-500/50',
      running: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      cancelled: 'bg-gray-500/20 text-gray-300 border-gray-500/50'
    };
    return colors[status] || colors.cancelled;
  };

  return (
    <Card 
      className={`border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-colors cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg mb-2">{pipeline.name}</CardTitle>
            <p className="text-gray-400 text-sm mb-3">{pipeline.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <GitBranch className="w-4 h-4" />
                <span>{pipeline.branch}</span>
              </div>
              <Badge variant="outline" className={getStatusBadge(pipeline.last_execution?.status || 'unknown')}>
                {getStatusIcon(pipeline.last_execution?.status || 'unknown')}
                <span className="ml-2">{pipeline.last_execution?.status || 'Never run'}</span>
              </Badge>
            </div>
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onTrigger();
            }}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Trigger
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stages */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Pipeline Stages</h4>
            <div className="flex flex-wrap gap-2">
              {pipeline.stages?.map((stage, index) => (
                <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                  {stage.stage_name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Security Gates */}
          {pipeline.security_gates && pipeline.security_gates.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Security Gates
              </h4>
              <div className="flex flex-wrap gap-2">
                {pipeline.security_gates.map((gate, index) => (
                  <Badge key={index} variant="outline" className="border-blue-600/50 text-blue-300">
                    {gate.gate_name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Last Execution Info */}
          {pipeline.last_execution && (
            <div className="pt-3 border-t border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                  Last run: {format(new Date(pipeline.last_execution.start_time), 'MMM d, yyyy HH:mm')}
                </span>
                {pipeline.last_execution.end_time && (
                  <span>
                    Duration: {Math.round((new Date(pipeline.last_execution.end_time) - new Date(pipeline.last_execution.start_time)) / 60000)}m
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}