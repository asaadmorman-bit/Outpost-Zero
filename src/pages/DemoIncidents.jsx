import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Search, ChevronRight, Clock, User, MapPin, X } from 'lucide-react';
import DemoShell from '@/components/demo/DemoShell';

// Static Incident Data
const incidentsData = [
  {
    id: 'INC-001',
    title: 'Suspicious login attempt from unknown IP',
    severity: 'critical',
    status: 'open',
    source: '192.168.1.100',
    user: 'admin@contoso.com',
    location: 'New York, US',
    timestamp: '2024-11-27T14:32:00Z',
    description: 'Multiple failed login attempts detected from an unrecognized IP address. The source IP has been flagged in threat intelligence feeds as potentially malicious.',
    timeline: [
      { time: '14:32:00', event: 'Initial detection' },
      { time: '14:32:15', event: 'Alert triggered' },
      { time: '14:33:00', event: 'IP blocked automatically' },
    ]
  },
  {
    id: 'INC-002',
    title: 'Malware detected on endpoint WS-2847',
    severity: 'high',
    status: 'investigating',
    source: 'WS-2847',
    user: 'jsmith@contoso.com',
    location: 'Chicago, US',
    timestamp: '2024-11-27T13:15:00Z',
    description: 'Trojan.GenericKD detected during scheduled scan. The file has been quarantined and the endpoint is isolated from the network.',
    timeline: [
      { time: '13:15:00', event: 'Malware detected' },
      { time: '13:15:30', event: 'File quarantined' },
      { time: '13:16:00', event: 'Endpoint isolated' },
    ]
  },
  {
    id: 'INC-003',
    title: 'Unusual data transfer to external domain',
    severity: 'medium',
    status: 'open',
    source: 'DB-Server-01',
    user: 'system',
    location: 'AWS us-east-1',
    timestamp: '2024-11-27T12:45:00Z',
    description: 'Large data transfer (2.3GB) detected to an external domain not on the approved list. Transfer rate and timing suggest possible data exfiltration.',
    timeline: [
      { time: '12:45:00', event: 'Transfer detected' },
      { time: '12:45:10', event: 'Alert generated' },
    ]
  },
  {
    id: 'INC-004',
    title: 'Failed MFA verification - multiple attempts',
    severity: 'low',
    status: 'resolved',
    source: 'Auth-Gateway',
    user: 'mwilson@contoso.com',
    location: 'London, UK',
    timestamp: '2024-11-27T11:20:00Z',
    description: 'User failed MFA verification 5 times within 10 minutes. Account temporarily locked. User confirmed they had issues with their authenticator app.',
    timeline: [
      { time: '11:20:00', event: 'First failed attempt' },
      { time: '11:25:00', event: 'Account locked' },
      { time: '11:45:00', event: 'User verified, account unlocked' },
    ]
  },
  {
    id: 'INC-005',
    title: 'Phishing email campaign detected',
    severity: 'high',
    status: 'contained',
    source: 'Email Gateway',
    user: 'multiple',
    location: 'Global',
    timestamp: '2024-11-27T10:00:00Z',
    description: 'Coordinated phishing campaign targeting 47 employees. Emails impersonating IT department requesting password reset. All emails blocked and reported.',
    timeline: [
      { time: '10:00:00', event: 'First email detected' },
      { time: '10:02:00', event: 'Pattern identified' },
      { time: '10:05:00', event: 'All emails blocked' },
      { time: '10:30:00', event: 'User advisory sent' },
    ]
  },
];

const severityColors = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/50',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
};

const statusColors = {
  open: 'bg-red-500/20 text-red-400',
  investigating: 'bg-yellow-500/20 text-yellow-400',
  contained: 'bg-blue-500/20 text-blue-400',
  resolved: 'bg-green-500/20 text-green-400',
};

function IncidentDetail({ incident, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-800 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={severityColors[incident.severity]}>{incident.severity}</Badge>
              <Badge className={statusColors[incident.status]}>{incident.status}</Badge>
            </div>
            <CardTitle className="text-white text-xl">{incident.title}</CardTitle>
            <p className="text-gray-400 text-sm mt-1">{incident.id}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{incident.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{incident.user}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{new Date(incident.timestamp).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <AlertTriangle className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{incident.source}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-white font-semibold mb-2">Description</h4>
            <p className="text-gray-300 text-sm">{incident.description}</p>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-white font-semibold mb-3">Timeline</h4>
            <div className="space-y-3">
              {incident.timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="text-gray-400 text-xs">{item.time}</p>
                    <p className="text-gray-200 text-sm">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button className="bg-blue-600 hover:bg-blue-700">Investigate</Button>
            <Button variant="outline" className="border-gray-600">Assign</Button>
            <Button variant="outline" className="border-gray-600">Escalate</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DemoIncidents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');

  const filteredIncidents = incidentsData.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          incident.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <DemoShell>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Incidents</h1>
            <p className="text-gray-400 text-sm">{filteredIncidents.length} incidents found</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
              <Button
                key={sev}
                variant={filterSeverity === sev ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterSeverity(sev)}
                className={filterSeverity === sev ? 'bg-blue-600' : 'border-gray-600 text-gray-300'}
              >
                {sev.charAt(0).toUpperCase() + sev.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Incidents List */}
        <div className="space-y-3">
          {filteredIncidents.map((incident) => (
            <Card 
              key={incident.id} 
              className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
              onClick={() => setSelectedIncident(incident)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      incident.severity === 'critical' ? 'bg-red-500/20' :
                      incident.severity === 'high' ? 'bg-orange-500/20' :
                      incident.severity === 'medium' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                    }`}>
                      <AlertTriangle className={`w-5 h-5 ${
                        incident.severity === 'critical' ? 'text-red-400' :
                        incident.severity === 'high' ? 'text-orange-400' :
                        incident.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">{incident.id}</span>
                        <Badge className={severityColors[incident.severity]}>{incident.severity}</Badge>
                        <Badge className={statusColors[incident.status]}>{incident.status}</Badge>
                      </div>
                      <h3 className="text-white font-medium mt-1">{incident.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(incident.timestamp).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {incident.user}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <IncidentDetail 
          incident={selectedIncident} 
          onClose={() => setSelectedIncident(null)} 
        />
      )}
    </DemoShell>
  );
}