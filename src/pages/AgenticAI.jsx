import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { agentOrchestrator } from '@/functions/agentOrchestrator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import AgentCard from '../components/agents/AgentCard';
import AgentRunModal from '../components/agents/AgentRunModal';
import AgentConfigModal from '../components/agents/AgentConfigModal';
import IntegrationCard from '../components/agents/IntegrationCard';
import {
  Bot, Plus, Activity, Zap, Plug, Search, RefreshCw,
  CheckCircle, AlertCircle, Clock, BarChart3, Network, Settings
} from 'lucide-react';
import { toast } from 'sonner';

const SEED_AGENTS = [
  {
    agent_id: 'agent_001',
    name: 'Cyber Threat Analyst',
    description: 'Continuously monitors threat intelligence feeds, analyzes security events, and generates actionable threat reports with MITRE ATT&CK mapping.',
    agent_type: 'analyst',
    status: 'idle',
    model: 'claude-3-5-sonnet',
    tools_enabled: ['search_threat_intel', 'analyze_security_events', 'query_incidents', 'web_search'],
    trigger: 'event_driven',
    max_iterations: 10,
    executions_count: 47,
    success_rate: 96,
    tags: ['threat-intel', 'MITRE', 'automated'],
    memory_enabled: true,
    output_format: 'report'
  },
  {
    agent_id: 'agent_002',
    name: 'Incident Responder',
    description: 'Autonomous incident response agent that triages alerts, escalates critical incidents, creates tickets, and executes SOAR playbooks.',
    agent_type: 'responder',
    status: 'idle',
    model: 'claude-3-5-sonnet',
    tools_enabled: ['query_incidents', 'create_incident', 'analyze_security_events', 'call_integration'],
    trigger: 'event_driven',
    max_iterations: 15,
    executions_count: 23,
    success_rate: 91,
    tags: ['IR', 'SOAR', 'automation'],
    memory_enabled: true,
    output_format: 'alert'
  },
  {
    agent_id: 'agent_003',
    name: 'Threat Hunter',
    description: 'Proactively hunts for advanced persistent threats, lateral movement, and insider threats using behavioral analytics and custom hunting queries.',
    agent_type: 'hunter',
    status: 'idle',
    model: 'claude-3-5-sonnet',
    tools_enabled: ['search_threat_intel', 'analyze_security_events', 'web_search', 'query_incidents'],
    trigger: 'scheduled',
    max_iterations: 20,
    executions_count: 15,
    success_rate: 88,
    tags: ['APT', 'hunting', 'behavioral'],
    memory_enabled: true,
    output_format: 'report'
  },
  {
    agent_id: 'agent_004',
    name: 'Compliance Auditor',
    description: 'Automated compliance assessment agent that maps controls to CMMC, FedRAMP, NIST 800-53, and generates audit-ready evidence packages.',
    agent_type: 'compliance',
    status: 'idle',
    model: 'claude-3-5-sonnet',
    tools_enabled: ['get_compliance_status', 'analyze_security_events', 'call_integration'],
    trigger: 'scheduled',
    max_iterations: 8,
    executions_count: 31,
    success_rate: 99,
    tags: ['CMMC', 'FedRAMP', 'audit'],
    memory_enabled: true,
    output_format: 'report'
  },
  {
    agent_id: 'agent_005',
    name: 'Security Orchestrator',
    description: 'Master orchestration agent that coordinates all other agents, prioritizes workflows, and manages cross-domain security operations.',
    agent_type: 'orchestrator',
    status: 'idle',
    model: 'claude-3-5-sonnet',
    tools_enabled: ['search_threat_intel', 'query_incidents', 'analyze_security_events', 'get_compliance_status', 'call_integration', 'web_search'],
    trigger: 'manual',
    max_iterations: 25,
    executions_count: 8,
    success_rate: 94,
    tags: ['orchestration', 'multi-agent'],
    memory_enabled: true,
    output_format: 'json'
  }
];

