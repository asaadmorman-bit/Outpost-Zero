import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Shield, UserX, UserCheck, Users, AlertCircle, FileSearch, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function AnomalyDetails({ behavior }) {
  const handleUserAction = (action, userId) => {
    const actions = {
      investigate: `🔍 INVESTIGATION LAUNCHED\n\nUser: ${userId}\nCase ID: #INV-${Date.now()}\n\nIn production, this would:\n• Create forensic timeline\n• Collect user activity logs\n• Review access permissions\n• Check for lateral movement\n• Generate investigation report\n• Assign to senior analyst`,
      lockAccount: `🔒 ACCOUNT LOCKED\n\nUser: ${userId}\nAction: Immediate lockout\n\nIn production, this would:\n• Disable user authentication\n• Terminate active sessions\n• Notify IT security team\n• Create incident ticket\n• Send notification to user's manager\n• Log security action`,
      markBenign: `✅ MARKED AS BENIGN\n\nUser: ${userId}\nStatus: False positive\n\nIn production, this would:\n• Update ML model training\n• Reduce user risk score\n• Log analyst decision\n• Update behavioral baseline\n• Remove from watchlist\n• Notify user (optional)`
    };
    
    alert(actions[action]);
  };

  if (!behavior) {
    return (
      <Card className="border-gray-600 bg-gray-800/60 h-full flex items-center justify-center shadow-lg">
        <div className="text-center p-8">
          <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">No User Anomaly Selected</h3>
          <p className="text-gray-400 text-base">Click on a user activity anomaly to view detailed analysis and response options.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-gray-600 bg-gray-800/60 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white text-xl flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-400" /> 
          User Behavior Anomaly Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-1">{behavior.user_id}</h3>
          <p className="text-gray-300 text-base">Session ID: {behavior.session_id}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-sm font-medium">
              ANOMALY DETECTED
            </Badge>
            <Badge variant="outline" className="text-gray-300 border-gray-500/50">
              {format(new Date(behavior.timestamp), 'PPP')}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700/50">
            <span className="text-gray-400 text-sm uppercase tracking-wide">Activity Type</span>
            <p className="text-white text-lg font-semibold capitalize mt-1">
              {behavior.activity_type.replace('_', ' ')}
            </p>
          </div>
          <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700/50">
            <span className="text-gray-400 text-sm uppercase tracking-wide">Anomaly Score</span>
            <p className="text-red-400 font-bold text-2xl mt-1">{behavior.anomaly_score}/100</p>
          </div>
          <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700/50">
            <span className="text-gray-400 text-sm uppercase tracking-wide">Detection Time</span>
            <p className="text-white text-base font-medium mt-1">
              {format(new Date(behavior.timestamp), 'PPpp')}
            </p>
          </div>
          <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700/50">
            <span className="text-gray-400 text-sm uppercase tracking-wide">Location</span>
            <p className="text-white text-base font-medium mt-1">{behavior.location}</p>
          </div>
        </div>

        <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700/50">
          <h4 className="font-semibold text-white text-lg mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            Risk Factors Identified
          </h4>
          <div className="flex flex-wrap gap-2">
            {behavior.risk_factors.map(factor => (
              <Badge 
                key={factor} 
                className="bg-red-500/20 text-red-300 border-red-500/30 text-sm px-3 py-1"
              >
                {factor.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700/50">
          <h4 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Security Response Actions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              className="bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/30 hover:text-blue-200 h-12 text-base font-medium"
              variant="outline"
              onClick={() => handleUserAction('investigate', behavior.user_id)}
            >
              <FileSearch className="w-5 h-5 mr-2" /> 
              Start Investigation
            </Button>
            <Button 
              className="bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/30 hover:text-red-200 h-12 text-base font-medium"
              variant="outline"
              onClick={() => handleUserAction('lockAccount', behavior.user_id)}
            >
              <UserX className="w-5 h-5 mr-2" /> 
              Lock User Account
            </Button>
            <Button 
              className="bg-green-600/20 border-green-500/50 text-green-300 hover:bg-green-600/30 hover:text-green-200 h-12 text-base font-medium"
              variant="outline"
              onClick={() => handleUserAction('markBenign', behavior.user_id)}
            >
              <UserCheck className="w-5 h-5 mr-2" /> 
              Mark as Benign
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}