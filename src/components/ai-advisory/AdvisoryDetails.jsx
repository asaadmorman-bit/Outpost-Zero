import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    AlertTriangle, 
    CheckCircle, 
    Clock, 
    User,
    ArrowRight,
    Zap
} from 'lucide-react';
import FeedbackButtons from './FeedbackButtons';

export default function AdvisoryDetails({ advisory }) {
    if (!advisory) {
        return (
            <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-8 text-center">
                    <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Select an advisory to view details</p>
                </CardContent>
            </Card>
        );
    }

    const severityColors = {
        info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        low: 'bg-green-500/20 text-green-400 border-green-500/30',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        critical: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    const statusColors = {
        pending: 'bg-yellow-500/20 text-yellow-400',
        acknowledged: 'bg-blue-500/20 text-blue-400',
        in_progress: 'bg-purple-500/20 text-purple-400',
        completed: 'bg-green-500/20 text-green-400',
        dismissed: 'bg-gray-500/20 text-gray-400'
    };

    return (
        <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <CardTitle className="text-white text-xl mb-3">{advisory.title}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                            <Badge className={severityColors[advisory.severity]}>
                                {advisory.severity}
                            </Badge>
                            <Badge className={statusColors[advisory.status]}>
                                {advisory.status}
                            </Badge>
                            <Badge variant="outline" className="border-gray-600 text-gray-300">
                                Confidence: {advisory.confidence_score}%
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        Summary
                    </h4>
                    <p className="text-gray-300 leading-relaxed">{advisory.summary}</p>
                </div>

                {advisory.detailed_analysis && (
                    <div>
                        <h4 className="text-white font-semibold mb-2">Detailed Analysis</h4>
                        <p className="text-gray-300 leading-relaxed">{advisory.detailed_analysis}</p>
                    </div>
                )}

                {advisory.step_by_step_guidance && advisory.step_by_step_guidance.length > 0 && (
                    <div>
                        <h4 className="text-white font-semibold mb-3">Remediation Steps</h4>
                        <div className="space-y-3">
                            {advisory.step_by_step_guidance.map((step, index) => (
                                <div key={index} className="flex gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">
                                        {step.step_number || index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-medium mb-1">{step.action}</p>
                                        {step.role_responsible && (
                                            <p className="text-gray-400 text-sm flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {step.role_responsible}
                                            </p>
                                        )}
                                        {step.estimated_time && (
                                            <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3" />
                                                Est. Time: {step.estimated_time}
                                            </p>
                                        )}
                                        {step.automation_available && (
                                            <Badge className="mt-2 bg-green-500/20 text-green-400 text-xs">
                                                <Zap className="w-3 h-3 mr-1" />
                                                Automation Available
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {advisory.business_impact && (
                    <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                        <h4 className="text-orange-400 font-semibold mb-2">Business Impact</h4>
                        <p className="text-orange-300 text-sm">{advisory.business_impact}</p>
                    </div>
                )}

                <div className="pt-4 border-t border-gray-700">
                    <FeedbackButtons advisory={advisory} />
                </div>

                <div className="flex gap-3">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Complete
                    </Button>
                    {advisory.automation_playbook && (
                        <Button variant="outline" className="border-gray-700 text-gray-300">
                            <Zap className="w-4 h-4 mr-2" />
                            Run Playbook
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}