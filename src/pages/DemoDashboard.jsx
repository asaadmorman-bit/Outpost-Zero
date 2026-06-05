import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Users, Activity, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import DemoShell from '@/components/demo/DemoShell';

// Static KPI Data
const kpiData = {
  totalIncidents: 47,
  activeThreats: 12,
  usersMonitored: 2847,
  systemHealth: 98.7
};

// Static Chart Data
const incidentTrendData = [
  { day: 'Mon', incidents: 8, resolved: 7 },
  { day: 'Tue', incidents: 12, resolved: 10 },
  { day: 'Wed', incidents: 6, resolved: 6 },
  { day: 'Thu', incidents: 15, resolved: 12 },
  { day: 'Fri', incidents: 9, resolved: 8 },
  { day: 'Sat', incidents: 4, resolved: 4 },
  { day: 'Sun', incidents: 3, resolved: 3 },
];

const threatTypeData = [
  { name: 'Malware', value: 35, color: '#ef4444' },
  { name: 'Phishing', value: 28, color: '#f97316' },
  { name: 'Unauthorized Access', value: 22, color: '#eab308' },
  { name: 'Data Exfil', value: 15, color: '#22c55e' },
];

const systemActivityData = [
  { hour: '00:00', events: 120 },
  { hour: '04:00', events: 80 },
  { hour: '08:00', events: 350 },
  { hour: '12:00', events: 420 },
  { hour: '16:00', events: 380 },
  { hour: '20:00', events: 200 },
];

function KPICard({ title, value, icon: Icon, trend, trendValue, color }) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {trendValue}
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DemoDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <DemoShell>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
            <p className="text-gray-400 text-sm">Real-time security overview</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Clock className="w-4 h-4" />
            <span>Last updated: {currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard 
            title="Total Incidents" 
            value={kpiData.totalIncidents} 
            icon={AlertTriangle} 
            trend="down" 
            trendValue="-12% from last week"
            color="bg-red-500"
          />
          <KPICard 
            title="Active Threats" 
            value={kpiData.activeThreats} 
            icon={Shield} 
            trend="down" 
            trendValue="-5% from yesterday"
            color="bg-orange-500"
          />
          <KPICard 
            title="Users Monitored" 
            value={kpiData.usersMonitored.toLocaleString()} 
            icon={Users} 
            trend="up" 
            trendValue="+234 new users"
            color="bg-blue-500"
          />
          <KPICard 
            title="System Health" 
            value={`${kpiData.systemHealth}%`} 
            icon={Activity} 
            trend="up" 
            trendValue="+0.3% improvement"
            color="bg-green-500"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incident Trend Chart */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Incidents This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incidentTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="incidents" fill="#ef4444" name="Incidents" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resolved" fill="#22c55e" name="Resolved" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Threat Types Pie Chart */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Threat Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center">
                <div className="w-1/2">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={threatTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {threatTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-2">
                  {threatTypeData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-300 text-sm">{item.name}</span>
                      <span className="text-gray-500 text-sm ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Activity */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">System Activity (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={systemActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="events" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DemoShell>
  );
}