const SEED_INTEGRATIONS = [
  {
    integration_id: 'int_001', name: 'Splunk SIEM Connector', type: 'cots', vendor: 'Splunk Inc.',
    description: 'Bidirectional SIEM integration for log ingestion and alert correlation',
    status: 'active', auth_type: 'api_key', endpoint_url: 'https://splunk.internal/api/v2',
    capabilities: ['log_ingestion', 'alert_correlation', 'search_query'], health_score: 98
  },
  {
    integration_id: 'int_002', name: 'Palantir Gotham (GOTS)', type: 'gots', vendor: 'Palantir Technologies',
    description: 'Government-grade data fusion and intelligence analysis platform',
    status: 'active', auth_type: 'mtls', endpoint_url: 'https://gotham.gov.internal/api',
    capabilities: ['data_fusion', 'pattern_analysis', 'intelligence_sharing'], health_score: 95
  },
  {
    integration_id: 'int_003', name: 'Custom Evolv SDK', type: 'custom_sdk', vendor: 'Evolv Technology',
    description: 'Custom SDK for real-time weapons detection events and venue management',
    status: 'active', auth_type: 'jwt', endpoint_url: 'https://api.evolvtechnology.com/v1',
    capabilities: ['weapon_detection', 'venue_monitoring', 'alert_streaming'], health_score: 92
  },
  {
    integration_id: 'int_004', name: 'ServiceNow ITSM', type: 'cots', vendor: 'ServiceNow',
    description: 'IT service management for automated ticket creation and workflow management',
    status: 'active', auth_type: 'oauth2', endpoint_url: 'https://instance.service-now.com/api',
    capabilities: ['ticket_creation', 'workflow', 'cmdb_integration'], health_score: 97
  },
  {
    integration_id: 'int_005', name: 'DISA RMF Data Stream', type: 'gots', vendor: 'DISA',
    description: 'DoD Risk Management Framework compliance data integration',
    status: 'configuring', auth_type: 'mtls', endpoint_url: 'https://rmf.disa.mil/api',
    capabilities: ['rmf_controls', 'poam_sync', 'accreditation'], health_score: 0
  },
  {
    integration_id: 'int_006', name: 'Microsoft Sentinel Webhook', type: 'webhook', vendor: 'Microsoft',
    description: 'Real-time security alerts from Microsoft Sentinel via webhook integration',
    status: 'active', auth_type: 'api_key', endpoint_url: 'https://management.azure.com/sentinel',
    capabilities: ['alert_ingestion', 'incident_sync', 'analytics_rules'], health_score: 100
  }
];

