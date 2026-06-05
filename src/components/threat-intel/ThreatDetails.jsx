import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Globe, 
  Hash, 
  Shield,
  Activity,
  Target,
  Clock,
  ExternalLink,
  Copy
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

export default function ThreatDetails({ threat }) {
  if (!threat) {
    return (
      <Card className="border-gray-700 bg-gray-800/50">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <Eye className="w-12 h-12 text-gray-600" />
            <div>
              <h3 className="text-white font-medium mb-2">No Threat Selected</h3>
              <p style={{color: 'var(--text-secondary)'}}>
                Select a threat indicator to view details
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(threat.indicator);
  };

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          Threat Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-white font-medium break-all">{threat.indicator}</h3>
            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <p className="text-sm mb-3" style={{color: 'var(--text-secondary)'}}>
            {threat.description}
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className={threatColors[threat.threat_type]}>
              {threat.threat_type}
            </Badge>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {threat.indicator_type?.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span style={{color: 'var(--text-secondary)'}}>Confidence</span>
            <Badge 
              variant="outline"
              className={
                threat.confidence > 80 ? "bg-green-500/20 text-green-400 border-green-500/30" :
                threat.confidence > 60 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                "bg-red-500/20 text-red-400 border-red-500/30"
              }
            >
              {threat.confidence}%
            </Badge>
          </div>
          <div className="flex justify-between">
            <span style={{color: 'var(--text-secondary)'}}>Source</span>
            <span className="text-white">{threat.source || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span style={{color: 'var(--text-secondary)'}}>First Seen</span>
            <span className="text-white">
              {threat.first_seen ? format(new Date(threat.first_seen), 'MMM d, yyyy') : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{color: 'var(--text-secondary)'}}>Last Seen</span>
            <span className="text-white">
              {threat.last_seen ? format(new Date(threat.last_seen), 'MMM d, yyyy') : 'N/A'}
            </span>
          </div>
        </div>

        {threat.mitre_techniques && threat.mitre_techniques.length > 0 && (
          <div>
            <h4 className="text-white font-medium mb-2">MITRE ATT&CK Techniques</h4>
            <div className="flex flex-wrap gap-1">
              {threat.mitre_techniques.map((technique, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-purple-500/10 text-purple-400">
                  {technique}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {threat.tags && threat.tags.length > 0 && (
          <div>
            <h4 className="text-white font-medium mb-2">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {threat.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-gray-700/30 text-gray-400">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {threat.threat_actor && (
          <div>
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Threat Actor
            </h4>
            <div className="p-3 bg-gray-900/30 rounded border border-gray-700/50">
              <span className="text-white font-medium">{threat.threat_actor}</span>
            </div>
          </div>
        )}

        {threat.darkweb_source && (
          <div>
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Dark Web Source
            </h4>
            <div className="p-3 bg-gray-900/30 rounded border border-gray-700/50">
              <span className="text-cyan-400">{threat.darkweb_source}</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button className="w-full bg-red-600 hover:bg-red-700">
            Block Indicator
          </Button>
          <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
            <ExternalLink className="w-4 h-4 mr-2" />
            Investigate Further
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}