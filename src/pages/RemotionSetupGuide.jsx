import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Key, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  Video,
  Code,
  Cloud,
  Settings,
  DollarSign
} from 'lucide-react';

export default function RemotionSetupGuide() {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Video className="w-6 h-6 text-blue-400" />
              Remotion API Key Setup Guide
              <Badge className="bg-blue-500/20 text-blue-300">Step-by-Step</Badge>
            </CardTitle>
            <p className="text-gray-400">Get your Remotion API key to enable professional video generation</p>
          </CardHeader>
        </Card>

        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="signup">Step 1: Sign Up</TabsTrigger>
            <TabsTrigger value="lambda">Step 2: Lambda Setup</TabsTrigger>
            <TabsTrigger value="api-key">Step 3: API Key</TabsTrigger>
            <TabsTrigger value="test">Step 4: Test</TabsTrigger>
          </TabsList>

          <TabsContent value="signup" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Create Remotion Lambda Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-blue-500/50 bg-blue-500/10">
                  <AlertTriangle className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-200">
                    Remotion Lambda is required for API-based video generation. The regular Remotion package is for local development only.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">1. Go to Remotion Lambda Console</h3>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <a href="https://www.remotion.dev/lambda" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Remotion Lambda
                      </a>
                    </Button>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">2. Create Account or Sign In</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Click "Get Started" or "Sign In"</li>
                      <li>• Use your GitHub account (recommended) or email</li>
                      <li>• Complete the account setup process</li>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">3. Choose Your Plan</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border border-gray-600 rounded-lg p-3">
                        <h4 className="text-green-400 font-medium">Starter Plan</h4>
                        <p className="text-sm text-gray-300">$0.01 per second of video rendered</p>
                        <p className="text-xs text-gray-400 mt-1">Perfect for testing and small volumes</p>
                      </div>
                      <div className="border border-blue-500 rounded-lg p-3">
                        <h4 className="text-blue-400 font-medium">Pro Plan</h4>
                        <p className="text-sm text-gray-300">Volume discounts available</p>
                        <p className="text-xs text-gray-400 mt-1">Better for production use</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lambda" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">AWS Lambda Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-yellow-500/50 bg-yellow-500/10">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-200">
                    Remotion Lambda requires an AWS account. Don't worry - the setup is mostly automated.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">1. Connect AWS Account</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• In the Remotion Lambda console, click "Connect AWS"</li>
                      <li>• You'll be redirected to AWS to authorize Remotion</li>
                      <li>• If you don't have an AWS account, you can create one (free tier available)</li>
                      <li>• Allow Remotion to create Lambda functions in your account</li>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">2. Deploy Lambda Functions</h3>
                    <p className="text-gray-300 text-sm mb-3">Remotion will automatically deploy the necessary Lambda functions to your AWS account.</p>
                    <div className="bg-gray-800 rounded p-3">
                      <p className="text-xs text-gray-400 mb-2">This creates functions for:</p>
                      <ul className="text-xs text-gray-300 space-y-1">
                        <li>• Video rendering</li>
                        <li>• Asset management</li>
                        <li>• Status checking</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">3. Choose Regions</h3>
                    <p className="text-gray-300 text-sm mb-2">Select AWS regions for video rendering:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                      <div>• us-east-1 (N. Virginia) - Recommended</div>
                      <div>• eu-west-1 (Ireland)</div>
                      <div>• ap-southeast-2 (Sydney)</div>
                      <div>• us-west-2 (Oregon)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api-key" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Generate API Key</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">1. Access API Settings</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• In your Remotion Lambda dashboard, click on "API Keys" or "Settings"</li>
                      <li>• Look for "Generate API Key" or "Create Token"</li>
                      <li>• Choose a descriptive name like "Outpost Zero Video Generation"</li>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">2. Generate and Copy API Key</h3>
                    <div className="bg-red-900/20 border border-red-500/30 rounded p-3 mb-3">
                      <p className="text-red-300 text-sm font-medium">⚠️ Important Security Note</p>
                      <p className="text-red-200 text-xs mt-1">Your API key will only be shown once. Copy it immediately and store it securely.</p>
                    </div>
                    <p className="text-gray-300 text-sm">Your API key will look something like:</p>
                    <div className="bg-gray-800 rounded p-3 mt-2 font-mono text-sm text-green-400">
                      rmt_1234567890abcdef1234567890abcdef12345678
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">3. Add to Outpost Zero</h3>
                    <p className="text-gray-300 text-sm mb-3">Add your API key to the base44 environment variables:</p>
                    <div className="space-y-3">
                      <div className="bg-gray-800 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">Environment Variable</span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => copyToClipboard('REMOTION_API_KEY', 'env-var')}
                          >
                            {copied === 'env-var' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <code className="text-sm text-cyan-400">REMOTION_API_KEY</code>
                      </div>
                      <div className="text-xs text-gray-400">
                        Go to Dashboard → Settings → Environment Variables and add this key with your actual API key as the value.
                      </div>
                    </div>
                  </div>
                </div>

                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-200">
                    Once you add the API key to your environment variables, video generation will be available immediately.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Test Your Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">1. Test API Connection</h3>
                    <p className="text-gray-300 text-sm mb-3">Here's a simple test to verify your API key works:</p>
                    <div className="bg-gray-800 rounded p-3">
                      <pre className="text-xs text-green-400 overflow-x-auto">
{`curl -X POST https://api.remotion.dev/lambda/render \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "composition": "test",
    "serveUrl": "https://your-compositions.com",
    "inputProps": {}
  }'`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">2. Generate Your First Video</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Go to Training → AI Video Generator in Outpost Zero</li>
                      <li>• Select "Remotion Programmatic" as your production method</li>
                      <li>• Create a short test video (30 seconds)</li>
                      <li>• This will verify everything is working correctly</li>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">3. Monitor Usage and Costs</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-800 rounded p-3">
                        <h4 className="text-blue-400 font-medium text-sm">Remotion Lambda Dashboard</h4>
                        <p className="text-xs text-gray-300 mt-1">Track rendering jobs and usage</p>
                      </div>
                      <div className="bg-gray-800 rounded p-3">
                        <h4 className="text-green-400 font-medium text-sm">AWS Console</h4>
                        <p className="text-xs text-gray-300 mt-1">Monitor Lambda costs and usage</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert className="border-blue-500/50 bg-blue-500/10">
                  <AlertTriangle className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-200">
                    <strong>Cost Estimation:</strong> A 60-second 1080p video typically costs $0.60-$1.20 to render, depending on complexity.
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Troubleshooting</h3>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div>
                      <strong className="text-red-400">Error: "Invalid API Key"</strong>
                      <p className="text-xs text-gray-400 mt-1">Double-check the API key in your environment variables. Make sure there are no extra spaces.</p>
                    </div>
                    <div>
                      <strong className="text-red-400">Error: "Lambda function not found"</strong>
                      <p className="text-xs text-gray-400 mt-1">Ensure the Lambda functions were deployed to your AWS account during setup.</p>
                    </div>
                    <div>
                      <strong className="text-red-400">Slow rendering</strong>
                      <p className="text-xs text-gray-400 mt-1">Try using a different AWS region closer to your location.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-green-900/20 border-green-500/30 mt-6">
          <CardContent className="pt-6">
            <h3 className="text-green-300 font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              What You'll Get With Remotion
            </h3>
            <ul className="text-green-200 space-y-1 text-sm">
              <li>• Programmatic video generation with React components</li>
              <li>• Ultra HD quality (up to 4K)</li>
              <li>• Full customization and dynamic content</li>
              <li>• Most cost-effective solution for scale</li>
              <li>• Perfect for automated demo video generation</li>
              <li>• Ideal for investor presentations and sales demos</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}