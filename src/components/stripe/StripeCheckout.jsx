import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, CreditCard, Shield, Star } from 'lucide-react';

const plans = [
  {
    id: 'revsentinel',
    name: 'RevSentinel',
    price: '$1,500',
    period: '/month',
    description: 'Complete enterprise security operations platform',
    features: [
      'Advanced Threat Detection',
      'AI-Powered Analytics',
      'Incident Response Automation',
      'Compliance Reporting',
      'Custom Integrations',
      '24/7 Support'
    ],
    popular: true,
    stripeUrl: 'https://buy.stripe.com/test_your_payment_link' // Replace with actual Stripe link
  },
  {
    id: 'revsentinel_enterprise',
    name: 'RevSentinel Enterprise',
    price: '$5,000',
    period: '/month',
    description: 'Full-scale security operations for large enterprises',
    features: [
      'Everything in RevSentinel',
      'Advanced AI Models',
      'Custom Deployment Options',
      'Dedicated Support Team',
      'SLA Guarantees',
      'Custom Training'
    ],
    popular: false,
    stripeUrl: 'https://buy.stripe.com/test_your_enterprise_link' // Replace with actual Stripe link
  }
];

export default function StripeCheckout({ selectedPlan = 'revsentinel' }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleCheckout = async (plan) => {
    setIsLoading(true);
    setLoadingPlan(plan.id);
    
    try {
      // Redirect to Stripe Checkout
      window.location.href = plan.stripeUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`border-gray-700 bg-gray-800/50 flex flex-col relative ${
            plan.popular ? 'border-blue-500' : ''
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-600 text-white">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>
          )}
          
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold text-white">{plan.price}</span>
              <span className="text-gray-400">{plan.period}</span>
            </div>
            <p className="text-gray-300 text-sm mt-2">{plan.description}</p>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              onClick={() => handleCheckout(plan)}
              disabled={isLoading}
              className={`w-full ${
                plan.popular 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white`}
            >
              {loadingPlan === plan.id ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Start {plan.name}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}