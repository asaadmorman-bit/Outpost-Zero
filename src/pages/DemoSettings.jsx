import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User, Shield, LogOut, CheckCircle, Key, Bell, Palette } from 'lucide-react';
import { createPageUrl } from '@/utils';
import DemoShell from '@/components/demo/DemoShell';
import { useAppContext } from '@/components/demo/AppContext';

export default function DemoSettings() {
  const { user, licenseTier, setLicenseTier, logout } = useAppContext();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    logout();
    window.location.href = createPageUrl('DemoLogin');
  };

  const toggleLicense = () => {
    setLicenseTier(licenseTier === 'pro' ? 'demo' : 'pro');
  };

  return (
    <DemoShell>
      <div className="p-6 space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-sm">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h3 className="text-white font-semibold">{user?.name || 'Demo User'}</h3>
                <p className="text-gray-400 text-sm">{user?.email || 'demo@outpostzero.com'}</p>
              </div>
            </div>

            <div className="grid gap-4 pt-4 border-t border-gray-700">
              <div>
                <Label className="text-gray-300">Full Name</Label>
                <Input 
                  value={user?.name || ''} 
                  disabled 
                  className="bg-gray-900 border-gray-700 text-white mt-1" 
                />
              </div>
              <div>
                <Label className="text-gray-300">Email</Label>
                <Input 
                  value={user?.email || ''} 
                  disabled 
                  className="bg-gray-900 border-gray-700 text-white mt-1" 
                />
              </div>
              <div>
                <Label className="text-gray-300">Organization</Label>
                <Input 
                  value={user?.org || ''} 
                  disabled 
                  className="bg-gray-900 border-gray-700 text-white mt-1" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* License Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="w-5 h-5" />
              License
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${licenseTier === 'pro' ? 'bg-yellow-500/20' : 'bg-gray-700'}`}>
                  <CheckCircle className={`w-5 h-5 ${licenseTier === 'pro' ? 'text-yellow-400' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className="text-white font-medium">Pro License</p>
                  <p className="text-gray-400 text-sm">Toggle to see Pro features</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={licenseTier === 'pro' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-400'}>
                  {licenseTier === 'pro' ? 'Pro' : 'Demo'}
                </Badge>
                <Switch checked={licenseTier === 'pro'} onCheckedChange={toggleLicense} />
              </div>
            </div>
            <p className="text-gray-500 text-xs">
              This toggle is stored in local storage for demonstration purposes.
            </p>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
              <div>
                <p className="text-white font-medium">Microsoft Entra ID</p>
                <p className="text-gray-400 text-sm">Single Sign-On authentication</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
              <div>
                <p className="text-white font-medium">Multi-Factor Authentication</p>
                <p className="text-gray-400 text-sm">Additional security layer</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <Button 
              onClick={handleLogout}
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </DemoShell>
  );
}