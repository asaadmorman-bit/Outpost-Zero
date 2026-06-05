import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bell } from 'lucide-react';
import { useAlerts } from '../alerts/AlertService';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileAlertBanner({ onOpenPanel }) {
  const { alerts, unreadCount } = useAlerts();
  
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'new');
  const highAlerts = alerts.filter(a => a.severity === 'high' && a.status === 'new');

  if (unreadCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-16 left-0 right-0 z-40 md:hidden"
      >
        <div 
          onClick={onOpenPanel}
          className="mx-3 mb-2 p-3 rounded-lg shadow-lg border-l-4 cursor-pointer touch-manipulation"
          style={{
            background: criticalAlerts.length > 0 
              ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(185, 28, 28, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.1) 100%)',
            borderLeftColor: criticalAlerts.length > 0 ? '#dc2626' : '#f97316'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {criticalAlerts.length > 0 ? (
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 animate-pulse" />
              ) : (
                <Bell className="w-6 h-6 text-orange-400 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-semibold text-sm">
                    {unreadCount} Active Alert{unreadCount !== 1 ? 's' : ''}
                  </span>
                  {criticalAlerts.length > 0 && (
                    <Badge className="bg-red-600 text-white text-xs">
                      {criticalAlerts.length} Critical
                    </Badge>
                  )}
                  {highAlerts.length > 0 && (
                    <Badge className="bg-orange-600/80 text-white text-xs">
                      {highAlerts.length} High
                    </Badge>
                  )}
                </div>
                <p className="text-gray-300 text-xs mt-1">
                  Tap to view and manage alerts
                </p>
              </div>
            </div>
            <Bell className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}