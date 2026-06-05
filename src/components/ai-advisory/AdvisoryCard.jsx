import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Brain, 
    AlertTriangle, 
    Shield, 
    Settings, 
    Users, 
    CheckCircle, 
    Clock,
    Target
} from 'lucide-react';

const severityColors = {
    info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    critical: "bg-red-500/20 text-red-400 border-red-500/30"
};

const typeIcons = {
    incident_response: AlertTriangle,
    misconfiguration_remediation: Settings,
    system_change: Shield,
    user_change: Users,
    iam_recommendation: Target,
    pam_action: Shield
};

const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400",
    acknowledged: "bg-blue-500/20 text-blue-400",
    in_progress: "bg-purple-500/20 text-purple-400",
    completed: "bg-green-500/20 text-green-400",
    dismissed: "bg-gray-500/20 text-gray-400"
};

export default function AdvisoryCard({ advisory, onClick, isSelected }) {
    // Add null checks and default values
    if (!advisory) {
        return null;
    }

    const IconComponent = typeIcons[advisory.advisory_type] || Brain;
    const targetAudience = advisory.target_audience || [];
    const stepByStepGuidance = advisory.step_by_step_guidance || [];
    const confidenceScore = advisory.confidence_score || 0;
    const severity = advisory.severity || 'info';
    const status = advisory.status || 'pending';
    
    return (
        <Card 
            className={`cursor-pointer transition-all duration-200 border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 ${
                isSelected ? 'ring-2 ring-blue-500 bg-gray-800/70' : ''
            }`}
            onClick={() => onClick && onClick(advisory)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <IconComponent className="w-4 h-4 text-blue-400" />
                        </div>
                        <Badge variant="outline" className={severityColors[severity]}>
                            {severity.toUpperCase()}
                        </Badge>
                    </div>
                    <Badge variant="outline" className={statusColors[status]}>
                        {status.replace('_', ' ')}
                    </Badge>
                </div>
                <CardTitle className="text-white text-base leading-tight">
                    {advisory.title || 'Untitled Advisory'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {advisory.summary || 'No summary available'}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Brain className="w-3 h-3" />
                        <span>{confidenceScore}% confidence</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <Users className="w-3 h-3" />
                        <span>{targetAudience.length} roles</span>
                    </div>
                </div>
                
                {stepByStepGuidance.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                        <div className="flex items-center gap-2 text-xs text-blue-400">
                            <CheckCircle className="w-3 h-3" />
                            <span>{stepByStepGuidance.length} remediation steps</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}