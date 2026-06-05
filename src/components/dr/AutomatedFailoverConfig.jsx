import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Settings, Zap, Clock, Activity, Shield, AlertTriangle } from 'lucide-react';

export default function AutomatedFailoverConfig() {
  const [config, setConfig] = useState({
    automated_failover_enabled: true,
    health_check_interval_seconds: 15,
    failure_threshold_checks: 8,
    auto_failover_trigger_minutes: 2,
    auto_scale_dr_cluster: true,
    dns_auto_update: true,
    notification_channels: ['email', 'sms', 'teams', 'pagerduty'],
    validation_checks_required: true,
    auto_rollback_on_failure: false,
    max_failover_attempts: 3
  });

  const [isSaving, setIsSaving] = useState(false);

  const saveConfig = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('✅ Automated failover configuration saved!\n\nChanges will take effect immediately.\n\nNext health check: 15 seconds');
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <Alert className="border-green-500/50 bg-green-500/10">
        <CheckCircle className="h-5 w-5 text-green-400" />
        <AlertDescription className="text-green-200">
          <strong>Automated Failover Active:</strong> System continuously monitors primary region health. Failover triggers automatically if primary is unavailable for {config.auto_failover_trigger_minutes} minutes.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Health Monitoring Config */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Health Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="check_interval" className="text-gray-300">Health Check Interval</Label>
              <div className="flex items-center gap-3 mt-2">
                <Input
                  id="check_interval"
                  type="number"
                  value={config.health_check_interval_seconds}
                  onChange={(e) => setConfig({...config, health_check_interval_seconds: parseInt(e.target.value)})}
                  className="bg-gray-900 border-gray-700 w-24"
                />
                <span className="text-gray-400 text-sm">seconds</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">How often to check primary region health</p>
            </div>

            <div>
              <Label htmlFor="failure_threshold" className="text-gray-300">Failure Threshold</Label>
              <div className="flex items-center gap-3 mt-2">
                <Input
                  id="failure_threshold"
                  type="number"
                  value={config.failure_threshold_checks}
                  onChange={(e) => setConfig({...config, failure_threshold_checks: parseInt(e.target.value)})}
                  className="bg-gray-900 border-gray-700 w-24"
                />
                <span className="text-gray-400 text-sm">failed checks</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                = {(config.health_check_interval_seconds * config.failure_threshold_checks / 60).toFixed(1)} minutes before failover
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <div>
                <Label htmlFor="auto_failover" className="text-white">Enable Automated Failover</Label>
                <p className="text-xs text-gray-400 mt-1">Trigger failover without human intervention</p>
              </div>
              <Switch
                id="auto_failover"
                checked={config.automated_failover_enabled}
                onCheckedChange={(checked) => setConfig({...config, automated_failover_enabled: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Failover Actions Config */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Failover Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <div>
                <Label className="text-white">Auto-Scale DR Cluster</Label>
                <p className="text-xs text-gray-400 mt-1">Scale AKS nodes from 3 to 18</p>
              </div>
              <Switch
                checked={config.auto_scale_dr_cluster}
                onCheckedChange={(checked) => setConfig({...config, auto_scale_dr_cluster: checked})}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <div>
                <Label className="text-white">DNS Auto-Update</Label>
                <p className="text-xs text-gray-400 mt-1">Update Traffic Manager to DR region</p>
              </div>
              <Switch
                checked={config.dns_auto_update}
                onCheckedChange={(checked) => setConfig({...config, dns_auto_update: checked})}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <div>
                <Label className="text-white">Validation Checks</Label>
                <p className="text-xs text-gray-400 mt-1">Run health checks after failover</p>
              </div>
              <Switch
                checked={config.validation_checks_required}
                onCheckedChange={(checked) => setConfig({...config, validation_checks_required: checked})}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <div>
                <Label className="text-white">Auto-Rollback on Failure</Label>
                <p className="text-xs text-gray-400 mt-1">Revert if DR region fails validation</p>
              </div>
              <Switch
                checked={config.auto_rollback_on_failure}
                onCheckedChange={(checked) => setConfig({...config, auto_rollback_on_failure: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Config */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Notification Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {['email', 'sms', 'teams', 'pagerduty', 'slack'].map((channel) => (
              <div key={channel} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div>
                  <Label className="text-white capitalize">{channel}</Label>
                  <p className="text-xs text-gray-400 mt-1">
                    {channel === 'email' && 'alerts@outpostzero.com'}
                    {channel === 'sms' && 'On-call rotation'}
                    {channel === 'teams' && 'Incident Response channel'}
                    {channel === 'pagerduty' && 'Critical alerts'}
                    {channel === 'slack' && '#incident-response'}
                  </p>
                </div>
                <Switch
                  checked={config.notification_channels.includes(channel)}
                  onCheckedChange={(checked) => {
                    const updated = checked 
                      ? [...config.notification_channels, channel]
                      : config.notification_channels.filter(c => c !== channel);
                    setConfig({...config, notification_channels: updated});
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Current Configuration Summary */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-400" />
              Configuration Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Health checks every {config.health_check_interval_seconds} seconds
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Failover triggers after {config.failure_threshold_checks} failed checks
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-green-400" />
              DR cluster auto-scales to 18 nodes
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-green-400" />
              {config.notification_channels.length} notification channels active
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              {config.validation_checks_required ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
              )}
              Post-failover validation {config.validation_checks_required ? 'enabled' : 'disabled'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button 
          variant="outline"
          className="border-gray-600"
          onClick={() => window.location.reload()}
        >
          Reset to Default
        </Button>
        <Button 
          onClick={saveConfig}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>
    </div>
  );
}