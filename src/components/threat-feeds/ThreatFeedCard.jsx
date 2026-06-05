import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rss, CheckCircle, AlertTriangle, Power } from 'lucide-react';

const statusMap = {
  active: { icon: CheckCircle, color: "text-green-400" },
  error: { icon: AlertTriangle, color: "text-red-400" },
  inactive: { icon: Power, color: "text-gray-500" }
};

export default function ThreatFeedCard({ feed }) {
  const StatusIcon = statusMap[feed.status]?.icon || AlertTriangle;
  const statusColor = statusMap[feed.status]?.color || "text-yellow-400";
  
  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <Rss className="w-5 h-5 text-orange-400" />
          {feed.name}
        </CardTitle>
        <div className={`flex items-center gap-1 ${statusColor}`}>
          <StatusIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{feed.status}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-sm">
          <div className="space-x-2">
            <Badge variant="secondary" className="capitalize">{feed.feed_type}</Badge>
            <Badge variant="outline" className="capitalize border-purple-500/50 text-purple-400">{feed.cost_model}</Badge>
            <Badge variant="outline" className="capitalize border-cyan-500/50 text-cyan-400">{feed.update_frequency.replace('_', ' ')}</Badge>
          </div>
          <div>
            <span className="text-gray-400">Quality: </span>
            <span className="font-bold text-white">{feed.quality_score}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}