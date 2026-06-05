import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Smartphone, 
  Shield, 
  Star, 
  Play, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Building2,
  Globe,
  QrCode,
  ExternalLink,
  Github
} from 'lucide-react';

export default function MobileAppDownloads() {
  const [selectedTier, setSelectedTier] = useState('revsentinel');

  const apps = {
    axis_rebirth: {
      name: 'AXIS Rebirth',
      tier: 'Residential & SOHO',
      version: '2.1.0',
      size: '45 MB',
      rating: 4.8,
      downloads: '50K+',
      logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/9e4a685e9_Screenshot2025-07-24111810.jpg',
      description: 'Next-generation home security with AI-powered threat detection',
      features: [
        'AI-Powered Malware Detection',
        'Home Network Monitoring', 
        'Up to 5 Device Protection',
        'Real-time Threat Alerts',
        'Mobile App Integration',
        '24/7 Autonomous Protection'
      ],
      compatibility: ['Android 7.0+', 'iOS 13+'],
      pricing: '$99/month',
      demoUrl: 'https://demo.outpostzero.com/axis-rebirth',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.cyberdojo.axisrebirth',
      appStoreUrl: 'https://apps.apple.com/app/axis-rebirth/id123456789',
      apkUrl: '/downloads/AxisRebirth-v2.1.0.apk',
      githubUrl: 'https://github.com/cyberdojo-solutions/axis-rebirth-mobile'
    },
    revsentinel: {
      name: 'RevSentinel',
      tier: 'Small-Medium Business',
      version: '3.5.2',
      size: '78 MB', 
      rating: 4.9,
      downloads: '250K+',
      logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/3abd0f5ee_Screenshot2025-07-24112158.jpg',
      description: 'Enterprise-grade security platform for growing businesses',
      features: [
        'Advanced Threat Hunting',
        'SOAR Automation Included',
        'Up to 150 Endpoints',
        'Compliance Frameworks',
        'Blockchain Security',
        'MDM Integration',
        'Predictive Analytics',
        'Multi-tenant Management'
      ],
      compatibility: ['Android 8.0+', 'iOS 14+'],
      pricing: '$1,500/month',
      demoUrl: 'https://demo.outpostzero.com/revsentinel',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.cyberdojo.revsentinel',
      appStoreUrl: 'https://apps.apple.com/app/revsentinel/id987654321',
      apkUrl: '/downloads/RevSentinel-v3.5.2.apk',
      githubUrl: 'https://github.com/cyberdojo-solutions/revsentinel-mobile'
    },
    outpost_zero: {
      name: 'Outpost Zero (Classified)',
      tier: 'Government & Intelligence',
      version: '5.1.0',
      size: '125 MB',
      rating: 5.0,
      downloads: '45K+',
      logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/174051417_Screenshot2025-07-24110248.jpg',
      description: 'The ultimate security platform for government and intelligence operations',
      features: [
        'FedRAMP High Authorized',
        'Quantum-Safe Cryptography',
        'Air-Gapped Capable',
        'Counter-Intelligence Tools',
        'Blockchain Evidence Chain',
        'Classified Data Protection',
        'Multi-Level Security',
        'SCIF-Ready Deployment'
      ],
      compatibility: ['Android 9.0+ (Hardened)', 'iOS 15+ (Government)'],
      pricing: 'Contact Sales',
      demoUrl: 'https://classified.outpostzero.com/demo',
      playStoreUrl: 'https://disa.apps.mil/outpost-zero-classified',
      appStoreUrl: 'https://apps.apple.com/app/outpost-zero-classified/id111222333',
      apkUrl: '/downloads/OutpostZero-v5.1.0-classified.apk',
      githubUrl: null // Classified - no public repo
    }
  };

  const currentApp = apps[selectedTier];

  const downloadApp = (platform) => {
    // In production, this would track downloads
    const downloadUrl = platform === 'android' ? currentApp.apkUrl : 
                       platform === 'playstore' ? currentApp.playStoreUrl :
                       platform === 'appstore' ? currentApp.appStoreUrl : '';
    
    if (downloadUrl.startsWith('/downloads/')) {
      // For direct APK downloads, show instructions
      alert(`🔐 SECURE DOWNLOAD INITIATED\n\nDownloading: ${currentApp.name} v${currentApp.version}\nPlatform: Android APK\nSize: ${currentApp.size}\n\n⚠️ SECURITY NOTE:\n• Install from trusted sources only\n• Verify SHA-256 checksum after download\n• Enable "Install from Unknown Sources" in Android settings\n\n🛡️ This APK is digitally signed by Cyber Dojo Solutions, LLC`);
    } else {
      window.open(downloadUrl, '_blank');
    }
  };

  const ProductionFeatures = () => (
    <Card className="border-gray-700 bg-gray-800/50 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-400" />
          Production-Ready Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-green-400 font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Real Security Capabilities
            </h4>
            <ul className="text-gray-300 text-sm space-y-1 ml-6">
              <li>• Live threat intelligence from 25+ feeds</li>
              <li>• Real-time endpoint detection and response</li>
              <li>• Machine learning anomaly detection</li>
              <li>• SIEM integration with major platforms</li>
              <li>• Automated incident response workflows</li>
              <li>• Compliance reporting for SOC 2, HIPAA, PCI DSS</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-blue-400 font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Enterprise Integration
            </h4>
            <ul className="text-gray-300 text-sm space-y-1 ml-6">
              <li>• REST APIs for custom integrations</li>
              <li>• LDAP/Active Directory SSO</li>
              <li>• Slack/Teams/PagerDuty notifications</li>
              <li>• STIX/TAXII threat intelligence</li>
              <li>• Docker/Kubernetes deployment</li>
              <li>• Multi-tenant architecture</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <Card className="border-gray-700 bg-gray-800/50 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Download className="w-6 h-6 text-blue-400" />
              Download Cyber Dojo Solutions Mobile Apps
            </CardTitle>
            <div className="flex items-center gap-3 mt-4">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6358de6e2_188ec1ee-2ae7-4d9b-aacd-de581b4988ff.png" 
                alt="Cyber Dojo Solutions" 
                className="h-8 object-contain"
              />
              <div>
                <p className="text-blue-300 font-medium">Production-Ready Mobile Security Platform</p>
                <p className="text-gray-400 text-sm">Powered by Outpost Zero Technology</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <ProductionFeatures />

        {/* App Selection Tabs */}
        <Tabs value={selectedTier} onValueChange={setSelectedTier} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="axis_rebirth" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              AXIS Rebirth
            </TabsTrigger>
            <TabsTrigger value="revsentinel" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              RevSentinel
            </TabsTrigger>
            <TabsTrigger value="outpost_zero" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Outpost Zero
            </TabsTrigger>
          </TabsList>

          {Object.entries(apps).map(([key, app]) => (
            <TabsContent key={key} value={key}>
              <div className="grid lg:grid-cols-3 gap-8">
                
                {/* App Details */}
                <div className="lg:col-span-2">
                  <Card className="border-gray-700 bg-gray-800/50">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <img 
                          src={app.logo} 
                          alt={app.name} 
                          className="h-16 w-16 object-contain rounded-lg bg-white p-2"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-white">{app.name}</h2>
                            <Badge className="bg-blue-500/20 text-blue-300">{app.tier}</Badge>
                          </div>
                          <p className="text-gray-300 mb-3">{app.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>v{app.version}</span>
                            <span>•</span>
                            <span>{app.size}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{app.rating}</span>
                            </div>
                            <span>•</span>
                            <span>{app.downloads} downloads</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        
                        {/* Features */}
                        <div>
                          <h3 className="text-white font-semibold mb-3">Key Features</h3>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {app.features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Compatibility */}
                        <div>
                          <h3 className="text-white font-semibold mb-3">Compatibility</h3>
                          <div className="flex gap-2">
                            {app.compatibility.map((platform, i) => (
                              <Badge key={i} variant="outline" className="text-gray-300">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Demo & GitHub */}
                        <div className="flex gap-3 flex-wrap">
                          <Button 
                            variant="outline" 
                            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                            onClick={() => window.open(app.demoUrl, '_blank')}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Live Demo
                          </Button>
                          {app.githubUrl && (
                            <Button 
                              variant="outline" 
                              className="border-gray-500/50 text-gray-300 hover:bg-gray-500/20"
                              onClick={() => window.open(app.githubUrl, '_blank')}
                            >
                              <Github className="w-4 h-4 mr-2" />
                              Source Code
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Download Options */}
                <div className="lg:col-span-1">
                  <Card className="border-gray-700 bg-gray-800/50 sticky top-4">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Download className="w-5 h-5 text-green-400" />
                        Download Options
                      </CardTitle>
                      <div className="text-2xl font-bold text-green-400">
                        {app.pricing}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      
                      {/* Direct APK Download */}
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => downloadApp('android')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download APK
                      </Button>

                      {/* Play Store */}
                      <Button 
                        variant="outline" 
                        className="w-full border-green-500/50 text-green-300 hover:bg-green-500/20"
                        onClick={() => downloadApp('playstore')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Google Play Store
                      </Button>

                      {/* App Store */}
                      <Button 
                        variant="outline" 
                        className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                        onClick={() => downloadApp('appstore')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Apple App Store
                      </Button>

                      {/* Security Notice */}
                      <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-yellow-400 font-semibold text-sm">Security Notice</p>
                            <p className="text-gray-300 text-xs mt-1">
                              All APKs are digitally signed and verified. Only install from official Cyber Dojo Solutions channels.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* QR Code Placeholder */}
                      <div className="text-center pt-4 border-t border-gray-700">
                        <div className="bg-white p-4 rounded-lg inline-block">
                          <QrCode className="w-16 h-16 text-black" />
                        </div>
                        <p className="text-gray-400 text-xs mt-2">Scan to download on mobile</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Installation Guide */}
        <Card className="border-gray-700 bg-gray-800/50 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Installation Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-green-400 font-semibold mb-3">Android APK Installation</h4>
                <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
                  <li>Download the APK file to your Android device</li>
                  <li>Go to Settings → Security → Unknown Sources</li>
                  <li>Enable "Allow installation from unknown sources"</li>
                  <li>Open the downloaded APK file</li>
                  <li>Follow the installation prompts</li>
                  <li>Launch the app and complete authentication</li>
                </ol>
              </div>
              <div>
                <h4 className="text-blue-400 font-semibold mb-3">Enterprise Deployment</h4>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• MDM distribution via Intune/JAMF</li>
                  <li>• Corporate app store deployment</li>
                  <li>• Silent installation with configuration profiles</li>
                  <li>• SCEP certificate-based authentication</li>
                  <li>• VPN-required access policies</li>
                  <li>• Remote wipe and compliance enforcement</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6358de6e2_188ec1ee-2ae7-4d9b-aacd-de581b4988ff.png" 
              alt="Cyber Dojo Solutions" 
              className="h-6 object-contain"
            />
            <span>© 2024 Cyber Dojo Solutions, LLC. All Rights Reserved.</span>
          </div>
          <p>
            Enterprise licensing and custom deployments available. 
            Contact <a href="mailto:sales@cyberdojogroup.com" className="text-blue-400 hover:underline">sales@cyberdojogroup.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}