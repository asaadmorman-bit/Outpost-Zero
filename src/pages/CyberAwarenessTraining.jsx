import React, { useState, useEffect } from 'react';
import { CyberAwarenessTraining, UserCyberProfile } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookUser, Award, Target, TrendingUp, PlayCircle, CheckCircle, Clock, Users } from 'lucide-react';

const mockTrainingData = [
    {
        training_id: 'ct_001',
        user_id: 'user_123',
        training_type: 'phishing_awareness',
        completion_status: 'completed',
        score: 95,
        time_spent_minutes: 45,
        simulated_phishing_results: { emails_sent: 10, clicked_links: 0, reported_suspicious: 10 }
    },
    {
        training_id: 'ct_002',
        user_id: 'user_123',
        training_type: 'password_security',
        completion_status: 'in_progress',
        score: 0,
        time_spent_minutes: 15
    },
    {
        training_id: 'ct_003',
        user_id: 'user_123',
        training_type: 'social_engineering',
        completion_status: 'not_started',
        score: 0,
        time_spent_minutes: 0
    }
];

const mockUserProfile = {
    profile_id: 'up_001',
    user_id: 'user_123',
    cyber_awareness_score: 87,
    risk_level: 'low',
    phishing_susceptibility: 15,
    password_hygiene: 92,
    compliance_status: {
        required_trainings_completed: 2,
        total_required_trainings: 5,
        compliance_percentage: 40
    }
};

export default function CyberAwarenessTrainingPage() {
    const [trainingData, setTrainingData] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [training, profile] = await Promise.all([
                CyberAwarenessTraining.list(),
                UserCyberProfile.list()
            ]);
            setTrainingData(training.length > 0 ? training : mockTrainingData);
            setUserProfile(profile.length > 0 ? profile[0] : mockUserProfile);
        } catch (e) {
            console.error(e);
            setTrainingData(mockTrainingData);
            setUserProfile(mockUserProfile);
        }
        setIsLoading(false);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return 'bg-green-500/20 text-green-300';
            case 'in_progress': return 'bg-blue-500/20 text-blue-300';
            case 'not_started': return 'bg-gray-500/20 text-gray-300';
            default: return 'bg-red-500/20 text-red-300';
        }
    };

    const getRiskColor = (level) => {
        switch(level) {
            case 'low': return 'text-green-400';
            case 'medium': return 'text-yellow-400';
            case 'high': return 'text-orange-400';
            default: return 'text-red-400';
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <BookUser className="w-10 h-10 text-blue-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">Cyber Awareness Training</h1>
                        <p className="text-gray-300">Personalized security training and awareness programs.</p>
                    </div>
                </div>

                {userProfile && (
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Award className="text-blue-400" /> Awareness Score
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-blue-400 mb-2">{userProfile.cyber_awareness_score}</div>
                                <Progress value={userProfile.cyber_awareness_score} className="h-2" />
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Target className="text-red-400" /> Risk Level
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-4xl font-bold capitalize ${getRiskColor(userProfile.risk_level)}`}>
                                    {userProfile.risk_level}
                                </div>
                                <p className="text-sm text-gray-400">Current risk assessment</p>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CheckCircle className="text-green-400" /> Compliance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-green-400 mb-2">
                                    {userProfile.compliance_status.compliance_percentage}%
                                </div>
                                <p className="text-sm text-gray-400">
                                    {userProfile.compliance_status.required_trainings_completed} of {userProfile.compliance_status.total_required_trainings} completed
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Users className="text-purple-400" /> Phishing Resistance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-purple-400 mb-2">
                                    {100 - userProfile.phishing_susceptibility}%
                                </div>
                                <p className="text-sm text-gray-400">Resistance to phishing attacks</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Tabs defaultValue="training" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="training">My Training</TabsTrigger>
                        <TabsTrigger value="simulations">Phishing Simulations</TabsTrigger>
                        <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
                    </TabsList>

                    <TabsContent value="training" className="mt-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isLoading ? (
                                <p className="text-gray-400">Loading training modules...</p>
                            ) : (
                                trainingData.map(training => (
                                    <Card key={training.training_id} className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-white text-lg capitalize">
                                                    {training.training_type.replace('_', ' ')}
                                                </CardTitle>
                                                <Badge className={getStatusColor(training.completion_status)}>
                                                    {training.completion_status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            {training.completion_status === 'completed' && (
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-gray-400">Score:</span>
                                                        <span className="text-green-400 font-bold">{training.score}%</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-400">Time:</span>
                                                        <span className="text-blue-400">{training.time_spent_minutes}m</span>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {training.simulated_phishing_results && (
                                                <div className="mb-4 p-3 bg-gray-900/30 rounded-lg">
                                                    <h5 className="text-sm font-semibold text-white mb-2">Phishing Test Results</h5>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div>
                                                            <span className="text-gray-400">Emails:</span>
                                                            <span className="ml-1 text-white">{training.simulated_phishing_results.emails_sent}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-400">Clicked:</span>
                                                            <span className="ml-1 text-red-400">{training.simulated_phishing_results.clicked_links}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-400">Reported:</span>
                                                            <span className="ml-1 text-green-400">{training.simulated_phishing_results.reported_suspicious}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <Button className="w-full" disabled={training.completion_status === 'completed'}>
                                                {training.completion_status === 'completed' ? (
                                                    <>
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Completed
                                                    </>
                                                ) : training.completion_status === 'in_progress' ? (
                                                    <>
                                                        <PlayCircle className="w-4 h-4 mr-2" />
                                                        Continue
                                                    </>
                                                ) : (
                                                    <>
                                                        <PlayCircle className="w-4 h-4 mr-2" />
                                                        Start Training
                                                    </>
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="simulations" className="mt-6">
                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white">Phishing Simulation Campaign</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-6 mb-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-400 mb-2">85%</div>
                                        <p className="text-sm text-gray-400">Detection Rate</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-400 mb-2">92%</div>
                                        <p className="text-sm text-gray-400">Reporting Rate</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-red-400 mb-2">8%</div>
                                        <p className="text-sm text-gray-400">Click Rate</p>
                                    </div>
                                </div>
                                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                                    <Target className="w-4 h-4 mr-2" />
                                    Launch New Simulation
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="progress" className="mt-6">
                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white">Learning Progress & Analytics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-3">Security Behaviors</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-gray-400">Password Hygiene</span>
                                                    <span className="text-green-400">{userProfile?.password_hygiene || 0}%</span>
                                                </div>
                                                <Progress value={userProfile?.password_hygiene || 0} className="h-2" />
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-gray-400">Incident Reporting</span>
                                                    <span className="text-blue-400">95%</span>
                                                </div>
                                                <Progress value={95} className="h-2" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-3">Improvement Recommendations</h4>
                                        <div className="space-y-2">
                                            <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                                                <p className="text-blue-300 text-sm">
                                                    Focus on social engineering awareness training to improve detection rates.
                                                </p>
                                            </div>
                                            <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                                                <p className="text-green-300 text-sm">
                                                    Excellent progress on password security - maintain current practices.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}