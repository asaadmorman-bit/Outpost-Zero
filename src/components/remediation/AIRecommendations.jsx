import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';

export default function AIRecommendations({ rules, executions }) {
  // Generate AI insights based on execution data
  const totalExecutions = executions.length;
  const successfulExecutions = executions.filter(e => e.status === 'completed').length;
  const failedExecutions = executions.filter(e => e.status === 'failed').length;
  const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions * 100).toFixed(1) : 0;

  // Mock AI recommendations
  const recommendations = [
    {
      id: '1',
      type: 'optimization',
      priority: 'high',
      title: 'Optimize IP Blocking Rule',
      description: 'Your "Auto-Block Malicious IPs" rule has a 98% success rate. Consider reducing the occurrence threshold from 5 to 3 for faster response.',
      impact: 'Could reduce incident response time by 40%',
      action: 'Update Rule Threshold',
      confidence: 92
    },
    {
      id: '2',
      type: 'new_rule',
      priority: 'medium',
      title: 'Create Rule for Failed SSH Attempts',
      description: 'AI detected 47 incidents with multiple failed SSH attempts in the last 30 days. A new rule could automate this remediation.',
      impact: 'Prevent estimated 15 incidents per month',
      action: 'Create New Rule',
      confidence: 88
    },
    {
      id: '3',
      type: 'approval_workflow',
      priority: 'low',
      title: 'Consider Auto-Approval for Low-Risk Actions',
      description: 'File quarantine actions have 100% approval rate with 0 rollbacks. Consider removing manual approval requirement.',
      impact: 'Reduce response time from 45 minutes to <5 seconds',
      action: 'Modify Approval Workflow',
      confidence: 85
    },
    {
      id: '4',
      type: 'performance',
      priority: 'medium',
      title: 'Improve Response Time for User Account Disabling',
      description: 'User account disabling takes average 12 minutes. AI recommends pre-authorizing service account for faster execution.',
      impact: 'Reduce execution time to <30 seconds',
      action: 'Optimize Configuration',
      confidence: 90
    }
  ];

  const insights = [
    {
      metric: 'Success Rate',
      value: `${successRate}%`,
      trend: 'up',
      description: 'Your automated remediation is performing well'
    },
    {
      metric: 'Avg Confidence',
      value: '94%',
      trend: 'stable',
      description: 'AI models are highly confident in recommendations'
    },
    {
      metric: 'Time Saved',
      value: '127h',
      trend: 'up',
      description: 'Estimated analyst time saved this month'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'low':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'optimization':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'new_rule':
        return <Lightbulb className="w-5 h-5 text-yellow-400" />;
      case 'approval_workflow':
        return <CheckCircle className="w-5 h-5 text-blue-400" />;
      case 'performance':
        return <Zap className="w-5 h-5 text-purple-400" />;
      default:
        return <Target className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Alert className="border-purple-500/50 bg-purple-500/10">
        <Brain className="h-4 w-4 text-purple-400" />
        <AlertDescription className="text-purple-200">
          <strong>AI Analysis Complete:</strong> Based on your remediation history, we've identified {recommendations.length} optimization opportunities.
        </AlertDescription>
      </Alert>

      {/* Key Insights */}
      <div className="grid md:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <Card key={insight.metric} className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm text-gray-400">{insight.metric}</div>
                {insight.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
              </div>
              <div className="text-3xl font-bold text-white mb-1">{insight.value}</div>
              <p className="text-xs text-gray-400">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getTypeIcon(rec.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-white font-semibold">{rec.title}</h4>
                      <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                        {rec.priority} priority
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-300">
                        {rec.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{rec.description}</p>
                    <div className="flex items-center gap-2 text-sm mb-3">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300">{rec.impact}</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => alert(`This would: ${rec.action}\n\nIn production, this would open the rule builder with pre-filled recommendations.`)}
                    >
                      {rec.action}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Patterns */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Pattern Recognition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h5 className="text-white font-medium mb-1">Consistent Success with IP Blocking</h5>
                <p className="text-sm text-gray-400">
                  98.4% success rate across 127 executions. No rollbacks required.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded">
              <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h5 className="text-white font-medium mb-1">Decreasing Manual Interventions</h5>
                <p className="text-sm text-gray-400">
                  Manual interventions decreased by 67% since enabling automated remediation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <h5 className="text-white font-medium mb-1">Account Disabling Needs Attention</h5>
                <p className="text-sm text-gray-400">
                  8 executions but longer response times. Consider optimizing service account permissions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROI Calculator */}
      <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white">Automation ROI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-400 mb-1">Time Saved</div>
              <div className="text-3xl font-bold text-green-400">127 hours</div>
              <div className="text-xs text-gray-400 mt-1">This month</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Cost Savings</div>
              <div className="text-3xl font-bold text-green-400">$12,700</div>
              <div className="text-xs text-gray-400 mt-1">@ $100/hour analyst cost</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Incidents Prevented</div>
              <div className="text-3xl font-bold text-green-400">43</div>
              <div className="text-xs text-gray-400 mt-1">Automated remediation</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}