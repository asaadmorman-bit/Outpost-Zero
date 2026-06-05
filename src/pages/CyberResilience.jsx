import React, { useState, useEffect } from 'react';
import { CyberResilienceMetric } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Heart, Activity, Shield, Zap, Brain, RefreshCw } from 'lucide-react';

const mockResilienceData = [
    {
        metric_id: 'rm_001',
        system_component: 'Web Application',
        resilience_score: 85,
        adaptability_score: 92,
        recovery_time: 15,
        graceful_degradation: true,
        predictive_hardening: true,
        business_continuity_score: 88
    },
    {
        metric_id: 'rm_002',
        system_component: 'Database Cluster',
        resilience_score: 95,
        adaptability_score: 78,
        recovery_time: 8,
        graceful_degradation: true,
        predictive_hardening: false,
        business_continuity_score: 94
    },
    {
        metric_id: 'rm_003',
        system_component: 'API Gateway',
        resilience_score: 72,
        adaptability_score: 85,
        recovery_time: 25,
        graceful_degradation: false,
        predictive_hardening: true,
        business_continuity_score: 76
    }
];

const radarData = [
    { subject: 'Adaptability', A: 85, fullMark: 100 },
    { subject: 'Recovery Speed', A: 90, fullMark: 100 },
    { subject: 'Self-Healing', A: 78, fullMark: 100 },
    { subject: 'Threat Learning', A: 92, fullMark: 100 },
    { subject: 'Redundancy', A: 88, fullMark: 100 },
    { subject: 'Degradation', A: 82, fullMark: 100 }
];

export default function CyberResiliencePage() {
    const [resilienceData, setResilienceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await CyberResilienceMetric.list();
            setResilienceData(data.length > 0 ? data : mockResilienceData);
        } catch (e) {
            console.error(e);
            setResilienceData(mockResilienceData);
        }
        setIsLoading(false);
    };

    const avgResilience = resilienceData.length > 0 ? 
        Math.round(resilienceData.reduce((sum, r) => sum + r.resilience_score, 0) / resilienceData.length) : 0;

    const avgRecovery = resilienceData.length > 0 ?
        Math.round(resilienceData.reduce((sum, r) => sum + r.recovery_time, 0) / resilienceData.length) : 0;

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Heart className="w-10 h-10 text-green-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">Cyber Resilience Center</h1>
                        <p className="text-gray-300">Adaptive defense and self-healing security systems.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Heart className="text-green-400" /> Overall Resilience
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-green-400 mb-2">{avgResilience}%</div>
                            <Progress value={avgResilience} className="h-2" />
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <RefreshCw className="text-blue-400" /> Recovery Time
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-blue-400">{avgRecovery}m</div>
                            <p className="text-sm text-gray-400">Average recovery time</p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Brain className="text-purple-400" /> Self-Healing Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-purple-400">47</div>
                            <p className="text-sm text-gray-400">This week</p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Zap className="text-yellow-400" /> Adaptations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-yellow-400">23</div>
                            <p className="text-sm text-gray-400">New threat adaptations</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white">Resilience Radar</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="#374151" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <PolarRadiusAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                    <Radar name="Score" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white">System Components</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {isLoading ? (
                                    <p className="text-gray-400">Loading resilience data...</p>
                                ) : (
                                    resilienceData.map(component => (
                                        <div key={component.metric_id} className="p-4 rounded-lg bg-gray-900/30 border border-gray-700/50">
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="font-semibold text-white">{component.system_component}</h4>
                                                <div className="flex gap-2">
                                                    {component.graceful_degradation && (
                                                        <Badge className="bg-blue-500/20 text-blue-300">Graceful</Badge>
                                                    )}
                                                    {component.predictive_hardening && (
                                                        <Badge className="bg-green-500/20 text-green-300">Predictive</Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-400">Resilience:</span>
                                                    <span className="ml-2 font-bold text-green-400">{component.resilience_score}%</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Recovery:</span>
                                                    <span className="ml-2 font-bold text-blue-400">{component.recovery_time}m</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Adaptability:</span>
                                                    <span className="ml-2 font-bold text-purple-400">{component.adaptability_score}%</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Business Impact:</span>
                                                    <span className="ml-2 font-bold text-yellow-400">{component.business_continuity_score}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}