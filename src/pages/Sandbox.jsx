import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Box, Play, Loader2, FileText, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { InvokeLLM } from '@/integrations/Core';

const ImpactAnalysisReport = ({ report, proposedChange }) => {
    if(!report) return null;

    return (
        <Card className="border-purple-500/50 bg-gray-800/50 mt-8">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="text-purple-400" /> Security Impact Analysis Report
                </CardTitle>
                <p className="text-sm text-gray-400">Analysis for proposed change: "{proposedChange}"</p>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="executive" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="executive">Executive Summary</TabsTrigger>
                        <TabsTrigger value="managerial">Managerial View</TabsTrigger>
                        <TabsTrigger value="technical">Technical Details</TabsTrigger>
                    </TabsList>
                    <TabsContent value="executive" className="prose prose-invert max-w-none p-4 bg-gray-900/40 rounded-b-lg">
                        <h3 className="text-purple-300 flex items-center gap-2"><Users /> For Leadership</h3>
                        <p>{report.executive_summary}</p>
                    </TabsContent>
                    <TabsContent value="managerial" className="prose prose-invert max-w-none p-4 bg-gray-900/40 rounded-b-lg">
                        <h3 className="text-cyan-300 flex items-center gap-2"><CheckCircle /> For Managers</h3>
                        <h4>Potential Risks:</h4>
                        <ul>{report.managerial_view.risks.map(r => <li key={r}>{r}</li>)}</ul>
                        <h4>Affected Teams:</h4>
                        <ul>{report.managerial_view.affected_teams.map(t => <li key={t}>{t}</li>)}</ul>
                    </TabsContent>
                    <TabsContent value="technical" className="prose prose-invert max-w-none p-4 bg-gray-900/40 rounded-b-lg">
                        <h3 className="text-orange-300 flex items-center gap-2"><AlertTriangle /> For Cyber Teams</h3>
                        <h4>Affected Systems:</h4>
                        <pre><code>{report.technical_details.affected_systems.join('\n')}</code></pre>
                        <h4>Mitigation Steps:</h4>
                        <pre><code>{report.technical_details.mitigation_steps.join('\n')}</code></pre>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

// Need to import Tabs components for the above to work
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SandboxPage() {
    const [proposedChange, setProposedChange] = useState("Block all outbound traffic from developer workstations to social media domains.");
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState(null);
    
    const handleRunAnalysis = async () => {
        setIsLoading(true);
        setReport(null);

        const result = await InvokeLLM({
            prompt: `Generate a comprehensive Security Impact Analysis for the following proposed change: "${proposedChange}". The analysis should be structured for three different audiences: executive leadership, managers, and technical cyber teams.`,
            response_json_schema: {
                type: "object",
                properties: {
                    executive_summary: { type: "string", description: "A high-level, non-technical summary of the change, its business justification, and overall risk posture impact." },
                    managerial_view: { 
                        type: "object",
                        properties: {
                            risks: { type: "array", items: { type: "string" }, description: "List of potential operational or workflow risks." },
                            affected_teams: { type: "array", items: { type: "string" }, description: "List of teams whose daily work might be impacted." }
                        }
                    },
                    technical_details: {
                        type: "object",
                        properties: {
                            affected_systems: { type: "array", items: { type: "string" }, description: "Specific systems, subnets, or services affected." },
                            mitigation_steps: { type: "array", items: { type: "string" }, description: "Technical steps to mitigate any negative impact." }
                        }
                    }
                }
            }
        });

        setReport(result);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Box className="w-8 h-8 text-purple-400" /> Sandbox & Impact Analysis
                </h1>
                <p className="text-lg text-gray-300 mb-8">
                    Safely test changes and simulate their impact on your security posture before deployment.
                </p>

                <Card className="border-gray-700 bg-gray-800/50">
                    <CardHeader>
                        <CardTitle className="text-white">Propose a Change</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            value={proposedChange}
                            onChange={(e) => setProposedChange(e.target.value)}
                            placeholder="e.g., 'Upgrade all database servers to TLS 1.3', 'Isolate a potentially compromised endpoint (10.1.2.3)'"
                            className="h-24 bg-gray-900 border-gray-600 text-white"
                        />
                        <Button onClick={handleRunAnalysis} disabled={isLoading} className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Analyzing Impact...</>
                            ) : (
                                <><Play className="mr-2 h-4 w-4" />Run Security Impact Analysis</>
                            )}
                        </Button>
                    </CardContent>
                </Card>
                
                {isLoading && (
                    <div className="text-center p-8 text-white">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin mb-4" />
                        <p>Simulating change across environment and generating multi-level reports...</p>
                    </div>
                )}
                
                <ImpactAnalysisReport report={report} proposedChange={proposedChange} />
            </div>
        </div>
    );
}