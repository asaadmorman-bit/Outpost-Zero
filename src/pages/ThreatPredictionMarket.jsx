import React, { useState, useEffect } from 'react';
import { ThreatPredictionMarket } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, ShoppingCart, DollarSign, Brain, Clock, Shield } from 'lucide-react';

export default function ThreatPredictionMarketPage() {
    const [predictions, setPredictions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPredictions();
    }, []);

    const loadPredictions = async () => {
        setIsLoading(true);
        // In a real app, this would fetch data. Using mock data for now.
        setPredictions(mockPredictions);
        setIsLoading(false);
    };

    const handlePurchase = (prediction) => {
        alert(`PURCHASING THREAT INTEL\n\nPrediction: ${prediction.title}\nPrice: $${prediction.market_price}\n\nIn a real app, this would trigger a secure transaction and grant access to the full intelligence report, including detailed TTPs and IOCs.`);
    };

    const getImpactColor = (severity) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default: return 'bg-green-500/20 text-green-400 border-green-500/30';
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-purple-400" />
                        Threat Prediction Market
                    </h1>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        <Brain className="mr-2 h-4 w-4" />
                        Submit Your Prediction
                    </Button>
                </div>
                <p className="text-lg text-gray-300 mb-8">
                    Leverage collective intelligence. Buy and sell AI-generated predictions about future cyber threats.
                </p>

                <Card className="border-gray-700 bg-gray-800/50">
                    <CardHeader>
                        <CardTitle className="text-white">Active Predictions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-gray-700 hover:bg-transparent">
                                    <TableHead className="text-white">Prediction</TableHead>
                                    <TableHead className="text-white">Confidence</TableHead>
                                    <TableHead className="text-white">Time Horizon</TableHead>
                                    <TableHead className="text-white">Impact</TableHead>
                                    <TableHead className="text-white">Price</TableHead>
                                    <TableHead className="text-white">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {predictions.map(p => (
                                    <TableRow key={p.prediction_id} className="border-b-gray-800">
                                        <TableCell>
                                            <div className="font-medium text-white">{p.title}</div>
                                            <div className="text-sm text-gray-400">{p.prediction_type.replace(/_/g, ' ')}</div>
                                        </TableCell>
                                        <TableCell className="text-cyan-300">{p.confidence_score}%</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{p.time_horizon.replace('_', ' ')}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getImpactColor(p.impact_severity)}>
                                                {p.impact_severity}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-green-400 font-medium">${p.market_price}</TableCell>
                                        <TableCell>
                                            <Button size="sm" onClick={() => handlePurchase(p)}>
                                                <ShoppingCart className="mr-2 h-4 w-4" />
                                                Purchase
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const mockPredictions = [
    { prediction_id: 'pred_001', title: 'New RaaS targeting financial services', prediction_type: 'malware_evolution', confidence_score: 92, time_horizon: '3_months', impact_severity: 'critical', market_price: 2500 },
    { prediction_id: 'pred_002', title: 'Zero-day in popular logging library', prediction_type: 'vulnerability_discovery', confidence_score: 85, time_horizon: '1_month', impact_severity: 'critical', market_price: 5000 },
    { prediction_id: 'pred_003', 'title': 'APT Group "Silent Serpent" to target healthcare', prediction_type: 'threat_actor_activity', confidence_score: 88, time_horizon: '6_months', impact_severity: 'high', market_price: 1500 },
    { prediction_id: 'pred_004', 'title': 'Geopolitical tensions to cause rise in DDoS', prediction_type: 'geopolitical_cyber', confidence_score: 78, time_horizon: '1_week', impact_severity: 'medium', market_price: 500 },
];