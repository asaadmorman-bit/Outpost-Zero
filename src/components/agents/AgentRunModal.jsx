import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Play, CheckCircle, AlertCircle, ChevronDown, ChevronRight, Zap, Clock } from 'lucide-react';
import { agentOrchestrator } from '@/functions/agentOrchestrator';

export default function AgentRunModal({ agent, isOpen, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);

  const quickPrompts = {
    analyst: ['Analyze the top 5 most recent critical security events', 'What are the current threat patterns?', 'Summarize compliance status'],
    responder: ['Check for active incidents requiring response', 'Identify high-severity open incidents', 'Generate incident response report'],
    hunter: ['Hunt for anomalous user behavior patterns', 'Search for indicators of lateral movement', 'Identify potential insider threats'],
    compliance: ['Get overall compliance posture', 'Which controls are non-compliant?', 'Generate compliance summary report'],
    orchestrator: ['Run full security health check', 'Coordinate threat assessment across all domains', 'Execute security posture analysis'],
    custom: ['Analyze current security landscape', 'Generate security recommendations', 'Check system health']
  };

  const handleRun = async () => {
    if (!prompt.trim()) return;
    setIsRunning(true);
    setResult(null);
    try {
      const response = await agentOrchestrator({ action: 'run_agent', agent_id: agent.agent_id, input: prompt });
      setResult(response.data);
    } catch (err) {
      setResult({ status: 'failed', error: err.message });
    }
    setIsRunning(false);
  };

  const handleClose = () => {
    setPrompt('');
    setResult(null);
    setExpandedStep(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Bot className="w-6 h-6 text-blue-400" />
            Run: {agent?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Quick prompts */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {(quickPrompts[agent?.agent_type] || quickPrompts.custom).map((q, i) => (
                <button key={i} onClick={() => setPrompt(q)}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-800 border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-white transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt input */}
          <div>
            <label className="text-sm text-gray-300 font-medium">Agent Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Tell ${agent?.name} what to do...`}
              rows={3}
              className="w-full mt-2 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button onClick={handleRun} disabled={isRunning || !prompt.trim()} className="w-full bg-blue-600 hover:bg-blue-700">
            {isRunning ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> Running Agent...</>
            ) : (
              <><Play className="w-4 h-4 mr-2" /> Run Agent</>
            )}
          </Button>

          {/* Live running indicator */}
          {isRunning && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <p className="text-blue-300 text-sm">Agent is thinking and using tools...</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              <div className={`rounded-lg border p-4 ${result.status === 'completed' ? 'bg-green-900/10 border-green-500/30' : 'bg-red-900/10 border-red-500/30'}`}>
                <div className="flex items-center gap-2 mb-3">
                  {result.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
                  <span className="font-semibold text-white capitalize">Status: {result.status}</span>
                </div>
                {result.output && (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <pre className="text-gray-300 text-sm whitespace-pre-wrap bg-gray-900/50 p-3 rounded">{result.output}</pre>
                  </div>
                )}
                {result.error && <p className="text-red-400 text-sm">{result.error}</p>}
              </div>

              {result.steps && result.steps.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" /> Tool Executions ({result.steps.length})
                  </p>
                  <div className="space-y-2">
                    {result.steps.map((step, i) => (
                      <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                        <button onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-700/30">
                          <div className="flex items-center gap-2">
                            <Badge className={step.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                              {step.status}
                            </Badge>
                            <span className="text-white text-sm font-mono">{step.tool}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <Clock className="w-3 h-3" />{step.duration_ms}ms
                            {expandedStep === i ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </button>
                        {expandedStep === i && (
                          <div className="border-t border-gray-700 p-3 space-y-2">
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Input:</p>
                              <pre className="text-xs text-gray-300 bg-gray-900/50 p-2 rounded overflow-x-auto">{JSON.stringify(step.input, null, 2)}</pre>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Output:</p>
                              <pre className="text-xs text-gray-300 bg-gray-900/50 p-2 rounded overflow-x-auto">{JSON.stringify(step.output, null, 2)}</pre>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}