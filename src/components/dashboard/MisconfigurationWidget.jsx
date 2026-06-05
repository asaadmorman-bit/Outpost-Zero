import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

const categoryColors = {
  IAM: "bg-red-500/20 text-red-400",
  Network: "bg-orange-500/20 text-orange-400",
  SDLC: "bg-yellow-500/20 text-yellow-400",
  Configuration_Management: "bg-blue-500/20 text-blue-400",
};

export default function MisconfigurationWidget({ misconfigs }) {
  const criticalMisconfigs = misconfigs.filter(m => m.severity === 'critical');

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-orange-400" />
          Environment Misconfigurations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {criticalMisconfigs.length > 0 ? (
          <div className="space-y-3">
            {criticalMisconfigs.slice(0, 4).map(config => (
              <div key={config.id} className="p-3 rounded-lg bg-gray-900/30">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium text-white text-sm">{config.description}</p>
                  <Badge variant="outline" className={categoryColors[config.category]}>{config.category}</Badge>
                </div>
                <p className="text-xs text-gray-400">Resource: {config.affected_resource}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No critical misconfigurations detected.</p>
        )}
      </CardContent>
    </Card>
  );
}