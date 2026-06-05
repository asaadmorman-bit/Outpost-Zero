
import React, { useState, useEffect } from 'react';
import { SDKInstallation, CustomSDK } from '@/entities/all';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Settings,
    Trash2,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Activity,
    Zap,
    TrendingUp,
    ExternalLink
} from 'lucide-react';

export default function MySDKsPage() {
    const [installations, setInstallations] = useState([]);
    const [sdks, setSDKs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [installData, sdkData] = await Promise.all([
                SDKInstallation.list(),
                CustomSDK.list()
            ]);

            setInstallations(installData);
            setSDKs(sdkData);
        } catch (error) {
            console.error('Error loading SDK installations:', error);
        }
        setIsLoading(false);
    };

    const getSDKDetails = (sdkId) => {
        return sdks.find(sdk => sdk.sdk_id === sdkId);
    };

    const statusColors = {
        active: 'bg-green-500/20 text-green-400',
        disabled: 'bg-gray-500/20 text-gray-400',
        error: 'bg-red-500/20 text-red-400',
        updating: 'bg-blue-500/20 text-blue-400',
        pending_configuration: 'bg-yellow-500/20 text-yellow-400'
    };

    const healthColors = {
        healthy: 'bg-green-500/20 text-green-400',
        degraded: 'bg-yellow-500/20 text-yellow-400',
        unhealthy: 'bg-red-500/20 text-red-400'
    };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">My SDK Installations</h1>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="text-white text-xl">Loading your SDKs...</div>
                    </div>
                ) : installations.length === 0 ? (
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="text-center py-12">
                            <Activity className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-300 text-lg mb-2">No SDKs installed yet</p>
                            <p className="text-gray-400 mb-6">Browse the SDK Marketplace to extend Outpost Zero</p>
                            <Button
                                onClick={() => window.location.href = createPageUrl('/sdk-marketplace')}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Browse SDK Marketplace
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {installations.map(installation => {
                            const sdk = getSDKDetails(installation.sdk_id);
                            if (!sdk) return null;

                            return (
                                <Card key={installation.installation_id} className="border-gray-700 bg-gray-800/50">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-white">{sdk.sdk_name}</CardTitle>
                                            <Badge className={statusColors[installation.status]}>
                                                {installation.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {installation.performance_metrics && (
                                            <>
                                                <div>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-gray-400">Health Status</span>
                                                        <Badge className={healthColors[installation.performance_metrics.health_status || 'healthy']}>
                                                            {installation.performance_metrics.health_status || 'healthy'}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-400">Requests Today</span>
                                                        <span className="text-white">
                                                            {installation.performance_metrics.requests_per_day?.toLocaleString() || 0}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-400">Avg Response Time</span>
                                                        <span className="text-white">
                                                            {installation.performance_metrics.average_response_time_ms || 0}ms
                                                        </span>
                                                    </div>
                                                    {installation.performance_metrics.error_rate !== undefined && (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-400">Error Rate</span>
                                                            <span className="text-white">
                                                                {installation.performance_metrics.error_rate.toFixed(2)}%
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        <div className="flex gap-2 pt-4 border-t border-gray-700/50">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 border-gray-600 text-gray-300"
                                            >
                                                <Settings className="w-4 h-4 mr-2" />
                                                Configure
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 border-gray-600 text-gray-300"
                                            >
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Update
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
