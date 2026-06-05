import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Star, Shield, Search, Database, Cloud } from 'lucide-react';

const prebuiltPlaybooks = {
  incident_response: [
    {
      name: 'Advanced Persistent Threat (APT) Response',
      description: 'Comprehensive response to sophisticated, long-term attacks including lateral movement detection and containment.',
      industry: 'All Industries',
      complexity: 'Advanced',
      steps: 12,
      estimated_time: '45-90 minutes',
      use_cases: ['APT29', 'APT1', 'Lazarus Group'],
      icon: Shield
    },
    {
      name: 'Ransomware Incident Response',
      description: 'Rapid containment and recovery procedures for ransomware attacks, including backup validation and communications.',
      industry: 'All Industries', 
      complexity: 'Intermediate',
      steps: 8,
      estimated_time: '15-30 minutes',
      use_cases: ['WannaCry', 'Ryuk', 'Maze'],
      icon: Shield
    }
  ],
  threat_hunting: [
    {
      name: 'Living off the Land Detection',
      description: 'Hunt for attackers using legitimate system tools for malicious purposes.',
      industry: 'All Industries',
      complexity: 'Advanced',
      steps: 6,
      estimated_time: '20-40 minutes',
      use_cases: ['PowerShell abuse', 'WMI persistence', 'BITS jobs'],
      icon: Search
    }
  ],
  vulnerability_management: [
    {
      name: 'Critical Vulnerability Emergency Response',
      description: 'Rapid assessment and patching workflow for zero-day and critical vulnerabilities.',
      industry: 'All Industries',
      complexity: 'Intermediate',
      steps: 7,
      estimated_time: '2-4 hours',
      use_cases: ['Zero-day exploits', 'Critical CVE releases', 'Active exploitation'],
      icon: Database
    }
  ],
  cloud_security: [
    {
      name: 'Cloud Account Compromise Response',
      description: 'Specialized response for compromised cloud accounts including privilege escalation and resource abuse.',
      industry: 'All Industries',
      complexity: 'Advanced',
      steps: 10,
      estimated_time: '30-90 minutes',
      use_cases: ['AWS account takeover', 'Azure privilege escalation', 'GCP resource abuse'],
      icon: Cloud
    }
  ]
};

export default function PrebuiltPlaybooks() {
  const [selectedCategory, setSelectedCategory] = useState('incident_response');
  const [selectedPlaybook, setSelectedPlaybook] = useState(null);

  const handleDeployPlaybook = (playbook) => {
    alert(`🚀 DEPLOYING PLAYBOOK\n\nPlaybook: ${playbook.name}\nComplexity: ${playbook.complexity}\nSteps: ${playbook.steps}\n\nIn production, this would:\n• Clone the pre-built playbook template\n• Customize for your environment\n• Run compatibility checks\n• Add to your active playbooks\n• Schedule initial testing`);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
            <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
            Industry-Tested Playbook Templates
          </CardTitle>
          <p className="text-gray-400 text-xs md:text-sm">Pre-built playbooks from industry experts and NIST guidelines</p>
        </CardHeader>
      </Card>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="incident_response" className="text-xs md:text-sm">Incident Response</TabsTrigger>
          <TabsTrigger value="threat_hunting" className="text-xs md:text-sm">Threat Hunting</TabsTrigger>
          <TabsTrigger value="vulnerability_management" className="text-xs md:text-sm px-1 md:px-3">Vuln Mgmt</TabsTrigger>
          <TabsTrigger value="cloud_security" className="text-xs md:text-sm">Cloud Security</TabsTrigger>
        </TabsList>
        
        {Object.entries(prebuiltPlaybooks).map(([category, playbooks]) => (
          <TabsContent key={category} value={category} className="mt-4 md:mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {playbooks.map(playbook => {
                const IconComponent = playbook.icon;
                return (
                  <Card key={playbook.name} className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-base md:text-lg flex items-start gap-2 md:gap-3">
                        <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-blue-400 flex-shrink-0 mt-1" />
                        <span className="line-clamp-2">{playbook.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4">
                      <p className="text-gray-300 text-xs md:text-sm leading-relaxed line-clamp-3">{playbook.description}</p>
                      
                      <div className="flex flex-wrap gap-1 md:gap-2">
                        <Badge variant="outline" className="text-cyan-300 border-cyan-300/50 text-xs">
                          {playbook.complexity}
                        </Badge>
                        <Badge variant="outline" className="text-purple-300 border-purple-300/50 text-xs">
                          {playbook.steps} steps
                        </Badge>
                        <Badge variant="outline" className="text-green-300 border-green-300/50 text-xs">
                          {playbook.estimated_time}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-white font-medium text-xs md:text-sm mb-2">Common Use Cases:</h4>
                        <div className="flex flex-wrap gap-1">
                          {playbook.use_cases.slice(0, 2).map(useCase => (
                            <Badge key={useCase} className="bg-gray-700 text-gray-300 text-xs">
                              {useCase}
                            </Badge>
                          ))}
                          {playbook.use_cases.length > 2 && (
                            <Badge className="bg-gray-700 text-gray-300 text-xs">
                              +{playbook.use_cases.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-700">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-gray-400 text-xs md:text-sm">Target Industry:</span>
                          <span className="text-white text-xs md:text-sm font-medium">{playbook.industry}</span>
                        </div>
                        <Button 
                          onClick={() => handleDeployPlaybook(playbook)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Deploy Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}