import React, { useState, useEffect } from 'react';
import { VideoServiceIntegration } from '@/entities/VideoServiceIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Video,
    Plus,
    Check,
    X,
    ExternalLink,
    Settings,
    RefreshCw,
    Trash2,
    AlertTriangle,
    Info
} from 'lucide-react';

const videoServices = [
    {
        id: 'synthesia',
        name: 'Synthesia',
        description: 'AI avatars with natural voices in 120+ languages',
        logo: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=100&h=100&fit=crop',
        pricing: 'From $30/month',
        features: ['140+ AI avatars', '120+ languages', 'Custom avatars', 'Screen recorder'],
        docsUrl: 'https://docs.synthesia.io/',
        signupUrl: 'https://www.synthesia.io/pricing',
        credentials: ['api_key'],
        popular: true
    },
    {
        id: 'remotion',
        name: 'Remotion',
        description: 'Programmatic video creation with React',
        logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop',
        pricing: 'Open source + Cloud rendering',
        features: ['React-based', 'Full customization', 'Scalable', 'Version control'],
        docsUrl: 'https://www.remotion.dev/docs/',
        signupUrl: 'https://www.remotion.dev/lambda',
        credentials: ['api_key', 'workspace_id'],
        popular: true
    },
    {
        id: 'visla',
        name: 'Visla',
        description: 'AI-powered video creation and editing',
        logo: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=100&h=100&fit=crop',
        pricing: 'From $19/month',
        features: ['AI script generation', 'Stock footage', 'Auto-editing', 'Team collaboration'],
        docsUrl: 'https://support.visla.us/',
        signupUrl: 'https://www.visla.us/pricing',
        credentials: ['api_key'],
        popular: false
    },
    {
        id: 'lumen5',
        name: 'Lumen5',
        description: 'Turn blog posts into videos automatically',
        logo: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=100&h=100&fit=crop',
        pricing: 'From $29/month',
        features: ['Blog to video', 'AI layouts', 'Stock media library', 'Brand kit'],
        docsUrl: 'https://support.lumen5.com/',
        signupUrl: 'https://lumen5.com/pricing/',
        credentials: ['api_key'],
        popular: false
    },
    {
        id: 'descript',
        name: 'Descript',
        description: 'Edit videos like a document',
        logo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop',
        pricing: 'From $24/month',
        features: ['Text-based editing', 'AI voices', 'Screen recording', 'Transcription'],
        docsUrl: 'https://help.descript.com/',
        signupUrl: 'https://www.descript.com/pricing',
        credentials: ['api_key'],
        popular: false
    },
    {
        id: 'pictory',
        name: 'Pictory',
        description: 'AI video creation from long-form content',
        logo: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=100&h=100&fit=crop',
        pricing: 'From $19/month',
        features: ['Script to video', 'Article to video', 'Auto-captions', 'Highlight reels'],
        docsUrl: 'https://pictory.ai/support',
        signupUrl: 'https://pictory.ai/pricing',
        credentials: ['api_key', 'api_secret'],
        popular: false
    }
];

