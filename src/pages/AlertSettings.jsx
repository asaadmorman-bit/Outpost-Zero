import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAlerts } from '../components/alerts/AlertProvider';
import { 
  Bell, Webhook, Plus, Trash2, Save, TestTube2, 
  Slack, Send, MessageSquare, Zap, CheckCircle, XCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AlertSettings() {
  const { config, saveAlertConfig, triggerAlert } = useAlerts();
  const [localConfig, setLocalConfig] = useState(config);
  const [showAddWebhook, setShowAddWebhook] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(null);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    type: 'slack',
    url: '',
    enabled: true,
    headers: {}
  });

  const webhookTypes = [
    { id: 'slack', name: 'Slack', icon: Slack, description: 'Send alerts to Slack channels' },
    { id: 'pagerduty', name: 'PagerDuty', icon: Bell, description: 'Create PagerDuty incidents' },
    { id: 'teams', name: 'Microsoft Teams', icon: MessageSquare, description: 'Post to Teams channels' },
    { id: 'discord', name: 'Discord', icon: MessageSquare, description: 'Send to Discord webhooks' },
    { id: 'generic', name: 'Generic Webhook', icon: Webhook, description: 'Custom HTTP webhook' }
  ];

  const handleSave = async () => {
    await saveAlertConfig(localConfig);
  };

  const handleAddWebhook = () => {
    setLocalConfig({
      ...localConfig,
      webhooks: [...localConfig.webhooks, { ...newWebhook, id: Date.now() }]
    });
    setNewWebhook({
      name: '',
      type: 'slack',
      url: '',
      enabled: true,
      headers: {}
    });
    setShowAddWebhook(false);
  };

  const handleRemoveWebhook = (webhookId) => {
    setLocalConfig({
      ...localConfig,
      webhooks: localConfig.webhooks.filter(w => w.id !== webhookId)
    });
  };

  const handleTestWebhook = async (webhook) => {
    setTestingWebhook(webhook.id);
    
    await triggerAlert({
      title: '🧪 Test Alert',
      message: `This is a test alert from Outpost Zero to verify your ${webhook.name} webhook integration.`,
      severity: 'medium',
      type: 'system',
      source: 'Alert Settings',
      metadata: { test: true }
    });

    setTimeout(() => setTestingWebhook(null), 2000);
  };

  const handleTestAlert = async (severity) => {
    await triggerAlert({
      title: `Test ${severity.toUpperCase()} Alert`,
      message: `This is a test ${severity} severity alert to preview how alerts will appear.`,
      severity: severity,
      type: 'security',
      source: 'Alert Settings Test',
      actionUrl: '/Incidents'
    });
  };

  const getWebhookIcon = (type) => {
    const icon = webhookTypes.find(t => t.id === type)?.icon || Webhook;
    return icon;
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Alert Settings</h1>
          <p className="text-xl text-gray-300">
            Configure real-time notifications and webhook integrations
          </p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />
                General Alert Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Toast Notifications</Label>
                  <p className="text-sm text-gray-400">Show pop-up notifications for alerts</p>
                </div>
                <Switch
                  checked={localConfig.toast_enabled}
                  onCheckedChange={(checked) => 
                    setLocalConfig({ ...localConfig, toast_enabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Auto Dismiss</Label>
                  <p className="text-sm text-gray-400">Automatically dismiss toast notifications</p>
                </div>
                <Switch
                  checked={localConfig.auto_dismiss}
                  onCheckedChange={(checked) => 
                    setLocalConfig({ ...localConfig, auto_dismiss: checked })
                  }
                />
              </div>

              {localConfig.auto_dismiss && (
                <div>
                  <Label className="text-white">Dismiss After (seconds)</Label>
                  <Input
                    type="number"
                    value={localConfig.dismiss_after_seconds}
                    onChange={(e) => 
                      setLocalConfig({ 
                        ...localConfig, 
                        dismiss_after_seconds: parseInt(e.target.value) 
                      })
                    }
                    className="bg-gray-900 border-gray-700 text-white w-32 mt-2"
                  />
                </div>
              )}

              <div>
                <Label className="text-white">Severity Threshold</Label>
                <p className="text-sm text-gray-400 mb-2">
                  Only show alerts at or above this severity level
                </p>
                <Select
                  value={localConfig.severity_threshold}
                  onValueChange={(value) => 
                    setLocalConfig({ ...localConfig, severity_threshold: value })
                  }
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="low">Low & Above</SelectItem>
                    <SelectItem value="medium">Medium & Above</SelectItem>
                    <SelectItem value="high">High & Above</SelectItem>
                    <SelectItem value="critical">Critical Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <Label className="text-white mb-3 block">Test Alerts</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestAlert('low')}
                    className="border-blue-600 text-blue-300 hover:bg-blue-600/10"
                  >
                    Test Low
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestAlert('medium')}
                    className="border-yellow-600 text-yellow-300 hover:bg-yellow-600/10"
                  >
                    Test Medium
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestAlert('high')}
                    className="border-orange-600 text-orange-300 hover:bg-orange-600/10"
                  >
                    Test High
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestAlert('critical')}
                    className="border-red-600 text-red-300 hover:bg-red-600/10"
                  >
                    Test Critical
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Webhook Integrations */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Webhook className="w-5 h-5 text-purple-400" />
                  Webhook Integrations
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-white text-sm">Enable Webhooks</Label>
                    <Switch
                      checked={localConfig.webhook_enabled}
                      onCheckedChange={(checked) => 
                        setLocalConfig({ ...localConfig, webhook_enabled: checked })
                      }
                    />
                  </div>
                  <Button
                    onClick={() => setShowAddWebhook(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Webhook
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {localConfig.webhooks.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Webhook className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No webhooks configured</p>
                  <p className="text-sm mt-1">Add a webhook to send alerts to external systems</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {localConfig.webhooks.map((webhook) => {
                    const Icon = getWebhookIcon(webhook.type);
                    return (
                      <div
                        key={webhook.id}
                        className="p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <Icon className="w-6 h-6 text-purple-400 mt-1" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white font-semibold">{webhook.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {webhook.type}
                                </Badge>
                                {webhook.enabled ? (
                                  <Badge className="bg-green-600/20 text-green-300 text-xs">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Enabled
                                  </Badge>
                                ) : (
                                  <Badge className="bg-gray-600/20 text-gray-300 text-xs">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Disabled
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-400 truncate">{webhook.url}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTestWebhook(webhook)}
                              disabled={testingWebhook === webhook.id}
                              className="border-gray-600"
                            >
                              {testingWebhook === webhook.id ? (
                                <>
                                  <Zap className="w-4 h-4 mr-2 animate-pulse" />
                                  Testing...
                                </>
                              ) : (
                                <>
                                  <TestTube2 className="w-4 h-4 mr-2" />
                                  Test
                                </>
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveWebhook(webhook.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Add Webhook Dialog */}
      <Dialog open={showAddWebhook} onOpenChange={setShowAddWebhook}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Webhook Integration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Webhook Type</Label>
              <Select
                value={newWebhook.type}
                onValueChange={(value) => setNewWebhook({ ...newWebhook, type: value })}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700 mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {webhookTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">
                {webhookTypes.find(t => t.id === newWebhook.type)?.description}
              </p>
            </div>

            <div>
              <Label>Webhook Name</Label>
              <Input
                value={newWebhook.name}
                onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                placeholder="Production Alerts"
                className="bg-gray-900 border-gray-700 mt-2"
              />
            </div>

            <div>
              <Label>Webhook URL</Label>
              <Input
                value={newWebhook.url}
                onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                placeholder="https://hooks.slack.com/services/..."
                className="bg-gray-900 border-gray-700 mt-2"
              />
            </div>

            {newWebhook.type === 'pagerduty' && (
              <div>
                <Label>Integration Key</Label>
                <Input
                  value={newWebhook.integration_key || ''}
                  onChange={(e) => setNewWebhook({ ...newWebhook, integration_key: e.target.value })}
                  placeholder="Your PagerDuty integration key"
                  className="bg-gray-900 border-gray-700 mt-2"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddWebhook(false)}
                className="border-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddWebhook}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!newWebhook.name || !newWebhook.url}
              >
                Add Webhook
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}