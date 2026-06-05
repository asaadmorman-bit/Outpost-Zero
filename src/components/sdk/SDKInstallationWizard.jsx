import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    CheckCircle,
    AlertCircle,
    Loader2,
    Copy,
    ExternalLink,
    Key,
    Settings
} from 'lucide-react';
import { SDKInstallation } from '@/entities/all';
import { toast } from 'sonner';

export default function SDKInstallationWizard({ sdk, onComplete, onCancel }) {
    const [step, setStep] = useState(1);
    const [config, setConfig] = useState({
        api_key: '',
        webhook_url: '',
        data_sources: [],
        auto_update: true
    });
    const [isInstalling, setIsInstalling] = useState(false);
    const [apiKey, setApiKey] = useState('');

    const generateAPIKey = () => {
        const key = `oz_sdk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        setApiKey(key);
        setConfig({ ...config, api_key: key });
    };

    const handleInstall = async () => {
        setIsInstalling(true);

        try {
            // Create SDK installation record
            const installation = await SDKInstallation.create({
                installation_id: `inst_${Date.now()}`,
                sdk_id: sdk.sdk_id,
                organization_id: 'current_org',
                installed_by: 'current_user@example.com',
                status: 'active',
                configuration: config,
                api_key: apiKey
            });

            // Notify the SDK developer portal
            try {
                await fetch('https://sdk-developers.cyberdojogroup.com/api/installations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sdk_id: sdk.sdk_id,
                        installation_id: installation.installation_id,
                        customer_org: 'current_org',
                        installed_at: new Date().toISOString()
                    })
                });
            } catch (notifyError) {
                console.log('Portal notification will be sent via webhook');
            }

            toast.success(`${sdk.sdk_name} installed successfully!`);
            onComplete(installation);
        } catch (error) {
            toast.error('Installation failed: ' + error.message);
        }

        setIsInstalling(false);
    };

    return (
        <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
                <CardTitle className="text-white">
                    Installing {sdk.sdk_name}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Step Progress */}
                <div className="flex items-center justify-between mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                step >= s ? 'bg-blue-600' : 'bg-gray-700'
                            }`}>
                                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                            </div>
                            {s < 3 && (
                                <div className={`flex-1 h-1 mx-2 ${
                                    step > s ? 'bg-blue-600' : 'bg-gray-700'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: API Key Generation */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Step 1: Generate API Key</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                This SDK requires an API key to communicate with Outpost Zero
                            </p>
                        </div>

                        {apiKey ? (
                            <Alert className="bg-gray-900/50 border-gray-700">
                                <Key className="h-4 w-4 text-blue-400" />
                                <AlertDescription className="text-white">
                                    <div className="flex items-center justify-between mt-2">
                                        <code className="text-sm bg-gray-800 px-3 py-1 rounded">{apiKey}</code>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                navigator.clipboard.writeText(apiKey);
                                                toast.success('API key copied!');
                                            }}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Save this key securely. You won't be able to see it again.
                                    </p>
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Button onClick={generateAPIKey} className="w-full">
                                <Key className="w-4 h-4 mr-2" />
                                Generate API Key
                            </Button>
                        )}

                        <div className="flex justify-end">
                            <Button
                                onClick={() => setStep(2)}
                                disabled={!apiKey}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Configuration */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Step 2: Configure SDK</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Set up SDK preferences and data sources
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="webhook_url" className="text-white">
                                Webhook URL (Optional)
                            </Label>
                            <Input
                                id="webhook_url"
                                value={config.webhook_url}
                                onChange={(e) => setConfig({ ...config, webhook_url: e.target.value })}
                                placeholder="https://your-endpoint.com/webhook"
                                className="mt-2 bg-gray-900 border-gray-600 text-white"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Receive real-time notifications from the SDK
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="auto_update"
                                checked={config.auto_update}
                                onChange={(e) => setConfig({ ...config, auto_update: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <Label htmlFor="auto_update" className="text-white">
                                Enable automatic updates
                            </Label>
                        </div>

                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep(1)}>
                                Back
                            </Button>
                            <Button
                                onClick={() => setStep(3)}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Confirm & Install */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Step 3: Review & Install</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Review your configuration and complete installation
                            </p>
                        </div>

                        <div className="bg-gray-900/50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-400">SDK:</span>
                                <span className="text-white">{sdk.sdk_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Version:</span>
                                <span className="text-white">{sdk.version}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Auto Updates:</span>
                                <Badge className={config.auto_update ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                                    {config.auto_update ? 'Enabled' : 'Disabled'}
                                </Badge>
                            </div>
                            {config.webhook_url && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Webhook:</span>
                                    <span className="text-white text-sm">{config.webhook_url}</span>
                                </div>
                            )}
                        </div>

                        <Alert className="bg-blue-900/20 border-blue-500/30">
                            <AlertCircle className="h-4 h-4 text-blue-400" />
                            <AlertDescription className="text-blue-300 text-sm">
                                After installation, you can configure data sources and permissions in the SDK settings.
                            </AlertDescription>
                        </Alert>

                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep(2)}>
                                Back
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={onCancel}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleInstall}
                                    disabled={isInstalling}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {isInstalling ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Installing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Install SDK
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}