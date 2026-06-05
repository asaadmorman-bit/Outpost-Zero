import React, { useState, useEffect } from 'react';
import { MobileApp, IoTDevice, SecurityEvent, User } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Shield, AlertTriangle, Wifi } from 'lucide-react';
import MobileAppCard from '../components/mobile/MobileAppCard';
import MobileFeatureComparison from '../components/mobile/MobileFeatureComparison';

export default function MobileSecurityPage() {
  const [mobileApps, setMobileApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real scenario, you'd fetch this data. For now, we use mock data
        // to represent your app portfolio, including Rev Sentinel and AXIS Rebirth concepts.
        const mockApps = [
          {
            id: 'app-1',
            app_name: 'AXIS Rebirth',
            platform: 'android',
            tier: 'residential',
            version: '1.0.0',
            description: 'Next-generation cyber immune system for all your personal devices. Powered by Outpost Zero.',
            status: 'beta',
            app_store_url: 'https://play.google.com/store/apps/axis-rebirth',
            active_installs: 50000
          },
          {
            id: 'app-2', 
            app_name: 'Rev Sentinel',
            platform: 'android',
            tier: 'enterprise',
            version: '3.5.0',
            description: 'Advanced mobile threat defense for enterprise. Integrates seamlessly with Outpost Zero SIEM.',
            status: 'live',
            app_store_url: 'https://play.google.com/store/apps/rev-sentinel',
            active_installs: 250000
          },
          {
            id: 'app-3',
            app_name: 'Outpost Zero Classified',
            platform: 'android', 
            tier: 'government',
            version: '5.1.0',
            description: 'Hardened mobile client for government and intelligence operations with specialized security features.',
            status: 'live',
            app_store_url: 'https://disa.apps.mil/outpost-zero-classified',
            active_installs: 45000
          },
        ];
        setMobileApps(mockApps);
      } catch (error) {
        console.error("Failed to load mobile security data:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const totalMobileDevices = mobileApps.reduce((acc, app) => acc + (app.active_installs || 0), 0);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-blue-400" />
            Mobile App Management
          </h1>
          <p style={{color: 'var(--text-secondary)'}}>
            Monitor and manage your portfolio of native applications powered by the Outpost Zero platform.
          </p>
        </div>
        
        <Card className="border-gray-700 bg-gray-800/50 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Cyber Dojo Solutions App Portfolio</CardTitle>
            <p className="text-gray-400 text-sm">
              Cross-platform protection for all your customer segments.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? (
                <p className="text-white col-span-full text-center py-8">Loading applications...</p>
              ) : (
                mobileApps.map(app => <MobileAppCard key={app.id} app={app} />)
              )}
            </div>
          </CardContent>
        </Card>
        
        <MobileFeatureComparison />

      </div>
    </div>
  );
}