import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
    Settings, 
    CheckCircle, 
    AlertTriangle, 
    Shield,
    Smartphone,
    Cloud,
    Users,
    Zap
} from 'lucide-react';

export default function MDMIntegrationPanel() {
    const [activeTab, setActiveTab] = useState('overview');
    const [integrationSettings, setIntegrationSettings] = useState({
        autoEnrollment: true,
        policyEnforcement: true,
        threatResponse: false,
        complianceReporting: true
    });

    const mdmProviders = [
        {
            name: 'Microsoft Intune',
            id: 'microsoft_intune',
            status: 'connected',
            devices: 1247,
            features: ['App Protection', 'Conditional Access', 'Compliance Policies', 'Remote Actions'],
            securityCenter: 'Microsoft Defender for Endpoint'
        },
        {
            name: 'Jamf Pro',
            id: 'jamf',
            status: 'connected', 
            devices: 89,
            features: ['Device Enrollment', 'App Management', 'Security Framework', 'User Experience'],
            securityCenter: 'Apple Business Manager'
        },
        {
            name: 'VMware Workspace ONE',
            id: 'vmware_workspace_one',
            status: 'available',
            devices: 0,
            features: ['Unified Endpoint Management', 'Digital Workspace', 'Intelligence Analytics'],
            securityCenter: 'Carbon Black Cloud'
        },
        {
            name: 'Google Workspace',
            id: 'google_workspace',
            status: 'available',
            devices: 0, 
            features: ['Android Management', 'Chrome OS Management', 'Security Center'],
            securityCenter: 'Google Security Command Center'
        }
    ];

    const handleConnect = (providerId) => {
        alert(`🔧 CONNECTING TO MDM\n\nProvider: ${providerId.toUpperCase()}\n\nIn production, this would:\n• Launch OAuth2 authentication flow\n• Configure API endpoints and credentials\n• Sync existing device inventory\n• Apply security policies\n• Enable real-time monitoring\n• Integrate with security centers`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'connected': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    return (
        <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    MDM & Security Center Integration
                    <Badge className="bg-blue-500/20 text-blue-400 text-xs ml-auto">SMB & Enterprise</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="providers">Providers</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <h4 className="font-medium text-white">Connected MDM Solutions</h4>
                                {mdmProviders.filter(p => p.status === 'connected').map(provider => (
                                    <div key={provider.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="font-medium text-white">{provider.name}</h5>
                                            <Badge variant="outline" className={getStatusColor(provider.status)}>
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Connected
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-gray-400 space-y-1">
                                            <p>📱 {provider.devices.toLocaleString()} managed devices</p>
                                            <p>🛡️ {provider.securityCenter}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-medium text-white">Security Center Benefits</h4>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 bg-blue-900/20 rounded-lg">
                                        <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-white">Real-time Threat Detection</p>
                                            <p className="text-xs text-gray-400">Advanced AI-powered threat detection across all managed devices</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-green-900/20 rounded-lg">
                                        <Zap className="w-5 h-5 text-green-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-white">Automated Response</p>
                                            <p className="text-xs text-gray-400">Instant quarantine and remediation of compromised devices</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-purple-900/20 rounded-lg">
                                        <Users className="w-5 h-5 text-purple-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-white">Zero Trust Access</p>
                                            <p className="text-xs text-gray-400">Device compliance-based conditional access policies</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="providers" className="mt-6">
                        <div className="grid gap-4">
                            {mdmProviders.map(provider => (
                                <Card key={provider.id} className="border-gray-700 bg-gray-900/30">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-600/20 rounded-lg">
                                                    <Cloud className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-white">{provider.name}</h4>
                                                    <p className="text-sm text-gray-400">{provider.securityCenter}</p>
                                                </div>
                                            </div>
                                            {provider.status === 'connected' ? (
                                                <Badge variant="outline" className={getStatusColor(provider.status)}>
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Connected
                                                </Badge>
                                            ) : (
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => handleConnect(provider.id)}
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Connect
                                                </Button>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-400">
                                                {provider.devices > 0 ? `Managing ${provider.devices.toLocaleString()} devices` : 'Ready to connect'}
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {provider.features.map(feature => (
                                                    <Badge key={feature} variant="outline" className="text-xs">
                                                        {feature}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-6">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="font-medium text-white">Integration Settings</h4>
                                <div className="grid gap-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                                        <div>
                                            <h5 className="font-medium text-white">Auto-Enrollment</h5>
                                            <p className="text-sm text-gray-400">Automatically enroll new devices in MDM</p>
                                        </div>
                                        <Switch 
                                            checked={integrationSettings.autoEnrollment}
                                            onCheckedChange={(checked) => 
                                                setIntegrationSettings({...integrationSettings, autoEnrollment: checked})
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                                        <div>
                                            <h5 className="font-medium text-white">Policy Enforcement</h5>
                                            <p className="text-sm text-gray-400">Enforce security policies on all devices</p>
                                        </div>
                                        <Switch 
                                            checked={integrationSettings.policyEnforcement}
                                            onCheckedChange={(checked) => 
                                                setIntegrationSettings({...integrationSettings, policyEnforcement: checked})
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                                        <div>
                                            <h5 className="font-medium text-white">Automated Threat Response</h5>
                                            <p className="text-sm text-gray-400">Automatically respond to security threats</p>
                                        </div>
                                        <Switch 
                                            checked={integrationSettings.threatResponse}
                                            onCheckedChange={(checked) => 
                                                setIntegrationSettings({...integrationSettings, threatResponse: checked})
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                                        <div>
                                            <h5 className="font-medium text-white">Compliance Reporting</h5>
                                            <p className="text-sm text-gray-400">Generate compliance reports for audits</p>
                                        </div>
                                        <Switch 
                                            checked={integrationSettings.complianceReporting}
                                            onCheckedChange={(checked) => 
                                                setIntegrationSettings({...integrationSettings, complianceReporting: checked})
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}