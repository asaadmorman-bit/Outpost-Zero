import React, { useState, useEffect } from 'react';
import { DataIngestionMetrics, Integration } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Database, 
    Activity, 
    Zap, 
    CheckCircle, 
    AlertTriangle,
    Plus,
    Settings,
    TrendingUp,
    Server,
    Cloud,
    Network,
    Shield,
    Monitor,
    Smartphone,
    Globe
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const sourceTypeIcons = {
    firewall: Shield,
    edr: Monitor,
    cloud_aws: Cloud,
    cloud_gcp: Cloud,
    cloud_azure: Cloud,
    os_logs: Server,
    application: Globe,
    network: Network,
    custom: Database
};

const sourceTypeColors = {
    firewall: "bg-red-500/20 text-red-400",
    edr: "bg-purple-500/20 text-purple-400",
    cloud_aws: "bg-orange-500/20 text-orange-400",
    cloud_gcp: "bg-blue-500/20 text-blue-400",
    cloud_azure: "bg-cyan-500/20 text-cyan-400",
    os_logs: "bg-green-500/20 text-green-400",
    application: "bg-yellow-500/20 text-yellow-400",
    network: "bg-pink-500/20 text-pink-400",
    custom: "bg-gray-500/20 text-gray-400"
};

export default function DataSourcesPage() {
    const [metrics, setMetrics] = useState([]);
    const [integrations, setIntegrations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [metricsData, integrationsData] = await Promise.all([
                DataIngestionMetrics.list("-timestamp").catch(() => []),
                Integration.list().catch(() => [])
            ]);

            setMetrics(metricsData.length > 0 ? metricsData : getMockMetrics());
            setIntegrations(integrationsData.length > 0 ? integrationsData : getMockIntegrations());
        } catch (error) {
            console.error('Error loading data sources:', error);
            setMetrics(getMockMetrics());
            setIntegrations(getMockIntegrations());
        }
        setIsLoading(false);
    };

    const getMockMetrics = () => [
        {
            metric_id: "m1",
            timestamp: new Date().toISOString(),
            source_type: "firewall",
            events_per_second: 1250,
            data_volume_gb: 45.6,
            parse_success_rate: 98.5,
            latency_ms: 150,
            storage_tier: "hot",
            retention_days: 90
        },
        {
            metric_id: "m2", 
            timestamp: new Date().toISOString(),
            source_type: "edr",
            events_per_second: 850,
            data_volume_gb: 32.1,
            parse_success_rate: 99.2,
            latency_ms: 85,
            storage_tier: "hot",
            retention_days: 180
        },
        {
            metric_id: "m3",
            timestamp: new Date().toISOString(),
            source_type: "cloud_aws",
            events_per_second: 2100,
            data_volume_gb: 78.9,
            parse_success_rate: 97.8,
            latency_ms: 200,
            storage_tier: "warm",
            retention_days: 365
        },
        {
            metric_id: "m4",
            timestamp: new Date().toISOString(),
            source_type: "application",
            events_per_second: 540,
            data_volume_gb: 18.7,
            parse_success_rate: 95.6,
            latency_ms: 120,
            storage_tier: "hot",
            retention_days: 30
        }
    ];

    const getMockIntegrations = () => [
        {
            name: "Palo Alto Firewall",
            type: "siem",
            status: "connected",
            api_key_stored: true,
            last_sync: new Date().toISOString()
        },
        {
            name: "CrowdStrike Falcon",
            type: "threat_intel", 
            status: "connected",
            api_key_stored: true,
            last_sync: new Date().toISOString()
        },
        {
            name: "AWS CloudTrail",
            type: "siem",
            status: "connected", 
            api_key_stored: true,
            last_sync: new Date().toISOString()
        },
        {
            name: "Jira Service Desk",
            type: "ticketing",
            status: "disconnected",
            api_key_stored: false,
            last_sync: null
        }
    ];

    const totalEPS = metrics.reduce((sum, m) => sum + m.events_per_second, 0);
    const totalVolume = metrics.reduce((sum, m) => sum + m.data_volume_gb, 0);
    const avgParseRate = metrics.reduce((sum, m) => sum + m.parse_success_rate, 0) / metrics.length || 0;
    const avgLatency = metrics.reduce((sum, m) => sum + m.latency_ms, 0) / metrics.length || 0;

    const handleAddSource = () => {
        alert(`📊 ADD DATA SOURCE\n\nIn production, this would:\n• Launch the data source configuration wizard\n• Detect available log sources automatically\n• Provide step-by-step integration guides\n• Configure parsing rules and field mappings\n• Test connectivity and data flow\n• Start live ingestion`);
    };

    const handleConfigureSource = (source) => {
        alert(`⚙️ CONFIGURE SOURCE: ${source.source_type.toUpperCase()}\n\nIn production, this would:\n• Open configuration panel for ${source.source_type}\n• Allow adjustment of parsing rules\n• Configure retention policies\n• Set up alerting thresholds\n• Modify storage tiers\n• Update field mappings`);
    };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Data Sources & Ingestion</h1>
                        <p className="text-gray-300">Monitor and manage your security data pipeline</p>
                    </div>
                    <Button onClick={handleAddSource} className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Data Source
                    </Button>
                </div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Total EPS</p>
                                    <p className="text-2xl font-bold text-white">{totalEPS.toLocaleString()}</p>
                                </div>
                                <Activity className="w-8 h-8 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Daily Volume</p>
                                    <p className="text-2xl font-bold text-white">{totalVolume.toFixed(1)} GB</p>
                                </div>
                                <Database className="w-8 h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Parse Success</p>
                                    <p className="text-2xl font-bold text-white">{avgParseRate.toFixed(1)}%</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Avg Latency</p>
                                    <p className="text-2xl font-bold text-white">{avgLatency.toFixed(0)}ms</p>
                                </div>
                                <Zap className="w-8 h-8 text-yellow-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="sources" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="sources">Data Sources</TabsTrigger>
                        <TabsTrigger value="integrations">Integrations</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="sources">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {metrics.map(source => {
                                const IconComponent = sourceTypeIcons[source.source_type] || Database;
                                const colorClass = sourceTypeColors[source.source_type] || sourceTypeColors.custom;
                                
                                return (
                                    <Card key={source.metric_id} className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${colorClass}`}>
                                                        <IconComponent className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-white capitalize">
                                                            {source.source_type.replace('_', ' ')}
                                                        </CardTitle>
                                                        <Badge className="bg-green-500/20 text-green-400 mt-1">
                                                            Active
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleConfigureSource(source)}
                                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-400">Events/sec</p>
                                                    <p className="text-white font-semibold">{source.events_per_second.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Volume</p>
                                                    <p className="text-white font-semibold">{source.data_volume_gb.toFixed(1)} GB</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Latency</p>
                                                    <p className="text-white font-semibold">{source.latency_ms}ms</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Storage</p>
                                                    <p className="text-white font-semibold capitalize">{source.storage_tier}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-gray-400">Parse Success Rate</span>
                                                    <span className="text-white">{source.parse_success_rate}%</span>
                                                </div>
                                                <Progress value={source.parse_success_rate} className="h-2" />
                                            </div>

                                            <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-700/50">
                                                <span>Retention: {source.retention_days} days</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {source.storage_tier}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>

                    <TabsContent value="integrations">
                        <div className="grid md:grid-cols-2 gap-6">
                            {integrations.map((integration, index) => (
                                <Card key={index} className="border-gray-700 bg-gray-800/50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-white font-semibold">{integration.name}</h3>
                                            <Badge className={integration.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                                {integration.status === 'connected' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                                                {integration.status}
                                            </Badge>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Type:</span>
                                                <span className="text-white capitalize">{integration.type}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">API Key:</span>
                                                <span className="text-white">{integration.api_key_stored ? 'Stored' : 'Missing'}</span>
                                            </div>
                                            {integration.last_sync && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Last Sync:</span>
                                                    <span className="text-white">{new Date(integration.last_sync).toLocaleTimeString()}</span>
                                                </div>
                                            )}
                                        </div>
                                        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                                            <Settings className="w-4 h-4 mr-2" />
                                            Configure
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="analytics">
                        <div className="grid lg:grid-cols-2 gap-6">
                            <Card className="border-gray-700 bg-gray-800/50">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-400" />
                                        Ingestion Trends
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[
                                                { time: '00:00', eps: 1200, volume: 45 },
                                                { time: '04:00', eps: 800, volume: 30 },
                                                { time: '08:00', eps: 2100, volume: 78 },
                                                { time: '12:00', eps: 2500, volume: 95 },
                                                { time: '16:00', eps: 1900, volume: 72 },
                                                { time: '20:00', eps: 1600, volume: 60 }
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                <XAxis dataKey="time" stroke="#9ca3af" />
                                                <YAxis stroke="#9ca3af" />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#1f2937',
                                                        border: '1px solid #374151',
                                                        borderRadius: '8px',
                                                        color: '#ffffff'
                                                    }}
                                                />
                                                <Line type="monotone" dataKey="eps" stroke="#3b82f6" strokeWidth={2} name="Events/sec" />
                                                <Line type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} name="Volume (GB)" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-700 bg-gray-800/50">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Database className="w-5 h-5 text-purple-400" />
                                        Sources by Volume
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={metrics}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                <XAxis dataKey="source_type" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                                                <YAxis stroke="#9ca3af" />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#1f2937',
                                                        border: '1px solid #374151',
                                                        borderRadius: '8px',
                                                        color: '#ffffff'
                                                    }}
                                                />
                                                <Bar dataKey="data_volume_gb" fill="#8b5cf6" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}