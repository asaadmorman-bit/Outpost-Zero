import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Shield, Building, Home, Landmark } from 'lucide-react';

const features = [
  { feature: 'AI-Powered Threat Detection', residential: true, enterprise: true, government: true },
  { feature: 'Secure Web Browser', residential: true, enterprise: true, government: true },
  { feature: 'Wi-Fi Network Security Check', residential: true, enterprise: true, government: true },
  { feature: 'Anti-Phishing & Smishing', residential: true, enterprise: true, government: true },
  { feature: 'MDM Integration (Intune, Jamf)', residential: false, enterprise: true, government: true },
  { feature: 'Secure App Container', residential: false, enterprise: true, government: true },
  { feature: 'Zero Trust Network Access (ZTNA)', residential: false, enterprise: true, government: true },
  { feature: 'Data Leakage Prevention (DLP)', residential: false, enterprise: true, government: true },
  { feature: 'Air-Gap Capability & Classified Data Protection', residential: false, enterprise: false, government: true },
  { feature: 'FIPS 140-2 Level 3 Encryption', residential: false, enterprise: false, government: true },
];

export default function MobileFeatureComparison() {
  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-white">Mobile App Feature Matrix</CardTitle>
        <p className="text-gray-400 text-sm">Compare features across your mobile product line.</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-gray-700 hover:bg-transparent">
                <TableHead className="text-white font-semibold min-w-[240px]">Feature</TableHead>
                <TableHead className="text-center min-w-[100px]">
                  <div className="flex flex-col items-center gap-1">
                    <Home className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-xs">AXIS Rebirth</span>
                  </div>
                </TableHead>
                <TableHead className="text-center min-w-[100px]">
                  <div className="flex flex-col items-center gap-1">
                    <Building className="w-4 h-4 text-purple-400" />
                    <span className="text-white text-xs">Rev Sentinel</span>
                  </div>
                </TableHead>
                <TableHead className="text-center min-w-[100px]">
                  <div className="flex flex-col items-center gap-1">
                    <Landmark className="w-4 h-4 text-red-400" />
                    <span className="text-white text-xs">Classified</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((item, index) => (
                <TableRow key={index} className="border-b-gray-800 hover:bg-gray-700/20">
                  <TableCell className="font-medium text-gray-200 py-3">{item.feature}</TableCell>
                  <TableCell className="text-center py-3">
                    {item.residential && <CheckCircle className="text-blue-400 mx-auto w-5 h-5" />}
                  </TableCell>
                  <TableCell className="text-center py-3">
                    {item.enterprise && <CheckCircle className="text-purple-400 mx-auto w-5 h-5" />}
                  </TableCell>
                  <TableCell className="text-center py-3">
                    {item.government && <CheckCircle className="text-red-400 mx-auto w-5 h-5" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}