import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Save, 
  AlertTriangle, 
  Brain,
  CheckCircle,
  Info
} from 'lucide-react';

export default function RemediationRuleBuilder({ rule, onClose }) {
  const isEditing = !!rule;
  
  const [formData, setFormData] = useState(rule || {
    rule_name: '',
    description: '',
    trigger_type: 'misconfiguration',
    trigger_conditions: {
      severity: ['medium', 'high'],
      occurrence_threshold: 1,
      time_window_hours: 24
    },
    remediation_action: 'notify_team',
    approval_required: true,
    approval_workflow: {
      approval_type: 'single_approver',
      approvers: [],
      timeout_minutes: 60,
      auto_approve_after_timeout: false
    },
    ai_confidence_threshold: 85,
    enabled: true,
    risk_assessment: {
      risk_level: 'low',
      impact_scope: 'single_system',
      reversible: true,
      rollback_procedure: ''
    }
  });

  const [approverEmail, setApproverEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const ruleData = {
      ...formData,
      rule_id: formData.rule_id || `rule_${Date.now()}`,
    };

    try {
      if (isEditing) {
        await base44.entities.RemediationRule.update(rule.id, ruleData);
        alert('✅ Remediation rule updated successfully!');
      } else {
        await base44.entities.RemediationRule.create(ruleData);
        alert('✅ Remediation rule created successfully!');
      }
      onClose();
    } catch (error) {
      console.error('Error saving rule:', error);
      alert(`❌ Error saving rule: ${error.message}\n\nDemo mode: Rule would be saved in production.`);
      onClose();
    }
  };

  const addApprover = () => {
    if (approverEmail && !formData.approval_workflow.approvers.includes(approverEmail)) {
      setFormData({
        ...formData,
        approval_workflow: {
          ...formData.approval_workflow,
          approvers: [...formData.approval_workflow.approvers, approverEmail]
        }
      });
      setApproverEmail('');
    }
  };

  const removeApprover = (email) => {
    setFormData({
      ...formData,
      approval_workflow: {
        ...formData.approval_workflow,
        approvers: formData.approval_workflow.approvers.filter(a => a !== email)
      }
    });
  };

  const toggleSeverity = (severity) => {
    const current = formData.trigger_conditions.severity || [];
    const updated = current.includes(severity)
      ? current.filter(s => s !== severity)
      : [...current, severity];
    
    setFormData({
      ...formData,
      trigger_conditions: {
        ...formData.trigger_conditions,
        severity: updated
      }
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Remediation Rule' : 'Create Remediation Rule'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="rule_name">Rule Name *</Label>
                <Input
                  id="rule_name"
                  value={formData.rule_name}
                  onChange={(e) => setFormData({...formData, rule_name: e.target.value})}
                  placeholder="Auto-Block Malicious IPs"
                  className="bg-gray-900 border-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe what this rule does"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Trigger Conditions */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Trigger Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="trigger_type">Trigger Type *</Label>
                <Select
                  value={formData.trigger_type}
                  onValueChange={(value) => setFormData({...formData, trigger_type: value})}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="misconfiguration">Misconfiguration</SelectItem>
                    <SelectItem value="security_event">Security Event</SelectItem>
                    <SelectItem value="vulnerability">Vulnerability</SelectItem>
                    <SelectItem value="compliance_violation">Compliance Violation</SelectItem>
                    <SelectItem value="user_behavior_anomaly">User Behavior Anomaly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Severity Levels</Label>
                <div className="flex gap-2 mt-2">
                  {['low', 'medium', 'high', 'critical'].map((severity) => (
                    <Badge
                      key={severity}
                      onClick={() => toggleSeverity(severity)}
                      className={`cursor-pointer ${
                        formData.trigger_conditions.severity?.includes(severity)
                          ? 'bg-blue-600'
                          : 'bg-gray-700'
                      }`}
                    >
                      {severity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="occurrence_threshold">Occurrence Threshold</Label>
                  <Input
                    id="occurrence_threshold"
                    type="number"
                    min="1"
                    value={formData.trigger_conditions.occurrence_threshold}
                    onChange={(e) => setFormData({
                      ...formData,
                      trigger_conditions: {
                        ...formData.trigger_conditions,
                        occurrence_threshold: parseInt(e.target.value)
                      }
                    })}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">Number of occurrences before triggering</p>
                </div>

                <div>
                  <Label htmlFor="time_window_hours">Time Window (hours)</Label>
                  <Input
                    id="time_window_hours"
                    type="number"
                    min="1"
                    value={formData.trigger_conditions.time_window_hours}
                    onChange={(e) => setFormData({
                      ...formData,
                      trigger_conditions: {
                        ...formData.trigger_conditions,
                        time_window_hours: parseInt(e.target.value)
                      }
                    })}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">Time window for counting occurrences</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Remediation Action */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Remediation Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="remediation_action">Action to Take *</Label>
                <Select
                  value={formData.remediation_action}
                  onValueChange={(value) => setFormData({...formData, remediation_action: value})}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="block_ip">Block IP Address</SelectItem>
                    <SelectItem value="isolate_endpoint">Isolate Endpoint</SelectItem>
                    <SelectItem value="disable_user_account">Disable User Account</SelectItem>
                    <SelectItem value="reset_password">Reset Password</SelectItem>
                    <SelectItem value="revoke_privileges">Revoke Privileges</SelectItem>
                    <SelectItem value="quarantine_file">Quarantine File</SelectItem>
                    <SelectItem value="update_firewall_rule">Update Firewall Rule</SelectItem>
                    <SelectItem value="restart_service">Restart Service</SelectItem>
                    <SelectItem value="update_configuration">Update Configuration</SelectItem>
                    <SelectItem value="notify_team">Notify Team</SelectItem>
                    <SelectItem value="create_ticket">Create Ticket</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ai_confidence_threshold">AI Confidence Threshold (%)</Label>
                <Input
                  id="ai_confidence_threshold"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.ai_confidence_threshold}
                  onChange={(e) => setFormData({...formData, ai_confidence_threshold: parseInt(e.target.value)})}
                  className="bg-gray-900 border-gray-700 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">Minimum AI confidence required to trigger remediation</p>
              </div>
            </CardContent>
          </Card>

          {/* Approval Workflow */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Approval Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="approval_required"
                  checked={formData.approval_required}
                  onChange={(e) => setFormData({...formData, approval_required: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <Label htmlFor="approval_required">Require human approval before remediation</Label>
              </div>

              {formData.approval_required && (
                <>
                  <div>
                    <Label htmlFor="approval_type">Approval Type</Label>
                    <Select
                      value={formData.approval_workflow.approval_type}
                      onValueChange={(value) => setFormData({
                        ...formData,
                        approval_workflow: {...formData.approval_workflow, approval_type: value}
                      })}
                    >
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="single_approver">Single Approver</SelectItem>
                        <SelectItem value="multi_approver">Multiple Approvers (All)</SelectItem>
                        <SelectItem value="automatic">Automatic (No Approval)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Approvers</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={approverEmail}
                        onChange={(e) => setApproverEmail(e.target.value)}
                        placeholder="approver@company.com"
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                      <Button
                        type="button"
                        onClick={addApprover}
                        variant="outline"
                        className="border-gray-600"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.approval_workflow.approvers.map((email) => (
                        <Badge
                          key={email}
                          className="bg-blue-600 cursor-pointer"
                          onClick={() => removeApprover(email)}
                        >
                          {email} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="timeout_minutes">Approval Timeout (minutes)</Label>
                    <Input
                      id="timeout_minutes"
                      type="number"
                      min="5"
                      value={formData.approval_workflow.timeout_minutes}
                      onChange={(e) => setFormData({
                        ...formData,
                        approval_workflow: {
                          ...formData.approval_workflow,
                          timeout_minutes: parseInt(e.target.value)
                        }
                      })}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="auto_approve_after_timeout"
                      checked={formData.approval_workflow.auto_approve_after_timeout}
                      onChange={(e) => setFormData({
                        ...formData,
                        approval_workflow: {
                          ...formData.approval_workflow,
                          auto_approve_after_timeout: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="auto_approve_after_timeout">Auto-approve after timeout</Label>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="risk_level">Risk Level</Label>
                <Select
                  value={formData.risk_assessment.risk_level}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    risk_assessment: {...formData.risk_assessment, risk_level: value}
                  })}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="impact_scope">Impact Scope</Label>
                <Select
                  value={formData.risk_assessment.impact_scope}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    risk_assessment: {...formData.risk_assessment, impact_scope: value}
                  })}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="single_user">Single User</SelectItem>
                    <SelectItem value="single_system">Single System</SelectItem>
                    <SelectItem value="multiple_systems">Multiple Systems</SelectItem>
                    <SelectItem value="organization_wide">Organization Wide</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="reversible"
                  checked={formData.risk_assessment.reversible}
                  onChange={(e) => setFormData({
                    ...formData,
                    risk_assessment: {...formData.risk_assessment, reversible: e.target.checked}
                  })}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <Label htmlFor="reversible">Action is reversible (can be rolled back)</Label>
              </div>

              {formData.risk_assessment.reversible && (
                <div>
                  <Label htmlFor="rollback_procedure">Rollback Procedure</Label>
                  <Input
                    id="rollback_procedure"
                    value={formData.risk_assessment.rollback_procedure}
                    onChange={(e) => setFormData({
                      ...formData,
                      risk_assessment: {
                        ...formData.risk_assessment,
                        rollback_procedure: e.target.value
                      }
                    })}
                    placeholder="How to rollback this action"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Warning for High-Risk Actions */}
          {formData.risk_assessment.risk_level === 'high' && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">
                <strong>High Risk Action:</strong> This remediation may have significant impact. Consider requiring approval and thorough testing.
              </AlertDescription>
            </Alert>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Update Rule' : 'Create Rule'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}