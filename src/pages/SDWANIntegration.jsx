
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Network, 
  Wifi, 
  Shield, 
  Activity, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Zap,
  Globe,
  Server,
  Eye,
  Lock,
  Router,
  Signal,
  BarChart3,
  RefreshCw,
  Plus,
  Handshake,
  Building,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const ProviderIntegrationCard = ({ provider, onConfigure }) => {
  const statusConfig = {
    active: {
      color: "bg-green-500/20 text-green-300 border-green-500/30",
      icon: <CheckCircle className="w-4 h-4 mr-2" />,
      label: "Active"
    },
    pending_negotiation: {
      color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      icon: <Handshake className="w-4 h-4 mr-2" />,
      label: "Pending"
    },
    inactive: {
      color: "bg-red-500/20 text-red-300 border-red-500/30",
      icon: <AlertTriangle className="w-4 h-4 mr-2" />,
      label: "Inactive"
    }
  };

  const currentStatus = statusConfig[provider.status];

  return (
    <Card className="bg-gray-800 border-gray-700 flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
             <provider.icon className="w-10 h-10 text-white" />
             <div>
                <CardTitle className="text-xl text-white">{provider.name}</CardTitle>
                <Badge className={`${currentStatus.color} mt-2`}>
                  {currentStatus.icon}
                  {currentStatus.label}
                </Badge>
             </div>
          </div>
          <div className="text-right">
              <p className="text-2xl font-bold text-white">{provider.metrics.protected_sites.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Protected Sites</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Managed Services</h4>
          <div className="space-y-3">
            {provider.services.map(service => (
              <div key={service.name} className="p-3 bg-gray-900/50 rounded-md">
                <div className="flex justify-between items-center">
                  <p className="text-white text-sm font-medium">{service.name}</p>
                  <Badge variant="outline" className="text-xs">{service.subscribers.toLocaleString()} Subs</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button onClick={() => onConfigure(provider)} className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
          <Settings className="w-4 h-4 mr-2" />
          Manage Integration
        </Button>
      </CardContent>
    </Card>
  );
};

export default function SDWANIntegrationPage() {
  const [activeTab, setActiveTab] = useState('integrations');
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProviderData();
  }, []);

  const loadProviderData = () => {
    setIsLoading(true);
    // Mock data representing Tier 1 Carrier integrations
    const mockProviders = [
      {
        id: 'verizon',
        name: 'Verizon Business',
        icon: Shield,
        status: 'active',
        services: [
          { name: 'Dedicated Internet Security', subscribers: 12500 },
          { name: 'SD-WAN Security Overlay', subscribers: 4800 },
        ],
        metrics: { protected_sites: 17300, threats_blocked: 12800000, data_processed_tb: 560 }
      },
      {
        id: 'att',
        name: 'AT&T Business',
        icon: Globe,
        status: 'active',
        services: [
          { name: 'Business Fiber Security+', subscribers: 28000 },
          { name: 'SASE Integration', subscribers: 1200 },
        ],
        metrics: { protected_sites: 29200, threats_blocked: 25300000, data_processed_tb: 890 }
      },
      {
        id: 'comcast',
        name: 'Comcast Business',
        icon: Network,
        status: 'pending_negotiation',
        services: [
          { name: 'Business Internet Secure Edge', subscribers: 0 },
        ],
        metrics: { protected_sites: 0, threats_blocked: 0, data_processed_tb: 0 }
      },
    ];
    setProviders(mockProviders);
    setIsLoading(false);
  };
  
  const handleConfigure = (provider) => {
      alert(`MANAGE INTEGRATION: ${provider.name}\n\nThis would open a dedicated dashboard to:\n- View detailed analytics for this partner\n- Adjust shared security policies\n- Manage API credentials and endpoints\n- Monitor service health and SLAs\n- Access billing and subscriber reports`);
  };

  const totalSites = providers.reduce((sum, p) => sum + p.metrics.protected_sites, 0);
  const totalThreats = providers.reduce((sum, p) => sum + p.metrics.threats_blocked, 0);
  const totalData = providers.reduce((sum, p) => sum + p.metrics.data_processed_tb, 0);

  const trafficData = [
      { name: 'Verizon', value: 560 },
      { name: 'AT&T', value: 890 },
      { name: 'Other', value: 150 },
  ];
  const COLORS = ['#ef4444', '#3b82f6', '#10b981'];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-500/10 rounded-lg">
                <Handshake className="w-8 h-8 text-blue-400" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-white">SD-WAN & Carrier Fabric</h1>
                <p className="text-gray-300">Manage deep network integrations with Tier 1 ISP partners</p>
            </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="integrations">Provider Integrations</TabsTrigger>
            <TabsTrigger value="analytics">Traffic Analytics</TabsTrigger>
            <TabsTrigger value="policies">Policy Management</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations">
             <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <Card className="border-green-500/50 bg-green-900/20">
                    <CardContent className="p-6">
                      <p className="text-sm text-green-200">Total Protected Sites</p>
                      <p className="text-3xl font-bold text-white">{totalSites.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                   <Card className="border-red-500/50 bg-red-900/20">
                    <CardContent className="p-6">
                      <p className="text-sm text-red-200">Threats Blocked (24h)</p>
                      <p className="text-3xl font-bold text-white">{totalThreats.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                   <Card className="border-blue-500/50 bg-blue-900/20">
                    <CardContent className="p-6">
                      <p className="text-sm text-blue-200">Data Processed (TB/day)</p>
                      <p className="text-3xl font-bold text-white">{totalData.toLocaleString()}</p>
                    </CardContent>
                  </Card>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map(provider => (
                <ProviderIntegrationCard key={provider.id} provider={provider} onConfigure={handleConfigure} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-gray-700 bg-gray-800/50">
                    <CardHeader><CardTitle className="text-white">Threats Blocked by Carrier</CardTitle></CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={providers.filter(p => p.status === 'active')}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
                                <Bar dataKey="metrics.threats_blocked" name="Threats Blocked" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card className="border-gray-700 bg-gray-800/50">
                    <CardHeader><CardTitle className="text-white">Data Processed by Carrier (TB)</CardTitle></CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                                <Pie data={trafficData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {trafficData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
          </TabsContent>

          <TabsContent value="policies" className="mt-6">
            <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader><CardTitle className="text-white">Carrier-Edge Security Policies</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-gray-300">This area would contain a list of global security policies (e.g., block known C2 servers, enforce DNS-over-HTTPS, prevent access to newly registered domains) that are automatically propagated to all integrated carrier partners, ensuring a consistent baseline of protection for all downstream customers.</p>
                    <Button className="mt-4"><Plus className="w-4 h-4 mr-2" />Create Global Policy</Button>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
