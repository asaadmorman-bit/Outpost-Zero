
import React, { useState, useEffect } from 'react';
import { DeploymentTask } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
    Rocket,
    Server,
    BrainCircuit,
    Briefcase,
    Globe,
    Flag,
    ListChecks,
    Target
} from 'lucide-react';

const deploymentPhases = [
    {
        name: "Phase 1: Core Infrastructure & SOC Monitoring",
        timeline: "Weeks 1-4",
        icon: Server,
        objectives: [
            "Establish secure, scalable cloud infrastructure for Outpost Zero deployment.",
            "Integrate foundational data sources (EDR, Firewall, Cloud) into RevSentinel.",
            "Enable real-time SOC dashboard for immediate visibility across AXIS Rebirth tier.",
            "Implement initial Role-Based Access Control (RBAC) for all product tiers."
        ],
        key_features: ["Dashboard", "DataSources", "RecentEvents", "Settings (RBAC)"],
    },
    {
        name: "Phase 2: Intelligence & Automation",
        timeline: "Weeks 5-8", 
        icon: BrainCircuit,
        objectives: [
            "Activate AI Advisory Center for proactive threat recommendations.",
            "Deploy initial SOAR playbooks for automated incident response.",
            "Integrate key threat intelligence feeds across RevSentinel and Outpost Zero.",
            "Establish user behavior analytics baselines for anomaly detection."
        ],
        key_features: ["AIAdvisoryCenter", "SOAR", "ThreatIntel", "UserAnalytics"],
    },
    {
        name: "Phase 3: Strategic & Business Alignment", 
        timeline: "Weeks 9-12",
        icon: Briefcase,
        objectives: [
            "Launch Executive Dashboard for business risk visibility and ROI tracking.",
            "Implement Strategic Risk Center for long-term cybersecurity planning.",
            "Configure compliance frameworks (FedRAMP, CMMC, HIPAA) for Outpost Zero.",
            "Establish Cyber Credit Score for external validation and insurance benefits."
        ],
        key_features: ["ExecutiveDashboard", "StrategicRiskCenter", "Compliance", "CyberCreditScore"],
    },
    {
        name: "Phase 4: Ecosystem & Future-Proofing",
        timeline: "Weeks 13-16",
        icon: Globe,
        objectives: [
            "Open Integration Marketplace for custom third-party connections.",
            "Deploy advanced security modules (Quantum-Safe, Deception, Homomorphic Encryption).",
            "Launch developer platform for extending AXIS, RevSentinel, and Outpost Zero capabilities.",
            "Implement comprehensive cyber awareness training programs across all tiers."
        ],
        key_features: ["IntegrationMarketplace", "QuantumSafeSecurity", "DeceptionPlatforms", "LicensingPlatform", "CyberAwarenessTraining"],
    }
];

export default function DeploymentPlanPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            const taskData = await DeploymentTask.list().catch(() => []);
            setTasks(taskData);
            setLoading(false);
        };
        fetchTasks();
    }, []);

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/174051417_Screenshot2025-07-24110248.jpg" alt="Outpost Zero Logo" className="h-12 object-contain" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">Outpost Zero Deployment Plan</h1>
                        <p className="text-lg text-gray-300">Strategic rollout for AXIS Rebirth, RevSentinel, and Outpost Zero platforms.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-white">
                                <ListChecks className="text-green-400" /> Prerequisites
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-gray-300">
                            <p>✓ Designated cloud environment (AWS/Azure/GCP GovCloud for Outpost Zero).</p>
                            <p>✓ Core project team identified (Infrastructure, SecOps, Compliance).</p>
                            <p>✓ Access to initial data source APIs/logs for RevSentinel integration.</p>
                            <p>✓ Executive sponsorship and tier selection (AXIS/RevSentinel/Outpost Zero).</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-white">
                                <Target className="text-purple-400" /> Success Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-gray-300">
                            <p>✓ 50% reduction in Mean Time to Detect (MTTD) by end of Phase 2.</p>
                            <p>✓ 30% increase in security task automation via SOAR by end of Phase 2.</p>
                            <p>✓ 95% compliance score for applicable frameworks by end of Phase 3.</p>
                            <p>✓ Positive ROI demonstrated on Executive Dashboard by end of Phase 3.</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    {deploymentPhases.map((phase, index) => {
                        const PhaseIcon = phase.icon;
                        return (
                            <Card key={phase.name} className="border-gray-700 bg-gray-800/50 overflow-hidden">
                                <CardHeader className="bg-gray-900/40 p-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <PhaseIcon className="w-8 h-8 text-blue-400" />
                                            <div>
                                                <h2 className="text-xl font-bold text-white">{phase.name}</h2>
                                                <p className="text-sm text-gray-400">Timeline: {phase.timeline}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-blue-300 border-blue-400/50 text-lg px-4 py-1">
                                            Phase {index + 1}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold text-white mb-3">Key Objectives</h3>
                                        <ul className="space-y-2 list-disc list-inside text-gray-300">
                                            {phase.objectives.map(obj => <li key={obj}>{obj}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-3">Features Unlocked</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {phase.key_features.map(feat => (
                                                <Badge key={feat} variant="secondary" className="bg-gray-700 text-gray-200">
                                                    {feat}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Card className="mt-12 border-gray-700 bg-gray-800/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-white">
                           <Flag className="text-orange-400" /> Deployment Task Tracker
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-gray-700 hover:bg-transparent">
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead className="text-white">Task</TableHead>
                                    <TableHead className="text-white">Phase</TableHead>
                                    <TableHead className="text-white">Assigned Team</TableHead>
                                    <TableHead className="text-white">Due Date</TableHead>
                                    <TableHead className="text-white">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan="6" className="text-center text-white">Loading tasks...</TableCell></TableRow>
                                ) : tasks.map(task => (
                                    <TableRow key={task.task_id} className="border-b-gray-800">
                                        <TableCell>
                                            <Checkbox checked={task.status === 'Completed'} />
                                        </TableCell>
                                        <TableCell className="font-medium text-white">{task.task_name}</TableCell>
                                        <TableCell className="text-gray-300">{task.phase.split(':')[0]}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{task.assigned_team}</Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-300">{task.due_date}</TableCell>
                                        <TableCell>
                                            <Badge className={
                                                task.status === 'Completed' ? "bg-green-500/20 text-green-300" :
                                                task.status === 'In Progress' ? "bg-blue-500/20 text-blue-300" :
                                                "bg-gray-600/50 text-gray-300"
                                            }>{task.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
