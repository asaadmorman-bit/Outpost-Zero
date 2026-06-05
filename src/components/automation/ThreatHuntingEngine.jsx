import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Plus, Search, Clock, FileText } from 'lucide-react';

const HuntCard = ({ hunt }) => {
    const statusColors = {
        running: 'bg-blue-500/20 text-blue-300',
        completed: 'bg-green-500/20 text-green-300',
        scheduled: 'bg-gray-500/20 text-gray-300',
    };

    return (
        <Card className="bg-gray-900/50 border-gray-700 mb-4">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-lg">{hunt.name}</CardTitle>
                    <Badge className={statusColors[hunt.status]}>{hunt.status}</Badge>
                </div>
                <p className="text-xs text-gray-400 pt-1">Query: <span className="font-mono text-cyan-400">{hunt.query}</span></p>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Every {hunt.frequency}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{hunt.findings} findings</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm">View Results</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default function ThreatHuntingEngine() {
    const [hunts, setHunts] = useState([]);

    useEffect(() => {
        // Mock data for automated hunts
        const mockHunts = [
            { id: 1, name: "C2 Communication Patterns", query: "event_type=network_anomaly AND ml_risk_score > 80", status: "running", frequency: "4 hours", findings: 2 },
            { id: 2, name: "Anomalous PowerShell Execution", query: "process=powershell.exe AND parent_process!=explorer.exe", status: "completed", frequency: "12 hours", findings: 0 },
            { id: 3, name: "Impossible Travel Logins", query: "event_type=login_attempt AND risk_factors CONTAINS 'impossible_travel'", status: "completed", frequency: "1 hour", findings: 7 },
            { id: 4, name: "Scheduled Task Hijacking", query: "event_type=command_execution AND process=schtasks.exe", status: "scheduled", frequency: "24 hours", findings: 0 },
        ];
        setHunts(mockHunts);
    }, []);

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-white">Automated Hunts</CardTitle>
                        <p className="text-gray-400 text-sm">Continuously searching for advanced threats across all clients.</p>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Hunt
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {hunts.map(hunt => (
                    <HuntCard key={hunt.id} hunt={hunt} />
                ))}
            </CardContent>
        </Card>
    );
}