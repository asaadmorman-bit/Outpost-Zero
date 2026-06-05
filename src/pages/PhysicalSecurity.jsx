import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DoorOpen, AlertTriangle, Lightbulb, MapPin } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data, in a real app this would come from the PhysicalSecurityEvent entity
const physicalEvents = [
  { id: 1, timestamp: new Date().toISOString(), event_type: "access_denied", location: "Data Center Entrance", facility: "HQ", user_id: "u-1234", credential_used: "B-5678" },
  { id: 2, timestamp: new Date(Date.now() - 2 * 60000).toISOString(), event_type: "access_granted", location: "SCIF Door 1", facility: "Building C", user_id: "admin", credential_used: "B-0001" },
  { id: 3, timestamp: new Date(Date.now() - 5 * 60000).toISOString(), event_type: "door_forced_open", location: "Server Room 3", facility: "HQ", user_id: null, credential_used: null },
  { id: 4, timestamp: new Date(Date.now() - 10 * 60000).toISOString(), event_type: "access_granted", location: "Lobby Turnstile", facility: "HQ", user_id: "j.doe", credential_used: "B-1234" },
];

export default function PhysicalSecurityPage() {
  const getEventColor = (type) => {
    switch(type) {
      case 'access_denied': return 'text-yellow-400';
      case 'door_forced_open': return 'text-red-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3"><DoorOpen /> Physical Security Dashboard</h1>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader><CardTitle className="text-white">Live Physical Event Feed</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow className="hover:bg-transparent"><TableHead>Event</TableHead><TableHead>Location</TableHead><TableHead>Time</TableHead><TableHead>User</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {physicalEvents.map(e => (
                      <TableRow key={e.id} className="border-b-gray-800">
                        <TableCell className={`font-medium ${getEventColor(e.event_type)}`}>{e.event_type.replace(/_/g, ' ')}</TableCell>
                        <TableCell>{e.location}, {e.facility}</TableCell>
                        <TableCell>{new Date(e.timestamp).toLocaleTimeString()}</TableCell>
                        <TableCell>{e.user_id || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="border-red-500/30 bg-gray-800/50">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><AlertTriangle className="text-red-400" /> Active Alerts</CardTitle></CardHeader>
              <CardContent><p className="text-4xl font-bold text-red-400">1</p><p className="text-gray-400">'Door Forced Open' at Server Room 3</p></CardContent>
            </Card>
            <Card className="border-blue-500/30 bg-gray-800/50">
              <CardHeader><CardTitle className="text-white flex items-center gap-2"><Lightbulb className="text-blue-400" /> AI-Powered Suggestion</CardTitle></CardHeader>
              <CardContent><p className="text-gray-300">Correlate the 'access denied' event at the Data Center with network login failures from user 'u-1234' to investigate a potential insider threat.</p></CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}