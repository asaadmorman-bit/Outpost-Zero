import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle, Clock, Loader, XCircle, Users, Beaker, HelpCircle } from 'lucide-react';

const statusInfo = {
  live: { icon: CheckCircle, color: 'text-green-400', label: 'Live' },
  in_review: { icon: Clock, color: 'text-yellow-400', label: 'In Review' },
  in_development: { icon: Loader, color: 'text-blue-400', label: 'In Development' },
  rejected: { icon: XCircle, color: 'text-red-400', label: 'Rejected' },
  beta: { icon: Beaker, color: 'text-purple-400', label: 'Beta' },
};

const defaultStatusInfo = { icon: HelpCircle, color: 'text-gray-400', label: 'Unknown' };

const platformIcons = {
  ios: 'https://img.icons8.com/ios-filled/50/ffffff/mac-os.png',
  android: 'https://img.icons8.com/ios-filled/50/ffffff/android-os.png',
};

const tierColors = {
  residential: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
  smb: 'bg-green-500/20 text-green-300 border-green-500/50',
  enterprise: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
  government: 'bg-red-500/20 text-red-300 border-red-500/50'
};

export default function MobileAppCard({ app }) {
  if (!app) return null;

  const { icon: StatusIcon, color: statusColor, label: statusLabel } = statusInfo[app.status] || defaultStatusInfo;

  return (
    <Card className="border-gray-700 bg-gray-800/50 flex flex-col justify-between hover:bg-gray-800/70 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
             <img src={platformIcons[app.platform]} alt={app.platform} className="w-10 h-10 rounded-lg" />
            <div>
              <CardTitle className="text-white text-lg leading-tight">{app.app_name}</CardTitle>
              <p className="text-sm text-gray-400 capitalize">{app.platform}</p>
            </div>
          </div>
          <Badge variant="outline" className={`border-0 text-xs ${statusColor}`}>
            <StatusIcon className={`w-3 h-3 mr-1 ${app.status === 'in_development' ? 'animate-spin' : ''}`} />
            {statusLabel}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className={`text-xs ${tierColors[app.tier] || tierColors.residential}`}>
            {app.tier.charAt(0).toUpperCase() + app.tier.slice(1)} Tier
          </Badge>
          <span className="text-xs text-gray-400">v{app.version}</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col justify-between pt-0">
        <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">{app.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{app.active_installs.toLocaleString()} installs</span>
            </div>
            <div className="text-right">
              <div className="text-green-400 font-medium">Active</div>
            </div>
        </div>
        
        <div className="flex gap-2">
          <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs py-2">
            <a href={app.app_store_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3 mr-1" />
              Google Play
            </a>
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 text-xs py-2" 
          >
            Manage Policies
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}