import React, { useState, useEffect } from 'react';
import { DecentralizedIdentity } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Fingerprint, Check, Shield, FileText, PlusCircle, Link as LinkIcon } from 'lucide-react';

const mockIdentities = [
    { identity_id: 'did:sov:1234abcd', blockchain_network: 'sovrin', trust_score: 92, verifiable_credentials: [{credential_type: 'KYC', verification_status: true}, {credential_type: 'Employee', verification_status: true}], privacy_preserving: true, status: 'Active' },
    { identity_id: 'did:ethr:5678efgh', blockchain_network: 'ethereum', trust_score: 85, verifiable_credentials: [{credential_type: 'Developer', verification_status: true}], privacy_preserving: false, status: 'Active' },
    { identity_id: 'did:web:example.com', blockchain_network: 'custom', trust_score: 75, verifiable_credentials: [], privacy_preserving: true, status: 'Pending' },
];

export default function DecentralizedIdentityPage() {
    const [identities, setIdentities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await DecentralizedIdentity.list();
            setIdentities(data.length > 0 ? data : mockIdentities);
        } catch (e) {
            console.error(e);
            setIdentities(mockIdentities);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Fingerprint className="w-10 h-10 text-purple-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">Decentralized Identity Hub</h1>
                        <p className="text-gray-300">Manage self-sovereign identities and verifiable credentials.</p>
                    </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Users /> Total Identities
                            </CardTitle>
                        </CardHeader>
                        <CardContent><div className="text-5xl font-bold text-white">{identities.length}</div></CardContent>
                    </Card>
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Check /> Verified Credentials
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-bold text-green-400">
                                {identities.reduce((sum, id) => sum + id.verifiable_credentials.length, 0)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Shield /> Average Trust Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-bold text-blue-400">
                                {identities.length > 0 ? Math.round(identities.reduce((sum, id) => sum + id.trust_score, 0) / identities.length) : 0}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-gray-700 bg-gray-800/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white">Managed Identities</CardTitle>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <PlusCircle className="w-4 h-4 mr-2" /> Create New Identity
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-gray-700 hover:bg-transparent">
                                    <TableHead className="text-white">Identity (DID)</TableHead>
                                    <TableHead className="text-white">Network</TableHead>
                                    <TableHead className="text-white">Trust Score</TableHead>
                                    <TableHead className="text-white">Credentials</TableHead>
                                    <TableHead className="text-white">Privacy</TableHead>
                                    <TableHead className="text-white">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={6} className="text-center text-gray-400">Loading identities...</TableCell></TableRow>
                                ) : (
                                    identities.map(id => (
                                        <TableRow key={id.identity_id} className="border-b-gray-800">
                                            <TableCell className="font-mono text-sm text-white truncate max-w-xs">{id.identity_id}</TableCell>
                                            <TableCell><Badge variant="outline" className="border-cyan-500/50 text-cyan-300">{id.blockchain_network}</Badge></TableCell>
                                            <TableCell className="text-blue-400 font-bold">{id.trust_score}</TableCell>
                                            <TableCell className="text-gray-300">{id.verifiable_credentials.length}</TableCell>
                                            <TableCell>
                                                {id.privacy_preserving ? (
                                                    <Badge className="bg-green-500/20 text-green-300">Enabled</Badge>
                                                ) : (
                                                    <Badge className="bg-yellow-500/20 text-yellow-300">Disabled</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button size="sm" variant="ghost">View Details</Button>
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