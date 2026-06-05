import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Cloud, 
  Shield, 
  Users, 
  CheckCircle, 
  ExternalLink,
  GitBranch,
  Target,
  Key,
  ShoppingCart,
  ArrowRight,
  Copy
} from 'lucide-react';

const CodeBlock = ({ title, code, language }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800">
        <span className="text-gray-300 font-medium text-sm">{title}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={copyToClipboard}
          className="text-gray-400 hover:text-white"
        >
          {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-gray-300 font-mono">{code}</code>
      </pre>
    </div>
  );
};

const StepCard = ({ number, title, goal, children }) => (
    <Card className="bg-gray-800 border-gray-700 w-full mb-6">
        <CardHeader>
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white text-xl font-bold">
                    {number}
                </div>
                <div>
                    <CardTitle className="text-2xl text-white">{title}</CardTitle>
                    <p className="text-blue-300">{goal}</p>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
);

export default function MicrosoftISVIntegration() {
  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
             <img src="https://cdn-icons-png.flaticon.com/512/732/732221.png" alt="Microsoft" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white">Your Path to the Azure Marketplace</h1>
            <p className="text-lg text-gray-300 mt-2">The 3 core technical integrations to launch Outpost Zero.</p>
             <Badge className="bg-green-500/20 text-green-300 mt-4">ISV Program: APPROVED</Badge>
        </div>

        {/* Step 1: Azure AD Integration */}
        <StepCard 
            number="1" 
            title="Integrate Azure Active Directory (AAD) SSO"
            goal="Allow enterprise customers to sign in with their Microsoft work accounts."
        >
            <p className="text-gray-300 mb-4">This is the first and most critical step for any enterprise SaaS. It builds trust and simplifies user management for your customers.</p>
            <Alert className="border-yellow-500/50 bg-yellow-500/10 mb-4">
                <Key className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-200">
                  You'll need to register Outpost Zero in your Azure AD tenant to get a <code className="p-1 bg-gray-700 rounded text-xs">Client ID</code> and set up a <code className="p-1 bg-gray-700 rounded text-xs">Redirect URI</code>.
                </AlertDescription>
            </Alert>
            <h4 className="font-semibold text-white mb-2">Example Frontend Login Button (React):</h4>
            <CodeBlock
                title="Azure AD Login Integration"
                language="jsx"
                code={`import { User } from '@/entities/User';

const handleAzureLogin = () => {
    // This would redirect the user to the Microsoft login page
    // The Base44 platform can handle the OAuth 2.0 flow
    User.login({ provider: 'azure' }); 
};

<Button onClick={handleAzureLogin}>
    <img src="/microsoft-logo.svg" className="w-4 h-4 mr-2" />
    Sign in with Microsoft
</Button>`}
            />
        </StepCard>

        {/* Step 2: Azure Sentinel Connector */}
        <StepCard 
            number="2" 
            title="Develop a Sentinel Data Connector"
            goal="Feed Outpost Zero's unique threat data directly into your customer's primary security tool."
        >
            <p className="text-gray-300 mb-4">This is your core value proposition on the Azure platform. You are enriching the customer's existing security ecosystem, not just providing a separate tool. This is key for co-sell motions.</p>
            <h4 className="font-semibold text-white mb-2">Backend Function Logic (Deno):</h4>
            <CodeBlock
                title="Azure Sentinel Connector"
                language="javascript"
                code={`// functions/azureSentinelConnector.js
// This function is triggered when new threat intel is generated in Outpost Zero.

import { LogAnalyticsDataClient } from "@azure/monitor-ingest";
import { DefaultAzureCredential } from "@azure/identity";

// Simplified function to send data to a customer's workspace
async function sendToSentinel(threatIntel, customerConfig) {
    // Uses Managed Identity for secure, passwordless authentication to Azure
    const credential = new DefaultAzureCredential();
    const client = new LogAnalyticsDataClient(credential);

    const logs = [{
        TimeGenerated: new Date().toISOString(),
        Indicator: threatIntel.indicator,
        ThreatType: threatIntel.threat_type,
        SourceSystem: "OutpostZero",
        Confidence: threatIntel.confidence,
        Severity: threatIntel.confidence > 80 ? "High" : "Medium",
        Description: threatIntel.description
    }];

    // Uploads the log to the customer's specified Log Analytics Workspace
    await client.upload(
        customerConfig.logAnalyticsWorkspaceId,
        customerConfig.dataCollectionRuleId,
        logs
    );
    console.log("Threat intel forwarded to Sentinel.");
}`}
            />
        </StepCard>

        {/* Step 3: Marketplace Fulfillment APIs */}
        <StepCard 
            number="3" 
            title="Implement SaaS Fulfillment APIs"
            goal="Automate customer subscriptions directly from the Azure Marketplace."
        >
            <p className="text-gray-300 mb-4">This allows customers to purchase and provision Outpost Zero using their existing Azure billing relationship, which is a massive friction reducer. This is a mandatory step to be transactable on the marketplace.</p>
            <h4 className="font-semibold text-white mb-2">The Purchase & Provisioning Flow:</h4>
            <div className="grid grid-cols-4 gap-4 my-6 text-center text-sm text-gray-300">
                <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
                  <ShoppingCart className="w-8 h-8 text-blue-400 mb-2"/>
                  <p>1. Customer buys on Azure Marketplace</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
                  <ExternalLink className="w-8 h-8 text-blue-400 mb-2"/>
                  <p>2. MS redirects to your Landing Page</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-400 mb-2"/>
                  <p>3. Your backend resolves token</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-400 mb-2"/>
                  <p>4. You provision account</p>
                </div>
            </div>
             <h4 className="font-semibold text-white mb-2 mt-6">Example Backend Logic (Deno):</h4>
            <CodeBlock
                title="Marketplace Fulfillment API"
                language="javascript"
                code={`// functions/handleMarketplacePurchase.js
// This function runs on your landing page after a customer purchases.

import { resolvePurchaseToken, activateSubscription } from 'npm:@microsoft/marketplace-saas@1.0.0';

async function handlePurchase(request) {
    const url = new URL(request.url);
    const token = url.searchParams.get('token'); // Get token from redirect

    // 1. Resolve the token to get subscription details
    const subscriptionDetails = await resolvePurchaseToken(token);
    
    // 2. Check if this customer/tenant already exists in Outpost Zero
    let user = await base44.asServiceRole.entities.User.filter({ 
        email: subscriptionDetails.purchaser.email 
    });
    
    if (!user) {
        // 3. If not, create a new user and organization
        user = await base44.asServiceRole.entities.User.create({
            email: subscriptionDetails.purchaser.email,
            full_name: subscriptionDetails.purchaser.name,
            access_level: 'paid_user'
        });
    }
    
    // 4. Activate the subscription with Microsoft to start billing
    await activateSubscription(subscriptionDetails.purchaseId, {
        planId: subscriptionDetails.planId,
        quantity: subscriptionDetails.quantity
    });

    // 5. Log the user in and redirect to the Outpost Zero dashboard
    return new Response.redirect('/dashboard');
}`}
            />
        </StepCard>
        
        <div className="text-center mt-12">
            <h2 className="text-2xl font-bold text-white">Next Steps</h2>
            <p className="text-gray-400 mt-2">Completing these three core integrations will make you eligible for <br/><strong>IP Co-Sell Incentivized</strong> status, the highest tier of Microsoft partnership.</p>
            <Button asChild className="mt-4 bg-green-600 hover:bg-green-700 text-lg py-6 px-8">
                <a href="https://partner.microsoft.com/" target="_blank" rel="noopener noreferrer">
                    Go to Microsoft Partner Center
                    <ArrowRight className="w-5 h-5 ml-2" />
                </a>
            </Button>
        </div>

      </div>
    </div>
  );
}