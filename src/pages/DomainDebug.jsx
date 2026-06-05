import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe, AlertTriangle, CheckCircle, Info, Copy, 
  ExternalLink, Server, FileX, Code
} from 'lucide-react';

export default function DomainDebugPage() {
  
  const copySupportRequest = () => {
    const supportText = `URGENT: Custom Domain Routing Failure (404 Errors)

Hi base44 Support,

We are experiencing a critical routing issue with our custom domain, outpost-zero.com.

PROBLEM:
The domain returns a 404 "Not Found" error for ALL pages except the root domain (e.g., /Dashboard, /Incidents, /Login all fail). The base44-provided URL works correctly.

DIAGNOSIS:
This is a server-side routing configuration problem. The platform is not configured to handle Single-Page Application (SPA) routing for the custom domain.

TECHNICAL REQUIREMENT:
The web server handling outpost-zero.com needs a rewrite rule. All incoming requests, regardless of the path, must be redirected to serve the root index.html file. This will allow the client-side React Router to manage the application's routes correctly.

This is standard practice for hosting modern React applications.

Please apply this SPA rewrite/redirect rule to our custom domain configuration as soon as possible.

Thank you.`;

    navigator.clipboard.writeText(supportText);
    alert('Support request copied to clipboard! Please paste this into your ticket with base44 support.');
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-red-500/10 rounded-lg">
            <FileX className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">404 Error Diagnosis</h1>
            <p className="text-gray-300">Troubleshooting routing for outpost-zero.com</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Alert className="border-red-500/50 bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              <strong className="font-bold">Root Cause Identified: Server Configuration Error.</strong>
              <p className="mt-2">The 404 errors confirm the issue is with the base44 platform's server setup for your custom domain, not with the application code. Only base44 support can fix this.</p>
            </AlertDescription>
          </Alert>

          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-400" />
                Technical Explanation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <p>
                Your application is a <strong className="text-white">Single-Page Application (SPA)</strong>. This means that after the initial page load, all routing (like going to `/Dashboard`) is handled by React in the user's browser.
              </p>
              <p>
                The server must be configured to send the same `index.html` file for <strong className="text-white">every possible URL path</strong>. The server for `outpost-zero.com` is currently not doing this, which is why any link other than the homepage results in a 404 error.
              </p>
               <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                  <h4 className="font-semibold text-white">Correct Flow (What should happen):</h4>
                  <p className="text-sm">Request for `/Dashboard` → Server sends `index.html` → React app loads and shows the Dashboard page.</p>
                  <h4 className="font-semibold text-white mt-3">Incorrect Flow (What is happening):</h4>
                  <p className="text-sm text-red-300">Request for `/Dashboard` → Server looks for a `/Dashboard` folder/file → Fails and returns 404 error.</p>
               </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/50 bg-green-900/20">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Action Required: Contact base44 Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-green-200">
                Please send the following technical request to base44 support. This gives them the precise information they need to fix the server configuration for your custom domain.
              </p>
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-600">
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
                  <p className="text-base text-white font-sans font-bold mb-2">Subject: URGENT: Custom Domain Routing Failure (404 Errors)</p>
                  <p>Hi base44 Support,</p>
                  <p>My custom domain, outpost-zero.com, is returning 404 errors for all non-root pages. This is a server configuration issue preventing our Single-Page Application from working correctly.</p>
                  <p><strong className="text-yellow-300">Please apply a server-side rewrite rule to redirect all paths for this domain to the root index.html file.</strong></p>
                  <p>Thank you.</p>
                </pre>
              </div>
              <Button 
                onClick={copySupportRequest}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Full Support Request to Clipboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}