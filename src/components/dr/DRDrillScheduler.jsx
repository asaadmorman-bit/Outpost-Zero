
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { Calendar, Clock, CheckCircle, AlertTriangle, PlayCircle, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DRDrillScheduler({ drills, onRefresh }) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [newDrill, setNewDrill] = useState({
    drill_name: '',
    drill_type: 'full_regional_failover',
    scheduled_date: '',
    scope: [],
    simulated_scenario: '',
    rto_target_minutes: 25,
    rpo_target_minutes: 5
  });

  const scheduledDrills = drills.filter(d => d.status === 'scheduled');
  const completedDrills = drills.filter(d => d.status === 'completed');

  const handleScheduleDrill = async () => {
    const drill = {
      drill_id: `drill_${Date.now()}`,
      ...newDrill,
      status: 'scheduled',
      scope: ['azure_primary', 'database', 'cache', 'storage', 'applications']
    };

    try {
      await base44.entities.DisasterRecoveryDrill.create(drill);
      alert(`✅ DR DRILL SCHEDULED\n\nDrill: ${drill.drill_name}\nDate: ${new Date(drill.scheduled_date).toLocaleString()}\n\nAutomated reminders will be sent 1 week, 3 days, and 1 day before the drill.`);
      setShowScheduleDialog(false);
      setNewDrill({
        drill_name: '',
        drill_type: 'full_regional_failover',
        scheduled_date: '',
        scope: [],
        simulated_scenario: '',
        rto_target_minutes: 25,
        rpo_target_minutes: 5
      });
      onRefresh();
    } catch (error) {
      console.error('Error scheduling drill:', error);
      alert('Error scheduling drill. See console for details.');
    }
  };

  const getResultBadge = (result) => {
    const styles = {
      success: 'bg-green-600/20 text-green-300 border-green-500/50',
      partial_success: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50',
      failure: 'bg-red-600/20 text-red-300 border-red-500/50'
    };
    return <Badge variant="outline" className={styles[result]}>{result}</Badge>;
  };

  // Get suggested drill dates for 2026
  const getSuggestedDates = () => {
    const today = new Date();
    // Use 2026 if current year is 2025 or later, otherwise use 2025 as a default starting year for suggestions
    const year = today.getFullYear() >= 2025 ? 2026 : 2025; 
    
    return [
      { label: 'Q1 2026 Drill', date: `${year}-03-15T10:00` },
      { label: 'Q2 2026 Drill', date: `${year}-06-15T10:00` },
      { label: 'Q3 2026 Drill', date: `${year}-09-15T10:00` },
      { label: 'Q4 2026 Drill', date: `${year}-12-15T10:00` }
    ];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Quarterly DR Drill Schedule (2026)</h2>
        <Button 
          onClick={() => setShowScheduleDialog(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Schedule Drill
        </Button>
      </div>

      {/* Scheduled Drills */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Upcoming Drills</CardTitle>
        </CardHeader>
        <CardContent>
          {scheduledDrills.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-4">
              No drills scheduled. Click Schedule Drill to add one.
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledDrills.map((drill) => (
                <div key={drill.id} className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-semibold">{drill.drill_name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">
                          {new Date(drill.scheduled_date).toLocaleDateString()} at {new Date(drill.scheduled_date).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-blue-600/20 text-blue-300">
                      {drill.drill_type.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">RTO Target:</span>
                      <span className="text-white">{drill.rto_target_minutes} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">RPO Target:</span>
                      <span className="text-white">{drill.rpo_target_minutes} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Drills */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Drill History</CardTitle>
        </CardHeader>
        <CardContent>
          {completedDrills.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-4">
              No completed drills yet.
            </div>
          ) : (
            <div className="space-y-3">
              {completedDrills.map((drill) => (
                <div key={drill.id} className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-semibold">{drill.drill_name}</h4>
                        {drill.overall_result && getResultBadge(drill.overall_result)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">
                          {new Date(drill.execution_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDrill(selectedDrill === drill.id ? null : drill.id)}
                    >
                      {selectedDrill === drill.id ? 
                        <ChevronDown className="w-5 h-5" /> : 
                        <ChevronRight className="w-5 h-5" />
                      }
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-3 text-sm">
                    <div className="p-2 bg-gray-800/50 rounded">
                      <div className="text-gray-400 text-xs">Target RTO</div>
                      <div className="text-white">{drill.rto_target_minutes} min</div>
                    </div>
                    <div className="p-2 bg-gray-800/50 rounded">
                      <div className="text-gray-400 text-xs">Actual RTO</div>
                      <div className={drill.actual_rto_minutes <= drill.rto_target_minutes ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                        {drill.actual_rto_minutes} min
                      </div>
                    </div>
                    <div className="p-2 bg-gray-800/50 rounded">
                      <div className="text-gray-400 text-xs">Target RPO</div>
                      <div className="text-white">{drill.rpo_target_minutes} min</div>
                    </div>
                    <div className="p-2 bg-gray-800/50 rounded">
                      <div className="text-gray-400 text-xs">Actual RPO</div>
                      <div className={drill.actual_rpo_minutes <= drill.rpo_target_minutes ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                        {drill.actual_rpo_minutes} min
                      </div>
                    </div>
                  </div>

                  {selectedDrill === drill.id && drill.findings && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h5 className="text-white font-semibold mb-2 text-sm">Findings & Actions</h5>
                      <div className="text-gray-300 text-sm">
                        {drill.findings.length > 0 ? (
                          <ul className="space-y-2">
                            {drill.findings.map((finding, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                  finding.severity === 'critical' ? 'text-red-400' :
                                  finding.severity === 'high' ? 'text-orange-400' :
                                  finding.severity === 'medium' ? 'text-yellow-400' :
                                  'text-blue-400'
                                }`} />
                                <div>
                                  <div>{finding.finding}</div>
                                  {finding.remediation_plan && (
                                    <div className="text-xs text-gray-400 mt-1">
                                      Action: {finding.remediation_plan}
                                    </div>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-gray-400">No findings - drill executed perfectly</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule DR Drill (2026)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="drill_name">Drill Name</Label>
              <Input
                id="drill_name"
                value={newDrill.drill_name}
                onChange={(e) => setNewDrill({...newDrill, drill_name: e.target.value})}
                placeholder="Q1 2026 Full Regional Failover"
                className="bg-gray-900 border-gray-700"
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="text-xs text-gray-400">Quick fill:</span>
                {getSuggestedDates().map((suggestion) => (
                  <Button
                    key={suggestion.label}
                    variant="outline"
                    size="sm"
                    onClick={() => setNewDrill({
                      ...newDrill, 
                      drill_name: suggestion.label,
                      scheduled_date: suggestion.date
                    })}
                    className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    {suggestion.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="drill_type">Drill Type</Label>
              <Select
                value={newDrill.drill_type}
                onValueChange={(value) => setNewDrill({...newDrill, drill_type: value})}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="full_regional_failover">Full Regional Failover</SelectItem>
                  <SelectItem value="database_failover">Database Failover</SelectItem>
                  <SelectItem value="application_failover">Application Failover</SelectItem>
                  <SelectItem value="backup_restore">Backup & Restore</SelectItem>
                  <SelectItem value="tabletop_exercise">Tabletop Exercise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="scheduled_date">Scheduled Date & Time</Label>
              <Input
                id="scheduled_date"
                type="datetime-local"
                value={newDrill.scheduled_date}
                onChange={(e) => setNewDrill({...newDrill, scheduled_date: e.target.value})}
                className="bg-gray-900 border-gray-700"
              />
            </div>

            <div>
              <Label htmlFor="scenario">Simulated Scenario</Label>
              <Textarea
                id="scenario"
                value={newDrill.simulated_scenario}
                onChange={(e) => setNewDrill({...newDrill, simulated_scenario: e.target.value})}
                placeholder="Complete Azure East US region outage due to power failure"
                className="bg-gray-900 border-gray-700 h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rto">RTO Target (minutes)</Label>
                <Input
                  id="rto"
                  type="number"
                  value={newDrill.rto_target_minutes}
                  onChange={(e) => setNewDrill({...newDrill, rto_target_minutes: parseInt(e.target.value)})}
                  className="bg-gray-900 border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="rpo">RPO Target (minutes)</Label>
                <Input
                  id="rpo"
                  type="number"
                  value={newDrill.rpo_target_minutes}
                  onChange={(e) => setNewDrill({...newDrill, rpo_target_minutes: parseInt(e.target.value)})}
                  className="bg-gray-900 border-gray-700"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline"
                onClick={() => setShowScheduleDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleScheduleDrill}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!newDrill.drill_name || !newDrill.scheduled_date}
              >
                Schedule Drill
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
