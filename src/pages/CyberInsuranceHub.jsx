
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CyberInsuranceRating } from '@/entities/all';
import { 
    Shield, 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    Target, 
    CheckCircle,
    AlertTriangle,
    Users,
    BarChart3,
    Lightbulb // Added Lightbulb icon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function CyberInsuranceHubPage() {
    const [rating, setRating] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadInsuranceRating();
    }, []);

    const loadInsuranceRating = async () => {
        setIsLoading(true);
        const data = await CyberInsuranceRating.list();
        setRating(data.length > 0 ? data[0] : mockRating);
        setIsLoading(false);
    };

    const mockRating = {
        rating_id: "rating_001",
        organization_id: "org_123",
        overall_score: 78,
        risk_categories: {
            technical_controls: 82,
            incident_response: 75,
            employee_training: 71,
            vendor_management: 68,
            data_protection: 85
        },
        premium_multiplier: 0.85,
        recommended_coverage: 5000000,
        assessment_date: new Date().toISOString(),
        improvement_recommendations: [
            "Implement advanced threat detection systems",
            "Enhance employee security awareness training",
            "Strengthen vendor risk management processes",
            "Develop comprehensive backup and recovery procedures"
        ],
        industry_benchmark: 72,
        trend_analysis: {
            "30_day_change": 3,
            "90_day_change": 7,
            "yearly_change": 12
        },
        insurance_partner: "CyberGuard Insurance",
        policy_discounts: [
            { type: "Multi-factor Authentication", discount: "5%" },
            { type: "Security Training Program", discount: "8%" },
            { type: "Incident Response Plan", discount: "10%" }
        ]
    };

    const radarData = rating ? [
        { subject: 'Technical Controls', A: rating.risk_categories.technical_controls, fullMark: 100 },
        { subject: 'Incident Response', A: rating.risk_categories.incident_response, fullMark: 100 },
        { subject: 'Employee Training', A: rating.risk_categories.employee_training, fullMark: 100 },
        { subject: 'Vendor Management', A: rating.risk_categories.vendor_management, fullMark: 100 },
        { subject: 'Data Protection', A: rating.risk_categories.data_protection, fullMark: 100 }
    ] : [];

    const trendData = rating ? [
        { name: '12 months ago', score: rating.overall_score - rating.trend_analysis.yearly_change },
        { name: '3 months ago', score: rating.overall_score - rating.trend_analysis["90_day_change"] },
        { name: '1 month ago', score: rating.overall_score - rating.trend_analysis["30_day_change"] },
        { name: 'Current', score: rating.overall_score }
    ] : [];

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 70) return 'text-yellow-400';
        if (score >= 60) return 'text-orange-400';
        return 'text-red-400';
    };

    const getScoreBadgeColor = (score) => {
        if (score >= 80) return 'bg-green-500/20 text-green-400';
        if (score >= 70) return 'bg-yellow-500/20 text-yellow-400';
        if (score >= 60) return 'bg-orange-500/20 text-orange-400';
        return 'bg-red-500/20 text-red-400';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
                        <div className="grid gap-6">
                            {Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-40 bg-gray-800 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Shield className="w-10 h-10 text-blue-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Cyber Insurance Hub</h1>
                        <p className="text-gray-300">Real-time risk scoring that directly impacts your insurance premiums</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <Target className="w-8 h-8 text-blue-400" />
                                <div>
                                    <p className={`text-3xl font-bold ${getScoreColor(rating.overall_score)}`}>{rating.overall_score}</p>
                                    <p className="text-gray-400 text-sm">Overall Score</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-8 h-8 text-green-400" />
                                <div>
                                    <p className="text-2xl font-bold text-green-400">{Math.round((1 - rating.premium_multiplier) * 100)}%</p>
                                    <p className="text-gray-400 text-sm">Premium Discount</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="w-8 h-8 text-purple-400" />
                                <div>
                                    <p className="text-2xl font-bold text-purple-400">{rating.industry_benchmark}th</p>
                                    <p className="text-gray-400 text-sm">Industry Percentile</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                {rating.trend_analysis.yearly_change > 0 ? 
                                    <TrendingUp className="w-8 h-8 text-green-400" /> : 
                                    <TrendingDown className="w-8 h-8 text-red-400" />
                                }
                                <div>
                                    <p className={`text-2xl font-bold ${rating.trend_analysis.yearly_change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {rating.trend_analysis.yearly_change > 0 ? '+' : ''}{rating.trend_analysis.yearly_change}
                                    </p>
                                    <p className="text-gray-400 text-sm">12-Month Change</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white">Risk Category Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                                        <PolarGrid stroke="#374151" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#d1d5db', fontSize: 12 }} />
                                        <PolarRadiusAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                        <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white">Score Trend Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                        <YAxis stroke="#9ca3af" fontSize={12} />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: '#1f2937',
                                                border: '1px solid #374151',
                                                borderRadius: '8px',
                                                color: '#ffffff'
                                            }}
                                        />
                                        <Line type="monotone" dataKey="score" stroke="#00d4ff" strokeWidth={3} dot={{fill: '#00d4ff', strokeWidth: 2, r: 6}} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white">Risk Category Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.entries(rating.risk_categories).map(([category, score]) => (
                                <div key={category} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300 capitalize">{category.replace(/_/g, ' ')}</span>
                                        <Badge className={getScoreBadgeColor(score)}>{score}</Badge>
                                    </div>
                                    <Progress value={score} className="w-full bg-gray-700" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-yellow-400" />
                                Improvement Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {rating.improvement_recommendations.map((recommendation, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
                                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                                        <span className="text-gray-300 text-sm">{recommendation}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6">
                                <h4 className="text-white font-medium mb-3">Available Discounts</h4>
                                <div className="space-y-2">
                                    {rating.policy_discounts.map((discount, index) => (
                                        <div key={index} className="flex justify-between items-center p-2 bg-green-500/10 border border-green-500/20 rounded">
                                            <span className="text-green-300 text-sm">{discount.type}</span>
                                            <Badge className="bg-green-500/20 text-green-400">{discount.discount}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
