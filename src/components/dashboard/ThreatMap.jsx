import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, Shield, AlertTriangle } from "lucide-react";

export default function ThreatMap({ threatIntel, events }) {
  const threatLocations = [
    { country: "Russia", threats: 15, risk: "high" },
    { country: "China", threats: 12, risk: "high" },
    { country: "North Korea", threats: 8, risk: "critical" },
    { country: "Iran", threats: 6, risk: "medium" },
    { country: "Unknown", threats: 23, risk: "medium" }
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          Global Threat Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {threatLocations.map((location, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/30 border border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{location.country}</p>
                  <p className="text-xs" style={{color: 'var(--text-secondary)'}}>
                    {location.threats} active threats
                  </p>
                </div>
              </div>
              <Badge variant="outline" className={getRiskColor(location.risk)}>
                {location.risk}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            Threat Sources
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{color: 'var(--text-secondary)'}}>Dark Web</span>
              <span className="text-red-400">{threatIntel.filter(t => t.threat_type === 'darkweb').length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{color: 'var(--text-secondary)'}}>APT Groups</span>
              <span className="text-orange-400">{threatIntel.filter(t => t.threat_type === 'apt').length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{color: 'var(--text-secondary)'}}>Malware</span>
              <span className="text-yellow-400">{threatIntel.filter(t => t.threat_type === 'malware').length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}