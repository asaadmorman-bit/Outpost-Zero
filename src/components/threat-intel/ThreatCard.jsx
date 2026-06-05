import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Globe, 
  Hash, 
  AlertTriangle,
  Activity,
  Target,
  ChevronRight,
  MapPin
} from "lucide-react";
import { format } from "date-fns";

const threatColors = {
  malware: "bg-red-500/20 text-red-400 border-red-500/30",
  botnet: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  c2: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  phishing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  ransomware: "bg-red-600/20 text-red-300 border-red-600/30",
  apt: "bg-purple-600/20 text-purple-300 border-purple-600/30",
  darkweb: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
};

const indicatorIcons = {
  ip: Globe,
  domain: Globe,
  hash: Hash,
  email: AlertTriangle,
  url: Activity,
  file_path: Target
};

export default function ThreatCard({ threat, onClick, isSelected }) {
  const IconComponent = indicatorIcons[threat.indicator_type] || Shield;

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
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <IconComponent className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">{threat.indicator}</h3>
              <p className="text-xs" style={{color: 'var(--text-secondary)'}}>
                {threat.indicator_type?.toUpperCase()}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        <p className="text-sm mb-3" style={{color: 'var(--text-secondary)'}}>
          {threat.description?.substring(0, 80)}...
        </p>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge variant="outline" className={threatColors[threat.threat_type]}>
            {threat.threat_type}
          </Badge>
          <Badge 
            variant="outline" 
            className={
              threat.confidence > 80 ? "bg-green-500/20 text-green-400 border-green-500/30" :
              threat.confidence > 60 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
              "bg-red-500/20 text-red-400 border-red-500/30"
            }
          >
            {threat.confidence}% confidence
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs" style={{color: 'var(--text-secondary)'}}>
          <div className="flex items-center gap-4">
            <span>Source: {threat.source || 'Unknown'}</span>
            {threat.last_seen && (
              <span>Last seen: {format(new Date(threat.last_seen), 'MMM d')}</span>
            )}
          </div>
          {threat.tags && threat.tags.length > 0 && (
            <div className="flex gap-1">
              {threat.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-gray-700/30 text-gray-400">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}