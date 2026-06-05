import React, { useState, useEffect, useCallback } from 'react';
import { AgentDeployment, AgentInstallerPackage, AgentHeartbeat } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Download,
    Server,
    Monitor,
    Activity,
    AlertCircle,
    CheckCircle,
    XCircle,
    Copy,
    Play,
    Code,
    Package,
    Terminal,
    Globe,
    Shield,
    Zap,
    RefreshCw,
    Settings
} from 'lucide-react';
import { toast } from 'sonner';

const AgentCard = ({ agent, onView, onConfigure }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return 'bg-green-500/20 text-green-400';
            case 'offline': return 'bg-red-500/20 text-red-400';
            case 'degraded': return 'bg-yellow-500/20 text-yellow-400';
            case 'installing': return 'bg-blue-500/20 text-blue-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'online': return <CheckCircle className="w-4 h-4" />;
            case 'offline': return <XCircle className="w-4 h-4" />;
            case 'degraded': return <AlertCircle className="w-4 h-4" />;
            default: return <Activity className="w-4 h-4" />;
        }
    };

    const timeSinceHeartbeat = agent.last_heartbeat 
        ? Math.floor((new Date() - new Date(agent.last_heartbeat)) / 1000 / 60)
        : null;

    return (
        <Card className="border-gray-700 bg-gray-800/50 hover:border-blue-500/50 transition-all">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                            {agent.deployment_type === 'agent_based' ? (
                                <Monitor className="w-5 h-5 text-blue-400" />
                            ) : (
                                <Globe className="w-5 h-5 text-purple-400" />
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-white text-base">{agent.hostname}</CardTitle>
                            <p className="text-xs text-gray-400">{agent.ip_address}</p>
                        </div>
                    </div>
                    <Badge className={getStatusColor(agent.status)}>
                        {getStatusIcon(agent.status)}
                        <span className="ml-1">{agent.status}</span>
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="text-gray-400 text-xs">OS</p>
                        <p className="text-white">{agent.os_type} {agent.os_version}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs">Version</p>
                        <p className="text-white">{agent.agent_version || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs">Type</p>
                        <Badge className="text-xs">
                            {agent.deployment_type === 'agent_based' ? 'Agent' : 'Agentless'}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs">Last Seen</p>
                        <p className="text-white text-xs">
                            {timeSinceHeartbeat !== null ? `${timeSinceHeartbeat}m ago` : 'Never'}
                        </p>
                    </div>
                </div>

                {agent.health_metrics && (
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-700">
                        <div className="text-center">
                            <p className="text-xs text-gray-400">CPU</p>
                            <p className="text-sm font-semibold text-white">
                                {agent.health_metrics.cpu_usage?.toFixed(0) || 0}%
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-400">Memory</p>
                            <p className="text-sm font-semibold text-white">
                                {agent.health_metrics.memory_usage?.toFixed(0) || 0}%
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-400">Disk</p>
                            <p className="text-sm font-semibold text-white">
                                {agent.health_metrics.disk_usage?.toFixed(0) || 0}%
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex gap-2 pt-3">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => onView(agent)}
                    >
                        View Details
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => onConfigure(agent)}
                    >
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const InstallerGenerator = ({ onClose }) => {
    const [config, setConfig] = useState({
        os_type: 'windows',
        architecture: 'x64',
        deployment_type: 'agent_based',
        deployment_group: '',
        tags: '',
        auto_update: true
    });
    const [generatedPackage, setGeneratedPackage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateInstaller = async () => {
        setIsGenerating(true);

        try {
            // Generate unique API key for this deployment
            const apiKey = `oz_agent_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
            
            const serverUrl = window.location.origin;
            
            // Create installer package record
            const packageData = await AgentInstallerPackage.create({
                package_id: `pkg_${Date.now()}`,
                package_name: `outpost-zero-agent-${config.os_type}-${config.architecture}`,
                version: '2.0.0',
                os_type: config.os_type,
                architecture: config.architecture,
                package_type: config.os_type === 'windows' ? 'msi' : config.os_type === 'linux' ? 'deb' : 'pkg',
                download_url: `${serverUrl}/downloads/agents/outpost-zero-agent-${config.os_type}-${config.architecture}.${config.os_type === 'windows' ? 'msi' : 'deb'}`,
                file_size_mb: 45.2,
                sha256_checksum: 'abc123...', // Would be real checksum in production
                auto_generated: true,
                embedded_config: {
                    server_url: serverUrl,
                    api_key: apiKey,
                    deployment_group: config.deployment_group,
                    tags: config.tags.split(',').map(t => t.trim()).filter(Boolean)
                },
                channel: 'stable',
                release_date: new Date().toISOString()
            });

            // Generate installation commands
            let installCommand = '';
            let silentInstallCommand = '';

            switch (config.os_type) {
                case 'windows':
                    packageData.installation_command = `msiexec /i outpost-zero-agent.msi SERVER_URL="${serverUrl}" API_KEY="${apiKey}" /qn`;
                    packageData.silent_install_command = `msiexec /i outpost-zero-agent.msi SERVER_URL="${serverUrl}" API_KEY="${apiKey}" /quiet /norestart`;
                    packageData.uninstall_command = 'msiexec /x {PRODUCT-GUID} /qn';
                    break;
                case 'linux':
                    packageData.installation_command = `sudo dpkg -i outpost-zero-agent.deb && sudo /opt/outpost-zero/bin/configure --server="${serverUrl}" --api-key="${apiKey}"`;
                    packageData.silent_install_command = `sudo dpkg -i outpost-zero-agent.deb && sudo /opt/outpost-zero/bin/configure --server="${serverUrl}" --api-key="${apiKey}" --silent`;
                    packageData.uninstall_command = 'sudo dpkg -r outpost-zero-agent';
                    break;
                case 'macos':
                    packageData.installation_command = `sudo installer -pkg outpost-zero-agent.pkg -target / && sudo /Applications/OutpostZero/configure.sh "${serverUrl}" "${apiKey}"`;
                    packageData.silent_install_command = packageData.installation_command;
                    packageData.uninstall_command = 'sudo /Applications/OutpostZero/uninstall.sh';
                    break;
                case 'docker':
                    packageData.installation_command = `docker run -d --name outpost-zero-agent \\
  -e SERVER_URL="${serverUrl}" \\
  -e API_KEY="${apiKey}" \\
  -v /var/run/docker.sock:/var/run/docker.sock \\
  -v /proc:/host/proc:ro \\
  -v /sys:/host/sys:ro \\
  outpostzero/agent:latest`;
                    break;
                case 'kubernetes':
                    packageData.installation_command = `helm install outpost-zero-agent outpostzero/agent \\
  --set serverUrl="${serverUrl}" \\
  --set apiKey="${apiKey}" \\
  --set deploymentGroup="${config.deployment_group}"`;
                    break;
            }

            setGeneratedPackage(packageData);
            toast.success('Installer package generated successfully!');
        } catch (error) {
            toast.error('Failed to generate installer: ' + error.message);
        }

        setIsGenerating(false);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white">Generate Agent Installer</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Create a customized installer package for your endpoints
                    </DialogDescription>
                </DialogHeader>

                {!generatedPackage ? (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-white">Operating System</Label>
                                <Select
                                    value={config.os_type}
                                    onValueChange={(value) => setConfig({ ...config, os_type: value })}
                                >
                                    <SelectTrigger className="mt-2 bg-gray-800 border-gray-600 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                        <SelectItem value="windows">Windows</SelectItem>
                                        <SelectItem value="linux">Linux</SelectItem>
                                        <SelectItem value="macos">macOS</SelectItem>
                                        <SelectItem value="docker">Docker</SelectItem>
                                        <SelectItem value="kubernetes">Kubernetes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-white">Architecture</Label>
                                <Select
                                    value={config.architecture}
                                    onValueChange={(value) => setConfig({ ...config, architecture: value })}
                                >
                                    <SelectTrigger className="mt-2 bg-gray-800 border-gray-600 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                        <SelectItem value="x64">x64 (64-bit)</SelectItem>
                                        <SelectItem value="x86">x86 (32-bit)</SelectItem>
                                        <SelectItem value="arm64">ARM64</SelectItem>
                                        <SelectItem value="arm">ARM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label className="text-white">Deployment Type</Label>
                            <Select
                                value={config.deployment_type}
                                onValueChange={(value) => setConfig({ ...config, deployment_type: value })}
                            >
                                <SelectTrigger className="mt-2 bg-gray-800 border-gray-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                    <SelectItem value="agent_based">Agent-Based (Recommended)</SelectItem>
                                    <SelectItem value="agentless">Agentless</SelectItem>
                                    <SelectItem value="hybrid">Hybrid</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-400 mt-1">
                                Agent-based provides real-time monitoring. Agentless uses remote protocols.
                            </p>
                        </div>

                        <div>
                            <Label className="text-white">Deployment Group (Optional)</Label>
                            <Input
                                value={config.deployment_group}
                                onChange={(e) => setConfig({ ...config, deployment_group: e.target.value })}
                                placeholder="e.g., production, staging, development"
                                className="mt-2 bg-gray-800 border-gray-600 text-white"
                            />
                        </div>

                        <div>
                            <Label className="text-white">Tags (Optional)</Label>
                            <Input
                                value={config.tags}
                                onChange={(e) => setConfig({ ...config, tags: e.target.value })}
                                placeholder="e.g., web-servers, database, critical"
                                className="mt-2 bg-gray-800 border-gray-600 text-white"
                            />
                            <p className="text-xs text-gray-400 mt-1">Comma-separated tags</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="auto_update"
                                checked={config.auto_update}
                                onChange={(e) => setConfig({ ...config, auto_update: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <Label htmlFor="auto_update" className="text-white">
                                Enable automatic updates
                            </Label>
                        </div>

                        <Button
                            onClick={generateInstaller}
                            disabled={isGenerating}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Package className="w-4 h-4 mr-2" />
                                    Generate Installer
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <h3 className="font-semibold text-white">Installer Generated Successfully!</h3>
                            </div>
                            <p className="text-sm text-gray-300">
                                Package ID: <code className="bg-gray-800 px-2 py-1 rounded">{generatedPackage.package_id}</code>
                            </p>
                        </div>

                        <div>
                            <Label className="text-white flex items-center justify-between">
                                Download URL
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(generatedPackage.download_url)}
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </Label>
                            <Input
                                value={generatedPackage.download_url}
                                readOnly
                                className="mt-2 bg-gray-800 border-gray-600 text-white font-mono text-sm"
                            />
                        </div>

                        <div>
                            <Label className="text-white flex items-center justify-between">
                                Installation Command
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(generatedPackage.installation_command)}
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </Label>
                            <div className="mt-2 bg-gray-800 border border-gray-600 rounded-lg p-4">
                                <code className="text-sm text-green-400 whitespace-pre-wrap">
                                    {generatedPackage.installation_command}
                                </code>
                            </div>
                        </div>

                        {generatedPackage.silent_install_command && (
                            <div>
                                <Label className="text-white flex items-center justify-between">
                                    Silent Install (for automation)
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => copyToClipboard(generatedPackage.silent_install_command)}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </Label>
                                <div className="mt-2 bg-gray-800 border border-gray-600 rounded-lg p-4">
                                    <code className="text-sm text-blue-400 whitespace-pre-wrap">
                                        {generatedPackage.silent_install_command}
                                    </code>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-800/50 rounded-lg p-4">
                                <p className="text-xs text-gray-400 mb-1">Package Type</p>
                                <p className="text-white font-semibold">{generatedPackage.package_type.toUpperCase()}</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-4">
                                <p className="text-xs text-gray-400 mb-1">File Size</p>
                                <p className="text-white font-semibold">{generatedPackage.file_size_mb} MB</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => setGeneratedPackage(null)}
                                variant="outline"
                                className="flex-1 border-gray-600"
                            >
                                Generate Another
                            </Button>
                            <Button
                                onClick={() => window.open(generatedPackage.download_url, '_blank')}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Installer
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default function AgentDeploymentPage() {
    const [agents, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showInstallerGen, setShowInstallerGen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const loadAgents = useCallback(async () => {
        setIsLoading(true);
        try {
            const agentData = await AgentDeployment.list('-last_heartbeat');
            
            // If no agents, create mock data
            if (agentData.length === 0) {
                const mockAgents = [
                    {
                        agent_id: 'agent_001',
                        hostname: 'WEB-SERVER-01',
                        ip_address: '10.0.1.15',
                        os_type: 'windows',
                        os_version: 'Server 2022',
                        agent_version: '2.0.0',
                        deployment_type: 'agent_based',
                        status: 'online',
                        last_heartbeat: new Date(Date.now() - 2 * 60000).toISOString(),
                        health_metrics: { cpu_usage: 23, memory_usage: 45, disk_usage: 67 }
                    },
                    {
                        agent_id: 'agent_002',
                        hostname: 'DB-SERVER-01',
                        ip_address: '10.0.1.20',
                        os_type: 'linux',
                        os_version: 'Ubuntu 22.04',
                        agent_version: '2.0.0',
                        deployment_type: 'agent_based',
                        status: 'online',
                        last_heartbeat: new Date(Date.now() - 1 * 60000).toISOString(),
                        health_metrics: { cpu_usage: 67, memory_usage: 78, disk_usage: 45 }
                    },
                    {
                        agent_id: 'agent_003',
                        hostname: 'LEGACY-APP-01',
                        ip_address: '10.0.2.45',
                        os_type: 'windows',
                        os_version: 'Server 2012',
                        deployment_type: 'agentless',
                        status: 'online',
                        last_heartbeat: new Date(Date.now() - 5 * 60000).toISOString()
                    },
                    {
                        agent_id: 'agent_004',
                        hostname: 'FIREWALL-01',
                        ip_address: '10.0.0.1',
                        os_type: 'unix',
                        os_version: 'PAN-OS 10.2',
                        deployment_type: 'agentless',
                        status: 'degraded',
                        last_heartbeat: new Date(Date.now() - 15 * 60000).toISOString()
                    }
                ];
                
                // Create mock agents
                for (const mock of mockAgents) {
                    await AgentDeployment.create(mock);
                }
                
                setAgents(mockAgents);
            } else {
                setAgents(agentData);
            }
        } catch (error) {
            toast.error('Failed to load agents: ' + error.message);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadAgents();
    }, [loadAgents]);

    const filteredAgents = agents.filter(agent => {
        const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;
        const matchesSearch = agent.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            agent.ip_address.includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    const stats = {
        total: agents.length,
        online: agents.filter(a => a.status === 'online').length,
        offline: agents.filter(a => a.status === 'offline').length,
        agent_based: agents.filter(a => a.deployment_type === 'agent_based').length,
        agentless: agents.filter(a => a.deployment_type === 'agentless').length
    };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Agent Deployment</h1>
                        <p className="text-gray-300">Deploy and manage endpoint agents across your infrastructure</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={loadAgents}
                            variant="outline"
                            className="border-gray-600 text-gray-300"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                        <Button
                            onClick={() => setShowInstallerGen(true)}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Generate Installer
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-5 gap-4 mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-400">Total Agents</p>
                                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                                </div>
                                <Server className="w-8 h-8 text-gray-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-400">Online</p>
                                    <p className="text-2xl font-bold text-green-400">{stats.online}</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-400">Offline</p>
                                    <p className="text-2xl font-bold text-red-400">{stats.offline}</p>
                                </div>
                                <XCircle className="w-8 h-8 text-red-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-400">Agent-Based</p>
                                    <p className="text-2xl font-bold text-blue-400">{stats.agent_based}</p>
                                </div>
                                <Monitor className="w-8 h-8 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-400">Agentless</p>
                                    <p className="text-2xl font-bold text-purple-400">{stats.agentless}</p>
                                </div>
                                <Globe className="w-8 h-8 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <Input
                        placeholder="Search by hostname or IP..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white max-w-md"
                    />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-full md:w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                            <SelectItem value="degraded">Degraded</SelectItem>
                            <SelectItem value="installing">Installing</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Agents Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                    </div>
                ) : filteredAgents.length === 0 ? (
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-12 text-center">
                            <Monitor className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Agents Found</h3>
                            <p className="text-gray-400 mb-6">
                                Deploy your first agent to start monitoring endpoints
                            </p>
                            <Button
                                onClick={() => setShowInstallerGen(true)}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Generate Installer
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAgents.map(agent => (
                            <AgentCard
                                key={agent.agent_id}
                                agent={agent}
                                onView={(a) => setSelectedAgent(a)}
                                onConfigure={(a) => toast.info('Agent configuration coming soon')}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Installer Generator Dialog */}
            {showInstallerGen && (
                <InstallerGenerator onClose={() => setShowInstallerGen(false)} />
            )}
        </div>
    );
}