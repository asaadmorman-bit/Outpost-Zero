import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    CheckCircle, 
    AlertTriangle, 
    XCircle,
    RefreshCw,
    Activity,
    Database,
    Zap,
    Shield,
    Cloud,
    Server
} from 'lucide-react';

export default function SystemStatus() {
    const [systemHealth, setSystemHealth] = useState({
        overall: 'healthy',
        components: [
            { name: 'Dashboard', status: 'operational', uptime: '99.9%', icon: Activity },
            { name: 'Incident Management', status: 'operational', uptime: '99.8%', icon: AlertTriangle },
            { name: 'SOAR Platform', status: 'operational', uptime: '99.7%', icon: Zap },
            { name: 'Threat Intelligence', status: 'operational', uptime: '99.9%', icon: Shield },
            { name: 'Database Layer', status: 'operational', uptime: '100%', icon: Database },
            { name: 'Cloud Infrastructure', status: 'operational', uptime: '99.95%', icon: Cloud },
            { name: 'AI/ML Engine', status: 'operational', uptime: '99.6%', icon: Server }
        ]
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'operational':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'degraded':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'down':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'operational':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'degraded':
                return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
            case 'down':
                return <XCircle className="w-5 h-5 text-red-400" />;
            default:
                return <Activity className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">System Status</h1>
                        <p className="text-gray-400">Real-time platform health monitoring</p>
                    </div>
                    <Button variant="outline" className="border-gray-700 text-gray-300">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>

                {/* Overall Status */}
                <Card className="bg-gray-800/50 border-gray-700 mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <CheckCircle className="w-12 h-12 text-green-400" />
                                <div>
                                    <h2 className="text-2xl font-bold text-white">All Systems Operational</h2>
                                    <p className="text-gray-400">Last checked: {new Date().toLocaleTimeString()}</p>
                                </div>
                            </div>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-lg px-4 py-2">
                                100% Uptime
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Component Status */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {systemHealth.components.map(component => {
                        const Icon = component.icon;
                        return (
                            <Card key={component.name} className="bg-gray-800/50 border-gray-700">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5 text-blue-400" />
                                            <CardTitle className="text-white text-base">{component.name}</CardTitle>
                                        </div>
                                        {getStatusIcon(component.status)}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Badge variant="outline" className={getStatusColor(component.status)}>
                                            {component.status}
                                        </Badge>
                                        <p className="text-sm text-gray-400">
                                            Uptime: <span className="text-white font-medium">{component.uptime}</span>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}