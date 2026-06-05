import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Network, 
  Shield, 
  Activity, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Zap,
  Globe,
  Server,
  Eye,
  Lock,
  Router,
  Signal,
  BarChart3,
  RefreshCw,
  Plus,
  MapPin,
  Users,
  Wifi,
  Cloud,
  Target,
  Layers,
  GitBranch
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, ScatterChart, Scatter } from 'recharts';

const BranchCard = ({ branch, onSelect }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'offline': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'degraded': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'maintenance': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getThreatScoreColor = (score) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-orange-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer" onClick={() => onSelect(branch)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-white">{branch.branch_name}</CardTitle>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <MapPin className="w-3 h-3" />
                <span>{branch.location}</span>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(branch.status)}>
            {branch.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-lg font-bold text-white">{branch.employee_count}</p>
            <p className="text-xs text-gray-400">Employees</p>
          </div>
          <div className="text-center">
            <p className={`text-lg font-bold ${getThreatScoreColor(branch.security_posture?.threat_score || 0)}`}>
              {branch.security_posture?.threat_score || 0}
            </p>
            <p className="text-xs text-gray-400">Threat Score</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Bandwidth:</span>
            <span className="text-gray-300">{branch.performance_metrics?.bandwidth_utilization || 0}%</span>
          </div>
          <Progress value={branch.performance_metrics?.bandwidth_utilization || 0} className="h-1" />
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Uptime:</span>
            <span className="text-gray-300">{branch.performance_metrics?.availability_percent || 99.9}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-1">
            {branch.security_posture?.firewall_enabled && <Shield className="w-4 h-4 text-green-400" />}
            {branch.security_posture?.ids_enabled && <Eye className="w-4 h-4 text-blue-400" />}
            {branch.security_posture?.web_filtering && <Lock className="w-4 h-4 text-purple-400" />}
          </div>
          <Badge variant="outline" className="text-xs">
            {branch.branch_type.replace('_', ' ')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

const PolicyCard = ({ policy, onEdit, onDeploy }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-gray-500/20 text-gray-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-lg">{policy.policy_name}</CardTitle>
            <p className="text-gray-400 text-sm capitalize">{policy.policy_type.replace('_', ' ')} Policy</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(policy.status)}>
              {policy.status}
            </Badge>
            {policy.automation_enabled && (
              <Badge className="bg-blue-500/20 text-blue-300">Automated</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-400 text-sm">Scope: <span className="text-gray-300 capitalize">{policy.scope.replace('_', ' ')}</span></p>
            <p className="text-gray-400 text-sm">Applied to: <span className="text-gray-300">{policy.target_branches?.length || 0} branches</span></p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(policy)}>
              <Settings className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" onClick={() => onDeploy(policy)} className="bg-blue-600 hover:bg-blue-700">
              <Zap className="w-4 h-4 mr-1" />
              Deploy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function SoftwareDefinedBranchPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBranchData();
  }, []);

  const loadBranchData = async () => {
    setIsLoading(true);
    // Simulate loading branch data
    setTimeout(() => {
      setBranches([
        {
          branch_id: 'br001',
          branch_name: 'New York HQ',
          location: 'New York, NY',
          branch_type: 'headquarters',
          status: 'online',
          employee_count: 450,
          security_posture: { threat_score: 25, firewall_enabled: true, ids_enabled: true, web_filtering: true },
          performance_metrics: { bandwidth_utilization: 78, availability_percent: 99.9, latency_ms: 12 }
        },
        {
          branch_id: 'br002',
          branch_name: 'Chicago Regional',
          location: 'Chicago, IL',
          branch_type: 'regional_office',
          status: 'online',
          employee_count: 125,
          security_posture: { threat_score: 45, firewall_enabled: true, ids_enabled: false, web_filtering: true },
          performance_metrics: { bandwidth_utilization: 65, availability_percent: 99.5, latency_ms: 28 }
        },
        {
          branch_id: 'br003',
          branch_name: 'Austin Campus',
          location: 'Austin, TX',
          branch_type: 'campus',
          status: 'degraded',
          employee_count: 280,
          security_posture: { threat_score: 82, firewall_enabled: true, ids_enabled: true, web_filtering: false },
          performance_metrics: { bandwidth_utilization: 92, availability_percent: 97.8, latency_ms: 45 }
        },
        {
          branch_id: 'br004',
          branch_name: 'Miami Branch',
          location: 'Miami, FL',
          branch_type: 'branch_office',
          status: 'offline',
          employee_count: 45,
          security_posture: { threat_score: 15, firewall_enabled: true, ids_enabled: true, web_filtering: true },
          performance_metrics: { bandwidth_utilization: 0, availability_percent: 0, latency_ms: 0 }
        }
      ]);

      setPolicies([
        {
          policy_id: 'pol001',
          policy_name: 'Corporate Security Baseline',
          policy_type: 'security',
          scope: 'global',
          target_branches: ['br001', 'br002', 'br003'],
          status: 'active',
          automation_enabled: true
        },
        {
          policy_id: 'pol002',
          policy_name: 'Video Conferencing QoS',
          policy_type: 'qos',
          scope: 'global',
          target_branches: ['br001', 'br002', 'br003', 'br004'],
          status: 'active',
          automation_enabled: true
        },
        {
          policy_id: 'pol003',
          policy_name: 'Guest WiFi Access Control',
          policy_type: 'access_control',
          scope: 'regional',
          target_branches: ['br002', 'br003'],
          status: 'draft',
          automation_enabled: false
        }
      ]);

      setIsLoading(false);
    }, 2000);
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setActiveTab('branch-detail');
  };

  const handlePolicyEdit = (policy) => {
    alert(`📝 EDIT POLICY: ${policy.policy_name}\n\nIn production, this would:\n• Open policy configuration wizard\n• Allow modification of rules and conditions\n• Preview changes before deployment\n• Show impact analysis across branches`);
  };

  const handlePolicyDeploy = (policy) => {
    alert(`🚀 DEPLOY POLICY: ${policy.policy_name}\n\nIn production, this would:\n• Push policy to all target branches\n• Monitor deployment progress\n• Validate policy application\n• Generate deployment report`);
  };

  const handleAddBranch = () => {
    alert(`➕ ADD NEW BRANCH\n\nThis would launch the branch onboarding wizard:\n1. Configure branch details and location\n2. Deploy SD-WAN device configuration\n3. Set up network policies and security\n4. Connect to centralized management\n5. Begin automated monitoring`);
  };

  const performanceData = [
    { time: '00:00', bandwidth: 45, latency: 15, threats: 2 },
    { time: '04:00', bandwidth: 35, latency: 12, threats: 1 },
    { time: '08:00', bandwidth: 85, latency: 25, threats: 8 },
    { time: '12:00', bandwidth: 92, latency: 28, threats: 12 },
    { time: '16:00', bandwidth: 78, latency: 22, threats: 6 },
    { time: '20:00', bandwidth: 65, latency: 18, threats: 4 }
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Branch Network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <GitBranch className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Software Defined Branch</h1>
              <p className="text-gray-300">Centralized management for distributed network infrastructure</p>
            </div>
          </div>
          <Button onClick={handleAddBranch} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Branch
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Network Overview</TabsTrigger>
            <TabsTrigger value="branches">Branch Management</TabsTrigger>
            <TabsTrigger value="policies">Policy Engine</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="border-blue-500/50 bg-blue-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-200">Total Branches</p>
                      <p className="text-2xl font-bold text-white">{branches.length}</p>
                    </div>
                    <Building2 className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/50 bg-green-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-200">Online Branches</p>
                      <p className="text-2xl font-bold text-white">{branches.filter(b => b.status === 'online').length}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-500/50 bg-purple-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-200">Active Policies</p>
                      <p className="text-2xl font-bold text-white">{policies.filter(p => p.status === 'active').length}</p>
                    </div>
                    <Layers className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-500/50 bg-red-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-200">Security Alerts</p>
                      <p className="text-2xl font-bold text-white">7</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Network Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#ffffff'
                          }}
                        />
                        <Line type="monotone" dataKey="bandwidth" stroke="#10b981" strokeWidth={2} name="Bandwidth Utilization %" />
                        <Line type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} name="Average Latency (ms)" />
                        <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} name="Security Threats" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    Branch Health Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {branches.map(branch => (
                      <div key={branch.branch_id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            branch.status === 'online' ? 'bg-green-400' :
                            branch.status === 'offline' ? 'bg-red-400' :
                            branch.status === 'degraded' ? 'bg-yellow-400' : 'bg-blue-400'
                          }`}></div>
                          <div>
                            <p className="text-white font-medium">{branch.branch_name}</p>
                            <p className="text-gray-400 text-sm">{branch.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white">{branch.performance_metrics?.availability_percent || 0}%</p>
                          <p className="text-gray-400 text-xs">Uptime</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="branches" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map(branch => (
                <BranchCard key={branch.branch_id} branch={branch} onSelect={handleBranchSelect} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="policies" className="mt-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-white">Network Policies</h2>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Policy
                </Button>
              </div>
              <div className="space-y-4">
                {policies.map(policy => (
                  <PolicyCard 
                    key={policy.policy_id} 
                    policy={policy} 
                    onEdit={handlePolicyEdit} 
                    onDeploy={handlePolicyDeploy} 
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="mt-6">
            <Alert className="mb-6 border-blue-500/50 bg-blue-500/10">
              <Zap className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200">
                Automated branch management reduces manual configuration by 95% and enables zero-touch deployment for new locations.
              </AlertDescription>
            </Alert>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-green-400" />
                    Automation Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-900/20 rounded border border-green-500/30">
                      <span className="text-green-300">Policy Enforcement</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-900/20 rounded border border-green-500/30">
                      <span className="text-green-300">Security Updates</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-900/20 rounded border border-yellow-500/30">
                      <span className="text-yellow-300">Performance Optimization</span>
                      <Settings className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-900/20 rounded border border-green-500/30">
                      <span className="text-green-300">Threat Response</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    Automation Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Manual Tasks Eliminated</span>
                        <span className="text-white">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Policy Compliance</span>
                        <span className="text-white">99.2%</span>
                      </div>
                      <Progress value={99} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Deployment Speed</span>
                        <span className="text-white">87% Faster</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Cost Reduction</span>
                        <span className="text-white">73%</span>
                      </div>
                      <Progress value={73} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Branch Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={branches.map(b => ({ 
                        name: b.branch_name.split(' ')[0], 
                        bandwidth: b.performance_metrics?.bandwidth_utilization || 0,
                        uptime: b.performance_metrics?.availability_percent || 0 
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#ffffff'
                          }}
                        />
                        <Bar dataKey="bandwidth" fill="#3b82f6" name="Bandwidth %" />
                        <Bar dataKey="uptime" fill="#10b981" name="Uptime %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    Security Posture by Branch
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={branches.map(b => ({
                        name: b.branch_name,
                        threat_score: b.security_posture?.threat_score || 0,
                        employees: b.employee_count
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="employees" stroke="#9ca3af" name="Employees" />
                        <YAxis dataKey="threat_score" stroke="#9ca3af" name="Threat Score" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#ffffff'
                          }}
                        />
                        <Scatter dataKey="threat_score" fill="#ef4444" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}