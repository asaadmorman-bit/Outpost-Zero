import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    FileText, 
    Download, 
    Calendar, 
    TrendingUp, 
    AlertTriangle,
    Shield,
    DollarSign,
    Users,
    CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

export default function BoardReportGenerator({ metrics }) {
    const [isGenerating, setIsGenerating] = useState(false);

    const generateReport = async (reportType) => {
        setIsGenerating(true);
        
        // Simulate report generation
        setTimeout(() => {
            setIsGenerating(false);
            alert(`${reportType} report generated successfully!\n\nIn production, this would:\n• Generate a comprehensive PDF report\n• Include all executive metrics and charts\n• Provide trend analysis and recommendations\n• Send to board members via email`);
        }, 2000);
    };

    const reportTemplates = [
        {
            id: 'quarterly',
            name: 'Quarterly Security Review',
            description: 'Comprehensive quarterly security posture report',
            icon: Calendar,
            color: 'blue',
            metrics: ['Risk Score', 'Incidents', 'Compliance', 'ROI']
        },
        {
            id: 'risk',
            name: 'Risk Assessment Report',
            description: 'Detailed analysis of current security risks',
            icon: AlertTriangle,
            color: 'red',
            metrics: ['Threat Landscape', 'Vulnerabilities', 'Risk Mitigation']
        },
        {
            id: 'compliance',
            name: 'Compliance Status Report',
            description: 'Regulatory compliance and audit readiness',
            icon: CheckCircle,
            color: 'green',
            metrics: ['Framework Status', 'Controls', 'Evidence']
        },
        {
            id: 'financial',
            name: 'Security Investment Report',
            description: 'Security spending and ROI analysis',
            icon: DollarSign,
            color: 'yellow',
            metrics: ['Budget', 'ROI', 'Cost Avoidance', 'Investment Needs']
        }
    ];

    return (
        <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Executive Report Generator
                </CardTitle>
                <p className="text-gray-400 text-sm mt-2">
                    Generate board-ready security reports with one click
                </p>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                    {reportTemplates.map(template => {
                        const IconComponent = template.icon;
                        const colorClasses = {
                            blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
                            red: 'bg-red-500/10 border-red-500/30 text-red-400',
                            green: 'bg-green-500/10 border-green-500/30 text-green-400',
                            yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                        };

                        return (
                            <Card 
                                key={template.id}
                                className={`${colorClasses[template.color]} border transition-all hover:scale-105 cursor-pointer`}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <IconComponent className="w-8 h-8 mb-2" />
                                        <Badge variant="outline" className="text-xs">
                                            Auto-Generated
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-white text-lg">
                                        {template.name}
                                    </CardTitle>
                                    <p className="text-sm text-gray-300 mt-1">
                                        {template.description}
                                    </p>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-400 mb-2">Includes:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {template.metrics.map(metric => (
                                                <Badge 
                                                    key={metric}
                                                    variant="outline" 
                                                    className="text-xs border-gray-600"
                                                >
                                                    {metric}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => generateReport(template.name)}
                                        disabled={isGenerating}
                                        className="w-full bg-white/10 hover:bg-white/20 text-white"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        {isGenerating ? 'Generating...' : 'Generate Report'}
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-white font-semibold mb-1">AI-Powered Insights</h4>
                            <p className="text-gray-400 text-sm">
                                All reports include AI-generated executive summaries, trend analysis, 
                                and actionable recommendations tailored to your board's priorities.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-gray-900/30 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">15min</div>
                        <div className="text-xs text-gray-500 mt-1">Avg Generation</div>
                    </div>
                    <div className="text-center p-3 bg-gray-900/30 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">98%</div>
                        <div className="text-xs text-gray-500 mt-1">Accuracy Rate</div>
                    </div>
                    <div className="text-center p-3 bg-gray-900/30 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">24/7</div>
                        <div className="text-xs text-gray-500 mt-1">Auto-Schedule</div>
                    </div>
                    <div className="text-center p-3 bg-gray-900/30 rounded-lg">
                        <div className="text-2xl font-bold text-cyan-400">5+</div>
                        <div className="text-xs text-gray-500 mt-1">Export Formats</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}