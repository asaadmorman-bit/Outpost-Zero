import React, { useState, useEffect } from 'react';
import { MobileApp, PlatformMetrics } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Smartphone, 
    Monitor, 
    Download, 
    Users, 
    Star, 
    TrendingUp, 
    Clock,
    Shield,
    Wifi,
    WifiOff
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const platformIcons = {
    ios: '🍎',
    android: '🤖', 
    windows: '🪟',
    macos: '💻',
    linux: '🐧',
    web: '🌐'
};

const mockApps = [
    {
        app_name: 'AXIS Rebirth Mobile',
        platform: 'ios',
        tier: 'residential',
        version: '2.1.4',
        status: 'live',
        active_installs: 25000,
        price_model: 'subscription',
        monthly_price: 99,
        security_features: ['Biometric Auth', 'Local Encryption', 'Secure Backup'],
        offline_capabilities: true,
        cloud_sync: true
    },
    {
        app_name: 'AXIS Rebirth Mobile',
        platform: 'android',
        tier: 'residential', 
        version: '2.1.3',
        status: 'live',
        active_installs: 32000,
        price_model: 'subscription',
        monthly_price: 99,
        security_features: ['Fingerprint Auth', 'Knox Integration', 'Secure Folder'],
        offline_capabilities: true,
        cloud_sync: true
    },
    {
        app_name: 'RevSentinel Enterprise',
        platform: 'windows',
        tier: 'enterprise',
        version: '3.2.1',
        status: 'live',
        active_installs: 8500,
        price_model: 'subscription',
        monthly_price: 2500,
        security_features: ['SSO Integration', 'TPM Support', 'Windows Defender Integration'],
        offline_capabilities: false,
        cloud_sync: true
    },
    {
        app_name: 'Outpost Zero Gov',
        platform: 'linux',
        tier: 'government',
        version: '1.5.8',
        status: 'beta',
        active_installs: 1200,
        price_model: 'subscription',
        security_features: ['FIPS 140-2', 'SELinux Integration', 'Hardware Security Module'],
        offline_capabilities: true,
        cloud_sync: false
    }
];

const mockMetrics = [
    { platform: 'iOS', users: 25000, satisfaction: 4.8, crashes: 0.02 },
    { platform: 'Android', users: 32000, satisfaction: 4.6, crashes: 0.04 },
    { platform: 'Windows', users: 8500, satisfaction: 4.9, crashes: 0.01 },
    { platform: 'macOS', users: 3200, satisfaction: 4.7, crashes: 0.03 },
    { platform: 'Linux', users: 1200, satisfaction: 4.9, crashes: 0.01 },
    { platform: 'Web', users: 45000, satisfaction: 4.5, crashes: 0.00 }
];

