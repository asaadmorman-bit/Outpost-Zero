import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, Shield, Bell, Zap, XCircle } from 'lucide-react';

const AlertContext = createContext();

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within AlertProvider');
  }
  return context;
};

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const [config, setConfig] = useState({
    toast_enabled: true,
    webhook_enabled: false,
    webhooks: [],
    severity_threshold: 'medium', // low, medium, high, critical
    auto_dismiss: true,
    dismiss_after_seconds: 10
  });

  // Load alert configuration on mount
  useEffect(() => {
    loadAlertConfig();
  }, []);

  const loadAlertConfig = async () => {
    try {
      const user = await base44.auth.me();
      if (user && user.alert_config) {
        setConfig({ ...config, ...user.alert_config });
      }
    } catch (error) {
      console.log('Using default alert configuration');
    }
  };

  const saveAlertConfig = async (newConfig) => {
    try {
      await base44.auth.updateMe({ alert_config: newConfig });
      setConfig(newConfig);
      toast.success('Alert configuration saved');
    } catch (error) {
      console.error('Error saving alert config:', error);
      toast.error('Failed to save alert configuration');
    }
  };

  const shouldTriggerAlert = (severity) => {
    const severityLevels = { low: 0, medium: 1, high: 2, critical: 3 };
    return severityLevels[severity] >= severityLevels[config.severity_threshold];
  };

  const getAlertIcon = (type) => {
    const icons = {
      security: Shield,
      threat: AlertTriangle,
      misconfiguration: Zap,
      system: Bell,
      error: XCircle
    };
    return icons[type] || Bell;
  };

  const sendToWebhooks = async (alert) => {
    if (!config.webhook_enabled || config.webhooks.length === 0) {
      return;
    }

    try {
      // Call backend function to send webhooks
      const { sendWebhookAlert } = await import('@/functions/sendWebhookAlert');
      await sendWebhookAlert({
        webhooks: config.webhooks,
        alert: alert
      });
    } catch (error) {
      console.error('Error sending webhook:', error);
    }
  };

  const triggerAlert = useCallback(async (alertData) => {
    const {
      id = `alert_${Date.now()}`,
      title,
      message,
      severity = 'medium',
      type = 'security',
      source,
      metadata = {},
      actionUrl
    } = alertData;

    // Check if alert should be triggered based on severity threshold
    if (!shouldTriggerAlert(severity)) {
      return;
    }

    const alert = {
      id,
      title,
      message,
      severity,
      type,
      source,
      metadata,
      actionUrl,
      timestamp: new Date().toISOString(),
      dismissed: false
    };

    // Add to alerts list
    setAlerts(prev => [alert, ...prev].slice(0, 100)); // Keep last 100 alerts

    // Show toast notification
    if (config.toast_enabled) {
      const Icon = getAlertIcon(type);
      const severityColors = {
        low: 'bg-blue-500',
        medium: 'bg-yellow-500',
        high: 'bg-orange-500',
        critical: 'bg-red-500'
      };

      toast.custom((t) => (
        <div className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 ${
          severity === 'critical' ? 'bg-red-900/90 border-red-500' :
          severity === 'high' ? 'bg-orange-900/90 border-orange-500' :
          severity === 'medium' ? 'bg-yellow-900/90 border-yellow-500' :
          'bg-blue-900/90 border-blue-500'
        } backdrop-blur-sm`}>
          <Icon className={`w-6 h-6 flex-shrink-0 ${
            severity === 'critical' ? 'text-red-300' :
            severity === 'high' ? 'text-orange-300' :
            severity === 'medium' ? 'text-yellow-300' :
            'text-blue-300'
          }`} />
          <div className="flex-1">
            <div className="font-semibold text-white mb-1">{title}</div>
            <div className="text-sm text-gray-200">{message}</div>
            {actionUrl && (
              <a 
                href={actionUrl} 
                className="text-xs text-blue-300 hover:text-blue-200 underline mt-2 inline-block"
              >
                View Details →
              </a>
            )}
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-gray-400 hover:text-white"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      ), {
        duration: config.auto_dismiss ? config.dismiss_after_seconds * 1000 : Infinity,
        position: 'top-right'
      });
    }

    // Send to webhooks
    await sendToWebhooks(alert);

    return alert;
  }, [config]);

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const getActiveAlerts = () => {
    return alerts.filter(alert => !alert.dismissed);
  };

  const getAlertsBySeverity = (severity) => {
    return alerts.filter(alert => !alert.dismissed && alert.severity === severity);
  };

  const value = {
    alerts,
    activeAlerts: getActiveAlerts(),
    config,
    triggerAlert,
    dismissAlert,
    clearAllAlerts,
    getAlertsBySeverity,
    saveAlertConfig
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
}