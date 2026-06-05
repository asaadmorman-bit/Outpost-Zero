import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Clock, 
  User, 
  Shield,
  ChevronRight,
  Activity
} from "lucide-react";
import { format } from "date-fns";

const severityColors = {
  low: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  critical: "bg-red-500/20 text-red-400 border-red-500/30"
};

const statusColors = {
  open: "bg-red-500/20 text-red-400 border-red-500/30",
  investigating: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  contained: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  resolved: "bg-green-500/20 text-green-400 border-green-500/30",
  closed: "bg-gray-500/20 text-gray-400 border-gray-500/30"
};

export default function IncidentCard({ incident, onClick, isSelected }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return AlertTriangle;
      case 'investigating': return Activity;
      case 'contained': return Shield;
      case 'resolved': return Shield;
      default: return AlertTriangle;
    }
  };

  const StatusIcon = getStatusIcon(incident.status);

  return (
    <Card 
      className={`border cursor-pointer transition-all duration-200 hover:bg-gray-800/70 ${
        isSelected 
          ? 'border-blue-500 bg-blue-900/20' 
          : 'border-gray-700 bg-gray-800/50'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-4 h-4 ${severityColors[incident.severity]?.split(' ')[1]}`} />
            <h3 className="text-white font-medium">{incident.title}</h3>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        <p className="text-sm mb-3" style={{color: 'var(--text-secondary)'}}>
          {incident.description?.substring(0, 100)}...
        </p>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className={severityColors[incident.severity]}>
            {incident.severity}
          </Badge>
          <Badge variant="outline" className={statusColors[incident.status]}>
            {incident.status}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs" style={{color: 'var(--text-secondary)'}}>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{format(new Date(incident.created_date), 'MMM d, HH:mm')}</span>
          </div>
          {incident.assigned_to && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{incident.assigned_to.split('@')[0]}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}