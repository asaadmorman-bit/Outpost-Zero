
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X, Plus, Trash2, Bot } from 'lucide-react';
import { SOARPlaybook } from '@/entities/SOARPlaybook'; // Import SOARPlaybook

export default function PlaybookStepEditor({ step, onSave, onCancel }) {
  const [formData, setFormData] = useState(step);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  // const [showSOARSelector, setShowSOARSelector] = useState(false); // This state variable was in the outline but not used in the provided JSX. Keeping it out for now unless it's explicitly needed for other logic.
  const [availableSOARPlaybooks, setAvailableSOARPlaybooks] = useState([]);

  const actionTypes = [
    { value: 'manual', label: 'Manual' },
    { value: 'automated', label: 'Automated' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'approval_required', label: 'Approval Required' }
  ];

  const roles = [
    { value: 'incident_commander', label: 'Incident Commander' },
    { value: 'security_analyst', label: 'Security Analyst' },
    { value: 'system_admin', label: 'System Admin' },
    { value: 'network_engineer', label: 'Network Engineer' },
    { value: 'compliance_officer', label: 'Compliance Officer' },
    { value: 'executive', label: 'Executive' },
    { value: 'any', label: 'Any' }
  ];

  useEffect(() => {
    // Load available SOAR playbooks for linking
    const loadSOARPlaybooks = async () => {
      try {
        const playbooks = await SOARPlaybook.list();
        setAvailableSOARPlaybooks(playbooks);
      } catch (error) {
        console.error('Error loading SOAR playbooks:', error);
        // Optionally, set an error state or display a message
      }
    };
    loadSOARPlaybooks();
  }, []);

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    setFormData({
      ...formData,
      checklist_items: [...(formData.checklist_items || []), newChecklistItem.trim()]
    });
    setNewChecklistItem('');
  };

  const handleRemoveChecklistItem = (index) => {
    setFormData({
      ...formData,
      checklist_items: formData.checklist_items.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      alert('Title and description are required');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">
            {step.step_number ? `Edit Step ${step.step_number}` : 'Add New Step'}
          </h1>
          <div className="flex gap-2">
            <Button onClick={onCancel} variant="outline" className="border-gray-600 text-gray-300">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Step
            </Button>
          </div>
        </div>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white">Step Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Step Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Initial Triage"
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of this step..."
                className="bg-gray-900 border-gray-700 text-white"
                rows={4}
              />
            </div>

            {/* Action Type & Role */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Action Type
                </label>
                <Select
                  value={formData.action_type}
                  onValueChange={(value) => setFormData({ ...formData, action_type: value })}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {actionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value} className="text-white">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Assigned Role
                </label>
                <Select
                  value={formData.assigned_role}
                  onValueChange={(value) => setFormData({ ...formData, assigned_role: value })}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {roles.map(role => (
                      <SelectItem key={role.value} value={role.value} className="text-white">
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Duration & Documentation */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estimated Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={formData.estimated_duration_minutes}
                  onChange={(e) => setFormData({ ...formData, estimated_duration_minutes: parseInt(e.target.value) })}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="documentation"
                  checked={formData.documentation_required}
                  onCheckedChange={(checked) => setFormData({ ...formData, documentation_required: checked })}
                  className="border-gray-600"
                />
                <label htmlFor="documentation" className="ml-2 text-sm text-gray-300 cursor-pointer">
                  Documentation Required
                </label>
              </div>
            </div>

            {/* Checklist Items */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Checklist Items
              </label>
              <div className="space-y-2">
                {formData.checklist_items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-900 rounded p-2">
                    <span className="flex-1 text-gray-300 text-sm">{item}</span>
                    <Button
                      onClick={() => handleRemoveChecklistItem(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                    placeholder="Add checklist item..."
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                  <Button onClick={handleAddChecklistItem} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Success Criteria */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Success Criteria
              </label>
              <Input
                value={formData.success_criteria || ''}
                onChange={(e) => setFormData({ ...formData, success_criteria: e.target.value })}
                placeholder="What indicates this step is complete?"
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>

            {/* Automation Config (if automated) */}
            {(formData.action_type === 'automated' || formData.action_type === 'hybrid') && (
              <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-400" />
                  SOAR Automation Configuration
                </h4>
                <div className="space-y-3">
                  {availableSOARPlaybooks.length > 0 ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Link to SOAR Playbook
                      </label>
                      <Select
                        value={formData.automation_config?.soar_playbook_id || ''}
                        onValueChange={(value) => setFormData({
                          ...formData,
                          automation_config: { 
                            ...formData.automation_config, 
                            soar_playbook_id: value,
                            integration_name: availableSOARPlaybooks.find(p => p.id === value)?.playbook_name || ''
                          }
                        })}
                      >
                        <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                          <SelectValue placeholder="Select SOAR Playbook..." />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value={null} className="text-gray-400">None</SelectItem> {/* Changed to empty string to properly clear selection */}
                          {availableSOARPlaybooks.map(playbook => (
                            <SelectItem key={playbook.id} value={playbook.id} className="text-white">
                              {playbook.playbook_name} ({playbook.category?.replace(/_/g, ' ')})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.automation_config?.soar_playbook_id && (
                        <p className="text-green-400 text-xs mt-2">
                          ✓ Linked to SOAR playbook
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                      <p className="text-blue-300 text-sm">
                        💡 Create SOAR playbooks in the SOAR section to enable automation
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Or specify integration manually
                    </label>
                    <Input
                      placeholder="Integration Name (e.g., firewall, edr)"
                      value={formData.automation_config?.integration_name || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        automation_config: { ...formData.automation_config, integration_name: e.target.value }
                      })}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <Input
                    placeholder="Action Name (e.g., block_ip, isolate_host)"
                    value={formData.automation_config?.action_name || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      automation_config: { ...formData.automation_config, action_name: e.target.value }
                    })}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
