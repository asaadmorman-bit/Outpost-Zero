
import React, { useState, useEffect, useCallback } from "react";
import { SecurityEvent, Incident, ThreatIntelligence, UserBehavior, Misconfiguration, AIAdvisory } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Shield,
  AlertTriangle,
  Activity,
  Brain,
  TrendingUp,
  Users,
  Globe,
  Zap as ZapIcon,
  RefreshCw,
  Info
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

import StrategicCommandSummary from "../components/dashboard/StrategicCommandSummary";
import ThreatMap from "../components/dashboard/ThreatMap";
import SecurityMetrics from "../components/dashboard/SecurityMetrics";
import RecentEvents from "../components/dashboard/RecentEvents";
import ThreatLevel from "../components/dashboard/ThreatLevel";
import MisconfigurationWidget from "../components/dashboard/MisconfigurationWidget";
import DemoModeToggle from "../components/dashboard/DemoModeToggle";
import QuickActions from "../components/dashboard/QuickActions";
import { useAlerts } from '../components/alerts/AlertProvider';
import MobileDashboardWidget from '../components/mobile/MobileDashboardWidget';

// Helper function to generate attack data
const generateAttackData = (currentData) => {
  const now = new Date();
  const criticalEvent = {
    id: `evt_attack_${Date.now()}`,
    event_id: `evt_attack_${Date.now()}`,
    timestamp: now.toISOString(),
    event_type: 'data_exfiltration',
    severity: 'critical',
    source_ip: '142.250.190.78', // A known "hostile" IP for demo
    description: 'Anomalous large data transfer to known malicious IP',
    ml_risk_score: 98,
    status: 'open'
  };

  const highEvent = {
    id: `evt_high_${Date.now() + 1}`, // Ensure unique ID
    event_id: `evt_high_${Date.now() + 1}`,
    timestamp: new Date(now.getTime() - 1000).toISOString(),
    event_type: 'privilege_escalation',
    severity: 'high',
    source_ip: '10.1.1.23',
    description: 'User "j.doe" attempted to escalate privileges on "DB-SERVER-01"',
    ml_risk_score: 85,
    status: 'open'
  };

  // Combine new events with existing, keeping the list from getting too large for performance
  const newEvents = [criticalEvent, highEvent, ...currentData.securityEvents.slice(0, 48)]; // Keep around 50 events

  const newIncident = {
    id: 'incident_live_attack',
    incident_id: 'incident_live_attack',
    title: "Critical: Ransomware Attack In Progress",
    description: "Multi-stage ransomware attack detected, originating from phishing email. Data exfiltration in progress.",
    severity: 'critical',
    status: 'investigating',
    created_date: now.toISOString(),
    affected_assets: ["DB-SERVER-01", "FILE-SERVER-03", "15 workstations"],
    assigned_to: 'soc.lead@outpostzero.com'
  };

  const newAdvisory = {
    advisory_id: 'adv_live_attack',
    title: 'AI Advisory: Isolate Compromised Server',
    summary: 'AI analysis recommends immediate network isolation of server "DB-SERVER-01" to halt data exfiltration.',
    severity: 'critical',
    status: 'pending',
    advisory_type: 'incident_response',
    confidence_score: 99
  };

  const highRiskUser = {
      id: 'behavior_live_attack',
      user_id: 'j.doe@example.com',
      anomaly_score: 98,
      timestamp: now.toISOString(),
      risk_factors: ['impossible_travel', 'large_data_upload_off_hours', 'accessing_sensitive_files'],
      normal_pattern: false
  };

  // Avoid duplicates or overwrite existing critical entries if they are part of the attack
  const existingIncidents = currentData.incidents.filter(i => i.id !== 'incident_live_attack');
  const existingAdvisories = currentData.advisories.filter(a => a.advisory_id !== 'adv_live_attack');
  const existingBehaviors = currentData.userBehavior.filter(u => u.id !== 'behavior_live_attack');

  return {
    securityEvents: newEvents,
    incidents: [newIncident, ...existingIncidents],
    advisories: [newAdvisory, ...existingAdvisories],
    userBehavior: [highRiskUser, ...existingBehaviors]
  };
};


