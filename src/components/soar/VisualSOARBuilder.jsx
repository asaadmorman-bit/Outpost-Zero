import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Save, 
  X, 
  Plus,
  Trash2,
  Play,
  Settings,
  Zap,
  GitBranch,
  AlertCircle,
  CheckCircle,
  Clock,
  Bot,
  ArrowRight
} from 'lucide-react';
import { SOARPlaybook } from '@/entities/SOARPlaybook';
import TriggerConfig from './builder/TriggerConfig';
import ActionNode from './builder/ActionNode';
import IntegrationSelector from './builder/IntegrationSelector';
import WorkflowCanvas from './builder/WorkflowCanvas';

export default function VisualSOARBuilder({ playbook, onSave, onCancel }) {
  const [formData, setFormData] = useState(playbook || {
    playbook_name: '',
    description: '',
    category: 'incident_response',
    trigger_conditions: [],
    automation_steps: [],
    severity_mapping: ['medium', 'high', 'critical'],
    active: true,
    learning_data: {
      execution_count: 0,
      common_variations: [],
      user_modifications: [],
      improvement_suggestions: []
    }
  });

  const [selectedNode, setSelectedNode] = useState(null);
  const [showTriggerConfig, setShowTriggerConfig] = useState(false);
  const [showActionConfig, setShowActionConfig] = useState(false);
  const [showIntegrationSelector, setShowIntegrationSelector] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'incident_response', label: 'Incident Response' },
    { value: 'vulnerability_management', label: 'Vulnerability Management' },
    { value: 'threat_hunting', label: 'Threat Hunting' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'user_management', label: 'User Management' },
    { value: 'network_security', label: 'Network Security' },
    { value: 'data_protection', label: 'Data Protection' },
    { value: 'cloud_security', label: 'Cloud Security' }
  ];

  const predefinedActions = [
    { 
      type: 'isolate_host', 
      label: 'Isolate Host', 
      icon: <AlertCircle className="w-4 h-4" />,
      description: 'Disconnect endpoint from network',
      color: 'red'
    },
    { 
      type: 'block_ip', 
      label: 'Block IP', 
      icon: <AlertCircle className="w-4 h-4" />,
      description: 'Add IP to firewall blocklist',
      color: 'orange'
    },
    { 
      type: 'disable_user', 
      label: 'Disable User', 
      icon: <AlertCircle className="w-4 h-4" />,
      description: 'Disable user account',
      color: 'red'
    },
    { 
      type: 'collect_artifacts', 
      label: 'Collect Artifacts', 
      icon: <Clock className="w-4 h-4" />,
      description: 'Gather forensic evidence',
      color: 'blue'
    },
    { 
      type: 'notify_team', 
      label: 'Notify Team', 
      icon: <Zap className="w-4 h-4" />,
      description: 'Send alert to security team',
      color: 'purple'
    },
    { 
      type: 'create_ticket', 
      label: 'Create Ticket', 
      icon: <CheckCircle className="w-4 h-4" />,
      description: 'Generate incident ticket',
      color: 'green'
    },
    { 
      type: 'run_scan', 
      label: 'Run Scan', 
      icon: <Bot className="w-4 h-4" />,
      description: 'Execute security scan',
      color: 'cyan'
    },
    { 
      type: 'update_documentation', 
      label: 'Update Documentation', 
      icon: <CheckCircle className="w-4 h-4" />,
      description: 'Log to knowledge base',
      color: 'blue'
    }
  ];

  const handleSubmit = async () => {
    // Validate
    const newErrors = {};
    if (!formData.playbook_name) newErrors.playbook_name = "Name is required";
    if (!formData.trigger_conditions || formData.trigger_conditions.length === 0) {
      newErrors.trigger_conditions = "At least one trigger is required";
    }
    if (!formData.automation_steps || formData.automation_steps.length === 0) {
      newErrors.automation_steps = "At least one action is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (playbook?.id) {
        await SOARPlaybook.update(playbook.id, formData);
      } else {
        await SOARPlaybook.create(formData);
      }
      onSave(formData);
    } catch (error) {
      console.error("Error saving SOAR playbook:", error);
      alert("Failed to save playbook");
    }
  };

  const handleTestPlaybook = () => {
    alert(`Testing playbook: ${formData.playbook_name}\n\nTriggers: ${formData.trigger_conditions.length}\nActions: ${formData.automation_steps.length}\n\nThis would execute the workflow in a sandbox environment.`);
  };

  const addTrigger = (trigger) => {
    setFormData({
      ...formData,
      trigger_conditions: [...formData.trigger_conditions, trigger]
    });
    setShowTriggerConfig(false);
  };

  const removeTrigger = (index) => {
    setFormData({
      ...formData,
      trigger_conditions: formData.trigger_conditions.filter((_, i) => i !== index)
    });
  };

  const addAction = (action) => {
    const newAction = {
      step_name: action.label,
      action_type: action.type,
      integration_id: null,
      parameters: {},
      timeout: 300,
      learning_weight: 0.5
    };
    setFormData({
      ...formData,
      automation_steps: [...formData.automation_steps, newAction]
    });
  };

  const updateAction = (index, updatedAction) => {
    const newSteps = [...formData.automation_steps];
    newSteps[index] = updatedAction;
    setFormData({ ...formData, automation_steps: newSteps });
  };

  const removeAction = (index) => {
    setFormData({
      ...formData,
      automation_steps: formData.automation_steps.filter((_, i) => i !== index)
    });
  };

  const moveAction = (index, direction) => {
    if ((direction === -1 && index === 0) || 
        (direction === 1 && index === formData.automation_steps.length - 1)) {
      return;
    }
    const newSteps = [...formData.automation_steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index + direction];
    newSteps[index + direction] = temp;
    setFormData({ ...formData, automation_steps: newSteps });
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">
            {playbook ? 'Edit SOAR Playbook' : 'Create SOAR Playbook'}
          </h1>
          <div className="flex gap-2">
            <Button onClick={onCancel} variant="outline" className="border-gray-600 text-gray-300">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleTestPlaybook} variant="outline" className="border-blue-600 text-blue-300 hover:bg-blue-900/20">
              <Play className="w-4 h-4 mr-2" />
              Test
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save Playbook
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info */}
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white text-sm">Playbook Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Playbook Name *
                  </label>
                  <Input
                    value={formData.playbook_name}
                    onChange={(e) => setFormData({ ...formData, playbook_name: e.target.value })}
                    placeholder="e.g., Phishing Auto-Response"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                  {errors.playbook_name && (
                    <p className="text-red-400 text-xs mt-1">{errors.playbook_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What does this playbook do?"
                    className="bg-gray-900 border-gray-700 text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value} className="text-white">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Triggers */}
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm">Triggers</CardTitle>
                  <Button 
                    onClick={() => setShowTriggerConfig(true)} 
                    size="sm" 
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {errors.trigger_conditions && (
                  <div className="mb-3 p-2 bg-red-900/20 border border-red-500/30 rounded flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-red-300 text-xs">{errors.trigger_conditions}</p>
                  </div>
                )}
                {formData.trigger_conditions.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">No triggers added</p>
                ) : (
                  <div className="space-y-2">
                    {formData.trigger_conditions.map((trigger, index) => (
                      <div key={index} className="p-2 bg-gray-900/50 rounded flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">{trigger}</div>
                        </div>
                        <Button
                          onClick={() => removeTrigger(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Palette */}
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white text-sm">Action Palette</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {predefinedActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => addAction(action)}
                      className="w-full p-2 bg-gray-900/50 hover:bg-gray-900 rounded flex items-center gap-3 transition-colors group"
                    >
                      <div className={`p-1.5 rounded bg-${action.color}-500/20 text-${action.color}-400 group-hover:bg-${action.color}-500/30`}>
                        {action.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-white text-sm font-medium">{action.label}</div>
                        <div className="text-gray-400 text-xs">{action.description}</div>
                      </div>
                      <Plus className="w-4 h-4 text-gray-600 group-hover:text-blue-400" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Visual Workflow */}
          <div className="lg:col-span-2 space-y-6">
            {/* Workflow Canvas */}
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Workflow Design</CardTitle>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {formData.automation_steps.length} actions
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {errors.automation_steps && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-300 text-sm">{errors.automation_steps}</p>
                  </div>
                )}

                {formData.automation_steps.length === 0 ? (
                  <div className="text-center py-12">
                    <GitBranch className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No Actions Yet</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Drag actions from the palette to build your workflow
                    </p>
                  </div>
                ) : (
                  <WorkflowCanvas
                    steps={formData.automation_steps}
                    onUpdateStep={updateAction}
                    onRemoveStep={removeAction}
                    onMoveStep={moveAction}
                    onSelectStep={setSelectedNode}
                  />
                )}
              </CardContent>
            </Card>

            {/* Selected Action Configuration */}
            {selectedNode !== null && formData.automation_steps[selectedNode] && (
              <ActionNode
                action={formData.automation_steps[selectedNode]}
                onUpdate={(updated) => updateAction(selectedNode, updated)}
                onClose={() => setSelectedNode(null)}
              />
            )}
          </div>
        </div>

        {/* Modals */}
        {showTriggerConfig && (
          <TriggerConfig
            onSave={addTrigger}
            onCancel={() => setShowTriggerConfig(false)}
          />
        )}

        {showIntegrationSelector && (
          <IntegrationSelector
            onSelect={(integration) => {
              console.log('Selected integration:', integration);
              setShowIntegrationSelector(false);
            }}
            onCancel={() => setShowIntegrationSelector(false)}
          />
        )}
      </div>
    </div>
  );
}