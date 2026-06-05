import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function UserBehaviorCard({ behavior, onClick, isSelected }) {
  return (
    <Card 
      className={`border cursor-pointer transition-all duration-200 hover:bg-gray-800/70 ${
        isSelected ? 'border-red-500 bg-red-900/20' : 'border-gray-700 bg-gray-800/50'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white font-medium break-all">{behavior.user_id}</h3>
          <Badge className="bg-red-500/20 text-red-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {behavior.anomaly_score}
          </Badge>
        </div>
        <p className="text-sm text-gray-300 capitalize mb-3">
          {behavior.activity_type.replace('_', ' ')}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {behavior.location}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(behavior.timestamp), { addSuffix: true })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}