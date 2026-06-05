import React from "react";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Zap, Activity } from "lucide-react";

const threatLevels = {
  low: {
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: Shield,
    label: "Low Threat",
    description: "Normal operations"
  },
  medium: {
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: Activity,
    label: "Medium Threat",
    description: "Elevated monitoring"
  },
  high: {
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    icon: AlertTriangle,
    label: "High Threat",
    description: "Active threats detected"
  },
  critical: {
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: Zap,
    label: "Critical Threat",
    description: "Immediate action required"
  }
};

export default function ThreatLevel({ level }) {
  const config = threatLevels[level] || threatLevels.low;
  const IconComponent = config.icon;
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <Badge variant="outline" className={`${config.color} px-4 py-2 text-sm font-medium border`}>
        <IconComponent className="w-4 h-4 mr-2" />
        {config.label}
      </Badge>
      <span className="text-sm text-gray-400 sm:text-gray-300">
        {config.description}
      </span>
    </div>
  );
}