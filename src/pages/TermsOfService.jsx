import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText } from 'lucide-react';
import CopyrightNotice from '../components/legal/CopyrightNotice';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
      <div className="max-w-4xl mx-auto">
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-400" />
              Terms of Service
            </CardTitle>
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4 prose prose-invert prose-sm">
            <p className="text-yellow-400 bg-yellow-900/50 p-3 rounded-lg border border-yellow-700/50">
              <strong>Disclaimer:</strong> This is a template. Please consult with a legal professional to create a Terms of Service agreement that fits your specific needs.
            </p>
            
            <h2>1. Introduction</h2>
            <p>Welcome to Outpost Zero, a proprietary software platform by Cyber Dojo Solutions, LLC. These Terms of Service ("Terms") govern your use of our services.</p>

            <h2>2. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Cyber Dojo Solutions, LLC and its licensors. Our technology is protected by patent, copyright, trademark, and other laws.</p>

            <h2>3. User Accounts</h2>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>

            <h2>4. Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            
            <h2>5. Limitation of Liability</h2>
            <p>In no event shall Cyber Dojo Solutions, LLC, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages...</p>

            <div className="pt-4">
                <CopyrightNotice />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}