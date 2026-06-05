import React, { useEffect } from 'react';
import { User } from '@/entities/User';
import { createPageUrl } from '@/utils';

export default function WelcomeRedirect() {
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const user = await User.me();
        if (user && (user.subscription_id || user.access_level === 'paid_user')) {
          // User is authenticated with valid subscription, redirect to dashboard
          window.location.href = createPageUrl('Dashboard');
        } else {
          // User needs subscription, redirect to welcome page
          window.location.href = createPageUrl('Welcome');
        }
      } catch (error) {
        // User not authenticated, redirect to welcome page
        window.location.href = createPageUrl('Welcome');
      }
    };

    checkAuthAndRedirect();
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting...</p>
      </div>
    </div>
  );
}