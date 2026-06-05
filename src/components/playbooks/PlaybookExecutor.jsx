import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Bot,
  User,
  ArrowRight,
  Save,
  X
} from 'lucide-react';
import { IncidentPlaybook } from '@/entities/IncidentPlaybook';
import { Incident } from '@/entities/Incident';

export default function PlaybookExecutor({ playbook, incidentId, onComplete, onCancel }) {
  const [executionState, setExecutionState] = useState({
    execution_id: `exec_${Date.now()}`,
    started_at: new Date().toISOString(),
    current_step: 0,
    completed_steps: [],
    step_notes: {},
    checklist_status: {},
    status: 'in_progress'
  });

  const [currentStepNote, setCurrentStepNote] = useState('');
  const [isExecutingAutomation, setIsExecutingAutomation] = useState(false);

  const currentStep = playbook.steps[executionState.current_step];
  const progress = ((executionState.completed_steps.length + 1) / playbook.steps.length) * 100;

  const handleCompleteStep = async () => {
    const newCompletedSteps = [...executionState.completed_steps, executionState.current_step];
    const newNotes = { ...executionState.step_notes };
    if (currentStepNote.trim()) {
      newNotes[executionState.current_step] = currentStepNote;
    }

    const newState = {
      ...executionState,
      completed_steps: newCompletedSteps,
      step_notes: newNotes,
      current_step: executionState.current_step + 1
    };

    setExecutionState(newState);
    setCurrentStepNote('');

    // If all steps complete
    if (newState.current_step >= playbook.steps.length) {
      await handleCompleteExecution(newState);
    }
  };

  const handleExecuteAutomation = async () => {
    setIsExecutingAutomation(true);
    // Simulate automation execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExecutingAutomation(false);
    await handleCompleteStep();
  };

  const handleCompleteExecution = async (finalState) => {
    const executionRecord = {
      ...finalState,
      completed_at: new Date().toISOString(),
      executed_by: 'current_user@example.com', // Would come from auth
      status: 'completed',
      steps_completed: finalState.completed_steps.length,
      total_steps: playbook.steps.length
    };

    // Update playbook execution history
    const updatedHistory = [...(playbook.execution_history || []), executionRecord];
    await IncidentPlaybook.update(playbook.id, {
      execution_history: updatedHistory,
      metrics: {
        ...playbook.metrics,
        total_executions: (playbook.metrics?.total_executions || 0) + 1,
        successful_executions: (playbook.metrics?.successful_executions || 0) + 1
      }
    });

    // Update incident if linked
    if (incidentId) {
      await Incident.update(incidentId, {
        status: 'contained',
        containment_actions: [
          ...(playbook.containment_actions || []),
          `Executed playbook: ${playbook.name}`
        ]
      });
    }

    onComplete();
  };

  const handleChecklistToggle = (itemIndex) => {
    setExecutionState({
      ...executionState,
      checklist_status: {
        ...executionState.checklist_status,
        [`${executionState.current_step}_${itemIndex}`]: 
          !executionState.checklist_status[`${executionState.current_step}_${itemIndex}`]
      }
    });
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'automated': return <Bot className="w-5 h-5 text-purple-400" />;
      case 'manual': return <User className="w-5 h-5 text-blue-400" />;
      case 'hybrid': return <><Bot className="w-4 h-4 text-purple-400" /><User className="w-4 h-4 text-blue-400" /></>;
      default: return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    }
  };

  if (!currentStep) {
    return (
      <Card className="border-gray-700 bg-gray-800/50">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-white font-medium text-xl mb-2">Playbook Execution Complete!</h3>
          <p className="text-gray-400 mb-6">All steps have been successfully completed.</p>
          <Button onClick={onComplete} className="bg-blue-600 hover:bg-blue-700">
            Return to Playbooks
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl mb-2">{playbook.name}</CardTitle>
              <p className="text-gray-400 text-sm">{playbook.description}</p>
            </div>
            <Button onClick={onCancel} variant="outline" className="border-gray-600 text-gray-300">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="text-white font-medium">
                Step {executionState.current_step + 1} of {playbook.steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card className="border-blue-700 bg-gray-800/50 border-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getActionIcon(currentStep.action_type)}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-500/20 text-blue-300">
                    Step {currentStep.step_number}
                  </Badge>
                  <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                    {currentStep.action_type}
                  </Badge>
                </div>
                <CardTitle className="text-white text-xl">{currentStep.title}</CardTitle>
              </div>
            </div>
            <Badge variant="outline" className="border-orange-500 text-orange-300">
              <Clock className="w-3 h-3 mr-1" />
              {currentStep.estimated_duration_minutes}min
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-300">{currentStep.description}</p>

          {/* Role & Success Criteria */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-900/50 rounded">
              <div className="text-gray-400 text-sm mb-1">Assigned Role</div>
              <div className="text-white font-medium">{currentStep.assigned_role?.replace(/_/g, ' ')}</div>
            </div>
            {currentStep.success_criteria && (
              <div className="p-3 bg-gray-900/50 rounded">
                <div className="text-gray-400 text-sm mb-1">Success Criteria</div>
                <div className="text-white font-medium">{currentStep.success_criteria}</div>
              </div>
            )}
          </div>

          {/* Checklist */}
          {currentStep.checklist_items && currentStep.checklist_items.length > 0 && (
            <div>
              <h4 className="text-white font-medium mb-3">Checklist</h4>
              <div className="space-y-2">
                {currentStep.checklist_items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-gray-900/50 rounded">
                    <Checkbox
                      id={`check-${index}`}
                      checked={executionState.checklist_status[`${executionState.current_step}_${index}`]}
                      onCheckedChange={() => handleChecklistToggle(index)}
                      className="border-gray-600"
                    />
                    <label htmlFor={`check-${index}`} className="flex-1 text-gray-300 text-sm cursor-pointer">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Automation Info */}
          {(currentStep.action_type === 'automated' || currentStep.action_type === 'hybrid') && (
            <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <h4 className="text-purple-300 font-medium mb-2 flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Automated Action Available
              </h4>
              {currentStep.automation_config && (
                <div className="text-sm text-gray-300 space-y-1">
                  {currentStep.automation_config.integration_name && (
                    <div>Integration: <span className="text-white">{currentStep.automation_config.integration_name}</span></div>
                  )}
                  {currentStep.automation_config.action_name && (
                    <div>Action: <span className="text-white">{currentStep.automation_config.action_name}</span></div>
                  )}
                </div>
              )}
              <Button
                onClick={handleExecuteAutomation}
                disabled={isExecutingAutomation}
                className="mt-3 bg-purple-600 hover:bg-purple-700"
              >
                {isExecutingAutomation ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Execute Automation
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Step Notes {currentStep.documentation_required && <span className="text-red-400">*</span>}
            </label>
            <Textarea
              value={currentStepNote}
              onChange={(e) => setCurrentStepNote(e.target.value)}
              placeholder="Document actions taken, findings, and any important observations..."
              className="bg-gray-900 border-gray-700 text-white"
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button
              onClick={handleCompleteStep}
              disabled={currentStep.documentation_required && !currentStepNote.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Step
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Steps Preview */}
      {executionState.current_step < playbook.steps.length - 1 && (
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white text-sm">Upcoming Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {playbook.steps.slice(executionState.current_step + 1, executionState.current_step + 4).map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-gray-900/30 rounded text-sm">
                  <Badge variant="outline" className="border-gray-600 text-gray-400">
                    {step.step_number}
                  </Badge>
                  <span className="text-gray-300">{step.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-600 ml-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}