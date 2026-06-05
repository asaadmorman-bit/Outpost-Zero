import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { 
    Plus, 
    Trash2, 
    ArrowDown, 
    Save, 
    Play,
    Shield,
    Ban,
    UserX,
    FileText,
    Bell,
    Search,
    Zap
} from 'lucide-react';
import { SOARPlaybook } from '@/entities/all';
import { toast } from 'sonner';

const actionTypeIcons = {
    isolate_host: Shield,
    block_ip: Ban,
    disable_user: UserX,
    collect_artifacts: FileText,
    notify_team: Bell,
    create_ticket: FileText,
    run_scan: Search,
    analyze_quantum_risk: Zap
};

export default function VisualPlaybookBuilder({ existingPlaybook, onClose }) {
    const [playbookName, setPlaybookName] = useState(existingPlaybook?.playbook_name || '');
    const [description, setDescription] = useState(existingPlaybook?.description || '');
    const [category, setCategory] = useState(existingPlaybook?.category || 'incident_response');
    const [triggerConditions, setTriggerConditions] = useState(existingPlaybook?.trigger_conditions || []);
    const [steps, setSteps] = useState(existingPlaybook?.automation_steps || []);
    const [newTrigger, setNewTrigger] = useState('');
    const [showStepDialog, setShowStepDialog] = useState(false);
    const [currentStep, setCurrentStep] = useState(null);

    const addTrigger = () => {
        if (newTrigger && !triggerConditions.includes(newTrigger)) {
            setTriggerConditions([...triggerConditions, newTrigger]);
            setNewTrigger('');
        }
    };

    const removeTrigger = (trigger) => {
        setTriggerConditions(triggerConditions.filter(t => t !== trigger));
    };

    const addStep = (step) => {
        setSteps([...steps, { ...step, step_number: steps.length + 1 }]);
        setShowStepDialog(false);
        setCurrentStep(null);
    };

    const removeStep = (index) => {
        const newSteps = steps.filter((_, i) => i !== index);
        // Renumber steps
        const renumberedSteps = newSteps.map((step, i) => ({ ...step, step_number: i + 1 }));
        setSteps(renumberedSteps);
    };

    const moveStep = (index, direction) => {
        const newSteps = [...steps];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < steps.length) {
            [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
            const renumberedSteps = newSteps.map((step, i) => ({ ...step, step_number: i + 1 }));
            setSteps(renumberedSteps);
        }
    };

    const savePlaybook = async () => {
        if (!playbookName || !description || steps.length === 0) {
            toast.error('Please fill in all required fields and add at least one step');
            return;
        }

        try {
            const playbookData = {
                playbook_name: playbookName,
                description: description,
                category: category,
                trigger_conditions: triggerConditions,
                automation_steps: steps,
                severity_mapping: ['medium', 'high', 'critical'],
                active: true,
                pre_built_template: false
            };

            if (existingPlaybook) {
                await SOARPlaybook.update(existingPlaybook.id, playbookData);
                toast.success('Playbook updated successfully');
            } else {
                await SOARPlaybook.create(playbookData);
                toast.success('Playbook created successfully');
            }

            if (onClose) onClose();
        } catch (error) {
            toast.error('Failed to save playbook: ' + error.message);
            console.error('Save playbook error:', error);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white">Playbook Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="playbook-name" className="text-white">Playbook Name</Label>
                        <Input
                            id="playbook-name"
                            value={playbookName}
                            onChange={(e) => setPlaybookName(e.target.value)}
                            placeholder="e.g., Ransomware Auto-Response"
                            className="bg-gray-900 border-gray-600 text-white mt-2"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-white">Description</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what this playbook does..."
                            className="bg-gray-900 border-gray-600 text-white mt-2"
                        />
                    </div>

                    <div>
                        <Label htmlFor="category" className="text-white">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger id="category" className="bg-gray-900 border-gray-600 text-white mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700">
                                <SelectItem value="incident_response">Incident Response</SelectItem>
                                <SelectItem value="vulnerability_management">Vulnerability Management</SelectItem>
                                <SelectItem value="threat_hunting">Threat Hunting</SelectItem>
                                <SelectItem value="compliance">Compliance</SelectItem>
                                <SelectItem value="user_management">User Management</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-white">Trigger Conditions</Label>
                        <div className="flex gap-2 mt-2">
                            <Input
                                value={newTrigger}
                                onChange={(e) => setNewTrigger(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addTrigger()}
                                placeholder="e.g., ransomware_detected"
                                className="bg-gray-900 border-gray-600 text-white"
                            />
                            <Button onClick={addTrigger} size="icon" className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {triggerConditions.map((trigger, index) => (
                                <Badge key={index} className="bg-blue-500/20 text-blue-300 flex items-center gap-2">
                                    {trigger}
                                    <button onClick={() => removeTrigger(trigger)} className="hover:text-red-400">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-white">Automation Steps</CardTitle>
                    <Dialog open={showStepDialog} onOpenChange={setShowStepDialog}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Step
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-700">
                            <DialogHeader>
                                <DialogTitle className="text-white">Add Automation Step</DialogTitle>
                            </DialogHeader>
                            <StepForm onSave={addStep} onCancel={() => setShowStepDialog(false)} />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {steps.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No automation steps yet</p>
                            <p className="text-sm mt-2">Click "Add Step" to start building your playbook</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {steps.map((step, index) => {
                                const IconComponent = actionTypeIcons[step.action_type] || Zap;
                                return (
                                    <div key={index}>
                                        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-full">
                                                        <span className="text-blue-400 font-semibold text-sm">{step.step_number}</span>
                                                    </div>
                                                    <IconComponent className="w-5 h-5 text-blue-400" />
                                                    <div>
                                                        <h4 className="text-white font-medium">{step.step_name}</h4>
                                                        <p className="text-gray-400 text-xs mt-1">
                                                            Action: {step.action_type.replace(/_/g, ' ')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {index > 0 && (
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => moveStep(index, 'up')}
                                                            className="text-gray-400"
                                                        >
                                                            ↑
                                                        </Button>
                                                    )}
                                                    {index < steps.length - 1 && (
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => moveStep(index, 'down')}
                                                            className="text-gray-400"
                                                        >
                                                            ↓
                                                        </Button>
                                                    )}
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => removeStep(index)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {step.role_responsible && (
                                                <div className="mt-2 text-xs text-gray-500">
                                                    Responsible: {step.role_responsible}
                                                </div>
                                            )}
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className="flex justify-center py-2">
                                                <ArrowDown className="w-4 h-4 text-gray-600" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
                {onClose && (
                    <Button variant="outline" onClick={onClose} className="border-gray-700 text-gray-300">
                        Cancel
                    </Button>
                )}
                <Button onClick={savePlaybook} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Playbook
                </Button>
            </div>
        </div>
    );
}

function StepForm({ onSave, onCancel }) {
    const [stepName, setStepName] = useState('');
    const [actionType, setActionType] = useState('isolate_host');
    const [roleResponsible, setRoleResponsible] = useState('');
    const [timeout, setTimeout] = useState(300);

    const handleSave = () => {
        if (!stepName) {
            toast.error('Step name is required');
            return;
        }

        onSave({
            step_name: stepName,
            action_type: actionType,
            role_responsible: roleResponsible,
            parameters: {},
            timeout: timeout,
            learning_weight: 0.5
        });
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="step-name" className="text-white">Step Name</Label>
                <Input
                    id="step-name"
                    value={stepName}
                    onChange={(e) => setStepName(e.target.value)}
                    placeholder="e.g., Isolate infected host"
                    className="bg-gray-800 border-gray-600 text-white mt-2"
                />
            </div>

            <div>
                <Label htmlFor="action-type" className="text-white">Action Type</Label>
                <Select value={actionType} onValueChange={setActionType}>
                    <SelectTrigger id="action-type" className="bg-gray-800 border-gray-600 text-white mt-2">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="isolate_host">Isolate Host</SelectItem>
                        <SelectItem value="block_ip">Block IP Address</SelectItem>
                        <SelectItem value="disable_user">Disable User Account</SelectItem>
                        <SelectItem value="collect_artifacts">Collect Artifacts</SelectItem>
                        <SelectItem value="notify_team">Notify Team</SelectItem>
                        <SelectItem value="create_ticket">Create Ticket</SelectItem>
                        <SelectItem value="run_scan">Run Security Scan</SelectItem>
                        <SelectItem value="analyze_quantum_risk">Analyze Quantum Risk</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="role" className="text-white">Responsible Role</Label>
                <Input
                    id="role"
                    value={roleResponsible}
                    onChange={(e) => setRoleResponsible(e.target.value)}
                    placeholder="e.g., Security Analyst"
                    className="bg-gray-800 border-gray-600 text-white mt-2"
                />
            </div>

            <div>
                <Label htmlFor="timeout" className="text-white">Timeout (seconds)</Label>
                <Input
                    id="timeout"
                    type="number"
                    value={timeout}
                    onChange={(e) => setTimeout(parseInt(e.target.value))}
                    className="bg-gray-800 border-gray-600 text-white mt-2"
                />
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={onCancel} className="border-gray-700 text-gray-300">
                    Cancel
                </Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                    Add Step
                </Button>
            </div>
        </div>
    );
}