import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Server, Settings, Rocket, ArrowLeft, Code, Copy, CheckCircle } from 'lucide-react';

export default function NextStepsPage() {
  const [copied, setCopied] = React.useState(false);

  const backendCode = `// Backend function to create Stripe checkout session
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function createCheckoutSession(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { priceId, planName, successUrl, cancelUrl } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planName,
      },
    });

    res.status(200).json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(backendCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-4xl space-y-6">
        <Card className="border-blue-500/50 bg-gray-800/50 text-white">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <Rocket className="w-8 h-8 text-blue-400" />
            </div>
            <CardTitle className="text-3xl text-white">Enable Backend Functions</CardTitle>
            <p className="text-gray-300">Your Stripe integration is ready - just need to activate server-side processing</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
                  <Settings className="w-5 h-5 text-green-400" />
                  Step 1: Enable Backend Functions
                </h3>
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                  <ol className="text-sm text-gray-300 space-y-2">
                    <li>1. Go to your <strong className="text-cyan-300">Workspace</strong></li>
                    <li>2. Navigate to <strong className="text-cyan-300">Settings</strong></li>
                    <li>3. Click <strong className="text-cyan-300">Enable Backend Functions</strong></li>
                    <li>4. Confirm the activation</li>
                  </ol>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
                  <Server className="w-5 h-5 text-purple-400" />
                  Step 2: Add Environment Variables
                </h3>
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-300 space-y-2">
                    <p>Add your Stripe secret key:</p>
                    <code className="block bg-black/50 p-2 rounded text-xs">
                      STRIPE_SECRET_KEY=sk_live_...
                    </code>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
                <Code className="w-5 h-5 text-yellow-400" />
                Step 3: Backend Code (Ready to Use)
              </h3>
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg">
                <div className="flex justify-between items-center p-3 border-b border-gray-700">
                  <span className="text-sm text-gray-400">functions/create-checkout-session.js</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                    className="border-gray-600 hover:bg-gray-700"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>
                <pre className="p-4 text-xs text-gray-300 overflow-x-auto">
                  <code>{backendCode}</code>
                </pre>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-blue-300 mb-2">What happens after setup?</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Purchase buttons will redirect to Stripe checkout</li>
                <li>• Subscriptions will be automatically managed</li>
                <li>• Users get immediate access after payment</li>
                <li>• All payment data is securely handled by Stripe</li>
              </ul>
            </div>

            <div className="text-center pt-4 space-y-3">
              <p className="text-sm text-gray-400">
                Need help? Contact me through the feedback button or email support@outpostzero.ai
              </p>
              <Link to={createPageUrl('Welcome')}>
                <Button variant="outline" className="border-gray-600 hover:bg-gray-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Welcome Page
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}