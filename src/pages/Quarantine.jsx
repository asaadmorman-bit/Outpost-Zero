import React, { useState, useEffect } from "react";
import { EndpointData } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PowerOff, ShieldCheck, Trash2, Microscope } from "lucide-react";

export default function QuarantinePage() {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuarantinedDevices();
  }, []);

  const loadQuarantinedDevices = async () => {
    setIsLoading(true);
    const data = await EndpointData.filter({ status: { $in: ["quarantined", "isolated"] } });
    setDevices(data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <PowerOff className="w-8 h-8 text-yellow-400" />
          Quarantine & Response Center
        </h1>
        <p className="text-gray-400 mb-8 max-w-2xl">
          Review and manage endpoints that have been automatically isolated or manually quarantined due to suspicious activity or malware detection.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? <p className="text-white">Loading quarantined devices...</p> :
            devices.map(device => (
              <Card key={device.id} className="border-yellow-500/30 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white">{device.hostname}</CardTitle>
                  <Badge variant="destructive" className="w-fit mt-2">{device.status}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">IP Address:</span> {device.ip_address}</p>
                    <p><span className="text-gray-400">OS:</span> {device.os_type}</p>
                    <p><span className="text-gray-400">Last Seen:</span> {new Date(device.last_seen).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300"><ShieldCheck className="w-4 h-4 mr-2" /> Release</Button>
                    <Button variant="outline" className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"><Microscope className="w-4 h-4 mr-2" /> Investigate</Button>
                    <Button variant="destructive" className="w-full"><Trash2 className="w-4 h-4 mr-2" /> Wipe Device</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          }
        </div>
      </div>
    </div>
  );
}