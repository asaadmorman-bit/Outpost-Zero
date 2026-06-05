import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, FileText } from 'lucide-react';
import CopyrightNotice from '../components/legal/CopyrightNotice';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
      <div className="max-w-4xl mx-auto">
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Lock className="w-6 h-6 text-green-400" />
              Privacy Policy
            </CardTitle>
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4 prose prose-invert prose-sm">
            <p className="text-yellow-400 bg-yellow-900/50 p-3 rounded-lg border border-yellow-700/50">
              <strong>Disclaimer:</strong> This is a template. Please consult with a legal professional to ensure your Privacy Policy complies with all relevant regulations like GDPR, CCPA, etc.
            </p>

            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account. We also collect operational data necessary for the function of our security services, which may include logs and metadata.</p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to operate, maintain, and provide you with the features and functionality of the Service, as well as to communicate with you, and for security purposes.</p>

            <h2>3. Data Security</h2>
            <p>We use robust, proprietary, and industry-standard security measures to protect your information. All data is encrypted in transit and at rest using advanced cryptographic protocols.</p>

            <h2>4. Homomorphic Encryption</h2>
            <p>For certain analytics, we may use homomorphic encryption to perform calculations on encrypted data without decrypting it, providing an unparalleled layer of privacy.</p>
            
            <h2>5. Your Data Rights</h2>
            <p>Depending on your location, you may have rights regarding your personal information, including the right to access, correct, or delete your data.</p>

            <div className="pt-4">
                <CopyrightNotice />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}