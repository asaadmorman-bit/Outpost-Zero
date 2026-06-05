import React, { useState, useEffect } from 'react';
import { DeceptionHoneypot } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Shield, Brain, Network, AlertTriangle, Activity, Users } from 'lucide-react';

export default function DeceptionPlatformsPage() {
    const [honeypots, setHoneypots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadHoneypots();
    }, []);

    const loadHoneypots = async () => {
        setIsLoading(true);
        setHoneypots(mockHoneypots);
        setIsLoading(false);
    };

    const getTypeColor = (type) => {
        const colors = {
            web_server: 'bg-blue-500/20 text-blue-400',
            database: 'bg-purple-500/20 text-purple-400',
            file_share: 'bg-green-500/20 text-green-400',
            email_server: 'bg-yellow-500/20 text-yellow-400',
            domain_controller: 'bg-red-500/20 text-red-400',
            industrial_control: 'bg-orange-500/20 text-orange-400',
            iot_device: 'bg-cyan-500/20 text-cyan-400'
        };
        return colors[type] || 'bg-gray-500/20 text-gray-400';
    };

    const getEffectivenessColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Eye className="w-10 h-10 text-cyan-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">AI Deception Platforms</h1>
                        <p className="text-gray-300">Intelligent honeypots that learn and adapt to trap attackers</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <Shield className="w-8 h-8 text-blue-400" />
                                <div>
                                    <p className="text-2xl font-bold text-blue-400">{honeypots.filter(h => h.active).length}</p>
                                    <p className="text-gray-400 text-sm">Active Honeypots</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <Users className="w-8 h-8 text-red-400" />
                                <div>
                                    <p className="text-2xl font-bold text-red-400">
                                        {honeypots.reduce((sum, h) => sum + (h.attacker_interactions?.length || 0), 0)}
                                    </p>
                                    <p className="text-gray-400 text-sm">Attackers Trapped</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <Brain className="w-8 h-8 text-purple-400" />
                                <div>
                                    <p className="text-2xl font-bold text-purple-400">
                                        {honeypots.filter(h => h.adaptive_responses).length}
                                    </p>
                                    <p className="text-gray-400 text-sm">AI-Powered</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-8 h-8 text-yellow-400" />
                                <div>
                                    <p className="text-2xl font-bold text-yellow-400">
                                        {Math.round(honeypots.reduce((sum, h) => sum + (h.decoy_effectiveness || 0), 0) / honeypots.length)}%
                                    </p>
                                    <p className="text-gray-400 text-sm">Avg Effectiveness</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white">Active Honeypots</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {honeypots.map(honeypot => (
                                        <div key={honeypot.honeypot_id} className="bg-gray-900/50 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <Badge className={getTypeColor(honeypot.honeypot_type)}>
                                                        {honeypot.honeypot_type.replace('_', ' ')}
                                                    </Badge>
                                                    <p className="text-gray-400 text-sm mt-1">{honeypot.deployment_environment}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-lg font-bold ${getEffectivenessColor(honeypot.decoy_effectiveness)}`}>
                                                        {honeypot.decoy_effectiveness}%
                                                    </p>
                                                    <p className="text-gray-400 text-xs">Effectiveness</p>
                                                </div>
                                            </div>
                                            
                                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-400">Deception Techniques:</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {honeypot.deception_techniques?.slice(0, 2).map((tech, i) => (
                                                            <Badge key={i} variant="outline" className="text-xs">
                                                                {tech.replace('_', ' ')}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Interactions:</p>
                                                    <p className="text-white font-medium">
                                                        {honeypot.attacker_interactions?.length || 0} sessions
                                                    </p>
                                                </div>
                                            </div>

                                            {honeypot.threat_attribution?.suspected_group && (
                                                <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded">
                                                    <p className="text-red-400 text-sm font-medium">
                                                        Suspected Group: {honeypot.threat_attribution.suspected_group}
                                                    </p>
                                                    <p className="text-gray-400 text-xs">
                                                        Confidence: {honeypot.threat_attribution.confidence_score}%
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card className="border-gray-700 bg-gray-800/50 mb-6">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-purple-400" />
                                    AI Intelligence Gathered
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-white font-medium mb-2">Common Attack Tools</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['Nmap', 'Metasploit', 'Cobalt Strike', 'Mimikatz', 'BloodHound'].map(tool => (
                                                <Badge key={tool} variant="outline" className="text-red-300 border-red-400/50">
                                                    {tool}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-white font-medium mb-2">Attack Patterns</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Credential Stuffing</span>
                                                <span className="text-red-400">45%</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">SQL Injection</span>
                                                <span className="text-orange-400">32%</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Lateral Movement</span>
                                                <span className="text-yellow-400">23%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white">Deploy New Honeypot</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                    <Network className="w-4 h-4 mr-2" />
                                    Web Server Honeypot
                                </Button>
                                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                    <Shield className="w-4 h-4 mr-2" />
                                    Database Honeypot
                                </Button>
                                <Button className="w-full bg-green-600 hover:bg-green-700">
                                    <Activity className="w-4 h-4 mr-2" />
                                    IoT Device Honeypot
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mockHoneypots = [
    { honeypot_id: 'hp_001', honeypot_type: 'web_server', deployment_environment: 'cloud', active: true, decoy_effectiveness: 87, adaptive_responses: true, deception_techniques: ['fake_vulnerabilities', 'credential_baiting'], attacker_interactions: [{}, {}, {}], threat_attribution: { suspected_group: 'APT28', confidence_score: 78 } },
    { honeypot_id: 'hp_002', honeypot_type: 'database', deployment_environment: 'on_premise', active: true, decoy_effectiveness: 92, adaptive_responses: true, deception_techniques: ['data_lures', 'service_mimicry'], attacker_interactions: [{}, {}] },
    { honeypot_id: 'hp_003', honeypot_type: 'iot_device', deployment_environment: 'edge', active: true, decoy_effectiveness: 73, adaptive_responses: false, deception_techniques: ['network_breadcrumbs'], attacker_interactions: [{}] },
];