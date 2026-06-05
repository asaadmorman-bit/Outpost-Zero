import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Eye, TrendingUp, Clock, MapPin, Activity } from 'lucide-react';

export default function UEBAAnomalyDetector({ riskScores, userBehavior }) {
  const [filterSeverity, setFilterSeverity] = useState('all');

  const allAnomalies = riskScores.flatMap(score => 
    (score.anomalies_detected || []).map(anomaly => ({
      ...anomaly,
      user_email: score.user_email,
      overall_risk_score: score.overall_risk_score
    }))
  );

  const filteredAnomalies = filterSeverity === 'all' 
    ? allAnomalies 
    : allAnomalies.filter(a => a.severity === filterSeverity);

  const severityCounts = {
    critical: allAnomalies.filter(a => a.severity === 'critical').length,
    high: allAnomalies.filter(a => a.severity === 'high').length,
    medium: allAnomalies.filter(a => a.severity === 'medium').length,
    low: allAnomalies.filter(a => a.severity === 'low').length
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'from-red-600 to-red-700',
      high: 'from-orange-600 to-orange-700',
      medium: 'from-yellow-600 to-yellow-700',
      low: 'from-blue-600 to-blue-700'
    };
    return colors[severity] || 'from-gray-600 to-gray-700';
  };

  return (
    <div className="space-y-6">
      <Alert className="border-orange-500/50 bg-orange-500/10">
        <Eye className="h-5 w-5 text-orange-400" />
        <AlertDescription className="text-orange-200">
          <strong>Anomaly Detection:</strong> ML models continuously monitor user behavior against established baselines. Anomalies are scored and trigger automated responses.
        </AlertDescription>
      </Alert>

      {/* Severity Filter */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Filter by Severity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => setFilterSeverity('all')}
              variant={filterSeverity === 'all' ? 'default' : 'outline'}
              className={filterSeverity === 'all' ? 'bg-blue-600' : 'border-gray-600'}
            >
              All ({allAnomalies.length})
            </Button>
            <Button
              onClick={() => setFilterSeverity('critical')}
              variant={filterSeverity === 'critical' ? 'default' : 'outline'}
              className={filterSeverity === 'critical' ? 'bg-red-600' : 'border-gray-600'}
            >
              Critical ({severityCounts.critical})
            </Button>
            <Button
              onClick={() => setFilterSeverity('high')}
              variant={filterSeverity === 'high' ? 'default' : 'outline'}
              className={filterSeverity === 'high' ? 'bg-orange-600' : 'border-gray-600'}
            >
              High ({severityCounts.high})
            </Button>
            <Button
              onClick={() => setFilterSeverity('medium')}
              variant={filterSeverity === 'medium' ? 'default' : 'outline'}
              className={filterSeverity === 'medium' ? 'bg-yellow-600' : 'border-gray-600'}
            >
              Medium ({severityCounts.medium})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Anomalies List */}
      <div className="space-y-4">
        {filteredAnomalies.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-6 text-center text-gray-400">
              No anomalies detected for the selected severity level.
            </CardContent>
          </Card>
        ) : (
          filteredAnomalies.map((anomaly, idx) => (
            <Card key={idx} className={`bg-gradient-to-r ${getSeverityColor(anomaly.severity)} border-gray-700`}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="w-5 h-5 text-white" />
                      <h3 className="text-white font-semibold text-lg">{anomaly.anomaly_type}</h3>
                      <Badge className="bg-white/20 text-white">
                        {anomaly.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-white/90 mb-2">{anomaly.description}</div>
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      <span className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        User: {anomaly.user_email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(anomaly.timestamp).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Confidence: {anomaly.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}