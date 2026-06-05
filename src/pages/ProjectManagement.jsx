import React, { useState, useEffect } from "react";
import { Project, CDMCompliance } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Plus,
  Filter
} from "lucide-react";

import ProjectCard from "../components/project/ProjectCard";
import CDMPhaseTracker from "../components/project/CDMPhaseTracker";
import RACIMatrix from "../components/project/RACIMatrix";

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState([]);
  const [cdmCompliance, setCdmCompliance] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    // In a real app, you might fetch these in parallel
    const projectData = await Project.list("-start_date");
    const cdmData = await CDMCompliance.list();
    
    setProjects(projectData.length > 0 ? projectData : mockProjects);
    setCdmCompliance(cdmData.length > 0 ? cdmData : mockCdm);
    
    if (projectData.length > 0) {
        setSelectedProject(projectData[0]);
    } else {
        setSelectedProject(mockProjects[0]);
    }
    setIsLoading(false);
  };

  const filteredProjects = projects.filter(proj =>
    proj.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Project Management Hub</h1>
          <Button><Plus className="mr-2 h-4 w-4" />New Project</Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4 overflow-y-auto max-h-[75vh] pr-2">
            {isLoading ? <p className="text-white">Loading projects...</p> : 
              filteredProjects.map(proj => (
                <ProjectCard key={proj.project_id} project={proj} onClick={() => setSelectedProject(proj)} isSelected={selectedProject?.project_id === proj.project_id} />
              ))
            }
          </div>
          <div className="lg:col-span-2">
            <CDMPhaseTracker cdmCompliance={cdmCompliance} />
            <RACIMatrix project={selectedProject} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock Data for demonstration
const mockProjects = [
    {
        project_id: 'proj_001',
        name: 'FedRAMP High Compliance Audit',
        description: 'Achieve and maintain FedRAMP High certification for the CyberShield platform.',
        type: 'compliance_audit',
        status: 'active',
        priority: 'critical',
        progress_percentage: 65,
        project_manager: 'carol.manager@example.com',
        raci_matrix: {
            responsible: ['dan.engineer@example.com', 'eve.analyst@example.com'],
            accountable: ['carol.manager@example.com'],
            consulted: ['frank.legal@example.com'],
            informed: ['grace.ciso@example.com']
        }
    },
    {
        project_id: 'proj_002',
        name: 'Q3 Vulnerability Remediation Initiative',
        description: 'Remediate all critical and high vulnerabilities identified in the Q2 scan.',
        type: 'vulnerability_remediation',
        status: 'active',
        priority: 'high',
        progress_percentage: 40,
        project_manager: 'bob.lead@example.com',
        raci_matrix: {
            responsible: ['dev.team@example.com', 'secops.team@example.com'],
            accountable: ['bob.lead@example.com'],
            consulted: ['qa.team@example.com'],
            informed: ['grace.ciso@example.com']
        }
    },
    {
        project_id: 'proj_003',
        name: 'CDM Phase 2: SWAM Implementation',
        description: 'Implement Software Asset Management (SWAM) capabilities across the enterprise.',
        type: 'cdm_phase',
        cdm_phase: 'phase_2_swam',
        status: 'planning',
        priority: 'high',
        progress_percentage: 10,
        project_manager: 'carol.manager@example.com',
        raci_matrix: {
            responsible: ['it.assets@example.com'],
            accountable: ['carol.manager@example.com'],
            consulted: ['secops.team@example.com'],
            informed: ['grace.ciso@example.com']
        }
    }
];

const mockCdm = [
    { phase: 'phase_1_hwam', capability: 'Hardware Asset Management', completion_percentage: 95 },
    { phase: 'phase_2_swam', capability: 'Software Asset Management', completion_percentage: 15 },
    { phase: 'phase_3_trust', capability: 'Configuration Management', completion_percentage: 70 },
    { phase: 'phase_4_respond', capability: 'Incident Response Automation', completion_percentage: 55 }
];