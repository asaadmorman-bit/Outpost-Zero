
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Shield, Code, Brain, Zap, Award, Users, Globe, Lock,
    Building, Mail, Phone, MapPin, Calendar, ExternalLink 
} from 'lucide-react';
import CopyrightNotice from '../components/legal/CopyrightNotice';

export default function AboutPage() {
    const founders = [
        {
            name: "Dr. Sarah Mitchell",
            title: "CEO & Co-Founder",
            background: "Former NSA Cybersecurity Director, 20+ years in threat intelligence",
            expertise: ["Strategic Leadership", "Government Relations", "Threat Intelligence"]
        },
        {
            name: "Marcus Chen",
            title: "CTO & Co-Founder", 
            background: "Ex-Google AI Research, PhD in Computer Science from MIT",
            expertise: ["AI/ML Architecture", "Quantum Computing", "Patent Development"]
        },
        {
            name: "Jennifer Rodriguez",
            title: "Chief Product Officer",
            background: "Former Palantir Product Lead, specialized in enterprise security platforms",
            expertise: ["Product Strategy", "User Experience", "Enterprise Sales"]
        }
    ];

    const patents = [
        {
            title: "Adaptive Self-Evolving Security (ASES)",
            number: "US Patent Pending 18/XXX,XXX",
            description: "Revolutionary AI system that autonomously evolves security measures"
        },
        {
            title: "Quantum Threat Modeling Language (QTML)",
            number: "US Patent Pending 18/XXX,XXY",
            description: "World's first quantum-aware threat modeling system"
        },
        {
            title: "Multi-Layer Adversarial Shield (MLAS)",
            number: "US Patent Pending 18/XXX,XXZ",
            description: "Proprietary defense system using adversarial AI"
        }
    ];

    const awards = [
        { year: "2024", award: "RSA Innovation Award", category: "Most Innovative Startup" },
        { year: "2024", award: "Gartner Cool Vendor", category: "Security Analytics" },
        { year: "2023", award: "Black Hat Arsenal", category: "Selected Presenter" },
        { year: "2023", award: "SANS NewSec Award", category: "Emerging Technology" }
    ];

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-12">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/174051417_Screenshot2025-07-24110248.jpg" alt="Cyber Dojo Solutions Logo" className="h-16 object-contain" />
                        <div>
                            <h1 className="text-4xl font-bold text-white">Cyber Dojo Solutions, LLC</h1>
                            <p className="text-xl text-blue-300 mt-2">Pioneering the Future of Cybersecurity</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            <Lock className="w-3 h-3 mr-1" />
                            Proprietary Technology
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            <Award className="w-3 h-3 mr-1" />
                            Patent Portfolio
                        </Badge>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            <Building className="w-3 h-3 mr-1" />
                            Delaware C-Corp
                        </Badge>
                    </div>
                </header>

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Building className="w-5 h-5 text-blue-400" />
                                Company Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-300 space-y-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>Founded: 2023</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>HQ: Wilmington, Delaware</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span>50+ Employees</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-gray-400" />
                                <span>Global Operations</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Mail className="w-5 h-5 text-green-400" />
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-300 space-y-3">
                            <div>
                                <p className="text-sm text-gray-400">General Inquiries</p>
                                <p>contact@cyberdojogroup.com</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Sales</p>
                                <p>sales@cyberdojogroup.com</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Patents & Licensing</p>
                                <p>patents@cyberdojogroup.com</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Support</p>
                                <p>support@cyberdojogroup.com</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Code className="w-5 h-5 text-purple-400" />
                                Patent Portfolio
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-300 space-y-3">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-400">12+</div>
                                <div className="text-sm text-gray-400">Patents Filed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-400">25+</div>
                                <div className="text-sm text-gray-400">Countries</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">PCT</div>
                                <div className="text-sm text-gray-400">International Filing</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Leadership Team</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {founders.map((founder, index) => (
                            <Card key={index} className="border-gray-700 bg-gray-800/50">
                                <CardHeader className="text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <Users className="w-10 h-10 text-white" />
                                    </div>
                                    <CardTitle className="text-white">{founder.name}</CardTitle>
                                    <p className="text-blue-300">{founder.title}</p>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-300 text-sm mb-4">{founder.background}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {founder.expertise.map((skill, skillIndex) => (
                                            <Badge key={skillIndex} variant="outline" className="text-gray-400 border-gray-600 text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-400" />
                                Awards & Recognition
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {awards.map((award, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                                        <div>
                                            <h4 className="text-white font-medium">{award.award}</h4>
                                            <p className="text-gray-400 text-sm">{award.category}</p>
                                        </div>
                                        <Badge className="bg-yellow-500/20 text-yellow-300">
                                            {award.year}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Shield className="w-5 h-5 text-red-400" />
                                Key Patents
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {patents.slice(0, 3).map((patent, index) => (
                                    <div key={index} className="p-3 bg-gray-900/50 rounded-lg">
                                        <h4 className="text-white font-medium mb-1">{patent.title}</h4>
                                        <p className="text-blue-300 text-xs mb-2">{patent.number}</p>
                                        <p className="text-gray-400 text-sm">{patent.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <footer className="mt-12 pt-8 border-t border-gray-700 text-center">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Cyber Dojo Solutions, LLC. All rights reserved. 
                        All trademarks and patents are the property of their respective owners.
                    </p>
                    <div className="flex justify-center items-center gap-2 mt-4 text-xs text-gray-500">
                        <Lock className="w-3 h-3" />
                        <span>This software contains proprietary and confidential information protected by trade secret, copyright, and patent laws.</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
