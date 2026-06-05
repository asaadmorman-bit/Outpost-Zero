
import React, { useState, useEffect } from 'react';
import { ComplianceControl, Incident, AuditTrail } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Heart, Shield, FileText, Users, Lock, Activity, UploadCloud } from 'lucide-react';

export default function HealthcareCompliancePage() {
    const [hipaaControls, setHipaaControls] = useState([]);
    const [hiTechControls, setHiTechControls] = useState([]);
    const [auditTrail, setAuditTrail] = useState([]);

    useEffect(() => {
        loadHealthcareData();
    }, []);

    const loadHealthcareData = async () => {
        // Mock HIPAA compliance data
        const mockHipaaControls = [
            { control_id: 'HIPAA-164.308', framework: 'HIPAA', name: 'Administrative Safeguards', status: 'compliant' },
            { control_id: 'HIPAA-164.310', framework: 'HIPAA', name: 'Physical Safeguards', status: 'compliant' },
            { control_id: 'HIPAA-164.312', framework: 'HIPAA', name: 'Technical Safeguards', status: 'partially-compliant' },
            { control_id: 'HIPAA-164.314', framework: 'HIPAA', name: 'Organizational Requirements', status: 'compliant' },
        ];

        const mockHiTechControls = [
            { control_id: 'HITECH-13401', framework: 'HITECH', name: 'Breach Notification', status: 'compliant' },
            { control_id: 'HITECH-13402', framework: 'HITECH', name: 'Enhanced Penalties', status: 'compliant' },
            { control_id: 'HITECH-13404', framework: 'HITECH', name: 'Business Associate Agreements', status: 'compliant' },
        ];

        // Mock audit trail data (if needed later)
        const mockAuditTrail = [
            // ...
        ];

        setHipaaControls(mockHipaaControls);
        setHiTechControls(mockHiTechControls);
        setAuditTrail(mockAuditTrail);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'compliant': return "bg-green-500/20 text-green-400";
            case 'non-compliant': return "bg-red-500/20 text-red-400";
            case 'partially-compliant': return "bg-yellow-500/20 text-yellow-400";
            default: return "bg-gray-500/20 text-gray-400";
        }
    };

    const hipaaCompliance = Math.round((hipaaControls.filter(c => c.status === 'compliant').length / hipaaControls.length) * 100) || 0;
    const hitechCompliance = Math.round((hiTechControls.filter(c => c.status === 'compliant').length / hiTechControls.length) * 100) || 0;

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/3abd0f5ee_Screenshot2025-07-24112158.jpg" alt="RevSentinel Healthcare Logo" className="h-12 object-contain" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">Healthcare Compliance Dashboard</h1>
                        <p className="text-gray-300">HIPAA, HITECH, and healthcare-specific security controls</p>
                        <p className="text-sm text-blue-400">Powered by Cyber Dojo Solutions, LLC</p>
                    </div>
                </div>

                {/* Compliance Overview */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Heart className="text-red-400" />
                                HIPAA Compliance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress value={hipaaCompliance} className="w-full bg-red-900/50 [&>*]:bg-red-500 mb-2" />
                            <p className="text-center text-xl font-bold text-red-300">{hipaaCompliance}% Compliant</p>
                            <p className="text-center text-sm text-gray-400">Health Insurance Portability & Accountability</p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Shield className="text-blue-400" />
                                HITECH Act
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress value={hitechCompliance} className="w-full bg-blue-900/50 [&>*]:bg-blue-500 mb-2" />
                            <p className="text-center text-xl font-bold text-blue-300">{hitechCompliance}% Compliant</p>
                            <p className="text-center text-sm text-gray-400">Health Information Technology</p>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Lock className="text-green-400" />
                                PHI Protection
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Encryption</span>
                                    <Badge className="bg-green-500/20 text-green-400">AES-256</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Access Controls</span>
                                    <Badge className="bg-green-500/20 text-green-400">RBAC Enabled</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Audit Logging</span>
                                    <Badge className="bg-green-500/20 text-green-400">Real-time</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Healthcare-Specific Features */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-400" />
                                Business Associate Agreement (BAA)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <h4 className="text-green-400 font-semibold mb-2">✓ BAA Status: Active</h4>
                                <p className="text-gray-300 text-sm">
                                    Cyber Dojo Solutions, LLC has executed a Business Associate Agreement 
                                    covering all PHI processing activities.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Agreement Date</span>
                                    <span className="text-white">January 1, 2024</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Next Review</span>
                                    <span className="text-white">January 1, 2025</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Covered Services</span>
                                    <span className="text-white">All RevSentinel Features</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-cyan-400" />
                                Minimum Necessary Access
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-300 text-sm">
                                Access to PHI is limited to the minimum necessary for authorized purposes.
                            </p>
                            <div className="space-y-3">
                                <div className="p-3 bg-gray-900/50 rounded border-l-4 border-cyan-400">
                                    <h5 className="text-white font-medium">Healthcare Administrators</h5>
                                    <p className="text-gray-400 text-sm">Full access to patient security events</p>
                                </div>
                                <div className="p-3 bg-gray-900/50 rounded border-l-4 border-yellow-400">
                                    <h5 className="text-white font-medium">Security Analysts</h5>
                                    <p className="text-gray-400 text-sm">De-identified data for threat analysis</p>
                                </div>
                                <div className="p-3 bg-gray-900/50 rounded border-l-4 border-green-400">
                                    <h5 className="text-white font-medium">IT Support</h5>
                                    <p className="text-gray-400 text-sm">System logs without PHI access</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Healthcare Security Events */}
                <Card className="border-gray-700 bg-gray-800/50 mb-8">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-orange-400" />
                            Healthcare Security Monitoring
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-blue-400 font-semibold">PHI Access Audit</h4>
                                        <p className="text-gray-300 text-sm">Automated daily audit of PHI access patterns</p>
                                    </div>
                                    <Badge className="bg-green-500/20 text-green-400">Compliant</Badge>
                                </div>
                            </div>
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-yellow-400 font-semibold">Unusual Access Pattern Detected</h4>
                                        <p className="text-gray-300 text-sm">Dr. Smith accessed 15+ patient records in 1 hour</p>
                                    </div>
                                    <Badge className="bg-yellow-500/20 text-yellow-400">Under Review</Badge>
                                </div>
                            </div>
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-green-400 font-semibold">Breach Prevention</h4>
                                        <p className="text-gray-300 text-sm">Blocked unauthorized external PHI transfer attempt</p>
                                    </div>
                                    <Badge className="bg-green-500/20 text-green-400">Prevented</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Compliance Controls */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Heart className="text-red-400" />
                                HIPAA Controls Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b-gray-700">
                                        <TableHead className="text-gray-400">Control ID</TableHead>
                                        <TableHead className="text-gray-400">Control Name</TableHead>
                                        <TableHead className="text-gray-400">Status</TableHead>
                                        <TableHead className="text-gray-400">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {hipaaControls.map(control => (
                                        <TableRow key={control.control_id} className="border-b-gray-800">
                                            <TableCell className="text-gray-300">{control.control_id}</TableCell>
                                            <TableCell className="text-gray-300">{control.name}</TableCell>
                                            <TableCell><Badge variant="outline" className={getStatusColor(control.status)}>{control.status.charAt(0).toUpperCase() + control.status.slice(1).replace('-', ' ')}</Badge></TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-gray-700"><UploadCloud className="w-4 h-4 mr-2" /> Upload Evidence</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Shield className="text-blue-400" />
                                HITECH Controls Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b-gray-700">
                                        <TableHead className="text-gray-400">Control ID</TableHead>
                                        <TableHead className="text-gray-400">Control Name</TableHead>
                                        <TableHead className="text-gray-400">Status</TableHead>
                                        <TableHead className="text-gray-400">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {hiTechControls.map(control => (
                                        <TableRow key={control.control_id} className="border-b-gray-800">
                                            <TableCell className="text-gray-300">{control.control_id}</TableCell>
                                            <TableCell className="text-gray-300">{control.name}</TableCell>
                                            <TableCell><Badge variant="outline" className={getStatusColor(control.status)}>{control.status.charAt(0).toUpperCase() + control.status.slice(1).replace('-', ' ')}</Badge></TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-gray-700"><UploadCloud className="w-4 h-4 mr-2" /> Upload Evidence</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
