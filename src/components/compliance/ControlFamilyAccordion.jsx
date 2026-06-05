import React, { useState } from 'react';
import _ from 'lodash';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertTriangle, Clock, UploadCloud, Eye, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const getStatusBadge = (status) => {
    const statusMap = {
        "Compliant": { color: "bg-green-500/20 text-green-300 border-green-500/50", icon: <CheckCircle className="w-3 h-3 mr-1" /> },
        "Non-Compliant": { color: "bg-red-500/20 text-red-300 border-red-500/50", icon: <XCircle className="w-3 h-3 mr-1" /> },
        "Partially Compliant": { color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50", icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
        "In Progress": { color: "bg-blue-500/20 text-blue-300 border-blue-500/50", icon: <Clock className="w-3 h-3 mr-1" /> },
        "Not Assessed": { color: "bg-gray-500/20 text-gray-300 border-gray-500/50", icon: <Clock className="w-3 h-3 mr-1" /> }
    };
    const config = statusMap[status] || statusMap["Not Assessed"];
    return <Badge variant="outline" className={`${config.color} flex items-center text-xs`}>{config.icon}<span className="hidden sm:inline-block">{status}</span></Badge>;
};

const getAutomatedStatusBadge = (status) => {
    const statusMap = {
        "Passed": { color: "bg-green-500/20 text-green-300 border-green-500/50", icon: <CheckCircle className="w-3 h-3 mr-1" /> },
        "Failed": { color: "bg-red-500/20 text-red-300 border-red-500/50", icon: <XCircle className="w-3 h-3 mr-1" /> },
        "Needs Review": { color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50", icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
        "Not Applicable": { color: "bg-gray-500/20 text-gray-300 border-gray-500/50", icon: null }
    };
    const config = statusMap[status] || statusMap["Not Applicable"];
    return <Badge variant="outline" className={`${config.color} flex items-center text-xs`}>
        {config.icon}<span className="hidden sm:inline-block">{status}</span>
    </Badge>;
};

const ComplianceMetrics = ({ controls }) => {
    const totalControls = controls.length;
    const compliantControls = controls.filter(c => c.status === 'Compliant').length;
    const nonCompliantControls = controls.filter(c => c.status === 'Non-Compliant').length;
    const partiallyCompliantControls = controls.filter(c => c.status === 'Partially Compliant').length;
    const inProgressControls = controls.filter(c => c.status === 'In Progress').length;
    const notAssessedControls = controls.filter(c => c.status === 'Not Assessed').length;
    
    const compliancePercentage = Math.round((compliantControls / totalControls) * 100);
    
    const automatedPassed = controls.filter(c => c.automated_validation_status === 'Passed').length;
    const automatedTotal = controls.filter(c => c.automated_validation_status !== 'Not Applicable').length;
    const automationCoverage = automatedTotal > 0 ? Math.round((automatedPassed / automatedTotal) * 100) : 0;

    return (
        <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card className="border-gray-700 bg-gray-800/30">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-300">Overall Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-400">{compliancePercentage}%</div>
                    <Progress value={compliancePercentage} className="mt-2 h-2" />
                    <div className="text-xs text-gray-400 mt-1">{compliantControls} / {totalControls} controls</div>
                </CardContent>
            </Card>
            
            <Card className="border-gray-700 bg-gray-800/30">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-300">Automation Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-400">{automationCoverage}%</div>
                    <Progress value={automationCoverage} className="mt-2 h-2" />
                    <div className="text-xs text-gray-400 mt-1">{automatedTotal} controls automated</div>
                </CardContent>
            </Card>
            
            <Card className="border-gray-700 bg-gray-800/30">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-300">Needs Attention</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-400">{nonCompliantControls + partiallyCompliantControls}</div>
                    <div className="text-xs text-gray-400 mt-1">{nonCompliantControls} non-compliant, {partiallyCompliantControls} partial</div>
                </CardContent>
            </Card>
            
            <Card className="border-gray-700 bg-gray-800/30">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-300">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-400">{inProgressControls + notAssessedControls}</div>
                    <div className="text-xs text-gray-400 mt-1">{inProgressControls} in progress, {notAssessedControls} not assessed</div>
                </CardContent>
            </Card>
        </div>
    );
};

export default function ControlFamilyAccordion({ frameworkControls }) {
    const [expandedFamily, setExpandedFamily] = useState(null);

    if (!frameworkControls || frameworkControls.length === 0) {
        return <div className="text-center text-gray-400 py-10">No controls found for this framework.</div>;
    }

    const groupedControls = _.groupBy(frameworkControls, 'family');

    const handleUploadEvidence = (controlId) => {
        alert(`UPLOAD EVIDENCE\n\nControl ID: ${controlId}\n\nIn a real application, this would open a file upload dialog to attach evidence to this control for SCA review.`);
    };

    const handleViewDetails = (control) => {
        alert(`CONTROL DETAILS\n\nControl: ${control.control_id} - ${control.name}\n\nDescription: ${control.description}\n\nStatus: ${control.status}\nAutomated Check: ${control.automated_validation_status}\n\nIn a real application, this would open a detailed view with assessment notes, evidence attachments, and remediation guidance.`);
    };

    const handleGenerateReport = (family, controls) => {
        const compliantCount = controls.filter(c => c.status === 'Compliant').length;
        alert(`GENERATE ASSESSMENT REPORT\n\nFamily: ${family}\nControls: ${controls.length}\nCompliant: ${compliantCount}\nCompletion: ${Math.round((compliantCount/controls.length)*100)}%\n\nIn a real application, this would generate a detailed SCA assessment report in PDF format with evidence attachments, findings, and recommendations.`);
    };

    return (
        <div className="space-y-4">
            <ComplianceMetrics controls={frameworkControls} />
            
            <Accordion type="single" collapsible className="w-full space-y-2">
                {Object.entries(groupedControls).map(([family, controls]) => {
                    const compliantCount = controls.filter(c => c.status === 'Compliant').length;
                    const compliancePercentage = Math.round((compliantCount / controls.length) * 100);
                    const automatedCount = controls.filter(c => c.automated_validation_status === 'Passed').length;
                    
                    return (
                        <AccordionItem 
                            key={family} 
                            value={family} 
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 hover:bg-gray-800/70 transition-colors"
                        >
                            <AccordionTrigger className="hover:no-underline text-lg font-semibold text-white py-4">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <span className="text-left">{family}</span>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                                            {compliancePercentage}% Compliant
                                        </Badge>
                                        <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                                            {automatedCount} Automated
                                        </Badge>
                                        <span className="text-sm text-gray-400">{controls.length} controls</span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                                <div className="mb-4 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <Progress value={compliancePercentage} className="w-48 h-2" />
                                        <span className="text-sm text-gray-300">{compliantCount} / {controls.length} compliant</span>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => handleGenerateReport(family, controls)}
                                        className="bg-purple-600/20 border-purple-500/50 text-purple-300 hover:bg-purple-600/30"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Generate Report
                                    </Button>
                                </div>
                                
                                <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b-gray-600 bg-gray-900/30">
                                                <TableHead className="text-gray-200 font-semibold">Control ID</TableHead>
                                                <TableHead className="text-gray-200 font-semibold">Control Name</TableHead>
                                                <TableHead className="text-gray-200 font-semibold text-center">Status</TableHead>
                                                <TableHead className="text-gray-200 font-semibold text-center">Automated</TableHead>
                                                <TableHead className="text-gray-200 font-semibold text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {controls.map(control => (
                                                <TableRow 
                                                    key={control.control_id} 
                                                    className="border-b-gray-700/50 hover:bg-gray-800/30 transition-colors"
                                                >
                                                    <TableCell className="font-mono text-sm text-blue-400 font-semibold">
                                                        {control.control_id}
                                                    </TableCell>
                                                    <TableCell className="text-gray-100 max-w-md">
                                                        <div className="truncate">{control.name}</div>
                                                        <div className="text-xs text-gray-400 truncate">{control.description}</div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {getStatusBadge(control.status)}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {getAutomatedStatusBadge(control.automated_validation_status)}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                onClick={() => handleViewDetails(control)}
                                                                className="bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/30 px-2"
                                                            >
                                                                <Eye className="w-3 h-3" />
                                                            </Button>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                onClick={() => handleUploadEvidence(control.control_id)}
                                                                className="bg-green-600/20 border-green-500/50 text-green-300 hover:bg-green-600/30 px-2"
                                                            >
                                                                <UploadCloud className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}