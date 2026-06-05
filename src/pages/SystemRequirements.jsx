
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Server,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Shield,
  Home,
  Building,
  Building2,
  Crown,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap
} from 'lucide-react';

const tierSpecs = {
  residential: {
    icon: Home,
    color: 'text-green-400',
    name: 'AXIS Rebirth', // Rebranded name
    description: 'Professional-grade security for home users and small home offices',
    pricing: '$99/month',
    trial: '7-day free trial',
    endpoints: 'Up to 5 devices',
    users: '1-2 users',
    dataLimit: '25 GB/month',
    minSpecs: {
      cpu: '6 cores @ 3.0GHz (Intel i5-10400 / AMD Ryzen 5 3600)',
      architecture: 'x86-64, ARM64 (Apple Silicon supported)',
      ram: '16 GB DDR4',
      storage: '250 GB NVMe SSD',
      network: '100 Mbps',
      gpu: 'Optional: GTX 1660 / RTX 3060 (4GB VRAM) for enhanced AI',
      os: 'Windows 10/11, macOS 12+, Ubuntu 20.04+, Debian 11+',
      serverOs: 'Windows Server 2019+, Ubuntu Server 20.04+, CentOS 8+'
    },
    recommendedSpecs: {
      cpu: '8 cores @ 3.5GHz (Intel i7-12700 / AMD Ryzen 7 5800X)',
      architecture: 'x86-64, ARM64 optimized',
      ram: '32 GB DDR4/DDR5',
      storage: '500 GB NVMe SSD (Gen4 preferred)',
      network: '1 Gbps',
      gpu: 'RTX 4060 / RTX 3070 (8GB VRAM) for advanced AI workloads',
      os: 'Latest versions with automatic updates enabled',
      serverOs: 'Windows Server 2022, Ubuntu Server 22.04 LTS, Rocky Linux 9'
    },
    features: [
      'AI-powered threat detection',
      'Home network monitoring',
      'Smart device protection',
      'Email & mobile alerts',
      'Basic incident response',
      'Compliance reporting'
    ],
    useCases: [
      'Remote work security',
      'Home office protection',
      'Family network monitoring',
      'IoT device security',
      'Small business owners'
    ]
  },
  smb: {
    icon: Building,
    color: 'text-blue-400',
    name: 'RevSentinel', // Rebranded name
    description: 'Comprehensive security for growing businesses',
    pricing: '$500/month',
    trial: '14-day free trial',
    endpoints: 'Up to 150 endpoints included',
    users: 'Up to 10 users',
    dataLimit: '1 TB/month',
    minSpecs: {
      cpu: '12 cores @ 3.2GHz (Intel Xeon E-2388G / AMD EPYC 7302P)',
      architecture: 'x86-64 required (server-grade)',
      ram: '64 GB DDR4 ECC',
      storage: '2 TB NVMe SSD RAID 1',
      network: '1 Gbps',
      gpu: 'RTX A4000 / RTX 4070 (12GB VRAM) for AI processing',
      os: 'Windows Server 2019+, RHEL 8+, Ubuntu Server 20.04+',
      serverOs: 'Windows Server 2019/2022, RHEL 8+, SLES 15+, Ubuntu Server 20.04+'
    },
    recommendedSpecs: {
      cpu: '16 cores @ 3.8GHz (Intel Xeon W-2255 / AMD EPYC 7543)',
      architecture: 'x86-64 with virtualization support',
      ram: '128 GB DDR4 ECC',
      storage: '4 TB NVMe SSD RAID 10',
      network: '10 Gbps',
      gpu: 'RTX A5000 / RTX 4080 (16GB VRAM) for advanced AI',
      os: 'Latest enterprise OS with extended support',
      serverOs: 'Windows Server 2022, RHEL 9, SLES 15 SP4, Ubuntu Server 22.04 LTS'
    },
    features: [
      'Advanced threat hunting',
      'SOAR automation',
      'Custom dashboards',
      'Multi-channel alerts',
      'Role-based access control',
      'Compliance frameworks',
      'API integrations',
      'Training modules'
    ],
    useCases: [
      'Multi-location businesses',
      'Compliance requirements',
      'Customer data protection',
      'Remote workforce security',
      'Vendor risk management'
    ]
  },
  enterprise: {
    icon: Building2,
    color: 'text-purple-400',
    name: 'Outpost Zero', // Rebranded name
    description: 'Enterprise-scale security with unlimited capabilities',
    pricing: 'Starting at $2,500/month',
    pricingDetails: '250 endpoints included, then $15/endpoint/month',
    trial: '30-day free trial',
    endpoints: '250+ endpoints (scalable)',
    users: 'Unlimited users',
    dataLimit: 'Custom limits (10TB+ included)',
    minSpecs: {
      cpu: '24 cores @ 3.5GHz (Intel Xeon Gold 6248R / AMD EPYC 7513)',
      architecture: 'x86-64 dual-socket capable',
      ram: '256 GB DDR4 ECC',
      storage: '20 TB NVMe SSD RAID 10',
      network: '25 Gbps',
      gpu: '2x RTX A6000 / RTX 4090 (48GB total VRAM) for AI cluster',
      os: 'Enterprise Linux (RHEL 9+, SLES 15+), Windows Server 2022',
      serverOs: 'Windows Server 2022 Datacenter, RHEL 9, SLES 15 SP4, VMware vSphere 8'
    },
    recommendedSpecs: {
      cpu: '48 cores @ 4.0GHz (Intel Xeon Platinum 8380 / AMD EPYC 7763)',
      architecture: 'x86-64 multi-socket with NUMA optimization',
      ram: '512 GB DDR4/DDR5 ECC',
      storage: '100 TB NVMe SSD with tiered storage',
      network: '100 Gbps',
      gpu: '4x RTX A100 / H100 (320GB total VRAM) for enterprise AI',
      os: 'High-availability cluster configuration',
      serverOs: 'Windows Server 2022 Datacenter, RHEL 9 HA, SLES 15 SP4 HA, VMware vSAN'
    },
    features: [
      'AI-powered predictive analysis',
      'Advanced SOAR workflows',
      'Custom integrations',
      'Global threat intelligence',
      'Multi-tenant support',
      'White-label options',
      '24/7 dedicated support',
      'Professional services'
    ],
    useCases: [
      'Large enterprise security',
      'Multi-national operations',
      'Critical infrastructure',
      'Supply chain security',
      'Advanced persistent threat defense'
    ]
  },
  government: {
    icon: Shield,
    color: 'text-red-400',
    name: 'RevSentinel Government', // Keep as is
    description: 'FedRAMP High authorized for federal agencies and defense contractors',
    pricing: 'Contact for pricing',
    pricingDetails: 'Classified pricing available',
    trial: 'Controlled evaluation environment',
    endpoints: 'Unlimited (air-gapped capable)',
    users: 'Unlimited with clearance verification',
    dataLimit: 'Unlimited with data sovereignty',
    minSpecs: {
      cpu: '32 cores @ 3.8GHz (Intel Xeon Gold 6348 / AMD EPYC 7543)',
      architecture: 'x86-64 with Intel TXT / AMD SVM',
      ram: '512 GB DDR4 ECC with encryption',
      storage: '50 TB encrypted NVMe SSD RAID 10',
      network: '40 Gbps with hardware encryption',
      gpu: '4x RTX A6000 (192GB VRAM) with secure boot',
      os: 'FIPS 140-2 validated OS (RHEL 9+ FIPS, Windows Server IoT)',
      serverOs: 'Windows Server 2022 LTSC, RHEL 9 FIPS, SLES 15 FIPS, Hardened Linux'
    },
    recommendedSpecs: {
      cpu: '64 cores @ 4.2GHz (Intel Xeon Platinum 8380H / AMD EPYC 7773X)',
      architecture: 'x86-64 with hardware security modules',
      ram: '1 TB DDR5 ECC with memory encryption',
      storage: '200 TB encrypted NVMe with WORM capability',
      network: '100 Gbps with quantum-safe encryption',
      gpu: '8x RTX A100 / H100 (640GB VRAM) for classified AI',
      os: 'Hardened OS with STIG compliance',
      serverOs: 'Windows Server 2022 LTSC STIG, RHEL 9 STIG, SLES 15 STIG, Trusted OS'
    },
    features: [
      'FedRAMP High authorization',
      'FIPS 140-2 Level 3 encryption',
      'Air-gapped deployment',
      'CDM Phase integration',
      'DISA STIG compliance',
      'Classified data support',
      'Quantum-safe cryptography',
      'Continuous monitoring'
    ],
    useCases: [
      'Federal agency security',
      'Defense contractor networks',
      'Intelligence operations',
      'Critical infrastructure',
      'National security missions'
    ]
  }
};

