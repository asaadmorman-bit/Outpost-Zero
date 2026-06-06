import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Terminal, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function OutpostTelemetryViewer() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  // Simulating the intake stream link from the Outpost Zero HTTP/2 endpoint
  useEffect(() => {
    // In production, replace with your real active API fetch polling or WebSockets link
    const mockIncomingStream = [
      {
        "timestamp": new Date().toISOString(),
        "host_identity": "DESKTOP-THYREOS-099X",
        "process_path": "/usr/bin/systemd",
        "integrity_status": "TRUSTED",
        "pid": 1,
        "process_hash": "64a92a2c2bb425d24318e71ed28066b98eec11c031d781e63d00d6a4713afce2",
        "parent_pid": 0
      },
      {
        "timestamp": new Date().toISOString(),
        "host_identity": "DESKTOP-THYREOS-099X",
        "process_path": "/tmp/malicious_miner.sh",
        "integrity_status": "UNTRUSTED",
        "pid": 9999,
        "process_hash": "1b49837c73d937a87d4279f1a84abae7398a52ed3f1ad46cbed7e71ba046243f",
        "parent_pid": 412
      }
    ];

    // Rule 1 Verification: Safely parse array data without nested loop parsing logic
    if (Array.isArray(mockIncomingStream)) {
      setEvents(mockIncomingStream);
    } else {
      setError("Frontend Parser Panic: Incoming telemetry stream did not yield a flattened array.");
    }
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center space-x-2">
        <Terminal className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-white">THYREOS Central Console // Outpost Zero Streams</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Parsing Conflict</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-zinc-400">Active Agent Telemetry Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-medium">
                  <th className="p-3">Host Identity</th>
                  <th className="p-3">PID</th>
                  <th className="p-3">Process Path</th>
                  <th className="p-3">Integrity Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, idx) => (
                  <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="p-3 font-mono text-zinc-300">{event.host_identity}</td>
                    <td className="p-3 font-mono text-zinc-400">{event.pid}</td>
                    <td className="p-3 text-zinc-200">{event.process_path}</td>
                    <td className="p-3">
                      {event.integrity_status === 'TRUSTED' ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 flex items-center w-fit space-x-1">
                          <ShieldCheck className="h-3 w-3" />
                          <span>Trusted</span>
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 flex items-center w-fit space-x-1 animate-pulse">
                          <ShieldAlert className="h-3 w-3" />
                          <span>Untrusted Anomaly</span>
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}