import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Terminal, ShieldAlert, ShieldCheck, Activity } from 'lucide-react';

export default function OutpostTelemetryViewer() {
  const [events, setEvents] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Establishes connection loop to the THYREOS centralized routing websocket broker
    const socket = new WebSocket('ws://localhost:8080/api/v1/stream/ws');

    socket.onopen = () => {
      setConnectionStatus('CONNECTED');
      setError(null);
    };

    socket.onmessage = (message) => {
      try {
        const rawPayload = JSON.parse(message.data);

        // RULE 1 Guardrail Verification: Protect components from nested parser panics
        if (Array.isArray(rawPayload)) {
          // Flatten updates directly into state window
          setEvents((prevEvents) => {
            // Keep the last 100 entries to prevent memory allocation bloating on browser threads
            const consolidated = [...rawPayload, ...prevEvents];
            return consolidated.slice(0, 100);
          });
        } else {
          setError("THYREOS Schema Violation: Stream dropped an object structure that wasn't a clean flattened array.");
        }
      } catch (err) {
        setError(`Failed to parse inbound agent block frames: ${err.message}`);
      }
    };

    socket.onerror = () => {
      setConnectionStatus('CONNECTION_ERROR');
      setError("Active network link interrupted. Check that your local aggregation server is listening.");
    };

    socket.onclose = () => {
      setConnectionStatus('DISCONNECTED');
    };

    return () => socket.close();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-zinc-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Terminal className="h-6 w-6 text-emerald-500" />
          <h1 className="text-2xl font-bold tracking-tight">THYREOS Central Console // Real-Time Feeds</h1>
        </div>
        <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-sm font-mono">
          <Activity className={`h-4 w-4 ${connectionStatus === 'CONNECTED' ? 'text-emerald-400 animate-pulse' : 'text-rose-400'}`} />
          <span>STATUS: <span className={connectionStatus === 'CONNECTED' ? 'text-emerald-400' : 'text-rose-400'}>{connectionStatus}</span></span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-rose-950/20 border-rose-900/50 text-rose-300">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Security Processing Exception</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-md font-mono text-zinc-400">// endpoint_telemetry_stream</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-xs tracking-wider uppercase">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Host Identity</th>
                  <th className="p-3">PID</th>
                  <th className="p-3">Process Path (SHA256)</th>
                  <th className="p-3 text-right">Integrity Status</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-zinc-600 border-zinc-900">
                      Listening for incoming streaming telemetry arrays from Outpost Zero...
                    </td>
                  </tr>
                ) : (
                  events.map((event, idx) => (
                    <tr key={idx} className="border-b border-zinc-900 hover:bg-zinc-900/40 transition-colors">
                      <td className="p-3 text-zinc-500 text-xs">{new Date(event.timestamp).toLocaleTimeString()}</td>
                      <td className="p-3 text-emerald-400/80 font-medium">{event.host_identity}</td>
                      <td className="p-3 text-zinc-400">{event.pid} <span className="text-zinc-600 text-xs">({event.parent_pid})</span></td>
                      <td className="p-3 max-w-md truncate">
                        <div className="text-zinc-200 truncate">{event.process_path}</div>
                        <div className="text-zinc-600 text-xs truncate font-sans">{event.process_hash}</div>
                      </td>
                      <td className="p-3 text-right">
                        {event.integrity_status === 'TRUSTED' ? (
                          <Badge variant="outline" className="bg-emerald-500/5 text-emerald-400 border-emerald-500/20 ml-auto">
                            <ShieldCheck className="h-3 w-3 mr-1" /> Trusted
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-rose-500/5 text-rose-400 border-rose-500/20 ml-auto animate-pulse">
                            <ShieldAlert className="h-3 w-3 mr-1" /> Untrusted Anomaly
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}