const competitorComparison = [
  {
    feature: 'Minimum RAM',
    axis_rebirth: '16 GB',
    revsentinel_enterprise: '256 GB',
    splunk: '12 GB',
    qradar: '16 GB',
    elastic: '8 GB'
  },
  {
    feature: 'Minimum CPU Cores',
    axis_rebirth: '6 cores',
    revsentinel_enterprise: '24 cores',
    splunk: '12 cores',
    qradar: '8 cores',
    elastic: '4 cores'
  },
  {
    feature: 'GPU Support',
    axis_rebirth: 'Optional RTX 3060+',
    revsentinel_enterprise: 'Required RTX A6000+',
    splunk: 'Not supported',
    qradar: 'Not supported',
    elastic: 'Limited'
  },
  {
    feature: 'Storage (Min)',
    axis_rebirth: '250 GB NVMe',
    revsentinel_enterprise: '20 TB NVMe',
    splunk: '500 GB',
    qradar: '1 TB',
    elastic: '200 GB'
  },
  {
    feature: 'AI Processing',
    axis_rebirth: 'GPU Accelerated',
    revsentinel_enterprise: 'Multi-GPU Cluster',
    splunk: 'CPU Only',
    qradar: 'CPU Only',
    elastic: 'Basic ML'
  }
];

