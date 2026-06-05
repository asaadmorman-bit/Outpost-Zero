import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
    Smartphone, 
    Shield, 
    AlertTriangle, 
    CheckCircle, 
    Wifi, 
    Battery,
    Lock,
    Eye
} from 'lucide-react';

export default function MobileSecurityWidget({ devices = [] }) {
    if (!devices.length) return null;

    const complianceRate = (devices.filter(d => d.compliance_status === 'compliant').length / devices.length) * 100;
    const encryptedDevices = devices.filter(d => d.security_posture?.device_encrypted).length;
    const vpnConnected = devices.filter(d => d.security_posture?.vpn_connected).length;
    const threatsDetected = devices.reduce((sum, d) => sum + (d.threat_detections?.length || 0), 0);

    return (
        <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    Mobile Security Overview
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-white">Compliance Rate</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Progress value={complianceRate} className="w-16 h-2" />
                            <span className="text-sm text-white">{Math.round(complianceRate)}%</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300">{encryptedDevices} Encrypted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-300">{vpnConnected} VPN Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            <span className="text-gray-300">{threatsDetected} Threats</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-purple-400" />
                            <span className="text-gray-300">{devices.length} Monitored</span>
                        </div>
                    </div>

                    {threatsDetected > 0 && (
                        <div className="pt-3 border-t border-gray-700">
                            <Badge className="bg-red-500/20 text-red-400 text-xs">
                                {threatsDetected} active threat{threatsDetected > 1 ? 's' : ''} require attention
                            </Badge>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}