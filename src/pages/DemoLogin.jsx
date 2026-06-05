import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, LogIn, Building2, Lock, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { createPageUrl } from '@/utils';

// Simulated user accounts for demo
const demoAccounts = [
  { name: 'John Security', email: 'john.security@contoso.com', tenantId: 'contoso-corp-a1b2c3', role: 'Security Admin', org: 'Contoso Corporation' },
  { name: 'Sarah Analyst', email: 'sarah.analyst@fabrikam.com', tenantId: 'fabrikam-inc-d4e5f6', role: 'SOC Analyst', org: 'Fabrikam Inc' },
  { name: 'Mike Director', email: 'mike.director@adventureworks.com', tenantId: 'advworks-g7h8i9', role: 'Security Director', org: 'Adventure Works' },
];

// Store login in context-compatible localStorage
const storeLogin = (account) => {
  const userData = {
    name: account.name,
    email: account.email,
    tenantId: account.tenantId,
    role: account.role,
    org: account.org,
    loginTime: new Date().toISOString()
  };
  localStorage.setItem('oz_user', JSON.stringify(userData));
  localStorage.setItem('oz_tenant', account.tenantId);
  localStorage.setItem('oz_license', 'demo');
  // Also keep legacy keys for backwards compatibility
  localStorage.setItem('outpost_demo_licensed', 'true');
  localStorage.setItem('outpost_demo_user', JSON.stringify(userData));
};

export default function DemoLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginStep, setLoginStep] = useState('initial'); // initial, authenticating, selecting, success, error
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('oz_user');
    if (storedUser) {
      window.location.href = createPageUrl('DemoDashboard');
    }
  }, []);

  const handleMicrosoftLogin = () => {
    setIsLoading(true);
    setLoginStep('authenticating');
    
    // Simulate OAuth redirect delay
    setTimeout(() => {
      setLoginStep('selecting');
      setIsLoading(false);
    }, 1500);
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    setIsLoading(true);
    setLoginStep('authenticating');

    // Simulate token exchange
    setTimeout(() => {
      setLoginStep('success');
      setTimeout(() => {
        storeLogin(account);
        window.location.href = createPageUrl('DemoDashboard');
      }, 800);
    }, 1200);
  };

  const handleCustomEmailLogin = (e) => {
    e.preventDefault();
    if (!customEmail) return;
    
    const account = {
      name: customEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: customEmail,
      tenantId: `${customEmail.split('@')[1]?.split('.')[0] || 'custom'}-tenant-${Date.now().toString(36)}`,
      role: 'Security Admin',
      org: customEmail.split('@')[1]?.split('.')[0]?.replace(/\b\w/g, l => l.toUpperCase()) || 'Custom Organization'
    };
    handleAccountSelect(account);
  };

  const handleDemoAccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      storeLogin({
        name: 'Demo User',
        email: 'demo@outpostzero.com',
        tenantId: 'demo-tenant-00000',
        role: 'Demo Access',
        org: 'Outpost Zero Demo'
      });
      window.location.href = createPageUrl('DemoDashboard');
    }, 500);
  };

  const handleBack = () => {
    setLoginStep('initial');
    setSelectedAccount(null);
    setErrorMessage('');
    setCustomEmail('');
  };

  // Initial login screen
  if (loginStep === 'initial') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-gray-800/80 backdrop-blur border-gray-700 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl text-white font-bold">Outpost Zero</CardTitle>
              <p className="text-gray-400">Unified Physical & Cyber Security Platform</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <Button 
                onClick={handleMicrosoftLogin}
                disabled={isLoading}
                className="w-full bg-[#0078d4] hover:bg-[#106ebe] text-white h-14 text-base font-medium shadow-lg"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                ) : (
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 21 21">
                    <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                    <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                  </svg>
                )}
                Sign in with Microsoft Entra ID
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-gray-800 text-gray-500">or continue with</span>
                </div>
              </div>

              <Button 
                onClick={handleDemoAccess}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 h-12"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Demo Mode (No Login Required)
              </Button>

              <div className="pt-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Lock className="w-3 h-3" />
                  <span>Secured with enterprise-grade encryption</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Building2 className="w-3 h-3" />
                  <span>Supports multi-tenant organizations</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-gray-600 text-xs mt-6">
            © 2024 Cyber Dojo Solutions, LLC. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  // Authenticating screen
  if (loginStep === 'authenticating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800/80 backdrop-blur border-gray-700">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-white text-xl font-semibold mb-2">
              {selectedAccount ? 'Signing you in...' : 'Connecting to Microsoft...'}
            </h3>
            <p className="text-gray-400 text-sm">
              {selectedAccount ? `Welcome back, ${selectedAccount.name}` : 'Please wait while we authenticate'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Account selection screen (simulates Microsoft account picker)
  if (loginStep === 'selecting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white border-0 shadow-2xl">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
              </svg>
              <div>
                <CardTitle className="text-xl text-gray-900">Pick an account</CardTitle>
                <p className="text-gray-500 text-sm">to continue to Outpost Zero</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleAccountSelect(account)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {account.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{account.name}</p>
                    <p className="text-gray-500 text-sm">{account.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600 border-gray-300">
                        {account.org}
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {/* Custom email option */}
            <div className="p-4 border-t bg-gray-50">
              <p className="text-gray-600 text-sm mb-3">Or enter your work email:</p>
              <form onSubmit={handleCustomEmailLogin} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="pl-9 bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Sign in
                </Button>
              </form>
            </div>

            <div className="p-4 border-t">
              <button 
                onClick={handleBack}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ← Use a different method
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success screen
  if (loginStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800/80 backdrop-blur border-gray-700">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Authentication Successful</h3>
            <p className="text-gray-400 text-sm">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}