import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Globe,
  Shield,
  Users,
  DollarSign,
  Plus,
  BarChart3,
  TrendingUp,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ISPPartnerCard = ({ partner, onSelect }) => (
  <Card className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300">
    <CardHeader className="flex flex-row items-start justify-between">
      <div>
        <CardTitle className="text-white mb-2">{partner.name}</CardTitle>
        <Badge className={partner.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}>
          {partner.status}
        </Badge>
      </div>
      <img src={partner.branding_logo_url} alt={`${partner.name} logo`} className="h-8 w-auto object-contain rounded-sm bg-white p-1" />
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-3 gap-2 text-center my-4">
        <div>
          <p className="text-2xl font-bold text-white">{partner.subscriber_count.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Subscribers</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-400">{partner.threats_blocked.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Threats (24h)</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-400">${(partner.monthly_revenue / 1000).toFixed(1)}k</p>
          <p className="text-xs text-gray-400">MRR</p>
        </div>
      </div>
      <Button onClick={() => onSelect(partner)} className="w-full bg-blue-600 hover:bg-blue-700">Manage Partner</Button>
    </CardContent>
  </Card>
);

const PartnerDetailView = ({ partner, onBack }) => {
  const threatData = [
    { name: 'Phishing', value: 4500 },
    { name: 'Malware', value: 3200 },
    { name: 'Botnet', value: 1800 },
    { name: 'Ransomware', value: 500 },
  ];
  const COLORS = ['#3b82f6', '#ef4444', '#a855f7', '#f97316'];

  return (
    <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
            <div className="flex items-center gap-4">
                 <Button variant="outline" size="icon" onClick={onBack} className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <img src={partner.branding_logo_url} alt={`${partner.name} logo`} className="h-10 w-auto object-contain rounded-sm bg-white p-1" />
                <CardTitle className="text-2xl text-white">{partner.name} - Partner Dashboard</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Detailed stats for this partner */}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gray-900/50 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">Threats Blocked by Type</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={threatData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                    {threatData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="bg-gray-900/50 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">Recent Blocked Threats</CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-64 overflow-y-auto">
                        <ul className="space-y-2">
                           {/* Simulated recent threats */}
                           <li className="text-sm text-gray-300">Blocked <Badge className="bg-red-500/20 text-red-300">malware</Badge> for customer <span className="font-mono">#84301</span></li>
                           <li className="text-sm text-gray-300">Blocked <Badge className="bg-blue-500/20 text-blue-300">phishing</Badge> for customer <span className="font-mono">#12553</span></li>
                           <li className="text-sm text-gray-300">Blocked <Badge className="bg-purple-500/20 text-purple-300">botnet_c2</Badge> for customer <span className="font-mono">#98321</span></li>
                           <li className="text-sm text-gray-300">Blocked <Badge className="bg-red-500/20 text-red-300">malware</Badge> for customer <span className="font-mono">#76112</span></li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </CardContent>
    </Card>
  )
};

export default function SecureGatewayServicesPage() {
  const [selectedISP, setSelectedISP] = useState(null);

  const mockPartners = [
    { id: '1', name: 'Maxis Fiber Security', status: 'active', subscriber_count: 120500, branding_logo_url: 'https://cdn.worldvectorlogo.com/logos/maxis-logo.svg', threats_blocked: 1540320, monthly_revenue: 250000 },
    { id: '2', name: 'Verizon SASE Gateway', status: 'active', subscriber_count: 850300, branding_logo_url: 'https://cdn.worldvectorlogo.com/logos/verizon-2015.svg', threats_blocked: 8890100, monthly_revenue: 980000 },
    { id: '3', name: 'Telia SecureNet', status: 'trialing', subscriber_count: 45000, branding_logo_url: 'https://cdn.worldvectorlogo.com/logos/telia-company-1.svg', threats_blocked: 450190, monthly_revenue: 75000 },
  ];
  
  const handleOnboardISP = () => {
    alert("🚀 ONBOARD NEW ISP PARTNER\n\nThis would launch a wizard to:\n1. Configure ISP branding and details.\n2. Set up DNS or BGP integration endpoints.\n3. Define service tiers and pricing.\n4. Generate API keys for their billing system.\n5. Provide access to their own partner portal.");
  };

  if (selectedISP) {
    return <div className="min-h-screen p-6 bg-gray-900"><PartnerDetailView partner={selectedISP} onBack={() => setSelectedISP(null)} /></div>
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Secure Gateway Services</h1>
            <p className="text-gray-300">Turnkey security solutions for Internet Service Providers</p>
          </div>
          <Button onClick={handleOnboardISP} className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Onboard New ISP Partner
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-700 bg-gray-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Protected Subscribers</p>
                  <p className="text-3xl font-bold text-white">1.02 M</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-700 bg-gray-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Threats Blocked (24h)</p>
                  <p className="text-3xl font-bold text-green-400">10.9 M</p>
                </div>
                <Shield className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-700 bg-gray-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total ISP Partners</p>
                  <p className="text-3xl font-bold text-white">3</p>
                </div>
                <Globe className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-700 bg-gray-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total MRR</p>
                  <p className="text-3xl font-bold text-blue-400">$1.3 M</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-4">ISP Partner Management</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPartners.map(p => (
            <ISPPartnerCard key={p.id} partner={p} onSelect={setSelectedISP} />
          ))}
        </div>
      </div>
    </div>
  );
}