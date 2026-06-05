import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Activity, Users, Brain, TrendingUp, Eye } from "lucide-react";

export default function SecurityMetrics({ events, incidents, threatIntel, userBehavior, advisories, isLoading }) {
  const criticalEvents = events.filter(e => e.severity === 'critical').length;
  const highEvents = events.filter(e => e.severity === 'high').length;
  const openIncidents = incidents.filter(i => ['open', 'investigating'].includes(i.status)).length;
  const criticalAdvisories = advisories.filter(a => a.severity === 'critical').length;
  const avgRiskScore = userBehavior.length > 0 ?
    Math.round(userBehavior.reduce((sum, b) => sum + (b.anomaly_score || 0), 0) / userBehavior.length) : 0;
  const activeThreatFeeds = threatIntel.length;

  const metrics = [
    {
      title: "Critical Events",
      value: criticalEvents,
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/10"
    },
    {
      title: "High Severity",
      value: highEvents,
      icon: Activity,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    },
    {
      title: "Open Incidents",
      value: openIncidents,
      icon: AlertTriangle,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    },
    {
      title: "Critical Advisories",
      value: criticalAdvisories,
      icon: Brain,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Avg Risk Score",
      value: avgRiskScore,
      icon: TrendingUp,
      color: avgRiskScore > 70 ? "text-red-400" : avgRiskScore > 50 ? "text-yellow-400" : "text-green-400",
      bgColor: avgRiskScore > 70 ? "bg-red-500/10" : avgRiskScore > 50 ? "bg-yellow-500/10" : "bg-green-500/10"
    },
    {
      title: "Threat Feeds",
      value: activeThreatFeeds,
      icon: Eye,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    }
  ];

  return (
    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6 md:mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="border-gray-700 bg-gray-800/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-300 mb-2">{metric.title}</p>
                  <p className="text-3xl md:text-4xl font-bold text-white">{metric.value}</p>
                </div>
                <div className={`p-3 md:p-4 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 md:h-8 md:w-8 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}