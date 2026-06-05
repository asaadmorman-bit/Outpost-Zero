import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAlerts } from './AlertService';
import { 
  AlertTriangle, Bell, CheckCircle, X, Eye, 
  Clock, Shield, XCircle, TrendingUp
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function AlertPanel({ isOpen, onClose }) {
  const { alerts, unreadCount, acknowledgeAlert, resolveAlert, dismissAlert } = useAlerts();
  const [filter, setFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'new') return alert.status === 'new';
    if (filter === 'acknowledged') return alert.status === 'acknowledged';
    return true;
  });

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-600/20 text-red-300 border-red-500/50',
      high: 'bg-orange-600/20 text-orange-300 border-orange-500/50',
      medium: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50',
      low: 'bg-blue-600/20 text-blue-300 border-blue-500/50'
    };
    return colors[severity] || colors.medium;
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      critical: AlertTriangle,
      high: Shield,
      medium: Bell,
      low: CheckCircle
    };
    const Icon = icons[severity] || Bell;
    return <Icon className="w-5 h-5" />;
  };

  const getAlertTypeLabel = (type) => {
    const labels = {
      critical_incident: 'Critical Incident',
      high_severity_event: 'High Severity Event',
      misconfiguration_detected: 'Misconfiguration',
      anomaly_detected: 'Anomaly Detected',
      compliance_violation: 'Compliance Violation',
      system_health: 'System Health',
      authentication_failure: 'Auth Failure',
      data_exfiltration: 'Data Exfiltration'
    };
    return labels[type] || type;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isMobile ? "bottom" : "right"}
        className={`bg-gray-900 border-gray-700 text-white ${
          isMobile ? 'h-[85vh] rounded-t-2xl' : 'w-full sm:max-w-xl'
        } overflow-y-auto`}
      >
        <SheetHeader className={isMobile ? 'text-center' : ''}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bell className="w-6 h-6 text-blue-400" />
            <SheetTitle className="text-white text-xl">
              Security Alerts
            </SheetTitle>
            {unreadCount > 0 && (
              <Badge className="bg-red-600 text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
          <SheetDescription className="text-gray-400">
            Real-time security alerts and notifications
          </SheetDescription>
        </SheetHeader>

        {/* Filters - Mobile Optimized */}
        <div className={`flex gap-2 mt-6 mb-4 ${isMobile ? 'overflow-x-auto pb-2' : 'flex-wrap'}`}>
          {[
            { key: 'all', label: 'All', count: alerts.length },
            { key: 'new', label: 'New', count: alerts.filter(a => a.status === 'new').length },
            { key: 'acknowledged', label: 'Ack', count: alerts.filter(a => a.status === 'acknowledged').length }
          ].map(({ key, label, count }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(key)}
              className={`${
                filter === key 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'border-gray-600'
              } ${isMobile ? 'min-w-[80px]' : ''} touch-manipulation`}
            >
              {label} ({count})
            </Button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-3 mt-4">
          {filteredAlerts.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-gray-400">No alerts to display</p>
                <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <Card 
                key={alert.id} 
                className={`bg-gray-800/50 border-gray-700 ${
                  alert.status === 'new' ? 'ring-2 ring-blue-500/50' : ''
                } touch-manipulation`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        alert.severity === 'critical' ? 'bg-red-600/20' :
                        alert.severity === 'high' ? 'bg-orange-600/20' :
                        alert.severity === 'medium' ? 'bg-yellow-600/20' :
                        'bg-blue-600/20'
                      }`}>
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start flex-wrap gap-2 mb-1">
                          <h4 className="text-white font-semibold text-sm break-words">
                            {alert.title}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`${getSeverityColor(alert.severity)} flex-shrink-0`}
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-2 break-words">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(alert.created_date).toLocaleString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {getAlertTypeLabel(alert.alert_type)}
                          </Badge>
                          {alert.source && (
                            <span className="break-words">From: {alert.source}</span>
                          )}
                        </div>
                        {alert.status === 'acknowledged' && alert.acknowledged_by && (
                          <div className="mt-2 text-xs text-green-400">
                            ✓ Acknowledged by {alert.acknowledged_by}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions - Mobile Optimized */}
                  <div className={`flex gap-2 mt-3 ${isMobile ? 'flex-col' : 'flex-wrap'}`}>
                    {alert.status === 'new' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className={`border-blue-600 text-blue-300 hover:bg-blue-600/10 touch-manipulation ${
                          isMobile ? 'w-full justify-center' : ''
                        }`}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Acknowledge
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveAlert(alert.id)}
                      className={`border-green-600 text-green-300 hover:bg-green-600/10 touch-manipulation ${
                        isMobile ? 'w-full justify-center' : 'flex-1'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => dismissAlert(alert.id)}
                      className={`border-gray-600 text-gray-300 hover:bg-gray-600/10 touch-manipulation ${
                        isMobile ? 'w-full justify-center' : 'flex-1'
                      }`}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Dismiss
                    </Button>
                  </div>

                  {/* Webhook Status */}
                  {alert.webhooks_sent && alert.webhooks_sent.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="text-xs text-gray-400 mb-1">Webhooks sent:</div>
                      <div className="flex gap-2 flex-wrap">
                        {alert.webhooks_sent.map((webhook, idx) => (
                          <Badge 
                            key={idx}
                            variant="outline"
                            className={webhook.status === 'success' 
                              ? 'bg-green-600/20 text-green-300 border-green-500/50'
                              : 'bg-red-600/20 text-red-300 border-red-500/50'
                            }
                          >
                            {webhook.webhook_type}: {webhook.status}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Bottom spacing for mobile */}
        {isMobile && <div className="h-8" />}
      </SheetContent>
    </Sheet>
  );
}