export default function AgenticAIPage() {
  const [agents, setAgents] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [runningAgent, setRunningAgent] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showRunModal, setShowRunModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [testingIntegration, setTestingIntegration] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [agentData, integrationData, execData] = await Promise.all([
        base44.entities.AIAgent.list('-created_date', 50).catch(() => []),
        base44.entities.AgentIntegration.list('-created_date', 50).catch(() => []),
        base44.entities.AgentExecution.list('-created_date', 20).catch(() => [])
      ]);

      if (agentData.length === 0) {
        setAgents(SEED_AGENTS);
      } else {
        setAgents(agentData);
      }

      if (integrationData.length === 0) {
        setIntegrations(SEED_INTEGRATIONS);
      } else {
        setIntegrations(integrationData);
      }

      setExecutions(execData);
    } catch (e) {
      setAgents(SEED_AGENTS);
      setIntegrations(SEED_INTEGRATIONS);
    }
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleRunAgent = (agent) => {
    setSelectedAgent(agent);
    setShowRunModal(true);
  };

  const handleConfigure = (agent) => {
    setEditingAgent(agent);
    setShowConfigModal(true);
  };

  const handleTestIntegration = async (integration) => {
    setTestingIntegration(integration.integration_id);
    try {
      const response = await agentOrchestrator({ action: 'test_integration', integration_id: integration.integration_id });
      if (response.data?.success) {
        toast.success(`${integration.name} — healthy (${response.data.latency_ms}ms)`);
      } else {
        toast.error(`${integration.name} — ${response.data?.message || 'connection failed'}`);
      }
      await loadData();
    } catch (e) {
      toast.error('Test failed: ' + e.message);
    }
    setTestingIntegration(null);
  };

  const filteredAgents = agents.filter(a =>
    !searchTerm || a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.agent_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const activeIntegrations = integrations.filter(i => i.status === 'active').length;
  const totalRuns = agents.reduce((sum, a) => sum + (a.executions_count || 0), 0);
  const avgSuccess = agents.filter(a => a.success_rate).reduce((sum, a, _, arr) => sum + a.success_rate / arr.length, 0);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-400" />
              Agentic AI Platform
            </h1>
            <p className="text-gray-400 mt-1">Autonomous AI agents with COTS, GOTS & Custom SDK integrations</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={loadData} variant="outline" size="sm" className="border-gray-600 text-gray-300">
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
            <Button onClick={() => { setEditingAgent(null); setShowConfigModal(true); }} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> New Agent
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Agents', value: activeAgents, icon: <Bot className="w-6 h-6 text-blue-400" />, sub: `${agents.length} total` },
            { label: 'Integrations', value: activeIntegrations, icon: <Plug className="w-6 h-6 text-green-400" />, sub: `${integrations.length} configured` },
            { label: 'Total Executions', value: totalRuns.toLocaleString(), icon: <Zap className="w-6 h-6 text-yellow-400" />, sub: 'all time' },
            { label: 'Avg Success Rate', value: `${Math.round(avgSuccess || 0)}%`, icon: <CheckCircle className="w-6 h-6 text-purple-400" />, sub: 'across agents' },
          ].map((stat, i) => (
            <Card key={i} className="border-gray-700 bg-gray-800/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{stat.sub}</p>
                </div>
                {stat.icon}
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="agents">
          <TabsList className="bg-gray-800 border-gray-700 mb-6">
            <TabsTrigger value="agents" className="data-[state=active]:bg-blue-600">
              <Bot className="w-4 h-4 mr-2" /> Agents ({agents.length})
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-blue-600">
              <Plug className="w-4 h-4 mr-2" /> Integrations ({integrations.length})
            </TabsTrigger>
            <TabsTrigger value="executions" className="data-[state=active]:bg-blue-600">
              <Activity className="w-4 h-4 mr-2" /> Execution History
            </TabsTrigger>
          </TabsList>

          {/* Agents Tab */}
          <TabsContent value="agents">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search agents..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white" />
              </div>
            </div>
            {isLoading ? (
              <div className="text-center py-12 text-white">Loading agents...</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map(agent => (
                  <AgentCard
                    key={agent.agent_id}
                    agent={agent}
                    onRun={handleRunAgent}
                    onConfigure={handleConfigure}
                    isRunning={runningAgent === agent.agent_id}
                  />
                ))}
                {/* New agent card */}
                <Card className="border-dashed border-2 border-gray-600 bg-transparent hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => { setEditingAgent(null); setShowConfigModal(true); }}>
                  <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                    <Plus className="w-12 h-12 text-gray-500 mb-3" />
                    <p className="text-gray-400 font-medium">Create Custom Agent</p>
                    <p className="text-gray-500 text-sm mt-1">Build an agent for your specific use case</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <div className="mb-6 grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'COTS', count: integrations.filter(i => i.type === 'cots').length, color: 'text-blue-400' },
                { label: 'GOTS', count: integrations.filter(i => i.type === 'gots').length, color: 'text-green-400' },
                { label: 'Custom SDK', count: integrations.filter(i => i.type === 'custom_sdk').length, color: 'text-cyan-400' },
              ].map((t, i) => (
                <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                  <p className={`text-xl font-bold ${t.color}`}>{t.count}</p>
                  <p className="text-gray-400 text-sm">{t.label} Integrations</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map(integration => (
                <IntegrationCard
                  key={integration.integration_id}
                  integration={integration}
                  onTest={handleTestIntegration}
                  onConfigure={() => {}}
                  isTesting={testingIntegration === integration.integration_id}
                />
              ))}
            </div>
          </TabsContent>

          {/* Executions Tab */}
          <TabsContent value="executions">
            {executions.length === 0 ? (
              <Card className="border-gray-700 bg-gray-800/50">
                <CardContent className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No executions yet. Run an agent to see history.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {executions.map((exec, i) => (
                  <Card key={i} className="border-gray-700 bg-gray-800/50">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={exec.status === 'completed' ? 'bg-green-500/20 text-green-400' : exec.status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}>
                          {exec.status}
                        </Badge>
                        <div>
                          <p className="text-white font-medium text-sm">{exec.agent_name}</p>
                          <p className="text-gray-400 text-xs">{exec.triggered_by} · {new Date(exec.created_date).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        {exec.steps?.length || 0} steps · {exec.duration_ms ? `${exec.duration_ms}ms` : '—'}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {selectedAgent && (
        <AgentRunModal
          agent={selectedAgent}
          isOpen={showRunModal}
          onClose={() => { setShowRunModal(false); setSelectedAgent(null); }}
        />
      )}

      <AgentConfigModal
        agent={editingAgent}
        isOpen={showConfigModal}
        onClose={() => { setShowConfigModal(false); setEditingAgent(null); }}
        onSaved={loadData}
      />
    </div>
  );
}