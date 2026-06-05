import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { base44 } from '@/api/base44Client';
import { 
  Users, AlertTriangle, TrendingUp, Shield, Activity, Clock, 
  MapPin, Smartphone, FileText, BarChart3, Eye, Brain, Target,
  ChevronRight, RefreshCw, Download, Filter
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import UEBARiskDashboard from '../components/ueba/UEBARiskDashboard';
import UEBABaselineViewer from '../components/ueba/UEBABaselineViewer';
import UEBAAnomalyDetector from '../components/ueba/UEBAAnomalyDetector';
import UEBAIncidentIntegration from '../components/ueba/UEBAIncidentIntegration';

export default function UserAnalytics() {
  const [userBehavior, setUserBehavior] = useState([]);
  const [riskScores, setRiskScores] = useState([]);
  const [baselines, setBaselines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalyticsData();
    const interval = setInterval(loadAnalyticsData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [behaviorData, scoresData, baselinesData] = await Promise.all([
        base44.entities.UserBehavior.list('-timestamp', 100),
        base44.entities.UEBARiskScore.list('-last_updated', 50),
        base44.entities.UEBABaseline.list('-last_recalculated', 50)
      ]);

      setUserBehavior(behaviorData.length > 0 ? behaviorData : getMockBehaviorData());
      setRiskScores(scoresData.length > 0 ? scoresData : getMockRiskScores());
      setBaselines(baselinesData.length > 0 ? baselinesData : getMockBaselines());
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setUserBehavior(getMockBehaviorData());
      setRiskScores(getMockRiskScores());
      setBaselines(getMockBaselines());
    }
    setIsLoading(false);
  };

  const getMockBehaviorData = () => [
    {
      id: '1',
      user_id: 'user_001',
      activity_type: 'login',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source_ip: '192.168.1.50',
      location: 'San Francisco, CA',
      device_type: 'Windows Desktop',
      anomaly_score: 15,
      baseline_deviation: 12,
      normal_pattern: true
    },
    {
      id: '2',
      user_id: 'user_002',
      activity_type: 'file_access',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      source_ip: '10.0.2.100',
      location: 'New York, NY',
      device_type: 'MacBook Pro',
      anomaly_score: 78,
      baseline_deviation: 65,
      normal_pattern: false,
      risk_factors: ['Unusual time', 'Sensitive data access', 'After hours']
    },
    {
      id: '3',
      user_id: 'user_003',
      activity_type: 'privilege_usage',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      source_ip: '172.16.0.50',
      location: 'Seattle, WA',
      device_type: 'Linux Workstation',
      anomaly_score: 92,
      baseline_deviation: 85,
      normal_pattern: false,
      risk_factors: ['Unusual privilege escalation', 'Multiple failed attempts', 'Unknown device']
    }
  ];

  const getMockRiskScores = () => [
    {
      id: '1',
      score_id: 'risk_001',
      user_id: 'user_001',
      user_email: 'john.doe@company.com',
      overall_risk_score: 15,
      risk_level: 'low',
      contributing_factors: {
        anomalous_login_score: 10,
        data_access_score: 5,
        privilege_usage_score: 20,
        time_pattern_score: 15,
        location_score: 10,
        device_score: 12,
        peer_group_score: 18
      },
      anomalies_detected: [],
      risk_indicators: ['Normal behavior pattern', 'Consistent access times'],
      last_updated: new Date().toISOString(),
      trend: 'stable'
    },
    {
      id: '2',
      score_id: 'risk_002',
      user_id: 'user_002',
      user_email: 'jane.smith@company.com',
      overall_risk_score: 78,
      risk_level: 'high',
      contributing_factors: {
        anomalous_login_score: 85,
        data_access_score: 90,
        privilege_usage_score: 70,
        time_pattern_score: 80,
        location_score: 60,
        device_score: 75,
        peer_group_score: 82
      },
      anomalies_detected: [
        {
          anomaly_type: 'After-hours access',
          severity: 'high',
          description: 'User accessed sensitive files at 2:30 AM',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          confidence: 92
        },
        {
          anomaly_type: 'Unusual data volume',
          severity: 'medium',
          description: 'Downloaded 10x normal data volume',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          confidence: 85
        }
      ],
      risk_indicators: [
        'After-hours activity',
        'Excessive data download',
        'Sensitive file access',
        'Deviation from peer group'
      ],
      recommended_actions: [
        'Initiate security investigation',
        'Require MFA for next login',
        'Alert security team',
        'Review access logs'
      ],
      last_updated: new Date().toISOString(),
      trend: 'increasing'
    },
    {
      id: '3',
      score_id: 'risk_003',
      user_id: 'user_003',
      user_email: 'bob.johnson@company.com',
      overall_risk_score: 92,
      risk_level: 'critical',
      contributing_factors: {
        anomalous_login_score: 95,
        data_access_score: 88,
        privilege_usage_score: 98,
        time_pattern_score: 90,
        location_score: 85,
        device_score: 92,
        peer_group_score: 94
      },
      anomalies_detected: [
        {
          anomaly_type: 'Privilege escalation',
          severity: 'critical',
          description: 'Attempted privilege escalation from unknown device',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          confidence: 98
        },
        {
          anomaly_type: 'Unknown device',
          severity: 'critical',
          description: 'Login from never-before-seen device',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          confidence: 95
        }
      ],
      risk_indicators: [
        'Privilege escalation attempt',
        'Unknown device',
        'Multiple failed authentication',
        'Anomalous access pattern',
        'Critical deviation from baseline'
      ],
      recommended_actions: [
        'IMMEDIATE: Suspend account',
        'Create security incident',
        'Notify SOC team',
        'Initiate forensic investigation',
        'Force password reset'
      ],
      incident_correlation: ['inc_2024_001'],
      last_updated: new Date().toISOString(),
      trend: 'increasing'
    }
  ];

  const getMockBaselines = () => [
    {
      id: '1',
      baseline_id: 'baseline_001',
      user_id: 'user_001',
      user_email: 'john.doe@company.com',
      baseline_type: 'behavioral',
      learning_period_days: 30,
      confidence_level: 95,
      behavioral_metrics: {
        avg_login_time: '09:15',
        typical_login_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        avg_session_duration_minutes: 480,
        avg_daily_logins: 1,
        typical_ip_ranges: ['192.168.1.0/24'],
        typical_locations: ['San Francisco, CA'],
        typical_devices: ['Windows Desktop - WS-001'],
        avg_files_accessed_daily: 25,
        typical_file_types: ['.xlsx', '.pdf', '.docx'],
        avg_data_download_mb: 50,
        typical_applications: ['Office 365', 'Slack', 'Chrome']
      },
      peer_group: 'Finance',
      baseline_status: 'established',
      samples_collected: 450,
      last_recalculated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      baseline_id: 'baseline_002',
      user_id: 'user_002',
      user_email: 'jane.smith@company.com',
      baseline_type: 'behavioral',
      learning_period_days: 30,
      confidence_level: 92,
      behavioral_metrics: {
        avg_login_time: '08:30',
        typical_login_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        avg_session_duration_minutes: 420,
        avg_daily_logins: 2,
        typical_ip_ranges: ['10.0.2.0/24'],
        typical_locations: ['New York, NY'],
        typical_devices: ['MacBook Pro - MB-005'],
        avg_files_accessed_daily: 40,
        typical_file_types: ['.py', '.json', '.md'],
        avg_data_download_mb: 200,
        typical_applications: ['VS Code', 'Docker', 'Terminal']
      },
      peer_group: 'Engineering',
      baseline_status: 'established',
      samples_collected: 380,
      last_recalculated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const criticalUsers = riskScores.filter(s => s.risk_level === 'critical');
  const highRiskUsers = riskScores.filter(s => s.risk_level === 'high');
  const totalAnomalies = riskScores.reduce((sum, s) => sum + (s.anomalies_detected?.length || 0), 0);
  const avgRiskScore = riskScores.length > 0 
    ? (riskScores.reduce((sum, s) => sum + s.overall_risk_score, 0) / riskScores.length).toFixed(1)
    : 0;

  const downloadUEBAReport = () => {
    const report = `UEBA ANALYTICS REPORT - OUTPOST ZERO
========================================

Generated: ${new Date().toLocaleString()}

OVERVIEW METRICS
----------------
Total Users Monitored: ${riskScores.length}
Average Risk Score: ${avgRiskScore}/100
Critical Risk Users: ${criticalUsers.length}
High Risk Users: ${highRiskUsers.length}
Total Anomalies Detected: ${totalAnomalies}
Active Baselines: ${baselines.filter(b => b.baseline_status === 'established').length}

HIGH RISK USERS
---------------
${riskScores.filter(s => s.risk_level === 'high' || s.risk_level === 'critical')
  .map(s => `
User: ${s.user_email}
Risk Score: ${s.overall_risk_score}/100 (${s.risk_level.toUpperCase()})
Trend: ${s.trend}
Anomalies: ${s.anomalies_detected?.length || 0}
Risk Indicators:
${s.risk_indicators?.map(r => `  - ${r}`).join('\n')}
Recommended Actions:
${s.recommended_actions?.map(a => `  - ${a}`).join('\n')}
`).join('\n---\n')}

BEHAVIORAL BASELINES
--------------------
${baselines.map(b => `
User: ${b.user_email}
Baseline Type: ${b.baseline_type}
Status: ${b.baseline_status}
Confidence: ${b.confidence_level}%
Learning Period: ${b.learning_period_days} days
Samples: ${b.samples_collected}
Peer Group: ${b.peer_group}
`).join('\n---\n')}

For detailed analysis, access the UEBA dashboard.
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UEBA-Report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Brain className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">User & Entity Behavior Analytics</h1>
          </div>
          <p className="text-xl text-gray-300 mb-4">
            AI-Powered Insider Threat Detection & Risk Scoring
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50 px-4 py-2">
              <Activity className="w-4 h-4 mr-2" />
              Real-Time Monitoring
            </Badge>
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50 px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              ML-Powered Detection
            </Badge>
            <Badge className="bg-green-600/20 text-green-300 border-green-500/50 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              30-Day Baselines
            </Badge>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalUsers.length > 0 && (
          <Alert className="mb-6 border-red-500/50 bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <AlertDescription className="text-red-200">
              <strong>CRITICAL:</strong> {criticalUsers.length} user(s) detected with critical risk scores requiring immediate investigation.
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-white" />
                <div>
                  <div className="text-3xl font-bold text-white">{riskScores.length}</div>
                  <div className="text-sm text-gray-100">Users Monitored</div>
                  <Badge className="bg-white/20 text-white text-xs mt-1">
                    {baselines.length} with baselines
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-white" />
                <div>
                  <div className="text-3xl font-bold text-white">{avgRiskScore}</div>
                  <div className="text-sm text-gray-100">Avg Risk Score</div>
                  <div className="text-xs text-gray-200 mt-1">out of 100</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-600 to-red-700 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-white" />
                <div>
                  <div className="text-3xl font-bold text-white">{criticalUsers.length + highRiskUsers.length}</div>
                  <div className="text-sm text-gray-100">High/Critical Risk</div>
                  <div className="text-xs text-gray-200 mt-1">
                    {criticalUsers.length} critical
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-white" />
                <div>
                  <div className="text-3xl font-bold text-white">{totalAnomalies}</div>
                  <div className="text-sm text-gray-100">Active Anomalies</div>
                  <div className="text-xs text-gray-200 mt-1">detected today</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Button 
              onClick={loadAnalyticsData}
              variant="outline"
              className="border-gray-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button 
              onClick={downloadUEBAReport}
              variant="outline"
              className="border-blue-600 text-blue-300 hover:bg-blue-600/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="risk">Risk Scores</TabsTrigger>
            <TabsTrigger value="baselines">Baselines</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <UEBARiskDashboard 
              riskScores={riskScores}
              userBehavior={userBehavior}
              onUserSelect={setSelectedUser}
            />
          </TabsContent>

          {/* Risk Scores Tab */}
          <TabsContent value="risk">
            <div className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">User Risk Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {riskScores
                      .sort((a, b) => b.overall_risk_score - a.overall_risk_score)
                      .map((score) => {
                        const riskColor = {
                          critical: 'from-red-600 to-red-700',
                          high: 'from-orange-600 to-orange-700',
                          medium: 'from-yellow-600 to-yellow-700',
                          low: 'from-green-600 to-green-700'
                        }[score.risk_level];

                        return (
                          <Card key={score.id} className={`bg-gradient-to-r ${riskColor} border-gray-700`}>
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-white font-semibold">{score.user_email}</h3>
                                    <Badge className="bg-white/20 text-white">
                                      {score.risk_level.toUpperCase()}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-white/90">
                                    <span>Risk Score: {score.overall_risk_score}/100</span>
                                    <span>•</span>
                                    <span>Trend: {score.trend}</span>
                                    <span>•</span>
                                    <span>{score.anomalies_detected?.length || 0} anomalies</span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedUser(score)}
                                  className="text-white hover:bg-white/10"
                                >
                                  View Details
                                  <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Baselines Tab */}
          <TabsContent value="baselines">
            <UEBABaselineViewer baselines={baselines} />
          </TabsContent>

          {/* Anomalies Tab */}
          <TabsContent value="anomalies">
            <UEBAAnomalyDetector 
              riskScores={riskScores}
              userBehavior={userBehavior}
            />
          </TabsContent>

          {/* Incidents Tab */}
          <TabsContent value="incidents">
            <UEBAIncidentIntegration riskScores={riskScores} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}