
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Brain,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Plus,
  TrendingUp,
  Activity,
  Target,
  Eye,
  BarChart3
} from 'lucide-react';

import RemediationRuleBuilder from '@/components/remediation/RemediationRuleBuilder';
import RemediationDashboard from '@/components/remediation/RemediationDashboard';
import ApprovalQueue from '@/components/remediation/ApprovalQueue';
import ExecutionHistory from '@/components/remediation/ExecutionHistory';
import AIRecommendations from '@/components/remediation/AIRecommendations';

export default function AutomatedRemediation() {
  const [rules, setRules] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rulesData, executionsData] = await Promise.all([
        base44.entities.RemediationRule.list('-created_date', 100),
        base44.entities.RemediationExecution.list('-created_date', 100)
      ]);

      setRules(rulesData.length > 0 ? rulesData : getMockRules());
      setExecutions(executionsData.length > 0 ? executionsData : getMockExecutions());
      
      // Filter pending approvals
      const pending = executionsData.filter(e => e.status === 'pending_approval');
      setPendingApprovals(pending.length > 0 ? pending : getMockPendingApprovals());
    } catch (error) {
      console.error('Error loading remediation data:', error);
      setRules(getMockRules());
      setExecutions(getMockExecutions());
      setPendingApprovals(getMockPendingApprovals());
    }
    setIsLoading(false);
  };

  const getMockRules = () => [
    {
      id: '1',
      rule_id: 'rule_001',
      rule_name: 'Auto-Block Malicious IPs',
      description: 'Automatically block IPs detected making multiple failed login attempts',
      trigger_type: 'security_event',
      trigger_conditions: {
        severity: ['medium', 'high', 'critical'],
        occurrence_threshold: 5,
        time_window_hours: 1
      },
      remediation_action: 'block_ip',
      approval_required: false,
      enabled: true,
      execution_count: 127,
      success_rate: 98.4,
      ai_confidence_threshold: 90,
      risk_assessment: {
        risk_level: 'low',
        reversible: true
      }
    },
    {
      id: '2',
      rule_id: 'rule_002',
      rule_name: 'Quarantine Suspicious Files',
      description: 'Quarantine files flagged as malware by multiple engines',
      trigger_type: 'security_event',
      trigger_conditions: {
        severity: ['high', 'critical'],
        occurrence_threshold: 1
      },
      remediation_action: 'quarantine_file',
      approval_required: false,
      enabled: true,
      execution_count: 43,
      success_rate: 95.3,
      ai_confidence_threshold: 85
    },
    {
      id: '3',
      rule_id: 'rule_003',
      rule_name: 'Disable Compromised Accounts',
      description: 'Disable user accounts with confirmed suspicious activity',
      trigger_type: 'user_behavior_anomaly',
      trigger_conditions: {
        severity: ['high', 'critical']
      },
      remediation_action: 'disable_user_account',
      approval_required: true,
      enabled: true,
      execution_count: 8,
      success_rate: 100,
      ai_confidence_threshold: 95,
      risk_assessment: {
        risk_level: 'high',
        reversible: true
      }
    }
  ];

  const getMockExecutions = () => [
    {
      id: '1',
      execution_id: 'exec_001',
      rule_id: 'rule_001',
      trigger_source_id: 'event_12345',
      trigger_source_type: 'security_event',
      status: 'completed',
      ai_confidence_score: 96,
      ai_reasoning: 'IP 192.168.1.100 attempted 15 failed logins in 10 minutes',
      created_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      execution_duration_seconds: 3.2
    },
    {
      id: '2',
      execution_id: 'exec_002',
      rule_id: 'rule_002',
      trigger_source_id: 'event_12346',
      trigger_source_type: 'security_event',
      status: 'completed',
      ai_confidence_score: 92,
      created_date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      execution_duration_seconds: 1.8
    }
  ];

  const getMockPendingApprovals = () => [
    {
      id: '1',
      execution_id: 'exec_pending_001',
      rule_id: 'rule_003',
      trigger_source_id: 'anomaly_789',
      trigger_source_type: 'user_behavior_anomaly',
      status: 'pending_approval',
      ai_confidence_score: 97,
      ai_reasoning: 'User john.doe@company.com accessed sensitive files at 3 AM from unknown location. Multiple impossible travel indicators detected.',
      approval_details: {
        requested_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      created_date: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  ];

  const handleToggleRule = async (ruleId) => {
    const rule = rules.find(r => r.rule_id === ruleId);
    if (!rule) return;

    try {
      await base44.entities.RemediationRule.update(rule.id, {
        enabled: !rule.enabled
      });
      await loadData();
    } catch (error) {
      console.error('Error toggling rule:', error);
      alert('Failed to toggle rule. Using demo mode - changes not persisted.');
      // Demo mode: update local state
      setRules(rules.map(r => 
        r.rule_id === ruleId ? { ...r, enabled: !r.enabled } : r
      ));
    }
  };

  const handleCreateRule = () => {
    setSelectedRule(null);
    setShowRuleBuilder(true);
  };

  const handleEditRule = (rule) => {
    setSelectedRule(rule);
    setShowRuleBuilder(true);
  };

  const enabledRules = rules.filter(r => r.enabled).length;
  const totalExecutions = executions.length;
  const successRate = totalExecutions > 0 
    ? (executions.filter(e => e.status === 'completed').length / totalExecutions * 100).toFixed(1)
    : 0;
  const avgExecutionTime = executions.length > 0
    ? (executions.reduce((sum, e) => sum + (e.execution_duration_seconds || 0), 0) / executions.length).toFixed(1)
    : 0;

  if (showRuleBuilder) {
    return (
      <RemediationRuleBuilder
        rule={selectedRule}
        onClose={() => {
          setShowRuleBuilder(false);
          setSelectedRule(null);
          loadData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">AI-Driven Automated Remediation</h1>
            </div>
            <p className="text-gray-300">Intelligent, automated security response with configurable approval workflows</p>
          </div>
          <Button 
            onClick={handleCreateRule}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Rule
          </Button>
        </div>

        {/* Alert Banner for Pending Approvals */}
        {pendingApprovals.length > 0 && (
          <Alert className="mb-6 border-orange-500/50 bg-orange-500/10 animate-pulse">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            <AlertDescription className="text-orange-200">
              <strong>{pendingApprovals.length} remediation action(s)</strong> pending your approval. Review them in the Approval Queue tab.
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-white" />
                <div>
                  <div className="text-3xl font-bold text-white">{enabledRules}</div>
                  <div className="text-sm text-gray-200">Active Rules</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-white" />
                <div>
                  <div className="text-3xl font-bold text-white">{successRate}%</div>
                  <div className="text-sm text-gray-200">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-white" />
                <div>
                  <div className="text-3xl font-bold text-white">{totalExecutions}</div>
                  <div className="text-sm text-gray-200">Executions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-white" />
                <div>
                  <div className="text-3xl font-bold text-white">{avgExecutionTime}s</div>
                  <div className="text-sm text-gray-200">Avg Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/50">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="rules">
              Rules ({rules.length})
            </TabsTrigger>
            <TabsTrigger value="approvals">
              Approvals ({pendingApprovals.length})
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="ai">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <RemediationDashboard 
              rules={rules}
              executions={executions}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="rules" className="mt-6">
            <div className="space-y-4">
              {rules.map((rule) => (
                <Card key={rule.id} className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold text-lg">{rule.rule_name}</h3>
                          <Badge className={rule.enabled ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}>
                            {rule.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                          {rule.approval_required && (
                            <Badge variant="outline" className="border-orange-500/50 text-orange-300">
                              Requires Approval
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{rule.description}</p>
                        
                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-gray-900/50 p-3 rounded">
                            <div className="text-xs text-gray-400">Trigger Type</div>
                            <div className="text-white font-medium">{rule.trigger_type.replace(/_/g, ' ')}</div>
                          </div>
                          <div className="bg-gray-900/50 p-3 rounded">
                            <div className="text-xs text-gray-400">Action</div>
                            <div className="text-white font-medium">{rule.remediation_action.replace(/_/g, ' ')}</div>
                          </div>
                          <div className="bg-gray-900/50 p-3 rounded">
                            <div className="text-xs text-gray-400">Executions</div>
                            <div className="text-white font-medium">{rule.execution_count || 0}</div>
                          </div>
                          <div className="bg-gray-900/50 p-3 rounded">
                            <div className="text-xs text-gray-400">Success Rate</div>
                            <div className="text-green-400 font-medium">{rule.success_rate?.toFixed(1) || 0}%</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleRule(rule.rule_id)}
                          className={rule.enabled ? 'border-red-500/50 text-red-300 hover:bg-red-500/10' : 'border-green-500/50 text-green-300 hover:bg-green-500/10'}
                        >
                          {rule.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRule(rule)}
                          className="border-gray-600"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approvals" className="mt-6">
            <ApprovalQueue 
              pendingApprovals={pendingApprovals}
              onApprove={loadData}
              onReject={loadData}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <ExecutionHistory executions={executions} rules={rules} />
          </TabsContent>

          <TabsContent value="ai" className="mt-6">
            <AIRecommendations 
              rules={rules}
              executions={executions}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