export default function DashboardPage() {
  const [securityEvents, setSecurityEvents] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [threatIntel, setThreatIntel] = useState([]);
  const [userBehavior, setUserBehavior] = useState([]);
  const [misconfigurations, setMisconfigurations] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [isLiveDemo, setIsLiveDemo] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const { triggerAlert } = useAlerts();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDebugInfo({
      loadStartTime: new Date().toISOString(),
      domain: window.location.hostname,
      userAgent: navigator.userAgent.substring(0, 100)
    });

    try {
      console.log('Starting dashboard data load...');

      // Add timeout wrapper for each entity call
      const loadWithTimeout = (entityCall, entityName) => {
        return Promise.race([
          entityCall,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`${entityName} timeout after 10 seconds`)), 10000)
          )
        ]);
      };

      // Try to load each entity with individual error handling
      const results = await Promise.allSettled([
        loadWithTimeout(SecurityEvent.list("-timestamp", 100).catch(() => []), "SecurityEvent"),
        loadWithTimeout(Incident.list("-created_date", 50).catch(() => []), "Incident"),
        loadWithTimeout(ThreatIntelligence.list("-last_seen", 50).catch(() => []), "ThreatIntelligence"),
        loadWithTimeout(UserBehavior.list("-timestamp", 100).catch(() => []), "UserBehavior"),
        loadWithTimeout(Misconfiguration.list().catch(() => []), "Misconfiguration"),
        loadWithTimeout(AIAdvisory.list().catch(() => []), "AIAdvisory")
      ]);

      // Process results and collect debug info
      const debugResults = {};

      const eventsData = results[0].status === 'fulfilled' ? results[0].value : [];
      debugResults.SecurityEvent = { status: results[0].status, count: eventsData.length };
      setSecurityEvents(eventsData);

      const incidentsData = results[1].status === 'fulfilled' ? results[1].value : [];
      debugResults.Incident = { status: results[1].status, count: incidentsData.length };
      setIncidents(incidentsData);

      const threatData = results[2].status === 'fulfilled' ? results[2].value : [];
      debugResults.ThreatIntelligence = { status: results[2].status, count: threatData.length };
      setThreatIntel(threatData);

      const behaviorData = results[3].status === 'fulfilled' ? results[3].value : [];
      debugResults.UserBehavior = { status: results[3].status, count: behaviorData.length };
      setUserBehavior(behaviorData);

      const misconfigData = results[4].status === 'fulfilled' ? results[4].value : [];
      debugResults.Misconfiguration = { status: results[4].status, count: misconfigData.length };
      setMisconfigurations(misconfigData);

      const advisoryData = results[5].status === 'fulfilled' ? results[5].value : [];
      debugResults.AIAdvisory = { status: results[5].status, count: advisoryData.length };
      setAdvisories(advisoryData);

      // Store this as the clean state if demo mode is not active
      // Preserving original functionality, this depends on isLiveDemo state
      if (!isLiveDemo) {
        setOriginalData({
          securityEvents: eventsData,
          incidents: incidentsData,
          threatIntel: threatData,
          userBehavior: behaviorData,
          misconfigurations: misconfigData,
          advisories: advisoryData
        });
      }

      setDebugInfo(prev => ({
        ...prev,
        loadEndTime: new Date().toISOString(),
        entityResults: debugResults,
        totalEntitiesLoaded: Object.values(debugResults).filter(r => r.status === 'fulfilled').length
      }));

      console.log('Dashboard data loaded successfully:', debugResults);
      triggerAlert('success', 'Dashboard data loaded successfully.');

    } catch (error) {
      console.error("Critical error loading dashboard data:", error);
      setError(`Failed to load dashboard: ${error.message}`);
      setDebugInfo(prev => ({
        ...prev,
        loadEndTime: new Date().toISOString(),
        criticalError: error.message,
        errorStack: error.stack?.substring(0, 500)
      }));
      triggerAlert('error', `Failed to load dashboard: ${error.message}`);
    }
    setIsLoading(false);
  }, [isLiveDemo, triggerAlert]); // isLiveDemo is a dependency because the setOriginalData conditional depends on it, triggerAlert added as dependency

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    let interval;
    if (isLiveDemo) {
      // Start simulating data every 2 seconds
      interval = setInterval(() => {
        setSecurityEvents(prevEvents => {
          const newEvent = {
            id: `evt_sim_${Date.now()}`,
            event_id: `evt_sim_${Date.now()}`,
            timestamp: new Date().toISOString(),
            event_type: Math.random() > 0.7 ? 'privilege_escalation' : 'lateral_movement',
            severity: Math.random() > 0.5 ? 'high' : 'critical',
            source_ip: `10.2.3.${Math.floor(Math.random() * 255)}`,
            description: 'Simulated attack traffic detected.',
            ml_risk_score: Math.floor(80 + Math.random() * 20),
            status: 'open'
          };
          // Prepend new event and keep array size manageable
          return [newEvent, ...prevEvents.slice(0, 49)];
        });
      }, 2000);
    } else if (originalData) {
      // If demo is turned off, restore original data
      setSecurityEvents(originalData.securityEvents);
      setIncidents(originalData.incidents);
      setThreatIntel(originalData.threatIntel);
      setUserBehavior(originalData.userBehavior);
      setMisconfigurations(originalData.misconfigurations);
      setAdvisories(originalData.advisories);
      setOriginalData(null); // Clear original data after restoring
    }

    return () => clearInterval(interval);
  }, [isLiveDemo, originalData]);

  const handleToggleDemoMode = (checked) => {
    setIsLiveDemo(checked);
    if (checked) {
      // Save current state as original data if it's not already saved
      // This is crucial to revert to the *actual* loaded data, not just an empty array if demo is enabled before load.
      if (!originalData) {
        setOriginalData({ securityEvents, incidents, threatIntel, userBehavior, misconfigurations, advisories });
      }
      // Immediately inject first attack data
      const attackData = generateAttackData({ securityEvents, incidents, advisories, userBehavior });
      setSecurityEvents(attackData.securityEvents.slice(0, 50)); // Keep the list from growing too large
      setIncidents(attackData.incidents);
      setAdvisories(attackData.advisories);
      setUserBehavior(attackData.userBehavior);
    }
    // else block is handled by the useEffect for isLiveDemo when it becomes false
  };

  const handleQuickActionComplete = (actionType) => {
    console.log('Quick action completed:', actionType);
    triggerAlert('info', `Quick action "${actionType}" completed.`);
    loadDashboardData(); // Reload dashboard after action
  };

  const handleAttackSimulation = () => {
    handleToggleDemoMode(true); // Activating demo mode simulates an attack
    triggerAlert('warning', 'Live attack simulation initiated!');
  };

  const criticalEvents = securityEvents.filter(e => e.severity === 'critical').length;
  const highEvents = securityEvents.filter(e => e.severity === 'high').length;
  const openIncidents = incidents.filter(i => ['open', 'investigating'].includes(i.status)).length;
  const criticalAdvisories = advisories.filter(a => a.severity === 'critical').length;
  const avgRiskScore = userBehavior.length > 0 ?
    userBehavior.reduce((sum, b) => sum + (b.anomaly_score || 0), 0) / userBehavior.length : 0;

  const threatLevelColor = isLiveDemo ? 'critical' :
                         criticalEvents > 0 || criticalAdvisories > 0 ? 'critical' :
                         highEvents > 3 ? 'high' :
                         highEvents > 0 ? 'medium' : 'low';

  const criticalIncidents = incidents.filter(i => i.severity === 'critical').length;
  const highSeverityEvents = securityEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length;
  const openMisconfigs = misconfigurations.filter(m => m.status === 'open').length;

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-96">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-semibold text-white mb-2">Loading Security Operations Center</h2>
            <p className="text-gray-400 text-center max-w-md">
              Initializing threat intelligence feeds, security event processing, and real-time monitoring systems...
            </p>
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <p className="text-xs text-gray-400 mb-2">Debug Info:</p>
              <p className="text-xs text-gray-300">Domain: {debugInfo.domain}</p>
              <p className="text-xs text-gray-300">Load Started: {debugInfo.loadStartTime}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
        <div className="max-w-7xl mx-auto">
          <Alert className="mb-6 border-red-500/50 bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              <strong>Dashboard Loading Error:</strong> {error}
            </AlertDescription>
          </Alert>

          <Card className="mb-6 border-gray-700 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Info className="h-5 w-5 text-blue-400" />
                Debug Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Domain:</span>
                  <span className="ml-2 text-white">{debugInfo.domain}</span>
                </div>
                <div>
                  <span className="text-gray-400">Load Duration:</span>
                  <span className="ml-2 text-white">
                    {debugInfo.loadStartTime && debugInfo.loadEndTime ?
                      `${Math.round((new Date(debugInfo.loadEndTime) - new Date(debugInfo.loadStartTime)) / 1000)}s` : 'N/A'}
                  </span>
                </div>
                {debugInfo.entityResults && (
                  <div>
                    <span className="text-gray-400">Entity Status:</span>
                    <div className="mt-2 ml-2 space-y-1">
                      {Object.entries(debugInfo.entityResults).map(([entity, result]) => (
                        <div key={entity} className="flex justify-between">
                          <span className="text-gray-300">{entity}:</span>
                          <span className={result.status === 'fulfilled' ? 'text-green-400' : 'text-red-400'}>
                            {result.status} ({result.count} items)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {debugInfo.criticalError && (
                  <div>
                    <span className="text-gray-400">Error Details:</span>
                    <pre className="mt-1 overflow-x-auto rounded bg-gray-900/50 p-2 text-xs text-red-300">
                      {debugInfo.criticalError}
                    </pre>
                  </div>
                )}
              </div>
              <Button onClick={loadDashboardData} className="mt-4 bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Loading Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Show minimal dashboard even with errors */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">Fallback Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Dashboard is running in fallback mode due to data loading issues.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl mb-2">Security Operations Center</h1>
            <p style={{color: 'var(--text-secondary)'}} className="text-sm md:text-base">
              Real-time threat monitoring and incident response
            </p>
          </div>
          <div className="flex items-center gap-4">
            <DemoModeToggle isLiveDemo={isLiveDemo} onToggle={handleToggleDemoMode} />
            {debugInfo.totalEntitiesLoaded !== undefined && (
              <Badge className="bg-green-500/20 text-xs text-green-300">
                {debugInfo.totalEntitiesLoaded}/6 Systems Online
              </Badge>
            )}
          </div>
        </div>

        <div className="mb-6">
            <ThreatLevel level={threatLevelColor} />
        </div>

        {isLiveDemo && (
          <Alert className="mb-6 animate-pulse border-red-500/50 bg-red-900/30">
            <ZapIcon className="h-5 w-5 text-red-400" />
            <AlertTitle className="font-bold text-red-300">Live Attack In Progress!</AlertTitle>
            <AlertDescription className="text-red-200">
              Multi-stage ransomware attack detected. System is in high-alert mode. AI is recommending containment actions.
            </AlertDescription>
          </Alert>
        )}

        {/* NEW: Quick Actions Panel */}
        <div className="mb-8">
          {/* QuickActions now also takes onRunSimulation */}
          <QuickActions onActionComplete={handleQuickActionComplete} onRunSimulation={handleAttackSimulation} />
        </div>

        {/* Mobile-Optimized Stats Grid */}
        {isMobile ? (
            <div className="grid grid-cols-2 gap-3 mb-6">
                <MobileDashboardWidget
                    title="Critical Incidents"
                    value={criticalIncidents}
                    severity="critical"
                    icon={AlertTriangle}
                    onClick={() => window.location.href = '/Incidents'}
                    trend={criticalIncidents > 0 ? 'up' : 'down'}
                    trendValue={`${criticalIncidents} active`}
                />
                <MobileDashboardWidget
                    title="High Severity"
                    value={highSeverityEvents}
                    severity="high"
                    icon={Shield}
                    onClick={() => window.location.href = '/Incidents'}
                    trend={highSeverityEvents > 5 ? 'up' : 'down'}
                    trendValue={`${highSeverityEvents} events`}
                />
                <MobileDashboardWidget
                    title="Misconfigurations"
                    value={openMisconfigs}
                    severity={openMisconfigs > 10 ? 'high' : 'medium'}
                    icon={Activity}
                    onClick={() => window.location.href = '/CloudSecurity'}
                    trendValue={`${openMisconfigs} open`}
                />
                <MobileDashboardWidget
                    title="Risk Score"
                    value="7.2/10"
                    severity="medium"
                    icon={TrendingUp}
                    onClick={() => window.location.href = '/ExecutiveDashboard'}
                    trend="down"
                    trendValue="-0.3"
                />
            </div>
        ) : (
          <>
            <StrategicCommandSummary
              // All props removed as per outline
            />
            <SecurityMetrics
                incidents={incidents}
                securityEvents={securityEvents}
                misconfigurations={misconfigurations}
                threatIntel={threatIntel}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ThreatLevel /> {/* Level prop removed as per outline */}
                <QuickActions onRunSimulation={handleAttackSimulation} /> {/* Only onRunSimulation kept as per outline */}
            </div>
          </>
        )}


        {(criticalEvents > 0 || criticalAdvisories > 0) && !isLiveDemo && ( // Only show if not in live demo
          <Alert className="mb-6 border-red-500/50 bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              <strong>{criticalEvents > 0 && `${criticalEvents} critical events. `}{criticalAdvisories > 0 && `${criticalAdvisories} critical advisories.`}</strong> require immediate attention.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <RecentEvents events={securityEvents} isLoading={false} />
          </div>
          <div className="lg:col-span-1">
            <ThreatMap threatIntel={threatIntel} events={securityEvents} />
          </div>
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-white md:text-xl">
                  <Activity className="h-5 w-5 text-blue-400" />
                  Event Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={securityEvents.slice(0, 20).reverse()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="timestamp"
                        stroke="#9ca3af"
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="ml_risk_score"
                        stroke="#00d4ff"
                        strokeWidth={2}
                        dot={{fill: '#00d4ff', strokeWidth: 2, r: 4}}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <MisconfigurationWidget misconfigs={misconfigurations} />
          </div>
        </div>
      </div>
    </div>
  );
}
