import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
    CheckCircle, 
    Circle,
    Shield,
    Users,
    Settings,
    Zap,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { User } from '@/entities/User';

const steps = [
    {
        id: 'welcome',
        title: 'Welcome to Outpost Zero',
        description: 'The world\'s most advanced AI-powered cybersecurity platform',
        icon: Shield,
        content: (
            <div className="space-y-4">
                <p className="text-gray-300">
                    Outpost Zero combines cutting-edge AI, quantum-safe encryption, and adaptive security 
                    to protect your organization from emerging threats.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <Card className="bg-gray-800/50 border-gray-700">
                        <CardContent className="p-4">
                            <Shield className="w-8 h-8 text-blue-400 mb-2" />
                            <h4 className="text-white font-semibold mb-1">AI-Powered Detection</h4>
                            <p className="text-xs text-gray-400">Advanced threat detection using machine learning</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700">
                        <CardContent className="p-4">
                            <Zap className="w-8 h-8 text-purple-400 mb-2" />
                            <h4 className="text-white font-semibold mb-1">Automated Response</h4>
                            <p className="text-xs text-gray-400">SOAR platform with intelligent playbooks</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    },
    {
        id: 'setup',
        title: 'Initial Setup',
        description: 'Let\'s configure your security environment',
        icon: Settings,
        content: (
            <div className="space-y-4">
                <p className="text-gray-300">
                    We'll help you integrate your existing security tools and data sources.
                </p>
                <div className="space-y-3">
                    <Card className="bg-gray-800/50 border-gray-700">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <div>
                                    <p className="text-white font-medium">Account Created</p>
                                    <p className="text-xs text-gray-400">Your Outpost Zero account is ready</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Circle className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="text-white font-medium">Connect Data Sources</p>
                                    <p className="text-xs text-gray-400">Integrate your security tools</p>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" className="border-gray-600">
                                Start
                            </Button>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Circle className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="text-white font-medium">Invite Team Members</p>
                                    <p className="text-xs text-gray-400">Collaborate with your security team</p>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" className="border-gray-600">
                                Invite
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    },
    {
        id: 'team',
        title: 'Build Your Team',
        description: 'Invite team members and set roles',
        icon: Users,
        content: (
            <div className="space-y-4">
                <p className="text-gray-300">
                    Outpost Zero supports role-based access control to ensure proper security governance.
                </p>
                <div className="space-y-3">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <h4 className="text-white font-semibold mb-2">Available Roles</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-sm">Security Analyst</span>
                                <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                                    View & Respond
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-sm">Incident Responder</span>
                                <Badge variant="outline" className="border-orange-500/50 text-orange-400">
                                    Full Access
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-sm">Administrator</span>
                                <Badge variant="outline" className="border-red-500/50 text-red-400">
                                    All Permissions
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'complete',
        title: 'You\'re All Set!',
        description: 'Start securing your organization',
        icon: CheckCircle,
        content: (
            <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-white text-xl font-bold mb-2">Welcome Aboard!</h3>
                    <p className="text-gray-300">
                        Your Outpost Zero security platform is ready to protect your organization.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                    <Card className="bg-gray-800/50 border-gray-700">
                        <CardContent className="p-4 text-center">
                            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                            <p className="text-white font-medium text-sm">Dashboard</p>
                            <p className="text-xs text-gray-400">View your security posture</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700">
                        <CardContent className="p-4 text-center">
                            <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                            <p className="text-white font-medium text-sm">SOAR</p>
                            <p className="text-xs text-gray-400">Automate responses</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700">
                        <CardContent className="p-4 text-center">
                            <Settings className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                            <p className="text-white font-medium text-sm">Settings</p>
                            <p className="text-xs text-gray-400">Configure platform</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
];

export default function OnboardingWizard({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);

    const handleNext = () => {
        if (!completedSteps.includes(currentStep)) {
            setCompletedSteps([...completedSteps, currentStep]);
        }
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        // Mark onboarding as complete
        try {
            await User.updateMyUserData({ onboarding_completed: true });
        } catch (error) {
            console.error('Failed to update onboarding status:', error);
        }
        onClose();
    };

    const step = steps[currentStep];
    const StepIcon = step.icon;
    const isLastStep = currentStep === steps.length - 1;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <StepIcon className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-white text-xl">{step.title}</DialogTitle>
                                <DialogDescription className="text-gray-400">{step.description}</DialogDescription>
                            </div>
                        </div>
                    </div>

                    {/* Progress indicators */}
                    <div className="flex items-center gap-2">
                        {steps.map((s, index) => (
                            <div
                                key={s.id}
                                className={`flex-1 h-2 rounded-full transition-all ${
                                    index <= currentStep
                                        ? 'bg-blue-500'
                                        : 'bg-gray-700'
                                }`}
                            />
                        ))}
                    </div>
                </DialogHeader>

                <div className="py-6">
                    {step.content}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                        className="border-gray-600 text-gray-300 disabled:opacity-50"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>

                    <div className="text-sm text-gray-400">
                        Step {currentStep + 1} of {steps.length}
                    </div>

                    {isLastStep ? (
                        <Button
                            onClick={handleComplete}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Get Started
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}