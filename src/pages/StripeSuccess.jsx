import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { User } from '@/entities/User';
import { StripeSubscription } from '@/entities/StripeSubscription';
import { verifyStripeSession } from '@/functions/verifyStripeSession';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

export default function StripeSuccess() {
  const location = useLocation();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const id = urlParams.get('session_id');
    setSessionId(id);

    if (id) {
      processSession(id);
    } else {
      setStatus('error');
      setError('No session ID found in the URL.');
    }
  }, [location.search]);

  const processSession = async (sessionId) => {
    try {
      setStatus('processing');
      
      // Verify the session with Stripe
      const { data: sessionData } = await verifyStripeSession({ sessionId });
      
      if (sessionData) {
        // Create subscription record
        await StripeSubscription.create({
          stripe_customer_id: sessionData.customer,
          stripe_subscription_id: sessionData.subscription,
          plan_key: sessionData.plan,
          plan_name: sessionData.plan,
          status: 'active'
        });
        
        // Update user record
        await User.updateMyUserData({
          access_level: 'paid_user',
          subscription_id: sessionData.subscription,
          stripe_customer_id: sessionData.customer
        });
        
        setStatus('success');
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          window.location.href = createPageUrl('Dashboard');
        }, 3000);
      } else {
        throw new Error('Invalid session data received');
      }
    } catch (error) {
      console.error('Session processing error:', error);
      setStatus('error');
      setError(error.message || 'Failed to process payment session');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 text-center">
        {status === 'processing' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Processing Payment</h2>
            <p className="text-gray-400">Please wait while we confirm your subscription...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-400 mb-4">
              Your Outpost Zero subscription is now active. You'll be redirected to the dashboard shortly.
            </p>
            <Button 
              onClick={() => window.location.href = createPageUrl('Dashboard')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Go to Dashboard
            </Button>
          </>
        )}
        
        {status === 'error' && (
          <>
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Payment Error</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.href = createPageUrl('Welcome')}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Back to Welcome
            </Button>
          </>
        )}
      </div>
    </div>
  );
}