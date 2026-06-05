
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target, 
  Globe, 
  Users, 
  TrendingUp, 
  Zap, 
  Star,
  Crown,
  Lightbulb,
  Shield,
  Rocket,
  Brain,
  Building2,
  DollarSign,
  Trophy,
  Crosshair
} from 'lucide-react';

const StrategyCard = ({ icon: Icon, title, impact, timeline, investment, children }) => (
  <Card className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300 h-full">
    <CardHeader>
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-8 h-8 text-blue-400" />
        <Badge className={`${impact === 'Massive' ? 'bg-purple-500/20 text-purple-300' : impact === 'High' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
          {impact} Impact
        </Badge>
      </div>
      <CardTitle className="text-white text-lg">{title}</CardTitle>
      <div className="flex gap-2 mt-2">
        <Badge variant="outline" className="text-xs">{timeline}</Badge>
        <Badge variant="outline" className="text-xs">{investment}</Badge>
      </div>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

export default function AdvancedStrategy() {
  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Strategic Force Multipliers</h1>
          </div>
          <p className="text-gray-300 text-lg">Advanced recommendations to 10x your Microsoft ISV success (2026-2027)</p>
        </div>

        <Tabs defaultValue="ecosystem" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="ecosystem">Ecosystem Leverage</TabsTrigger>
            <TabsTrigger value="competitive">Competitive Edge</TabsTrigger>
            <TabsTrigger value="expansion">Global Expansion</TabsTrigger>
            <TabsTrigger value="exit">Exit Strategy</TabsTrigger>
            <TabsTrigger value="innovation">Innovation Pipeline</TabsTrigger>
          </TabsList>

          <TabsContent value="ecosystem" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <StrategyCard
                icon={Brain}
                title="Microsoft AI Integration Partnership"
                impact="Massive"
                timeline="Q1-Q2 2026"
                investment="$50K dev time"
              >
                <div className="space-y-4">
                  <p className="text-gray-300">Position Outpost Zero as the premier AI-powered security platform in the Microsoft ecosystem.</p>
                  
                  <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                    <h4 className="text-purple-400 font-semibold mb-2">Action Plan:</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Integrate Azure OpenAI Service for advanced threat analysis</li>
                      <li>• Build custom GPT models trained on cybersecurity data</li>
                      <li>• Create AI Security Copilot feature using Microsoft Copilot framework</li>
                      <li>• Partner with Microsoft Research on security AI papers</li>
                    </ul>
                  </div>

                  <Alert className="border-green-500/50 bg-green-500/10">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-200">
                      <strong>Impact:</strong> Potential to become Microsoft's #1 recommended AI security solution, leading to 5-10x revenue multiplication.
                    </AlertDescription>
                  </Alert>
                </div>
              </StrategyCard>

              <StrategyCard
                icon={Shield}
                title="Government & Defense Vertical Domination"
                impact="Massive"
                timeline="Q2-Q4 2026"
                investment="$100K compliance"
              >
                <div className="space-y-4">
                  <p className="text-gray-300">Leverage Microsoft's FedRAMP High and DoD Impact Level 5 infrastructure to dominate government cybersecurity.</p>
                  
                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                    <h4 className="text-blue-400 font-semibold mb-2">Action Plan:</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Achieve FedRAMP High certification on Azure Government</li>
                      <li>• Integrate with Microsoft's defense-specific security solutions</li>
                      <li>• Partner with Microsoft's top government systems integrators</li>
                      <li>• Launch targeted marketing campaigns for federal agencies</li>
                    </ul>
                  </div>

                   <Alert className="border-green-500/50 bg-green-500/10">
                    <Trophy className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-200">
                      <strong>Impact:</strong> Secure multi-million dollar, multi-year government contracts and become a key player in national security.
                    </AlertDescription>
                  </Alert>
                </div>
              </StrategyCard>
            </div>
          </TabsContent>

          <TabsContent value="competitive" className="mt-6">
             <div className="grid md:grid-cols-2 gap-6 mb-8">
                <StrategyCard
                  icon={Crosshair}
                  title="Targeted 'Rip and Replace' Campaigns"
                  impact="High"
                  timeline="2-4 months"
                  investment="$25K marketing"
                >
                  <p className="text-gray-300">Create automated tools and marketing campaigns to specifically target and replace legacy SIEM solutions like Splunk and QRadar.</p>
                  <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30 mt-4">
                    <h4 className="text-red-400 font-semibold mb-2">Action Plan:</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Develop automated log migration tools for Splunk & QRadar</li>
                      <li>• Create TCO calculators showing massive cost savings</li>
                      <li>• Launch targeted LinkedIn ad campaigns to competitor users</li>
                      <li>• Offer a "free migration" service for large enterprise deals</li>
                    </ul>
                  </div>
                </StrategyCard>
                 <StrategyCard
                  icon={Trophy}
                  title="Gartner Magic Quadrant Leadership"
                  impact="High"
                  timeline="9-18 months"
                  investment="$75K analyst relations"
                >
                  <p className="text-gray-300">Execute a focused strategy to become a "Leader" in the Gartner Magic Quadrant for SIEM and Security Operations.</p>
                  <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30 mt-4">
                    <h4 className="text-yellow-400 font-semibold mb-2">Action Plan:</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Engage Gartner analysts with regular product briefings</li>
                      <li>• Align product roadmap with Gartner's future of SOAR vision</li>
                      <li>• Encourage top customers to provide Gartner Peer Insights reviews</li>
                      <li>• Build out features specifically to meet MQ criteria</li>
                    </ul>
                  </div>
                </StrategyCard>
             </div>
          </TabsContent>

           <TabsContent value="expansion" className="mt-6">
             <p className="text-center text-gray-400">Global expansion strategies will be detailed here.</p>
          </TabsContent>
           <TabsContent value="exit" className="mt-6">
             <p className="text-center text-gray-400">Exit strategies and acquisition positioning will be detailed here.</p>
          </TabsContent>
           <TabsContent value="innovation" className="mt-6">
             <p className="text-center text-gray-400">Long-term innovation pipeline and R&D will be detailed here.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
