
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, Shield, XCircle, CheckCircle, Bell, Zap } from 'lucide-react';

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
  const [unreadCount, setUnreadCount] = useState(0);
  const [isListening, setIsListening] = useState(false);

  // Load existing alerts on mount
  useEffect(() => {
    loadAlerts();
    startAlertPolling();
    return () => stopAlertPolling();
  }, []);

  const loadAlerts = async () => {
    try {
      const existingAlerts = await base44.entities.Alert.filter({
        status: ['new', 'acknowledged']
      }, '-created_date', 50);
      
      setAlerts(existingAlerts || []);
      setUnreadCount(existingAlerts?.filter(a => a.status === 'new').length || 0);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  let pollingInterval;

  const startAlertPolling = () => {
    if (isListening) return;
    setIsListening(true);
    
    // Poll for new alerts every 10 seconds
    pollingInterval = setInterval(async () => {
      try {
        const latestAlerts = await base44.entities.Alert.filter({
          status: 'new'
        }, '-created_date', 10);

        if (latestAlerts && latestAlerts.length > 0) {
          const existingIds = new Set(alerts.map(a => a.id));
          const newAlerts = latestAlerts.filter(a => !existingIds.has(a.id));
          
          if (newAlerts.length > 0) {
            setAlerts(prev => [...newAlerts, ...prev]);
            setUnreadCount(prev => prev + newAlerts.length);
            
            // Show toast for each new alert
            newAlerts.forEach(alert => {
              showToastNotification(alert);
            });
          }
        }
      } catch (error) {
        console.error('Error polling alerts:', error);
      }
    }, 10000); // Poll every 10 seconds
  };

  const stopAlertPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setIsListening(false);
    }
  };

  const showToastNotification = (alert) => {
    const icons = {
      critical: AlertTriangle,
      high: Shield,
      medium: Bell,
      low: CheckCircle
    };

    const Icon = icons[alert.severity] || Bell;

    // Mobile-optimized toast positioning
    const isMobile = window.innerWidth < 768;

    const toastOptions = {
      duration: alert.severity === 'critical' ? 10000 : 5000,
      position: isMobile ? 'bottom-center' : 'top-right',
      action: {
        label: 'View',
        onClick: () => {
          // Navigate to appropriate page based on source
          if (alert.source === 'Incidents') {
            window.location.href = '/Incidents';
          } else if (alert.source === 'User Analytics') {
            window.location.href = '/UserAnalytics';
          } else {
            window.location.href = '/Dashboard';
          }
        }
      },
      icon: <Icon className="w-5 h-5" />,
      className: isMobile ? 'mb-20' : '' // Add margin bottom on mobile to avoid bottom nav
    };

    if (alert.severity === 'critical') {
      toast.error(`🚨 ${alert.title}`, {
        description: alert.message,
        ...toastOptions
      });
    } else if (alert.severity === 'high') {
      toast.warning(`⚠️ ${alert.title}`, {
        description: alert.message,
        ...toastOptions
      });
    } else {
      toast.info(`ℹ️ ${alert.title}`, {
        description: alert.message,
        ...toastOptions
      });
    }
  };

  const createAlert = async (alertData) => {
    try {
      const alert = {
        alert_id: `alert_${Date.now()}`,
        ...alertData,
        status: 'new',
        notification_sent: true
      };

      // Create alert in database
      const createdAlert = await base44.entities.Alert.create(alert);

      // Add to local state
      setAlerts(prev => [createdAlert, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Show toast
      showToastNotification(createdAlert);

      // Send webhooks
      await sendWebhookAlerts(createdAlert);

      return createdAlert;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  };

  const sendWebhookAlerts = async (alert) => {
    try {
      // Get active webhook configurations
      const configs = await base44.entities.AlertConfiguration.filter({
        enabled: true
      });

      if (!configs || configs.length === 0) return;

      // Filter configs based on alert type and severity
      const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
      const alertSeverityLevel = severityOrder[alert.severity];

      const matchingConfigs = configs.filter(config => {
        const thresholdLevel = severityOrder[config.severity_threshold];
        return (
          config.alert_types.includes(alert.alert_type) &&
          alertSeverityLevel >= thresholdLevel
        );
      });

      // Send webhooks (using backend function)
      const webhookPromises = matchingConfigs.map(async (config) => {
        try {
          const response = await base44.functions.invoke('sendWebhookAlert', {
            alert: alert,
            config: config
          });

          return {
            config_id: config.id,
            webhook_type: config.webhook_type,
            sent_at: new Date().toISOString(),
            status: 'success'
          };
        } catch (error) {
          console.error(`Webhook send error for ${config.name}:`, error);
          return {
            config_id: config.id,
            webhook_type: config.webhook_type,
            sent_at: new Date().toISOString(),
            status: 'failed',
            error: error.message
          };
        }
      });

      const webhookResults = await Promise.all(webhookPromises);

      // Update alert with webhook results
      await base44.entities.Alert.update(alert.id, {
        webhooks_sent: webhookResults
      });

    } catch (error) {
      console.error('Error sending webhook alerts:', error);
    }
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      const user = await base44.auth.me();
      await base44.entities.Alert.update(alertId, {
        status: 'acknowledged',
        acknowledged_by: user.email,
        acknowledged_at: new Date().toISOString()
      });

      setAlerts(prev => prev.map(a => 
        a.id === alertId 
          ? { ...a, status: 'acknowledged', acknowledged_by: user.email }
          : a
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      await base44.entities.Alert.update(alertId, {
        status: 'resolved',
        resolved_at: new Date().toISOString()
      });

      setAlerts(prev => prev.filter(a => a.id !== alertId));
      
      const alert = alerts.find(a => a.id === alertId);
      if (alert?.status === 'new') {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const dismissAlert = async (alertId) => {
    try {
      await base44.entities.Alert.update(alertId, {
        status: 'dismissed'
      });

      setAlerts(prev => prev.filter(a => a.id !== alertId));
      
      const alert = alerts.find(a => a.id === alertId);
      if (alert?.status === 'new') {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  const value = {
    alerts,
    unreadCount,
    createAlert,
    acknowledgeAlert,
    resolveAlert,
    dismissAlert,
    loadAlerts
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
}
