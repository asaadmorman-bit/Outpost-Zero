import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield, Radio, AlertTriangle, Activity, Users, MapPin, Eye, Settings,
  Plus, RefreshCw, Zap, Bell, Lock, Unlock, Video, TrendingUp, BarChart3,
  CheckCircle, XCircle, Clock, Target, Crosshair, FileText, Download, Code
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function EvolvIntegration() {
  const [integrations, setIntegrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [zones, setZones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [integrationsData, eventsData, zonesData] = await Promise.all([
        base44.entities.EvolvIntegration.list('-created_date', 50),
        base44.entities.WeaponDetectionEvent.list('-detection_timestamp', 100),
        base44.entities.VenueSecurityZone.list('-created_date', 50)
      ]);

      setIntegrations(integrationsData.length > 0 ? integrationsData : getMockIntegrations());
      setEvents(eventsData.length > 0 ? eventsData : getMockEvents());
      setZones(zonesData.length > 0 ? zonesData : getMockZones());
    } catch (error) {
      console.error('Error loading data:', error);
      setIntegrations(getMockIntegrations());
      setEvents(getMockEvents());
      setZones(getMockZones());
    }
    setIsLoading(false);
  };

  const getMockIntegrations = () => [
    {
      id: '1',
      integration_id: 'evolv_001',
      venue_name: 'MetLife Stadium',
      venue_type: 'stadium',
      evolv_system_type: 'evolv_express',
      connection_status: 'connected',
      zones_monitored: [
        {zone_id: 'zone_001', zone_name: 'Gate A', entry_point: 'North Entrance', capacity: 5000},
        {zone_id: 'zone_002', zone_name: 'Gate B', entry_point: 'South Entrance', capacity: 5000},
        {zone_id: 'zone_003', zone_name: 'VIP Entrance', entry_point: 'West VIP', capacity: 500}
      ],
      statistics: {
        total_scans_today: 47853,
        weapons_detected_today: 12,
        average_throughput_per_hour: 8000,
        false_positive_rate: 0.8
      },
      last_sync: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      integration_id: 'evolv_002',
      venue_name: 'Madison Square Garden',
      venue_type: 'arena',
      evolv_system_type: 'evolv_edge',
      connection_status: 'connected',
      zones_monitored: [
        {zone_id: 'zone_004', zone_name: 'Main Entrance', entry_point: '7th Avenue', capacity: 3000}
      ],
      statistics: {
        total_scans_today: 18234,
        weapons_detected_today: 3,
        average_throughput_per_hour: 3500
      },
      last_sync: new Date(Date.now() - 2 * 60 * 1000).toISOString()
    }
  ];

  const getMockEvents = () => [
    {
      id: '1',
      event_id: 'evt_001',
      integration_id: 'evolv_001',
      venue_name: 'MetLife Stadium',
      zone_id: 'zone_001',
      entry_point: 'Gate A - North Entrance',
      detection_timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      detection_type: 'firearm',
      confidence_score: 98,
      threat_level: 'critical',
      status: 'investigating',
      response_actions: [
        {action_type: 'security_notified', timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(), performed_by: 'System'},
        {action_type: 'law_enforcement_notified', timestamp: new Date(Date.now() - 13 * 60 * 1000).toISOString(), performed_by: 'Security Director'}
      ]
    },
    {
      id: '2',
      event_id: 'evt_002',
      integration_id: 'evolv_001',
      venue_name: 'MetLife Stadium',
      zone_id: 'zone_002',
      entry_point: 'Gate B - South Entrance',
      detection_timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      detection_type: 'knife',
      confidence_score: 92,
      threat_level: 'high',
      status: 'cleared',
      false_positive: false,
      resolution_notes: 'Legal pocket knife, within regulations',
      response_actions: [
        {action_type: 'secondary_screening', timestamp: new Date(Date.now() - 43 * 60 * 1000).toISOString()}
      ]
    },
    {
      id: '3',
      event_id: 'evt_003',
      integration_id: 'evolv_002',
      venue_name: 'Madison Square Garden',
      zone_id: 'zone_004',
      entry_point: 'Main Entrance - 7th Avenue',
      detection_timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      detection_type: 'prohibited_item',
      confidence_score: 85,
      threat_level: 'medium',
      status: 'confiscated',
      response_actions: [
        {action_type: 'item_confiscated', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()}
      ]
    }
  ];

  const getMockZones = () => [
    {
      id: '1',
      zone_id: 'zone_001',
      venue_name: 'MetLife Stadium',
      zone_name: 'Gate A',
      zone_type: 'main_entrance',
      capacity: 5000,
      evolv_units_deployed: 4,
      operational_status: 'active',
      current_throughput: 3200,
      total_scans_today: 18453,
      detections_today: 5,
      staff_assigned: ['security.lead@venue.com', 'guard1@venue.com']
    },
    {
      id: '2',
      zone_id: 'zone_002',
      venue_name: 'MetLife Stadium',
      zone_name: 'Gate B',
      zone_type: 'main_entrance',
      capacity: 5000,
      evolv_units_deployed: 4,
      operational_status: 'active',
      current_throughput: 2800,
      total_scans_today: 16234,
      detections_today: 4
    }
  ];

  const totalScansToday = integrations.reduce((sum, i) => sum + (i.statistics?.total_scans_today || 0), 0);
  const totalDetectionsToday = integrations.reduce((sum, i) => sum + (i.statistics?.weapons_detected_today || 0), 0);
  const avgThroughput = integrations.reduce((sum, i) => sum + (i.statistics?.average_throughput_per_hour || 0), 0);
  const connectedVenues = integrations.filter(i => i.connection_status === 'connected').length;

  const criticalEvents = events.filter(e => e.threat_level === 'critical' && e.status === 'investigating').length;
  const activeIncidents = events.filter(e => e.status === 'investigating' || e.status === 'detected').length;

  // Chart data
  const detectionsByType = [
    { name: 'Firearms', value: events.filter(e => e.detection_type === 'firearm').length, color: '#ef4444' },
    { name: 'Knives', value: events.filter(e => e.detection_type === 'knife').length, color: '#f59e0b' },
    { name: 'Explosives', value: events.filter(e => e.detection_type === 'explosive').length, color: '#dc2626' },
    { name: 'Prohibited', value: events.filter(e => e.detection_type === 'prohibited_item').length, color: '#fbbf24' }
  ];

  const hourlyData = Array.from({ length: 12 }, (_, i) => {
    const hour = new Date(Date.now() - (11 - i) * 60 * 60 * 1000).getHours();
    const count = events.filter(e => {
      const eventHour = new Date(e.detection_timestamp).getHours();
      return eventHour === hour;
    }).length;
    return { hour: `${hour}:00`, detections: count };
  });

  const downloadAPIDoc = () => {
    const doc = `EVOLV TECHNOLOGY - OUTPOST ZERO INTEGRATION API
================================================

OVERVIEW
--------
Integrate Evolv Technology weapons detection systems with Outpost Zero
for unified security operations, real-time alerting, and incident management.

API ENDPOINTS
-------------

1. WEBHOOK RECEIVER (Evolv → Outpost Zero)
   POST /api/evolv/webhook
   
   Headers:
   - X-Evolv-Signature: <webhook signature>
   - Content-Type: application/json
   
   Payload:
   {
     "event_id": "evt_12345",
     "timestamp": "2024-11-11T10:30:00Z",
     "venue_id": "venue_001",
     "zone": "Gate A",
     "detection_type": "firearm",
     "confidence": 98,
     "threat_level": "critical",
     "person_data": {
       "ticket_number": "A12345",
       "image_id": "img_67890"
     }
   }

2. QUERY EVENTS (Outpost Zero → Evolv)
   GET /api/evolv/events
   
   Query Parameters:
   - venue_id: string
   - start_date: ISO 8601
   - end_date: ISO 8601
   - threat_level: low|medium|high|critical
   
   Response:
   {
     "events": [...],
     "total_count": 47,
     "page": 1
   }

3. GET ZONE STATISTICS
   GET /api/evolv/zones/{zone_id}/stats
   
   Response:
   {
     "zone_id": "zone_001",
     "scans_today": 18453,
     "detections_today": 5,
     "throughput_current": 3200,
     "status": "active"
   }

AUTHENTICATION
--------------
All API calls require API key in header:
Authorization: Bearer <your_api_key>

WEBHOOK SETUP
-------------
1. Configure Evolv system to send events to:
   https://your-instance.outpostzero.com/api/evolv/webhook

2. Add webhook signature secret to Outpost Zero settings

3. Test connection with test event

ALERT CONFIGURATION
-------------------
Configure automatic alerts for:
- Weapon detections (severity threshold)
- System health issues
- Unusual detection patterns
- Throughput anomalies

INCIDENT AUTO-CREATION
----------------------
Outpost Zero can automatically create security incidents for:
- Critical threat detections (firearms, explosives)
- Multiple detections in short timeframe
- System tampering attempts

SUPPORTED FEATURES
------------------
✓ Real-time weapon detection alerts
✓ Video footage integration
✓ Access control system integration
✓ Automatic incident creation
✓ Analytics and reporting
✓ Multi-venue management
✓ Mobile alerts for security teams
✓ Historical trend analysis

CONTACT
-------
Technical Support: support@outpostzero.com
Evolv Integration: evolv@cyberdojogroup.com
Documentation: https://docs.outpostzero.com/integrations/evolv

© 2024 Cyber Dojo Solutions - Evolv Technology Partner`;

    const blob = new Blob([doc], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Evolv-Integration-API-Documentation.txt';
    a.click();
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Shield className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Evolv Technology Integration</h1>
          </div>
          <p className="text-xl text-gray-300 mb-4">
            AI-Powered Weapons Detection & Physical Security
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 px-4 py-2">
              <Radio className="w-4 h-4 mr-2" />
              {connectedVenues} Connected Venues
            </Badge>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/50 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              Real-Time Monitoring
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Auto-Response Enabled
            </Badge>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalEvents > 0 && (
          <Alert className="mb-6 border-red-500/50 bg-red-500/10 animate-pulse">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <AlertDescription className="text-red-200">
              <strong>CRITICAL:</strong> {criticalEvents} weapon detection(s) require immediate investigation!
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-white" />
                <div>
                  <div className="text-3xl font-bold text-white">{totalScansToday.toLocaleString()}</div>
                  <div className="text-sm text-gray-200">Scans Today</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-600 to-red-700 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-white" />
                <div>
                  <div className="text-3xl font-bold text-white">{totalDetectionsToday}</div>
                  <div className="text-sm text-gray-200">Detections Today</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-white" />
                <div>
                  <div className="text-3xl font-bold text-white">{avgThroughput.toLocaleString()}</div>
                  <div className="text-sm text-gray-200">People/Hour</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-white" />
                <div>
                  <div className="text-3xl font-bold text-white">{activeIncidents}</div>
                  <div className="text-sm text-gray-200">Active Incidents</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Button onClick={loadData} variant="outline" className="border-gray-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button onClick={downloadAPIDoc} variant="outline" className="border-blue-600 text-blue-300 hover:bg-blue-600/10">
              <Download className="w-4 h-4 mr-2" />
              Download API Docs
            </Button>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Venue Integration
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="venues">Venues ({integrations.length})</TabsTrigger>
            <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
            <TabsTrigger value="zones">Zones ({zones.length})</TabsTrigger>
            <TabsTrigger value="api">API/SDK</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6 space-y-6">
            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Detection Timeline (12h)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="hour" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Line type="monotone" dataKey="detections" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Detections by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={detectionsByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {detectionsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Detections */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Detection Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.slice(0, 5).map((event) => {
                    const threatColor = {
                      critical: 'from-red-600 to-red-700',
                      high: 'from-orange-600 to-orange-700',
                      medium: 'from-yellow-600 to-yellow-700',
                      low: 'from-green-600 to-green-700'
                    }[event.threat_level];

                    return (
                      <Card key={event.id} className={`bg-gradient-to-r ${threatColor} border-gray-700`}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className="bg-white/20 text-white">
                                  {event.detection_type.toUpperCase()}
                                </Badge>
                                <span className="text-white font-semibold">{event.venue_name}</span>
                                <span className="text-white/70">•</span>
                                <span className="text-white/90">{event.entry_point}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-white/80">
                                <span>Confidence: {event.confidence_score}%</span>
                                <span>•</span>
                                <span>{new Date(event.detection_timestamp).toLocaleString()}</span>
                                <span>•</span>
                                <Badge className="bg-white/20 text-white text-xs">
                                  {event.status}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:bg-white/10"
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Venues Tab */}
          <TabsContent value="venues" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {integrations.map((integration) => (
                <Card key={integration.id} className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{integration.venue_name}</CardTitle>
                      <Badge className={
                        integration.connection_status === 'connected' 
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }>
                        {integration.connection_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900/50 p-3 rounded">
                        <div className="text-xs text-gray-400">Type</div>
                        <div className="text-white font-medium">{integration.venue_type}</div>
                      </div>
                      <div className="bg-gray-900/50 p-3 rounded">
                        <div className="text-xs text-gray-400">System</div>
                        <div className="text-white font-medium">{integration.evolv_system_type}</div>
                      </div>
                      <div className="bg-gray-900/50 p-3 rounded">
                        <div className="text-xs text-gray-400">Zones</div>
                        <div className="text-white font-medium">{integration.zones_monitored?.length || 0}</div>
                      </div>
                      <div className="bg-gray-900/50 p-3 rounded">
                        <div className="text-xs text-gray-400">Last Sync</div>
                        <div className="text-white font-medium text-xs">
                          {integration.last_sync ? new Date(integration.last_sync).toLocaleTimeString() : 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-3">
                      <div className="text-sm text-gray-400 mb-2">Today's Activity</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {integration.statistics?.total_scans_today?.toLocaleString() || 0}
                          </div>
                          <div className="text-xs text-gray-400">Scans</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-400">
                            {integration.statistics?.weapons_detected_today || 0}
                          </div>
                          <div className="text-xs text-gray-400">Detections</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 border-gray-600" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline" className="flex-1 border-gray-600" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Zones
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Detection Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.map((event) => {
                    const threatBadgeColor = {
                      critical: 'bg-red-500/20 text-red-300 border-red-500/50',
                      high: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
                      medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
                      low: 'bg-green-500/20 text-green-300 border-green-500/50'
                    }[event.threat_level];

                    return (
                      <div key={event.id} className="p-4 bg-gray-900/30 border border-gray-700 rounded-lg hover:border-gray-600 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Crosshair className="w-5 h-5 text-red-400" />
                            <div>
                              <div className="text-white font-semibold">{event.venue_name}</div>
                              <div className="text-sm text-gray-400">{event.entry_point}</div>
                            </div>
                          </div>
                          <Badge className={threatBadgeColor}>
                            {event.threat_level}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div>
                            <div className="text-xs text-gray-400">Detection Type</div>
                            <div className="text-white text-sm font-medium">{event.detection_type}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Confidence</div>
                            <div className="text-white text-sm font-medium">{event.confidence_score}%</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Time</div>
                            <div className="text-white text-sm font-medium">
                              {new Date(event.detection_timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Status</div>
                            <div className="text-white text-sm font-medium">{event.status}</div>
                          </div>
                        </div>

                        {event.response_actions && event.response_actions.length > 0 && (
                          <div className="pt-3 border-t border-gray-700">
                            <div className="text-xs text-gray-400 mb-2">Response Actions:</div>
                            <div className="flex flex-wrap gap-2">
                              {event.response_actions.map((action, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {action.action_type.replace(/_/g, ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Zones Tab */}
          <TabsContent value="zones" className="mt-6">
            <div className="grid md:grid-cols-3 gap-4">
              {zones.map((zone) => (
                <Card key={zone.id} className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{zone.zone_name}</CardTitle>
                      <Badge className={
                        zone.operational_status === 'active'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }>
                        {zone.operational_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-gray-400">{zone.venue_name}</div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900/50 p-2 rounded">
                        <div className="text-xs text-gray-400">Capacity</div>
                        <div className="text-white font-medium">{zone.capacity}/hr</div>
                      </div>
                      <div className="bg-gray-900/50 p-2 rounded">
                        <div className="text-xs text-gray-400">Units</div>
                        <div className="text-white font-medium">{zone.evolv_units_deployed}</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-700">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">Throughput</span>
                        <span className="text-white text-sm font-medium">
                          {zone.current_throughput}/{zone.capacity}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${(zone.current_throughput / zone.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Scans Today:</span>
                      <span className="text-white font-medium">{zone.total_scans_today?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Detections:</span>
                      <span className="text-red-400 font-medium">{zone.detections_today}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* API/SDK Tab */}
          <TabsContent value="api" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Start Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-2">STEP 1: Configure Evolv Webhook</div>
                    <pre className="text-green-400 text-xs overflow-x-auto">
{`POST https://your-evolv-system.com/settings/webhooks

{
  "webhook_url": "https://outpostzero.com/api/evolv/webhook",
  "events": ["weapon_detected", "system_alert"],
  "secret": "your_webhook_secret"
}`}
                    </pre>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-2">STEP 2: Test Connection</div>
                    <pre className="text-blue-400 text-xs overflow-x-auto">
{`curl -X POST https://outpostzero.com/api/evolv/test \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"venue_id": "venue_001"}'`}
                    </pre>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-2">STEP 3: Query Events</div>
                    <pre className="text-purple-400 text-xs overflow-x-auto">
{`GET /api/evolv/events?venue_id=venue_001&date=2024-11-11

Response:
{
  "events": [...],
  "total": 47,
  "detections": 3
}`}
                    </pre>
                  </div>

                  <Button onClick={downloadAPIDoc} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download Full API Documentation
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">SDK Integration (JavaScript)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-2">Installation</div>
                    <pre className="text-green-400 text-xs">
{`npm install @outpostzero/evolv-sdk`}
                    </pre>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-2">Initialize SDK</div>
                    <pre className="text-blue-400 text-xs overflow-x-auto">
{`import { EvolvSDK } from '@outpostzero/evolv-sdk';

const evolv = new EvolvSDK({
  apiKey: 'your_api_key',
  venueId: 'venue_001'
});`}
                    </pre>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-2">Listen for Events</div>
                    <pre className="text-purple-400 text-xs overflow-x-auto">
{`evolv.on('weapon_detected', (event) => {
  console.log('Weapon detected:', event);
  
  // Auto-create incident
  if (event.threat_level === 'critical') {
    evolv.createIncident(event);
  }
  
  // Alert security team
  evolv.notifyTeam({
    message: event.description,
    severity: event.threat_level
  });
});`}
                    </pre>
                  </div>

                  <Alert className="border-blue-500/50 bg-blue-500/10">
                    <Code className="h-4 w-4 text-blue-400" />
                    <AlertDescription className="text-blue-200 text-xs">
                      SDK supports Python, Java, C#, and JavaScript. Contact evolv@cyberdojogroup.com for SDKs.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            {/* Integration Features */}
            <Card className="bg-gray-800/50 border-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Integration Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-400" />
                      Real-Time Alerts
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Instant weapon detection notifications
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Mobile push notifications
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Email/SMS escalation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Slack/Teams integration
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Video className="w-4 h-4 text-purple-400" />
                      Video Integration
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Auto-link detection to camera footage
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Facial recognition correlation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Video evidence collection
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Incident documentation
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-orange-400" />
                      Access Control
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Auto-deny entry on detection
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Ticketing system integration
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Credential revocation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Zone lockdown triggers
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Integration Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-500/50 bg-blue-500/10">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-200">
                    Configure alert thresholds, response automation, and integration features below.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Alert Configuration</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-900/30 p-4 border border-gray-700 rounded-lg">
                      <label className="text-gray-300 text-sm">Auto-Alert on Weapon Detection</label>
                      <div className="mt-2">
                        <Badge className="bg-green-500/20 text-green-300">Enabled</Badge>
                      </div>
                    </div>
                    <div className="bg-gray-900/30 p-4 border border-gray-700 rounded-lg">
                      <label className="text-gray-300 text-sm">Severity Threshold</label>
                      <div className="mt-2">
                        <Badge className="bg-yellow-500/20 text-yellow-300">Medium or Higher</Badge>
                      </div>
                    </div>
                    <div className="bg-gray-900/30 p-4 border border-gray-700 rounded-lg">
                      <label className="text-gray-300 text-sm">Notify Local Security</label>
                      <div className="mt-2">
                        <Badge className="bg-green-500/20 text-green-300">Enabled</Badge>
                      </div>
                    </div>
                    <div className="bg-gray-900/30 p-4 border border-gray-700 rounded-lg">
                      <label className="text-gray-300 text-sm">Auto-Create Incidents</label>
                      <div className="mt-2">
                        <Badge className="bg-green-500/20 text-green-300">Enabled (Critical Only)</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-700">
                  <h3 className="text-white font-semibold mb-4">Integration Health</h3>
                  <div className="space-y-3">
                    {integrations.map((integration) => (
                      <div key={integration.id} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{integration.venue_name}</div>
                          <div className="text-xs text-gray-400">
                            Last sync: {integration.last_sync ? new Date(integration.last_sync).toLocaleString() : 'Never'}
                          </div>
                        </div>
                        <Badge className={
                          integration.connection_status === 'connected'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-red-500/20 text-red-300'
                        }>
                          {integration.connection_status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}