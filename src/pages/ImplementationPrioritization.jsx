import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Users, Target, Rocket, Crown, Shield, Building2, Zap } from 'lucide-react';

const PriorityInitiative = ({ 
  icon: Icon, 
  title, 
  timeline, 
  revenue, 
  effort, 
  nextSteps, 
  contacts, 
  resources,
  priority 
}) => (
  <Card className={`bg-gray-800 border-gray-700 mb-6 ${priority === 'Critical' ? 'border-red-500/50' : priority === 'High' ? 'border-yellow-500/50' : 'border-green-500/50'}`}>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8 text-blue-400" />
          <div>
            <CardTitle className="text-white">{title}</CardTitle>
            <div className="flex gap-2 mt-1">
              <Badge className={priority === 'Critical' ? 'bg-red-500/20 text-red-300' : priority === 'High' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}>
                {priority} Priority
              </Badge>
              <Badge variant="outline">{timeline}</Badge>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-green-400 font-bold">{revenue}</p>
          <p className="text-gray-400 text-sm">Revenue Impact</p>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-900/20 p-3 rounded border border-blue-500/30">
          <h4 className="text-blue-300 font-semibold text-sm mb-2">Next Steps</h4>
          <ul className="space-y-1">
            {nextSteps.map((step, index) => (
              <li key={index} className="text-gray-300 text-xs flex items-start gap-1">
                <span className="text-blue-400 mt-0.5">•</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-purple-900/20 p-3 rounded border border-purple-500/30">
          <h4 className="text-purple-300 font-semibold text-sm mb-2">Key Contacts</h4>
          <ul className="space-y-1">
            {contacts.map((contact, index) => (
              <li key={index} className="text-gray-300 text-xs">
                <strong>{contact.role}:</strong> {contact.info}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-green-900/20 p-3 rounded border border-green-500/30">
          <h4 className="text-green-300 font-semibold text-sm mb-2">Resources Needed</h4>
          <ul className="space-y-1">
            {resources.map((resource, index) => (
              <li key={index} className="text-gray-300 text-xs flex items-start gap-1">
                <span className="text-green-400 mt-0.5">→</span>
                {resource}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="bg-gray-900/50 p-3 rounded">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Implementation Effort</span>
          <span className="text-white">{effort}%</span>
        </div>
        <Progress value={effort} className="h-2" />
      </div>
    </CardContent>
  </Card>
);

export default function ImplementationPrioritization() {
  const [completedTasks, setCompletedTasks] = useState([]);
  
  const highImpactMoves = [
    {
      icon: Crown,
      title: "Microsoft Co-Sell Program Application",
      timeline: "7-14 days",
      revenue: "$2M+ ARR potential",
      effort: 25,
      priority: "Critical",
      nextSteps: [
        "Complete Partner Center application",
        "Submit IP Co-sell ready materials",
        "Schedule call with Microsoft Partner Manager",
        "Prepare co-sell presentation deck"
      ],
      contacts: [
        { role: "Partner Manager", info: "Apply through Partner Center" },
        { role: "Co-sell Team", info: "cosell@microsoft.com" },
        { role: "ISV Success", info: "Your assigned PDM after approval" }
      ],
      resources: [
        "2-3 days of business development time",
        "Technical documentation and case studies",
        "Sales deck with customer testimonials",
        "SOC 2 and compliance certifications"
      ]
    },
    {
      icon: Shield,
      title: "Cyber Insurance Partnership Program",
      timeline: "14-21 days",
      revenue: "$1.5M+ ARR potential",
      effort: 35,
      priority: "Critical",
      nextSteps: [
        "Contact Travelers Cyber Insurance team",
        "Develop risk assessment API integration",
        "Create premium discount calculation model",
        "Prepare joint go-to-market strategy"
      ],
      contacts: [
        { role: "Travelers Cyber", info: "cyber@travelers.com" },
        { role: "AXA XL Cyber", info: "partnerships@axaxl.com" },
        { role: "Chubb Cyber", info: "cyber.partnerships@chubb.com" }
      ],
      resources: [
        "Backend developer for API integration",
        "Actuarial consultant for risk modeling",
        "Business development lead",
        "Marketing materials for joint campaigns"
      ]
    },
    {
      icon: Building2,
      title: "White-Label MSP Program",
      timeline: "30-45 days",
      revenue: "$5M+ ARR potential",
      effort: 60,
      priority: "High",
      nextSteps: [
        "Develop white-labeling infrastructure",
        "Create MSSP partner portal",
        "Design revenue-sharing model (70/30 split)",
        "Target top 20 MSSPs with partnership proposals"
      ],
      contacts: [
        { role: "ConnectWise", info: "partnerships@connectwise.com" },
        { role: "Datto/Kaseya", info: "channel@datto.com" },
        { role: "MSP Alliance", info: "info@mspalliance.com" }
      ],
      resources: [
        "Full-stack developer for white-labeling",
        "Partner portal development",
        "Channel sales manager",
        "Legal team for partnership agreements"
      ]
    }
  ];

  const gameChangingPartnerships = [
    {
      icon: Zap,
      title: "NVIDIA AI Partnership",
      timeline: "45-60 days",
      revenue: "$3M+ ARR potential",
      effort: 70,
      priority: "High",
      nextSteps: [
        "Apply to NVIDIA Inception Program",
        "Develop GPU-accelerated threat detection demo",
        "Submit to NVIDIA Partner Connect",
        "Schedule technical review with NVIDIA AI team"
      ],
      contacts: [
        { role: "NVIDIA Inception", info: "inception@nvidia.com" },
        { role: "Partner Connect", info: "partnerconnect@nvidia.com" },
        { role: "Enterprise Sales", info: "enterprise@nvidia.com" }
      ],
      resources: [
        "AI/ML engineer familiar with CUDA",
        "NVIDIA GPU instances for development",
        "Technical proof-of-concept development",
        "Partnership marketing materials"
      ]
    },
    {
      icon: Users,
      title: "ServiceNow ITSM Integration",
      timeline: "30-45 days",
      revenue: "$2M+ ARR potential",
      effort: 45,
      priority: "High",
      nextSteps: [
        "Join ServiceNow Technology Partner Program",
        "Develop ServiceNow Store application",
        "Create automated incident workflows",
        "Submit for ServiceNow certification"
      ],
      contacts: [
        { role: "Partner Program", info: "partners@servicenow.com" },
        { role: "Technology Partners", info: "techpartners@servicenow.com" },
        { role: "Developer Program", info: "developer@servicenow.com" }
      ],
      resources: [
        "ServiceNow developer certification",
        "Integration development time",
        "ServiceNow Store application",
        "Customer use case documentation"
      ]
    },
    {
      icon: Target,
      title: "Big 4 Consulting Partnership",
      timeline: "60-90 days",
      revenue: "$10M+ ARR potential",
      effort: 80,
      priority: "Critical",
      nextSteps: [
        "Identify partner champions at Accenture/Deloitte",
        "Develop joint solution frameworks",
        "Create implementation methodology",
        "Pilot with 2-3 enterprise customers"
      ],
      contacts: [
        { role: "Accenture Security", info: "security.partnerships@accenture.com" },
        { role: "Deloitte Cyber", info: "cyber.alliances@deloitte.com" },
        { role: "PwC CyberSecurity", info: "cyber.partnerships@pwc.com" }
      ],
      resources: [
        "Senior business development executive",
        "Solution architect for joint offerings",
        "Customer success manager",
        "Technical sales engineer"
      ]
    }
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="w-8 h-8 text-red-400" />
            <h1 className="text-3xl font-bold text-white">30-Day Sprint: High-Impact Implementation</h1>
          </div>
          <p className="text-gray-300 text-lg">Execute these initiatives for maximum ROI and fastest growth acceleration</p>
        </div>

        <Alert className="mb-8 border-red-500/50 bg-red-500/10">
          <Target className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">
            <strong>Priority Focus:</strong> Execute the Critical priority items first. These have the highest revenue impact with the lowest implementation effort.
          </AlertDescription>
        </Alert>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-green-400" />
            Immediate High-Impact Moves (Next 30 Days)
          </h2>
          <p className="text-gray-400 mb-6">These initiatives require minimal development but offer massive revenue potential.</p>
          
          {highImpactMoves.map((initiative, index) => (
            <PriorityInitiative key={index} {...initiative} />
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Crown className="w-6 h-6 text-purple-400" />
            Game-Changing Partnerships (Next 60 Days)
          </h2>
          <p className="text-gray-400 mb-6">Strategic partnerships that can 10x your market reach and credibility.</p>
          
          {gameChangingPartnerships.map((initiative, index) => (
            <PriorityInitiative key={index} {...initiative} />
          ))}
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              Weekly Execution Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-red-900/20 p-4 rounded border border-red-500/30">
                <h4 className="text-red-300 font-semibold mb-3">Week 1 (Critical)</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>☐ Submit Microsoft Co-sell application</li>
                  <li>☐ Contact Travelers cyber insurance team</li>
                  <li>☐ Apply to NVIDIA Inception program</li>
                  <li>☐ Draft white-label MSP program outline</li>
                </ul>
              </div>
              
              <div className="bg-yellow-900/20 p-4 rounded border border-yellow-500/30">
                <h4 className="text-yellow-300 font-semibold mb-3">Week 2</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>☐ Develop cyber insurance API integration</li>
                  <li>☐ Join ServiceNow partner program</li>
                  <li>☐ Contact Big 4 consulting partners</li>
                  <li>☐ Create MSSP partnership deck</li>
                </ul>
              </div>

              <div className="bg-blue-900/20 p-4 rounded border border-blue-500/30">
                <h4 className="text-blue-300 font-semibold mb-3">Week 3</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>☐ Launch first cyber insurance pilot</li>
                  <li>☐ Complete ServiceNow integration MVP</li>
                  <li>☐ Schedule Big 4 partnership meetings</li>
                  <li>☐ Begin white-label infrastructure development</li>
                </ul>
              </div>

              <div className="bg-green-900/20 p-4 rounded border border-green-500/30">
                <h4 className="text-green-300 font-semibold mb-3">Week 4</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>☐ Launch MSSP pilot program</li>
                  <li>☐ Complete NVIDIA GPU acceleration demo</li>
                  <li>☐ Finalize Big 4 partnership terms</li>
                  <li>☐ Measure and optimize all initiatives</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}