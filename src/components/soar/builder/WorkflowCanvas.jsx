import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Settings, 
  Trash2, 
  MoveUp, 
  MoveDown,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Bot,
  PlayCircle
} from 'lucide-react';

export default function WorkflowCanvas({ steps, onUpdateStep, onRemoveStep, onMoveStep, onSelectStep }) {
  const getActionIcon = (actionType) => {
    const icons = {
      isolate_host: AlertCircle,
      block_ip: AlertCircle,
      disable_user: AlertCircle,
      collect_artifacts: Clock,
      notify_team: Zap,
      create_ticket: CheckCircle,
      run_scan: Bot,
      update_documentation: CheckCircle
    };
    const Icon = icons[actionType] || PlayCircle;
    return <Icon className="w-5 h-5" />;
  };

  const getActionColor = (actionType) => {
    const colors = {
      isolate_host: 'red',
      block_ip: 'orange',
      disable_user: 'red',
      collect_artifacts: 'blue',
      notify_team: 'purple',
      create_ticket: 'green',
      run_scan: 'cyan',
      update_documentation: 'blue'
    };
    return colors[actionType] || 'gray';
  };

  return (
    <div className="space-y-3">
      {/* Start Node */}
      <div className="flex items-center justify-center">
        <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">Workflow Start</span>
          </div>
        </div>
      </div>

      {/* Connector */}
      <div className="flex justify-center">
        <div className="w-0.5 h-6 bg-gray-600"></div>
      </div>

      {/* Action Steps */}
      {steps.map((step, index) => {
        const color = getActionColor(step.action_type);
        const Icon = getActionIcon(step.action_type);
        
        return (
          <React.Fragment key={index}>
            <Card 
              className={`border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all cursor-pointer ${
                color === 'red' ? 'border-l-4 border-l-red-500' :
                color === 'orange' ? 'border-l-4 border-l-orange-500' :
                color === 'green' ? 'border-l-4 border-l-green-500' :
                color === 'blue' ? 'border-l-4 border-l-blue-500' :
                color === 'purple' ? 'border-l-4 border-l-purple-500' :
                color === 'cyan' ? 'border-l-4 border-l-cyan-500' :
                'border-l-4 border-l-gray-500'
              }`}
              onClick={() => onSelectStep(index)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded bg-${color}-500/20 text-${color}-400`}>
                      {Icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                          Step {index + 1}
                        </Badge>
                        <h4 className="text-white font-medium">{step.step_name}</h4>
                      </div>
                      <p className="text-gray-400 text-xs">
                        Action: {step.action_type?.replace(/_/g, ' ')}
                      </p>
                      {step.integration_id && (
                        <Badge variant="outline" className="border-purple-500/50 text-purple-300 text-xs mt-1">
                          Integration: {step.integration_id}
                        </Badge>
                      )}
                      {step.timeout && (
                        <div className="text-gray-500 text-xs mt-1">
                          Timeout: {step.timeout}s
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 ml-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveStep(index, -1);
                      }}
                      disabled={index === 0}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white h-8 w-8 p-0"
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveStep(index, 1);
                      }}
                      disabled={index === steps.length - 1}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white h-8 w-8 p-0"
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStep(index);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 h-8 w-8 p-0"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveStep(index);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Parameters Preview */}
                {step.parameters && Object.keys(step.parameters).length > 0 && (
                  <div className="mt-3 p-2 bg-gray-900/50 rounded">
                    <div className="text-gray-400 text-xs mb-1">Parameters:</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(step.parameters).slice(0, 3).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="border-gray-600 text-gray-400 text-xs">
                          {key}: {String(value).substring(0, 20)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Connector to next step */}
            {index < steps.length - 1 && (
              <div className="flex justify-center">
                <div className="w-0.5 h-6 bg-gray-600 relative">
                  <ArrowRight className="w-4 h-4 text-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90" />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Connector to end */}
      <div className="flex justify-center">
        <div className="w-0.5 h-6 bg-gray-600"></div>
      </div>

      {/* End Node */}
      <div className="flex items-center justify-center">
        <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Workflow Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}