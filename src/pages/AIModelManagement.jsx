
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIModelMetrics } from '@/entities/all';
import { BrainCircuit, Cpu, Zap, LineChart } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const mockModels = [
    { model_id: 'model01', model_name: 'Threat Classification', model_type: 'nlp_analysis', accuracy: 98.7, drift_score: 5, compute_requirements: { gpu_required: true } },
    { model_id: 'model02', model_name: 'Behavioral Anomaly Detection', model_type: 'anomaly_detection', accuracy: 95.2, drift_score: 12, compute_requirements: { gpu_required: true } },
    { model_id: 'model03', model_name: 'Predictive Threat Modeling', model_type: 'predictive_modeling', accuracy: 89.5, drift_score: 8, compute_requirements: { gpu_required: false } },
];

export default function AIModelManagementPage() {
    const [models, setModels] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await AIModelMetrics.list();
            setModels(data.length > 0 ? data : mockModels);
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <BrainCircuit className="w-8 h-8 text-purple-400" /> AI & Data Platform Management
                </h1>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {models.map(model => (
                        <Card key={model.model_id} className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center justify-between">
                                    {model.model_name}
                                    {model.compute_requirements?.gpu_required ? <Zap className="text-yellow-400" /> : <Cpu className="text-blue-400" />}
                                </CardTitle>
                                <Badge variant="secondary">{model.model_type}</Badge>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-400">Accuracy</p>
                                    <Progress value={model.accuracy} className="w-full" />
                                    <p className="text-right text-white font-bold">{model.accuracy}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Model Drift</p>
                                    <Progress value={model.drift_score} className="w-full" />
                                    <p className="text-right text-white font-bold">{model.drift_score}%</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
