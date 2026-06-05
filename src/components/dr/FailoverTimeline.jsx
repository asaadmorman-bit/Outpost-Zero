import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { 
  CheckCircle, XCircle, Clock, PlayCircle, AlertTriangle, 
  ChevronDown, ChevronRight 
} from 'lucide-react';

export default function FailoverTimeline({ events, onRefresh }) {
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-600/20 text-green-300 border-green-500/50',
      failed: 'bg-red-600/20 text-red-300 border-red-500/50',
      in_progress: 'bg-blue-600/20 text-blue-300 border-blue-500/50',
      initiated: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50'
    };
    return <Badge variant="outline" className={styles[status] || styles.initiated}>{status}</Badge>;
  };

  const getTypeColor = (type) => {
    const colors = {
      drill_failover: 'text-blue-400',
      planned_failover: 'text-green-400',
      unplanned_failover: 'text-red-400',
      automatic_failover: 'text-purple-400',
      manual_failover: 'text-orange-400'
    };
    return colors[type] || 'text-gray-400';
  };

  const initiateTestFailover = async () => {
    setIsExecuting(true);
    
    // Create test failover event
    const testEvent = {
      event_id: `test_${Date.now()}`,
      event_type: 'drill_failover',
      trigger_reason: 'Manual test failover',
      source_region: 'Azure East US',
      target_region: 'Azure West US 2',
      affected_services: ['all_services'],
      start_time: new Date().toISOString(),
      status: 'initiated',
      automation_used: true,
      initiated_by: 'Current User'
    };

    try {
      await base44.entities.FailoverEvent.create(testEvent);
      
      // Simulate failover steps
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`✅ TEST FAILOVER INITIATED\n\nSimulated Steps:\n1. Health checks passed ✓\n2. Database promotion started...\n3. AKS scaling in DR region...\n4. DNS redirection queued...\n\nThis is a SIMULATION. No actual services affected.\n\nEstimated completion: 23 minutes\n\nMonitor progress in the Failover Timeline.`);
      
      onRefresh();
    } catch (error) {
      console.error('Error creating test failover:', error);
      alert('Error initiating test failover. See console for details.');
    }
    
    setIsExecuting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Failover History</h2>
        <Button 
          onClick={initiateTestFailover}
          disabled={isExecuting}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <PlayCircle className="w-5 h-5 mr-2" />
          {isExecuting ? 'Initiating...' : 'Test Failover'}
        </Button>
      </div>

      {events.length === 0 ? (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6 text-center text-gray-400">
            No failover events recorded. Click "Test Failover" to simulate a DR exercise.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className={`text-white text-lg ${getTypeColor(event.event_type)}`}>
                        {event.event_type.replace(/_/g, ' ').toUpperCase()}
                      </CardTitle>
                      {getStatusBadge(event.status)}
                    </div>
                    <p className="text-gray-400 text-sm">{event.trigger_reason}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                  >
                    {expandedEvent === event.id ? 
                      <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    }
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-400">Source Region</div>
                    <div className="text-white font-medium">{event.source_region}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Target Region</div>
                    <div className="text-white font-medium">{event.target_region}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Duration</div>
                    <div className="text-green-400 font-semibold">
                      {event.duration_minutes} min
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Data Loss</div>
                    <div className="text-green-400 font-semibold">
                      {event.data_loss_minutes} min
                    </div>
                  </div>
                </div>

                {expandedEvent === event.id && event.steps_executed && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="text-white font-semibold mb-3 text-sm">Execution Steps</h4>
                    <div className="space-y-2">
                      {event.steps_executed.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 bg-gray-900/50 rounded">
                          {step.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          ) : step.status === 'failed' ? (
                            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="text-white text-sm">{step.step_name}</div>
                            {step.duration_seconds && (
                              <div className="text-xs text-gray-400">{step.duration_seconds}s</div>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {step.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}