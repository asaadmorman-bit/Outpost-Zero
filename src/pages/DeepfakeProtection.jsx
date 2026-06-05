
import React, { useState, useEffect } from 'react';
import { DeepfakeDetection } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload, AlertTriangle, Video, Mic, CheckCircle, Eye } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

export default function DeepfakeProtectionPage() {
    const [detections, setDetections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDetections();
    }, []);

    const loadDetections = async () => {
        setIsLoading(true);
        // Using mock data for demonstration
        setDetections(mockDetections);
        setIsLoading(false);
    };

    const handleFileUpload = () => {
        alert("MEDIA UPLOAD\n\nIn a real application, this would open a file dialog. After selecting a file, it would be securely uploaded to a backend service for analysis by the deepfake detection AI model. Results would then appear in the 'Recent Detections' list.");
    };

    const getThreatColor = (level) => {
        switch (level) {
            case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
            case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
            case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            default: return 'bg-green-500/20 text-green-300 border-green-500/30';
        }
    };
    
    const getMediaTypeIcon = (type) => {
        switch(type) {
            case 'video': return <Video className="w-4 h-4 text-blue-400" />;
            case 'audio': return <Mic className="w-4 h-4 text-purple-400" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Eye className="w-8 h-8 text-cyan-400" />
                        Executive Deepfake Protection
                    </h1>
                    <Button onClick={handleFileUpload} className="bg-cyan-600 hover:bg-cyan-700">
                        <Upload className="mr-2 h-4 w-4" />
                        Analyze Media File
                    </Button>
                </div>
                <p className="text-lg text-gray-300 mb-8">
                    Proactively detect and neutralize deepfake threats targeting your organization's leadership.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {detections.map(d => (
                        <Card key={d.detection_id} className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getMediaTypeIcon(d.media_type)}
                                        Impersonation of {d.target_executive}
                                    </div>
                                    <Badge variant="outline" className={getThreatColor(d.threat_level)}>{d.threat_level}</Badge>
                                </CardTitle>
                                <p className="text-sm text-gray-400 pt-2">Source: {new URL(d.source_url).hostname}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-red-400">Deepfake Probability</span>
                                        <span className="text-lg font-bold text-red-300">{d.deepfake_probability}%</span>
                                    </div>
                                    <Progress value={d.deepfake_probability} className="h-2 [&>div]:bg-red-500" />
                                </div>
                                <div className="text-sm space-y-2">
                                    <p><span className="font-semibold text-gray-300">Detection Method:</span> <span className="text-gray-400">{d.detection_method.replace(/_/g, ' ')}</span></p>
                                    <p><span className="font-semibold text-gray-300">Potential Impact:</span> <span className="text-gray-400">{d.potential_impact}</span></p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <h4 className="text-white font-medium mb-2">Recommended Actions:</h4>
                                    <ul className="space-y-1">
                                        {d.recommended_actions.map((action, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs text-green-300">
                                                <CheckCircle className="w-3 h-3" />
                                                {action}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Button variant="destructive" className="w-full mt-4">
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Initiate Takedown Protocol
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

const mockDetections = [
    { detection_id: 'df_001', media_type: 'video', target_executive: 'CEO', deepfake_probability: 97, detection_method: 'facial_landmarks', source_url: 'https://youtube.com/watch?v=xyz', threat_level: 'critical', potential_impact: 'Stock manipulation, public statement retraction', recommended_actions: ['Issue public denial', 'Request takedown from platform', 'Alert legal team'] },
    { detection_id: 'df_002', media_type: 'audio', target_executive: 'CFO', deepfake_probability: 89, detection_method: 'audio_spectral', source_url: 'https://soundcloud.com/user/track', threat_level: 'high', potential_impact: 'Fraudulent wire transfer authorization', recommended_actions: ['Verify all financial requests via second channel', 'Notify bank of potential fraud', 'Trace audio source'] },
    { detection_id: 'df_003', media_type: 'video', target_executive: 'CTO', deepfake_probability: 78, detection_method: 'temporal_inconsistency', source_url: 'https://vimeo.com/12345', threat_level: 'medium', potential_impact: 'Dissemination of false product information', recommended_actions: ['Monitor social media for spread', 'Prepare internal clarification memo'] },
];
