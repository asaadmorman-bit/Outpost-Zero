import React, { useState, useEffect } from 'react';
import { QuantumReadiness } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Shield, CheckCircle, Clock, Cpu, GitBranch, ArrowRight, Download, PlayCircle } from 'lucide-react';

const mockQuantumReadiness = [
    { assessment_id: 'qr_001', system_component: 'VPN Gateway', current_encryption: 'RSA-2048', quantum_vulnerable: true, recommended_algorithm: 'Kyber', migration_complexity: 'high', business_impact: 'critical', priority_score: 95 },
    { assessment_id: 'qr_002', system_component: 'Database TDE', current_encryption: 'AES-256', quantum_vulnerable: true, recommended_algorithm: 'FrodoKEM', migration_complexity: 'critical', business_impact: 'critical', priority_score: 92 },
    { assessment_id: 'qr_003', system_component: 'Code Signing', current_encryption: 'ECDSA P-256', quantum_vulnerable: true, recommended_algorithm: 'Dilithium', migration_complexity: 'medium', business_impact: 'high', priority_score: 88 },
    { assessment_id: 'qr_004', system_component: 'Internal TLS 1.3', current_encryption: 'AES-GCM', quantum_vulnerable: false, recommended_algorithm: 'N/A', migration_complexity: 'low', business_impact: 'low', priority_score: 10 },
];

const quantumTimelineData = [
    { year: 2024, qubits: 433, risk_level: 'Low' },
    { year: 2026, qubits: 1121, risk_level: 'Low' },
    { year: 2028, qubits: 4158, risk_level: 'Medium' },
    { year: 2030, qubits: 10000, risk_level: 'High' },
    { year: 2032, qubits: 50000, risk_level: 'Critical' },
    { year: 2035, qubits: 200000, risk_level: 'Critical' },
];

export default function QuantumSafeSecurityPage() {
    const [readinessData, setReadinessData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await QuantumReadiness.list();
            setReadinessData(data.length > 0 ? data : mockQuantumReadiness);
        } catch (e) {
            console.error(e);
            setReadinessData(mockQuantumReadiness);
        }
        setIsLoading(false);
    };

    const overallReadiness = readinessData.length > 0 ? 
        Math.round(readinessData.filter(r => !r.quantum_vulnerable).length / readinessData.length * 100) : 0;
    
    const getBadgeColor = (level) => {
        switch(level) {
            case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/50';
            case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
            case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
            default: return 'bg-green-500/20 text-green-300 border-green-500/50';
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Cpu className="w-10 h-10 text-cyan-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">Post-Quantum Readiness Center</h1>
                        <p className="text-gray-300">Assess and mitigate risks from quantum computing threats.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Shield className="text-green-400" /> Overall Readiness
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-bold text-green-400 mb-2">{overallReadiness}%</div>
                            <p className="text-sm text-gray-400 mb-4">Percentage of systems using quantum-resistant cryptography.</p>
                            <Progress value={overallReadiness} className="h-3" />
                        </CardContent>
                    </Card>
                     <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <AlertTriangle className="text-red-400" /> Vulnerable Systems
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-bold text-red-400">
                                {readinessData.filter(r => r.quantum_vulnerable).length}
                            </div>
                            <p className="text-sm text-gray-400 mt-2">Critical systems exposed to quantum threats.</p>
                        </CardContent>
                    </Card>
                     <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Clock className="text-yellow-400" /> Predicted Threat Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-bold text-yellow-400">
                                2030-2035
                            </div>
                            <p className="text-sm text-gray-400 mt-2">Estimated timeframe for cryptographically relevant quantum computers.</p>
                        </CardContent>
                    </Card>
                </div>
                
                <Card className="border-gray-700 bg-gray-800/50 mb-8">
                    <CardHeader>
                        <CardTitle className="text-white">Quantum Threat Evolution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={quantumTimelineData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="year" stroke="#9ca3af" />
                                <YAxis yAxisId="left" stroke="#8884d8" label={{ value: 'Qubits', angle: -90, position: 'insideLeft', fill: '#8884d8' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                <Line yAxisId="left" type="monotone" dataKey="qubits" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-gray-700 bg-gray-800/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white">Cryptographic Inventory & Migration Plan</CardTitle>
                        <Button>
                            <Download className="w-4 h-4 mr-2"/>
                            Export Migration Plan
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-gray-700 hover:bg-transparent">
                                    <TableHead className="text-white">System Component</TableHead>
                                    <TableHead className="text-white">Current Algorithm</TableHead>
                                    <TableHead className="text-white">Status</TableHead>
                                    <TableHead className="text-white">Recommended PQC</TableHead>
                                    <TableHead className="text-white">Priority</TableHead>
                                    <TableHead className="text-white">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={6} className="text-center text-gray-400">Loading inventory...</TableCell></TableRow>
                                ) : (
                                    readinessData.map(item => (
                                        <TableRow key={item.assessment_id} className="border-b-gray-800">
                                            <TableCell className="font-medium text-white">{item.system_component}</TableCell>
                                            <TableCell className="text-gray-300">{item.current_encryption}</TableCell>
                                            <TableCell>
                                                {item.quantum_vulnerable ? (
                                                    <Badge className="bg-red-500/20 text-red-300 border-red-500/50">Vulnerable</Badge>
                                                ) : (
                                                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50">Resistant</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-cyan-300">{item.recommended_algorithm}</TableCell>
                                            <TableCell>
                                                <Badge className={getBadgeColor(item.business_impact)}>{item.business_impact}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20">
                                                    <PlayCircle className="w-4 h-4 mr-2" />
                                                    Start Migration
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}