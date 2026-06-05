import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Milestone, UserCheck, ShieldQuestion } from 'lucide-react';

const mockCyberThreats = [
  { id: 1, indicator: "apt42.evil.com", threat_actor: "APT42", counter_intel_case_id: "CI-007" },
  { id: 2, indicator: "123.45.67.89", threat_actor: "FIN11", counter_intel_case_id: null },
  { id: 3, indicator: "john.doe@victim.com", threat_actor: "Insider-Threat-JD", counter_intel_case_id: "CI-007" }
];

const mockCICases = [
  { id: "CI-007", title: "Project Chimera", summary: "Suspected economic espionage targeting proprietary research.", status: "active" },
  { id: "CI-008", title: "Operation Nightshade", summary: "Monitoring foreign intelligence attempts to recruit internal personnel.", status: "monitoring" }
];

export default function CounterIntelligenceHubPage() {
  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3"><Milestone /> Counterintelligence Fusion Center</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-purple-500/30 bg-gray-800/50">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><ShieldQuestion /> Cyber Threat Indicators</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {mockCyberThreats.map(threat => (
                <div key={threat.id} className={`p-3 rounded-lg bg-gray-900/50 ${threat.counter_intel_case_id ? 'border border-purple-400' : 'border border-transparent'}`}>
                  <p className="font-mono text-white">{threat.indicator}</p>
                  <p className="text-sm text-gray-400">Actor: {threat.threat_actor}</p>
                  {threat.counter_intel_case_id && <Badge className="mt-2 bg-purple-600">Linked to: {threat.counter_intel_case_id}</Badge>}
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="border-blue-500/30 bg-gray-800/50">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><UserCheck /> Counterintelligence Cases</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {mockCICases.map(ciCase => (
                <div key={ciCase.id} className="p-3 rounded-lg bg-gray-900/50 border border-blue-400">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-white">{ciCase.title} ({ciCase.id})</p>
                    <Badge variant="secondary">{ciCase.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{ciCase.summary}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}