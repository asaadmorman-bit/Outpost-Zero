import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Zap
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function RemediationDashboard({ rules, executions, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="bg-gray-800/50 border-gray-700 animate-pulse">
            <CardContent className="pt-6">
              <div className="h-48 bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate metrics
  const totalExecutions = executions.length;
  const successfulExecutions = executions.filter(e => e.status === 'completed').length;
  const failedExecutions = executions.filter(e => e.status === 'failed').length;
  const pendingExecutions = executions.filter(e => e.status === 'pending_approval').length;
  const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions * 100).toFixed(1) : 0;

  // Executions by status
  const statusData = [
    { name: 'Completed', value: successfulExecutions, color: '#10b981' },
    { name: 'Failed', value: failedExecutions, color: '#ef4444' },
    { name: 'Pending', value: pendingExecutions, color: '#f59e0b' }
  ];

  // Recent execution timeline (last 24 hours)
  const timelineData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(Date.now() - (23 - i) * 60 * 60 * 1000).getHours();
    const count = executions.filter(e => {
      const execHour = new Date(e.created_date).getHours();
      return execHour === hour;
    }).length;
    return {
      hour: `${hour}:00`,
      executions: count
    };
  });

  // Top rules by execution count
  const ruleExecutions = rules.map(rule => ({
    name: rule.rule_name.length > 20 ? rule.rule_name.substring(0, 20) + '...' : rule.rule_name,
    executions: rule.execution_count || 0,
    successRate: rule.success_rate || 0
  })).sort((a, b) => b.executions - a.executions).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-600 to-green-700 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white">{successRate}%</div>
                <div className="text-sm text-gray-200">Success Rate</div>
              </div>
              <CheckCircle className="w-10 h-10 text-white opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white">{totalExecutions}</div>
                <div className="text-sm text-gray-200">Total Executions</div>
              </div>
              <Activity className="w-10 h-10 text-white opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white">{rules.filter(r => r.enabled).length}</div>
                <div className="text-sm text-gray-200">Active Rules</div>
              </div>
              <Zap className="w-10 h-10 text-white opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white">{pendingExecutions}</div>
                <div className="text-sm text-gray-200">Pending Approval</div>
              </div>
              <Clock className="w-10 h-10 text-white opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Execution Timeline */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Execution Timeline (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="executions" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Rules by Execution */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Most Active Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ruleExecutions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Bar dataKey="executions" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Success Rates */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Rule Success Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ruleExecutions.map((rule, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300 text-sm">{rule.name}</span>
                    <span className="text-white font-semibold">{rule.successRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        rule.successRate >= 95 ? 'bg-green-500' :
                        rule.successRate >= 80 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${rule.successRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}