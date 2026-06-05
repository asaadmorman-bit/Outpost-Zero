import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Clock, 
    User, 
    FileText, 
    AlertTriangle,
    CheckCircle,
    Search,
    Shield
} from 'lucide-react';
import { format } from 'date-fns';

const eventIcons = {
    created: AlertTriangle,
    evidence_collected: FileText,
    analysis_completed: Search,
    finding_added: CheckCircle,
    escalated: Shield,
    closed: CheckCircle,
    default: Clock
};

export default function InvestigationTimeline({ timeline = [] }) {
    if (!timeline || timeline.length === 0) {
        return (
            <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-8 text-center">
                    <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No timeline events yet</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Investigation Timeline
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-700"></div>

                    {/* Timeline events */}
                    <div className="space-y-6">
                        {timeline.map((event, index) => {
                            const IconComponent = eventIcons[event.event] || eventIcons.default;
                            
                            return (
                                <div key={index} className="relative pl-12">
                                    {/* Timeline dot */}
                                    <div className="absolute left-0 top-1 w-8 h-8 bg-gray-800 border-2 border-blue-500 rounded-full flex items-center justify-center">
                                        <IconComponent className="w-4 h-4 text-blue-400" />
                                    </div>

                                    {/* Event content */}
                                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                            <h4 className="text-white font-medium">
                                                {event.event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </h4>
                                            <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs w-fit">
                                                {format(new Date(event.timestamp), 'MMM d, yyyy HH:mm')}
                                            </Badge>
                                        </div>

                                        {event.investigator && (
                                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                                <User className="w-4 h-4" />
                                                <span>{event.investigator}</span>
                                            </div>
                                        )}

                                        <p className="text-gray-300 text-sm">{event.details}</p>

                                        {event.evidence_references && event.evidence_references.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {event.evidence_references.map((ref, refIndex) => (
                                                    <Badge 
                                                        key={refIndex}
                                                        className="bg-purple-500/20 text-purple-300 text-xs"
                                                    >
                                                        <FileText className="w-3 h-3 mr-1" />
                                                        {ref}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}