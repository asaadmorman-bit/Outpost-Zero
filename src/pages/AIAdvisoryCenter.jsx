
import React, { useState, useEffect } from 'react';
import { AIAdvisory } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AdvisoryCard from '../components/ai-advisory/AdvisoryCard';
import AdvisoryDetails from '../components/ai-advisory/AdvisoryDetails';

// Mock Data for Demonstration
const mockAdvisories = [
    { advisory_id: 'adv_001', advisory_type: 'misconfiguration_remediation', severity: 'high', title: 'Public S3 Bucket Detected', summary: 'A public S3 bucket containing sensitive data has been detected. Immediate remediation is required to prevent data exposure.', status: 'pending', confidence_score: 98, detailed_analysis: 'AI analysis indicates the bucket "prod-assets-123" has a public read ACL. This violates CIS Benchmark 1.2 and could lead to a major data breach.', step_by_step_guidance: [{step_number: 1, action: 'Navigate to S3 console and select bucket "prod-assets-123".', role_responsible: 'Cloud Engineer', automation_available: true}, {step_number: 2, action: 'Under "Permissions", edit "Block public access (bucket settings)" and turn on all four settings.', role_responsible: 'Cloud Engineer', automation_available: true}], trigger_source: 'AWS GuardDuty'},
    { advisory_id: 'adv_002', advisory_type: 'incident_response', severity: 'critical', title: 'Suspected Ransomware Activity', summary: 'Anomalous file encryption activity detected on server "FS-02", consistent with ransomware behavior.', status: 'pending', confidence_score: 95, detailed_analysis: 'Multiple files are being rapidly encrypted with a new extension. This is a strong indicator of a ransomware attack in progress.', step_by_step_guidance: [{step_number: 1, action: 'Isolate server "FS-02" from the network immediately.', role_responsible: 'Incident Responder', automation_available: true}], trigger_source: 'Endpoint Detection'},
    { advisory_id: 'adv_003', advisory_type: 'iam_recommendation', severity: 'medium', title: 'Over-privileged IAM Role', summary: 'The IAM role "Dev-ReadOnly" has permissions to delete resources, which violates the principle of least privilege.', status: 'acknowledged', confidence_score: 99, detailed_analysis: 'The role has "s3:DeleteObject" permission but has only ever been used for "s3:GetObject".', step_by_step_guidance: [{step_number: 1, action: 'Review IAM policy for "Dev-ReadOnly" and remove the "s3:DeleteObject" permission.', role_responsible: 'IAM Admin', automation_available: false}], trigger_source: 'IAM Audit'},
    { advisory_id: 'adv_004', advisory_type: 'vulnerability_management', severity: 'low', title: 'Outdated Library Detected', summary: 'A non-critical application is using an outdated version of a common library with a minor known vulnerability.', status: 'pending', confidence_score: 85, detailed_analysis: 'Library "log4j-1.2.17" detected. Upgrade to a newer version to address CVE-2022-XXXX.', step_by_step_guidance: [{step_number: 1, action: 'Identify applications using log4j-1.2.17.', role_responsible: 'DevOps Engineer', automation_available: false}], trigger_source: 'Vulnerability Scanner'},
    { advisory_id: 'adv_005', advisory_type: 'cost_optimization', severity: 'info', title: 'Underutilized EC2 Instance', summary: 'EC2 instance "web-prod-03" has consistently low CPU utilization over the past 30 days, indicating potential for rightsizing.', status: 'pending', confidence_score: 90, detailed_analysis: 'Average CPU utilization < 5% over 30 days. Consider downsizing from m5.large to t3.medium.', step_by_step_guidance: [{step_number: 1, action: 'Review historical metrics for "web-prod-03".', role_responsible: 'Cloud Architect', automation_available: false}], trigger_source: 'CloudWatch Metrics'},
];

export default function AIAdvisoryCenter() {
    const [advisories, setAdvisories] = useState(mockAdvisories);
    const [selectedAdvisory, setSelectedAdvisory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [severityFilter, setSeverityFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadAdvisories = async () => {
            setIsLoading(true);
            try {
                // In a real application, AIAdvisory.list() would fetch data from an API.
                // For this mock, we simulate loading time and then use mock data.
                const advisoryData = await new Promise(resolve => setTimeout(() => resolve(AIAdvisory.list ? AIAdvisory.list() : mockAdvisories), 1000));
                setAdvisories(advisoryData.length ? advisoryData : mockAdvisories);
            } catch (error) {
                console.error("Failed to load advisories:", error);
                setAdvisories(mockAdvisories); // Fallback to mock data on error
            } finally {
                setIsLoading(false);
            }
        };
        loadAdvisories();
        setSelectedAdvisory(mockAdvisories[0]); // Select the first advisory by default
    }, []);

    const filteredAdvisories = advisories.filter(advisory => {
        const term = searchTerm.toLowerCase();
        // Check if trigger_source exists before calling toLowerCase(). This helps against undefined errors.
        const matchesSearch = advisory.title.toLowerCase().includes(term) || 
                            (advisory.trigger_source && advisory.trigger_source.toLowerCase().includes(term));
        const matchesSeverity = severityFilter === 'all' || advisory.severity === severityFilter;
        return matchesSearch && matchesSeverity;
    });

    const severityFilters = [
        { value: 'all', label: 'All', color: 'bg-blue-600 hover:bg-blue-700' },
        { value: 'critical', label: 'Critical', color: 'bg-red-600 hover:bg-red-700' },
        { value: 'high', label: 'High', color: 'bg-orange-500 hover:bg-orange-600' },
        { value: 'medium', label: 'Medium', color: 'bg-yellow-500 hover:bg-yellow-600' },
        { value: 'low', label: 'Low', color: 'bg-green-600 hover:bg-green-700' },
        { value: 'info', label: 'Info', color: 'bg-gray-500 hover:bg-gray-600' }
    ];

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Brain className="w-8 h-8 text-blue-400" /> AI Advisory Center
                    </h1>
                    <p className="text-gray-300">Actionable, AI-driven recommendations to improve your security posture.</p>
                </div>

                <Card className="mb-6 border-gray-700 bg-gray-800/50">
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full md:w-auto">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search advisories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-gray-900 border-gray-700/50 text-white"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap items-center">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300 font-medium">Severity:</span>
                            {severityFilters.map(filter => (
                                <Button
                                  key={filter.value}
                                  variant={severityFilter === filter.value ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setSeverityFilter(filter.value)}
                                  className={
                                    severityFilter === filter.value
                                      ? `${filter.color} text-white`
                                      : 'btn-outline-inactive bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white' // Added specific dark mode classes for outline button
                                  }
                                >
                                  {filter.label}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4 h-[75vh] overflow-y-auto app-scrollbar pr-2">
                        {isLoading ? <p className="text-white">Loading advisories...</p> :
                            filteredAdvisories.length > 0 ? (
                                filteredAdvisories.map(adv => (
                                    <AdvisoryCard
                                        key={adv.advisory_id}
                                        advisory={adv}
                                        onClick={() => setSelectedAdvisory(adv)}
                                        isSelected={selectedAdvisory?.advisory_id === adv.advisory_id}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-400">No advisories found matching your criteria.</p>
                            )
                        }
                    </div>
                    <div className="lg:col-span-2">
                        <AdvisoryDetails advisory={selectedAdvisory} />
                    </div>
                </div>
            </div>
        </div>
    );
}
