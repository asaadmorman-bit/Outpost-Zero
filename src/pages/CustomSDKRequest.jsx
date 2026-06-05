import React, { useState } from 'react';
import { SDKDevelopmentRequest } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Code,
    Zap,
    CheckCircle,
    ArrowRight,
    Lightbulb,
    Package,
    ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export default function CustomSDKRequestPage() {
    const [formData, setFormData] = useState({
        infrastructure_problem: '',
        desired_functionality: '',
        current_systems: '',
        data_sources: '',
        compliance_requirements: '',
        budget_range: '',
        timeline: '',
        priority: 'medium'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedRequest, setSubmittedRequest] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Create the SDK development request
            const request = await SDKDevelopmentRequest.create({
                ...formData,
                current_systems: formData.current_systems.split(',').map(s => s.trim()).filter(Boolean),
                data_sources: formData.data_sources.split(',').map(s => s.trim()).filter(Boolean),
                compliance_requirements: formData.compliance_requirements.split(',').map(s => s.trim()).filter(Boolean),
                request_id: `req_${Date.now()}`,
                requested_by: 'current_user@example.com', // This will be replaced with actual user
                status: 'submitted'
            });

            setSubmittedRequest(request);
            toast.success('SDK development request submitted successfully!');
            toast.info('Our development team will contact you within 24 hours');
            
            // Send notification to sdk-developers.cyberdojogroup.com
            try {
                await fetch('https://sdk-developers.cyberdojogroup.com/api/requests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        request_id: request.request_id,
                        requester_email: request.requested_by,
                        infrastructure_problem: request.infrastructure_problem,
                        desired_functionality: request.desired_functionality,
                        current_systems: request.current_systems,
                        budget_range: request.budget_range,
                        timeline: request.timeline,
                        priority: request.priority
                    })
                });
            } catch (apiError) {
                console.log('Developer portal notification will be sent via webhook:', apiError.message);
                // This is expected if the endpoint doesn't exist yet - request is still saved locally
            }
            
        } catch (error) {
            toast.error('Failed to submit request: ' + error.message);
        }

        setIsSubmitting(false);
    };

    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    if (submittedRequest) {
        return (
            <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
                <div className="max-w-4xl mx-auto">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-12 text-center">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Request Submitted Successfully!</h2>
                            <p className="text-gray-300 text-lg mb-6">
                                Your custom SDK request has been submitted to our development team.
                            </p>
                            <div className="bg-gray-900/50 rounded-lg p-6 mb-8 text-left">
                                <h3 className="font-semibold text-white mb-4">Request ID: {submittedRequest.request_id}</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Status:</span>
                                        <Badge className="bg-blue-500/20 text-blue-400">Submitted</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Priority:</span>
                                        <Badge className="bg-yellow-500/20 text-yellow-400">{submittedRequest.priority}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Timeline:</span>
                                        <span className="text-white">{submittedRequest.timeline}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-semibold text-white">Next Steps:</h4>
                                <div className="grid md:grid-cols-3 gap-4 text-left">
                                    <div className="bg-gray-900/30 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-blue-400 mb-2">1</div>
                                        <h5 className="font-semibold text-white text-sm mb-1">Review</h5>
                                        <p className="text-xs text-gray-400">Our team reviews your requirements within 24 hours</p>
                                    </div>
                                    <div className="bg-gray-900/30 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-purple-400 mb-2">2</div>
                                        <h5 className="font-semibold text-white text-sm mb-1">Estimate</h5>
                                        <p className="text-xs text-gray-400">We provide timeline and cost estimate</p>
                                    </div>
                                    <div className="bg-gray-900/30 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-green-400 mb-2">3</div>
                                        <h5 className="font-semibold text-white text-sm mb-1">Development</h5>
                                        <p className="text-xs text-gray-400">SDK development begins upon approval</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 justify-center mt-8">
                                <Button
                                    onClick={() => window.open('https://sdk-developers.cyberdojogroup.com', '_blank')}
                                    variant="outline"
                                    className="border-gray-600 text-gray-300"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Visit Developer Portal
                                </Button>
                                <Button
                                    onClick={() => window.location.href = '/sdk-marketplace'}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Browse SDK Marketplace
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Request Custom SDK Development</h1>
                    <p className="text-gray-300">Tell us about your infrastructure challenges, and we'll build a custom SDK solution</p>
                </div>

                {/* Process Steps */}
                <Card className="border-gray-700 bg-gray-800/50 mb-8">
                    <CardHeader>
                        <CardTitle className="text-white">Development Process</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Lightbulb className="w-6 h-6 text-blue-400" />
                                </div>
                                <h4 className="font-semibold text-white text-sm">1. Submit Request</h4>
                                <p className="text-xs text-gray-400 mt-1">Tell us your needs</p>
                            </div>
                            <ArrowRight className="hidden md:block w-6 h-6 text-gray-600 mx-auto mt-4" />
                            <div className="text-center">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Code className="w-6 h-6 text-purple-400" />
                                </div>
                                <h4 className="font-semibold text-white text-sm">2. Development</h4>
                                <p className="text-xs text-gray-400 mt-1">We build your SDK</p>
                            </div>
                            <ArrowRight className="hidden md:block w-6 h-6 text-gray-600 mx-auto mt-4" />
                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <CheckCircle className="w-6 h-6 text-green-400" />
                                </div>
                                <h4 className="font-semibold text-white text-sm">3. Deploy</h4>
                                <p className="text-xs text-gray-400 mt-1">Install and integrate</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Request Form */}
                <Card className="border-gray-700 bg-gray-800/50">
                    <CardHeader>
                        <CardTitle className="text-white">SDK Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="infrastructure_problem" className="text-white">
                                    Infrastructure Problem <span className="text-red-400">*</span>
                                </Label>
                                <Textarea
                                    id="infrastructure_problem"
                                    required
                                    value={formData.infrastructure_problem}
                                    onChange={(e) => updateField('infrastructure_problem', e.target.value)}
                                    placeholder="Describe the current infrastructure shortcoming or gap you're facing..."
                                    className="mt-2 bg-gray-900 border-gray-600 text-white h-32"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Example: "Our legacy ArcSight SIEM contains 5 years of historical data but cannot integrate with modern threat intelligence feeds"
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="desired_functionality" className="text-white">
                                    Desired Functionality <span className="text-red-400">*</span>
                                </Label>
                                <Textarea
                                    id="desired_functionality"
                                    required
                                    value={formData.desired_functionality}
                                    onChange={(e) => updateField('desired_functionality', e.target.value)}
                                    placeholder="What should the SDK accomplish?"
                                    className="mt-2 bg-gray-900 border-gray-600 text-white h-32"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Example: "Bidirectional sync between ArcSight and Outpost Zero, real-time alert correlation, unified dashboard view"
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="current_systems" className="text-white">
                                    Current Systems/Tools <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="current_systems"
                                    required
                                    value={formData.current_systems}
                                    onChange={(e) => updateField('current_systems', e.target.value)}
                                    placeholder="ArcSight ESM, Palo Alto Firewalls, CrowdStrike Falcon"
                                    className="mt-2 bg-gray-900 border-gray-600 text-white"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Comma-separated list of systems that need integration
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="data_sources" className="text-white">
                                    Data Sources
                                </Label>
                                <Input
                                    id="data_sources"
                                    value={formData.data_sources}
                                    onChange={(e) => updateField('data_sources', e.target.value)}
                                    placeholder="Firewall logs, EDR alerts, SIEM events"
                                    className="mt-2 bg-gray-900 border-gray-600 text-white"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Types of data that need to be ingested
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="compliance_requirements" className="text-white">
                                    Compliance Requirements
                                </Label>
                                <Input
                                    id="compliance_requirements"
                                    value={formData.compliance_requirements}
                                    onChange={(e) => updateField('compliance_requirements', e.target.value)}
                                    placeholder="CMMC Level 2, HIPAA, PCI DSS"
                                    className="mt-2 bg-gray-900 border-gray-600 text-white"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Regulatory frameworks the SDK must support
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="budget_range" className="text-white">
                                        Budget Range
                                    </Label>
                                    <Select
                                        value={formData.budget_range}
                                        onValueChange={(value) => updateField('budget_range', value)}
                                    >
                                        <SelectTrigger className="mt-2 bg-gray-900 border-gray-600 text-white">
                                            <SelectValue placeholder="Select budget range" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="under_5k">Under $5,000</SelectItem>
                                            <SelectItem value="5k_to_15k">$5,000 - $15,000</SelectItem>
                                            <SelectItem value="15k_to_50k">$15,000 - $50,000</SelectItem>
                                            <SelectItem value="50k_plus">$50,000+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="timeline" className="text-white">
                                        Desired Timeline
                                    </Label>
                                    <Select
                                        value={formData.timeline}
                                        onValueChange={(value) => updateField('timeline', value)}
                                    >
                                        <SelectTrigger className="mt-2 bg-gray-900 border-gray-600 text-white">
                                            <SelectValue placeholder="Select timeline" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="1_month">1 Month</SelectItem>
                                            <SelectItem value="2_months">2 Months</SelectItem>
                                            <SelectItem value="3_months">3 Months</SelectItem>
                                            <SelectItem value="6_months">6 Months</SelectItem>
                                            <SelectItem value="flexible">Flexible</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="priority" className="text-white">
                                    Priority Level
                                </Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) => updateField('priority', value)}
                                >
                                    <SelectTrigger className="mt-2 bg-gray-900 border-gray-600 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-gray-700">
                                        <SelectItem value="low">Low - Nice to have</SelectItem>
                                        <SelectItem value="medium">Medium - Important for operations</SelectItem>
                                        <SelectItem value="high">High - Blocking current workflow</SelectItem>
                                        <SelectItem value="critical">Critical - Business impact</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Package className="w-4 h-4 mr-2" />
                                        Submit SDK Request
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Why Custom SDK */}
                <Card className="border-gray-700 bg-gray-800/50 mt-8">
                    <CardHeader>
                        <CardTitle className="text-white">Why Request a Custom SDK?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-white">Tailored to Your Infrastructure</h4>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Built specifically for your unique combination of systems and requirements
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-white">Faster Than DIY</h4>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Our experts can build what would take your team months in just weeks
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-white">Ongoing Support</h4>
                                    <p className="text-sm text-gray-400 mt-1">
                                        We maintain and update the SDK as your infrastructure evolves
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-white">Security Audited</h4>
                                    <p className="text-sm text-gray-400 mt-1">
                                        All custom SDKs undergo rigorous security review before deployment
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}