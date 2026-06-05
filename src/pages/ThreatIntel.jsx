import React, { useState, useEffect } from "react";
import { ThreatIntelligence } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Eye, 
  Globe, 
  Shield, 
  Target,
  Search,
  Filter,
  AlertTriangle,
  Activity,
  Hash
} from "lucide-react";

import ThreatCard from "../components/threat-intel/ThreatCard";
import ThreatDetails from "../components/threat-intel/ThreatDetails";
import MobileDrawer from "../components/shared/MobileDrawer";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import EmptyState from "../components/shared/EmptyState";
import ResponsiveCard from "../components/shared/ResponsiveCard";

export default function ThreatIntelPage() {
  const [threats, setThreats] = useState([]);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  useEffect(() => {
    loadThreatIntel();
  }, []);

  const loadThreatIntel = async () => {
    setIsLoading(true);
    const data = await ThreatIntelligence.list("-last_seen");
    setThreats(data);
    setIsLoading(false);
  };

  const filteredThreats = threats.filter(threat => {
    const matchesSearch = threat.indicator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         threat.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || threat.threat_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const typeCounts = {
    malware: threats.filter(t => t.threat_type === 'malware').length,
    botnet: threats.filter(t => t.threat_type === 'botnet').length,
    apt: threats.filter(t => t.threat_type === 'apt').length,
    darkweb: threats.filter(t => t.threat_type === 'darkweb').length
  };

  const handleSelectThreat = (threat) => {
    setSelectedThreat(threat);
    setShowMobileDetails(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Threat Intelligence</h1>
            <p style={{color: 'var(--text-secondary)'}} className="text-sm md:text-base">Global threat indicators and dark web intelligence</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <ResponsiveCard className="p-3 md:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-xs md:text-sm text-white">Malware</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-red-400">{typeCounts.malware}</div>
          </ResponsiveCard>
          <ResponsiveCard className="p-3 md:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-orange-400" />
              <span className="text-xs md:text-sm text-white">Botnets</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-orange-400">{typeCounts.botnet}</div>
          </ResponsiveCard>
          <ResponsiveCard className="p-3 md:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-xs md:text-sm text-white">APT Groups</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-purple-400">{typeCounts.apt}</div>
          </ResponsiveCard>
          <ResponsiveCard className="p-3 md:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="text-xs md:text-sm text-white">Dark Web</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-cyan-400">{typeCounts.darkweb}</div>
          </ResponsiveCard>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search indicators, domains, IPs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {["all", "malware", "botnet", "apt", "darkweb", "c2", "phishing"].map(type => (
              <Button
                key={type}
                variant={typeFilter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter(type)}
                className={`${typeFilter === type ? "bg-blue-600 hover:bg-blue-700" : "border-gray-700 text-gray-300 hover:bg-gray-800"} transition-colors whitespace-nowrap flex-shrink-0`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading threat intelligence..." />
        ) : filteredThreats.length === 0 ? (
          <EmptyState
            type="threats"
            title="No Threats Found"
            description={searchTerm || typeFilter !== 'all' ? "Try adjusting your filters" : "No threat indicators available"}
            showRefresh
            onRefresh={loadThreatIntel}
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <div className="space-y-3 md:space-y-4">
                {filteredThreats.map((threat) => (
                  <ThreatCard
                    key={threat.id}
                    threat={threat}
                    onClick={() => handleSelectThreat(threat)}
                    isSelected={selectedThreat?.id === threat.id}
                  />
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <ThreatDetails threat={selectedThreat} />
            </div>
          </div>
        )}

        <MobileDrawer
          isOpen={showMobileDetails}
          onClose={() => setShowMobileDetails(false)}
          title="Threat Details"
        >
          <ThreatDetails threat={selectedThreat} />
        </MobileDrawer>
      </div>
    </div>
  );
}