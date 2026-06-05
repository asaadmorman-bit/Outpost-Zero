import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";
import { 
  Shield, Cloud, Server, Eye, CheckCircle, Lock, 
  Activity, DollarSign, Zap, Users, Brain, FileText,
  ExternalLink, ArrowRight
} from "lucide-react";

const frameworkItems = [
  {
    title: "Cloud Adoption Framework (CAF)",
    description: "Multi-tenant security SaaS with clear Ready / Secure / Manage considerations.",
    icon: Cloud,
    color: "text-blue-400"
  },
  {
    title: "Well-Architected Framework",
    description: "Design based on reliability, security, cost optimization, operational excellence, and performance efficiency.",
    icon: CheckCircle,
    color: "text-green-400"
  },
  {
    title: "Zero Trust",
    description: "Tenant isolation, verify-every-time access model, and assume breach posture.",
    icon: Lock,
    color: "text-purple-400"
  },
  {
    title: "Microsoft Entra & Defender",
    description: "Integration points defined for identity and threat signals.",
    icon: Shield,
    color: "text-orange-400"
  },
  {
    title: "Responsible AI",
    description: "AI features expose explanations, use human-in-the-loop review, and minimize bias.",
    icon: Brain,
    color: "text-pink-400"
  }
];

const wafPillars = [
  { name: "Reliability", icon: Activity, color: "bg-green-500/20 text-green-400" },
  { name: "Security", icon: Shield, color: "bg-red-500/20 text-red-400" },
  { name: "Cost Optimization", icon: DollarSign, color: "bg-yellow-500/20 text-yellow-400" },
  { name: "Operational Excellence", icon: Zap, color: "bg-blue-500/20 text-blue-400" },
  { name: "Performance", icon: Server, color: "bg-purple-500/20 text-purple-400" }
];

export default function ArchitectureOverview() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Architecture & Compliance Overview
          </h1>
          <p className="text-gray-400">
            How Outpost Zero aligns with Microsoft cloud architecture and marketplace guidance.
          </p>
        </div>

        {/* Architecture Diagram */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              Azure Architecture (High Level)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 p-4 rounded-lg text-gray-300 text-sm overflow-x-auto font-mono">
{`┌─────────────────────────────────────────────────────────────────┐
│                         [ Browser ]                              │
│                              │                                   │
│                              ▼                                   │
│              ┌───────────────────────────────┐                   │
│              │  Outpost Zero Frontend (SPA)  │                   │
│              │   • React + Tailwind CSS      │                   │
│              │   • Microsoft Entra ID Auth   │                   │
│              └───────────────┬───────────────┘                   │
│                              │ HTTPS                             │
│                              ▼                                   │
│              ┌───────────────────────────────┐                   │
│              │   Outpost Zero API Layer      │                   │
│              │   • Azure App Service / ACA   │                   │
│              │   • RBAC + Tenant Isolation   │                   │
│              └───────────────┬───────────────┘                   │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐              │
│         │                    │                    │              │
│         ▼                    ▼                    ▼              │
│  ┌─────────────┐    ┌───────────────┐    ┌──────────────┐        │
│  │  Defender   │    │  Data Store   │    │  Telemetry   │        │
│  │  Entra ID   │    │  SQL/Cosmos   │    │  App Insights│        │
│  │  Graph API  │    │  Key Vault    │    │  Az Monitor  │        │
│  └─────────────┘    └───────────────┘    └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘`}
            </pre>
            <p className="text-gray-400 text-sm mt-4">
              In this POC, the UI simulates authentication and data ingestion but
              the layout and configuration are ready for real Microsoft Entra and
              Defender integrations.
            </p>
          </CardContent>
        </Card>

        {/* WAF Pillars */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Azure Well-Architected Framework Pillars
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {wafPillars.map((pillar) => (
                <div 
                  key={pillar.name}
                  className={`${pillar.color} p-4 rounded-lg text-center`}
                >
                  <pillar.icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{pillar.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Framework Alignment */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-yellow-400" />
              Framework Alignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {frameworkItems.map((item) => (
                <div 
                  key={item.title}
                  className="flex items-start gap-4 p-4 bg-gray-900 rounded-lg"
                >
                  <div className={`p-2 rounded-lg bg-gray-800`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SaaS Offer & Compliance */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Cloud className="w-5 h-5 text-blue-400" />
                SaaS Offer Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">Transactable SaaS in Microsoft Marketplace</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">Fulfillment API & per-tenant provisioning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">Azure Monitor & App Insights telemetry</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">Cost Management integration</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Compliance Alignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500/20 text-green-400">SOC 1</Badge>
                <Badge className="bg-green-500/20 text-green-400">SOC 2</Badge>
                <Badge className="bg-green-500/20 text-green-400">ISO 27001</Badge>
              </div>
              <p className="text-gray-400 text-sm">
                Azure services used by Outpost Zero benefit from Azure's underlying 
                certifications. Application layer adds access control, encryption, 
                and logging controls.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <p className="text-gray-500 text-sm">
            For detailed documentation, see <code className="text-blue-400">docs/architecture/azure-architecture.md</code>
          </p>
          <div className="flex gap-4">
            <Link 
              to={createPageUrl('DemoDashboard')} 
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
            >
              Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to={createPageUrl('DemoIncidents')} 
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
            >
              Incidents <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}