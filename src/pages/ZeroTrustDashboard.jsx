
import React, { useState, useEffect } from 'react';
import { ZeroTrustMetrics, User, EndpointData } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, UserCheck, Smartphone, Network, AlertTriangle, TrendingUp } from 'lucide-react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'; // Added import for Table components

const mockMetrics = [
    { id: '1', user_id: 'alex.g@example.com', device_id: 'workstation-01', trust_score: 92, device_trust_score: 95, user_trust_score: 90 },
    { id: '2', user_id: 'bob.r@example.com', device_id: 'laptop-12', trust_score: 65, device_trust_score: 70, user_trust_score: 60 },
    { id: '3', user_id: 'casey.d@example.com', device_id: 'mobile-ios-3', trust_score: 88, device_trust_score: 90, user_trust_score: 85 },
    { id: '4', user_id: 'drew.p@example.com', device_id: 'vm-dev-7', trust_score: 40, device_trust_score: 50, user_trust_score: 30 },
];

const TrustScoreGauge = ({ score }) => {
    const data = [{ name: 'Trust Score', value: score }];
    const color = score > 80 ? '#22c55e' : score > 60 ? '#f59e0b' : '#ef4444';

    return (
        <ResponsiveContainer width="100%" height={150}>
            <RadialBarChart
                innerRadius="80%"
                outerRadius="100%"
                barSize={15}
                data={data}
                startAngle={180}
                endAngle={0}
            >
                <RadialBar
                    minAngle={15}
                    background
                    clockWise
                    dataKey="value"
                    fill={color}
                    cornerRadius={10}
                />
                <text
                    x="50%"
                    y="70%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-3xl font-bold"
                >
                    {score}
                </text>
                 <text
                    x="50%"
                    y="90%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-gray-400 text-sm"
                >
                    Trust Score
                </text>
            </RadialBarChart>
        </ResponsiveContainer>
    );
};

const RiskyDevicesTable = ({ riskyDevices }) => {
    return (
        <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
                <CardTitle className="text-white">Risky Devices ({riskyDevices.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-b-gray-800">
                            <TableHead className="text-gray-400">User ID</TableHead>
                            <TableHead className="text-gray-400">Device ID</TableHead>
                            <TableHead className="text-gray-400">Trust Score</TableHead>
                            <TableHead className="text-gray-400">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {riskyDevices.map(metric => (
                            <TableRow key={metric.id} className="border-b-gray-800">
                                <TableCell className="text-gray-300">{metric.user_id}</TableCell>
                                <TableCell className="text-gray-300">{metric.device_id}</TableCell>
                                <TableCell><Badge variant="destructive">{metric.trust_score}</Badge></TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
                                        Investigate
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default function ZeroTrustDashboard() {
    const [metrics, setMetrics] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            // In a real app, fetch from ZeroTrustMetrics entity
            setMetrics(mockMetrics);
        };
        loadData();
    }, []);

    const overallScore = Math.round(metrics.reduce((acc, m) => acc + m.trust_score, 0) / metrics.length) || 0;
    const riskyDevices = metrics.filter(m => m.trust_score < 60);

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Zero Trust Dashboard</h1>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="md:col-span-1 border-gray-700 bg-gray-800/50">
                        <CardHeader><CardTitle className="text-white">Overall Trust Score</CardTitle></CardHeader>
                        <CardContent>
                            <TrustScoreGauge score={overallScore} />
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-2 border-gray-700 bg-gray-800/50">
                        <CardHeader><CardTitle className="text-white">Key Metrics</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <UserCheck className="mx-auto h-8 w-8 text-blue-400 mb-2"/>
                                <p className="text-2xl font-bold text-white">{metrics.length}</p>
                                <p className="text-sm text-gray-400">Verified Identities</p>
                            </div>
                            <div className="text-center">
                                <Smartphone className="mx-auto h-8 w-8 text-green-400 mb-2"/>
                                <p className="text-2xl font-bold text-white">{metrics.length}</p>
                                <p className="text-sm text-gray-400">Secure Devices</p>
                            </div>
                            <div className="text-center">
                                <Network className="mx-auto h-8 w-8 text-purple-400 mb-2"/>
                                <p className="text-2xl font-bold text-white">14</p>
                                <p className="text-sm text-gray-400">Micro-segments</p>
                            </div>
                             <div className="text-center">
                                <AlertTriangle className="mx-auto h-8 w-8 text-red-400 mb-2"/>
                                <p className="text-2xl font-bold text-white">{riskyDevices.length}</p>
                                <p className="text-sm text-gray-400">Risky Devices</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-8"> {/* Added a div to contain the new table and provide spacing */}
                    <RiskyDevicesTable riskyDevices={riskyDevices} />
                </div>

                <Card className="border-gray-700 bg-gray-800/50">
                    <CardHeader><CardTitle className="text-white">Device Trust Levels</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {metrics.map(metric => (
                                <div key={metric.id} className="flex items-center justify-between p-4 bg-gray-900/40 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-white">{metric.device_id}</p>
                                        <p className="text-sm text-gray-400">User: {metric.user_id}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge className={metric.trust_score > 80 ? 'bg-green-500/20 text-green-300' : metric.trust_score > 60 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}>
                                            Trust Score: {metric.trust_score}
                                        </Badge>
                                        <Button size="sm" variant="outline">View Details</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
