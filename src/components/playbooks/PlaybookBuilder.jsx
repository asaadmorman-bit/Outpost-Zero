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
  MoveUp,
  MoveDown,
  Settings,
  AlertCircle
} from 'lucide-react';
import { IncidentPlaybook } from '@/entities/IncidentPlaybook';
import PlaybookStepEditor from './PlaybookStepEditor';

export default function PlaybookBuilder({ playbook, onSave, onCancel }) {
  const [formData, setFormData] = useState(playbook || {
    playbook_id: `PB-${Date.now()}`,
    name: '',
    description: '',
    incident_type: 'phishing',
    severity_levels: ['medium'],
    steps: [],
    tools_required: [],
    compliance_requirements: [],
    status: 'draft',
    tags: [],
    is_template: false
  });

  const [editingStep, setEditingStep] = useState(null);
  const [errors, setErrors] = useState({});

  const incidentTypes = [
    "phishing", "malware_outbreak", "ransomware", "data_breach",
    "insider_threat", "ddos_attack", "unauthorized_access", "custom"
  ];

  const handleSubmit = async () => {
    // Validate
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (formData.steps.length === 0) newErrors.steps = "At least one step is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (playbook?.id) {
        await IncidentPlaybook.update(playbook.id, formData);
      } else {
        await IncidentPlaybook.create(formData);
      }
      onSave(formData);
    } catch (error) {
      console.error("Error saving playbook:", error);
      alert("Failed to save playbook");
    }
  };

  const addStep = () => {
    const newStep = {
      step_number: formData.steps.length + 1,
      title: '',
      description: '',
      action_type: 'manual',
      assigned_role: 'security_analyst',
      estimated_duration_minutes: 10,
      checklist_items: [],
      documentation_required: false
    };
    setEditingStep(newStep);
  };

  const handleStepSaved = (step) => {
    if (step.step_number && step.step_number <= formData.steps.length) {
      // Edit existing
      const newSteps = [...formData.steps];
      newSteps[step.step_number - 1] = step;
      setFormData({ ...formData, steps: newSteps });
    } else {
      // Add new
      step.step_number = formData.steps.length + 1;
      setFormData({ ...formData, steps: [...formData.steps, step] });
    }
    setEditingStep(null);
  };

  const deleteStep = (index) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    // Renumber steps
    newSteps.forEach((step, i) => step.step_number = i + 1);
    setFormData({ ...formData, steps: newSteps });
  };

  const moveStep = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === formData.steps.length - 1)) {
      return;
    }
    const newSteps = [...formData.steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index + direction];
    newSteps[index + direction] = temp;
    // Renumber
    newSteps.forEach((step, i) => step.step_number = i + 1);
    setFormData({ ...formData, steps: newSteps });
  };

  if (editingStep) {
    return (
      <PlaybookStepEditor
        step={editingStep}
        onSave={handleStepSaved}
        onCancel={() => setEditingStep(null)}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">
            {playbook ? 'Edit Playbook' : 'Create New Playbook'}
          </h1>
          <div className="flex gap-2">
            <Button onClick={onCancel} variant="outline" className="border-gray-600 text-gray-300">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Playbook
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Playbook Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Phishing Email Response"
                  className="bg-gray-900 border-gray-700 text-white"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive playbook for..."
                  className="bg-gray-900 border-gray-700 text-white"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Incident Type
                  </label>
                  <Select
                    value={formData.incident_type}
                    onValueChange={(value) => setFormData({ ...formData, incident_type: value })}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {incidentTypes.map(type => (
                        <SelectItem key={type} value={type} className="text-white">
                          {type.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="draft" className="text-white">Draft</SelectItem>
                      <SelectItem value="active" className="text-white">Active</SelectItem>
                      <SelectItem value="archived" className="text-white">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <Input
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  placeholder="phishing, email, user-awareness"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Playbook Steps</CardTitle>
                <Button onClick={addStep} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {errors.steps && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-300 text-sm">{errors.steps}</p>
                </div>
              )}

              {formData.steps.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No steps added yet. Click "Add Step" to begin.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.steps.map((step, index) => (
                    <Card key={index} className="border-gray-600 bg-gray-900/50">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className="bg-blue-500/20 text-blue-300">
                                Step {step.step_number}
                              </Badge>
                              <h4 className="text-white font-medium">{step.title}</h4>
                              <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                {step.action_type}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{step.description}</p>
                            <div className="flex gap-2 text-xs text-gray-500">
                              <span>Role: {step.assigned_role?.replace(/_/g, ' ')}</span>
                              <span>•</span>
                              <span>{step.estimated_duration_minutes}min</span>
                              {step.checklist_items?.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{step.checklist_items.length} checklist items</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 ml-4">
                            <Button
                              onClick={() => moveStep(index, -1)}
                              disabled={index === 0}
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white"
                            >
                              <MoveUp className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => moveStep(index, 1)}
                              disabled={index === formData.steps.length - 1}
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white"
                            >
                              <MoveDown className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => setEditingStep(step)}
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => deleteStep(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}