const architectureSupport = [
  { arch: 'Intel x86-64', support: 'Full Support', performance: 'Optimized', notes: 'Best performance with AVX-512' },
  { arch: 'AMD x86-64', support: 'Full Support', performance: 'Optimized', notes: 'Excellent price/performance ratio' },
  { arch: 'ARM64 (Apple Silicon)', support: 'Residential Only', performance: 'Good', notes: 'M1/M2 Mac support via Rosetta 2' },
  { arch: 'ARM64 (Server)', support: 'Beta', performance: 'Limited', notes: 'AWS Graviton support coming soon' }
];

export default function SystemRequirementsPage() {
  const [selectedTier, setSelectedTier] = useState('residential');
  const currentTier = tierSpecs[selectedTier];
  const TierIcon = currentTier.icon;

  // Refactored helper function for spec icons
  const getSpecIcon = (key) => {
    const icons = {
      cpu: Cpu,
      architecture: Cpu,
      ram: Monitor,
      storage: HardDrive,
      network: Wifi,
      gpu: Zap,
      os: Server,
      serverOs: Server
    };
    return icons[key] || Info;
  };

  const getTierLogo = (tier) => {
    switch(tier) {
      case 'residential':
        return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/9e4a685e9_Screenshot2025-07-24111810.jpg";
      case 'smb':
      case 'enterprise':
        return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/3abd0f5ee_Screenshot2025-07-24112158.jpg";
      case 'government':
        return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/174051417_Screenshot2025-07-24110248.jpg";
      default:
        return null;
    }
  };

  const handleContactSales = (tier) => {
    alert(`CONTACTING SALES FOR ${tier.toUpperCase()} TIER\n\nIn production, this would:\n• Open a contact form\n• Schedule a demo call\n• Provide custom pricing\n• Connect with solutions engineer\n• Generate requirements assessment`);
  };

  const handleStartTrial = (tier) => {
    if (tier === 'government') {
      alert('GOVERNMENT TIER CONTACT\n\nGovernment deployments require:\n• Security clearance verification\n• FedRAMP compliance review\n• Custom deployment planning\n• Please contact our federal sales team');
      return;
    }
    alert(`STARTING ${tier.toUpperCase()} TRIAL\n\nIn production, this would:\n• Create trial account\n• Provision cloud environment\n• Send setup instructions\n• Schedule onboarding call\n• Provide training materials`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Platform Requirements & Pricing</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the right solution for your needs. From home users to federal agencies,
            we have the perfect tier with AI-accelerated security capabilities.
          </p>
        </div>

        <Tabs value={selectedTier} onValueChange={setSelectedTier} className="w-full mb-12">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {Object.entries(tierSpecs).map(([key, tier]) => {
              const Icon = tier.icon;
              return (
                <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${tier.color}`} />
                  {tier.name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(tierSpecs).map(([key, tier]) => (
            <TabsContent key={key} value={key}>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Tier Overview */}
                <Card className="border-gray-700 bg-gray-800/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      {getTierLogo(key) ? (
                        <img src={getTierLogo(key)} alt={`${tier.name} Logo`} className="w-12 h-12 object-contain" />
                      ) : (
                        <TierIcon className={`w-8 h-8 ${tier.color}`} />
                      )}
                      {tier.name}
                    </CardTitle>
                    <p className="text-gray-300">{tier.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-gray-900/50 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Pricing</h4>
                        <p className="text-2xl font-bold text-green-400">{tier.pricing}</p>
                        {tier.pricingDetails && (
                          <p className="text-sm text-gray-400 mt-1">{tier.pricingDetails}</p>
                        )}
                        <p className="text-sm text-gray-400">{tier.trial}</p>
                      </div>
                      <div className="p-4 bg-gray-900/50 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Capacity</h4>
                        <p className="text-sm text-gray-300">{tier.endpoints}</p>
                        <p className="text-sm text-gray-300">{tier.users}</p>
                        <p className="text-sm text-gray-300">{tier.dataLimit}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-3">Key Features</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {tier.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleStartTrial(key)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        disabled={key === 'government'}
                      >
                        {key === 'government' ? 'Request Access' : 'Start Trial'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleContactSales(key)}
                        className="border-gray-600 text-gray-300"
                      >
                        Get Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* System Requirements */}
                <Card className="border-gray-700 bg-gray-800/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Server className="w-6 h-6 text-cyan-400" />
                      System Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                        <h4 className="font-semibold text-white">Minimum Requirements</h4>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(tier.minSpecs).map(([key, value]) => {
                          const IconComponent = getSpecIcon(key); // Using refactored helper

                          return (
                            <div key={key} className="p-3 bg-gray-900/30 rounded border-l-2 border-orange-400/50">
                              <div className="flex items-center gap-2 mb-1">
                                <IconComponent className="w-4 h-4 text-orange-400" />
                                <span className="text-sm font-medium text-white capitalize">
                                  {key === 'serverOs' ? 'Server OS' : key.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-300 ml-6">{value}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <h4 className="font-semibold text-white">Recommended Specs</h4>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(tier.recommendedSpecs).map(([key, value]) => {
                          const IconComponent = getSpecIcon(key); // Using refactored helper

                          return (
                            <div key={key} className="p-3 bg-gray-900/30 rounded border-l-2 border-green-400/50">
                              <div className="flex items-center gap-2 mb-1">
                                <IconComponent className="w-4 h-4 text-green-400" />
                                <span className="text-sm font-medium text-white capitalize">
                                  {key === 'serverOs' ? 'Server OS' : key.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-300 ml-6">{value}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-3">Common Use Cases</h4>
                      <div className="space-y-2">
                        {tier.useCases.map((useCase, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-300 text-sm">{useCase}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Architecture Support */}
        <Card className="border-gray-700 bg-gray-800/50 mb-8">
          <CardHeader>
            <CardTitle className="text-white">CPU Architecture Support</CardTitle>
            <p className="text-gray-300">Platform optimizations across different processor architectures</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b-gray-700 hover:bg-transparent">
                  <TableHead className="text-white">Architecture</TableHead>
                  <TableHead className="text-white">Support Level</TableHead>
                  <TableHead className="text-white">Performance</TableHead>
                  <TableHead className="text-white">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {architectureSupport.map((arch, index) => (
                  <TableRow key={index} className="border-b-gray-800">
                    <TableCell className="font-medium text-white">{arch.arch}</TableCell>
                    <TableCell>
                      <Badge className={arch.support === 'Full Support' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}>
                        {arch.support}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{arch.performance}</TableCell>
                    <TableCell className="text-gray-400 text-sm">{arch.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Competitor Comparison */}
        <Card className="border-gray-700 bg-gray-800/50 mb-8">
          <CardHeader>
            <CardTitle className="text-white">System Requirements: Our Platform vs Competition</CardTitle>
            <p className="text-gray-300">See how our AI-powered requirements compare to traditional SIEM solutions</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b-gray-700 hover:bg-transparent">
                  <TableHead className="text-white">Requirement</TableHead>
                  <TableHead className="text-white">AXIS Rebirth</TableHead> {/* Updated name */}
                  <TableHead className="text-white">Outpost Zero</TableHead> {/* Updated name */}
                  <TableHead className="text-white">Splunk Enterprise</TableHead>
                  <TableHead className="text-white">IBM QRadar</TableHead>
                  <TableHead className="text-white">Elastic SIEM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitorComparison.map((row, index) => (
                  <TableRow key={index} className="border-b-gray-800">
                    <TableCell className="font-medium text-white">{row.feature}</TableCell>
                    <TableCell className="text-green-400 font-semibold">{row.axis_rebirth}</TableCell>
                    <TableCell className="text-purple-400 font-semibold">{row.revsentinel_enterprise}</TableCell>
                    <TableCell className="text-gray-300">{row.splunk}</TableCell>
                    <TableCell className="text-gray-300">{row.qradar}</TableCell>
                    <TableCell className="text-gray-300">{row.elastic}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* GPU Acceleration Info */}
        <Card className="border-purple-500/50 bg-gray-800/50 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-400" />
              GPU Acceleration for AI Workloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Why GPU Matters</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• 10-50x faster threat detection processing</li>
                  <li>• Real-time behavioral analysis for large datasets</li>
                  <li>• Enhanced machine learning model training</li>
                  <li>• Parallel processing of multiple data streams</li>
                  <li>• Advanced natural language processing for logs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Recommended GPUs by Tier</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-900/50 rounded">
                    <span className="font-medium text-green-400">AXIS Rebirth:</span> {/* Updated name */}
                    <p className="text-sm text-gray-300">RTX 3060/4060 - Consumer AI acceleration</p>
                  </div>
                  <div className="p-3 bg-gray-900/50 rounded">
                    <span className="font-medium text-blue-400">RevSentinel:</span> {/* Updated name */}
                    <p className="text-sm text-gray-300">RTX A4000/4070 - Professional workstation</p>
                  </div>
                  <div className="p-3 bg-gray-900/50 rounded">
                    <span className="font-medium text-purple-400">Outpost Zero:</span> {/* Updated name */}
                    <p className="text-sm text-gray-300">RTX A6000/A100 - Enterprise AI cluster</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white">Why Choose Our Platform?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">AI-First Architecture</h4>
                    <p className="text-sm text-gray-300">Built from the ground up for GPU-accelerated AI processing across all tiers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">Scalable from Day One</h4>
                    <p className="text-sm text-gray-300">Start with AXIS Rebirth and seamlessly upgrade to RevSentinel or Outpost Zero as you grow</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">Future-Proof Security</h4>
                    <p className="text-sm text-gray-300">Post-quantum cryptography and advanced AI capabilities built-in</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white">Deployment Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-900/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Cloud Deployment</h4>
                  <p className="text-sm text-gray-300">GPU-accelerated cloud instances with auto-scaling for RevSentinel and Outpost Zero.</p>
                </div>
                <div className="p-4 bg-gray-900/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">On-Premises</h4>
                  <p className="text-sm text-gray-300">Full control with dedicated GPU hardware for maximum performance across all tiers.</p>
                </div>
                <div className="p-4 bg-gray-900/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Hybrid Deployment</h4>
                  <p className="text-sm text-gray-300">Local GPU processing with cloud AI model updates and backup capabilities.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
