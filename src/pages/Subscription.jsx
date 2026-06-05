
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Added this import
import { Check, X, Star } from 'lucide-react';
import { Subscription } from '@/entities/Subscription';
import { add } from 'date-fns';

const tiers = [
  {
    name: 'AXIS Rebirth',
    subtitle: 'Home & Remote Workers',
    price: '$99',
    price_period: '/month',
    description: 'Professional-grade security for home users and remote workers.',
    features: [
      'Up to 5 Devices', 
      'AI Threat Detection', 
      'Smart Home Protection', 
      'Remote Work Security',
      'IoT Device Monitoring',
      'Family Safety Features'
    ],
    cta: 'Start 7-Day Trial',
    tier_id: 'axis_rebirth',
    trial_available: true,
  },
  {
    name: 'RevSentinel',
    subtitle: 'Small to Medium Business',
    price: '$500',
    price_period: '/month',
    description: 'Comprehensive security for growing businesses.',
    features: [
      'Up to 150 Endpoints', 
      '10 Integrations', 
      '50 Users', 
      'Priority Support',
      'Advanced AI Analytics',
      'SOAR Automation',
      'Compliance Dashboard'
    ],
    cta: 'Start 7-Day Trial',
    tier_id: 'revsentinel',
    trial_available: true,
    popular: true,
  },
  {
    name: 'RevSentinel Enterprise',
    subtitle: 'Large Organizations',
    price: '$2,500+',
    price_period: '/month',
    description: 'Enterprise-scale security with unlimited scalability.',
    features: [
      '250+ Endpoints', 
      '20+ Integrations', 
      'Unlimited Users', 
      'Dedicated Support',
      'Custom AI Models',
      'Advanced Threat Hunting',
      'Quantum-Safe Encryption'
    ],
    cta: 'Start 7-Day Trial',
    tier_id: 'revsentinel_enterprise',
    trial_available: true,
  },
  {
    name: 'Outpost Zero',
    subtitle: 'Government & Intelligence',
    price: 'Contact Sales',
    price_period: '',
    description: 'FedRAMP High, CMMC, and Top Secret/SCI ready.',
    features: [
      'Air-Gapped Options', 
      'Classified Data Support', 
      'IL4/IL5/IL6 Compliant',
      'On-Site Engineers',
      'Counter-Intelligence Modules',
      'Cross-Domain Solutions'
    ],
    cta: 'Contact Sales',
    tier_id: 'outpost_zero_classified',
    trial_available: false,
  },
];

export default function SubscriptionPage() {
  const [currentSub, setCurrentSub] = useState(null);

  const handleStartTrial = async (tier_id) => {
    const trialEndDate = add(new Date(), { days: 7 });
    
    const tierInfo = tiers.find(t => t.tier_id === tier_id);
    
    alert(`✅ TRIAL STARTED!\n\nTier: ${tierInfo.name}\nStatus: Trialing\nTrial Ends: ${trialEndDate.toLocaleDateString()}\n\nYou now have full access to all ${tierInfo.name} features for 7 days.\n\n➡️ In production, this would create an actual subscription record.`);
  };
  
  const handleContactSales = () => {
      const message = "I'm interested in Outpost Zero for Government/Intelligence. Please contact me to discuss requirements and pricing.";
      window.location.href = `mailto:sales@cyberdojogroup.com?subject=Outpost Zero Government Inquiry&body=${encodeURIComponent(message)}`;
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Security Tier</h1>
          <p className="text-lg text-gray-300 mb-6">From home users to classified government operations - we protect at every level</p>
          <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-500/30 rounded-lg px-4 py-2">
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-medium">All plans include 7-day free trial • No credit card required</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`border-gray-700 bg-gray-800/50 flex flex-col hover:scale-105 transition-transform duration-300 ${tier.popular ? 'border-purple-500 shadow-lg shadow-purple-500/20' : ''}`}>
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-500 text-white px-4 py-1">
                    <Star className="w-4 h-4 mr-1 inline" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl text-white mb-1">{tier.name}</CardTitle>
                <p className="text-sm text-gray-400 mb-4">{tier.subtitle}</p>
                <div className="py-4">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  <span className="text-gray-400 ml-1">{tier.price_period}</span>
                </div>
                <p className="text-sm text-gray-300 h-12">{tier.description}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${tier.popular ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                  onClick={() => tier.trial_available ? handleStartTrial(tier.tier_id) : handleContactSales()}
                >
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need Help Choosing?</h2>
          <p className="text-gray-300 mb-6">Our security experts can help you select the right tier for your needs.</p>
          <Button 
            variant="outline" 
            className="border-gray-600 text-white hover:bg-gray-700"
            onClick={() => window.location.href = 'mailto:sales@cyberdojogroup.com?subject=Help Choosing Subscription Tier'}
          >
            Talk to Sales
          </Button>
        </div>
      </div>
    </div>
  );
}
