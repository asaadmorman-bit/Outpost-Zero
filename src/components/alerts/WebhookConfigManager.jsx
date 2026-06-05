import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { 
  Plus, Save, Trash2, TestTube, CheckCircle, XCircle,
  Slack, Send, Mail, Webhook as WebhookIcon
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WebhookConfigManager() {
  const [configs, setConfigs] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [newConfig, setNewConfig] = useState({
    name: '',
    webhook_type: 'slack',
    webhook_url: '',
    enabled: true,
    alert_types: ['critical_incident'],
    severity_threshold: 'high',
    configuration: {
      channel: '',
      include_details: true
    }
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      const data = await base44.entities.AlertConfiguration.list('-created_date');
      setConfigs(data || []);
    } catch (error) {
      console.error('Error loading configs:', error);
    }
  };

  const handleSave = async () => {
    try {
      const configData = {
        config_id: editingConfig ? editingConfig.config_id : `config_${Date.now()}`,
        ...newConfig
      };

      if (editingConfig) {
        await base44.entities.AlertConfiguration.update(editingConfig.id, configData);
      } else {
        await base44.entities.AlertConfiguration.create(configData);
      }

      setShowDialog(false);
      setEditingConfig(null);
      resetForm();
      loadConfigs();
      alert('✅ Webhook configuration saved!');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error saving configuration. See console for details.');
    }
  };

  const handleDelete = async (configId) => {
    if (!confirm('Are you sure you want to delete this configuration?')) return;
    
    try {
      await base44.entities.AlertConfiguration.delete(configId);
      loadConfigs();
    } catch (error) {
      console.error('Error deleting config:', error);
    }
  };

  const handleTest = async (config) => {
    setTestResult({ status: 'testing', message: 'Sending test alert...' });
    
    try {
      const testAlert = {
        alert_id: `test_${Date.now()}`,
        alert_type: 'system_health',
        severity: 'high',
        title: 'Test Alert',
        message: 'This is a test alert from Outpost Zero',
        source: 'Webhook Test',
        details: {
          test: true,
          timestamp: new Date().toISOString()
        }
      };

      const response = await base44.functions.invoke('sendWebhookAlert', {
        alert: testAlert,
        config: config
      });

      setTestResult({ 
        status: 'success', 
        message: '✅ Test alert sent successfully!' 
      });
      
      setTimeout(() => setTestResult(null), 3000);
    } catch (error) {
      console.error('Test failed:', error);
      setTestResult({ 
        status: 'error', 
        message: `❌ Test failed: ${error.message}` 
      });
    }
  };

  const resetForm = () => {
    setNewConfig({
      name: '',
      webhook_type: 'slack',
      webhook_url: '',
      enabled: true,
      alert_types: ['critical_incident'],
      severity_threshold: 'high',
      configuration: {
        channel: '',
        include_details: true
      }
    });
  };

  const openEditDialog = (config) => {
    setEditingConfig(config);
    setNewConfig({
      name: config.name,
      webhook_type: config.webhook_type,
      webhook_url: config.webhook_url,
      enabled: config.enabled,
      alert_types: config.alert_types,
      severity_threshold: config.severity_threshold,
      configuration: config.configuration || { channel: '', include_details: true }
    });
    setShowDialog(true);
  };

  const getWebhookIcon = (type) => {
    const icons = {
      slack: Slack,
      pagerduty: Send,
      teams: Send,
      webhook: WebhookIcon,
      email: Mail
    };
    return icons[type] || WebhookIcon;
  };

  const alertTypeOptions = [
    { value: 'critical_incident', label: 'Critical Incidents' },
    { value: 'high_severity_event', label: 'High Severity Events' },
    { value: 'misconfiguration_detected', label: 'Misconfigurations' },
    { value: 'anomaly_detected', label: 'Anomalies' },
    { value: 'compliance_violation', label: 'Compliance Violations' },
    { value: 'system_health', label: 'System Health' },
    { value: 'authentication_failure', label: 'Auth Failures' },
    { value: 'data_exfiltration', label: 'Data Exfiltration' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Webhook Integrations</h2>
        <Button 
          onClick={() => {
            resetForm();
            setEditingConfig(null);
            setShowDialog(true);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Integration
        </Button>
      </div>

      {testResult && (
        <div className={`p-4 rounded-lg border ${
          testResult.status === 'success' ? 'bg-green-600/20 border-green-500/50 text-green-300' :
          testResult.status === 'error' ? 'bg-red-600/20 border-red-500/50 text-red-300' :
          'bg-blue-600/20 border-blue-500/50 text-blue-300'
        }`}>
          {testResult.message}
        </div>
      )}

      {/* Configs List */}
      <div className="grid md:grid-cols-2 gap-4">
        {configs.map((config) => {
          const Icon = getWebhookIcon(config.webhook_type);
          return (
            <Card key={config.id} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{config.name}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={config.enabled 
                          ? 'bg-green-600/20 text-green-300 border-green-500/50 mt-1'
                          : 'bg-gray-600/20 text-gray-300 border-gray-500/50 mt-1'
                        }
                      >
                        {config.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="text-gray-400 mb-1">Type:</div>
                  <Badge className="bg-blue-600/20 text-blue-300">
                    {config.webhook_type}
                  </Badge>
                </div>

                <div className="text-sm">
                  <div className="text-gray-400 mb-1">Alert Types:</div>
                  <div className="flex flex-wrap gap-1">
                    {config.alert_types.slice(0, 3).map((type, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {alertTypeOptions.find(o => o.value === type)?.label || type}
                      </Badge>
                    ))}
                    {config.alert_types.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{config.alert_types.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-sm">
                  <div className="text-gray-400 mb-1">Severity Threshold:</div>
                  <Badge className={
                    config.severity_threshold === 'critical' ? 'bg-red-600/20 text-red-300' :
                    config.severity_threshold === 'high' ? 'bg-orange-600/20 text-orange-300' :
                    'bg-yellow-600/20 text-yellow-300'
                  }>
                    {config.severity_threshold}+
                  </Badge>
                </div>

                {config.alerts_sent_today > 0 && (
                  <div className="text-sm text-gray-400">
                    Sent today: {config.alerts_sent_today}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTest(config)}
                    className="border-blue-600 text-blue-300 hover:bg-blue-600/10 flex-1"
                  >
                    <TestTube className="w-4 h-4 mr-1" />
                    Test
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(config)}
                    className="border-gray-600 flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(config.id)}
                    className="border-red-600 text-red-300 hover:bg-red-600/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingConfig ? 'Edit' : 'Add'} Webhook Integration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Integration Name</Label>
              <Input
                value={newConfig.name}
                onChange={(e) => setNewConfig({...newConfig, name: e.target.value})}
                placeholder="Production Slack Alerts"
                className="bg-gray-900 border-gray-700"
              />
            </div>

            <div>
              <Label>Webhook Type</Label>
              <Select
                value={newConfig.webhook_type}
                onValueChange={(value) => setNewConfig({...newConfig, webhook_type: value})}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="slack">Slack</SelectItem>
                  <SelectItem value="pagerduty">PagerDuty</SelectItem>
                  <SelectItem value="teams">Microsoft Teams</SelectItem>
                  <SelectItem value="webhook">Generic Webhook</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Webhook URL</Label>
              <Input
                type="password"
                value={newConfig.webhook_url}
                onChange={(e) => setNewConfig({...newConfig, webhook_url: e.target.value})}
                placeholder="https://hooks.slack.com/services/..."
                className="bg-gray-900 border-gray-700"
              />
            </div>

            {newConfig.webhook_type === 'slack' && (
              <div>
                <Label>Slack Channel (optional)</Label>
                <Input
                  value={newConfig.configuration.channel}
                  onChange={(e) => setNewConfig({
                    ...newConfig, 
                    configuration: {...newConfig.configuration, channel: e.target.value}
                  })}
                  placeholder="#security-alerts"
                  className="bg-gray-900 border-gray-700"
                />
              </div>
            )}

            <div>
              <Label>Severity Threshold</Label>
              <Select
                value={newConfig.severity_threshold}
                onValueChange={(value) => setNewConfig({...newConfig, severity_threshold: value})}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="low">Low and above</SelectItem>
                  <SelectItem value="medium">Medium and above</SelectItem>
                  <SelectItem value="high">High and above</SelectItem>
                  <SelectItem value="critical">Critical only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Alert Types</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {alertTypeOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newConfig.alert_types.includes(option.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewConfig({
                            ...newConfig, 
                            alert_types: [...newConfig.alert_types, option.value]
                          });
                        } else {
                          setNewConfig({
                            ...newConfig, 
                            alert_types: newConfig.alert_types.filter(t => t !== option.value)
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-gray-300">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newConfig.enabled}
                onChange={(e) => setNewConfig({...newConfig, enabled: e.target.checked})}
                className="rounded"
              />
              <Label>Enable this integration</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!newConfig.name || !newConfig.webhook_url || newConfig.alert_types.length === 0}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}