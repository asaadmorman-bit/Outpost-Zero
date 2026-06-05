import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Cpu, Database, Users, CheckCircle, Zap, Shield, FileText } from 'lucide-react';

const analysisSteps = [
    { title: "Encrypted Data Ingestion", description: "Data from multiple partners is ingested without decryption, preserving privacy.", icon: Database, status: "complete" },
    { title: "Secure Computation", description: "AI models perform analysis directly on the encrypted data using homomorphic operations.", icon: Cpu, status: "complete" },
    { title: "Threat Pattern Identification", description: "Cross-organizational threat patterns are identified from the combined encrypted dataset.", icon: Zap, status: "active" },
    { title: "Encrypted Results Generation", description: "Results are generated and remain encrypted, accessible only to authorized parties.", icon: FileText, status: "pending" },
    { title: "Zero-Knowledge Proof", description: "A cryptographic proof is generated to verify the computation's integrity without revealing data.", icon: Shield, status: "pending" },
];

export default function HomomorphicEncryptionPage() {
    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <Lock className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-white mb-2">Homomorphic Encryption Center</h1>
                    <p className="text-lg text-gray-300">Collaborative Threat Analysis on Encrypted Data</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-center mb-12">
                    <Card className="border-gray-700 bg-gray-800/50 text-center">
                        <CardHeader><CardTitle className="text-white">Partner A Data</CardTitle></CardHeader>
                        <CardContent>
                            <Database className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                            <p className="text-gray-400">1.2M Encrypted Logs</p>
                            <Badge className="mt-2 bg-green-500/20 text-green-300">Status: Encrypted</Badge>
                        </CardContent>
                    </Card>
                    
                    <div className="text-center">
                        <Users className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                        <h3 className="text-xl font-semibold text-white">Secure Collaboration</h3>
                        <p className="text-gray-400">Analyzing threats without sharing sensitive data.</p>
                    </div>

                    <Card className="border-gray-700 bg-gray-800/50 text-center">
                        <CardHeader><CardTitle className="text-white">Partner B Data</CardTitle></CardHeader>
                        <CardContent>
                            <Database className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                            <p className="text-gray-400">800K Encrypted Logs</p>
                            <Badge className="mt-2 bg-green-500/20 text-green-300">Status: Encrypted</Badge>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-gray-700 bg-gray-800/50">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-cyan-400" />
                            Live Analysis Pipeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {analysisSteps.map((step, index) => (
                                <div key={index} className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        step.status === 'complete' ? 'bg-green-500/20' : 
                                        step.status === 'active' ? 'bg-blue-500/20 animate-pulse' : 'bg-gray-700/50'
                                    }`}>
                                        <step.icon className={`w-6 h-6 ${
                                            step.status === 'complete' ? 'text-green-400' :
                                            step.status === 'active' ? 'text-blue-400' : 'text-gray-500'
                                        }`} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                                        <p className="text-gray-400">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                <Zap className="w-5 h-5 mr-2" />
                                Initiate New Analysis
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}