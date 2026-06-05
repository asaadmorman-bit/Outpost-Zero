
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Brain, 
    Shield, 
    Network, 
    Zap, 
    Eye, 
    Lock,
    TrendingUp,
    Users,
    Globe,
    Cpu,
    AlertTriangle,
    CheckCircle,
    Lightbulb
} from 'lucide-react';

export default function PatentedTechnologyPage() {
    const [selectedTech, setSelectedTech] = useState('ases');

    const technologies = {
        ases: {
            name: "Adaptive Self-Evolving Security (ASES)",
            patent: "US Patent Pending: 18/XXX,XXX",
            description: "Revolutionary AI system that autonomously evolves security measures based on real-time threat landscape changes.",
            icon: Brain,
            color: "text-purple-400",
            status: "Patent Filed",
            guide: {
                whatItIs: "An AI system that teaches itself how to block new and unknown cyberattacks without human help.",
                whyItMatters: "It protects against brand-new threats the moment they appear, reducing the window of vulnerability from days to milliseconds.",
                analogy: "Your home security system sees a new type of lock-pick, instantly invents a new lock that's immune to it, and installs it on all your doors before the burglar even reaches the porch. Or when a new ransomware variant emerges, ASES automatically creates and deploys countermeasures across all protected systems within seconds."
            },
            keyInnovations: [
                "Self-modifying neural architectures that adapt to new attack vectors",
                "Autonomous security policy generation without human intervention",
                "Cross-organizational threat learning with zero-knowledge protocols",
                "Quantum-resistant adaptive encryption key management"
            ],
            technicalSpecs: {
                "Evolution Cycles": "Real-time (sub-second adaptation)",
                "Learning Sources": "1M+ global security events/day",
                "Adaptation Speed": "0.3ms average response to new threats",
                "Privacy Guarantee": "Zero-knowledge federated learning"
            }
        },
        qtml: {
            name: "Quantum Threat Modeling Language (QTML)",
            patent: "US Patent Pending: 18/XXX,XXY",
            description: "World's first quantum-aware threat modeling system that predicts and prevents post-quantum cryptographic attacks.",
            icon: Zap,
            color: "text-yellow-400",
            status: "Patent Filed",
            guide: {
                whatItIs: "A system that simulates future quantum computers to predict how they will break today's encryption.",
                whyItMatters: "It allows us to find and fix systems that will be vulnerable to quantum attacks years before those attacks are possible, ensuring long-term data safety.",
                analogy: "A weather satellite that can predict the exact path of a hurricane ten years from now, giving you plenty of time to reinforce your house and evacuate safely. QTML identifies that your current banking encryption will be breakable by 2030 quantum computers, so you can upgrade to quantum-safe encryption today."
            },
            keyInnovations: [
                "Quantum algorithm simulation for attack vector prediction",
                "Automated migration planning for quantum-safe algorithms",
                "Timeline-aware risk assessment based on quantum computing progress",
                "Hybrid quantum-classical security architecture optimization"
            ],
            technicalSpecs: {
                "Quantum Simulation": "Up to 100 qubits theoretical modeling",
                "Algorithm Coverage": "All NIST post-quantum candidates",
                "Migration Planning": "Automated 10-year roadmaps",
                "Risk Calculation": "Daily quantum computing progress updates"
            }
        },
        mlas: {
            name: "Multi-Layer Adversarial Shield (MLAS)",
            patent: "US Patent Pending: 18/XXX,XXZ",
            description: "Proprietary defense system that uses adversarial AI to continuously test and strengthen security postures.",
            icon: Shield,
            color: "text-blue-400",
            status: "Patent Filed",
            guide: {
                whatItIs: "A 'sparring partner' AI that constantly attacks our own security systems to find weaknesses before real attackers do.",
                whyItMatters: "It ensures our defenses are always battle-tested and hardened. Instead of waiting for a real attack to find a flaw, we find and fix them ourselves, 24/7.",
                analogy: "The world's best boxer on your payroll, whose only job is to constantly spar with your security guard to make them stronger. MLAS might simulate a sophisticated phishing attack against your employees, then immediately patch the training gaps it discovers."
            },
            keyInnovations: [
                "Continuous adversarial testing of security controls",
                "Self-improving defense mechanisms through adversarial training",
                "Real-time vulnerability discovery and auto-patching",
                "Generative attack simulation for unknown threat vectors"
            ],
            technicalSpecs: {
                "Attack Simulation": "10,000+ unique attack vectors daily",
                "Auto-Patching": "99.7% success rate without downtime",
                "Vulnerability Discovery": "Average 30 days before CVE publication",
                "Adversarial Training": "Continuous model hardening"
            }
        },
        dtir: {
            name: "Distributed Threat Intelligence Relay (DTIR)",
            patent: "US Patent Pending: 18/XXX,XXW",
            description: "Blockchain-based threat intelligence sharing network with incentivized participation and verified attribution.",
            icon: Network,
            color: "text-green-400",
            status: "Patent Filed",
            guide: {
                whatItIs: "A secure, blockchain-verified network where different companies can instantly and anonymously share information about attacks they are seeing.",
                whyItMatters: "If one company gets attacked, every other company in the network instantly learns how to block that same attack. It creates a global 'herd immunity' for all members.",
                analogy: "A neighborhood watch where if one house spots a burglar, an unbreakable, instant alert is sent to every other house. When Bank A detects a new fraud technique, all other DTIR members immediately get updated defenses against that exact attack method."
            },
            keyInnovations: [
                "Blockchain-verified threat intelligence with immutable attribution",
                "Incentivized threat sharing through cryptocurrency rewards",
                "Zero-trust distributed consensus for threat validation",
                "Real-time global threat propagation in <100ms"
            ],
            technicalSpecs: {
                "Network Nodes": "50,000+ global participants",
                "Propagation Speed": "Global <100ms average",
                "Verification Time": "3-second consensus mechanism",
                "Reward System": "CyberCoin utility token integration"
            }
        }
    };

    const handlePatentInquiry = (techName) => {
        alert(`PATENT INQUIRY: ${techName}\n\nFor licensing inquiries and technical specifications, please contact:\n\nCyber Dojo Solutions, LLC\nIntellectual Property Department\nEmail: patents@cyberdojogroup.com\nPhone: +1-800-555-CYBER\n\nOur patent portfolio includes 12+ pending applications with international filing under the PCT.`);
    };

    const currentTech = technologies[selectedTech];
    const TechIcon = currentTech.icon;

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/174051417_Screenshot2025-07-24110248.jpg" alt="Outpost Zero Logo" className="h-12 object-contain" />
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Patented Technologies</h1>
                        <p className="text-gray-300">Revolutionary innovations owned by Cyber Dojo Solutions, LLC</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-6 mb-8">
                    {Object.entries(technologies).map(([key, tech]) => {
                        const Icon = tech.icon;
                        return (
                            <Card 
                                key={key}
                                className={`border-gray-700 bg-gray-800/50 cursor-pointer transition-all hover:bg-gray-800/70 ${selectedTech === key ? 'ring-2 ring-blue-500' : ''}`}
                                onClick={() => setSelectedTech(key)}
                            >
                                <CardHeader className="text-center">
                                    <Icon className={`w-12 h-12 ${tech.color} mx-auto mb-2`} />
                                    <CardTitle className="text-white text-lg">{tech.name}</CardTitle>
                                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                                        {tech.status}
                                    </Badge>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-3">
                                    <TechIcon className={`w-8 h-8 ${currentTech.color}`} />
                                    {currentTech.name}
                                </CardTitle>
                                <Badge variant="outline" className="w-fit text-blue-300 border-blue-300/50">
                                    {currentTech.patent}
                                </Badge>
                                <p className="text-gray-300 text-sm pt-2">
                                    {currentTech.description}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="guide" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="guide">
                                            <Lightbulb className="w-4 h-4 mr-2" /> Plain English Guide
                                        </TabsTrigger>
                                        <TabsTrigger value="tech">
                                            <Cpu className="w-4 h-4 mr-2" /> Technical Details
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="guide" className="mt-4">
                                        <div className="space-y-4">
                                            <div className="p-4 bg-gray-900/50 rounded-lg">
                                                <h3 className="font-semibold text-white mb-1">What It Is:</h3>
                                                <p className="text-gray-300">{currentTech.guide.whatItIs}</p>
                                            </div>
                                            <div className="p-4 bg-gray-900/50 rounded-lg">
                                                <h3 className="font-semibold text-white mb-1">Why It Matters:</h3>
                                                <p className="text-gray-300">{currentTech.guide.whyItMatters}</p>
                                            </div>
                                            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                                <h3 className="font-semibold text-blue-300 mb-1">Examples:</h3>
                                                <p className="text-gray-300 italic">{currentTech.guide.analogy}</p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="tech" className="mt-4 space-y-6">
                                        <div>
                                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                                Key Innovations
                                            </h3>
                                            <ul className="space-y-3">
                                                {currentTech.keyInnovations.map((innovation, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-gray-300">{innovation}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
        
                                        <div>
                                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                                <Cpu className="w-5 h-5 text-purple-400" />
                                                Technical Specifications
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {Object.entries(currentTech.technicalSpecs).map(([spec, value]) => (
                                                    <div key={spec} className="bg-gray-900/50 p-4 rounded-lg">
                                                        <h4 className="text-blue-300 font-medium mb-1">{spec}</h4>
                                                        <p className="text-gray-300 text-sm">{value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="border-gray-700 bg-gray-800/50 sticky top-4">
                            <CardHeader>
                                <CardTitle className="text-white">Patent Portfolio</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Patents Filed</span>
                                    <Badge className="bg-blue-500/20 text-blue-300">12+</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Countries</span>
                                    <Badge className="bg-green-500/20 text-green-300">25+</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">PCT Filing</span>
                                    <Badge className="bg-purple-500/20 text-purple-300">Active</Badge>
                                </div>
                                
                                <hr className="border-gray-700" />
                                
                                <div>
                                    <h4 className="text-white font-medium mb-2">Licensing Available</h4>
                                    <p className="text-gray-400 text-sm mb-4">
                                        Enterprise licensing available for qualifying organizations.
                                    </p>
                                    <Button 
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        onClick={() => handlePatentInquiry(currentTech.name)}
                                    >
                                        <Lock className="w-4 h-4 mr-2" />
                                        Patent Inquiry
                                    </Button>
                                </div>

                                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                        <span className="text-yellow-400 font-medium">Notice</span>
                                    </div>
                                    <p className="text-yellow-300 text-xs">
                                        These technologies are patent-protected intellectual property of Cyber Dojo Solutions, LLC. 
                                        Unauthorized use may result in legal action.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card className="border-gray-700 bg-gray-800/50 mt-8">
                    <CardHeader>
                        <CardTitle className="text-white">Competitive Advantage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                <h3 className="text-white font-semibold mb-2">Market Leadership</h3>
                                <p className="text-gray-300 text-sm">
                                    First-to-market advantage in quantum-aware cybersecurity and self-evolving AI defense systems.
                                </p>
                            </div>
                            <div className="text-center">
                                <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                                <h3 className="text-white font-semibold mb-2">Enterprise Adoption</h3>
                                <p className="text-gray-300 text-sm">
                                    Proven technology stack deployed across Fortune 500 companies and government agencies.
                                </p>
                            </div>
                            <div className="text-center">
                                <Globe className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                                <h3 className="text-white font-semibold mb-2">Global Protection</h3>
                                <p className="text-gray-300 text-sm">
                                    International patent portfolio ensures worldwide intellectual property protection.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
