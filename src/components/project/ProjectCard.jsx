import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, Shield, AlertTriangle, Wrench, Settings } from 'lucide-react';

const typeInfo = {
  security_implementation: { icon: Settings, color: 'text-blue-400' },
  compliance_audit: { icon: Shield, color: 'text-purple-400' },
  vulnerability_remediation: { icon: Wrench, color: 'text-orange-400' },
  incident_response: { icon: AlertTriangle, color: 'text-red-400' },
  cdm_phase: { icon: Shield, color: 'text-cyan-400' },
  default: { icon: ClipboardList, color: 'text-gray-400' }
};

const statusColors = {
  active: 'bg-blue-500/20 text-blue-300',
  planning: 'bg-yellow-500/20 text-yellow-300',
  completed: 'bg-green-500/20 text-green-300',
  on_hold: 'bg-gray-500/20 text-gray-300'
};

export default function ProjectCard({ project, onClick, isSelected }) {
  const { icon: Icon, color } = typeInfo[project.type] || typeInfo.default;

  return (
    <Card 
      className={`border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-200 cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : 'border-gray-700'}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Icon className={`w-6 h-6 mt-1 ${color}`} />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold text-white truncate pr-2">{project.name}</h3>
              <Badge className={statusColors[project.status]}>{project.status}</Badge>
            </div>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
            
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-400">Progress</span>
                <span className="text-xs font-medium text-blue-300">{project.progress_percentage}%</span>
            </div>
            <Progress value={project.progress_percentage} className="w-full h-2 bg-gray-700 [&>*]:bg-blue-500" />
            
            <div className="text-xs text-gray-500 mt-2">
                PM: {project.project_manager}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}