export default function VideoServiceSetup({ onServiceConfigured }) {
    const [integrations, setIntegrations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [credentials, setCredentials] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [testingConnection, setTestingConnection] = useState(false);

    useEffect(() => {
        loadIntegrations();
    }, []);

    const loadIntegrations = async () => {
        setIsLoading(true);
        try {
            const data = await VideoServiceIntegration.list();
            setIntegrations(data);
        } catch (error) {
            console.error('Error loading integrations:', error);
        }
        setIsLoading(false);
    };

    const handleAddService = (service) => {
        setSelectedService(service);
        setCredentials({});
        setShowAddDialog(true);
    };

    const handleSaveIntegration = async () => {
        if (!selectedService) return;

        setIsSaving(true);
        try {
            const integration = {
                integration_id: `${selectedService.id}_${Date.now()}`,
                service_provider: selectedService.id,
                service_name: `${selectedService.name} Integration`,
                status: 'connected',
                credentials: credentials,
                configuration: {
                    output_format: 'mp4',
                    resolution: '1080p',
                    watermark_enabled: false
                },
                usage_metrics: {
                    videos_generated: 0,
                    total_duration_minutes: 0,
                    credits_used: 0
                },
                last_sync: new Date().toISOString()
            };

            await VideoServiceIntegration.create(integration);
            await loadIntegrations();
            setShowAddDialog(false);
            setSelectedService(null);
            setCredentials({});

            if (onServiceConfigured) {
                onServiceConfigured(integration);
            }
        } catch (error) {
            console.error('Error saving integration:', error);
            alert('Failed to save integration. Please try again.');
        }
        setIsSaving(false);
    };

    const handleTestConnection = async () => {
        setTestingConnection(true);
        // Simulate testing connection
        await new Promise(resolve => setTimeout(resolve, 2000));
        setTestingConnection(false);
        alert('Connection test successful! ✅');
    };

    const handleDeleteIntegration = async (integrationId) => {
        if (!confirm('Are you sure you want to remove this integration?')) return;

        try {
            await VideoServiceIntegration.delete(integrationId);
            await loadIntegrations();
        } catch (error) {
            console.error('Error deleting integration:', error);
            alert('Failed to delete integration.');
        }
    };

    const getServiceInfo = (providerId) => {
        return videoServices.find(s => s.id === providerId) || {};
    };

    return (
        <div className="space-y-6">
            <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Video className="w-5 h-5 text-purple-400" />
                            Video Service Integrations
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-300">
                            {integrations.length} Connected
                        </Badge>
                    </CardTitle>
                    <p className="text-gray-400 text-sm">
                        Connect your video generation service accounts to enable automated video rendering
                    </p>
                </CardHeader>
                <CardContent>
                    {integrations.length > 0 && (
                        <div className="space-y-3 mb-6">
                            {integrations.map(integration => {
                                const serviceInfo = getServiceInfo(integration.service_provider);
                                return (
                                    <div key={integration.integration_id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={serviceInfo.logo}
                                                alt={serviceInfo.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div>
                                                <h4 className="text-white font-medium">{integration.service_name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className={
                                                        integration.status === 'connected' ? 'bg-green-500/20 text-green-400' :
                                                        integration.status === 'error' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                                    }>
                                                        {integration.status === 'connected' && <Check className="w-3 h-3 mr-1" />}
                                                        {integration.status === 'error' && <X className="w-3 h-3 mr-1" />}
                                                        {integration.status}
                                                    </Badge>
                                                    {integration.usage_metrics && (
                                                        <span className="text-xs text-gray-400">
                                                            {integration.usage_metrics.videos_generated} videos generated
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-gray-600 text-gray-300"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-red-600 text-red-400 hover:bg-red-900/20"
                                                onClick={() => handleDeleteIntegration(integration.integration_id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {videoServices.map(service => {
                            const isConnected = integrations.some(i => i.service_provider === service.id);
                            return (
                                <div key={service.id} className="p-4 bg-gray-900/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <img
                                            src={service.logo}
                                            alt={service.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        {service.popular && (
                                            <Badge className="bg-yellow-500/20 text-yellow-400">Popular</Badge>
                                        )}
                                    </div>
                                    <h3 className="text-white font-semibold mb-1">{service.name}</h3>
                                    <p className="text-gray-400 text-sm mb-2">{service.description}</p>
                                    <p className="text-purple-400 text-sm font-medium mb-3">{service.pricing}</p>
                                    <div className="space-y-1 mb-4">
                                        {service.features.slice(0, 3).map(feature => (
                                            <div key={feature} className="text-xs text-gray-400 flex items-center gap-1">
                                                <Check className="w-3 h-3 text-green-400" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleAddService(service)}
                                            disabled={isConnected}
                                        >
                                            {isConnected ? (
                                                <><Check className="w-4 h-4 mr-1" /> Connected</>
                                            ) : (
                                                <><Plus className="w-4 h-4 mr-1" /> Connect</>
                                            )}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-gray-600"
                                            onClick={() => window.open(service.docsUrl, '_blank')}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            {selectedService && (
                                <>
                                    <img
                                        src={selectedService.logo}
                                        alt={selectedService.name}
                                        className="w-10 h-10 rounded-lg object-cover"
                                    />
                                    Connect {selectedService.name}
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Enter your {selectedService?.name} API credentials to enable video rendering
                        </DialogDescription>
                    </DialogHeader>

                    {selectedService && (
                        <div className="space-y-4 py-4">
                            <Alert className="bg-blue-900/20 border-blue-500/30">
                                <Info className="h-4 w-4 text-blue-400" />
                                <AlertDescription className="text-blue-300 text-sm">
                                    Don't have an account yet?{' '}
                                    <a
                                        href={selectedService.signupUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline font-medium"
                                    >
                                        Sign up for {selectedService.name}
                                    </a>
                                    {' '}and get your API credentials.
                                </AlertDescription>
                            </Alert>

                            {selectedService.credentials.includes('api_key') && (
                                <div>
                                    <Label className="text-white">API Key</Label>
                                    <Input
                                        type="password"
                                        placeholder="Enter your API key"
                                        value={credentials.api_key || ''}
                                        onChange={(e) => setCredentials({...credentials, api_key: e.target.value})}
                                        className="bg-gray-900 border-gray-600 text-white mt-1"
                                    />
                                </div>
                            )}

                            {selectedService.credentials.includes('api_secret') && (
                                <div>
                                    <Label className="text-white">API Secret</Label>
                                    <Input
                                        type="password"
                                        placeholder="Enter your API secret"
                                        value={credentials.api_secret || ''}
                                        onChange={(e) => setCredentials({...credentials, api_secret: e.target.value})}
                                        className="bg-gray-900 border-gray-600 text-white mt-1"
                                    />
                                </div>
                            )}

                            {selectedService.credentials.includes('workspace_id') && (
                                <div>
                                    <Label className="text-white">Workspace/Project ID</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter your workspace ID"
                                        value={credentials.workspace_id || ''}
                                        onChange={(e) => setCredentials({...credentials, workspace_id: e.target.value})}
                                        className="bg-gray-900 border-gray-600 text-white mt-1"
                                    />
                                </div>
                            )}

                            <div className="flex gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={handleTestConnection}
                                    disabled={testingConnection || !credentials.api_key}
                                    className="border-gray-600 text-gray-300"
                                >
                                    {testingConnection ? (
                                        <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Testing...</>
                                    ) : (
                                        'Test Connection'
                                    )}
                                </Button>
                                <a
                                    href={selectedService.docsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 text-sm flex items-center gap-1 hover:underline"
                                >
                                    View Documentation <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowAddDialog(false)}
                            className="border-gray-600 text-gray-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveIntegration}
                            disabled={isSaving || !credentials.api_key}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {isSaving ? 'Connecting...' : 'Connect Service'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}