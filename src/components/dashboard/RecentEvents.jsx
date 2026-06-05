
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity, // Activity icon is still used in CardTitle
  Shield // Shield icon is still used in 'No recent security events' message
} from "lucide-react";
import { format } from "date-fns";

const severityColors = {
  low: "bg-green-500/20 text-green-300 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  high: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  critical: "bg-red-500/20 text-red-300 border-red-500/30"
};

// eventIcons constant is no longer used in the new table layout, so it can be removed.

export default function RecentEvents({ events, isLoading }) {
  // handleEventAction function remains, although the buttons that trigger it are removed
  // in the new table layout, as per the outline.
  const handleEventAction = (event, action) => {
    const actions = {
      investigate: `🔍 INVESTIGATION STARTED\n\nEvent: ${event.event_type}\nPriority: ${event.severity}\n\nIn production, this would:\n• Create investigation case #INV-${Date.now()}\n• Assign to SOC analyst\n• Gather related logs\n• Timeline analysis\n• Evidence collection`,
      dismiss: `✅ EVENT DISMISSED\n\nEvent marked as reviewed.\n\nIn production, this would:\n• Update event status to 'dismissed'\n• Log analyst decision\n• Update ML model feedback\n• Remove from active queue`,
      escalate: `🚨 EVENT ESCALATED\n\nEscalated to Tier 2 analyst.\n\nIn production, this would:\n• Create high-priority ticket\n• Notify senior analyst\n• Trigger automated playbook\n• Send alert to incident response team`
    };

    alert(actions[action]);
  };

  return (
    <Card className="border-gray-600 bg-gray-800/60 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center gap-3">
          <Activity className="w-6 h-6 text-blue-400" />
          Recent Security Events
          <Badge variant="outline" className="ml-auto text-blue-300 border-blue-400/50">
            Live Feed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 md:max-h-96 overflow-y-auto app-scrollbar">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/40 border border-gray-700/50">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-300">No recent security events</p>
            </div>
          ) : (
            <div className="overflow-x-auto"> {/* Added for horizontal scrolling on smaller screens */}
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="sticky top-0 bg-gray-800/80 backdrop-blur-sm z-10"> {/* Sticky header for vertical scrolling */}
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Event Type</th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Source IP</th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Risk Score</th>
                  </tr>
                </thead>
                <tbody>
                  {events.slice(0, 10).map((event) => (
                    <tr key={event.id} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`${severityColors[event.severity]} font-semibold capitalize`}>
                          {event.severity}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-white font-medium">{event.event_type?.replace(/_/g, ' ')}</td>
                      <td className="px-4 py-3 text-gray-200">{event.source_ip || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-200 font-mono text-sm">
                        {event.timestamp ? format(new Date(event.timestamp), 'MMM d, HH:mm:ss') : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                event.ml_risk_score > 80 ? 'bg-red-500' :
                                event.ml_risk_score > 60 ? 'bg-orange-500' :
                                event.ml_risk_score > 40 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${event.ml_risk_score || 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-white">{event.ml_risk_score || 0}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
