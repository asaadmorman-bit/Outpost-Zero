
import React, { useState, useEffect, useCallback } from 'react';
import { CustomSDK, SDKInstallation } from '@/entities/all';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    Search,
    Code,
    Download,
    Star,
    Shield,
    CheckCircle,
    ExternalLink,
    GitBranch,
    Package,
    Zap,
    Filter,
    TrendingUp,
    AlertCircle,
    FileText,
    Activity,
    AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

const SDKCard = ({ sdk, onInstall, onViewDetails, isInstalled }) => {
    const certificationColors = {
        verified: 'bg-green-500/20 text-green-300 border-green-500/30',
        community: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        pending_review: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        deprecated: 'bg-red-500/20 text-red-300 border-red-500/30'
    };

    const certificationIcons = {
        verified: <CheckCircle className="w-4 h-4" />,
        community: <GitBranch className="w-4 h-4" />,
        pending_review: <AlertCircle className="w-4 h-4" />,
        deprecated: <AlertCircle className="w-4 h-4" />
    };

    return (
        <Card className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                            <Package className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <CardTitle className="text-white flex items-center gap-2">
                                {sdk.sdk_name}
                                <Badge variant="outline" className="text-xs text-white bg-gray-700 border-gray-600">
                                    v{sdk.version}
                                </Badge>
                            </CardTitle>
                            <p className="text-sm text-gray-300 mt-1">{sdk.developer_organization}</p>
                        </div>
                    </div>
                    <Badge className={certificationColors[sdk.certification_status]}>
                        {certificationIcons[sdk.certification_status]}
                        <span className="ml-1">{sdk.certification_status.replace('_', ' ')}</span>
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-gray-200 text-sm leading-relaxed">
                    {sdk.description}
                </p>

                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold">{sdk.rating}</span>
                        <span className="text-gray-300">({sdk.reviews_count})</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300">
                        <Download className="w-4 h-4" />
                        <span className="text-white font-semibold">{sdk.installation_count}</span>
                        <span>installs</span>
                    </div>
                </div>

                {sdk.infrastructure_problems_solved && sdk.infrastructure_problems_solved.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Solves:</h4>
                        <div className="flex flex-wrap gap-2">
                            {sdk.infrastructure_problems_solved.slice(0, 3).map((problem, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs text-gray-200 bg-gray-700/50 border-gray-600">
                                    {problem}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-gray-700/50">
                    <Button
                        onClick={() => onViewDetails(sdk)}
                        variant="outline"
                        className="flex-1 text-white hover:text-white"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Details
                    </Button>
                    <Button
                        onClick={() => onInstall(sdk)}
                        disabled={isInstalled}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:bg-gray-700 disabled:text-gray-400"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {isInstalled ? 'Installed' : 'Install'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const SDKDetailsDialog = ({ sdk, isOpen, onClose, onInstall, isInstalled }) => {
    if (!sdk) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl">
                        <Package className="w-8 h-8 text-blue-400" />
                        {sdk.sdk_name}
                    </DialogTitle>
                    <DialogDescription className="text-gray-200">
                        {sdk.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardContent className="p-4">
                                <h4 className="font-semibold text-white mb-2">Developer</h4>
                                <p className="text-white">{sdk.developer_organization}</p>
                                <p className="text-sm text-gray-300">{sdk.developer_email}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardContent className="p-4">
                                <h4 className="font-semibold text-white mb-2">Pricing</h4>
                                <p className="text-white capitalize">{sdk.pricing_model}</p>
                                {sdk.monthly_cost && (
                                    <p className="text-sm text-gray-300">${sdk.monthly_cost}/month</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {sdk.infrastructure_problems_solved && sdk.infrastructure_problems_solved.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-white mb-3">Infrastructure Challenges Addressed</h4>
                            <div className="grid md:grid-cols-2 gap-2">
                                {sdk.infrastructure_problems_solved.map((problem, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-200 bg-gray-800/50 p-2 rounded">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        {problem}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {sdk.use_cases && sdk.use_cases.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-white mb-3">Common Use Cases</h4>
                            <ul className="space-y-2">
                                {sdk.use_cases.map((useCase, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-200">
                                        <Zap className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                        {useCase}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {sdk.data_sources_supported && sdk.data_sources_supported.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-white mb-3">Supported Data Sources</h4>
                            <div className="flex flex-wrap gap-2">
                                {sdk.data_sources_supported.map((source, idx) => (
                                    <Badge key={idx} className="bg-purple-500/20 text-white">
                                        {source}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {sdk.compliance_frameworks && sdk.compliance_frameworks.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-white mb-3">Compliance Support</h4>
                            <div className="flex flex-wrap gap-2">
                                {sdk.compliance_frameworks.map((framework, idx) => (
                                    <Badge key={idx} className="bg-green-500/20 text-white">
                                        <Shield className="w-3 h-3 mr-1" />
                                        {framework}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {sdk.security_audit && (
                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardContent className="p-4">
                                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-green-400" />
                                    Security Audit
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Status:</span>
                                        <Badge className={sdk.security_audit.audit_status === 'passed' ? 'bg-green-500/20 text-white' : 'bg-yellow-500/20 text-white'}>
                                            {sdk.security_audit.audit_status}
                                        </Badge>
                                    </div>
                                    {sdk.security_audit.audit_date && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Last Audit:</span>
                                            <span className="text-white">{new Date(sdk.security_audit.audit_date).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex gap-3">
                        {sdk.documentation_url && (
                            <Button
                                onClick={() => window.open(sdk.documentation_url, '_blank')}
                                variant="outline"
                                className="border-gray-600 text-white hover:bg-gray-700 hover:text-white"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Documentation
                            </Button>
                        )}
                        {sdk.github_repo && (
                            <Button
                                onClick={() => window.open(sdk.github_repo, '_blank')}
                                variant="outline"
                                className="border-gray-600 text-white hover:bg-gray-700 hover:text-white"
                            >
                                <GitBranch className="w-4 h-4 mr-2" />
                                GitHub
                            </Button>
                        )}
                        <Button
                            onClick={() => onInstall(sdk)}
                            disabled={isInstalled}
                            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:bg-gray-700 disabled:text-gray-400"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {isInstalled ? 'Already Installed' : 'Install SDK'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default function SDKMarketplacePage() {
    const [sdks, setSDKs] = useState([]);
    const [installations, setInstallations] = useState([]);
    const [filteredSDKs, setFilteredSDKs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSDK, setSelectedSDK] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [systemStatus, setSystemStatus] = useState(null);

    const getMockSDKs = () => [
        {
            sdk_id: 'sdk_001',
            sdk_name: 'Legacy SIEM Connector',
            developer_email: 'dev@cyberdojogroup.com',
            developer_organization: 'Cyber Dojo Solutions',
            version: '2.1.0',
            category: 'security_monitoring',
            description: 'Seamlessly integrate legacy SIEM systems (ArcSight, QRadar, LogRhythm) with Outpost Zero. Bidirectional data flow, real-time correlation, and unified dashboards.',
            use_cases: [
                'Migrate from legacy SIEM without losing historical data',
                'Run hybrid SIEM environments during transition periods',
                'Correlate alerts across old and new security stacks',
                'Provide unified view for SOC analysts'
            ],
            infrastructure_problems_solved: [
                'Stuck with expensive legacy SIEM',
                'Data silos between security tools',
                'Cannot afford rip-and-replace migration',
                'Need gradual transition path'
            ],
            certification_status: 'verified',
            pricing_model: 'paid',
            monthly_cost: 499,
            installation_count: 47,
            rating: 4.8,
            reviews_count: 23,
            data_sources_supported: ['ArcSight', 'QRadar', 'LogRhythm', 'AlienVault', 'Splunk'],
            compliance_frameworks: ['SOC 2', 'ISO 27001', 'PCI DSS'],
            security_audit: {
                audit_date: '2024-12-01',
                audit_status: 'passed',
                vulnerabilities_found: 0
            },
            documentation_url: 'https://sdk-developers.cyberdojogroup.com/legacy-siem',
            github_repo: 'https://github.com/cyberdojo/legacy-siem-sdk',
            webhook_support: true,
            real_time_streaming: true
        },
        {
            sdk_id: 'sdk_002',
            sdk_name: 'Industrial IoT Security Bridge',
            developer_email: 'iot@cyberdojogroup.com',
            developer_organization: 'Cyber Dojo Solutions',
            version: '1.5.2',
            category: 'endpoint_protection',
            description: 'Monitor and secure industrial IoT devices, SCADA systems, and OT networks. Protocol-aware threat detection for Modbus, BACnet, and proprietary industrial protocols.',
            use_cases: [
                'Secure smart manufacturing environments',
                'Monitor critical infrastructure',
                'Detect anomalies in industrial control systems',
                'Bridge IT/OT security gap'
            ],
            infrastructure_problems_solved: [
                'No security visibility into OT networks',
                'Legacy industrial protocols unsupported',
                'Cannot deploy agents on industrial devices',
                'Need passive monitoring solutions'
            ],
            certification_status: 'verified',
            pricing_model: 'paid',
            monthly_cost: 799,
            installation_count: 31,
            rating: 4.9,
            reviews_count: 18,
            data_sources_supported: ['Modbus', 'BACnet', 'DNP3', 'PROFINET', 'OPC UA'],
            compliance_frameworks: ['NERC CIP', 'IEC 62443', 'NIST CSF'],
            security_audit: {
                audit_date: '2024-11-15',
                audit_status: 'passed',
                vulnerabilities_found: 0
            },
            documentation_url: 'https://sdk-developers.cyberdojogroup.com/industrial-iot',
            webhook_support: true,
            real_time_streaming: true
        },
        {
            sdk_id: 'sdk_003',
            sdk_name: 'Multi-Cloud Security Posture',
            developer_email: 'cloud@cyberdojogroup.com',
            developer_organization: 'Cyber Dojo Solutions',
            version: '3.0.1',
            category: 'cloud_security',
            description: 'Unified security posture management across AWS, Azure, GCP, and Oracle Cloud. Automated misconfiguration detection, compliance scanning, and remediation workflows.',
            use_cases: [
                'Manage security across multiple cloud providers',
                'Automate compliance scanning',
                'Detect cloud misconfigurations in real-time',
                'Track cloud asset inventory'
            ],
            infrastructure_problems_solved: [
                'Fragmented cloud security tools',
                'No unified view across cloud providers',
                'Manual compliance checks',
                'Shadow IT discovery gaps'
            ],
            certification_status: 'verified',
            pricing_model: 'freemium',
            monthly_cost: 0,
            installation_count: 156,
            rating: 4.7,
            reviews_count: 67,
            data_sources_supported: ['AWS', 'Azure', 'GCP', 'Oracle Cloud', 'Alibaba Cloud'],
            compliance_frameworks: ['CIS Benchmarks', 'NIST 800-53', 'FedRAMP', 'HIPAA'],
            security_audit: {
                audit_date: '2024-12-10',
                audit_status: 'passed',
                vulnerabilities_found: 0
            },
            documentation_url: 'https://sdk-developers.cyberdojogroup.com/multi-cloud',
            github_repo: 'https://github.com/cyberdojo/multi-cloud-sdk',
            webhook_support: true
        },
        {
            sdk_id: 'sdk_004',
            sdk_name: 'Identity Fabric Unifier',
            developer_email: 'identity@cyberdojogroup.com',
            developer_organization: 'Cyber Dojo Solutions',
            version: '2.3.0',
            category: 'identity_management',
            description: 'Unify disparate identity systems (Active Directory, Okta, Azure AD, LDAP) into a single security view. Detect privilege creep, orphaned accounts, and access anomalies.',
            use_cases: [
                'Consolidate identity data from multiple IAM systems',
                'Detect privilege escalation across platforms',
                'Automated user lifecycle management',
                'Access certification campaigns'
            ],
            infrastructure_problems_solved: [
                'Multiple disconnected IAM systems',
                'No centralized identity analytics',
                'Manual access reviews',
                'Privilege creep goes undetected'
            ],
            certification_status: 'verified',
            pricing_model: 'paid',
            monthly_cost: 599,
            installation_count: 89,
            rating: 4.6,
            reviews_count: 42,
            data_sources_supported: ['Active Directory', 'Azure AD', 'Okta', 'Ping Identity', 'LDAP', 'SailPoint'],
            compliance_frameworks: ['SOX', 'GDPR', 'SOC 2', 'ISO 27001'],
            security_audit: {
                audit_date: '2024-11-28',
                audit_status: 'passed',
                vulnerabilities_found: 0
            },
            documentation_url: 'https://sdk-developers.cyberdojogroup.com/identity-fabric',
            webhook_support: true
        },
        {
            sdk_id: 'sdk_005',
            sdk_name: 'Compliance Automation Engine',
            developer_email: 'compliance@cyberdojogroup.com',
            developer_organization: 'Cyber Dojo Solutions',
            version: '1.8.0',
            category: 'compliance',
            description: 'Automate compliance evidence collection, control testing, and audit report generation for CMMC, FedRAMP, HIPAA, and other frameworks.',
            use_cases: [
                'Continuous compliance monitoring',
                'Automated evidence collection',
                'Real-time compliance dashboards',
                'Audit-ready documentation generation'
            ],
            infrastructure_problems_solved: [
                'Manual compliance workflows',
                'Audit preparation takes months',
                'Cannot prove continuous compliance',
                'Evidence collection is tedious'
            ],
            certification_status: 'verified',
            pricing_model: 'paid',
            monthly_cost: 899,
            installation_count: 73,
            rating: 4.9,
            reviews_count: 38,
            data_sources_supported: ['All Outpost Zero data sources'],
            compliance_frameworks: ['CMMC', 'FedRAMP', 'HIPAA', 'PCI DSS', 'SOC 2', 'ISO 27001', 'NIST 800-53'],
            security_audit: {
                audit_date: '2024-12-05',
                audit_status: 'passed',
                vulnerabilities_found: 0
            },
            documentation_url: 'https://sdk-developers.cyberdojogroup.com/compliance-automation',
            webhook_support: false
        }
    ];

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [sdkData, installData] = await Promise.all([
                CustomSDK.list().catch(() => []),
                SDKInstallation.filter({ status: 'active' }).catch(() => [])
            ]);

            if (sdkData.length === 0) {
                const mockData = getMockSDKs();
                setSDKs(mockData);
                toast.info('Using demo SDK data', {
                    description: 'Connect to sdk-developers.cyberdojogroup.com for live SDKs'
                });
            } else {
                setSDKs(sdkData);
            }

            setInstallations(installData);
        } catch (error) {
            console.error('Error loading SDK marketplace:', error);
            setSDKs(getMockSDKs());
            toast.error('Failed to load SDKs', {
                description: 'Using demo data. Check console for details.'
            });
        }
        setIsLoading(false);
    }, []);

    const filterSDKs = useCallback(() => {
        let filtered = sdks;

        if (searchTerm) {
            filtered = filtered.filter(sdk =>
                sdk.sdk_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sdk.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sdk.developer_organization.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(sdk => sdk.category === selectedCategory);
        }

        setFilteredSDKs(filtered);
    }, [sdks, searchTerm, selectedCategory]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        filterSDKs();
    }, [filterSDKs]);

    const handleInstall = async (sdk) => {
        try {
            const installation = await SDKInstallation.create({
                installation_id: `inst_${Date.now()}_${sdk.sdk_id}`,
                sdk_id: sdk.sdk_id,
                installed_by: 'current_user@example.com',
                status: 'pending_configuration'
            });

            toast.success(`${sdk.sdk_name} installed successfully!`);
            setInstallations([...installations, installation]);
            setShowDetails(false);
        } catch (error) {
            toast.error('Failed to install SDK: ' + error.message);
        }
    };

    const handleTestConnectivity = async () => {
        toast.info('Testing SDK system connectivity...');
        try {
            const { testSDKConnectivity } = await import('@/functions/testSDKConnectivity');
            const response = await testSDKConnectivity();
            setSystemStatus(response.data);
            
            if (response.data.overall_status === 'healthy') {
                toast.success('SDK system is fully operational!');
            } else if (response.data.overall_status === 'degraded') {
                toast.warning('SDK system has some issues', {
                    description: response.data.summary
                });
            } else {
                toast.error('SDK system has critical issues', {
                    description: response.data.summary
                });
            }
        } catch (error) {
            toast.error('Failed to test connectivity: ' + error.message);
            setSystemStatus({
                overall_status: 'unhealthy',
                summary: 'Failed to reach SDK system service.',
                recommendations: [{
                    issue: 'Network or service outage',
                    recommendation: 'Check your network connection and verify the SDK service status.'
                }]
            });
        }
    };

    const isInstalled = (sdkId) => {
        return installations.some(inst => inst.sdk_id === sdkId);
    };

    const categories = [
        { id: 'all', name: 'All SDKs', count: sdks.length },
        { id: 'security_monitoring', name: 'Security Monitoring', count: sdks.filter(s => s.category === 'security_monitoring').length },
        { id: 'threat_intelligence', name: 'Threat Intelligence', count: sdks.filter(s => s.category === 'threat_intelligence').length },
        { id: 'compliance', name: 'Compliance', count: sdks.filter(s => s.category === 'compliance').length },
        { id: 'data_integration', name: 'Data Integration', count: sdks.filter(s => s.category === 'data_integration').length },
        { id: 'automation', name: 'Automation', count: sdks.filter(s => s.category === 'automation').length },
        { id: 'cloud_security', name: 'Cloud Security', count: sdks.filter(s => s.category === 'cloud_security').length },
        { id: 'endpoint_protection', name: 'Endpoint Protection', count: sdks.filter(s => s.category === 'endpoint_protection').length },
        { id: 'identity_management', name: 'Identity Management', count: sdks.filter(s => s.category === 'identity_management').length }
    ];

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">SDK Marketplace</h1>
                        <p className="text-gray-200">Extend Outpost Zero with custom integrations from sdk-developers.cyberdojogroup.com</p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <Button
                            onClick={handleTestConnectivity}
                            variant="outline"
                            className="border-gray-600 text-white hover:bg-gray-700 hover:text-white"
                        >
                            <Activity className="w-4 h-4 mr-2" />
                            Test System
                        </Button>
                        <Button
                            onClick={() => window.open('https://sdk-developers.cyberdojogroup.com', '_blank')}
                            variant="outline"
                            className="border-gray-600 text-white hover:bg-gray-700 hover:text-white"
                        >
                            <Code className="w-4 h-4 mr-2" />
                            Developer Portal
                        </Button>
                        <Button
                            onClick={() => window.location.href = createPageUrl('CustomSDKRequest')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        >
                            <Zap className="w-4 h-4 mr-2" />
                            Request Custom SDK
                        </Button>
                    </div>
                </div>

                {systemStatus && (
                    <Card className="border-gray-700 bg-gray-800/50 mb-6">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                {systemStatus.overall_status === 'healthy' && <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />}
                                {systemStatus.overall_status === 'degraded' && <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />}
                                {systemStatus.overall_status === 'unhealthy' && <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />}
                                <div className="flex-1">
                                    <h4 className="font-semibold text-white capitalize">System Status: {systemStatus.overall_status}</h4>
                                    <p className="text-sm text-gray-200 mt-1">{systemStatus.summary}</p>
                                    {systemStatus.recommendations && systemStatus.recommendations.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {systemStatus.recommendations.map((rec, idx) => (
                                                <div key={idx} className="bg-gray-900/50 p-3 rounded text-sm">
                                                    <p className="text-white font-medium">{rec.issue}</p>
                                                    <p className="text-gray-300 mt-1">{rec.recommendation}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm font-medium">Available SDKs</p>
                                    <p className="text-3xl font-bold text-white mt-2">{sdks.length}</p>
                                </div>
                                <Package className="w-8 h-8 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm font-medium">Your Installations</p>
                                    <p className="text-3xl font-bold text-white mt-2">{installations.length}</p>
                                </div>
                                <Download className="w-8 h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm font-medium">Verified SDKs</p>
                                    <p className="text-3xl font-bold text-white mt-2">
                                        {sdks.filter(s => s.certification_status === 'verified').length}
                                    </p>
                                </div>
                                <Shield className="w-8 h-8 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm font-medium">Total Installs</p>
                                    <p className="text-3xl font-bold text-white mt-2">
                                        {sdks.reduce((sum, sdk) => sum + sdk.installation_count, 0).toLocaleString()}
                                    </p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-yellow-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-gray-700 bg-gray-800/50 mb-8">
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search SDKs by name, description, or developer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-gray-900 border-gray-600 text-gray-100"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Categories
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {categories.map(category => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                                selectedCategory === category.id 
                                                    ? 'bg-blue-600/20 text-white border border-blue-500/30' 
                                                    : 'text-gray-100 hover:bg-gray-700/50 hover:text-white'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span>{category.name}</span>
                                                <Badge variant="outline" className="text-xs text-white">
                                                    {category.count}
                                                </Badge>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-3">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="text-white text-xl">Loading SDK marketplace...</div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {filteredSDKs.map(sdk => (
                                    <SDKCard
                                        key={sdk.sdk_id}
                                        sdk={sdk}
                                        onInstall={handleInstall}
                                        onViewDetails={(sdk) => {
                                            setSelectedSDK(sdk);
                                            setShowDetails(true);
                                        }}
                                        isInstalled={isInstalled(sdk.sdk_id)}
                                    />
                                ))}
                            </div>
                        )}

                        {filteredSDKs.length === 0 && !isLoading && (
                            <Card className="border-gray-700 bg-gray-800/50">
                                <CardContent className="text-center py-12">
                                    <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                    <p className="text-white text-lg mb-2">No SDKs found</p>
                                    <p className="text-gray-300">Try adjusting your search or filter criteria</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                <SDKDetailsDialog
                    sdk={selectedSDK}
                    isOpen={showDetails}
                    onClose={() => setShowDetails(false)}
                    onInstall={handleInstall}
                    isInstalled={selectedSDK ? isInstalled(selectedSDK.sdk_id) : false}
                />
            </div>
        </div>
    );
}
