
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Clock, 
  User, 
  Shield,
  Target,
  Activity,
  ExternalLink,
  GitMerge,
  Brain
} from "lucide-react";
import { format } from "date-fns";
import { InvokeLLM } from "@/integrations/Core";

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

function QuantumRiskAnalysis({ analysis, onAnalyze, isLoading }) {
  if (!analysis || analysis.status === 'not_run') {
    return (
      <Button onClick={onAnalyze} disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700">
        <Brain className="mr-2 h-4 w-4" />
        {isLoading ? "Analyzing..." : "Analyze for Quantum Risk"}
      </Button>
    )
  }

  return (
    <div>
      <h4 className="text-white font-medium mb-2 flex items-center gap-2">
        <Brain className="w-4 h-4 text-purple-400" />
        Post-Quantum Risk Analysis
      </h4>
      <div className="p-3 bg-gray-900/30 rounded border border-gray-700/50 space-y-2">
        <div className="flex justify-between"><span className="text-gray-400">Risk Level:</span> <Badge variant="destructive">{analysis.risk_level}</Badge></div>
        <p className="text-sm text-gray-300">{analysis.summary}</p>
        {analysis.vulnerable_algorithms?.length > 0 && (
          <p className="text-xs text-purple-300">Vulnerabilities: {analysis.vulnerable_algorithms.join(', ')}</p>
        )}
      </div>
    </div>
  )
}

export default function IncidentDetails({ incident }) {
  const [currentIncident, setCurrentIncident] = useState(incident);
  const [isLoadingQuantum, setIsLoadingQuantum] = useState(false);

  React.useEffect(() => {
    setCurrentIncident(incident);
  }, [incident]);

  const handleQuantumAnalysis = async () => {
    if (!currentIncident) return;
    setIsLoadingQuantum(true);
    
    // In a real app, you'd send specific configuration data. Here we send a generic prompt.
    const analysisResult = await InvokeLLM({
      prompt: `Analyze the following incident for risks related to post-quantum cryptography. Are there any legacy algorithms involved? Incident: ${currentIncident.description}`,
      response_json_schema: {
        type: "object",
        properties: {
          risk_level: { type: "string", enum: ["none", "low", "medium", "high"] },
          summary: { type: "string" },
          vulnerable_algorithms: { type: "array", items: { type: "string" } }
        }
      }
    });

    const newAnalysis = { ...analysisResult, status: "completed" };
    setCurrentIncident(prev => ({ ...prev, quantum_risk_analysis: newAnalysis }));
    
    // Here you would also call Incident.update()
    setIsLoadingQuantum(false);
  }

  if (!currentIncident) {
    return (
      <Card className="border-gray-700 bg-gray-800/50">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <Shield className="w-12 h-12 text-gray-600" />
            <div>
              <h3 className="text-white font-medium mb-2">No Incident Selected</h3>
              <p style={{color: 'var(--text-secondary)'}}>
                Select an incident to view details
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          Incident Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-white font-medium mb-2">{currentIncident.title}</h3>
          <p className="text-sm mb-3" style={{color: 'var(--text-secondary)'}}>
            {currentIncident.description}
          </p>
          <div className="flex gap-2">
            <Badge variant="outline" className={severityColors[currentIncident.severity]}>
              {currentIncident.severity}
            </Badge>
            <Badge variant="outline" className={statusColors[currentIncident.status]}>
              {currentIncident.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span style={{color: 'var(--text-secondary)'}}>Incident ID</span>
            <span className="text-white font-medium">{currentIncident.incident_id}</span>
          </div>
          <div className="flex justify-between">
            <span style={{color: 'var(--text-secondary)'}}>First Detected</span>
            <span className="text-white">
              {currentIncident.first_detected ? format(new Date(currentIncident.first_detected), 'MMM d, HH:mm') : 'N/A'}
            </span>
          </div>
          {currentIncident.assigned_to && (
            <div className="flex justify-between">
              <span style={{color: 'var(--text-secondary)'}}>Assigned To</span>
              <span className="text-white">{currentIncident.assigned_to.split('@')[0]}</span>
            </div>
          )}
        </div>

        {currentIncident.affected_assets && currentIncident.affected_assets.length > 0 && (
          <div>
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Affected Assets
            </h4>
            <div className="space-y-2">
              {currentIncident.affected_assets.map((asset, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-900/30 rounded">
                  <Activity className="w-3 h-3 text-orange-400" />
                  <span className="text-sm text-white">{asset}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentIncident.mitre_tactics && currentIncident.mitre_tactics.length > 0 && (
          <div>
            <h4 className="text-white font-medium mb-2">MITRE ATT&CK Tactics</h4>
            <div className="flex flex-wrap gap-1">
              {currentIncident.mitre_tactics.map((tactic, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-purple-500/10 text-purple-400">
                  {tactic}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {currentIncident.timeline && currentIncident.timeline.length > 0 && (
          <div>
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timeline
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {currentIncident.timeline.map((event, index) => (
                <div key={index} className="flex gap-3 p-2 bg-gray-900/30 rounded">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-white text-sm font-medium">{event.action}</span>
                      <span className="text-xs" style={{color: 'var(--text-secondary)'}}>
                        {format(new Date(event.timestamp), 'HH:mm')}
                      </span>
                    </div>
                    <p className="text-xs" style={{color: 'var(--text-secondary)'}}>
                      {event.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <QuantumRiskAnalysis analysis={currentIncident.quantum_risk_analysis} onAnalyze={handleQuantumAnalysis} isLoading={isLoadingQuantum} />

        <div className="space-y-2">
          {currentIncident.related_ticket_id ? (
            <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                <GitMerge className="w-4 h-4 mr-2" />
                View Ticket: {currentIncident.related_ticket_id}
            </Button>
          ) : (
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
              <GitMerge className="w-4 h-4 mr-2" />
              Create Jira Ticket
            </Button>
          )}
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Update Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
