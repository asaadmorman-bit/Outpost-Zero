
import React, { useState, useEffect } from 'react';
import { Licensee, APIKey, APILog } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
    Users, 
    KeyRound, 
    Activity, 
    Plus,
    Copy,
    Trash2,
    Check
} from 'lucide-react';
import { format } from 'date-fns';

const planColors = {
  developer: "bg-green-500/20 text-green-400",
  professional: "bg-blue-500/20 text-blue-400",
  enterprise: "bg-purple-500/20 text-purple-400",
  strategic_partner: "bg-red-500/20 text-red-400"
};

const statusColors = {
  active: "bg-green-500/20 text-green-400",
  trial: "bg-yellow-500/20 text-yellow-400",
  revoked: "bg-red-500/20 text-red-400",
  expired: "bg-gray-500/20 text-gray-400"
};

const GenerateKeyDialog = ({ licensee, onKeyGenerated }) => {
    const [newKey, setNewKey] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleGenerate = async () => {
        const keyPrefix = "oz_pk_";
        const generatedKey = keyPrefix + [...Array(32)].map(() => Math.random().toString(36)[2]).join('');
        
        // In a real app, you'd send a hash of this to the backend
        const newRecord = await APIKey.create({
            licensee_id: licensee.licensee_id,
            key_prefix: keyPrefix,
            key_hash: "mock_hash_" + Math.random(), // Mocking hash
            rate_limit_per_minute: 1000,
            permissions: ['all']
        });
        
        setNewKey(generatedKey);
        onKeyGenerated(newRecord);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(newKey);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <Dialog onOpenChange={(open) => !open && setNewKey(null)}>
            <DialogTrigger asChild>
                <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Generate API Key</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle>Generate New API Key for {licensee.company_name}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        A new API key will be created. This key will only be shown once.
                    </DialogDescription>
                </DialogHeader>
                {newKey ? (
                    <div className="my-4">
                        <p className="text-sm text-red-400 mb-2">Please copy this key and store it securely. You will not be able to see it again.</p>
                        <div className="flex items-center space-x-2 bg-gray-900 p-3 rounded-md">
                            <input
                                readOnly
                                value={newKey}
                                className="flex-1 bg-transparent border-none outline-none font-mono text-sm"
                            />
                            <Button size="sm" variant="ghost" onClick={handleCopy}>
                                {isCopied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center text-gray-400">
                        Click "Generate Key" to create a new API key.
                    </div>
                )}
                <DialogFooter>
                    {!newKey && <Button onClick={handleGenerate}>Generate Key</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function LicensingPlatformPage() {
    const [licensees, setLicensees] = useState([]);
    const [apiKeys, setApiKeys] = useState([]);
    const [selectedLicensee, setSelectedLicensee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        setLoading(true);
        const [licenseeData, apiKeyData] = await Promise.all([
            Licensee.list(),
            APIKey.list()
        ]);
        setLicensees(licenseeData);
        setApiKeys(apiKeyData);
        if (licenseeData.length > 0) {
            setSelectedLicensee(licenseeData[0]);
        }
        setLoading(false);
    };

    const handleKeyGenerated = (newKey) => {
        setApiKeys(prev => [...prev, newKey]);
    };

    const handleRevokeKey = async (keyId) => {
        if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
            await APIKey.update(keyId, { status: 'revoked' });
            setApiKeys(prev => prev.map(key => key.id === keyId ? { ...key, status: 'revoked' } : key));
        }
    };
    
    const filteredKeys = selectedLicensee ? apiKeys.filter(k => k.licensee_id === selectedLicensee.licensee_id) : [];

    if (loading) {
        return <div className="text-white text-center p-8">Loading Licensing Platform...</div>;
    }

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                        <Users className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Outpost Zero Developer Platform</h1>
                        <p className="text-lg text-gray-300">Manage licensees and their API access to Outpost Zero technologies.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white">Licensees</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {licensees.map(l => (
                                        <button 
                                            key={l.licensee_id}
                                            onClick={() => setSelectedLicensee(l)}
                                            className={`w-full text-left p-3 rounded-lg transition-colors ${selectedLicensee?.licensee_id === l.licensee_id ? 'bg-blue-500/20' : 'hover:bg-gray-700/50'}`}
                                        >
                                            <p className="font-semibold text-white">{l.company_name}</p>
                                            <Badge className={`mt-1 text-xs ${planColors[l.plan_tier]}`}>{l.plan_tier}</Badge>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        {selectedLicensee ? (
                            <Card className="border-gray-700 bg-gray-800/50">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-white">{selectedLicensee.company_name}'s API Keys</CardTitle>
                                    <GenerateKeyDialog licensee={selectedLicensee} onKeyGenerated={handleKeyGenerated} />
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b-gray-700 hover:bg-transparent">
                                                <TableHead className="text-white">Key Prefix</TableHead>
                                                <TableHead className="text-white">Status</TableHead>
                                                <TableHead className="text-white">Last Used</TableHead>
                                                <TableHead className="text-white">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredKeys.map(key => (
                                                <TableRow key={key.id} className="border-b-gray-800">
                                                    <TableCell className="font-mono text-sm text-gray-300">{key.key_prefix}...</TableCell>
                                                    <TableCell>
                                                        <Badge className={statusColors[key.status]}>{key.status}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-gray-400">
                                                        {key.last_used ? format(new Date(key.last_used), 'PPp') : 'Never'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button 
                                                            variant="destructive" 
                                                            size="sm"
                                                            onClick={() => handleRevokeKey(key.id)}
                                                            disabled={key.status === 'revoked'}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Revoke
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {filteredKeys.length === 0 && (
                                                <TableRow><TableCell colSpan="4" className="text-center text-gray-400">No API keys found for this licensee.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">Select a licensee to view API keys.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
