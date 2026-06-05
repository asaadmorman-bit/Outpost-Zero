import React, { useState, useEffect } from 'react';
import { SecurityToolIntegration } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Shield, 
    Network, 
    Server, 
    Eye, 
    CheckCircle, 
    XCircle,
    AlertTriangle,
    Settings,
    Plus,
    Search,
    Activity,
    Database,
    Zap,
    Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const categoryIcons = {
    endpoint_detection: Shield,
    network_security: Network,
    siem: Database,
    vulnerability_management: Eye,
    identity_access: Server,
    threat_intelligence: Activity
};

const statusColors = {
    connected: "bg-green-500/20 text-green-400 border-green-500/30",
    disconnected: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    error: "bg-red-500/20 text-red-400 border-red-500/30",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
};

const healthColors = {
    healthy: "text-green-400",
    warning: "text-yellow-400", 
    critical: "text-red-400"
};

export default function SecurityToolIntegrationsPage() {
    const [integrations, setIntegrations] = useState([]);
    const [filteredIntegrations, setFilteredIntegrations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadIntegrations();
    }, []);

    useEffect(() => {
        filterIntegrations();
    }, [integrations, searchTerm, selectedCategory]);

    const loadIntegrations = async () => {
        setIsLoading(true);
        try {
            const data = await SecurityToolIntegration.list();
            setIntegrations(data);
        } catch (error) {
            console.error('Error loading integrations:', error);
            setIntegrations([]);
        }
        setIsLoading(false);
    };

    const filterIntegrations = () => {
        let filtered = integrations;

        if (searchTerm) {
            filtered = filtered.filter(integration =>
                integration.tool_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                integration.vendor.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(integration => integration.category === selectedCategory);
        }

        setFilteredIntegrations(filtered);
    };

    const handleConfigureIntegration = (integration) => {
        alert(`🔧 CONFIGURE INTEGRATION\n\nTool: ${integration.tool_name}\nVendor: ${integration.vendor}\n\nIn production, this would:\n• Open configuration wizard\n• Test API connectivity\n• Configure data mappings\n• Set up polling schedules\n• Validate compliance settings`);
    };

    const handleTestConnection = (integration) => {
        alert(`🔍 TESTING CONNECTION\n\nTool: ${integration.tool_name}\nEndpoint: ${integration.api_endpoint}\n\nIn production, this would:\n• Validate API credentials\n• Test network connectivity\n• Verify data formats\n• Check rate limits\n• Confirm bi-directional capabilities`);
    };

    const connectedCount = integrations.filter(i => i.connection_status === 'connected').length;
    const totalEvents = integrations.reduce((sum, i) => sum + (i.events_per_day || 0), 0);
    const healthyCount = integrations.filter(i => i.health_status === 'healthy').length;

    const categories = [
        { id: 'all', name: 'All Tools', count: integrations.length },
        { id: 'endpoint_detection', name: 'Endpoint Detection', count: integrations.filter(i => i.category === 'endpoint_detection').length },
        { id: 'network_security', name: 'Network Security', count: integrations.filter(i => i.category === 'network_security').length },
        { id: 'siem', name: 'SIEM', count: integrations.filter(i => i.category === 'siem').length },
        { id: 'vulnerability_management', name: 'Vulnerability Mgmt', count: integrations.filter(i => i.category === 'vulnerability_management').length },
        { id: 'identity_access', name: 'Identity & Access', count: integrations.filter(i => i.category === 'identity_access').length },
        { id: 'threat_intelligence', name: 'Threat Intel', count: integrations.filter(i => i.category === 'threat_intelligence').length }
    ];

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Security Tool Integrations</h1>
                        <p className="text-gray-300">Manage connections to enterprise security tools and platforms</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Integration
                    </Button>
                </div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Connected Tools</p>
                                    <p className="text-2xl font-bold text-green-400">{connectedCount}</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Daily Events</p>
                                    <p className="text-2xl font-bold text-blue-400">{totalEvents.toLocaleString()}</p>
                                </div>
                                <Activity className="w-8 h-8 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Healthy Status</p>
                                    <p className="text-2xl font-bold text-purple-400">{healthyCount}</p>
                                </div>
                                <Shield className="w-8 h-8 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Bi-Directional</p>
                                    <p className="text-2xl font-bold text-cyan-400">
                                        {integrations.filter(i => i.bi_directional).length}
                                    </p>
                                </div>
                                <Zap className="w-8 h-8 text-cyan-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filter */}
                <Card className="border-gray-700 bg-gray-800/50 mb-8">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search integrations by tool name or vendor..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-gray-900 border-gray-600 text-white"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    Categories
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {categories.map(category => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                                selectedCategory === category.id 
                                                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                                                    : 'text-gray-300 hover:bg-gray-700/50'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">{category.name}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {category.count}
                                                </Badge>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="text-white text-xl">Loading integrations...</div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {filteredIntegrations.map(integration => {
                                    const CategoryIcon = categoryIcons[integration.category] || Shield;
                                    const statusIcon = integration.connection_status === 'connected' ? CheckCircle :
                                                     integration.connection_status === 'error' ? XCircle :
                                                     integration.connection_status === 'pending' ? Clock : XCircle;
                                    
                                    return (
                                        <Card key={integration.integration_id} className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-blue-500/10">
                                                            <CategoryIcon className="w-5 h-5 text-blue-400" />
                                                        </div>
                                                        <div>
                                                            <CardTitle className="text-white">
                                                                {integration.tool_name.replace('_', ' ')}
                                                            </CardTitle>
                                                            <p className="text-gray-400 text-sm">{integration.vendor}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <Badge variant="outline" className={statusColors[integration.connection_status]}>
                                                            {statusIcon && React.createElement(statusIcon, { className: "w-3 h-3 mr-1" })}
                                                            {integration.connection_status}
                                                        </Badge>
                                                        <span className={`text-xs ${healthColors[integration.health_status]}`}>
                                                            {integration.health_status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-400">Events/Day</p>
                                                        <p className="text-white font-semibold">{(integration.events_per_day || 0).toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400">Frequency</p>
                                                        <p className="text-white font-semibold">{integration.polling_frequency?.replace('_', ' ')}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400">Data Types</p>
                                                        <p className="text-white font-semibold">{integration.data_types?.length || 0}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400">Bi-Directional</p>
                                                        <p className="text-white font-semibold">{integration.bi_directional ? 'Yes' : 'No'}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-gray-400 text-xs mb-2">Compliance Frameworks</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {integration.compliance_mapping?.slice(0, 3).map(framework => (
                                                            <Badge key={framework} variant="outline" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                                                                {framework}
                                                            </Badge>
                                                        ))}
                                                        {integration.compliance_mapping?.length > 3 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{integration.compliance_mapping.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-4 border-t border-gray-700/50">
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        onClick={() => handleConfigureIntegration(integration)}
                                                        className="flex-1 bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/30"
                                                    >
                                                        <Settings className="w-4 h-4 mr-1" />
                                                        Configure
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        onClick={() => handleTestConnection(integration)}
                                                        className="flex-1 bg-green-600/20 border-green-500/50 text-green-300 hover:bg-green-600/30"
                                                    >
                                                        <Activity className="w-4 h-4 mr-1" />
                                                        Test
                                                    </Button>
                                                </div>

                                                {integration.last_sync && (
                                                    <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-700/50">
                                                        <span>Last Sync: {new Date(integration.last_sync).toLocaleTimeString()}</span>
                                                        <span className="capitalize">{integration.category.replace('_', ' ')}</span>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}

                        {filteredIntegrations.length === 0 && !isLoading && (
                            <Card className="border-gray-700 bg-gray-800/50">
                                <CardContent className="text-center py-12">
                                    <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                    <p className="text-gray-300 text-lg mb-2">No integrations found</p>
                                    <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}