export default function MultiPlatformDashboard() {
    const [apps, setApps] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [appsData, metricsData] = await Promise.all([
                MobileApp.list(),
                PlatformMetrics.list()
            ]);
            setApps(appsData.length > 0 ? appsData : mockApps);
            setMetrics(metricsData.length > 0 ? metricsData : mockMetrics);
        } catch (error) {
            console.error('Error loading platform data:', error);
            setApps(mockApps);
            setMetrics(mockMetrics);
        }
        setIsLoading(false);
    };

    const getTierColor = (tier) => {
        switch(tier) {
            case 'residential': return 'bg-green-500/20 text-green-300';
            case 'smb': return 'bg-blue-500/20 text-blue-300';
            case 'enterprise': return 'bg-purple-500/20 text-purple-300';
            case 'government': return 'bg-red-500/20 text-red-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'live': return 'bg-green-500/20 text-green-300';
            case 'beta': return 'bg-blue-500/20 text-blue-300';
            case 'in_review': return 'bg-yellow-500/20 text-yellow-300';
            case 'in_development': return 'bg-orange-500/20 text-orange-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const totalInstalls = apps.reduce((sum, app) => sum + app.active_installs, 0);
    const avgSatisfaction = metrics.reduce((sum, m) => sum + m.satisfaction, 0) / metrics.length;

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Smartphone className="w-10 h-10 text-blue-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">Multi-Platform Dashboard</h1>
                        <p className="text-gray-300">Unified view across all platforms and application tiers.</p>
                    </div>
                </div>

                {/* Platform Overview Metrics */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Download className="text-blue-400" /> Total Installs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-400">
                                {totalInstalls.toLocaleString()}
                            </div>
                            <p className="text-sm text-gray-400">Across all platforms</p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Star className="text-yellow-400" /> Avg Satisfaction
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-yellow-400">
                                {avgSatisfaction.toFixed(1)}
                            </div>
                            <p className="text-sm text-gray-400">User rating</p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Monitor className="text-green-400" /> Platforms
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-400">
                                {new Set(apps.map(a => a.platform)).size}
                            </div>
                            <p className="text-sm text-gray-400">Active platforms</p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Shield className="text-purple-400" /> Security Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-400">94%</div>
                            <p className="text-sm text-gray-400">Cross-platform security</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="applications" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="applications">Applications</TabsTrigger>
                        <TabsTrigger value="analytics">Platform Analytics</TabsTrigger>
                        <TabsTrigger value="deployment">Deployment Status</TabsTrigger>
                    </TabsList>

                    <TabsContent value="applications" className="mt-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isLoading ? (
                                <p className="text-gray-400">Loading applications...</p>
                            ) : (
                                apps.map((app, index) => (
                                    <Card key={index} className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{platformIcons[app.platform]}</span>
                                                    <div>
                                                        <CardTitle className="text-white text-lg">{app.app_name}</CardTitle>
                                                        <p className="text-sm text-gray-400 capitalize">{app.platform}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <Badge className={getTierColor(app.tier)}>
                                                        {app.tier}
                                                    </Badge>
                                                    <Badge className={getStatusColor(app.status)}>
                                                        {app.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Version:</span>
                                                    <span className="text-white font-mono">{app.version}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Active Users:</span>
                                                    <span className="text-blue-400">{app.active_installs.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Price:</span>
                                                    <span className="text-green-400">${app.monthly_price}/mo</span>
                                                </div>

                                                <div className="pt-3 border-t border-gray-700/50">
                                                    <h5 className="text-sm font-semibold text-white mb-2">Key Features:</h5>
                                                    <div className="flex flex-wrap gap-1">
                                                        {app.security_features.slice(0, 2).map((feature, i) => (
                                                            <Badge key={i} variant="outline" className="text-xs text-gray-300 border-gray-600">
                                                                {feature}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        {app.offline_capabilities ? <WifiOff className="w-3 h-3 text-green-400" /> : <Wifi className="w-3 h-3" />}
                                                        Offline
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Shield className="w-3 h-3 text-blue-400" />
                                                        {app.security_features.length} Security Features
                                                    </div>
                                                </div>

                                                <Button className="w-full mt-4" variant="outline">
                                                    View Details
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="analytics" className="mt-6">
                        <div className="grid lg:grid-cols-2 gap-6">
                            <Card className="border-gray-700 bg-gray-800/50">
                                <CardHeader>
                                    <CardTitle className="text-white">Platform Usage Distribution</CardTitle>
                                </CardHeader>
                                <CardContent className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={mockMetrics}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="platform" stroke="#9ca3af" fontSize={12} />
                                            <YAxis stroke="#9ca3af" fontSize={12} />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: '#1f2937',
                                                    border: '1px solid #374151',
                                                    borderRadius: '8px',
                                                    color: '#ffffff'
                                                }}
                                            />
                                            <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-700 bg-gray-800/50">
                                <CardHeader>
                                    <CardTitle className="text-white">Satisfaction & Reliability</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {mockMetrics.map((metric, index) => (
                                            <div key={index} className="p-4 rounded-lg bg-gray-900/30 border border-gray-700/50">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{platformIcons[metric.platform.toLowerCase()]}</span>
                                                        <span className="text-white font-medium">{metric.platform}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Star className="w-4 h-4 text-yellow-400" />
                                                        <span className="text-yellow-400">{metric.satisfaction}</span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-400">Users:</span>
                                                        <span className="ml-2 text-blue-400">{metric.users.toLocaleString()}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Crash Rate:</span>
                                                        <span className="ml-2 text-green-400">{metric.crashes}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="deployment" className="mt-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {['iOS App Store', 'Google Play', 'Microsoft Store', 'Enterprise Portal'].map((store, index) => (
                                <Card key={index} className="border-gray-700 bg-gray-800/50">
                                    <CardHeader>
                                        <CardTitle className="text-white text-lg">{store}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Status:</span>
                                                <Badge className="bg-green-500/20 text-green-300">Live</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Version:</span>
                                                <span className="text-white font-mono">2.1.4</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Rating:</span>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400" />
                                                    <span className="text-yellow-400">4.8</span>
                                                </div>
                                            </div>
                                            <Progress value={95} className="h-2" />
                                            <p className="text-xs text-gray-400">Deployment: 95% complete</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}