import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, AlertTriangle, Activity, Users, Brain, Clock, 
  CheckCircle, XCircle, Play, ArrowRight, Target, X,
  TrendingUp, Zap, Eye, Network, FileText
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const RansomwareDemo = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [incidents, setIncidents] = useState([
    { id: 1, title: 'WannaCry Detected on HR-SERVER-03', severity: 'Critical', status: 'Investigating', progress: 25 },
    { id: 2, title: 'Suspicious File Encryption Activity', severity: 'High', status: 'Open', progress: 0 }
  ]);
  
  const [metrics, setMetrics] = useState({
    threatsBlocked: 1247,
    activeIncidents: 2,
    automatedResponses: 5,
    avgResponseTime: 3.2
  });

  const demoSteps = [
    {
      title: "Ransomware Detection",
      description: "AI detects unusual file encryption patterns",
      action: () => {
        setMetrics(prev => ({ ...prev, threatsBlocked: prev.threatsBlocked + 1 }));
      }
    },
    {
      title: "Automated Containment",
      description: "System automatically isolates affected endpoints",
      action: () => {
        setIncidents(prev => prev.map(inc => 
          inc.id === 1 ? { ...inc, status: 'Contained', progress: 60 } : inc
        ));
        setMetrics(prev => ({ ...prev, automatedResponses: prev.automatedResponses + 1 }));
      }
    },
    {
      title: "Recovery Initiation", 
      description: "Clean backups restored, systems brought back online",
      action: () => {
        setIncidents(prev => prev.map(inc => 
          inc.id === 1 ? { ...inc, status: 'Resolved', progress: 100 } : inc
        ));
        setMetrics(prev => ({ ...prev, activeIncidents: prev.activeIncidents - 1 }));
      }
    }
  ];

  const nextStep = () => {
    if (step < demoSteps.length - 1) {
      demoSteps[step].action();
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-red-900/20 border-red-500/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-200">Threats Blocked</p>
                <p className="text-2xl font-bold text-white">{metrics.threatsBlocked}</p>
              </div>
              <Shield className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-900/20 border-orange-500/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-200">Active Incidents</p>
                <p className="text-2xl font-bold text-white">{metrics.activeIncidents}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-900/20 border-blue-500/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">Auto Responses</p>
                <p className="text-2xl font-bold text-white">{metrics.automatedResponses}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-900/20 border-green-500/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-200">Avg Response</p>
                <p className="text-2xl font-bold text-white">{metrics.avgResponseTime}min</p>
              </div>
              <Clock className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Active Incidents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incidents.map(incident => (
              <div key={incident.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{incident.title}</h3>
                  <Badge className={
                    incident.status === 'Resolved' ? 'bg-green-500/20 text-green-300' :
                    incident.status === 'Contained' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }>
                    {incident.status}
                  </Badge>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${incident.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400">Severity: {incident.severity} | Progress: {incident.progress}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-500/50 bg-blue-900/20">
        <CardHeader>
          <CardTitle className="text-blue-300">Demo Step {step + 1} of {demoSteps.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">{demoSteps[step].title}</h3>
            <p className="text-gray-300">{demoSteps[step].description}</p>
            <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
              {step < demoSteps.length - 1 ? (
                <>Execute Step <ArrowRight className="w-4 h-4 ml-2" /></>
              ) : (
                <>Complete Demo <CheckCircle className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InsiderThreatDemo = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [users, setUsers] = useState([
    { id: 1, name: 'John Smith', riskScore: 85, activity: 'Unusual data access', status: 'Investigating' },
    { id: 2, name: 'Sarah Connor', riskScore: 45, activity: 'Normal behavior', status: 'Clear' }
  ]);

  const [anomalies, setAnomalies] = useState([
    { time: '14:30', event: 'Large file download outside business hours', user: 'John Smith', risk: 85 },
    { time: '14:45', event: 'Access to restricted directories', user: 'John Smith', risk: 92 }
  ]);

  const demoSteps = [
    {
      title: "Behavioral Analysis",
      description: "AI detects anomalous user behavior patterns",
      action: () => {
        setUsers(prev => prev.map(user => 
          user.id === 1 ? { ...user, riskScore: 92, status: 'High Risk' } : user
        ));
      }
    },
    {
      title: "Investigation Tools",
      description: "Deep dive into user activity timeline and data access patterns",
      action: () => {
        setAnomalies(prev => [...prev, 
          { time: '15:00', event: 'Attempted external data transfer', user: 'John Smith', risk: 98 }
        ]);
      }
    },
    {
      title: "Automated Response",
      description: "System restricts user access and alerts security team",
      action: () => {
        setUsers(prev => prev.map(user => 
          user.id === 1 ? { ...user, status: 'Access Restricted', riskScore: 98 } : user
        ));
      }
    }
  ];

  const nextStep = () => {
    if (step < demoSteps.length - 1) {
      demoSteps[step].action();
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              High-Risk Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map(user => (
                <div key={user.id} className="p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{user.name}</span>
                    <Badge className={
                      user.status === 'Clear' ? 'bg-green-500/20 text-green-300' :
                      user.status === 'High Risk' ? 'bg-red-500/20 text-red-300' :
                      user.status === 'Access Restricted' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }>
                      {user.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Risk Score: {user.riskScore}</span>
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          user.riskScore > 80 ? 'bg-red-500' :
                          user.riskScore > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${user.riskScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-yellow-400" />
              Anomaly Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {anomalies.map((anomaly, index) => (
                <div key={index} className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-mono text-red-300">{anomaly.time}</span>
                    <Badge className="bg-red-500/20 text-red-300">Risk: {anomaly.risk}</Badge>
                  </div>
                  <p className="text-sm text-white">{anomaly.event}</p>
                  <p className="text-xs text-gray-400">User: {anomaly.user}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-purple-500/50 bg-purple-900/20">
        <CardHeader>
          <CardTitle className="text-purple-300">Demo Step {step + 1} of {demoSteps.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">{demoSteps[step].title}</h3>
            <p className="text-gray-300">{demoSteps[step].description}</p>
            <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-700">
              {step < demoSteps.length - 1 ? (
                <>Execute Step <ArrowRight className="w-4 h-4 ml-2" /></>
              ) : (
                <>Complete Demo <CheckCircle className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AIResponseDemo = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [aiStatus, setAiStatus] = useState('Monitoring');
  const [processes, setProcesses] = useState([
    { id: 1, name: 'Threat Detection', status: 'Running', confidence: 94 },
    { id: 2, name: 'Response Planning', status: 'Idle', confidence: 0 },
    { id: 3, name: 'Action Execution', status: 'Idle', confidence: 0 }
  ]);

  const demoSteps = [
    {
      title: "AI Threat Detection",
      description: "AI identifies potential security breach with 94% confidence",
      action: () => {
        setAiStatus('Threat Detected');
        setProcesses(prev => prev.map(proc => 
          proc.id === 2 ? { ...proc, status: 'Running', confidence: 89 } : proc
        ));
      }
    },
    {
      title: "Autonomous Response Planning",
      description: "AI generates optimal response strategy in milliseconds",
      action: () => {
        setAiStatus('Response Planned');
        setProcesses(prev => prev.map(proc => 
          proc.id === 3 ? { ...proc, status: 'Running', confidence: 96 } : proc
        ));
      }
    },
    {
      title: "Automated Execution",
      description: "AI executes containment actions without human intervention",
      action: () => {
        setAiStatus('Threat Neutralized');
        setProcesses(prev => prev.map(proc => ({ ...proc, status: 'Complete', confidence: 98 })));
      }
    }
  ];

  const nextStep = () => {
    if (step < demoSteps.length - 1) {
      demoSteps[step].action();
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-500/50 bg-blue-900/20">
        <CardHeader>
          <CardTitle className="text-blue-300 flex items-center gap-2">
            <Brain className="w-6 h-6" />
            AI Security Engine Status: {aiStatus}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processes.map(process => (
              <div key={process.id} className="p-4 bg-gray-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{process.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      process.status === 'Complete' ? 'bg-green-500/20 text-green-300' :
                      process.status === 'Running' ? 'bg-blue-500/20 text-blue-300 animate-pulse' :
                      'bg-gray-500/20 text-gray-300'
                    }>
                      {process.status}
                    </Badge>
                    {process.confidence > 0 && (
                      <Badge variant="outline" className="text-cyan-300 border-cyan-300/50">
                        {process.confidence}% Confidence
                      </Badge>
                    )}
                  </div>
                </div>
                {process.status === 'Running' && (
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-500/50 bg-green-900/20">
        <CardHeader>
          <CardTitle className="text-green-300">Demo Step {step + 1} of {demoSteps.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">{demoSteps[step].title}</h3>
            <p className="text-gray-300">{demoSteps[step].description}</p>
            <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
              {step < demoSteps.length - 1 ? (
                <>Execute Step <ArrowRight className="w-4 h-4 ml-2" /></>
              ) : (
                <>Complete Demo <CheckCircle className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function InteractivePlatformDemo({ demoType, tier = 'smb' }) {
  const [currentDemo, setCurrentDemo] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const demos = {
    'ransomware-simulation': RansomwareDemo,
    'insider-threat': InsiderThreatDemo,
    'ai-response': AIResponseDemo
  };

  const tierFeatures = {
    residential: ['Basic Threat Detection', 'Network Monitoring', 'Mobile Alerts'],
    smb: ['Advanced Analytics', 'SOAR Integration', 'Compliance Reporting'],
    enterprise: ['AI-Powered Response', 'Custom Integrations', 'Advanced Threat Hunting'],
    government: ['Classified Data Protection', 'Air-Gap Capability', 'Counter-Intelligence']
  };

  const handleStartDemo = (demoKey) => {
    setCurrentDemo(demoKey);
    setIsComplete(false);
  };

  const handleCompleteDemo = () => {
    setIsComplete(true);
    setTimeout(() => {
      setCurrentDemo(null);
      setIsComplete(false);
    }, 3000);
  };

  if (isComplete) {
    return (
      <Card className="border-green-500/50 bg-green-900/20 text-center p-8">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Demo Complete!</h2>
        <p className="text-gray-300 mb-4">You've experienced the power of Outpost Zero's autonomous security platform.</p>
        <Button className="bg-green-600 hover:bg-green-700">
          Start Your Free Trial
        </Button>
      </Card>
    );
  }

  if (currentDemo) {
    const DemoComponent = demos[currentDemo];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Interactive Demo: {currentDemo.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h2>
          <Button variant="outline" onClick={() => setCurrentDemo(null)} className="border-gray-600">
            <X className="w-4 h-4 mr-2" />
            Exit Demo
          </Button>
        </div>
        <Badge className={`bg-${tier === 'residential' ? 'blue' : tier === 'smb' ? 'purple' : tier === 'enterprise' ? 'orange' : 'red'}-500/20 text-${tier === 'residential' ? 'blue' : tier === 'smb' ? 'purple' : tier === 'enterprise' ? 'orange' : 'red'}-300`}>
          {tier.toUpperCase()} Tier Features
        </Badge>
        <DemoComponent onComplete={handleCompleteDemo} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Experience Outpost Zero Live</h1>
        <p className="text-gray-300">Interactive demos showing real product capabilities for {tier.toUpperCase()} tier</p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {tierFeatures[tier].map(feature => (
            <Badge key={feature} variant="outline" className="text-blue-300 border-blue-300/50">
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-red-500/50 bg-red-900/20 hover:bg-red-900/30 transition-all cursor-pointer" onClick={() => handleStartDemo('ransomware-simulation')}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <div>
                <CardTitle className="text-white">Ransomware Response</CardTitle>
                <p className="text-sm text-gray-400">5 minute interactive demo</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">Watch AI detect, contain, and recover from a live ransomware attack simulation.</p>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              <Play className="w-4 h-4 mr-2" />
              Start Demo
            </Button>
          </CardContent>
        </Card>

        <Card className="border-purple-500/50 bg-purple-900/20 hover:bg-purple-900/30 transition-all cursor-pointer" onClick={() => handleStartDemo('insider-threat')}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-400" />
              <div>
                <CardTitle className="text-white">Insider Threat Detection</CardTitle>
                <p className="text-sm text-gray-400">7 minute interactive demo</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">Experience behavioral analytics identifying suspicious user activities in real-time.</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Play className="w-4 h-4 mr-2" />
              Start Demo
            </Button>
          </CardContent>
        </Card>

        <Card className="border-green-500/50 bg-green-900/20 hover:bg-green-900/30 transition-all cursor-pointer" onClick={() => handleStartDemo('ai-response')}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-green-400" />
              <div>
                <CardTitle className="text-white">AI Autonomous Response</CardTitle>
                <p className="text-sm text-gray-400">6 minute interactive demo</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">See AI make security decisions and execute responses without human intervention.</p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Start Demo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}