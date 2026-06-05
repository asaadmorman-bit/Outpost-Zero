import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function UEBARiskDashboard({ riskScores, userBehavior, onUserSelect }) {
  const riskDistribution = [
    { level: 'Low (0-25)', count: riskScores.filter(s => s.overall_risk_score <= 25).length, color: '#10b981' },
    { level: 'Medium (26-50)', count: riskScores.filter(s => s.overall_risk_score > 25 && s.overall_risk_score <= 50).length, color: '#fbbf24' },
    { level: 'High (51-75)', count: riskScores.filter(s => s.overall_risk_score > 50 && s.overall_risk_score <= 75).length, color: '#fb923c' },
    { level: 'Critical (76-100)', count: riskScores.filter(s => s.overall_risk_score > 75).length, color: '#f87171' }
  ];

  // Sample radar data for a high-risk user
  const highRiskUser = riskScores.find(s => s.risk_level === 'high' || s.risk_level === 'critical');
  const radarData = highRiskUser ? [
    { subject: 'Login Anomalies', score: highRiskUser.contributing_factors?.anomalous_login_score || 0 },
    { subject: 'Data Access', score: highRiskUser.contributing_factors?.data_access_score || 0 },
    { subject: 'Privilege Usage', score: highRiskUser.contributing_factors?.privilege_usage_score || 0 },
    { subject: 'Time Pattern', score: highRiskUser.contributing_factors?.time_pattern_score || 0 },
    { subject: 'Location', score: highRiskUser.contributing_factors?.location_score || 0 },
    { subject: 'Device', score: highRiskUser.contributing_factors?.device_score || 0 }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Risk Distribution */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Risk Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {riskDistribution.map((item, idx) => (
              <div key={idx} className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="text-3xl font-bold mb-2" style={{ color: item.color }}>
                  {item.count}
                </div>
                <div className="text-sm text-gray-400">{item.level}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* High-Risk User Spotlight */}
      {highRiskUser && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              High-Risk User Spotlight: {highRiskUser.user_email}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3">Risk Factors Analysis</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
                    <Radar name="Risk Score" dataKey="score" stroke="#f87171" fill="#f87171" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Overall Risk</h4>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl font-bold text-red-400">
                      {highRiskUser.overall_risk_score}
                    </div>
                    <div>
                      <Badge className="bg-red-600/20 text-red-300">
                        {highRiskUser.risk_level.toUpperCase()}
                      </Badge>
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        {highRiskUser.trend === 'increasing' ? (
                          <><TrendingUp className="w-3 h-3 text-red-400" /> Increasing</>
                        ) : highRiskUser.trend === 'decreasing' ? (
                          <><TrendingDown className="w-3 h-3 text-green-400" /> Decreasing</>
                        ) : (
                          <><Activity className="w-3 h-3 text-gray-400" /> Stable</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2 text-sm">Active Anomalies</h4>
                  <div className="space-y-2">
                    {highRiskUser.anomalies_detected?.slice(0, 3).map((anomaly, idx) => (
                      <div key={idx} className="p-2 bg-red-900/20 border border-red-500/30 rounded text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-red-300 font-medium">{anomaly.anomaly_type}</span>
                          <Badge className="bg-red-600/30 text-red-200 text-xs">
                            {anomaly.severity}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-300">{anomaly.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2 text-sm">Recommended Actions</h4>
                  <ul className="space-y-1 text-sm">
                    {highRiskUser.recommended_actions?.slice(0, 3).map((action, idx) => (
                      <li key={idx} className="text-orange-300 flex items-start gap-2">
                        <span className="text-orange-400 mt-0.5">→</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent High-Risk Activities */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent High-Risk Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userBehavior
              .filter(b => !b.normal_pattern)
              .slice(0, 5)
              .map((behavior) => (
                <div key={behavior.id} className="p-3 bg-gray-900/50 border border-orange-500/30 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-orange-600/20 text-orange-300">
                          Anomaly Score: {behavior.anomaly_score}
                        </Badge>
                        <span className="text-gray-400 text-sm">
                          {new Date(behavior.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-white font-medium mb-1">
                        {behavior.activity_type.replace(/_/g, ' ').toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-300 space-x-4">
                        <span>Location: {behavior.location}</span>
                        <span>•</span>
                        <span>Device: {behavior.device_type}</span>
                        <span>•</span>
                        <span>IP: {behavior.source_ip}</span>
                      </div>
                      {behavior.risk_factors && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {behavior.risk_factors.map((factor, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-red-500/50 text-red-300">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}