
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Tabs imports are no longer needed for the top-level state selection, replaced by buttons
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Cloud,
    Server,
    Database,
    Shield,
    Zap,
    GitBranch,
    HardDrive,
    Network,
    Lock,
    Activity,
    Download,
    CheckCircle,
    AlertCircle, // Used for showing unhealthy status if needed
    Cpu,
    Eye,
    Users,
    Key,
    BarChart3,
    Globe, // Added for Future State
    FileText, // Added for Future State
    Layers, // Added for Future State
    ArrowRight,
    Info,
    Sparkles // Added for Future State
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion'; // Added for motion.div hover effects

// ComponentDetail now expects a full component object, not just a string key
const ComponentDetail = ({ component, onClose }) => {
    // The 'component' prop is now expected to be the full component object
    const detail = component;

    if (!detail) return null; // Safety check

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-white text-xl font-bold mb-2">{detail.name}</h3>
                <p className="text-gray-300">{detail.description}</p>
            </div>

            <div>
                <h4 className="text-white font-semibold mb-2">Specifications</h4>
                <ul className="space-y-1">
                    {/* Updated to iterate over object entries for specs */}
                    {Object.entries(detail.specs).map(([key, value], i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="font-medium text-white">{key}:</span> {value}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="text-white font-semibold mb-2">Integrations</h4>
                <div className="flex flex-wrap gap-2">
                    {detail.integrations.map((integration, i) => (
                        <Badge key={i} className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                            {integration}
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-white font-semibold mb-3">Live Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                    {/* Metrics rendering remains compatible */}
                    {Object.entries(detail.metrics).map(([key, value]) => (
                        <div key={key} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                            <div className="text-xs text-gray-400 uppercase mb-1">{key}</div>
                            <div className="text-white font-semibold">{value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function ArchitectureDiagram() {
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [view, setView] = useState('current');

    // Consolidated architecture details for current and future states
    const currentArchitecture = {
        cicd: {
            name: 'GitHub Actions CI/CD',
            status: 'healthy',
            description: 'Automated build, test, and deployment pipeline',
            specs: {
                'Pipeline Success Rate': '99.2%',
                'Average Build Time': '8.5 minutes',
                'Daily Deployments': '12-15',
                'Environments': 'Dev, Staging, Production'
            },
            integrations: ['GitHub', 'Docker Hub', 'Azure Container Registry', 'Terraform Cloud'],
            metrics: {
                'Last Deploy': '23 minutes ago',
                'Failed Builds (7d)': '3',
                'Total Pipelines': '47'
            }
        },
        azure: {
            name: 'Azure (Primary - 70%)',
            status: 'healthy',
            description: 'Primary cloud hosting with native Azure services integration',
            specs: {
                'Region': 'East US (Primary), West US 2 (DR)',
                'Kubernetes': 'AKS v1.27',
                'Node Pools': 'System (6-20), User (3-12), GPU (2-10)',
                'Network': 'VNet 10.0.0.0/16 (Zone-redundant)',
                'Services': 'Sentinel, Azure AD, Monitor, Key Vault'
            },
            integrations: ['Azure Sentinel', 'Azure AD', 'Azure Monitor', 'Azure Key Vault', 'Application Gateway', 'Azure Firewall'],
            metrics: {
                'CPU Utilization': '67%',
                'Memory Usage': '72%',
                'Active Nodes': '18',
                'Uptime': '99.98%'
            }
        },
        aws: {
            name: 'AWS (Secondary - 25%)',
            status: 'healthy',
            description: 'Secondary cloud for redundancy and burst capacity',
            specs: {
                'Region': 'US-East-1 (Primary), US-West-2 (DR)',
                'Kubernetes': 'EKS v1.28',
                'Node Groups': 'General (3-10), GPU (1-5)',
                'Network': 'VPC 10.1.0.0/16 (Multi-AZ)'
            },
            integrations: ['AWS Security Hub', 'GuardDuty', 'CloudTrail', 'S3', 'RDS'],
            metrics: {
                'CPU Utilization': '54%',
                'Memory Usage': '61%',
                'Active Nodes': '7',
                'Uptime': '99.95%'
            }
        },
        gcp: {
            name: 'GCP (Tertiary - 5%)',
            status: 'healthy',
            description: 'Tertiary cloud for specific workloads and global reach',
            specs: {
                'Region': 'us-central1',
                'Kubernetes': 'GKE v1.27',
                'Node Pools': 'Default (2-6)',
                'Network': 'VPC 10.2.0.0/16'
            },
            integrations: ['Chronicle', 'Cloud Security Command Center', 'Cloud Storage'],
            metrics: {
                'CPU Utilization': '41%',
                'Memory Usage': '48%',
                'Active Nodes': '4',
                'Uptime': '99.92%'
            }
        },
        api: {
            name: 'API Server (AKS)',
            status: 'healthy',
            description: 'REST/GraphQL/WebSocket API layer running on Azure Kubernetes Service',
            specs: {
                'Replicas': '3 (auto-scales to 10)',
                'Image': 'outpostzero/api-server:latest',
                'CPU': '500m request, 2000m limit',
                'Memory': '1Gi request, 4Gi limit',
                'Hosting': 'Azure AKS (East US)'
            },
            integrations: ['Azure Monitor', 'Azure Key Vault', 'Application Insights', 'Service Mesh (Istio)'],
            metrics: {
                'Requests/min': '2,423',
                'Latency P95': '95ms',
                'Error Rate': '0.03%',
                'Active Connections': '847'
            }
        },
        ai: {
            name: 'AI/ML Workers (AKS)',
            status: 'healthy',
            description: 'GPU-accelerated threat detection and machine learning workloads',
            specs: {
                'Replicas': '2 (auto-scales to 20)',
                'GPU': 'NVIDIA V100 (Azure NC6s_v3)',
                'CPU': '2-8 cores',
                'Memory': '8-32GB',
                'Hosting': 'Azure AKS (GPU node pool)'
            },
            integrations: ['TensorFlow', 'PyTorch', 'Azure ML', 'Redis Queue'],
            metrics: {
                'Jobs/hour': '1,247',
                'GPU Utilization': '78%',
                'Model Accuracy': '97.3%',
                'Queue Depth': '234'
            }
        },
        database: {
            name: 'Azure Database for PostgreSQL',
            status: 'healthy',
            description: 'Managed PostgreSQL database with zone-redundant high availability',
            specs: {
                'Engine': 'PostgreSQL 15.4',
                'Instance': 'Standard_D8s_v3 (8 vCPU, 32GB)',
                'Architecture': 'Primary + 3 read replicas',
                'Storage': '512GB Premium SSD',
                'HA': 'Zone-redundant enabled'
            },
            integrations: ['PgBouncer', 'Azure Backup', 'Azure Monitor', 'Private Link'],
            metrics: {
                'Queries/min': '8,734',
                'Connections': '127/500',
                'Replication Lag': 'under 1s',
                'Storage Used': '347GB'
            }
        },
        cache: {
            name: 'Azure Cache for Redis',
            status: 'healthy',
            description: 'Premium Redis cluster with zone redundancy',
            specs: {
                'Version': 'Redis 7.2.x',
                'Tier': 'Premium (Cluster)',
                'Nodes': '6 (26GB each)',
                'Total Memory': '156GB',
                'Zone Redundancy': 'Enabled'
            },
            integrations: ['Redis Queue', 'Pub/Sub', 'Azure Monitor', 'Private Endpoint'],
            metrics: {
                'Ops/sec': '45,231',
                'Hit Rate': '94.2%',
                'Latency P99': 'under 2ms',
                'Memory Used': '83%'
            }
        },
        sentinel: {
            name: 'Azure Sentinel',
            status: 'healthy',
            description: 'Cloud-native SIEM and SOAR platform',
            specs: {
                'Workspace': 'Log Analytics (East US)',
                'Data Ingestion': '10,000+ events/sec',
                'Analytics Rules': '47 active',
                'Retention': '90 days hot, 2 years archive',
                'Integration': 'Native (same Azure tenant)'
            },
            integrations: ['Logic Apps', 'Azure AD', 'Microsoft Threat Intelligence', 'Watchlists'],
            metrics: {
                'Events Today': '847M',
                'Incidents': '23 open',
                'UEBA Alerts': '12',
                'Query Latency': 'under 5s'
            }
        },
        azuread: {
            name: 'Azure Active Directory',
            status: 'healthy',
            description: 'Enterprise identity and access management',
            specs: {
                'Tier': 'Premium P2',
                'Users': '1,247',
                'Protocol': 'SAML 2.0 + OIDC',
                'MFA': 'Required (100% adoption)',
                'Conditional Access': '12 policies active'
            },
            integrations: ['SCIM 2.0 Provisioning', 'PIM', 'Identity Protection', 'Azure MFA'],
            metrics: {
                'Daily Logins': '8,247',
                'SSO Success': '99.7%',
                'Risky Sign-ins': '3',
                'Blocked Attempts': '127'
            }
        },
        monitor: {
            name: 'Azure Monitor',
            status: 'healthy',
            description: 'Comprehensive observability platform',
            specs: {
                'Components': 'App Insights, Log Analytics, Metrics',
                'Data Points/hr': '2.1M',
                'Alert Rules': '15 active',
                'Retention': '30 days hot, 2 years cold',
                'Dashboards': '4 custom workbooks'
            },
            integrations: ['Application Insights', 'KQL', 'Action Groups', 'Power BI'],
            metrics: {
                'Query Latency': '42ms',
                'Active Alerts': '3',
                'Log Volume': '2.1M/hr',
                'Trace Sampling': '10%'
            }
        },
        keyvault: {
            name: 'Azure Key Vault',
            status: 'healthy',
            description: 'HSM-backed secrets and key management',
            specs: {
                'Tier': 'Premium (HSM)',
                'Secrets': '23',
                'Certificates': '5',
                'Keys': '8 (HSM-backed)',
                'Access': 'Private endpoint only'
            },
            integrations: ['AKS CSI Driver', 'Managed Identity', 'Azure RBAC', 'Audit Logs'],
            metrics: {
                'Operations/day': '1,247',
                'Avg Latency': '15ms',
                'Uptime': '100%',
                'Failed Access': '0'
            }
        },
        storage: {
            name: 'Azure Storage',
            status: 'healthy',
            description: 'Zone-redundant blob storage and managed disks',
            specs: {
                'Blob Storage': 'Hot tier (ZRS)',
                'Managed Disks': 'Premium SSD',
                'Total Storage': '2.4TB',
                'Redundancy': 'Zone-redundant (ZRS)',
                'Backup': 'Geo-replicated to West US 2'
            },
            integrations: ['Azure Backup', 'Lifecycle Management', 'Private Link', 'Immutable Storage'],
            metrics: {
                'Blob Capacity': '1.8TB',
                'Disk IOPS': '12,000',
                'Bandwidth': '500 MB/s',
                'Availability': '99.99%'
            }
        },
        networking: {
            name: 'Azure Networking',
            status: 'healthy',
            description: 'Application Gateway, Firewall, and Load Balancers',
            specs: {
                'VNet': '10.0.0.0/16',
                'App Gateway': 'v2 with WAF',
                'Azure Firewall': 'Standard tier',
                'Load Balancer': 'Standard SKU',
                'Zones': '3 availability zones'
            },
            integrations: ['NSG', 'DDoS Protection', 'Traffic Manager', 'Private Link'],
            metrics: {
                'Throughput': '2.3 Gbps',
                'Requests/min': '12,400',
                'WAF Blocks': '47/day',
                'Latency P95': '12ms'
            }
        },
        security: { // Added a generic security component for the infrastructure layer card
            name: 'Infrastructure Security',
            status: 'healthy',
            description: 'Overall security posture for network, secrets, and access control.',
            specs: {
                'Network Policies': 'Zero-trust enabled',
                'Secret Management': 'HSM-backed (Key Vault)',
                'RBAC Controls': 'Principle of least privilege',
                'Traffic Encryption': 'TLS 1.3 everywhere',
                'DDoS Protection': 'Azure DDoS Protection Standard'
            },
            integrations: ['Azure Security Center', 'Azure Sentinel', 'Azure Firewall', 'Azure Policy'],
            metrics: {
                'Critical Alerts (24h)': '0',
                'Compliance Score': '95%',
                'Vulnerabilities Scanned': 'Daily',
                'Security Patches': 'Automated'
            }
        }
    };

    const futureArchitecture = {
        cicd: { ...currentArchitecture.cicd, specs: { ...currentArchitecture.cicd.specs, 'Average Build Time': '5 minutes', 'Daily Deployments': '25-30' } },
        azure: {
            ...currentArchitecture.azure,
            description: 'Expanded primary cloud with enhanced global presence',
            specs: {
                ...currentArchitecture.azure.specs,
                'Node Pools': 'System (10-40), User (5-20), GPU (5-15)',
                'Additional Regions': 'West Europe, Southeast Asia'
            }
        },
        aws: currentArchitecture.aws, // No specific changes outlined for future AWS
        gcp: currentArchitecture.gcp, // No specific changes outlined for future GCP
        api: { ...currentArchitecture.api, specs: { ...currentArchitecture.api.specs, 'Replicas': '5 (auto-scales to 20)' }, metrics: { ...currentArchitecture.api.metrics, 'Requests/min': '10,000', 'Latency P95': '50ms' } },
        ai: { ...currentArchitecture.ai, specs: { ...currentArchitecture.ai.specs, 'GPU': 'NVIDIA A100 (Azure NC24ads_A100_v4)', 'Replicas': '5 (auto-scales to 30)' }, metrics: { ...currentArchitecture.ai.metrics, 'Jobs/hour': '5,000', 'Model Accuracy': '98.5%' } },
        database: { ...currentArchitecture.database, specs: { ...currentArchitecture.database.specs, 'Instance': 'Standard_D16s_v3 (16 vCPU, 64GB)', 'Architecture': 'Primary + 5 read replicas' }, metrics: { ...currentArchitecture.database.metrics, 'Queries/min': '25,000' } },
        cache: { ...currentArchitecture.cache, specs: { ...currentArchitecture.cache.specs, 'Nodes': '12 (52GB each)', 'Total Memory': '624GB' }, metrics: { ...currentArchitecture.cache.metrics, 'Ops/sec': '100,000', 'Hit Rate': '97%' } },
        sentinel: { ...currentArchitecture.sentinel, specs: { ...currentArchitecture.sentinel.specs, 'Data Ingestion': '50,000+ events/sec', 'Analytics Rules': '120 active' } },
        azuread: currentArchitecture.azuread, // No specific changes outlined for future Azure AD
        monitor: { ...currentArchitecture.monitor, specs: { ...currentArchitecture.monitor.specs, 'Data Points/hr': '8M', 'Dashboards': '12 custom workbooks' } },
        keyvault: currentArchitecture.keyvault, // No specific changes outlined for future Key Vault
        storage: { ...currentArchitecture.storage, specs: { ...currentArchitecture.storage.specs, 'Total Storage': '10TB' } },
        networking: { ...currentArchitecture.networking, specs: { ...currentArchitecture.networking.specs, 'App Gateway': 'v2 with WAF (enhanced)' }, metrics: { ...currentArchitecture.networking.metrics, 'Throughput': '10 Gbps' } },
        security: currentArchitecture.security // No specific changes outlined for future security
    };

    const architecture = view === 'current' ? currentArchitecture : futureArchitecture;

    const downloadArchitectureDoc = () => {
        const doc = `OUTPOST ZERO - ARCHITECTURE SUMMARY (Azure-Primary)
================================================

Cloud Distribution:
  • Azure (Primary): 70%
  • AWS (Secondary): 25%
  • GCP (Tertiary): 5%

Azure Components:
  ├── AKS (Kubernetes)
  │   ├── API Server (3-10 replicas)
  │   ├── AI Workers (2-20 replicas, V100 GPUs)
  │   └── Service Mesh (Istio)
  ├── Azure Database for PostgreSQL (Zone-redundant HA)
  ├── Azure Cache for Redis (Premium, 6 nodes)
  ├── Azure Sentinel (SIEM/SOAR)
  ├── Azure Active Directory (SSO, 1,247 users)
  ├── Azure Monitor (Observability)
  ├── Azure Key Vault (HSM-backed)
  ├── Azure Storage (ZRS, 2.4TB)
  └── Networking (App Gateway, Firewall, NSG)

Performance:
  • API: 2.4K req/min, 95ms P95 latency
  • Events: 10K/sec processing
  • Database: 8.7K queries/min
  • Cache: 45K ops/sec, 94.2% hit rate
  • Uptime: 99.98% (12-month average)

Security:
  • Encryption: AES-256 at rest, TLS 1.3 in transit
  • Authentication: Azure AD with MFA (100% adoption)
  • Network: Azure Firewall, WAF, DDoS Protection
  • Compliance: SOC 2, ISO 27001, FedRAMP (in progress)
  • Monitoring: Azure Sentinel, Defender for Cloud

For detailed documentation, see Platform Architecture page.`;

        const blob = new Blob([doc], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'architecture-summary.txt';
        a.click();
        URL.revokeObjectURL(url); // Clean up the URL object
    };

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                {/* Replaced Tabs component with custom buttons as per outline */}
                <div className="flex gap-2">
                    <Button
                        variant={view === 'current' ? 'default' : 'outline'}
                        onClick={() => setView('current')}
                        className={view === 'current' ? 'bg-blue-600' : 'border-gray-600'}
                    >
                        Current State (Azure Primary)
                    </Button>
                    <Button
                        variant={view === 'future' ? 'default' : 'outline'}
                        onClick={() => setView('future')}
                        className={view === 'future' ? 'bg-purple-600' : 'border-gray-600'}
                    >
                        Future State (Q2 2026)
                    </Button>
                </div>

                <Button
                    onClick={downloadArchitectureDoc}
                    variant="outline"
                    className="border-gray-600"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Download Summary
                </Button>
            </div>

            {/* Main Diagram */}
            <div className="bg-gray-900/50 rounded-lg p-6 md:p-8 border border-gray-700">
                {view === 'current' ? (
                    <div className="space-y-8">
                        {/* CI/CD Layer */}
                        <div className="flex justify-center">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedComponent(architecture.cicd)}
                                className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 flex items-center gap-3 w-full md:w-80 cursor-pointer hover:bg-purple-500/20 transition-colors"
                            >
                                <GitBranch className="w-8 h-8 text-purple-400 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="text-white font-semibold">{architecture.cicd.name}</div>
                                    <div className="text-xs text-gray-400">{architecture.cicd.description}</div>
                                </div>
                                <Badge className={`bg-${architecture.cicd.status === 'healthy' ? 'green' : 'red'}-500/20 text-${architecture.cicd.status === 'healthy' ? 'green' : 'red'}-300 text-xs`}>
                                    {architecture.cicd.status === 'healthy' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                                    {architecture.cicd.status === 'healthy' ? 'Live' : 'Issue'}
                                </Badge>
                            </motion.div>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center">
                            <ArrowRight className="w-6 h-6 text-gray-600 rotate-90" />
                        </div>

                        {/* Multi-Cloud Layer - Updated with new Card structure and motion.div */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Azure - Primary */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedComponent(architecture.azure)}
                                className="cursor-pointer"
                            >
                                <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/50 hover:border-blue-400 transition-all">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge className="bg-blue-600">PRIMARY - 70%</Badge>
                                            <Activity className={`h-5 w-5 ${architecture.azure.status === 'healthy' ? 'text-green-400' : 'text-red-400'}`} />
                                        </div>
                                        <CardTitle className="text-white text-lg flex items-center gap-2">
                                            <Cloud className="w-6 h-6 text-blue-400" />
                                            Microsoft Azure
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between text-gray-300">
                                                <span>Region:</span>
                                                <span className="text-white">{architecture.azure.specs.Region}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Kubernetes:</span>
                                                <span className="text-white">{architecture.azure.specs.Kubernetes}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Nodes:</span>
                                                <span className="text-white">{architecture.azure.metrics['Active Nodes']} active</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>CPU:</span>
                                                <span className="text-blue-400">{architecture.azure.metrics['CPU Utilization']}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Memory:</span>
                                                <span className="text-blue-400">{architecture.azure.metrics['Memory Usage']}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* AWS - Secondary */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedComponent(architecture.aws)}
                                className="cursor-pointer"
                            >
                                <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/50 hover:border-orange-400 transition-all">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge className="bg-orange-600">SECONDARY - 25%</Badge>
                                            <Activity className={`h-5 w-5 ${architecture.aws.status === 'healthy' ? 'text-green-400' : 'text-red-400'}`} />
                                        </div>
                                        <CardTitle className="text-white text-lg flex items-center gap-2">
                                            <Cloud className="w-6 h-6 text-orange-400" />
                                            Amazon AWS
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between text-gray-300">
                                                <span>Region:</span>
                                                <span className="text-white">{architecture.aws.specs.Region}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Kubernetes:</span>
                                                <span className="text-white">{architecture.aws.specs.Kubernetes}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Nodes:</span>
                                                <span className="text-white">{architecture.aws.metrics['Active Nodes']} active</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>CPU:</span>
                                                <span className="text-orange-400">{architecture.aws.metrics['CPU Utilization']}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Memory:</span>
                                                <span className="text-orange-400">{architecture.aws.metrics['Memory Usage']}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* GCP - Tertiary */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedComponent(architecture.gcp)}
                                className="cursor-pointer"
                            >
                                <Card className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 border-gray-500/50 hover:border-gray-400 transition-all">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge className="bg-gray-600">TERTIARY - 5%</Badge>
                                            <Activity className={`h-5 w-5 ${architecture.gcp.status === 'healthy' ? 'text-green-400' : 'text-red-400'}`} />
                                        </div>
                                        <CardTitle className="text-white text-lg flex items-center gap-2">
                                            <Cloud className="w-6 h-6 text-gray-400" />
                                            Google Cloud
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between text-gray-300">
                                                <span>Region:</span>
                                                <span className="text-white">{architecture.gcp.specs.Region}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Kubernetes:</span>
                                                <span className="text-white">{architecture.gcp.specs.Kubernetes}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Nodes:</span>
                                                <span className="text-white">{architecture.gcp.metrics['Active Nodes']} active</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>CPU:</span>
                                                <span className="text-gray-400">{architecture.gcp.metrics['CPU Utilization']}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Memory:</span>
                                                <span className="text-gray-400">{architecture.gcp.metrics['Memory Usage']}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center">
                            <ArrowRight className="w-6 h-6 text-gray-600 rotate-90" />
                        </div>

                        {/* Kubernetes Layer - Updated with new badge and dynamic data */}
                        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
                            <div className="text-center mb-4">
                                <Badge className="bg-gray-700/50 text-gray-300 text-sm px-4 py-1">
                                    Kubernetes Workloads (Azure AKS)
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-cyan-500/20 rounded-lg">
                                    <Server className="w-8 h-8 text-cyan-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-semibold text-lg">Kubernetes Orchestration</div>
                                    <div className="text-xs text-gray-400">Container Management & Auto-Scaling</div>
                                </div>
                                <Badge className="bg-green-500/20 text-green-300">
                                    <Activity className="w-3 h-3 mr-1" />
                                    {architecture.azure.metrics.Uptime} Uptime {/* Using Azure Uptime as a proxy for K8s */}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div
                                    onClick={() => setSelectedComponent(architecture.api)}
                                    className="bg-gray-800/50 rounded p-3 border border-gray-700 cursor-pointer hover:border-blue-500/50 transition-all group"
                                >
                                    <Shield className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <div className="text-white text-sm font-medium">{architecture.api.name.split(' ')[0]}</div>
                                    <div className="text-xs text-gray-500 mb-2">{architecture.api.specs.Replicas.split(' ')[0]} replicas</div>
                                    <div className="flex items-center gap-1 text-xs">
                                        <Cpu className="w-3 h-3 text-green-400" />
                                        <span className="text-green-400">{architecture.api.metrics['Latency P95']}</span>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setSelectedComponent(architecture.ai)}
                                    className="bg-gray-800/50 rounded p-3 border border-gray-700 cursor-pointer hover:border-green-500/50 transition-all group"
                                >
                                    <Activity className="w-5 h-5 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <div className="text-white text-sm font-medium">{architecture.ai.name.split(' ')[0]}</div>
                                    <div className="text-xs text-gray-500 mb-2">Auto-scaling</div>
                                    <div className="flex items-center gap-1 text-xs">
                                        <Cpu className="w-3 h-3 text-yellow-400" />
                                        <span className="text-yellow-400">{architecture.ai.metrics['GPU Utilization']}</span>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setSelectedComponent(architecture.database)}
                                    className="bg-gray-800/50 rounded p-3 border border-gray-700 cursor-pointer hover:border-purple-500/50 transition-all group"
                                >
                                    <Database className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <div className="text-white text-sm font-medium">{architecture.database.name.split(' ')[2]}</div>
                                    <div className="text-xs text-gray-500 mb-2">Clustered</div>
                                    <div className="flex items-center gap-1 text-xs">
                                        <Cpu className="w-3 h-3 text-green-400" />
                                        <span className="text-green-400">{architecture.database.metrics['Connections']}</span>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setSelectedComponent(architecture.cache)}
                                    className="bg-gray-800/50 rounded p-3 border border-gray-700 cursor-pointer hover:border-yellow-500/50 transition-all group"
                                >
                                    <Zap className="w-5 h-5 text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <div className="text-white text-sm font-medium">{architecture.cache.name.split(' ')[2]}</div>
                                    <div className="text-xs text-gray-500 mb-2">{architecture.cache.specs.Version}</div>
                                    <div className="flex items-center gap-1 text-xs">
                                        <Cpu className="w-3 h-3 text-green-400" />
                                        <span className="text-green-400">{architecture.cache.metrics['Hit Rate']}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center">
                            <ArrowRight className="w-6 h-6 text-gray-600 rotate-90" />
                        </div>

                        {/* Azure Integrations - Updated with dynamic data and click handlers */}
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/732/732221.png"
                                    alt="Microsoft Azure"
                                    className="w-8 h-8"
                                />
                                <div className="flex-1">
                                    <div className="text-white font-semibold text-lg">Azure Integrations</div>
                                    <div className="text-xs text-gray-400">Native Microsoft Cloud Services</div>
                                </div>
                                <Badge className="bg-blue-500/20 text-blue-300">
                                    {Object.keys(architecture).filter(key => ['azure', 'sentinel', 'azuread', 'monitor', 'keyvault', 'storage', 'networking'].includes(key)).length} Active
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div
                                    onClick={() => setSelectedComponent(architecture.sentinel)}
                                    className="bg-gray-800/50 rounded p-3 border border-gray-700 cursor-pointer hover:border-blue-500/50 transition-all group"
                                >
                                    <Eye className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <div className="text-white text-sm font-medium">{architecture.sentinel.name.split(' ')[1]}</div>
                                    <div className="text-xs text-gray-500 mb-2">SIEM</div>
                                    <div className="flex items-center gap-1 text-xs">
                                        <Activity className="w-3 h-3 text-green-400" />
                                        <span className="text-green-400">{architecture.sentinel.metrics['Events Today']}</span>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setSelectedComponent(architecture.azuread)}
                                    className="bg-gray-800/50 rounded p-3 border border-gray-700 cursor-pointer hover:border-blue-500/50 transition-all group"
                                >
                                    <Users className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <div className="text-white text-sm font-medium">Azure AD</div>
                                    <div className="text-xs text-gray-500 mb-2">SSO</div>
                                    <div className="flex items-center gap-1 text-xs">
                                        <Users className="w-3 h-3 text-green-400" />
                                        <span className="text-green-400">{architecture.azuread.metrics['Daily Logins']} today</span>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setSelectedComponent(architecture.monitor)}
                                    className="bg-gray-800/50 rounded p-3 border border-gray-700 cursor-pointer hover:border-blue-500/50 transition-all group"
                                >
                                    <BarChart3 className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <div className="text-white text-sm font-medium">{architecture.monitor.name.split(' ')[1]}</div>
                                    <div className="text-xs text-gray-500 mb-2">Observability</div>
                                    <div className="flex items-center gap-1 text-xs">
                                        <Activity className="w-3 h-3 text-green-400" />
                                        <span className="text-green-400">{architecture.monitor.metrics['Log Volume']}</span>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setSelectedComponent(architecture.keyvault)}
                                    className="bg-gray-800/50 rounded p-3 border border-gray-700 cursor-pointer hover:border-blue-500/50 transition-all group"
                                >
                                    <Key className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <div className="text-white text-sm font-medium">{architecture.keyvault.name.split(' ')[2]}</div>
                                    <div className="text-xs text-gray-500 mb-2">Secrets</div>
                                    <div className="flex items-center gap-1 text-xs">
                                        <Lock className="w-3 h-3 text-green-400" />
                                        <span className="text-green-400">{architecture.keyvault.specs.Secrets} keys</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Infrastructure Layer - Updated with dynamic data and click handlers */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div
                                onClick={() => setSelectedComponent(architecture.storage)}
                                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500/50 transition-all group"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <HardDrive className="w-6 h-6 text-blue-400" />
                                    <div className="text-white font-semibold">{architecture.storage.name.split(' ')[1]}</div>
                                </div>
                                <div className="space-y-1 text-xs text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                        {architecture.storage.specs['Blob Storage']}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                        {architecture.storage.specs['Managed Disks']}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                        {architecture.storage.specs.Redundancy}
                                    </div>
                                </div>
                            </div>

                            <div
                                onClick={() => setSelectedComponent(architecture.networking)}
                                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-green-500/50 transition-all group"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Network className="w-6 h-6 text-green-400" />
                                    <div className="text-white font-semibold">{architecture.networking.name.split(' ')[1]}</div>
                                </div>
                                <div className="space-y-1 text-xs text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                        {architecture.networking.specs['App Gateway']}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                        {architecture.networking.specs['Azure Firewall']}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                        {architecture.networking.specs['Load Balancer']}
                                    </div>
                                </div>
                            </div>

                            <div
                                onClick={() => setSelectedComponent(architecture.security)}
                                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-red-500/50 transition-all group"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Lock className="w-6 h-6 text-red-400" />
                                    <div className="text-white font-semibold">Security</div>
                                </div>
                                <div className="space-y-1 text-xs text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                        Network Policies
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                        Secret Management
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                        RBAC Controls
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-4 justify-center pt-4 border-t border-gray-700">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Info className="w-4 h-4 text-blue-400" />
                                <span>Click any component for detailed metrics</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <div className="w-3 h-3 bg-cyan-500/30 rounded"></div>
                                <span>Kubernetes</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <div className="w-3 h-3 bg-blue-500/30 rounded"></div>
                                <span>Azure Services</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <div className="w-3 h-3 bg-green-400 rounded"></div>
                                <span>Healthy</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Future State */
                    <div className="space-y-8">
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                                <h3 className="text-white text-lg font-bold">Future State (Q2 2026)</h3>
                            </div>
                            <p className="text-gray-300 text-sm">
                                Planned enhancements for scalability, security, and global reach
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-gray-800/50 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-blue-400" />
                                        Global Edge Deployment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <ArrowRight className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-white text-sm font-medium">15 Global Regions</div>
                                            <div className="text-xs text-gray-400">Americas, Europe, Asia-Pacific, Middle East</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <ArrowRight className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-white text-sm font-medium">Edge Computing Nodes</div>
                                            <div className="text-xs text-gray-400">Process threats locally, reduce latency to &lt;20ms</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <ArrowRight className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-white text-sm font-medium">Multi-Region Active-Active</div>
                                            <div className="text-xs text-gray-400">Zero-downtime failover between regions</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-800/50 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Layers className="w-5 h-5 text-purple-400" />
                                        Advanced AI Infrastructure
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <ArrowRight className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-white text-sm font-medium">Dedicated GPU Clusters</div>
                                            <div className="text-xs text-gray-400">100+ NVIDIA A100 GPUs for real-time analysis</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <ArrowRight className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-white text-sm font-medium">Custom AI Model Registry</div>
                                            <div className="text-xs text-gray-400">Per-customer model training and deployment</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <ArrowRight className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-white text-sm font-medium">Quantum-Safe Encryption</div>
                                            <div className="text-xs text-gray-400">Post-quantum cryptography across all services</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-800/50 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-orange-400" />
                                        Government Cloud
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <ArrowRight className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-white text-sm font-medium">FedRAMP High Authorized</div>
                                            <div className="text-xs text-gray-400">IL4/IL5/IL6 classification levels</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <ArrowRight className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-white text-sm font-medium">Air-Gapped Options</div>
                                            <div className="text-xs text-gray-400">Fully isolated deployments for classified networks</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <ArrowRight className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-white text-sm font-medium">Cross-Domain Solutions</div>
                                            <div className="text-xs text-gray-400">Secure data transfer between classification levels</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-800/50 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-yellow-400" />
                                        Performance Targets
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <ArrowRight className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-white text-sm font-medium">50K+ Events/Second</div>
                                            <div className="text-xs text-gray-400">5x current capacity for large enterprises</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <ArrowRight className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-white text-sm font-medium">99.999% Uptime SLA</div>
                                            <div className="text-xs text-gray-400">&lt;5 minutes downtime per year</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <ArrowRight className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-white text-sm font-medium">Sub-10ms API Response</div>
                                            <div className="text-xs text-gray-400">P99 latency for all API calls</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-400" />
                                Timeline
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Badge className="bg-green-500/20 text-green-300">Q1 2026</Badge>
                                    <div className="text-gray-300 text-sm">Edge nodes in 5 regions, GPU cluster expansion</div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Badge className="bg-blue-500/20 text-blue-300">Q2 2026</Badge>
                                    <div className="text-gray-300 text-sm">FedRAMP High authorization, 15 global regions</div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Badge className="bg-purple-500/20 text-purple-300">Q3 2026</Badge>
                                    <div className="text-gray-300 text-sm">Quantum-safe encryption, air-gapped deployments</div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Badge className="bg-orange-500/20 text-orange-300">Q4 2026</Badge>
                                    <div className="text-gray-300 text-sm">Global edge deployment complete, 50K+ events/sec capacity</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Component Detail Modal */}
            <Dialog open={selectedComponent !== null} onOpenChange={() => setSelectedComponent(null)}>
                <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-white">Component Details</DialogTitle>
                        {selectedComponent && (
                            <DialogDescription className="text-gray-400">
                                {selectedComponent.description}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                    {selectedComponent && <ComponentDetail component={selectedComponent} />}
                </DialogContent>
            </Dialog>
        </div>
    );
}
