import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitMerge } from 'lucide-react';

const CodeBlock = ({ children }) => (
  <pre className="bg-gray-900/70 rounded-md p-4 my-4 overflow-x-auto">
    <code className="text-sm text-white font-mono">{children}</code>
  </pre>
);

export default function IntegrationGuides() {
    return (
        <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <GitMerge className="w-5 h-5 text-purple-400" />
                    Third-Party Integration Guides
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Jira Integration</h3>
                    <p className="text-gray-400 mb-2">Automatically create Jira tickets from CyberShield incidents.</p>
                    <ol className="list-decimal list-inside text-gray-300 space-y-2">
                        <li>In Jira, navigate to <span className="font-mono bg-gray-700 px-1 rounded">Settings &gt; API Tokens</span> and create a new API token. Copy the token.</li>
                        <li>In CyberShield, go to <span className="font-mono bg-gray-700 px-1 rounded">Settings &gt; Integrations</span> and click "Connect" on the Jira card.</li>
                        <li>Enter your Jira domain (e.g., <span className="font-mono bg-gray-700 px-1 rounded">your-company.atlassian.net</span>), your email address, and the API token you copied.</li>
                        <li>Map CyberShield incident severities to Jira issue priorities.</li>
                        <li>Enable the integration and use the "Create Jira Ticket" action in SOAR playbooks or on the Incident details page.</li>
                    </ol>
                </div>
                 <div>
                    <h3 className="text-xl font-semibold text-white mb-2">ServiceNow Integration</h3>
                    <p className="text-gray-400 mb-2">Sync incidents with ServiceNow for enterprise-wide visibility.</p>
                    <ol className="list-decimal list-inside text-gray-300 space-y-2">
                        <li>In ServiceNow, create a new user for the integration and assign it the appropriate roles (e.g., <span className="font-mono bg-gray-700 px-1 rounded">itil</span>, <span className="font-mono bg-gray-700 px-1 rounded">rest_api_explorer</span>).</li>
                        <li>In CyberShield, go to <span className="font-mono bg-gray-700 px-1 rounded">Settings &gt; Integrations</span> and click "Connect" on the ServiceNow card.</li>
                        <li>Enter your ServiceNow instance URL, the username, and the password for the integration user.</li>
                        <li>Define the assignment group for new incidents created from CyberShield.</li>
                        <li>Use the "Create ServiceNow Incident" action in SOAR playbooks.</li>
                    </ol>
                </div>
                 <div>
                    <h3 className="text-xl font-semibold text-white mb-2">VirusTotal Integration</h3>
                    <p className="text-gray-400 mb-2">Enrich IOCs (hashes, IPs, domains) with intelligence from VirusTotal.</p>
                     <ol className="list-decimal list-inside text-gray-300 space-y-2">
                        <li>Log in to your VirusTotal account and find your API key in your profile settings.</li>
                        <li>In CyberShield, go to <span className="font-mono bg-gray-700 px-1 rounded">Settings &gt; Integrations</span> and click "Connect" on the VirusTotal card.</li>
                        <li>Paste your API key and save. The integration will be automatically used to enrich data in the Threat Intelligence module.</li>
                    </ol>
                </div>
            </CardContent>
        </Card>
    );
}