import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { base44 } from '@/api/base44Client';
import { Shield, AlertTriangle, PlayCircle, CheckCircle, Users } from 'lucide-react';

export default function UEBAIncidentIntegration({ riskScores }) {
  const [isCreating, setIsCreating] = useState(false);

  const highRiskUsers = riskScores.filter(s => s.risk_level === 'high' || s.risk_level === 'critical');

  const createIncidentFromRisk = async (riskScore) => {
    setIsCreating(true);
    
    const incidentData = {
      incident_id: `inc_ueba_${Date.now()}`,
      title: `UEBA: High Risk Activity - ${riskScore.user_email}`,
      description: `Automated UEBA detection identified high-risk behavior from user ${riskScore.user_email}.\n\nRisk Score: ${riskScore.overall_risk_score}/100\nRisk Level: ${riskScore.risk_level}\n\nAnomalies Detected:\n${riskScore.anomalies_detected?.map(a => `- ${a.anomaly_type}: ${a.description}`).join('\n')}\n\nRisk Indicators:\n${riskScore.risk_indicators?.map(r => `- ${r}`).join('\n')}`,
      severity: riskScore.risk_level === 'critical' ? 'critical' : 'high',
      status: 'open',
      affected_assets: [riskScore.user_email],
      mitre_tactics: ['TA0001'], // Initial Access
      first_detected: new Date().toISOString()
    };

    try {
      await base44.entities.Incident.create(incidentData);
      alert(`✅ INCIDENT CREATED\n\nIncident ID: ${incidentData.incident_id}\nUser: ${riskScore.user_email}\nSeverity: ${incidentData.severity}\n\nThe incident has been created and assigned to the SOC team for investigation.`);
    } catch (error) {
      console.error('Error creating incident:', error);
      alert('Error creating incident. See console for details.');
    }
    
    setIsCreating(false);
  };

  const triggerAutomatedResponse = async (riskScore) => {
    alert(`🤖 AUTOMATED RESPONSE TRIGGERED\n\nUser: ${riskScore.user_email}\nRisk Score: ${riskScore.overall_risk_score}\n\nAutomated Actions:\n${riskScore.recommended_actions?.slice(0, 3).map(a => `✓ ${a}`).join('\n')}\n\nIn production, this would:\n- Execute SOAR playbook\n- Send notifications\n- Apply access restrictions\n- Collect forensic evidence`);
  };

  return (
    <div className="space-y-6">
      <Alert className="border-blue-500/50 bg-blue-500/10">
        <Shield className="h-5 w-5 text-blue-400" />
        <AlertDescription className="text-blue-200">
          <strong>Incident Integration:</strong> UEBA insights automatically feed into the incident response workflow. High-risk users can trigger automated incident creation and response playbooks.
        </AlertDescription>
      </Alert>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">High-Risk Users Requiring Action</CardTitle>
        </CardHeader>
        <CardContent>
          {highRiskUsers.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
              <p>No high-risk users detected. All users within normal risk thresholds.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {highRiskUsers.map((riskScore) => (
                <Card key={riskScore.id} className="bg-gray-900/50 border-red-500/30">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-5 h-5 text-red-400" />
                          <h3 className="text-white font-semibold">{riskScore.user_email}</h3>
                          <Badge className={
                            riskScore.risk_level === 'critical' 
                              ? 'bg-red-600/20 text-red-300 border-red-500/50' 
                              : 'bg-orange-600/20 text-orange-300 border-orange-500/50'
                          }>
                            {riskScore.risk_level.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-300 mb-3">
                          Risk Score: <span className="text-red-400 font-semibold">{riskScore.overall_risk_score}/100</span>
                          {' • '}
                          Anomalies: <span className="text-orange-400 font-semibold">{riskScore.anomalies_detected?.length || 0}</span>
                        </div>

                        {riskScore.anomalies_detected?.length > 0 && (
                          <div className="mb-3">
                            <div className="text-xs text-gray-400 mb-1">Recent Anomalies:</div>
                            <div className="space-y-1">
                              {riskScore.anomalies_detected.slice(0, 2).map((anomaly, idx) => (
                                <div key={idx} className="text-sm text-red-300 flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                  <span>{anomaly.anomaly_type}: {anomaly.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {riskScore.recommended_actions?.length > 0 && (
                          <div className="mb-3">
                            <div className="text-xs text-gray-400 mb-1">Recommended Actions:</div>
                            <ul className="space-y-1">
                              {riskScore.recommended_actions.slice(0, 3).map((action, idx) => (
                                <li key={idx} className="text-sm text-orange-300 flex items-start gap-2">
                                  <span className="text-orange-400">→</span>
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-gray-700">
                      <Button
                        onClick={() => createIncidentFromRisk(riskScore)}
                        disabled={isCreating}
                        className="bg-red-600 hover:bg-red-700 flex-1"
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Create Incident
                      </Button>
                      <Button
                        onClick={() => triggerAutomatedResponse(riskScore)}
                        variant="outline"
                        className="border-orange-600 text-orange-300 hover:bg-orange-600/10 flex-1"
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Trigger Response
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Stats */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">UEBA → Incident Response Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {highRiskUsers.length}
              </div>
              <div className="text-sm text-gray-400">Users Requiring Action</div>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {riskScores.reduce((sum, s) => sum + (s.anomalies_detected?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-400">Active Anomalies</div>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {riskScores.filter(s => s.risk_level === 'low').length}
              </div>
              <div className="text-sm text-gray-400">Low-Risk Users</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}