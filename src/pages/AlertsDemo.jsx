import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAlerts } from '../components/alerts/AlertService';
import { 
  AlertTriangle, Shield, Bell, Zap, CheckCircle,
  Target, Lock, Activity, Database
} from 'lucide-react';

export default function AlertsDemo() {
  const { createAlert } = useAlerts();

  const testAlerts = [
    {
      type: 'critical_incident',
      severity: 'critical',
      title: 'Ransomware Detected',
      message: 'Multiple files encrypted on SERVER-DB-01. Immediate action required.',
      source: 'EDR',
      details: {
        hostname: 'SERVER-DB-01',
        affected_files: 1247,
        encryption_type: 'Sodinokibi',
        first_detected: new Date().toISOString()
      }
    },
    {
      type: 'high_severity_event',
      severity: 'high',
      title: 'Unusual Login Activity',
      message: 'Admin login from new location: Moscow, Russia',
      source: 'Azure AD',
      details: {
        user: 'admin@company.com',
        location: 'Moscow, RU',
        ip: '95.142.207.23',
        mfa_status: 'not_used'
      }
    },
    {
      type: 'misconfiguration_detected',
      severity: 'high',
      title: 'S3 Bucket Publicly Accessible',
      message: 'Production database backup bucket is publicly accessible',
      source: 'Cloud Security',
      details: {
        bucket: 'prod-db-backups',
        region: 'us-east-1',
        exposed_since: '2 hours ago',
        contains: 'database backups, customer data'
      }
    },
    {
      type: 'anomaly_detected',
      severity: 'medium',
      title: 'Data Exfiltration Attempt',
      message: 'User downloaded 10GB of sensitive data in 5 minutes',
      source: 'User Analytics',
      details: {
        user: 'john.smith@company.com',
        data_size: '10.2 GB',
        files_count: 423,
        destination: 'Personal OneDrive'
      }
    },
    {
      type: 'compliance_violation',
      severity: 'medium',
      title: 'MFA Not Enabled',
      message: '15 privileged users do not have MFA enabled',
      source: 'Compliance Engine',
      details: {
        affected_users: 15,
        policy: 'NIST 800-53 IA-2',
        deadline: '7 days',
        risk_level: 'high'
      }
    },
    {
      type: 'system_health',
      severity: 'low',
      title: 'API Latency Increased',
      message: 'API response time is 2x normal baseline',
      source: 'Azure Monitor',
      details: {
        current_latency: '450ms',
        baseline: '225ms',
        affected_endpoints: 3,
        started: '15 minutes ago'
      }
    },
    {
      type: 'authentication_failure',
      severity: 'high',
      title: 'Brute Force Attack Detected',
      message: '500 failed login attempts from single IP in 5 minutes',
      source: 'Sentinel',
      details: {
        source_ip: '185.220.101.45',
        targeted_accounts: 12,
        success_rate: '0%',
        attack_vector: 'password_spray'
      }
    },
    {
      type: 'data_exfiltration',
      severity: 'critical',
      title: 'Large Data Transfer to External IP',
      message: '250GB transferred to known malicious IP address',
      source: 'Network Monitor',
      details: {
        source_host: 'WKS-FINANCE-08',
        destination_ip: '45.142.212.61',
        data_size: '250 GB',
        threat_intel: 'Known C2 server - APT28'
      }
    }
  ];

  const triggerAlert = async (alertConfig) => {
    try {
      await createAlert({
        alert_type: alertConfig.type,
        severity: alertConfig.severity,
        title: alertConfig.title,
        message: alertConfig.message,
        source: alertConfig.source,
        details: alertConfig.details
      });
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Error creating alert. See console for details.');
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-600/20 text-red-300 border-red-500/50',
      high: 'bg-orange-600/20 text-orange-300 border-orange-500/50',
      medium: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50',
      low: 'bg-blue-600/20 text-blue-300 border-blue-500/50'
    };
    return colors[severity] || colors.medium;
  };

  const getIcon = (type) => {
    const icons = {
      critical_incident: AlertTriangle,
      high_severity_event: Shield,
      misconfiguration_detected: Target,
      anomaly_detected: Activity,
      compliance_violation: CheckCircle,
      system_health: Zap,
      authentication_failure: Lock,
      data_exfiltration: Database
    };
    return icons[type] || Bell;
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Real-Time Alert System Demo</h1>
          <p className="text-xl text-gray-300">
            Test toast notifications and webhook integrations
          </p>
        </div>

        <Alert className="mb-6 border-blue-500/50 bg-blue-500/10">
          <Bell className="h-5 w-5 text-blue-400" />
          <AlertDescription className="text-blue-200">
            <strong>How it works:</strong> Click any button below to trigger an alert. You'll see:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Toast notification in top-right corner</li>
              <li>Alert added to the Alert Panel (bell icon in header)</li>
              <li>Webhooks sent to configured integrations (Slack, PagerDuty, etc.)</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          {testAlerts.map((alert, idx) => {
            const Icon = getIcon(alert.type);
            return (
              <Card key={idx} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        alert.severity === 'critical' ? 'bg-red-600/20' :
                        alert.severity === 'high' ? 'bg-orange-600/20' :
                        alert.severity === 'medium' ? 'bg-yellow-600/20' :
                        'bg-blue-600/20'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          alert.severity === 'critical' ? 'text-red-400' :
                          alert.severity === 'high' ? 'text-orange-400' :
                          alert.severity === 'medium' ? 'text-yellow-400' :
                          'text-blue-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-2">
                          {alert.title}
                        </CardTitle>
                        <Badge 
                          variant="outline" 
                          className={getSeverityColor(alert.severity)}
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-300 text-sm">{alert.message}</p>
                  
                  <div className="text-xs text-gray-400">
                    <div className="font-semibold text-gray-300 mb-1">Details:</div>
                    <div className="bg-gray-900/50 rounded p-2 space-y-1">
                      {Object.entries(alert.details).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-gray-500">{key}:</span>{' '}
                          <span className="text-gray-300">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => triggerAlert(alert)}
                    className={
                      alert.severity === 'critical' ? 'bg-red-600 hover:bg-red-700 w-full' :
                      alert.severity === 'high' ? 'bg-orange-600 hover:bg-orange-700 w-full' :
                      'bg-blue-600 hover:bg-blue-700 w-full'
                    }
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Trigger Alert
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gray-800/50 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">1. Configure Webhooks</h3>
              <p className="text-sm">
                Go to <strong>Settings → Webhooks</strong> to add Slack, PagerDuty, or other integrations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">2. Trigger Test Alerts</h3>
              <p className="text-sm">
                Click any button above to create a test alert and see the system in action.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">3. View Alert Panel</h3>
              <p className="text-sm">
                Click the bell icon in the header to see all alerts and manage them.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">4. Production Integration</h3>
              <p className="text-sm">
                The alert system is integrated into Dashboard, Incidents, User Analytics, and other pages. Critical events automatically trigger alerts.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}