
import React, { useState, useEffect } from 'react';
import { CyberCreditScore } from '@/entities/CyberCreditScore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Target, Shield, AlertTriangle, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

export default function CyberCreditScorePage() {
    const [scoreData, setScoreData] = useState(mockScore);
    
    const getScoreColor = (score) => {
        if (score >= 800) return 'text-green-400';
        if (score >= 740) return 'text-green-500';
        if (score >= 670) return 'text-yellow-400';
        if (score >= 580) return 'text-orange-400';
        return 'text-red-400';
    };
    
    const scoreRating = (score) => {
        if (score >= 800) return 'Excellent';
        if (score >= 740) return 'Very Good';
        if (score >= 670) return 'Good';
        if (score >= 580) return 'Fair';
        return 'Poor';
    };

    const radialData = [
        { name: 'Incident History', value: scoreData.score_factors.incident_history, fill: '#ef4444' },
        { name: 'Security Posture', value: scoreData.score_factors.current_security_posture, fill: '#3b82f6' },
        { name: 'Vuln. Management', value: scoreData.score_factors.vulnerability_management, fill: '#f97316' },
        { name: 'Compliance', value: scoreData.score_factors.compliance_adherence, fill: '#a855f7' },
        { name: 'Investment', value: scoreData.score_factors.security_investment, fill: '#14b8a6' },
    ];

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                 <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Target className="w-8 h-8 text-green-400" />
                    Cyber Credit Score
                </h1>
                <p className="text-lg text-gray-300 mb-8">
                    Your organization's security posture, quantified. A single score for partnerships, insurance, and trust.
                </p>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardContent className="pt-6 text-center">
                                <p className="text-sm text-gray-400 mb-2">Overall Score</p>
                                <h2 className={`text-7xl font-bold ${getScoreColor(scoreData.overall_score)}`}>
                                    {scoreData.overall_score}
                                </h2>
                                <p className={`text-xl font-medium ${getScoreColor(scoreData.overall_score)}`}>
                                    {scoreRating(scoreData.overall_score)}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">Score updated: {new Date(scoreData.score_history[scoreData.score_history.length - 1].date).toLocaleDateString()}</p>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader><CardTitle className="text-white">Score Factors</CardTitle></CardHeader>
                            <CardContent>
                                <div className="h-48 mb-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadialBarChart 
                                            cx="50%" 
                                            cy="50%" 
                                            innerRadius="20%" 
                                            outerRadius="80%" 
                                            barSize={8} 
                                            data={radialData}
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            <RadialBar
                                                minAngle={15}
                                                background
                                                clockWise
                                                dataKey="value"
                                            />
                                             <Tooltip 
                                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }}
                                                formatter={(value) => [`${value}%`, 'Score']}
                                            />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                </div>
                                
                                {/* Custom Legend Below Chart */}
                                <div className="space-y-2">
                                    {radialData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-3 h-3 rounded-full" 
                                                    style={{ backgroundColor: item.fill }}
                                                ></div>
                                                <span className="text-gray-300 text-sm">{item.name}</span>
                                            </div>
                                            <span className="text-white font-medium text-sm">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-6">
                         <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader><CardTitle className="text-white">Score History</CardTitle></CardHeader>
                            <CardContent>
                                <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={scoreData.score_history}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', {month: 'short', year: '2-digit'})}/>
                                        <YAxis domain={[700, 850]} stroke="#9ca3af" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }} />
                                        <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                         <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader><CardTitle className="text-white flex items-center gap-2"><Lightbulb />Improve Your Score</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                {scoreData.improvement_recommendations.map((rec, i) => (
                                    <div key={i} className="p-3 bg-gray-900/50 rounded-lg flex items-center justify-between">
                                        <p className="text-gray-300 text-sm">{rec}</p>
                                        <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                                            Learn More <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mockScore = {
    score_id: 'score_123',
    organization_id: 'org_abc',
    overall_score: 785,
    score_factors: { incident_history: 80, current_security_posture: 85, vulnerability_management: 70, compliance_adherence: 90, security_investment: 75 },
    industry_percentile: 88,
    score_history: [
        { date: '2024-01-01', score: 720 },
        { date: '2024-04-01', score: 755 },
        { date: '2024-07-01', score: 785 },
    ],
    improvement_recommendations: [
        "Automate patching for 15 high-risk vulnerabilities.",
        "Conduct phishing simulation for the finance department.",
        "Implement MFA for all external-facing services."
    ]
};
