
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Shield, 
    AlertTriangle, 
    TrendingUp, 
    Users,
    Brain,
    Eye,
    Activity
} from 'lucide-react';

export default function StrategicCommandSummary({ 
    events, 
    incidents, 
    userBehavior, 
    advisories,
    threatIntel 
}) {
    const criticalEvents = events.filter(e => e.severity === 'critical').length;
    const highEvents = events.filter(e => e.severity === 'high').length;
    const openIncidents = incidents.filter(i => ['open', 'investigating'].includes(i.status)).length;
    const criticalIncidents = incidents.filter(i => i.severity === 'critical').length;
    const highRiskUsers = userBehavior.filter(b => b.anomaly_score > 80).length;
    const criticalAdvisories = advisories.filter(a => a.severity === 'critical').length;
    const activeThreatIntel = threatIntel.filter(t => t.confidence > 70).length;

    // New metrics calculations for the added cards
    const criticalCount = criticalEvents + criticalIncidents;
    const activeIncidents = openIncidents;
    const aiAdvisories = criticalAdvisories;

    let avgThreatScore = 0;
    if (threatIntel && threatIntel.length > 0) {
        const totalConfidence = threatIntel.reduce((sum, item) => sum + (item.confidence || 0), 0);
        avgThreatScore = Math.round(totalConfidence / threatIntel.length);
    }

    const summaryCards = [
        {
            title: 'Critical Events',
            value: criticalEvents,
            subtitle: `${highEvents} high severity`,
            icon: AlertTriangle,
            color: criticalEvents > 0 ? 'text-red-400' : 'text-gray-500',
            bgColor: criticalEvents > 0 ? 'bg-red-500/10' : 'bg-gray-500/10',
            trend: events.length > 0 ? 'Active' : 'Clear'
        },
        {
            title: 'Active Incidents',
            value: openIncidents,
            subtitle: `${criticalIncidents} critical`,
            icon: Shield,
            color: criticalIncidents > 0 ? 'text-orange-400' : 'text-blue-400',
            bgColor: criticalIncidents > 0 ? 'bg-orange-500/10' : 'bg-blue-500/10',
            trend: openIncidents > 0 ? 'Investigating' : 'Resolved'
        },
        {
            title: 'High-Risk Users',
            value: highRiskUsers,
            subtitle: `${userBehavior.length} total analyzed`,
            icon: Users,
            color: highRiskUsers > 0 ? 'text-yellow-400' : 'text-green-400',
            bgColor: highRiskUsers > 0 ? 'bg-yellow-500/10' : 'bg-green-500/10',
            trend: highRiskUsers > 0 ? 'Monitoring' : 'Normal'
        },
        {
            title: 'AI Advisories',
            value: criticalAdvisories,
            subtitle: `${advisories.length} total recommendations`,
            icon: Brain,
            color: criticalAdvisories > 0 ? 'text-purple-400' : 'text-gray-500',
            bgColor: criticalAdvisories > 0 ? 'bg-purple-500/10' : 'bg-gray-500/10',
            trend: criticalAdvisories > 0 ? 'Action Required' : 'Reviewed'
        },
        {
            title: 'Threat Intelligence',
            value: activeThreatIntel,
            subtitle: `${threatIntel.length} indicators tracked`,
            icon: Eye,
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-500/10',
            trend: 'Active'
        },
        {
            title: 'System Health',
            value: '98%',
            subtitle: 'All systems operational',
            icon: Activity,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
            trend: 'Healthy'
        }
    ];

    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Strategic Command Summary</h2>
            </div>
            
            {/* New metrics cards section */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
                <Card className="border-gray-700 bg-gray-800/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-300">Critical Threats</span>
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <p className="text-3xl font-bold text-white">{criticalCount}</p>
                        <p className="text-xs text-gray-400 mt-1">Require immediate action</p>
                    </CardContent>
                </Card>

                <Card className="border-gray-700 bg-gray-800/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-300">Active Incidents</span>
                            <Activity className="w-5 h-5 text-orange-400" />
                        </div>
                        <p className="text-3xl font-bold text-white">{activeIncidents}</p>
                        <p className="text-xs text-gray-400 mt-1">Under investigation</p>
                    </CardContent>
                </Card>

                <Card className="border-gray-700 bg-gray-800/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-300">AI Advisories</span>
                            <Brain className="w-5 h-5 text-purple-400" />
                        </div>
                        <p className="text-3xl font-bold text-white">{aiAdvisories}</p>
                        <p className="text-xs text-gray-400 mt-1">Pending review</p>
                    </CardContent>
                </Card>

                <Card className="border-gray-700 bg-gray-800/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-300">Threat Score</span>
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                        </div>
                        <p className="text-3xl font-bold text-white">{avgThreatScore}/100</p>
                        <p className="text-xs text-gray-400 mt-1">Organization-wide</p>
                    </CardContent>
                </Card>
            </div>

            {/* Existing summary cards grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                {summaryCards.map((card, index) => {
                    const IconComponent = card.icon;
                    return (
                        <Card key={index} className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all">
                            <CardContent className="p-4">
                                <div className={`p-2 rounded-lg ${card.bgColor} w-fit mb-3`}>
                                    <IconComponent className={`w-5 h-5 md:w-6 md:h-6 ${card.color}`} />
                                </div>
                                <div className={`text-2xl md:text-3xl font-bold ${card.color} mb-1`}>
                                    {card.value}
                                </div>
                                <div className="text-xs md:text-sm font-medium text-white mb-2">
                                    {card.title}
                                </div>
                                <div className="text-xs text-gray-400 mb-2">
                                    {card.subtitle}
                                </div>
                                <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                        card.trend === 'Clear' || card.trend === 'Resolved' || card.trend === 'Normal' || card.trend === 'Reviewed' || card.trend === 'Healthy'
                                            ? 'border-green-500/50 text-green-400'
                                            : 'border-yellow-500/50 text-yellow-400'
                                    }`}
                                >
                                    {card.trend}
                                </Badge>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
