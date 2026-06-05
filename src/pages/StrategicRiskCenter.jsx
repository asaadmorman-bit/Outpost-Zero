import React, { useState, useEffect } from 'react';
import { BusinessRiskMetrics, AIThreatCorrelation, ThreatActorProfile } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowUpRight, ArrowDownRight, Target, Shield, Users, DollarSign, Activity, TrendingUp, VenetianMask, BookUser } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock Data for Demonstration
const mockRiskMetrics = [
    { timestamp: '2024-01-01', overall_business_risk_score: 75 },
    { timestamp: '2024-02-01', overall_business_risk_score: 72 },
    { timestamp: '2024-03-01', overall_business_risk_score: 68 },
    { timestamp: '2024-04-01', overall_business_risk_score: 70 },
    { timestamp: '2024-05-01', overall_business_risk_score: 65 },
];

const mockCorrelations = [
    { campaign_id: 'camp_001', campaign_name: 'Q2 Phishing vs Finance', threat_actor_id: 'apt_28', status: 'active', business_impact_score: 85, first_seen: '2024-04-15T10:00:00Z', attack_summary: 'Multi-stage attack using targeted phishing emails to gain initial access, followed by lateral movement to access financial systems.' },
    { campaign_id: 'camp_002', campaign_name: 'Cloud Misconfiguration Exploit', threat_actor_id: 'fin_6', status: 'contained', business_impact_score: 60, first_seen: '2024-05-01T14:30:00Z', attack_summary: 'Opportunistic attack exploiting a public-facing S3 bucket, leading to data exposure.' },
];

const mockThreatActors = [
    { actor_id: 'apt_28', name: 'APT28 (Fancy Bear)', origin: 'Russia', motivation: 'espionage', target_industries: ['Government', 'Defense'], common_tools: ['X-Agent', 'Zero-day exploits'] },
    { actor_id: 'fin_6', name: 'FIN6', origin: 'Unknown', motivation: 'financial_gain', target_industries: ['Retail', 'Hospitality'], common_tools: ['Cobalt Strike', 'Metasploit'] },
];


export default function StrategicRiskCenter() {
    const [riskMetrics, setRiskMetrics] = useState(mockRiskMetrics);
    const [correlations, setCorrelations] = useState(mockCorrelations);
    const [threatActors, setThreatActors] = useState(mockThreatActors);
    const [loading, setLoading] = useState(true);

    // In a real app, you would fetch data. For now, we use mocks.
    useEffect(() => {
        const loadData = async () => {
            // const riskData = await BusinessRiskMetrics.list();
            // const correlationData = await AIThreatCorrelation.list();
            // const actorData = await ThreatActorProfile.list();
            // setRiskMetrics(riskData.length ? riskData : mockRiskMetrics);
            // setCorrelations(correlationData.length ? correlationData : mockCorrelations);
            // setThreatActors(actorData.length ? actorData : mockThreatActors);
            setLoading(false);
        };
        loadData();
    }, []);

    const getActorById = (id) => threatActors.find(a => a.actor_id === id) || {};
    const latestRiskScore = riskMetrics.length > 0 ? riskMetrics[riskMetrics.length - 1].overall_business_risk_score : 0;
    const trend = riskMetrics.length > 1 ? riskMetrics[riskMetrics.length - 1].overall_business_risk_score - riskMetrics[riskMetrics.length - 2].overall_business_risk_score : 0;

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Target className="w-8 h-8 text-purple-400" /> Strategic Risk Center
                    </h1>
                    <p className="text-gray-300">Translating Cyber Events into Business Risk & Actionable Intelligence</p>
                </div>

                {/* Top Level Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Shield /> Overall Business Risk
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-white">{latestRiskScore}</div>
                            <div className={`flex items-center text-sm ${trend <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {trend <= 0 ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                {Math.abs(trend)} points {trend <= 0 ? 'improvement' : 'increase'} last month
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader><CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2"><DollarSign /> Est. Annual Loss</CardTitle></CardHeader>
                        <CardContent><div className="text-4xl font-bold text-white">$1.2M</div><p className="text-xs text-gray-400">Projected based on current posture</p></CardContent>
                    </Card>
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader><CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2"><Activity /> Security ROI</CardTitle></CardHeader>
                        <CardContent><div className="text-4xl font-bold text-white">175%</div><p className="text-xs text-gray-400">Return on security investment</p></CardContent>
                    </Card>
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader><CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2"><TrendingUp /> Peer Percentile</CardTitle></CardHeader>
                        <CardContent><div className="text-4xl font-bold text-white">85th</div><p className="text-xs text-gray-400">Top 15% in your industry</p></CardContent>
                    </Card>
                </div>
                
                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Main Content: Threat Campaigns */}
                    <div className="lg:col-span-3 space-y-4">
                        <h2 className="text-xl font-semibold text-white">Active Threat Campaigns</h2>
                        {correlations.map(campaign => {
                            const actor = getActorById(campaign.threat_actor_id);
                            return (
                                <Card key={campaign.campaign_id} className="border-gray-700 bg-gray-800/50 hover:border-purple-500/50 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Badge className={campaign.status === 'active' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}>{campaign.status}</Badge>
                                                    <p className="font-semibold text-white">{campaign.campaign_name}</p>
                                                </div>
                                                <p className="text-sm text-gray-400 mb-3">{campaign.attack_summary}</p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <div className="text-2xl font-bold text-purple-400">{campaign.business_impact_score}</div>
                                                <div className="text-xs text-gray-400">Impact Score</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="text-sm text-gray-400">
                                                Attributed to: <span className="font-medium text-gray-200">{actor.name || 'Unknown'}</span>
                                            </div>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm">
                                                        <BookUser className="w-4 h-4 mr-2" />
                                                        View Profile
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-gray-900 border-gray-700 text-white">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2 text-xl">
                                                            <VenetianMask /> {actor.name}
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-2 text-sm">
                                                        <p><strong>Origin:</strong> {actor.origin}</p>
                                                        <p><strong>Motivation:</strong> {actor.motivation}</p>
                                                        <p><strong>Targets:</strong> {actor.target_industries?.join(', ')}</p>
                                                        <p><strong>Tools:</strong> {actor.common_tools?.join(', ')}</p>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                    {/* Side Panel: Risk Trend */}
                    <div className="lg:col-span-2">
                         <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">Business Risk Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={riskMetrics} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="timestamp" tickFormatter={(val) => new Date(val).toLocaleString('default', { month: 'short' })} stroke="#9ca3af" fontSize={12} />
                                            <YAxis stroke="#9ca3af" fontSize={12} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#ffffff' }} />
                                            <Line type="monotone" dataKey="overall_business_risk_score" stroke="#8b5cf6" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}