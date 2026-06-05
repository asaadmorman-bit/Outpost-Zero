import React, { useState, useEffect } from 'react';
import { FrameworkControl } from '@/entities/FrameworkControl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, FileCheck, AlertTriangle, CheckCircle, Clock, Download, Upload, Settings } from 'lucide-react';
import ControlFamilyAccordion from '../components/compliance/ControlFamilyAccordion';

export default function CompliancePage() {
    const [controls, setControls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('RMF');

    useEffect(() => {
        loadControls();
    }, []);

    const loadControls = async () => {
        try {
            setLoading(true);
            const allControls = await FrameworkControl.list();
            setControls(allControls);
        } catch (error) {
            console.error('Error loading controls:', error);
            // Fallback to sample data if entity doesn't exist yet
            setControls(getSampleControls());
        } finally {
            setLoading(false);
        }
    };

    const getSampleControls = () => [
        {
            control_id: "AC-1",
            framework: "RMF",
            family: "Access Control",
            name: "Access Control Policy and Procedures",
            description: "Develop, document, and disseminate an access control policy and procedures.",
            status: "Compliant",
            automated_validation_status: "Passed"
        },
        {
            control_id: "AC-2",
            framework: "RMF",
            family: "Access Control",
            name: "Account Management",
            description: "Manage information system accounts, including establishing, activating, modifying, disabling, and removing accounts.",
            status: "Partially Compliant",
            automated_validation_status: "Needs Review"
        },
        {
            control_id: "AU-1",
            framework: "RMF",
            family: "Audit and Accountability",
            name: "Audit and Accountability Policy and Procedures",
            description: "The organization develops, documents, and disseminates audit and accountability policy.",
            status: "Compliant",
            automated_validation_status: "Passed"
        },
        {
            control_id: "CM-1",
            framework: "RMF",
            family: "Configuration Management",
            name: "Configuration Management Policy and Procedures",
            description: "The organization develops, documents, and disseminates configuration management policy.",
            status: "Compliant",
            automated_validation_status: "Passed"
        },
        {
            control_id: "AC.1.001",
            framework: "CMMC",
            family: "Access Control (AC)",
            name: "Limit information system access to authorized users",
            description: "Limit information system access to authorized users, processes acting on behalf of authorized users, or devices.",
            status: "Compliant",
            automated_validation_status: "Passed"
        },
        {
            control_id: "AU.2.041",
            framework: "CMMC",
            family: "Audit and Accountability (AU)",
            name: "Ensure that the actions of individual system users can be uniquely traced",
            description: "Ensure that the actions of individual system users can be uniquely traced to those users.",
            status: "Compliant",
            automated_validation_status: "Passed"
        },
        {
            control_id: "CM.2.061",
            framework: "CMMC",
            family: "Configuration Management (CM)",
            name: "Establish and maintain baseline configurations",
            description: "Establish and maintain baseline configurations and inventories of organizational information systems.",
            status: "Partially Compliant",
            automated_validation_status: "Failed"
        },
        {
            control_id: "JSIG-SSG-1.1",
            framework: "JSIG",
            family: "System Security Governance (SSG)",
            name: "Security Officer Assignment",
            description: "A senior security officer is designated to manage security functions within the organization.",
            status: "Compliant",
            automated_validation_status: "Not Applicable"
        },
        {
            control_id: "JSIG-SAA-2.1",
            framework: "JSIG",
            family: "Security Assessment and Authorization (SAA)",
            name: "Security Plan",
            description: "Develop and maintain a system security plan (SSP).",
            status: "Compliant",
            automated_validation_status: "Passed"
        },
        {
            control_id: "JSIG-TCG-3.1",
            framework: "JSIG",
            family: "Technical Controls Governance (TCG)",
            name: "Access Control Implementation",
            description: "Technical access controls are implemented to restrict system access to authorized users.",
            status: "Compliant",
            automated_validation_status: "Passed"
        }
    ];

    const getFrameworkControls = (framework) => {
        return controls.filter(control => control.framework === framework);
    };

    const getFrameworkStats = (framework) => {
        const frameworkControls = getFrameworkControls(framework);
        const total = frameworkControls.length;
        const compliant = frameworkControls.filter(c => c.status === 'Compliant').length;
        const automated = frameworkControls.filter(c => c.automated_validation_status === 'Passed').length;
        
        return {
            total,
            compliant,
            automated,
            compliancePercentage: total > 0 ? Math.round((compliant / total) * 100) : 0,
            automationPercentage: total > 0 ? Math.round((automated / total) * 100) : 0
        };
    };

    const frameworkDescriptions = {
        RMF: "Risk Management Framework - NIST SP 800-37 provides guidelines for applying the Risk Management Framework to federal information systems.",
        CMMC: "Cybersecurity Maturity Model Certification - DoD framework for protecting Controlled Unclassified Information (CUI) in the defense industrial base.",
        JSIG: "Joint Special Operations Command Information Systems Security Implementation Guide - Specialized security requirements for JSOC environments."
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-gray-300">Loading compliance controls...</div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-8 h-8 text-blue-400" />
                    <h1 className="text-3xl font-bold text-white">Automated Compliance Assessment</h1>
                </div>
                <p className="text-gray-300 text-lg">
                    Streamline your compliance assessments with automated control validation and evidence management for Security Control Assessor (SCA) teams.
                </p>
            </div>

            {/* Overall Metrics */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {['RMF', 'CMMC', 'JSIG'].map(framework => {
                    const stats = getFrameworkStats(framework);
                    return (
                        <Card key={framework} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
                                    {framework}
                                    <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                                        {stats.total} Controls
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-300">Compliance</span>
                                        <span className="text-green-400 font-medium">{stats.compliancePercentage}%</span>
                                    </div>
                                    <Progress value={stats.compliancePercentage} className="h-2" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-300">Automated</span>
                                        <span className="text-cyan-400 font-medium">{stats.automationPercentage}%</span>
                                    </div>
                                    <Progress value={stats.automationPercentage} className="h-2" />
                                </div>
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>{stats.compliant} Compliant</span>
                                    <span>{stats.automated} Automated</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mb-8">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Controls
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Download className="w-4 h-4 mr-2" />
                    Export Assessment
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Automation
                </Button>
            </div>

            {/* Framework Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700">
                    <TabsTrigger value="RMF" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                        RMF (NIST 800-37)
                    </TabsTrigger>
                    <TabsTrigger value="CMMC" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                        CMMC 2.0
                    </TabsTrigger>
                    <TabsTrigger value="JSIG" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                        JSIG
                    </TabsTrigger>
                </TabsList>

                {['RMF', 'CMMC', 'JSIG'].map(framework => (
                    <TabsContent key={framework} value={framework} className="mt-6">
                        <Card className="bg-gray-800/30 border-gray-700 mb-6">
                            <CardContent className="pt-6">
                                <p className="text-gray-300 leading-relaxed">
                                    {frameworkDescriptions[framework]}
                                </p>
                            </CardContent>
                        </Card>
                        
                        <ControlFamilyAccordion 
                            frameworkControls={getFrameworkControls(framework)} 
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}