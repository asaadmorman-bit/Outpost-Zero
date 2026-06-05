import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SystemPerformance } from '@/entities/all';
import { Activity, Server, Cpu, HardDrive, Wifi } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockPerformance = [
    { timestamp: new Date(Date.now() - 5 * 60000).toISOString(), cpu_utilization: 30, memory_utilization: 45 },
    { timestamp: new Date(Date.now() - 4 * 60000).toISOString(), cpu_utilization: 35, memory_utilization: 48 },
    { timestamp: new Date(Date.now() - 3 * 60000).toISOString(), cpu_utilization: 40, memory_utilization: 50 },
    { timestamp: new Date(Date.now() - 2 * 60000).toISOString(), cpu_utilization: 38, memory_utilization: 52 },
    { timestamp: new Date(Date.now() - 1 * 60000).toISOString(), cpu_utilization: 42, memory_utilization: 55 },
];

export default function ObservabilityPage() {
    const [performance, setPerformance] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await SystemPerformance.list();
            setPerformance(data.length > 0 ? data : mockPerformance);
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Activity className="w-8 h-8 text-red-400" /> Observability & System Performance
                </h1>
                
                <Card className="border-gray-700 bg-gray-800/50">
                    <CardHeader>
                        <CardTitle className="text-white">Real-Time System Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performance}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis 
                                    dataKey="timestamp" 
                                    stroke="#9ca3af" 
                                    fontSize={12} 
                                    tickFormatter={(str) => new Date(str).toLocaleTimeString()}
                                />
                                <YAxis stroke="#9ca3af" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                <Line type="monotone" dataKey="cpu_utilization" stroke="#8884d8" name="CPU %" />
                                <Line type="monotone" dataKey="memory_utilization" stroke="#82ca9d" name="Memory %" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}