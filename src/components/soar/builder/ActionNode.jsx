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
import { X, Save, Settings, Plus, Trash2 } from 'lucide-react';

export default function ActionNode({ action, onUpdate, onClose }) {
  const [localAction, setLocalAction] = useState(action);
  const [newParamKey, setNewParamKey] = useState('');
  const [newParamValue, setNewParamValue] = useState('');

  const integrations = [
    { value: 'firewall', label: 'Firewall' },
    { value: 'edr', label: 'EDR Platform' },
    { value: 'active_directory', label: 'Active Directory' },
    { value: 'email_gateway', label: 'Email Gateway' },
    { value: 'siem', label: 'SIEM' },
    { value: 'ticketing', label: 'Ticketing System' },
    { value: 'network_switch', label: 'Network Switch' },
    { value: 'cloud_provider', label: 'Cloud Provider' }
  ];

  const handleAddParameter = () => {
    if (!newParamKey.trim() || !newParamValue.trim()) return;
    
    setLocalAction({
      ...localAction,
      parameters: {
        ...localAction.parameters,
        [newParamKey]: newParamValue
      }
    });
    setNewParamKey('');
    setNewParamValue('');
  };

  const handleRemoveParameter = (key) => {
    const newParams = { ...localAction.parameters };
    delete newParams[key];
    setLocalAction({
      ...localAction,
      parameters: newParams
    });
  };

  const handleSave = () => {
    onUpdate(localAction);
    onClose();
  };

  return (
    <Card className="border-blue-700 bg-gray-800/50 border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            Configure Action: {action.step_name}
          </CardTitle>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-400">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Step Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Step Name
          </label>
          <Input
            value={localAction.step_name}
            onChange={(e) => setLocalAction({ ...localAction, step_name: e.target.value })}
            className="bg-gray-900 border-gray-700 text-white"
          />
        </div>

        {/* Integration */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Integration
          </label>
          <Select
            value={localAction.integration_id || ''}
            onValueChange={(value) => setLocalAction({ ...localAction, integration_id: value })}
          >
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Select integration..." />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value={null} className="text-white">None (manual)</SelectItem>
              {integrations.map(int => (
                <SelectItem key={int.value} value={int.value} className="text-white">
                  {int.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timeout */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Timeout (seconds)
          </label>
          <Input
            type="number"
            value={localAction.timeout}
            onChange={(e) => setLocalAction({ ...localAction, timeout: parseInt(e.target.value) })}
            className="bg-gray-900 border-gray-700 text-white"
          />
        </div>

        {/* Parameters */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Parameters
          </label>
          
          {/* Existing Parameters */}
          {localAction.parameters && Object.keys(localAction.parameters).length > 0 && (
            <div className="space-y-2 mb-3">
              {Object.entries(localAction.parameters).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 bg-gray-900/50 rounded p-2">
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {key}
                  </Badge>
                  <span className="flex-1 text-gray-300 text-sm">{String(value)}</span>
                  <Button
                    onClick={() => handleRemoveParameter(key)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Parameter */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Parameter name"
                value={newParamKey}
                onChange={(e) => setNewParamKey(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
              />
              <Input
                placeholder="Value"
                value={newParamValue}
                onChange={(e) => setNewParamValue(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
              />
              <Button
                onClick={handleAddParameter}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Learning Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Learning Weight (0-1)
          </label>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={localAction.learning_weight}
            onChange={(e) => setLocalAction({ ...localAction, learning_weight: parseFloat(e.target.value) })}
            className="bg-gray-900 border-gray-700 text-white"
          />
          <p className="text-gray-500 text-xs mt-1">
            How much this action contributes to automated learning (higher = more influence)
          </p>
        </div>

        {/* Save Button */}
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <Button onClick={onClose} variant="outline" className="flex-1 border-gray-600 text-gray-300">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}