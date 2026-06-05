import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    FileText, Brain, Swords, Shield, Server, KeyRound, ExternalLink, ArrowRight,
    Copy, Code, Info
} from 'lucide-react';

const ApiEndpointCard = ({ method, path, title, description, requestBody, responseBody }) => (
    <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
            <CardTitle className="flex items-center gap-4">
                <Badge className={
                    method === 'POST' ? 'bg-blue-600' : 'bg-green-600'
                }>{method}</Badge>
                <span className="font-mono text-lg text-white">{path}</span>
            </CardTitle>
            <p className="text-gray-300 pt-2">{description}</p>
        </CardHeader>
        <CardContent>
            <div>
                <h3 className="font-semibold text-white mb-2">Sample Request Body:</h3>
                <pre className="bg-gray-900 p-4 rounded-lg text-sm text-cyan-300 overflow-x-auto">
                    <code>{JSON.stringify(requestBody, null, 2)}</code>
                </pre>
            </div>
            <div className="mt-4">
                <h3 className="font-semibold text-white mb-2">Sample Success Response (200 OK):</h3>
                <pre className="bg-gray-900 p-4 rounded-lg text-sm text-green-300 overflow-x-auto">
                    <code>{JSON.stringify(responseBody, null, 2)}</code>
                </pre>
            </div>
        </CardContent>
    </Card>
);

export default function APIDocumentationPage() {
    const externalEndpoints = [
        {
            icon: Brain,
            category: 'External Developer API',
            description: 'These are public-facing endpoints for your licensees. Access is granted via API keys managed in the Licensing Platform.',
            endpoints: [
                {
                    method: 'POST',
                    path: '/v1/predict/threat',
                    title: 'Predict Future Threat',
                    description: 'Leverages the ASES engine to predict the likelihood of specific cyber threats based on provided indicators.',
                    requestBody: { indicators: ["c2.server.com", "suspicious_file.exe"], time_horizon: "30_days" },
                    responseBody: { prediction_id: "pred_123", threat_type: "ransomware", confidence: 87.5, details: "..." }
                },
                {
                    method: 'POST',
                    path: '/v1/simulate/attack',
                    title: 'Generate & Run Attack Simulation',
                    description: 'Uses the MLAS engine to generate and run a realistic attack simulation against a defined target environment.',
                    requestBody: { scenario: "apt_campaign", target: "cloud_environment_1", stealth_level: "stealthy" },
                    responseBody: { simulation_id: "sim_456", status: "running", estimated_duration_hours: 24 }
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <FileText className="w-10 h-10 text-green-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">API Documentation & Endpoints</h1>
                        <p className="text-lg text-gray-300">Integrate Outpost Zero and access its powerful backend functions.</p>
                    </div>
                </div>

                <div className="space-y-12">
                    {/* Internal Backend Functions */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Server className="w-6 h-6 text-purple-400" />
                            Internal Backend Functions
                        </h2>
                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardContent className="p-6">
                                <p className="text-gray-300 mb-4">
                                    These are functions used by your application's frontend. While you call them like normal code from your pages, they each have a unique, secure API endpoint URL. This is useful for testing, webhooks, or external integrations.
                                </p>
                                <h4 className="font-semibold text-white mb-3">How to find an endpoint URL:</h4>
                                <div className="space-y-2 text-gray-300 text-sm p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                                    <p>1. Navigate to your base44 workspace dashboard.</p>
                                    <p>2. Go to <code className="bg-gray-700 px-2 py-1 rounded-md">Code</code> <ArrowRight className="inline w-4 h-4"/> <code className="bg-gray-700 px-2 py-1 rounded-md">Functions</code>.</p>
                                    <p>3. Select the function you need (e.g., `exportTasks`).</p>
                                    <p>4. The endpoint URL will be displayed at the top of the function editor.</p>
                                </div>
                                <div className="mt-4 p-4 border border-blue-500/30 bg-blue-900/20 rounded-lg">
                                    <Info className="w-5 h-5 text-blue-400 float-left mr-3" />
                                    <h4 className="font-semibold text-blue-300">Authentication</h4>
                                    <p className="text-sm text-blue-200">
                                        When calling these functions from outside the app (e.g., with Postman or a script), you must include your Base44 authentication token in the `Authorization` header as a Bearer token.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* External Developer API */}
                    {externalEndpoints.map((category, index) => (
                        <div key={index}>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <KeyRound className="w-6 h-6 text-cyan-400" />
                                {category.category}
                            </h2>
                            <p className="text-gray-300 mb-4 max-w-3xl">{category.description}</p>
                            <Card className="border-gray-700 bg-gray-800/50 mb-6">
                                <CardHeader>
                                  <CardTitle className="text-white">Get Your API Key</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-300 mb-4">
                                        API keys are required to access these endpoints. You can generate and manage keys for your licensees on the Developer Platform.
                                    </p>
                                    <Link to={createPageUrl('LicensingPlatform')}>
                                        <Button className="bg-cyan-600 hover:bg-cyan-700">
                                            Go to Licensing Platform
                                            <ExternalLink className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                            <div className="space-y-6">
                                {category.endpoints.map((endpoint, idx) => (
                                    <ApiEndpointCard key={idx} {...endpoint} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}