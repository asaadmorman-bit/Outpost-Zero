import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { Save, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const TOOL_OPTIONS = [
  'search_threat_intel', 'query_incidents', 'analyze_security_events',
  'create_incident', 'get_compliance_status', 'call_integration', 'web_search'
];

export default function AgentConfigModal({ agent, isOpen, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: '', description: '', agent_type: 'analyst', model: 'claude-3-5-sonnet',
    system_prompt: '', trigger: 'manual', max_iterations: 10,
    tools_enabled: [], tags: [], memory_enabled: true, output_format: 'json'
  });
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (agent) setForm({ ...form, ...agent });
  }, [agent]);

  const toggleTool = (tool) => {
    const current = form.tools_enabled || [];
    setForm({ ...form, tools_enabled: current.includes(tool) ? current.filter(t => t !== tool) : [...current, tool] });
  };

  const addTag = () => {
    if (newTag.trim() && !form.tags?.includes(newTag.trim())) {
      setForm({ ...form, tags: [...(form.tags || []), newTag.trim()] });
      setNewTag('');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (agent?.id) {
        await base44.entities.AIAgent.update(agent.id, form);
        toast.success('Agent updated');
      } else {
        await base44.entities.AIAgent.create({ ...form, agent_id: `agent_${Date.now()}`, status: 'idle', executions_count: 0 });
        toast.success('Agent created');
      }
      onSaved();
      onClose();
    } catch (e) {
      toast.error('Failed to save: ' + e.message);
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{agent?.id ? 'Configure Agent' : 'Create New Agent'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Agent Name</Label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="mt-1 bg-gray-800 border-gray-600 text-white" placeholder="My Security Agent" />
            </div>
            <div>
              <Label className="text-gray-300">Agent Type</Label>
              <Select value={form.agent_type} onValueChange={v => setForm({...form, agent_type: v})}>
                <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {['analyst','responder','hunter','compliance','orchestrator','custom'].map(t => (
                    <SelectItem key={t} value={t} className="text-white capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Description</Label>
            <Input value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="mt-1 bg-gray-800 border-gray-600 text-white" placeholder="What does this agent do?" />
          </div>

          <div>
            <Label className="text-gray-300">System Prompt</Label>
            <textarea value={form.system_prompt} onChange={e => setForm({...form, system_prompt: e.target.value})}
              rows={4} placeholder="Define the agent's behavior and role..."
              className="w-full mt-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-gray-300">Trigger</Label>
              <Select value={form.trigger} onValueChange={v => setForm({...form, trigger: v})}>
                <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {['manual','scheduled','event_driven','continuous'].map(t => (
                    <SelectItem key={t} value={t} className="text-white capitalize">{t.replace('_',' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Max Iterations</Label>
              <Input type="number" value={form.max_iterations} onChange={e => setForm({...form, max_iterations: parseInt(e.target.value)})}
                className="mt-1 bg-gray-800 border-gray-600 text-white" min={1} max={50} />
            </div>
            <div>
              <Label className="text-gray-300">Output Format</Label>
              <Select value={form.output_format} onValueChange={v => setForm({...form, output_format: v})}>
                <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {['json','markdown','alert','ticket','report'].map(f => (
                    <SelectItem key={f} value={f} className="text-white capitalize">{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-gray-300 mb-2 block">Enabled Tools</Label>
            <div className="flex flex-wrap gap-2">
              {TOOL_OPTIONS.map(tool => (
                <button key={tool} onClick={() => toggleTool(tool)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${(form.tools_enabled || []).includes(tool) ? 'bg-blue-600/30 border-blue-500 text-blue-300' : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'}`}>
                  {tool.replace(/_/g,' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-gray-300 mb-2 block">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()}
                className="bg-gray-800 border-gray-600 text-white text-sm" placeholder="Add tag..." />
              <Button onClick={addTag} variant="outline" size="sm" className="border-gray-600 text-gray-300"><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(form.tags || []).map((tag, i) => (
                <Badge key={i} className="bg-gray-700 text-gray-300 flex items-center gap-1">
                  {tag}
                  <button onClick={() => setForm({...form, tags: form.tags.filter((_, j) => j !== i)})}><X className="w-3 h-3" /></button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button onClick={onClose} variant="outline" className="border-gray-600 text-gray-300 flex-1">Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving || !form.name} className="bg-blue-600 hover:bg-blue-700 flex-1">
              {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              {agent?.id ? 'Save Changes' : 'Create Agent'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}