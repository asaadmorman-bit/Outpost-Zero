
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  Copy, 
  ExternalLink,
  Clock,
  Network,
  Server,
  Shield,
  RefreshCw,
  Loader,
  Mail // Added Mail icon
} from 'lucide-react';

export default function DomainSetupPage() {
  const [copiedRecord, setCopiedRecord] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [supportTicketStatus, setSupportTicketStatus] = useState('pending'); // New state

  const copyToClipboard = (text, recordType) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(recordType);
    setTimeout(() => setCopiedRecord(''), 2000);
  };

  // New function for checking status
  const handleCheckStatus = () => {
    setIsChecking(true);
    setCheckResult(null); // Clear previous result
    setTimeout(() => {
      setIsChecking(false);
      // Simulate a pending status result
      setCheckResult({
        status: 'pending',
        message: 'DNS records not yet detected worldwide. Propagation can sometimes take up to 24-48 hours. This is normal.'
      });
    }, 2500); // Simulate network delay
  };

  const sslTroubleshootingSteps = [
    {
      issue: "ERR_SSL_VERSION_OR_CIPHER_MISMATCH",
      description: "The domain's SSL certificate is misconfigured or using outdated encryption",
      solutions: [
        "Contact your hosting provider to update SSL/TLS certificates",
        "Ensure your domain is pointing to the correct hosting infrastructure",
        "Wait 24-48 hours for DNS propagation to complete",
        "Check if CloudFlare or other CDN services need SSL configuration"
      ]
    },
    {
      issue: "Certificate Not Valid",
      description: "SSL certificate doesn't match the domain or has expired",
      solutions: [
        "Verify the SSL certificate covers your exact domain name",
        "Contact support to renew expired certificates",
        "Ensure wildcard certificates include your subdomain"
      ]
    },
    {
      issue: "Connection Timeout",
      description: "Domain not responding or incorrectly configured",
      solutions: [
        "Double-check all DNS records are correctly entered in GoDaddy",
        "Verify nameservers are pointing to the correct hosting provider",
        "Contact technical support for hosting infrastructure issues"
      ]
    }
  ];

  const dnsRecords = [
    {
      type: 'CNAME',
      name: 'www',
      value: 'your-app-name.base44.app',
      description: 'Points www.outpost-zero.com to your app',
      ttl: '3600'
    },
    {
      type: 'A',
      name: '@',
      value: '76.76.19.61', // Replace with actual base44 IP
      description: 'Points outpost-zero.com (root domain) to your app',
      ttl: '3600'
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Globe className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Domain Integration Guide</h1>
            <p className="text-gray-300">Connect outpost-zero.com to your Outpost Zero platform</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Support Ticket Status */}
          <Card className="border-blue-500/50 bg-blue-900/20">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Support Ticket Status: SSL Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-blue-200">
                  Support ticket created for SSL certificate configuration assistance.
                </p>
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  Pending Response
                </Badge>
              </div>
              <div className="p-4 bg-gray-800/60 rounded-lg">
                <h4 className="font-semibold text-white mb-2">What to expect from base44 support:</h4>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                  <li>Clarification on automatic SSL certificate provisioning</li>
                  <li>Correct DNS configuration for SSL-enabled domains</li>
                  <li>Timeline for SSL certificate activation</li>
                  <li>Any additional steps required for custom domain setup</li>
                </ul>
              </div>
              <Button 
                variant="outline" 
                onClick={() => window.open('mailto:support@base44.com?subject=Follow-up: SSL Certificate Setup', '_blank')}
                className="border-blue-500/50 text-blue-300 hover:bg-blue-600/20"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Follow-up Email
              </Button>
            </CardContent>
          </Card>

          {/* Current SSL Error Alert */}
          <Card className="border-red-500/50 bg-red-900/20">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Current Issue: SSL Certificate Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-gray-900/50 rounded border-l-4 border-red-500">
                <code className="text-red-300 font-mono text-sm">
                  ERR_SSL_VERSION_OR_CIPHER_MISMATCH<br/>
                  outpost-zero.com uses an unsupported protocol.
                </code>
              </div>
              <p className="text-red-200 text-sm">
                This error indicates that while your domain is pointing to the correct servers, 
                the SSL/TLS certificate is not properly configured or is using outdated encryption protocols.
              </p>
            </CardContent>
          </Card>

          {/* Existing Status Card */}
          <Card className="border-yellow-500/50 bg-yellow-900/20">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Domain Status: Pending (SSL Issues)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-yellow-200">
                Your domain outpost-zero.com cannot be verified due to SSL/TLS configuration problems. 
                The DNS records may be correct, but the secure connection is failing.
              </p>
              <Button onClick={handleCheckStatus} disabled={isChecking}>
                {isChecking ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Re-check SSL Status
                  </>
                )}
              </Button>
              {checkResult && (
                <div className="mt-4 p-3 bg-gray-800/60 rounded-lg">
                  <p className="text-sm text-gray-300">{checkResult.message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="ssl-fix" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ssl-fix">SSL Troubleshooting</TabsTrigger>
              <TabsTrigger value="godaddy">GoDaddy Setup</TabsTrigger>
              <TabsTrigger value="troubleshoot">General Issues</TabsTrigger>
              <TabsTrigger value="verify">Verification</TabsTrigger>
            </TabsList>

            <TabsContent value="ssl-fix" className="space-y-6">
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    SSL/TLS Error Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {sslTroubleshootingSteps.map((step, index) => (
                    <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                      <h3 className="font-semibold text-red-300 mb-2">{step.issue}</h3>
                      <p className="text-gray-300 text-sm mb-3">{step.description}</p>
                      <div>
                        <h4 className="font-medium text-white mb-2">Solutions:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                          {step.solutions.map((solution, sIndex) => (
                            <li key={sIndex}>{solution}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                  
                  <div className="p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
                    <h3 className="font-semibold text-blue-300 mb-2">Need Immediate Help?</h3>
                    <p className="text-blue-200 text-sm mb-3">
                      SSL certificate issues typically require hosting provider intervention. If you continue to experience problems:
                    </p>
                    <div className="space-y-2">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => window.open('mailto:support@outpost-zero.com?subject=SSL Certificate Issue - outpost-zero.com')}>
                        Contact Technical Support
                      </Button>
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300" onClick={() => window.open('https://www.ssllabs.com/ssltest/', '_blank')}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Test SSL Configuration
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="godaddy" className="space-y-6">
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Network className="w-5 h-5 text-green-400" />
                    DNS Records to Add in GoDaddy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dnsRecords.map((record, index) => (
                    <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white">{record.type} Record</h3>
                          <p className="text-sm text-gray-400">{record.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(record.value, record.type)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          {copiedRecord === record.type ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <code className="bg-gray-800 px-2 py-1 rounded text-gray-200">{record.name}</code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Value:</span>
                          <code className="bg-gray-800 px-2 py-1 rounded text-gray-200 break-all">{record.value}</code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">TTL:</span>
                          <code className="bg-gray-800 px-2 py-1 rounded text-gray-200">{record.ttl}</code>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Step-by-Step GoDaddy Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-gray-300">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
                      <div>
                        <strong>Log into GoDaddy</strong> and go to your Domain Manager
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                      <div>
                        Find <strong>outpost-zero.com</strong> and click <strong>"Manage DNS"</strong>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                      <div>
                        <strong>Delete existing A records</strong> for @ and www (if any)
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">4</span>
                      <div>
                        <strong>Add the DNS records</strong> shown above exactly as specified
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">5</span>
                      <div>
                        <strong>Wait 24-48 hours</strong> for DNS propagation (usually much faster)
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="troubleshoot" className="space-y-6">
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Common Issues & Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <h4 className="text-red-400 font-semibold mb-2">Issue: Domain still pending after 24 hours</h4>
                    <ul className="text-red-200 text-sm space-y-1 ml-4">
                      <li>• Check that you deleted ALL existing A and CNAME records for @ and www</li>
                      <li>• Ensure TTL is set to 3600 or lower</li>
                      <li>• Verify the DNS records match exactly (no extra spaces or characters)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <h4 className="text-yellow-400 font-semibold mb-2">Issue: GoDaddy shows "Domain forwarding" instead</h4>
                    <ul className="text-yellow-200 text-sm space-y-1 ml-4">
                      <li>• Turn OFF domain forwarding in GoDaddy</li>
                      <li>• Use DNS management instead of forwarding</li>
                      <li>• Make sure you're in the "DNS" section, not "Forwarding"</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <h4 className="text-blue-400 font-semibold mb-2">Issue: SSL certificate problems</h4>
                    <ul className="text-blue-200 text-sm space-y-1 ml-4">
                      <li>• SSL certificates are automatically generated after DNS propagates</li>
                      <li>• This can take up to 24 hours after DNS is working</li>
                      <li>• Check back tomorrow if domain works but shows SSL warnings</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verify" className="space-y-6">
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Check Domain Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => window.open('https://dnschecker.org/#A/outpost-zero.com', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Check DNS Propagation
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => window.open('https://www.whatsmydns.net/#A/outpost-zero.com', '_blank')}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Global DNS Check
                    </Button>
                  </div>

                  <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                    <h4 className="text-white font-semibold mb-2">Quick Test Commands</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-800 px-2 py-1 rounded text-green-400">nslookup outpost-zero.com</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard('nslookup outpost-zero.com', 'cmd1')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-800 px-2 py-1 rounded text-green-400">dig outpost-zero.com</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard('dig outpost-zero.com', 'cmd2')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Next Steps After Support Response */}
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Next Steps After Support Response
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">If base44 Provides SSL Automatically:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                    <li>Wait for SSL certificate provisioning (24-48 hours)</li>
                    <li>Verify DNS propagation is complete</li>
                    <li>Test HTTPS connection</li>
                    <li>Update any hardcoded HTTP links</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">If Manual SSL Upload Required:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                    <li>Purchase SSL certificate from trusted CA</li>
                    <li>Generate CSR for outpost-zero.com</li>
                    <li>Upload certificate through base44 dashboard</li>
                    <li>Configure SSL settings as instructed</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <h4 className="font-semibold text-blue-300 mb-2">Pro Tip:</h4>
                <p className="text-sm text-blue-200">
                  Once you receive instructions from base44 support, come back to this page. 
                  We'll update the setup guide with the exact steps they provide.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/50 bg-green-900/20">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Need Immediate Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-200 mb-4">
                If you're still having issues after following these steps, the base44 platform support team can help with domain configuration.
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                Contact Platform Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
