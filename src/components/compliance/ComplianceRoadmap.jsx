import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    CheckCircle, 
    Circle, 
    Clock,
    AlertTriangle,
    TrendingUp,
    Calendar
} from 'lucide-react';

const roadmapPhases = [
    {
        id: 'phase1',
        name: 'Phase 1: Foundation',
        duration: '3 months',
        status: 'completed',
        completion: 100,
        objectives: [
            { name: 'Identity and Access Management', status: 'completed' },
            { name: 'Asset Management', status: 'completed' },
            { name: 'Basic Security Controls', status: 'completed' }
        ]
    },
    {
        id: 'phase2',
        name: 'Phase 2: Enhancement',
        duration: '6 months',
        status: 'in_progress',
        completion: 65,
        objectives: [
            { name: 'Advanced Threat Detection', status: 'completed' },
            { name: 'Incident Response Procedures', status: 'in_progress' },
            { name: 'Security Awareness Training', status: 'in_progress' }
        ]
    },
    {
        id: 'phase3',
        name: 'Phase 3: Maturity',
        duration: '9 months',
        status: 'planned',
        completion: 0,
        objectives: [
            { name: 'Continuous Monitoring', status: 'planned' },
            { name: 'Advanced Analytics', status: 'planned' },
            { name: 'Threat Intelligence Integration', status: 'planned' }
        ]
    }
];

export default function ComplianceRoadmap() {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'in_progress':
                return <Clock className="w-5 h-5 text-yellow-400" />;
            case 'planned':
                return <Circle className="w-5 h-5 text-gray-500" />;
            default:
                return <Circle className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'in_progress':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'planned':
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    return (
        <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Compliance Roadmap
                </CardTitle>
                <p className="text-gray-400 text-sm mt-2">
                    Your path to full compliance and security maturity
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {roadmapPhases.map((phase, index) => (
                        <div key={phase.id} className="relative">
                            {/* Connector line */}
                            {index < roadmapPhases.length - 1 && (
                                <div className="absolute left-6 top-16 bottom-0 w-px bg-gray-700 -mb-6"></div>
                            )}

                            <Card className={`border ${
                                phase.status === 'completed' ? 'border-green-500/30' :
                                phase.status === 'in_progress' ? 'border-yellow-500/30' :
                                'border-gray-700'
                            }`}>
                                <CardContent className="p-4 md:p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            {getStatusIcon(phase.status)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                                                <div>
                                                    <h3 className="text-white font-semibold text-lg">{phase.name}</h3>
                                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{phase.duration}</span>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className={getStatusColor(phase.status)}>
                                                    {phase.status.replace('_', ' ')}
                                                </Badge>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between text-sm mb-2">
                                                    <span className="text-gray-400">Progress</span>
                                                    <span className="text-white font-medium">{phase.completion}%</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all ${
                                                            phase.completion === 100 ? 'bg-green-500' : 'bg-blue-500'
                                                        }`}
                                                        style={{ width: `${phase.completion}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Objectives */}
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-400 font-medium">Key Objectives:</p>
                                                {phase.objectives.map((objective, objIndex) => (
                                                    <div
                                                        key={objIndex}
                                                        className="flex items-center gap-2 text-sm"
                                                    >
                                                        {objective.status === 'completed' ? (
                                                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                                        ) : objective.status === 'in_progress' ? (
                                                            <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                                        ) : (
                                                            <Circle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                        )}
                                                        <span className={
                                                            objective.status === 'completed'
                                                                ? 'text-gray-400 line-through'
                                                                : 'text-gray-300'
                                                        }>
                                                            {objective.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {phase.status === 'in_progress' && (
                                                <Button
                                                    size="sm"
                                                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                                                >
                                                    View Details
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-white font-medium mb-1">Next Milestone</h4>
                            <p className="text-sm text-gray-300">
                                Complete Phase 2 objectives by end of Q2. Focus on incident response 
                                procedures and security awareness training.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}