import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudAsset, ComplianceControl } from '@/entities/all';
import { Cloud, Shield, CheckCircle, AlertTriangle, GitBranch, Server } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CloudProviderIcon = ({ provider }) => {
    const icons = {
        aws: 'https://img.icons8.com/color/48/amazon-web-services.png',
        azure: 'https://img.icons8.com/color/48/azure-1.png',
        gcp: 'https://img.icons8.com/color/48/google-cloud.png'
    };
    return <img src={icons[provider]} alt={provider} className="w-8 h-8"/>;
};

export default function CloudSecurityPage() {
    const [assets, setAssets] = useState([]);
    const [compliance, setCompliance] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const assetData = await CloudAsset.list();
            const complianceData = await ComplianceControl.list();
            setAssets(assetData.length > 0 ? assetData : mockAssets);
            setCompliance(complianceData.length > 0 ? complianceData : mockCompliance);
        };
        fetchData();
    }, []);
    
    const mockAssets = [
        { asset_id: 'asset01', cloud_provider: 'aws', resource_type: 'vm', region: 'us-gov-west-1', security_findings: [{}, {}], risk_score: 78 },
        { asset_id: 'asset02', cloud_provider: 'azure', resource_type: 'database', region: 'us-gov-virginia', security_findings: [{}], risk_score: 45 },
        { asset_id: 'asset03', cloud_provider: 'gcp', resource_type: 'container', region: 'us-central1', security_findings: [{}, {}, {}], risk_score: 92 },
    ];
    
    const mockCompliance = [
        { framework: 'FedRAMP', status: 'compliant' }, { framework: 'FedRAMP', status: 'non-compliant' },
        { framework: 'DoD IL5/6', status: 'compliant' }, { framework: 'DoD IL5/6', status: 'compliant' },
    ];

    const complianceSummary = mockCompliance.reduce((acc, curr) => {
        if (!acc[curr.framework]) acc[curr.framework] = { compliant: 0, total: 0 };
        if (curr.status === 'compliant') acc[curr.framework].compliant++;
        acc[curr.framework].total++;
        return acc;
    }, {});

    const complianceChartData = Object.entries(complianceSummary).map(([name, data]) => ({
        name,
        compliance: (data.compliant / data.total) * 100
    }));

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Cloud className="w-8 h-8 text-cyan-400" /> Multi-Cloud Security Posture
                </h1>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {Object.entries(complianceSummary).map(([framework, data]) => (
                        <Card key={framework} className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Shield className="text-purple-400" /> {framework} Compliance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-purple-300">
                                    {Math.round((data.compliant / data.total) * 100)}%
                                </div>
                                <p className="text-gray-400">{data.compliant} / {data.total} Controls Compliant</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                
                <Card className="border-gray-700 bg-gray-800/50 mb-8">
                    <CardHeader><CardTitle className="text-white">Cloud Asset Inventory</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            {assets.map(asset => (
                                <div key={asset.asset_id} className="p-4 bg-gray-900/40 rounded-lg border border-gray-700">
                                    <div className="flex justify-between items-start">
                                        <CloudProviderIcon provider={asset.cloud_provider} />
                                        <Badge variant={asset.risk_score > 75 ? 'destructive' : 'secondary'}>Risk: {asset.risk_score}</Badge>
                                    </div>
                                    <h4 className="font-semibold text-white mt-2">{asset.resource_type.toUpperCase()}</h4>
                                    <p className="text-sm text-gray-400">{asset.region}</p>
                                    <p className="text-xs text-red-400 mt-1">{asset.security_findings.length} findings</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}