import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Star,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PlaybookMetrics({ playbooks }) {
  const totalExecutions = playbooks.reduce((sum, p) => sum + (p.metrics?.total_executions || 0), 0);
  const successfulExecutions = playbooks.reduce((sum, p) => sum + (p.metrics?.successful_executions || 0), 0);
  const successRate = totalExecutions > 0 ? ((successfulExecutions / totalExecutions) * 100).toFixed(1) : 0;

  const topPlaybooks = playbooks
    .filter(p => p.metrics?.total_executions > 0)
    .sort((a, b) => (b.metrics?.total_executions || 0) - (a.metrics?.total_executions || 0))
    .slice(0, 5);

  const avgDuration = playbooks
    .filter(p => p.metrics?.average_duration_minutes)
    .reduce((sum, p, _, arr) => sum + (p.metrics.average_duration_minutes / arr.length), 0);

  const chartData = topPlaybooks.map(p => ({
    name: p.name.substring(0, 20) + (p.name.length > 20 ? '...' : ''),
    executions: p.metrics?.total_executions || 0,
    success: p.metrics?.successful_executions || 0
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Total Executions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalExecutions}</div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{successRate}%</div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{Math.round(avgDuration)}m</div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Top Rated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">
              {(playbooks.reduce((sum, p, _, arr) => 
                sum + ((p.metrics?.average_rating || 0) / arr.length), 0
              )).toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Execution Chart */}
      {topPlaybooks.length > 0 && (
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white">Top Executed Playbooks</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#F3F4F6'
                  }}
                />
                <Bar dataKey="executions" fill="#3B82F6" name="Total Executions" />
                <Bar dataKey="success" fill="#10B981" name="Successful" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Playbook Details Table */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white">Playbook Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Playbook</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Executions</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Success Rate</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Avg Duration</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                {playbooks.map((playbook, index) => (
                  <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{playbook.name}</div>
                      <div className="text-gray-400 text-sm">{playbook.incident_type?.replace(/_/g, ' ')}</div>
                    </td>
                    <td className="text-center py-3 px-4 text-white">
                      {playbook.metrics?.total_executions || 0}
                    </td>
                    <td className="text-center py-3 px-4">
                      {playbook.metrics?.total_executions > 0 ? (
                        <Badge className="bg-green-500/20 text-green-300">
                          {((playbook.metrics.successful_executions / playbook.metrics.total_executions) * 100).toFixed(0)}%
                        </Badge>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4 text-white">
                      {playbook.metrics?.average_duration_minutes || 0}m
                    </td>
                    <td className="text-center py-3 px-4">
                      {playbook.metrics?.average_rating ? (
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-white">{playbook.metrics.average_rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}