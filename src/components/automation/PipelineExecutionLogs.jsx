import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Terminal } from 'lucide-react';
import { format } from 'date-fns';

export default function PipelineExecutionLogs({ pipeline }) {
  if (!pipeline.last_execution) {
    return (
      <Card className="border-gray-700 bg-gray-800/50">
        <CardContent className="pt-6 text-center text-gray-400">
          No execution history available for this pipeline
        </CardContent>
      </Card>
    );
  }

  const { last_execution } = pipeline;
  const duration = last_execution.end_time 
    ? Math.round((new Date(last_execution.end_time) - new Date(last_execution.start_time)) / 1000)
    : null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'running': return <Clock className="w-5 h-5 text-blue-400 animate-spin" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'failed': return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'running': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              {getStatusIcon(last_execution.status)}
              Execution #{last_execution.execution_id}
            </CardTitle>
            <Badge variant="outline" className={getStatusColor(last_execution.status)}>
              {last_execution.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Started</p>
              <p className="text-white">
                {format(new Date(last_execution.start_time), 'MMM d, yyyy HH:mm:ss')}
              </p>
            </div>
            {last_execution.end_time && (
              <>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Completed</p>
                  <p className="text-white">
                    {format(new Date(last_execution.end_time), 'MMM d, yyyy HH:mm:ss')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Duration</p>
                  <p className="text-white">
                    {Math.floor(duration / 60)}m {duration % 60}s
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Stage Progress */}
          {pipeline.stages && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Stage Progress</h4>
              <div className="space-y-2">
                {pipeline.stages.map((stage, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">{stage.stage_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            Execution Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 rounded-lg p-4 text-xs text-green-300 overflow-x-auto font-mono whitespace-pre-wrap">
            {last_execution.logs || 'No logs available'}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}