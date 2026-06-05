
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowRight, Upload, PlayCircle, Milestone } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from '@/components/ui/textarea';

const comparisonData = [
  { feature: 'AI-Powered Threat Hunting', platform: true, splunk: 'Add-on', qradar: 'Add-on' },
  { feature: 'Integrated SOAR', platform: true, splunk: 'Separate Product', qradar: 'Separate Product' },
  { feature: 'Post-Quantum Risk Analysis', platform: true, splunk: false, qradar: false },
  { feature: 'AI Training Video Generator', platform: true, splunk: false, qradar: false },
  { feature: 'Transparent Pricing', platform: 'Yes (Per User/GB)', splunk: 'Complex (Volume-based)', qradar: 'Complex (EPS & Flow)' },
  { feature: 'Agentless Deployment', platform: true, splunk: true, qradar: true },
  { feature: 'Multi-Cloud Support', platform: true, splunk: true, qradar: 'Limited' },
];

const productionPath = [
    { title: "Start 7-Day Trial", description: "Access a full-featured enterprise environment for free." },
    { title: "Connect First Data Source", description: "Use our agent or agentless collectors to start ingesting logs in minutes." },
    { title: "Run First SOAR Playbook", description: "Automate a response to a simulated threat with our intuitive playbook builder." },
    { title: "Invite Your Team", description: "Collaborate with your colleagues and set up role-based access control." },
    { title: "Launch Proof of Concept (POC)", description: "Work with our engineers to validate our platform against your specific success criteria." },
    { title: "Full Production Rollout", description: "Seamlessly transition from POC to a fully operational, production-grade deployment." },
];

const tierExamples = [
  {
    tier: "AXIS Rebirth",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/9e4a685e9_Screenshot2025-07-24111810.jpg",
    price: "$99/month",
    description: "Professional-grade security for home users, remote workers, and small home offices with up to 5 devices.",
    pastDemands: ["Basic antivirus", "Router firewall", "Manual security updates"],
    presentDemands: ["Remote work security", "Smart home protection", "IoT device monitoring", "AI threat detection"],
    futureDemands: ["Predictive threat modeling", "Automated incident response", "Zero-trust home networks"],
    whyChoose: "You need enterprise-grade security without complexity. Perfect for protecting your family's digital life and remote work setup with AI-powered threat detection."
  },
  {
    tier: "RevSentinel (SMB)",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/3abd0f5ee_Screenshot2025-07-24112158.jpg",
    price: "$500/month",
    description: "Comprehensive security for small to medium businesses with up to 150 endpoints and advanced AI capabilities.",
    pastDemands: ["Basic SIEM logs", "Manual incident response", "Quarterly compliance reports"],
    presentDemands: ["Remote workforce security", "Cloud service monitoring", "Automated threat detection", "Compliance automation"],
    futureDemands: ["Predictive threat modeling", "Supply chain risk analysis", "AI-driven compliance automation"],
    whyChoose: "You're growing fast and need security that scales with you. Advanced AI capabilities help you stay ahead of threats while meeting compliance requirements."
  },
  {
    tier: "RevSentinel (Enterprise)",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/3abd0f5ee_Screenshot2025-07-24112158.jpg",
    price: "Starting at $2,500/month",
    description: "Enterprise-scale security with 250+ endpoints, unlimited users, and advanced AI cluster processing.",
    pastDemands: ["Multi-vendor SIEM correlation", "Complex compliance frameworks", "24/7 SOC operations"],
    presentDemands: ["Zero-trust architecture", "Cloud-native security", "Advanced persistent threat hunting", "AI-powered analytics"],
    futureDemands: ["Quantum-safe cryptography", "AI-augmented analysts", "Autonomous security operations"],
    whyChoose: "You operate at scale with critical infrastructure. You need cutting-edge AI-powered security that can adapt to unknown future threats and provide enterprise-grade performance."
  },
  {
    tier: "Outpost Zero (Gov)",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/174051417_Screenshot2025-07-24110248.jpg",
    price: "Contact Sales",
    description: "FedRAMP High authorized solution for federal agencies with the highest security requirements and classified data support.",
    pastDemands: ["FISMA compliance", "Manual audit processes", "Isolated security systems"],
    presentDemands: ["Continuous monitoring", "Real-time threat sharing", "Zero-trust government networks", "CDM integration"],
    futureDemands: ["National cyber defense integration", "Quantum threat protection", "AI-powered intelligence analysis"],
    whyChoose: "You protect national security and need the highest levels of assurance with FedRAMP High authorization. AI capabilities enhance threat detection while maintaining strict compliance."
  }
];

