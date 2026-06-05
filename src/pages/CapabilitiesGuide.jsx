import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield, Activity, Users, Settings, AlertTriangle, Eye, BookOpen, BarChart3, Network, PlayCircle, Search, Bell,
  User as UserIcon, Menu, X, FileText, Box, Swords, ClipboardList, Server, CheckCircle, Cloud, GitBranch,
  BrainCircuit, PieChart, Brain, Smartphone, Heart, Code, TrendingUp, Target, BookUser, FlaskConical, Share2,
  Rocket, Crown, Bot, LifeBuoy, LogOut
} from 'lucide-react';

const CapabilityCard = ({ icon: Icon, title, whatItIs, whyItMatters, example }) => (
  <Card className="bg-gray-800 border-gray-700 w-full mb-6">
    <CardHeader>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-blue-500/10 rounded-lg">
          <Icon className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <CardTitle className="text-xl text-white">{title}</CardTitle>
          <p className="text-gray-300 font-semibold mt-2">What it is:</p>
          <p className="text-gray-400">{whatItIs}</p>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-1">Why it Matters:</h4>
          <p className="text-gray-300 text-sm">{whyItMatters}</p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-1">Example in Plain English:</h4>
          <p className="text-gray-300 text-sm">{example}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const capabilities = {
  core: [
    {
      icon: BarChart3,
      title: 'Dashboard',
      whatItIs: "Your main command center, showing a real-time snapshot of your organization's security health.",
      whyItMatters: "It's like the main screen in a mission control room. It instantly tells you if everything is okay or if a problem needs immediate attention, helping you focus on what's most important.",
      example: "A manager logs in, sees the Threat Level is 'Critical', and immediately knows to alert the response team, without needing to understand the technical details of the attack."
    },
    {
      icon: AlertTriangle,
      title: 'Incidents',
      whatItIs: "A prioritized list of confirmed security problems, like a fire alarm being pulled.",
      whyItMatters: "This separates the real threats from the noise. Instead of sifting through thousands of minor alerts, your team can focus on the confirmed fires that need to be put out.",
      example: "A 'Ransomware Attack' incident is created automatically. This acts as a case file where analysts can track every action taken to contain and resolve the threat."
    },
    {
      icon: Search,
      title: 'Investigations',
      whatItIs: "A digital workbench for your security detectives to dig deep into complex threats.",
      whyItMatters: "It provides the tools and evidence needed to understand exactly how an attacker got in, what they did, and how to prevent it from happening again, much like a forensic investigation.",
      example: "An analyst uses the Investigation workbench to trace an attacker's steps from a phishing email to the files they tried to steal, creating a clear timeline of the breach."
    },
  ],
  automation: [
    {
      icon: PlayCircle,
      title: 'SOAR (Automation & Response)',
      whatItIs: "An automated 'playbook' that runs pre-defined actions to handle common security alerts instantly.",
      whyItMatters: "It's like having a robot security guard that can instantly lock down a compromised account the second a threat is detected, 24/7, without needing a human to intervene.",
      example: "A user logs in from an unusual country. SOAR automatically triggers, temporarily suspends the account, and sends an alert to both the user and the security team to verify the activity."
    },
     {
      icon: Brain,
      title: 'AI Advisory Center',
      whatItIs: "Your dedicated AI security expert that provides plain-English advice on how to fix security weaknesses.",
      whyItMatters: "Instead of just telling you there's a problem, the AI advisor tells you exactly how to fix it and why it's important, turning complex issues into a simple to-do list.",
      example: "The AI Advisor flags an 'Over-privileged User Account' and recommends specific, safe-to-remove permissions, helping prevent potential insider threats."
    },
  ],
  strategic: [
     {
      icon: PieChart,
      title: 'Executive Dashboard',
      whatItIs: "A high-level summary of security posture translated into business terms like financial risk and ROI.",
      whyItMatters: "This bridges the gap between technical security data and business leadership. It answers the question 'How is our security investment protecting the company's bottom line?'.",
      example: "The CEO reviews this dashboard before a board meeting to confidently report that the company's 'Estimated Breach Cost' has decreased by 20% this quarter due to new security measures."
    },
    {
      icon: CheckCircle,
      title: 'Compliance',
      whatItIs: "An automated system that continuously checks if your security setup meets legal and industry standards (like CMMC or RMF).",
      whyItMatters: "It automates the painful, manual process of audit preparation, saving hundreds of hours and ensuring you're always ready for an official inspection.",
      example: "Instead of a 3-month scramble, the compliance team can generate an up-to-date RMF compliance report with one click, showing evidence for every single control."
    },
  ]
};

export default function CapabilitiesGuide() {
  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Platform Capabilities Guide</h1>
          </div>
          <p className="text-gray-300 text-lg">Your non-technical guide to understanding the power of Outpost Zero.</p>
        </div>

        <Tabs defaultValue="core" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="core">Core Operations</TabsTrigger>
            <TabsTrigger value="automation">Automation & Response</TabsTrigger>
            <TabsTrigger value="strategic">Strategic Management</TabsTrigger>
          </TabsList>

          <TabsContent value="core" className="mt-6">
            {capabilities.core.map(cap => <CapabilityCard key={cap.title} {...cap} />)}
          </TabsContent>
          <TabsContent value="automation" className="mt-6">
            {capabilities.automation.map(cap => <CapabilityCard key={cap.title} {...cap} />)}
          </TabsContent>
          <TabsContent value="strategic" className="mt-6">
            {capabilities.strategic.map(cap => <CapabilityCard key={cap.title} {...cap} />)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}