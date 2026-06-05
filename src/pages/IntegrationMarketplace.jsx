
import React, { useState, useEffect } from 'react';
import { IntegrationMarketplace } from '@/entities/IntegrationMarketplace';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Search, 
    Filter, 
    Star, 
    Download, 
    ExternalLink, 
    Shield, 
    CheckCircle,
    Zap,
    Webhook,
    Package,
    DollarSign,
    Users,
    Verified,
    Globe,
    Server,
    Network,
    Cloud,
    AlertTriangle,
    FileText,
    Box
} from 'lucide-react';

const categoryIcons = {
    siem: Shield,
    ticketing: FileText,
    threat_intel: AlertTriangle,
    sandbox: Box,
    compliance: CheckCircle,
    cloud: Cloud,
    network: Network,
    endpoint: Server
};

const categoryColors = {
    siem: "bg-red-500/20 text-red-400 border-red-500/30",
    ticketing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    threat_intel: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    sandbox: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    compliance: "bg-green-500/20 text-green-400 border-green-500/30",
    cloud: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    network: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    endpoint: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
};

const complexityColors = {
    simple: "bg-green-500/20 text-green-400",
    moderate: "bg-yellow-500/20 text-yellow-400",
    complex: "bg-red-500/20 text-red-400"
};

export default function IntegrationMarketplacePage() {
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
            const data = await IntegrationMarketplace.list();
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
                integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                integration.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                integration.developer.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(integration => integration.category === selectedCategory);
        }

        setFilteredIntegrations(filtered);
    };

    const handleInstall = (integration) => {
        alert(`🚀 INSTALLING INTEGRATION\n\nIntegration: ${integration.name}\nDeveloper: ${integration.developer}\n\nIn production, this would:\n• Download and configure the integration\n• Set up API connections\n• Configure webhooks if supported\n• Run initial synchronization\n• Add to your active integrations dashboard`);
    };

    const formatPrice = (integration) => {
        if (integration.pricing_model === 'free') {
            return 'Free';
        }
        if (integration.monthly_cost) {
            return `$${integration.monthly_cost.toLocaleString()}/mo`;
        }
        return integration.pricing_model.replace('_', ' ');
    };

    const categories = [
        { id: 'all', name: 'All Categories', count: integrations.length },
        { id: 'siem', name: 'SIEM', count: integrations.filter(i => i.category === 'siem').length },
        { id: 'ticketing', name: 'Ticketing', count: integrations.filter(i => i.category === 'ticketing').length },
        { id: 'threat_intel', name: 'Threat Intel', count: integrations.filter(i => i.category === 'threat_intel').length },
        { id: 'endpoint', name: 'Endpoint', count: integrations.filter(i => i.category === 'endpoint').length },
        { id: 'cloud', name: 'Cloud', count: integrations.filter(i => i.category === 'cloud').length },
        { id: 'compliance', name: 'Compliance', count: integrations.filter(i => i.category === 'compliance').length }
    ];

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-500'}`} 
            />
        ));
    };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Integration Marketplace</h1>
                        <p className="text-gray-300">Connect your security tools and enhance your platform capabilities</p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <Badge className="bg-green-500/20 text-green-400 px-4 py-2">
                            <Package className="w-4 h-4 mr-2" />
                            {integrations.length} Available
                        </Badge>
                    </div>
                </div>

                {/* Search and Filter */}
                <Card className="border-gray-700 bg-gray-800/50 mb-8">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search integrations..."
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
                                    <Filter className="w-5 h-5" />
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
                                                <span>{category.name}</span>
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
                                    const CategoryIcon = categoryIcons[integration.category] || Package;
                                    
                                    return (
                                        <Card key={integration.integration_id} className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${categoryColors[integration.category]?.replace('text-', 'bg-').replace('border-', '').replace('/30', '/10')}`}>
                                                            <CategoryIcon className={`w-5 h-5 ${categoryColors[integration.category]?.split(' ')[1]}`} />
                                                        </div>
                                                        <div>
                                                            <CardTitle className="text-white flex items-center gap-2">
                                                                {integration.name}
                                                                {integration.verified && (
                                                                    <Verified className="w-4 h-4 text-blue-400" />
                                                                )}
                                                            </CardTitle>
                                                            <p className="text-gray-400 text-sm">{integration.developer}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className={categoryColors[integration.category]}>
                                                        {integration.category}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <p className="text-gray-300 text-sm leading-relaxed">
                                                    {integration.description}
                                                </p>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(integration.rating)}
                                                        <span className="text-gray-400 text-sm ml-2">
                                                            {integration.rating}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                                                        <Download className="w-3 h-3" />
                                                        <span>{integration.downloads.toLocaleString()}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={complexityColors[integration.installation_complexity]}>
                                                            {integration.installation_complexity}
                                                        </Badge>
                                                        {integration.webhook_support && (
                                                            <Badge variant="outline" className="text-green-400 border-green-500/50">
                                                                <Webhook className="w-3 h-3 mr-1" />
                                                                Webhooks
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-white font-semibold">
                                                            {formatPrice(integration)}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            v{integration.version}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-4 border-t border-gray-700/50">
                                                    <Button 
                                                        onClick={() => handleInstall(integration)}
                                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Install
                                                    </Button>
                                                    {integration.documentation_url && (
                                                        <Button 
                                                            variant="outline" 
                                                            className="border-gray-600 text-gray-300"
                                                            onClick={() => window.open(integration.documentation_url, '_blank')}
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}

                        {filteredIntegrations.length === 0 && !isLoading && (
                            <Card className="border-gray-700 bg-gray-800/50">
                                <CardContent className="text-center py-12">
                                    <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
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
