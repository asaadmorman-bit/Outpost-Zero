import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  GitBranch, Play, Pause, CheckCircle, XCircle, Clock,
  Code, Shield, Zap, AlertTriangle, Eye, Database
} from 'lucide-react';

export default function CICDPipelineManager() {
  const [pipelines, setPipelines] = useState([]);
  const [activePipeline, setActivePipeline] = useState(null);

  useEffect(() => {
    loadPipelines();
    const interval = setInterval(loadPipelines, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadPipelines = () => {
    const mockPipelines = [
      {
        id: 'pipeline_001',
        name: 'Security Code Analysis',
        type: 'security_scan',
        status: 'running',
        progress: 67,
        stages: [
          { name: 'SAST Scan', status: 'completed', duration: '2m 15s' },
          { name: 'Dependency Check', status: 'running', duration: '1m 30s' },
          { name: 'Container Scan', status: 'pending', duration: 'Est. 45s' },
          { name: 'Deploy to Test', status: 'pending', duration: 'Est. 30s' }
        ],
        findings: {
          critical: 0,
          high: 2,
          medium: 5,
          low: 12
        },
        last_run: new Date(Date.now() - 180000),
        next_run: new Date(Date.now() + 3600000)
      },
      {
        id: 'pipeline_002',
        name: 'Penetration Testing',
        type: 'pentest',
        status: 'scheduled',
        progress: 0,
        stages: [
          { name: 'Network Scan', status: 'pending', duration: 'Est. 15m' },
          { name: 'Web App Test', status: 'pending', duration: 'Est. 20m' },
          { name: 'API Security Test', status: 'pending', duration: 'Est. 10m' },
          { name: 'Report Generation', status: 'pending', duration: 'Est. 5m' }
        ],
        findings: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0
        },
        last_run: new Date(Date.now() - 86400000),
        next_run: new Date(Date.now() + 1800000)
      },
      {
        id: 'pipeline_003',
        name: 'Infrastructure Security Audit',
        type: 'infrastructure',
        status: 'completed',
        progress: 100,
        stages: [
          { name: 'Configuration Scan', status: 'completed', duration: '5m 20s' },
          { name: 'Compliance Check', status: 'completed', duration: '3m 45s' },
          { name: 'Vulnerability Assessment', status: 'completed', duration: '12m 30s' },
          { name: 'Report & Remediation', status: 'completed', duration: '2m 15s' }
        ],
        findings: {
          critical: 1,
          high: 3,
          medium: 8,
          low: 15
        },
        last_run: new Date(Date.now() - 3600000),
        next_run: new Date(Date.now() + 82800000)
      }
    ];
    
    setPipelines(mockPipelines);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'running': return <Play className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'scheduled': return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'running': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'failed': return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'scheduled': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getPipelineIcon = (type) => {
    switch(type) {
      case 'security_scan': return <Shield className="w-5 h-5 text-blue-400" />;
      case 'pentest': return <Zap className="w-5 h-5 text-red-400" />;
      case 'infrastructure': return <Database className="w-5 h-5 text-green-400" />;
      default: return <Code className="w-5 h-5 text-gray-400" />;
    }
  };

  const triggerPipeline = (pipelineId) => {
    setPipelines(pipelines.map(p => 
      p.id === pipelineId 
        ? { ...p, status: 'running', progress: 0 }
        : p
    ));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {pipelines.map(pipeline => (
          <Card key={pipeline.id} className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-3">
                  {getPipelineIcon(pipeline.type)}
                  {pipeline.name}
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={getStatusColor(pipeline.status)}>
                    {getStatusIcon(pipeline.status)}
                    <span className="ml-2">{pipeline.status.charAt(0).toUpperCase() + pipeline.status.slice(1)}</span>
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => triggerPipeline(pipeline.id)}
                    disabled={pipeline.status === 'running'}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Trigger
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pipeline.status === 'running' && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Overall Progress</span>
                    <span className="text-gray-300">{pipeline.progress}%</span>
                  </div>
                  <Progress value={pipeline.progress} className="h-2" />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-3">Pipeline Stages</h4>
                  <div className="space-y-2">
                    {pipeline.stages.map((stage, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-900/50">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(stage.status)}
                          <span className="text-gray-300">{stage.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{stage.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Security Findings</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded bg-red-900/20 border border-red-500/30">
                      <div className="text-lg font-bold text-red-400">{pipeline.findings.critical}</div>
                      <div className="text-xs text-red-300">Critical</div>
                    </div>
                    <div className="p-2 rounded bg-orange-900/20 border border-orange-500/30">
                      <div className="text-lg font-bold text-orange-400">{pipeline.findings.high}</div>
                      <div className="text-xs text-orange-300">High</div>
                    </div>
                    <div className="p-2 rounded bg-yellow-900/20 border border-yellow-500/30">
                      <div className="text-lg font-bold text-yellow-400">{pipeline.findings.medium}</div>
                      <div className="text-xs text-yellow-300">Medium</div>
                    </div>
                    <div className="p-2 rounded bg-blue-900/20 border border-blue-500/30">
                      <div className="text-lg font-bold text-blue-400">{pipeline.findings.low}</div>
                      <div className="text-xs text-blue-300">Low</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400 pt-2 border-t border-gray-700">
                <span>Last Run: {pipeline.last_run.toLocaleString()}</span>
                <span>Next Run: {pipeline.next_run.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}