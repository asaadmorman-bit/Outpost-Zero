import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, 
  Shield, 
  Zap, 
  Users, 
  Globe, 
  Share2,
  Database,
  Activity,
  ArrowRight,
  CheckCircle,
  Settings,
  Target,
  Network,
  Eye,
  Lock
} from 'lucide-react';

const IntegrationCard = ({ icon: Icon, title, status, description, benefits, implementation }) => (
  <Card className="bg-gray-800 border-gray-700 h-full">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-blue-400" />
          <CardTitle className="text-white">{title}</CardTitle>
        </div>
        <Badge className={status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}>
          {status}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-gray-300 text-sm">{description}</p>
      
      <div>
        <h4 className="text-white font-medium mb-2">Key Benefits</h4>
        <ul className="space-y-1">
          {benefits.map((benefit, index) => (
            <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-400" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-white font-medium mb-2">Implementation</h4>
        <div className="space-y-2">
          {implementation.map((step, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-gray-400 text-xs">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

const UnifiedDashboardWidget = ({ title, cerebraData, outpostData, integrated }) => (
  <Card className="bg-gray-800 border-gray-700">
    <CardHeader>
      <CardTitle className="text-white flex items-center justify-between">
        {title}
        <Badge className={integrated ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}>
          {integrated ? 'Integrated' : 'Separate'}
        </Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
          <h4 className="text-purple-300 font-medium text-sm mb-1">CerebraSec</h4>
          <p className="text-white text-lg font-bold">{cerebraData.value}</p>
          <p className="text-gray-400 text-xs">{cerebraData.label}</p>
        </div>
        <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
          <h4 className="text-blue-300 font-medium text-sm mb-1">Outpost Zero</h4>
          <p className="text-white text-lg font-bold">{outpostData.value}</p>
          <p className="text-gray-400 text-xs">{outpostData.label}</p>
        </div>
      </div>
      {integrated && (
        <div className="mt-3 p-2 bg-green-900/20 rounded border border-green-500/30">
          <p className="text-green-300 text-xs font-medium">✓ Cross-platform correlation active</p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default function CerebraSecIntegration() {
  const [integrationStatus, setIntegrationStatus] = useState({
    threatIntel: true,
    userManagement: true,
    dashboards: false,
    workflows: false,
    reporting: true
  });

  const integrationPoints = [
    {
      icon: Brain,
      title: "Unified AI Threat Intelligence",
      status: "active",
      description: "Combine CerebraSec's neural network-based threat detection with Outpost Zero's behavioral analytics for comprehensive threat identification.",
      benefits: [
        "95% reduction in false positives",
        "Cross-platform threat correlation",
        "Shared machine learning models",
        "Unified threat hunting workflows"
      ],
      implementation: [
        "Establish secure API connection between platforms",
        "Sync threat intelligence feeds bidirectionally",
        "Configure joint AI model training pipeline",
        "Deploy unified threat scoring algorithm"
      ]
    },
    {
      icon: Users,
      title: "Cross-Platform User Management",
      status: "active",
      description: "Single sign-on and unified user behavior analytics across both CerebraSec and Outpost Zero platforms.",
      benefits: [
        "Single pane of glass for user security",
        "Comprehensive behavior baseline",
        "Cross-platform anomaly detection",
        "Unified access controls"
      ],
      implementation: [
        "Configure Azure AD integration for both platforms",
        "Sync user behavior data through secure APIs",
        "Deploy cross-platform UEBA rules",
        "Establish unified identity governance"
      ]
    },
    {
      icon: Database,
      title: "Shared Security Data Lake",
      status: "pending",
      description: "Create a unified data repository combining security events, logs, and intelligence from both platforms.",
      benefits: [
        "Complete security data visibility",
        "Enhanced correlation capabilities",
        "Centralized compliance reporting",
        "Improved forensic analysis"
      ],
      implementation: [
        "Deploy Azure Data Lake Storage Gen2",
        "Configure data ingestion pipelines",
        "Implement data governance policies",
        "Create unified query interface"
      ]
    },
    {
      icon: Zap,
      title: "Orchestrated Response Workflows",
      status: "pending",
      description: "Automate security responses across both platforms with intelligent workflow orchestration.",
      benefits: [
        "Faster incident response times",
        "Coordinated threat containment",
        "Reduced manual intervention",
        "Consistent response procedures"
      ],
      implementation: [
        "Build cross-platform SOAR connector",
        "Create unified playbook templates",
        "Configure automated response triggers",
        "Deploy workflow monitoring dashboard"
      ]
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="flex items-center">
                <Brain className="w-8 h-8 text-purple-400" />
                <ArrowRight className="w-6 h-6 text-gray-400 mx-2" />
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              CerebraSec + Outpost Zero Integration
            </h1>
            <p className="text-gray-300">Unified cybersecurity platform combining neural intelligence with comprehensive monitoring</p>
          </div>
          <Badge className="bg-green-500/20 text-green-300 px-4 py-2">
            Integration Active
          </Badge>
        </div>

        <Alert className="mb-8 border-blue-500/50 bg-blue-500/10">
          <Network className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            <strong>Platform Synergy:</strong> CerebraSec's advanced neural threat detection combined with Outpost Zero's comprehensive security operations creates an unparalleled cybersecurity defense system.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Integration Overview</TabsTrigger>
            <TabsTrigger value="dashboard">Unified Dashboard</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="analytics">Cross-Platform Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {integrationPoints.map((integration, index) => (
                <IntegrationCard key={index} {...integration} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <UnifiedDashboardWidget
                title="Threat Detection"
                cerebraData={{ value: "247", label: "Neural detections (24h)" }}
                outpostData={{ value: "1,432", label: "Security events (24h)" }}
                integrated={true}
              />
              <UnifiedDashboardWidget
                title="User Behavior Analytics"
                cerebraData={{ value: "23", label: "Behavioral anomalies" }}
                outpostData={{ value: "156", label: "UEBA alerts" }}
                integrated={true}
              />
              <UnifiedDashboardWidget
                title="Incident Response"
                cerebraData={{ value: "8", label: "Auto-contained threats" }}
                outpostData={{ value: "15", label: "Active investigations" }}
                integrated={false}
              />
              <UnifiedDashboardWidget
                title="Compliance Status"
                cerebraData={{ value: "98.2%", label: "Neural compliance score" }}
                outpostData={{ value: "96.7%", label: "Framework compliance" }}
                integrated={true}
              />
              <UnifiedDashboardWidget
                title="Performance Metrics"
                cerebraData={{ value: "45ms", label: "Avg detection time" }}
                outpostData={{ value: "3.2min", label: "Avg response time" }}
                integrated={false}
              />
              <UnifiedDashboardWidget
                title="Risk Assessment"
                cerebraData={{ value: "Medium", label: "AI risk assessment" }}
                outpostData={{ value: "Low", label: "Overall risk posture" }}
                integrated={true}
              />
            </div>

            <Card className="mt-8 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Cross-Platform Threat Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Critical: Advanced Persistent Threat Detected</p>
                      <p className="text-red-300 text-sm">CerebraSec neural analysis identified APT29 TTPs • Outpost Zero confirmed lateral movement</p>
                    </div>
                    <Badge className="bg-red-500/20 text-red-300">Cross-Validated</Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white font-medium">High: Suspicious User Behavior Pattern</p>
                      <p className="text-yellow-300 text-sm">CerebraSec flagged anomalous access • Outpost Zero tracking user session</p>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-300">Investigating</Badge>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Info: Threat Hunting Campaign Complete</p>
                      <p className="text-green-300 text-sm">Joint platform hunt identified 3 previously unknown IoCs • Added to shared threat feed</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300">Resolved</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Integration Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Threat Intelligence Sharing</h4>
                      <p className="text-gray-400 text-sm">Bidirectional threat feed synchronization</p>
                    </div>
                    <Switch checked={integrationStatus.threatIntel} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Unified User Management</h4>
                      <p className="text-gray-400 text-sm">Cross-platform user behavior analytics</p>
                    </div>
                    <Switch checked={integrationStatus.userManagement} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Dashboard Integration</h4>
                      <p className="text-gray-400 text-sm">Unified security operations view</p>
                    </div>
                    <Switch checked={integrationStatus.dashboards} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Workflow Orchestration</h4>
                      <p className="text-gray-400 text-sm">Automated cross-platform responses</p>
                    </div>
                    <Switch checked={integrationStatus.workflows} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Unified Reporting</h4>
                      <p className="text-gray-400 text-sm">Combined compliance and risk reports</p>
                    </div>
                    <Switch checked={integrationStatus.reporting} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">API Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">CerebraSec API Endpoint</h4>
                    <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                      <code className="text-green-400 text-sm">https://cerebrasec.base44.app/api/v1</code>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">Integration Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">API Connection</span>
                        <Badge className="bg-green-500/20 text-green-300">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Data Sync</span>
                        <Badge className="bg-green-500/20 text-green-300">Real-time</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Authentication</span>
                        <Badge className="bg-green-500/20 text-green-300">OAuth 2.0</Badge>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Advanced Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Cross-Platform Effectiveness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Threat Detection Accuracy</span>
                        <span className="text-white">97.8%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '97.8%'}}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">False Positive Reduction</span>
                        <span className="text-white">89.2%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '89.2%'}}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Response Time Improvement</span>
                        <span className="text-white">76.4%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{width: '76.4%'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Integration ROI Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                      <p className="text-2xl font-bold text-green-400">$2.4M</p>
                      <p className="text-green-300 text-sm">Annual Savings</p>
                    </div>
                    <div className="text-center p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                      <p className="text-2xl font-bold text-blue-400">67%</p>
                      <p className="text-blue-300 text-sm">Efficiency Gain</p>
                    </div>
                    <div className="text-center p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                      <p className="text-2xl font-bold text-purple-400">12x</p>
                      <p className="text-purple-300 text-sm">ROI Multiple</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                      <p className="text-2xl font-bold text-yellow-400">3.2min</p>
                      <p className="text-yellow-300 text-sm">Avg MTTR</p>
                    </div>
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