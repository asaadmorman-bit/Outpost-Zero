import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, TrendingUp, Users, MapPin, Smartphone, FileText } from 'lucide-react';

export default function UEBABaselineViewer({ baselines }) {
  const [selectedBaseline, setSelectedBaseline] = useState(null);

  const getStatusBadge = (status) => {
    const styles = {
      established: 'bg-green-600/20 text-green-300 border-green-500/50',
      learning: 'bg-blue-600/20 text-blue-300 border-blue-500/50',
      updating: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50',
      stale: 'bg-red-600/20 text-red-300 border-red-500/50'
    };
    return <Badge variant="outline" className={styles[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Behavioral Baselines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {baselines.map((baseline) => (
              <div key={baseline.id}>
                <Card 
                  className="bg-gray-900/50 border-gray-700 cursor-pointer hover:border-blue-500/50 transition-colors"
                  onClick={() => setSelectedBaseline(selectedBaseline?.id === baseline.id ? null : baseline)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-white font-semibold">{baseline.user_email}</h3>
                        {getStatusBadge(baseline.baseline_status)}
                      </div>
                      <div className="text-sm text-gray-400">
                        Confidence: <span className="text-green-400 font-semibold">{baseline.confidence_level}%</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-3 text-sm mb-3">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span>Learning: {baseline.learning_period_days}d</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span>Peer: {baseline.peer_group}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <FileText className="w-4 h-4 text-green-400" />
                        <span>Samples: {baseline.samples_collected}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <TrendingUp className="w-4 h-4 text-orange-400" />
                        <span>Type: {baseline.baseline_type}</span>
                      </div>
                    </div>

                    {selectedBaseline?.id === baseline.id && baseline.behavioral_metrics && (
                      <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-white font-semibold mb-2 text-sm">Login Patterns</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Avg Login Time:</span>
                                <span className="text-white">{baseline.behavioral_metrics.avg_login_time}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Daily Logins:</span>
                                <span className="text-white">{baseline.behavioral_metrics.avg_daily_logins}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Session Duration:</span>
                                <span className="text-white">{baseline.behavioral_metrics.avg_session_duration_minutes} min</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-white font-semibold mb-2 text-sm">Data Access</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Files/Day:</span>
                                <span className="text-white">{baseline.behavioral_metrics.avg_files_accessed_daily}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Download/Day:</span>
                                <span className="text-white">{baseline.behavioral_metrics.avg_data_download_mb} MB</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-semibold mb-2 text-sm">Typical Work Days</h4>
                          <div className="flex gap-2 flex-wrap">
                            {baseline.behavioral_metrics.typical_login_days?.map((day, idx) => (
                              <Badge key={idx} className="bg-blue-600/20 text-blue-300 capitalize">
                                {day}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-semibold mb-2 text-sm">Typical Locations</h4>
                          <div className="flex gap-2 flex-wrap">
                            {baseline.behavioral_metrics.typical_locations?.map((loc, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-gray-600 text-gray-300">
                                <MapPin className="w-3 h-3 mr-1" />
                                {loc}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-semibold mb-2 text-sm">Typical Devices</h4>
                          <div className="flex gap-2 flex-wrap">
                            {baseline.behavioral_metrics.typical_devices?.map((device, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-gray-600 text-gray-300">
                                <Smartphone className="w-3 h-3 mr-1" />
                                {device}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-semibold mb-2 text-sm">Typical Applications</h4>
                          <div className="flex gap-2 flex-wrap">
                            {baseline.behavioral_metrics.typical_applications?.map((app, idx) => (
                              <Badge key={idx} className="bg-purple-600/20 text-purple-300 text-xs">
                                {app}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}