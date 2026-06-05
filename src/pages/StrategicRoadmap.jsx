
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Target,
  Rocket,
  Crown,
  Globe,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Brain,
  Building2,
  Star,
  DollarSign,
  Trophy,
  Eye,
  GitBranch
} from 'lucide-react';

const StrategicInitiative = ({ icon: Icon, title, impact, timeframe, investment, revenue, description, keyActions, risks }) => (
  <Card className="bg-gray-800 border-gray-700 mb-6">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8 text-blue-400" />
          <div>
            <CardTitle className="text-white">{title}</CardTitle>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <Badge className={`${impact === 'Revolutionary' ? 'bg-purple-500/20 text-purple-300' : impact === 'High' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
            {impact} Impact
          </Badge>
          <p className="text-xs text-gray-400 mt-1">{timeframe}</p>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-900/20 p-3 rounded border border-blue-500/30">
          <p className="text-blue-300 text-xs font-semibold">Investment Required</p>
          <p className="text-white font-bold">{investment}</p>
        </div>
        <div className="bg-green-900/20 p-3 rounded border border-green-500/30">
          <p className="text-green-300 text-xs font-semibold">Revenue Potential</p>
          <p className="text-white font-bold">{revenue}</p>
        </div>
        <div className="bg-orange-900/20 p-3 rounded border border-orange-500/30">
          <p className="text-orange-300 text-xs font-semibold">Risk Level</p>
          <p className="text-white font-bold">{risks}</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-white font-semibold mb-2">Key Actions</h4>
        <ul className="space-y-1">
          {keyActions.map((action, index) => (
            <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
              <span className="text-blue-400 mt-1">→</span>
              {action}
            </li>
          ))}
        </ul>
      </div>
    </CardContent>
  </Card>
);

export default function StrategicRoadmap() {
  const [activeTab, setActiveTab] = useState("revenue");

  const revenueOptimizations = [
    {
      icon: Crown,
      title: "Premium 'Cyber Insurance Discount' Program",
      impact: "High",
      timeframe: "Q1-Q2 2026",
      investment: "$25K development",
      revenue: "$2M+ ARR potential",
      description: "Partner with major cyber insurance providers to offer premium discounts based on Outpost Zero security scores.",
      keyActions: [
        "Partner with Travelers, AXA XL, and Chubb for cyber insurance integration",
        "Develop automated risk assessment API for insurance premium calculation",
        "Create 'Cyber Credit Score' similar to financial credit scores",
        "Launch joint marketing campaigns with insurance partners"
      ],
      risks: "Medium"
    },
    {
      icon: Building2,
      title: "White-Label MSP Program",
      impact: "Revolutionary",
      timeframe: "Q2-Q3 2026",
      investment: "$150K development",
      revenue: "$10M+ ARR potential",
      description: "Enable MSSPs to completely white-label Outpost Zero as their own proprietary security platform.",
      keyActions: [
        "Build comprehensive white-labeling infrastructure (logos, colors, domains)",
        "Create MSSP partner portal with client management tools",
        "Develop revenue-sharing model (70/30 split)",
        "Target top 100 MSSPs with $1B+ combined market reach"
      ],
      risks: "Medium-High"
    }
  ];

  const technicalDifferentiators = [
    {
      icon: Brain,
      title: "Quantum-Resistant Security Implementation",
      impact: "Revolutionary",
      timeframe: "Q2-Q4 2026",
      investment: "$200K R&D",
      revenue: "$5M+ ARR from gov/enterprise",
      description: "Be the first cybersecurity platform to implement post-quantum cryptography standards.",
      keyActions: [
        "Implement NIST post-quantum cryptography standards",
        "Partner with quantum computing companies (IBM, Google, Rigetti)",
        "Target government contracts requiring quantum-resistant security",
        "Publish thought leadership on quantum cybersecurity threats"
      ],
      risks: "High"
    },
    {
      icon: Zap,
      title: "Real-Time Threat Correlation Engine",
      impact: "High",
      timeframe: "Q1-Q2 2026",
      investment: "$100K development",
      revenue: "$3M+ ARR premium feature",
      description: "Correlate threats across all customer environments in real-time for collective defense.",
      keyActions: [
        "Build privacy-preserving threat correlation using homomorphic encryption",
        "Create 'Hive Mind' security where all customers benefit from collective intelligence",
        "Implement zero-knowledge proof systems for data privacy",
        "Launch as premium 'Collective Defense' subscription tier"
      ],
      risks: "Medium"
    }
  ];

  const marketExpansion = [
    {
      icon: Globe,
      title: "European GDPR Compliance Suite",
      impact: "High",
      timeframe: "Q1-Q3 2026",
      investment: "$75K compliance",
      revenue: "$4M+ ARR EU market",
      description: "Become the go-to cybersecurity platform for European enterprises requiring strict GDPR compliance.",
      keyActions: [
        "Achieve GDPR certification and SOC 2 Type II compliance",
        "Partner with major European systems integrators",
        "Establish data centers in EU for data residency",
        "Target European financial services and healthcare"
      ],
      risks: "Medium"
    },
    {
      icon: Shield,
      title: "Critical Infrastructure Protection (CIP) Program",
      impact: "Revolutionary",
      timeframe: "Q2 2026 - Q1 2027",
      investment: "$300K development + compliance",
      revenue: "$15M+ ARR potential",
      description: "Target power grids, water systems, and transportation with specialized security solutions.",
      keyActions: [
        "Achieve NERC CIP compliance for power grid protection",
        "Partner with Siemens, GE, and ABB for OT/IT integration",
        "Develop specialized SCADA and industrial control system monitoring",
        "Target Department of Energy and Department of Transportation contracts"
      ],
      risks: "High"
    }
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Strategic Roadmap 2026-2027</h1>
          </div>
          <p className="text-gray-300 text-lg">Game-changing initiatives to 10x your market position</p>
        </div>

        <Alert className="mb-8 border-purple-500/50 bg-purple-500/10">
          <Star className="h-4 w-4 text-purple-400" />
          <AlertDescription className="text-purple-200">
            <strong>Strategic Focus:</strong> These initiatives are designed to create sustainable competitive moats and position you as the undisputed leader in next-generation cybersecurity.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue">Revenue Optimization</TabsTrigger>
            <TabsTrigger value="technical">Technical Differentiation</TabsTrigger>
            <TabsTrigger value="expansion">Market Expansion</TabsTrigger>
            <TabsTrigger value="partnerships">Strategic Partnerships</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Revenue Optimization Strategies</h2>
              <p className="text-gray-400">Maximize revenue per customer and expand monetization opportunities.</p>
            </div>
            {revenueOptimizations.map((initiative, index) => (
              <StrategicInitiative key={index} {...initiative} />
            ))}
          </TabsContent>

          <TabsContent value="technical" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Technical Differentiation</h2>
              <p className="text-gray-400">Create unassailable technical moats that competitors cannot replicate.</p>
            </div>
            {technicalDifferentiators.map((initiative, index) => (
              <StrategicInitiative key={index} {...initiative} />
            ))}
          </TabsContent>

          <TabsContent value="expansion" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Market Expansion</h2>
              <p className="text-gray-400">Enter high-value vertical markets and geographic regions.</p>
            </div>
            {marketExpansion.map((initiative, index) => (
              <StrategicInitiative key={index} {...initiative} />
            ))}
          </TabsContent>

          <TabsContent value="partnerships" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Strategic Partnerships</h2>
              <p className="text-gray-400">Leverage partnerships for exponential growth and market penetration.</p>
            </div>

            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Users className="w-6 h-6 text-green-400" />
                  Priority Partnership Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-green-400 font-semibold">Strategic Technology Partners</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• <strong>NVIDIA:</strong> GPU-accelerated threat detection and AI model training</li>
                      <li>• <strong>AWS/Azure/GCP:</strong> Native cloud security integrations and marketplace presence</li>
                      <li>• <strong>Snowflake:</strong> Data lake integration for large-scale security analytics</li>
                      <li>• <strong>ServiceNow:</strong> ITSM integration for automated incident response</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-blue-400 font-semibold">Channel & Distribution Partners</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• <strong>Accenture/Deloitte:</strong> Enterprise consulting and implementation services</li>
                      <li>• <strong>CDW/SHI/Insight:</strong> Government and enterprise reseller channels</li>
                      <li>• <strong>Regional MSSPs:</strong> White-label and co-branded solutions</li>
                      <li>• <strong>System Integrators:</strong> Custom deployment and configuration services</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <Trophy className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-200">
                <strong>Immediate Action:</strong> Focus on the top 3 initiatives that align with your current team capacity and provide the fastest ROI.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
