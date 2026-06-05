import React, { useState, useEffect } from 'react';
import { AttackSimulation } from '@/entities/AttackSimulation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Swords, Play, Clock, BarChart, ShieldCheck, Tag, Calendar } from 'lucide-react';

export default function AttackSimulationsPage() {
    const [simulations, setSimulations] = useState([]);
    const [activeScenarioFilter, setActiveScenarioFilter] = useState('all');
    const [activeTimelineFilter, setActiveTimelineFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSimulations = async () => {
            setIsLoading(true);
            try {
                const data = await AttackSimulation.list();
                setSimulations(data.length > 0 ? data : getMockSimulations());
            } catch (error) {
                console.error("Error loading simulations:", error);
                setSimulations(getMockSimulations());
            }
            setIsLoading(false);
        };
        loadSimulations();
    }, []);

    const getMockSimulations = () => [
        // ... mock data
        { id: '1', simulation_name: 'APT Campaign Simulation', attack_scenario: 'apt_campaign', difficulty_rating: 8, threat_timeline: 'current', customer_rating: 4.8, purchase_count: 120, real_world_basis: "SolarWinds Attack" },
        { id: '2', simulation_name: 'Ransomware Outbreak', attack_scenario: 'ransomware', difficulty_rating: 7, threat_timeline: 'current', customer_rating: 4.9, purchase_count: 250, real_world_basis: "WannaCry Ransomware" },
        { id: '3', simulation_name: 'Deepfake Social Engineering', attack_scenario: 'deepfake_attack', difficulty_rating: 9, threat_timeline: 'emerging', customer_rating: 4.7, purchase_count: 80, real_world_basis: "CEO Voice Cloning Scams" },
        { id: '4', simulation_name: 'AI Model Poisoning', attack_scenario: 'ai_poisoning', difficulty_rating: 10, threat_timeline: 'future_2025', customer_rating: 4.5, purchase_count: 30, real_world_basis: "Academic Research" },
        { id: '5', simulation_name: 'IoT Botnet Hijack', attack_scenario: 'iot_botnet', difficulty_rating: 6, threat_timeline: 'emerging', customer_rating: 4.6, purchase_count: 150, real_world_basis: "Mirai Botnet" },
        { id: '6', simulation_name: 'Post-Quantum Data Theft', attack_scenario: 'quantum_attack', difficulty_rating: 10, threat_timeline: 'future_2030', customer_rating: 4.8, purchase_count: 15, real_world_basis: "NIST PQC Competition" },
    ];

    const scenarioFilters = [
        { value: 'all', label: 'All' },
        { value: 'apt_campaign', label: 'APT Campaign' },
        { value: 'ransomware', label: 'Ransomware' },
        { value: 'deepfake_attack', label: 'Deepfake Attack' },
        { value: 'ai_poisoning', label: 'AI Poisoning' },
        { value: 'iot_botnet', label: 'IoT Botnet' },
        { value: 'quantum_attack', label: 'Quantum Attack' },
        { value: 'social_engineering', label: 'Social Engineering' },
    ];

    const timelineFilters = [
        { value: 'all', label: 'All' },
        { value: 'current', label: 'Current' },
        { value: 'emerging', label: 'Emerging' },
        { value: 'future_2024', label: 'Future 2024' },
        { value: 'future_2025', label: 'Future 2025' },
        { value: 'future_2030', label: 'Future 2030' },
    ];
    
    const filteredSimulations = simulations.filter(sim => {
        const scenarioMatch = activeScenarioFilter === 'all' || sim.attack_scenario === activeScenarioFilter;
        const timelineMatch = activeTimelineFilter === 'all' || sim.threat_timeline === activeTimelineFilter;
        return scenarioMatch && timelineMatch;
    });

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Swords className="w-8 h-8 text-red-400" />
                        Adversarial Attack Simulations
                    </h1>
                    <p className="text-gray-300">Test your defenses against real-world and future threat scenarios.</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><Tag className="w-5 h-5"/>Filter by Scenario</h3>
                        <div className="flex gap-2 flex-wrap">
                            {scenarioFilters.map(filter => (
                                <Button
                                    key={filter.value}
                                    variant={activeScenarioFilter === filter.value ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setActiveScenarioFilter(filter.value)}
                                    className={`${
                                        activeScenarioFilter === filter.value
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'
                                    } transition-colors`}
                                >
                                    {filter.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><Calendar className="w-5 h-5" />Filter by Threat Timeline</h3>
                        <div className="flex gap-2 flex-wrap">
                            {timelineFilters.map(filter => (
                                <Button
                                    key={filter.value}
                                    variant={activeTimelineFilter === filter.value ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setActiveTimelineFilter(filter.value)}
                                    className={`${
                                        activeTimelineFilter === filter.value
                                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                        : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'
                                    } transition-colors`}
                                >
                                    {filter.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array(6).fill(0).map((_, i) => (
                          <Card key={i} className="border-gray-700 bg-gray-800/50 p-6 animate-pulse">
                            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                          </Card>
                        ))
                    ) : (
                        filteredSimulations.map(sim => (
                            <Card key={sim.id} className="border-gray-700 bg-gray-800/50 flex flex-col justify-between hover:border-blue-500/50 transition-all">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">{sim.simulation_name}</CardTitle>
                                    <Badge variant="outline" className="text-cyan-300 border-cyan-400/50 w-fit mt-2 capitalize">
                                        {sim.attack_scenario.replace(/_/g, ' ')}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center text-sm text-gray-300 mb-4">
                                        <span>Difficulty: {sim.difficulty_rating}/10</span>
                                        <span>Rating: {sim.customer_rating}/5</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-4">Based on: <span className="font-semibold">{sim.real_world_basis}</span></p>
                                    <Button className="w-full bg-red-600 hover:bg-red-700">
                                        <Play className="w-4 h-4 mr-2" />
                                        Run Simulation
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}