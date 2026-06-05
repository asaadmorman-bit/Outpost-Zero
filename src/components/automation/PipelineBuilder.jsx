import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Save } from 'lucide-react';
import { CIPipeline } from '@/entities/CIPipeline';

export default function PipelineBuilder({ onClose }) {
  const [pipeline, setPipeline] = useState({
    name: '',
    description: '',
    pipeline_type: 'integrations',
    repository_url: '',
    branch: 'staging',
    trigger_conditions: ['code_commit'],
    stages: [],
    security_gates: [],
    auto_rollback_enabled: true,
    notification_recipients: []
  });

  const [newStage, setNewStage] = useState({
    stage_name: '',
    stage_type: 'test',
    commands: [''],
    success_criteria: ''
  });

  const addStage = () => {
    if (newStage.stage_name) {
      setPipeline({
        ...pipeline,
        stages: [...pipeline.stages, { ...newStage, commands: newStage.commands.filter(c => c) }]
      });
      setNewStage({
        stage_name: '',
        stage_type: 'test',
        commands: [''],
        success_criteria: ''
      });
    }
  };

  const removeStage = (index) => {
    setPipeline({
      ...pipeline,
      stages: pipeline.stages.filter((_, i) => i !== index)
    });
  };

  const addSecurityGate = () => {
    setPipeline({
      ...pipeline,
      security_gates: [
        ...pipeline.security_gates,
        { gate_name: '', gate_type: 'sast', threshold: 0, required: true }
      ]
    });
  };

  const updateSecurityGate = (index, field, value) => {
    const updated = [...pipeline.security_gates];
    updated[index][field] = value;
    setPipeline({ ...pipeline, security_gates: updated });
  };

  const removeSecurityGate = (index) => {
    setPipeline({
      ...pipeline,
      security_gates: pipeline.security_gates.filter((_, i) => i !== index)
    });
  };

  const savePipeline = async () => {
    try {
      await CIPipeline.create({
        ...pipeline,
        pipeline_id: `pipeline_${Date.now()}`
      });
      alert('Pipeline created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating pipeline:', error);
      alert('Failed to create pipeline. Check console for details.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl bg-gray-900 border-gray-700 my-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Create CI/CD Pipeline</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-white">Pipeline Name</Label>
              <Input
                id="name"
                value={pipeline.name}
                onChange={(e) => setPipeline({ ...pipeline, name: e.target.value })}
                placeholder="My Pipeline"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="branch" className="text-white">Branch</Label>
              <Input
                id="branch"
                value={pipeline.branch}
                onChange={(e) => setPipeline({ ...pipeline, branch: e.target.value })}
                placeholder="staging"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={pipeline.description}
              onChange={(e) => setPipeline({ ...pipeline, description: e.target.value })}
              placeholder="Pipeline description..."
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="repo" className="text-white">Repository URL</Label>
            <Input
              id="repo"
              value={pipeline.repository_url}
              onChange={(e) => setPipeline({ ...pipeline, repository_url: e.target.value })}
              placeholder="https://github.com/org/repo"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Stages */}
          <div>
            <h3 className="text-white font-semibold mb-3">Pipeline Stages</h3>
            <div className="space-y-3 mb-4">
              {pipeline.stages.map((stage, index) => (
                <Card key={index} className="border-gray-700 bg-gray-800/50">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{stage.stage_name}</h4>
                        <p className="text-gray-400 text-sm">Type: {stage.stage_type}</p>
                        <p className="text-gray-400 text-sm">Commands: {stage.commands.length}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStage(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-gray-700 bg-gray-800/50">
              <CardContent className="pt-4 space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white">Stage Name</Label>
                    <Input
                      value={newStage.stage_name}
                      onChange={(e) => setNewStage({ ...newStage, stage_name: e.target.value })}
                      placeholder="Build"
                      className="bg-gray-900 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Stage Type</Label>
                    <Select
                      value={newStage.stage_type}
                      onValueChange={(value) => setNewStage({ ...newStage, stage_type: value })}
                    >
                      <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="test">Test</SelectItem>
                        <SelectItem value="security_scan">Security Scan</SelectItem>
                        <SelectItem value="deploy">Deploy</SelectItem>
                        <SelectItem value="validate">Validate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-white">Commands (one per line)</Label>
                  <Textarea
                    value={newStage.commands.join('\n')}
                    onChange={(e) => setNewStage({ ...newStage, commands: e.target.value.split('\n') })}
                    placeholder="npm run test"
                    className="bg-gray-900 border-gray-600 text-white"
                  />
                </div>
                <Button onClick={addStage} variant="outline" className="w-full border-gray-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stage
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Security Gates */}
          <div>
            <h3 className="text-white font-semibold mb-3">Security Gates</h3>
            <div className="space-y-3 mb-4">
              {pipeline.security_gates.map((gate, index) => (
                <Card key={index} className="border-gray-700 bg-gray-800/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <Input
                        value={gate.gate_name}
                        onChange={(e) => updateSecurityGate(index, 'gate_name', e.target.value)}
                        placeholder="Gate Name"
                        className="bg-gray-900 border-gray-600 text-white flex-1"
                      />
                      <Select
                        value={gate.gate_type}
                        onValueChange={(value) => updateSecurityGate(index, 'gate_type', value)}
                      >
                        <SelectTrigger className="bg-gray-900 border-gray-600 text-white w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sast">SAST</SelectItem>
                          <SelectItem value="dast">DAST</SelectItem>
                          <SelectItem value="dependency_check">Dependency Check</SelectItem>
                          <SelectItem value="secrets_scan">Secrets Scan</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSecurityGate(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button onClick={addSecurityGate} variant="outline" className="w-full border-gray-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Security Gate
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button onClick={onClose} variant="outline" className="flex-1 border-gray-600 text-white">
              Cancel
            </Button>
            <Button onClick={savePipeline} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Create Pipeline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}