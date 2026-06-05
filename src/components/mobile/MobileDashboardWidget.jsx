import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Activity } from 'lucide-react';

export default function MobileDashboardWidget({ 
  title, 
  value, 
  trend, 
  trendValue, 
  icon: Icon, 
  severity,
  onClick 
}) {
  const severityColors = {
    critical: 'from-red-600 to-red-800',
    high: 'from-orange-600 to-orange-800',
    medium: 'from-yellow-600 to-yellow-800',
    low: 'from-green-600 to-green-800',
    info: 'from-blue-600 to-blue-800'
  };

  const trendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;
  const TrendIcon = trendIcon;

  return (
    <Card 
      onClick={onClick}
      className={`bg-gradient-to-br ${severityColors[severity] || severityColors.info} border-0 text-white overflow-hidden relative cursor-pointer touch-manipulation transform active:scale-95 transition-transform`}
    >
      <div className="absolute top-0 right-0 opacity-10">
        <Icon className="w-32 h-32" />
      </div>
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-white/90">
            {title}
          </CardTitle>
          <Icon className="w-5 h-5 text-white/80" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold mb-2">{value}</div>
        {trendValue && (
          <div className="flex items-center gap-1 text-sm text-white/80">
            <TrendIcon className="w-4 h-4" />
            <span>{trendValue}</span>
            <span className="text-xs">vs yesterday</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}