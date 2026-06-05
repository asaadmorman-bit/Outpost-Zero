import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Zap, Shield, Search, SlidersHorizontal, Plus, Play } from 'lucide-react';
import ThreatHuntingEngine from '../components/automation/ThreatHuntingEngine';

const ProactiveRemediationCard = ({ finding }) => {
    const severityColors = {
        critical: 'border-red-500/50 bg-red-900/20 text-red-200',
        high: 'border-orange-500/50 bg-orange-900/20 text-orange-200',
        medium: 'border-yellow-500/50 bg-yellow-900/20 text-yellow-200',
    };

    return (
        <Card className={`mb-4 ${severityColors[finding.severity]}`}>
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold text-white">{finding.title}</p>
                        <p className="text-sm text-gray-300">Target: {finding.target} ({finding.type})</p>
                    </div>
                    <Badge variant="outline" className="border-current">{finding.severity}</Badge>
                </div>
                <div className="mt-3 flex justify-between items-center">
                    <p className="text-xs text-gray-400">Playbook: <span className="font-mono text-cyan-400">{finding.playbook}</span></p>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8">
                        <Play className="w-4 h-4 mr-2" />
                        Execute
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};


export default function AutomatedSecurity() {
    const [remediations, setRemediations] = useState([]);

    useEffect(() => {
        // Mock data for proactive remediations
        const mockRemediations = [
            { id: 1, title: "Unpatched Log4j Vulnerability Detected", type: "Vulnerability", target: "WebServer-03", severity: "critical", playbook: "patch-log4j-auto-v2" },
            { id: 2, title: "Public S3 Bucket with Write Access", type: "Misconfiguration", target: "aws:s3:data-uploads", severity: "high", playbook: "s3-bucket-lockdown-v1" },
            { id: 3, title: "Dormant Admin Account Found", type: "Identity Risk", target: "AD: j.smith (90+ days inactive)", severity: "medium", playbook: "disable-dormant-admin-v3" },
        ];
        setRemediations(mockRemediations);
    }, []);

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                        <Bot className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Automated Security Engine</h1>
                        <p className="text-gray-300">Proactive threat hunting, remediation, and posture management.</p>
                    </div>
                </div>

                <Tabs defaultValue="hunting" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="hunting"><Search className="w-4 h-4 mr-2" />Threat Hunting</TabsTrigger>
                        <TabsTrigger value="remediation"><Zap className="w-4 h-4 mr-2" />Proactive Remediation</TabsTrigger>
                        <TabsTrigger value="tuning"><SlidersHorizontal className="w-4 h-4 mr-2" />Policy Tuning</TabsTrigger>
                    </TabsList>

                    <TabsContent value="hunting" className="mt-6">
                        <ThreatHuntingEngine />
                    </TabsContent>

                    <TabsContent value="remediation" className="mt-6">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Pending Proactive Remediations</CardTitle>
                                <p className="text-gray-400 text-sm">Automated playbooks ready to resolve identified risks.</p>
                            </CardHeader>
                            <CardContent>
                                {remediations.map(finding => (
                                    <ProactiveRemediationCard key={finding.id} finding={finding} />
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="tuning" className="mt-6">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">AI-Powered Policy Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400">Coming soon: AI analysis of detection patterns to recommend new rules, reduce false positives, and improve security posture.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}