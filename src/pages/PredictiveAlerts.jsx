import React, { useState, useEffect } from "react";
import { PredictiveAlert } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Clock, Target, TrendingUp, Zap } from "lucide-react";

export default function PredictiveAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await PredictiveAlert.list("-confidence_score");
      // Mock data if none exists
      setAlerts(data.length > 0 ? data : mockAlerts);
    } catch (error) {
      console.error("Error loading predictive alerts:", error);
      setAlerts(mockAlerts);
    }
    setIsLoading(false);
  };

  const mockAlerts = [
    {
      id: "pred_001",
      alert_id: "PRED-2024-001",
      prediction_type: "threat_hunting",
      confidence_score: 94,
      predicted_event: "Lateral movement attempt from compromised endpoint 'WS-MARKETING-05' within next 4 hours",
      risk_factors: ["Recent malware detection", "Unusual network traffic patterns", "Off-hours activity"],
      recommended_actions: ["Isolate endpoint", "Monitor network traffic", "Review user access logs"],
      time_to_event: 4,
      affected_assets: ["WS-MARKETING-05", "File-Server-02", "DC-Primary"],
      status: "active",
      ai_model_version: "v2.1.3"
    },
    {
      id: "pred_002", 
      alert_id: "PRED-2024-002",
      prediction_type: "compliance_drift",
      confidence_score: 87,
      predicted_event: "CMMC compliance violation likely due to unpatched systems in DMZ",
      risk_factors: ["Overdue patches", "External-facing services", "Recent vulnerability disclosure"],
      recommended_actions: ["Emergency patching", "Temporary firewall rules", "Document remediation"],
      time_to_event: 24,
      affected_assets: ["Web-Server-01", "API-Gateway", "Load-Balancer"],
      status: "active",
      ai_model_version: "v2.1.3"
    }
  ];

  const getConfidenceColor = (score) => {
    if (score >= 90) return "text-red-400";
    if (score >= 70) return "text-yellow-400";
    return "text-green-400";
  };

  const getPredictionTypeColor = (type) => {
    const colors = {
      threat_hunting: "bg-red-500/20 text-red-400",
      anomaly_detection: "bg-purple-500/20 text-purple-400",
      risk_escalation: "bg-orange-500/20 text-orange-400",
      compliance_drift: "bg-blue-500/20 text-blue-400"
    };
    return colors[type] || "bg-gray-500/20 text-gray-400";
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-400" />
              Predictive Threat Intelligence
            </h1>
            <p style={{color: 'var(--text-secondary)'}}>
              AI-powered predictions to prevent security incidents before they occur
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-400">{alerts.filter(a => a.status === 'active').length}</div>
            <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Active Predictions</div>
          </div>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <p className="text-white">Loading predictive alerts...</p>
          ) : (
            alerts.map((alert) => (
              <Card key={alert.id} className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Brain className="w-6 h-6 text-purple-400" />
                      <div>
                        <CardTitle className="text-white text-lg">{alert.alert_id}</CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getPredictionTypeColor(alert.prediction_type)}>
                            {alert.prediction_type.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className={`${getConfidenceColor(alert.confidence_score)} border-current`}>
                            {alert.confidence_score}% Confidence
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-orange-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{alert.time_to_event}h</span>
                      </div>
                      <div className="text-xs" style={{color: 'var(--text-secondary)'}}>
                        Est. time to event
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Predicted Event</h4>
                    <p className="text-gray-300">{alert.predicted_event}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Risk Factors
                      </h4>
                      <div className="space-y-1">
                        {alert.risk_factors.map((factor, index) => (
                          <div key={index} className="text-sm text-gray-400 flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                            {factor}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Affected Assets
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {alert.affected_assets.map((asset, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {asset}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Recommended Actions
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {alert.recommended_actions.map((action, index) => (
                        <Button key={index} size="sm" variant="outline" className="text-xs border-blue-600 text-blue-400 hover:bg-blue-600/20">
                          {action}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <div className="text-xs" style={{color: 'var(--text-secondary)'}}>
                      AI Model: {alert.ai_model_version}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                        Dismiss
                      </Button>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Investigate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}