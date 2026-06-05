import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Play, 
  Edit, 
  Trash2, 
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Star
} from 'lucide-react';

export default function PlaybookLibrary({ 
  playbooks, 
  searchTerm, 
  onSearchChange, 
  filterType, 
  onFilterChange,
  onEdit,
  onExecute,
  onDelete
}) {
  const incidentTypes = [
    { value: "all", label: "All Types" },
    { value: "phishing", label: "Phishing" },
    { value: "malware_outbreak", label: "Malware Outbreak" },
    { value: "ransomware", label: "Ransomware" },
    { value: "data_breach", label: "Data Breach" },
    { value: "insider_threat", label: "Insider Threat" },
    { value: "ddos_attack", label: "DDoS Attack" },
    { value: "unauthorized_access", label: "Unauthorized Access" }
  ];

  const getSeverityColor = (severities) => {
    if (!severities || severities.length === 0) return "bg-gray-500/20 text-gray-300";
    if (severities.includes("critical")) return "bg-red-500/20 text-red-300";
    if (severities.includes("high")) return "bg-orange-500/20 text-orange-300";
    if (severities.includes("medium")) return "bg-yellow-500/20 text-yellow-300";
    return "bg-blue-500/20 text-blue-300";
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-500/20 text-green-300 border-green-500/50",
      draft: "bg-gray-500/20 text-gray-300 border-gray-500/50",
      archived: "bg-orange-500/20 text-orange-300 border-orange-500/50",
      deprecated: "bg-red-500/20 text-red-300 border-red-500/50"
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search playbooks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <Select value={filterType} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {incidentTypes.map(type => (
              <SelectItem key={type.value} value={type.value} className="text-white">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Playbooks Grid */}
      {playbooks.length === 0 ? (
        <Card className="border-gray-700 bg-gray-800/50">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No Playbooks Found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playbooks.map((playbook) => (
            <Card key={playbook.id} className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-white text-lg">{playbook.name}</CardTitle>
                  {playbook.is_template && (
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                      Template
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className={getStatusColor(playbook.status)}>
                    {playbook.status}
                  </Badge>
                  <Badge variant="outline" className={getSeverityColor(playbook.severity_levels)}>
                    {playbook.incident_type?.replace(/_/g, ' ')}
                  </Badge>
                  {playbook.metrics && (
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {playbook.metrics.average_rating?.toFixed(1) || 'N/A'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm line-clamp-2">{playbook.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-gray-900/50 rounded">
                    <div className="text-gray-400">Steps</div>
                    <div className="text-white font-medium">{playbook.steps?.length || 0}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-900/50 rounded">
                    <div className="text-gray-400">Executions</div>
                    <div className="text-white font-medium">{playbook.metrics?.total_executions || 0}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-900/50 rounded">
                    <div className="text-gray-400">Avg Time</div>
                    <div className="text-white font-medium">{playbook.metrics?.average_duration_minutes || 0}m</div>
                  </div>
                </div>

                {/* Tags */}
                {playbook.tags && playbook.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {playbook.tags.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="border-gray-600 text-gray-400 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-700">
                  <Button
                    onClick={() => onExecute(playbook)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Execute
                  </Button>
                  <Button
                    onClick={() => onEdit(playbook)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    size="sm"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {!playbook.is_template && (
                    <Button
                      onClick={() => onDelete(playbook.id)}
                      variant="outline"
                      className="border-red-600 text-red-300 hover:bg-red-900/20"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}