export default function SIEMComparisonPage() {
    const [logSample, setLogSample] = useState('1646102400, 10.1.2.3, "POST /login HTTP/1.1", 401, "admin"');
    const [analysisResult, setAnalysisResult] = useState('');

    const handleAnalyzeLog = () => {
        setAnalysisResult(`ANALYSIS COMPLETE:\n- Log Format: CSV (Comma-Separated Values)\n- Detected Fields: timestamp, source_ip, request, status_code, user\n- Recommended Parser: "Standard Web Log CSV"\n- Confidence: 98%\n\nIn production, you could now map these fields and begin live ingestion.`);
    };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto text-white">
                <h1 className="text-4xl font-bold mb-2 text-center">Tiered Platform Comparison</h1>
                <p className="text-lg text-gray-300 mb-12 text-center">See how our platform stacks up against legacy SIEMs and makes migration effortless.</p>

                <Card className="border-gray-700 bg-gray-800/50 mb-12">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PlayCircle className="text-blue-400"/> The Platform Advantage</CardTitle>
                    </CardHeader>
                    <CardContent className="aspect-video">
                         <iframe 
                            className="w-full h-full rounded-lg" 
                            src="https://www.youtube.com/embed/9bZkp7q19f0" 
                            title="Platform Competitive Advantage" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
                         </iframe>
                    </CardContent>
                </Card>

                <Card className="border-gray-700 bg-gray-800/50 mb-12">
                    <CardHeader>
                        <CardTitle>Feature-by-Feature Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-gray-700 hover:bg-transparent">
                                    <TableHead className="text-white">Feature</TableHead>
                                    <TableHead className="text-white">Our Platform</TableHead>
                                    <TableHead className="text-white">Splunk</TableHead>
                                    <TableHead className="text-white">QRadar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {comparisonData.map(item => (
                                    <TableRow key={item.feature} className="border-b-gray-800">
                                        <TableCell className="font-medium text-white">{item.feature}</TableCell>
                                        <TableCell>{item.platform === true ? <CheckCircle className="text-green-400"/> : <span className="text-green-300">{item.platform}</span>}</TableCell>
                                        <TableCell className="text-gray-300">{item.splunk === true ? <CheckCircle className="text-green-400"/> : (item.splunk === false ? <XCircle className="text-red-400"/> : item.splunk)}</TableCell>
                                        <TableCell className="text-gray-300">{item.qradar === true ? <CheckCircle className="text-green-400"/> : (item.qradar === false ? <XCircle className="text-red-400"/> : item.qradar)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Tier Selection Guide */}
                <Card className="border-gray-700 bg-gray-800/50 mb-12">
                    <CardHeader>
                        <CardTitle>Choose Your Perfect Tier: Past, Present & Future Demands</CardTitle>
                        <p className="text-gray-300">Understanding which tier fits your evolving security needs</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-8">
                            {tierExamples.map((tier, index) => (
                                <Card key={index} className="border-gray-600 bg-gray-900/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3 text-white">
                                            <img src={tier.logo} alt={`${tier.tier} Logo`} className="w-8 h-8 object-contain" />
                                            {tier.tier} - {tier.price}
                                        </CardTitle>
                                        <p className="text-gray-300 text-sm">{tier.description}</p>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-200 mb-2">📅 Past Demands</h4>
                                            <ul className="text-sm text-gray-400 space-y-1">
                                                {tier.pastDemands.map((demand, i) => (
                                                    <li key={i}>• {demand}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-blue-300 mb-2">⚡ Present Demands</h4>
                                            <ul className="text-sm text-blue-200 space-y-1">
                                                {tier.presentDemands.map((demand, i) => (
                                                    <li key={i}>• {demand}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-purple-300 mb-2">🚀 Future Demands</h4>
                                            <ul className="text-sm text-purple-200 space-y-1">
                                                {tier.futureDemands.map((demand, i) => (
                                                    <li key={i}>• {demand}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="pt-3 border-t border-gray-700">
                                            <p className="text-green-300 text-sm font-medium">
                                                💡 Why Choose This Tier: {tier.whyChoose}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-700 bg-gray-800/50 mb-12">
                    <CardHeader>
                        <CardTitle>Effortless Migration: Use Your Existing Logs</CardTitle>
                        <CardContent className="pt-4">
                            <p className="text-gray-300 mb-4">Our AI-powered parser automatically detects your log format. Paste a sample below to see it in action.</p>
                            <Textarea 
                                value={logSample}
                                onChange={(e) => setLogSample(e.target.value)}
                                placeholder="Paste a sample log line here..."
                                className="h-24 bg-gray-900 border-gray-600 text-white font-mono"
                            />
                            <Button onClick={handleAnalyzeLog} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                                <Upload className="mr-2 h-4 w-4"/>Analyze Log Format
                            </Button>
                            {analysisResult && (
                                <pre className="mt-4 p-4 bg-gray-900/50 rounded-lg text-sm text-green-300 whitespace-pre-wrap">{analysisResult}</pre>
                            )}
                        </CardContent>
                    </CardHeader>
                </Card>
                
                <div>
                    <h2 className="text-3xl font-bold text-center mb-8">Your Path to Production</h2>
                    <div className="relative flex flex-col md:flex-row justify-between items-center">
                         {/* Dashed line for desktop */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 border-t-2 border-dashed border-gray-600" style={{ transform: 'translateY(-50%)', zIndex: 0 }}></div>

                        {productionPath.map((step, index) => (
                            <div key={step.title} className="relative z-10 flex flex-col items-center text-center p-4 w-full md:w-1/6 mb-8 md:mb-0">
                                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mb-3 border-4 border-gray-800">
                                    <span className="text-white font-bold text-xl">{index + 1}</span>
                                </div>
                                <h3 className="font-semibold mb-1">{step.title}</h3>
                                <p className="text-xs text-gray-400">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
