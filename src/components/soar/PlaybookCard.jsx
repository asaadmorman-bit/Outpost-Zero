import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Play, Settings, CheckCircle, XCircle } from 'lucide-react';

export default function PlaybookCard({ playbook }) {
  return (
    <Card className="border-gray-700 bg-gray-800/50 flex flex-col justify-between hover:border-gray-600 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
          <Zap className="w-4 h-4 md:w-5 md:h-5 text-blue-400 flex-shrink-0" />
          <span className="line-clamp-2">{playbook.playbook_name}</span>
        </CardTitle>
        <p className="text-xs md:text-sm text-gray-400 pt-2 line-clamp-2">{playbook.description}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-300 mb-2">Triggers on:</h4>
          <div className="flex flex-wrap gap-1">
            {playbook.trigger_conditions?.slice(0, 3).map(trigger => (
              <Badge key={trigger} variant="outline" className="border-cyan-500/50 text-cyan-400 text-xs">
                {trigger}
              </Badge>
            ))}
            {playbook.trigger_conditions?.length > 3 && (
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-xs">
                +{playbook.trigger_conditions.length - 3}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <div className="text-xs md:text-sm">
            <span className="text-gray-400">Success Rate: </span>
            <span className="font-bold text-green-400">{playbook.success_rate || 0}%</span>
          </div>
          {playbook.active ? (
            <Badge className="bg-green-500/20 text-green-400 w-fit">
              <CheckCircle className="w-3 h-3 mr-1" /> Active
            </Badge>
          ) : (
            <Badge className="bg-red-500/20 text-red-400 w-fit">
              <XCircle className="w-3 h-3 mr-1" /> Inactive
            </Badge>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700/50" variant="outline" size="sm">
            <Play className="w-4 h-4 mr-2" /> Run
          </Button>
          <Button className="flex-1" size="sm">
            <Settings className="w-4 h-4 mr-2" /> Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}