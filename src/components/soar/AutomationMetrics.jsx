import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Clock, Shield, CheckCircle } from 'lucide-react';

export default function AutomationMetrics({ responses }) {
  const totalAutomations = responses.length;
  const successfulAutomations = responses.filter(r => r.execution_status === 'completed').length;
  const timeSavedMinutes = totalAutomations * 15; 
  const successRate = totalAutomations > 0 ? (successfulAutomations / totalAutomations) * 100 : 100;

  const metrics = [
    { title: "Automations Run (24h)", value: totalAutomations, icon: Zap, color: "text-blue-400" },
    { title: "Time Saved (Est.)", value: `${timeSavedMinutes} min`, icon: Clock, color: "text-green-400" },
    { title: "Incidents Prevented", value: Math.floor(totalAutomations / 5), icon: Shield, color: "text-purple-400" },
    { title: "Success Rate", value: `${successRate.toFixed(1)}%`, icon: CheckCircle, color: "text-cyan-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {metrics.map(metric => (
        <Card key={metric.title} className="border-gray-700 bg-gray-800/50">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className={`w-4 h-4 md:w-5 md:h-5 ${metric.color}`} />
              <span className="text-xs md:text-sm text-white line-clamp-2">{metric.title}</span>
            </div>
            <p className={`text-xl md:text-3xl font-bold ${metric.color}`}>{metric.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}