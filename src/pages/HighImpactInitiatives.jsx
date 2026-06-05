
import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Zap, 
  Crown, 
  Rocket, 
  Brain, 
  Shield,
  TrendingUp,
  Users,
  DollarSign,
  Trophy,
  Crosshair,
  Swords,
  Building2,
  Clock,
  Star,
  Eye,
  Globe,
  Lock
} from 'lucide-react';

const DisruptionStrategy = ({ icon: Icon, title, target, timeframe, investment, impact, tactics, advantages, nextSteps }) => (
  <Card className="bg-gray-800 border-gray-700 mb-6 hover:border-red-500/50 transition-all duration-300">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8 text-red-400" />
          <div>
            <CardTitle className="text-white text-xl">{title}</CardTitle>
            <p className="text-gray-400">Target: <span className="text-red-300 font-semibold">{target}</span></p>
          </div>
        </div>
        <div className="text-right">
          <Badge className="bg-red-500/20 text-red-300 mb-2">{impact} Impact</Badge>
          <p className="text-xs text-gray-400">{timeframe}</p>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-900/20 p-4 rounded border border-red-500/30">
          <h4 className="text-red-300 font-semibold mb-2">Disruption Tactics</h4>
          <ul className="space-y-1">
            {tactics.map((tactic, index) => (
              <li key={index} className="text-gray-300 text-sm flex items-start gap-1">
                <Swords className="w-3 h-3 text-red-400 mt-1 flex-shrink-0" />
                {tactic}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-green-900/20 p-4 rounded border border-green-500/30">
          <h4 className="text-green-300 font-semibold mb-2">Your Advantages</h4>
          <ul className="space-y-1">
            {advantages.map((advantage, index) => (
              <li key={index} className="text-gray-300 text-sm flex items-start gap-1">
                <Star className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                {advantage}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-blue-900/20 p-4 rounded border border-blue-500/30">
          <h4 className="text-blue-300 font-semibold mb-2">Next 30 Days</h4>
          <ul className="space-y-1">
            {nextSteps.map((step, index) => (
              <li key={index} className="text-gray-300 text-sm flex items-start gap-1">
                <Target className="w-3 h-3 text-blue-400 mt-1 flex-shrink-0" />
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <Alert className="border-orange-500/50 bg-orange-500/10">
        <Trophy className="h-4 w-4 text-orange-400" />
        <AlertDescription className="text-orange-200">
          <strong>Investment Required:</strong> {investment} | <strong>Expected Timeline:</strong> {timeframe}
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
);

export default function HighImpactInitiatives() {
  const [access, setAccess] = useState('loading');

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const currentUser = await User.me();
        // Check for admin role and specific email domain
        if (currentUser && currentUser.role === 'admin' && currentUser.email.endsWith('@cyberdojogroup.com')) {
          setAccess('granted');
        } else {
          setAccess('denied');
        }
      } catch (error) {
        setAccess('denied');
      }
    };
    checkAccess();
  }, []);

  const strategies = [
    {
      icon: Zap,
      title: "Lightning Fast Deployment Strategy",
      target: "GDIT's 18-month implementation cycles",
      timeframe: "Q1-Q2 2026",
      investment: "$25K in sales materials",
      impact: "Revolutionary",
      tactics: [
        "Offer 30-day proof-of-concept deployments vs their 6-month pilots",
        "Pre-built government compliance templates (NIST, FedRAMP, etc.)",
        "Cloud-native architecture vs their legacy on-premise solutions",
        "AI-automated security assessments vs manual consulting"
      ],
      advantages: [
        "Modern cloud architecture = instant scalability",
        "No legacy technical debt slowing you down",
        "Automated compliance reporting vs manual processes",
        "Real-time threat response vs quarterly security reviews"
      ],
      nextSteps: [
        "Create '30-Day Government Security Transformation' package",
        "Build FedRAMP-ready deployment templates",
        "Document speed advantages with concrete examples",
        "Identify government contacts frustrated with slow contractors"
      ]
    },
    {
      icon: DollarSign,
      title: "Cost Disruption Model",
      target: "Maximus's $100M+ contract monopolies",
      timeframe: "Q1-Q3 2026",
      investment: "$75K in pricing studies",
      impact: "Massive",
      tactics: [
        "Offer fixed-price AI security at 60% less than their cost-plus contracts",
        "Transparent pricing vs their opaque billing structures",
        "Outcome-based contracts: pay for results, not hours",
        "Demonstrate ROI within 90 days vs their multi-year payback"
      ],
      advantages: [
        "No massive overhead structure to support",
        "AI automation reduces labor costs by 80%",
        "Cloud efficiency vs their data center expenses",
        "Predictable subscription model vs project overruns"
      ],
      nextSteps: [
        "Develop government-specific pricing calculator",
        "Create cost comparison white papers",
        "Build ROI demonstration materials",
        "Target agencies with budget constraints"
      ]
    },
    {
      icon: Brain,
      title: "AI-Native Security Revolution",
      target: "Legacy SIEM vendors (Splunk, QRadar)",
      timeframe: "Q2-Q4 2026",
      investment: "$150K AI development",
      impact: "Revolutionary",
      tactics: [
        "AI threat detection in seconds vs their hours of manual analysis",
        "Automated playbook generation vs their static rule sets",
        "Predictive threat modeling vs reactive security posture",
        "Natural language security queries vs complex query languages"
      ],
      advantages: [
        "Built AI-first from ground up, not bolted on",
        "GPU-accelerated processing for real-time analysis",
        "Self-learning systems that improve over time",
        "No need for specialized SIEM engineers"
      ],
      nextSteps: [
        "Launch AI Security Benchmark Report",
        "Create head-to-head comparison demos",
        "Build AI explainability features for compliance",
        "Target enterprises with large security teams"
      ]
    },
    {
      icon: Globe,
      title: "Global Defense Intelligence Network",
      target: "Fragmented national security solutions",
      timeframe: "Q3 2026 - Q2 2027",
      investment: "$500K international expansion",
      impact: "Revolutionary",
      tactics: [
        "Create cross-border threat intelligence sharing platform",
        "Partner with NATO Cooperative Cyber Defence Centre of Excellence",
        "Build region-specific compliance frameworks (EU NIS2, UK NCSC, etc.)",
        "Establish presence in Five Eyes countries (US, UK, CA, AU, NZ)"
      ],
      advantages: [
        "First platform to enable truly global defense coordination",
        "Multi-sovereign cloud deployment capabilities",
        "Real-time threat intel sharing across borders",
        "Compliance with all major international frameworks"
      ],
      nextSteps: [
        "Engage with NATO CCDCOE for partnership discussions",
        "Establish European subsidiary for GDPR compliance",
        "Build relationships with Five Eyes defense agencies",
        "Create international threat sharing protocols"
      ]
    }
  ];

  if (access === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying Permissions...</p>
        </div>
      </div>
    );
  }

  if (access === 'denied') {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-gray-900 p-8">
        <Card className="max-w-md w-full bg-gray-800 border-red-500/50">
            <CardHeader className="text-center">
                <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <CardTitle className="text-2xl text-white">Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-300 text-center">
                    This content is restricted to Cyber Dojo Solutions leadership and administrative personnel. Please contact your system administrator if you believe this is an error.
                </p>
            </CardContent>
        </Card>
    </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crosshair className="w-8 h-8 text-red-400" />
            <h1 className="text-3xl font-bold text-white">High-Impact Disruption Playbook (2026-2027)</h1>
          </div>
          <p className="text-gray-300 text-lg">Strategic moves to outmaneuver Maximus, GDIT, SAIC, and other legacy contractors</p>
        </div>

        <Alert className="mb-8 border-red-500/50 bg-red-500/10">
          <Crosshair className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">
            <strong>CONFIDENTIAL - CDS LEADERSHIP ONLY:</strong> These strategies target specific competitors and require careful execution. Updated for 2026-2027 execution timeline.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {strategies.map((strategy, index) => (
            <DisruptionStrategy key={index} {...strategy} />
          ))}
        </div>
      </div>
    </div>
  );
}
