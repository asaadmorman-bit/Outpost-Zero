import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { X, Save, Zap } from 'lucide-react';

export default function TriggerConfig({ onSave, onCancel }) {
  const [triggerType, setTriggerType] = useState('incident_created');
  const [conditions, setConditions] = useState({});

  const triggerTypes = [
    { value: 'incident_created', label: 'Incident Created' },
    { value: 'alert_generated', label: 'Alert Generated' },
    { value: 'threat_detected', label: 'Threat Detected' },
    { value: 'user_behavior_anomaly', label: 'User Behavior Anomaly' },
    { value: 'compliance_violation', label: 'Compliance Violation' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'manual', label: 'Manual Trigger' },
    { value: 'integration_event', label: 'Integration Event' }
  ];

  const handleSave = () => {
    const trigger = `${triggerType}${conditions.severity ? ` (severity: ${conditions.severity})` : ''}${conditions.type ? ` (type: ${conditions.type})` : ''}`;
    onSave(trigger);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="border-gray-700 bg-gray-800 max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Configure Trigger
            </CardTitle>
            <Button onClick={onCancel} variant="ghost" size="sm" className="text-gray-400">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Trigger Type
            </label>
            <Select value={triggerType} onValueChange={setTriggerType}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {triggerTypes.map(type => (
                  <SelectItem key={type.value} value={type.value} className="text-white">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Fields based on trigger type */}
          {(triggerType === 'incident_created' || triggerType === 'alert_generated') && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Severity Filter (optional)
              </label>
              <Select 
                value={conditions.severity || ''} 
                onValueChange={(value) => setConditions({ ...conditions, severity: value })}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Any severity" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value={null} className="text-white">Any severity</SelectItem>
                  <SelectItem value="low" className="text-white">Low</SelectItem>
                  <SelectItem value="medium" className="text-white">Medium</SelectItem>
                  <SelectItem value="high" className="text-white">High</SelectItem>
                  <SelectItem value="critical" className="text-white">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {triggerType === 'threat_detected' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Threat Type (optional)
              </label>
              <Input
                value={conditions.type || ''}
                onChange={(e) => setConditions({ ...conditions, type: e.target.value })}
                placeholder="e.g., malware, phishing, ransomware"
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>
          )}

          {triggerType === 'scheduled' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Schedule (cron expression)
              </label>
              <Input
                value={conditions.schedule || ''}
                onChange={(e) => setConditions({ ...conditions, schedule: e.target.value })}
                placeholder="e.g., 0 0 * * * (daily at midnight)"
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>
          )}

          {/* Preview */}
          <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
            <h4 className="text-purple-300 font-medium mb-2 text-sm">Trigger Preview:</h4>
            <Badge className="bg-purple-500/20 text-purple-300">
              {triggerType.replace(/_/g, ' ')}
              {conditions.severity && ` (severity: ${conditions.severity})`}
              {conditions.type && ` (type: ${conditions.type})`}
              {conditions.schedule && ` (schedule: ${conditions.schedule})`}
            </Badge>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onCancel} variant="outline" className="flex-1 border-gray-600 text-gray-300">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-purple-600 hover:bg-purple-700">
              <Save className="w-4 h-4 mr-2" />
              Add Trigger
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}