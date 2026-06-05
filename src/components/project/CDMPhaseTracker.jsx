import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck } from "lucide-react";

export default function CDMPhaseTracker({ cdmCompliance }) {
  const phases = [
    { id: 'phase_1_hwam', name: 'Phase 1: HWAM (What is on the Network?)' },
    { id: 'phase_2_swam', name: 'Phase 2: SWAM (Who is on the Network?)' },
    { id: 'phase_3_trust', name: 'Phase 3: TRUST (How is the Network Protected?)' },
    { id: 'phase_4_respond', name: 'Phase 4: RESPOND (Protecting & Responding)' },
  ];

  const getPhaseProgress = (phaseId) => {
    const phaseItems = cdmCompliance.filter(c => c.phase === phaseId);
    if (phaseItems.length === 0) return 0;
    const totalProgress = phaseItems.reduce((sum, item) => sum + (item.completion_percentage || 0), 0);
    return totalProgress / phaseItems.length;
  };

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          DHS CDM Compliance Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {phases.map(phase => {
            const progress = getPhaseProgress(phase.id);
            return (
              <div key={phase.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-white">{phase.name}</span>
                  <span className="text-xs text-cyan-300">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="w-full bg-cyan-900/50 [&>*]:bg-cyan-500" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}