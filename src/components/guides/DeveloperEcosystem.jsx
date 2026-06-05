import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, GitBranch, ShieldCheck, Zap, Users, DownloadCloud, UploadCloud } from 'lucide-react';

const StepCard = ({ icon, title, description }) => {
    const Icon = icon;
    return (
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-900/50 flex items-center justify-center">
                <Icon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
                <h4 className="font-semibold text-white">{title}</h4>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
        </div>
    );
};

export default function DeveloperEcosystem() {
    return (
        <div className="space-y-6">
            <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Code className="w-5 h-5 text-green-400" />
                        Third-Party Developer Ecosystem
                    </CardTitle>
                    <p className="text-gray-400 pt-2">Integrate your application with CyberShield SIEM to reach thousands of security teams and automate workflows.</p>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Integration Workflow</h3>
                        <div className="space-y-6">
                            <StepCard icon={Code} title="1. Get API Keys" description="Apply for developer API keys in our sandbox environment through the settings panel." />
                            <StepCard icon={GitBranch} title="2. Develop & Test" description="Build your application against our extensive APIs. Use our Postman collections and SDKs to accelerate development." />
                            <StepCard icon={ShieldCheck} title="3. Security Review" description="Submit your application for a mandatory security and performance review by the CyberShield team." />
                            <StepCard icon={Users} title="4. Publish" description="Once approved, publish your application to the Community Hub and make it available to all CyberShield customers." />
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Benefits of Integrating</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <Zap className="w-5 h-5 text-yellow-400 mt-1"/>
                                <div>
                                    <h4 className="font-semibold text-white">Automate Actions</h4>
                                    <p className="text-sm text-gray-400">Trigger actions in your application directly from SOAR playbooks.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <DownloadCloud className="w-5 h-5 text-blue-400 mt-1"/>
                                <div>
                                    <h4 className="font-semibold text-white">Ingest Data</h4>
                                    <p className="text-sm text-gray-400">Push relevant security data from your app into CyberShield for correlation.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <UploadCloud className="w-5 h-5 text-purple-400 mt-1"/>
                                <div>
                                    <h4 className="font-semibold text-white">Enrich Incidents</h4>
                                    <p className="text-sm text-gray-400">Provide contextual data from your application to enrich incidents and alerts.</p>
                                </div>
                            </li>
                             <li className="flex gap-3">
                                <Users className="w-5 h-5 text-green-400 mt-1"/>
                                <div>
                                    <h4 className="font-semibold text-white">Reach New Customers</h4>
                                    <p className="text-sm text-gray-400">Showcase your solution to a targeted audience of security professionals.</p>
                                </div>
                            </li>
                        </ul>
                         <Button className="w-full mt-6">Request Developer Access</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}