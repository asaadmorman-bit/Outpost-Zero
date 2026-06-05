import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Zap } from 'lucide-react';

const mockFindings = [
    { id: 1, finding: "Lack of multi-factor authentication on all external-facing services.", recommendation: "Implement FIDO2/WebAuthn for all user-facing applications and enforce MFA for all administrator access via SSH and RDP.", priority: "critical", category: "technology" },
    { id: 2, finding: "Incident response plan has not been tested in the last 12 months.", recommendation: "Schedule a tabletop exercise simulating a ransomware attack within the next quarter. Involve IT, security, legal, and executive teams.", priority: "high", category: "process" },
    { id: 3, finding: "No formal security awareness training for new hires.", recommendation: "Develop a mandatory onboarding security training module covering phishing, password hygiene, and data handling policies. Track completion rates.", priority: "medium", category: "people" }
];

export default function GapAnalysisPage() {
  const [findings, setFindings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const runAnalysis = () => {
    setIsLoading(true);
    // In a real app, this would call InvokeLLM with a complex prompt
    // and context about the organization's security posture.
    setTimeout(() => {
      setFindings(mockFindings);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3"><ClipboardCheck /> Security Gap Analysis</h1>
        <p className="text-gray-400 mb-6">Use AI to analyze your security posture and receive prioritized recommendations.</p>
        <div className="mb-8">
          <Button onClick={runAnalysis} disabled={isLoading} size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Zap className="mr-2 h-5 w-5" />
            {isLoading ? "Analyzing Posture..." : "Run AI-Powered Gap Analysis"}
          </Button>
        </div>
        
        <div className="space-y-4">
          {findings.map(item => (
            <Card key={item.id} className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-lg max-w-4xl">{item.finding}</CardTitle>
                  <Badge variant="destructive">{item.priority}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{item.recommendation}</p>
                <Badge variant="secondary" className="mt-4">{item.category}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}