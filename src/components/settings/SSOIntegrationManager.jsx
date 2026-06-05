
import React, { useState, useEffect } from 'react';
import { SSOIntegration } from '@/entities/SSOIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
    Plus, 
    Settings,
    CheckCircle, 
    XCircle, 
    AlertTriangle,
    Shield,
    Users,
    Key,
    ExternalLink,
    Copy,
    Download
} from 'lucide-react';

export default function SSOIntegrationManager() {
    const [integrations, setIntegrations] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedIntegration, setSelectedIntegration] = useState(null);
    const [newIntegration, setNewIntegration] = useState({
        provider_type: 'okta',
        provider_name: '',
        configuration: {},
        user_provisioning: {
            enabled: false,
            auto_create_users: true,
            default_role: 'user'
        },
        security_settings: {
            require_signed_assertions: true,
            session_timeout_minutes: 480
        }
    });

    useEffect(() => {
        loadIntegrations();
    }, []);

    const loadIntegrations = async () => {
        try {
            const data = await SSOIntegration.list();
            setIntegrations(data.length > 0 ? data : mockIntegrations);
        } catch (error) {
            console.error('Error loading SSO integrations:', error);
            setIntegrations(mockIntegrations);
        }
    };

    const mockIntegrations = [
        {
            integration_id: 'okta_prod',
            provider_type: 'okta',
            provider_name: 'Okta Production',
            status: 'active',
            configuration: {
                okta_domain: 'cyberdojo.okta.com',
                entity_id: 'http://www.okta.com/exk1fcia6d6EMsAKS0h7',
                sso_url: 'https://cyberdojo.okta.com/app/outpostzero/exk1fcia6d6EMsAKS0h7/sso/saml'
            },
            sync_stats: { users_synced: 1247, groups_synced: 23 }
        },
        {
            integration_id: 'sf_sales',
            provider_type: 'salesforce',
            provider_name: 'Salesforce Sales Org',
            status: 'active',
            configuration: {
                salesforce_domain: 'cyberdojo.lightning.force.com',
                entity_id: 'https://cyberdojo.lightning.force.com',
                client_id: 'REDACTED'
            },
            sync_stats: { users_synced: 89, groups_synced: 5 }
        }
    ];

    const handleSaveIntegration = async () => {
        try {
            const integration = {
                ...newIntegration,
                integration_id: `${newIntegration.provider_type}_${Date.now()}`,
                status: 'pending'
            };
            
            alert(`🔧 SSO INTEGRATION CREATED\n\nProvider: ${integration.provider_type.toUpperCase()}\nName: ${integration.provider_name}\n\nIn production, this would:\n• Create SSO integration configuration\n• Generate SAML metadata\n• Set up attribute mappings\n• Configure user provisioning\n• Send test authentication request`);
            
            setIntegrations(prev => [...prev, integration]);
            setShowAddForm(false);
            setNewIntegration({
                provider_type: 'okta',
                provider_name: '',
                configuration: {},
                user_provisioning: { enabled: false, auto_create_users: true, default_role: 'user' },
                security_settings: { require_signed_assertions: true, session_timeout_minutes: 480 }
            });
        } catch (error) {
            console.error('Error saving integration:', error);
        }
    };

    const testConnection = (integration) => {
        alert(`🔍 TESTING SSO CONNECTION\n\nProvider: ${integration.provider_name}\nStatus: ${integration.status}\n\nIn production, this would:\n• Validate SAML metadata\n• Test authentication flow\n• Verify attribute mappings\n• Check certificate validity\n• Confirm user provisioning`);
    };

    const downloadMetadata = () => {
        const metadata = `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" 
    entityID="https://platform.app/saml/metadata">
  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:AssertionConsumerService 
        Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" 
        Location="https://platform.app/saml/acs" index="0"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>`;
        
        const blob = new Blob([metadata], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'platform-saml-metadata.xml';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
            case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
            default: return <XCircle className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    if (showAddForm) {
        return (
            <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                        <span>Add SSO Integration</span>
                        <Button variant="outline" onClick={() => setShowAddForm(false)}>
                            Cancel
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="basic">Basic</TabsTrigger>
                            <TabsTrigger value="saml">SAML</TabsTrigger>
                            <TabsTrigger value="provisioning">Provisioning</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="basic" className="space-y-4 mt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-white">Provider Type</Label>
                                    <select 
                                        className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white"
                                        value={newIntegration.provider_type}
                                        onChange={(e) => setNewIntegration({...newIntegration, provider_type: e.target.value})}
                                    >
                                        <option value="okta">Okta</option>
                                        <option value="salesforce">Salesforce</option>
                                        <option value="custom_saml">Custom SAML 2.0</option>
                                        <option value="azure_ad">Azure AD</option>
                                        <option value="google">Google Workspace</option>
                                        <option value="ping_identity">Ping Identity</option>
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-white">Integration Name</Label>
                                    <Input 
                                        className="bg-gray-900 border-gray-700 text-white"
                                        placeholder="e.g., Okta Production"
                                        value={newIntegration.provider_name}
                                        onChange={(e) => setNewIntegration({...newIntegration, provider_name: e.target.value})}
                                    />
                                </div>
                            </div>

                            {newIntegration.provider_type === 'okta' && (
                                <div>
                                    <Label className="text-white">Okta Domain</Label>
                                    <Input 
                                        className="bg-gray-900 border-gray-700 text-white"
                                        placeholder="company.okta.com"
                                        value={newIntegration.configuration.okta_domain || ''}
                                        onChange={(e) => setNewIntegration({
                                            ...newIntegration, 
                                            configuration: {...newIntegration.configuration, okta_domain: e.target.value}
                                        })}
                                    />
                                </div>
                            )}

                            {newIntegration.provider_type === 'salesforce' && (
                                <div>
                                    <Label className="text-white">Salesforce Domain</Label>
                                    <Input 
                                        className="bg-gray-900 border-gray-700 text-white"
                                        placeholder="company.lightning.force.com"
                                        value={newIntegration.configuration.salesforce_domain || ''}
                                        onChange={(e) => setNewIntegration({
                                            ...newIntegration, 
                                            configuration: {...newIntegration.configuration, salesforce_domain: e.target.value}
                                        })}
                                    />
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="saml" className="space-y-4 mt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-white">Entity ID</Label>
                                    <Input 
                                        className="bg-gray-900 border-gray-700 text-white"
                                        placeholder="https://provider.com/entity"
                                        value={newIntegration.configuration.entity_id || ''}
                                        onChange={(e) => setNewIntegration({
                                            ...newIntegration, 
                                            configuration: {...newIntegration.configuration, entity_id: e.target.value}
                                        })}
                                    />
                                </div>
                                <div>
                                    <Label className="text-white">SSO URL</Label>
                                    <Input 
                                        className="bg-gray-900 border-gray-700 text-white"
                                        placeholder="https://provider.com/sso"
                                        value={newIntegration.configuration.sso_url || ''}
                                        onChange={(e) => setNewIntegration({
                                            ...newIntegration, 
                                            configuration: {...newIntegration.configuration, sso_url: e.target.value}
                                        })}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <Label className="text-white">X.509 Certificate</Label>
                                <Textarea 
                                    className="bg-gray-900 border-gray-700 text-white h-32"
                                    placeholder="-----BEGIN CERTIFICATE-----"
                                    value={newIntegration.configuration.certificate || ''}
                                    onChange={(e) => setNewIntegration({
                                        ...newIntegration, 
                                        configuration: {...newIntegration.configuration, certificate: e.target.value}
                                    })}
                                />
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                <h4 className="text-blue-300 font-medium mb-2">Platform SAML Metadata</h4>
                                <p className="text-blue-200 text-sm mb-3">
                                    Use this metadata file to configure the platform as a Service Provider in your IdP:
                                </p>
                                <div className="flex gap-2">
                                    <Button 
                                        onClick={downloadMetadata}
                                        className="bg-blue-600 hover:bg-blue-700"
                                        size="sm"
                                    >
                                        <Download className="w-4 h-4 mr-1" />
                                        Download Metadata
                                    </Button>
                                    <Button 
                                        onClick={() => navigator.clipboard.writeText('https://platform.app/saml/metadata')}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Copy className="w-4 h-4 mr-1" />
                                        Copy URL
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="provisioning" className="space-y-4 mt-6">
                            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                                <div>
                                    <h4 className="text-white font-medium">Enable User Provisioning</h4>
                                    <p className="text-gray-400 text-sm">Automatically create and update user accounts</p>
                                </div>
                                <Switch 
                                    checked={newIntegration.user_provisioning.enabled}
                                    onCheckedChange={(checked) => setNewIntegration({
                                        ...newIntegration,
                                        user_provisioning: {...newIntegration.user_provisioning, enabled: checked}
                                    })}
                                />
                            </div>

                            {newIntegration.user_provisioning.enabled && (
                                <>
                                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                                        <div>
                                            <h4 className="text-white font-medium">Auto-Create Users</h4>
                                            <p className="text-gray-400 text-sm">Create new users on first login</p>
                                        </div>
                                        <Switch 
                                            checked={newIntegration.user_provisioning.auto_create_users}
                                            onCheckedChange={(checked) => setNewIntegration({
                                                ...newIntegration,
                                                user_provisioning: {...newIntegration.user_provisioning, auto_create_users: checked}
                                            })}
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label className="text-white">Default Role for New Users</Label>
                                        <select 
                                            className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-white"
                                            value={newIntegration.user_provisioning.default_role}
                                            onChange={(e) => setNewIntegration({
                                                ...newIntegration,
                                                user_provisioning: {...newIntegration.user_provisioning, default_role: e.target.value}
                                            })}
                                        >
                                            <option value="user">User</option>
                                            <option value="analyst">Security Analyst</option>
                                            <option value="admin">Administrator</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </TabsContent>

                        <TabsContent value="security" className="space-y-4 mt-6">
                            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                                <div>
                                    <h4 className="text-white font-medium">Require Signed Assertions</h4>
                                    <p className="text-gray-400 text-sm">Enhance security with digital signatures</p>
                                </div>
                                <Switch 
                                    checked={newIntegration.security_settings.require_signed_assertions}
                                    onCheckedChange={(checked) => setNewIntegration({
                                        ...newIntegration,
                                        security_settings: {...newIntegration.security_settings, require_signed_assertions: checked}
                                    })}
                                />
                            </div>

                            <div>
                                <Label className="text-white">Session Timeout (minutes)</Label>
                                <Input 
                                    type="number"
                                    className="bg-gray-900 border-gray-700 text-white"
                                    value={newIntegration.security_settings.session_timeout_minutes}
                                    onChange={(e) => setNewIntegration({
                                        ...newIntegration,
                                        security_settings: {...newIntegration.security_settings, session_timeout_minutes: parseInt(e.target.value)}
                                    })}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-700">
                        <Button variant="outline" onClick={() => setShowAddForm(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveIntegration} className="bg-blue-600 hover:bg-blue-700">
                            Create Integration
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            SSO Integrations
                        </div>
                        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Integration
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {integrations.map(integration => (
                            <div 
                                key={integration.integration_id} 
                                className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h3 className="text-white font-medium flex items-center gap-2">
                                                {integration.provider_name}
                                                {getStatusIcon(integration.status)}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {integration.provider_type}
                                                </Badge>
                                                <Badge variant="outline" className={`text-xs ${getStatusColor(integration.status)}`}>
                                                    {integration.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        {integration.sync_stats && (
                                            <div className="text-right text-sm text-gray-400 mr-4">
                                                <div>{integration.sync_stats.users_synced} users</div>
                                                <div>{integration.sync_stats.groups_synced} groups</div>
                                            </div>
                                        )}
                                        
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => testConnection(integration)}
                                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                        >
                                            Test Connection
                                        </Button>
                                        
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => setSelectedIntegration(integration)}
                                        >
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                
                                {integration.configuration && (
                                    <div className="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-400">
                                        {integration.configuration.okta_domain && (
                                            <div>Domain: {integration.configuration.okta_domain}</div>
                                        )}
                                        {integration.configuration.salesforce_domain && (
                                            <div>Domain: {integration.configuration.salesforce_domain}</div>
                                        )}
                                        {integration.configuration.entity_id && (
                                            <div>Entity ID: {integration.configuration.entity_id}</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {integrations.length === 0 && (
                            <div className="text-center py-8 text-gray-400">
                                <Shield className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                                <p>No SSO integrations configured</p>
                                <p className="text-sm mt-1">Click "Add Integration" to get started</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
