import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Search, CheckCircle, AlertCircle } from 'lucide-react';

export default function IntegrationSelector({ onSelect, onCancel }) {
  const [searchTerm, setSearchTerm] = useState('');

  const integrations = [
    {
      id: 'palo_alto_firewall',
      name: 'Palo Alto Firewall',
      category: 'Network Security',
      status: 'connected',
      capabilities: ['Block IP', 'Block Domain', 'Create Policy']
    },
    {
      id: 'crowdstrike_edr',
      name: 'CrowdStrike EDR',
      category: 'Endpoint Security',
      status: 'connected',
      capabilities: ['Isolate Host', 'Kill Process', 'Collect Forensics']
    },
    {
      id: 'active_directory',
      name: 'Active Directory',
      category: 'Identity Management',
      status: 'connected',
      capabilities: ['Disable User', 'Reset Password', 'Modify Groups']
    },
    {
      id: 'proofpoint',
      name: 'Proofpoint Email',
      category: 'Email Security',
      status: 'connected',
      capabilities: ['Quarantine Email', 'Block Sender', 'Release Email']
    },
    {
      id: 'servicenow',
      name: 'ServiceNow',
      category: 'Ticketing',
      status: 'connected',
      capabilities: ['Create Ticket', 'Update Ticket', 'Close Ticket']
    },
    {
      id: 'slack',
      name: 'Slack',
      category: 'Communication',
      status: 'connected',
      capabilities: ['Send Message', 'Create Channel', 'Notify Team']
    },
    {
      id: 'aws',
      name: 'AWS',
      category: 'Cloud Provider',
      status: 'not_configured',
      capabilities: ['Modify Security Group', 'Stop Instance', 'Create Snapshot']
    },
    {
      id: 'azure',
      name: 'Azure',
      category: 'Cloud Provider',
      status: 'not_configured',
      capabilities: ['Modify NSG', 'Deallocate VM', 'Create Alert']
    }
  ];

  const filteredIntegrations = integrations.filter(int =>
    int.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    int.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="border-gray-700 bg-gray-800 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Select Integration</CardTitle>
            <Button onClick={onCancel} variant="ghost" size="sm" className="text-gray-400">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto flex-1">
          <div className="grid md:grid-cols-2 gap-4">
            {filteredIntegrations.map((integration) => (
              <Card
                key={integration.id}
                className={`border-gray-700 bg-gray-900/50 hover:bg-gray-900 transition-colors cursor-pointer ${
                  integration.status === 'connected' ? 'border-green-500/30' : 'border-gray-700'
                }`}
                onClick={() => integration.status === 'connected' && onSelect(integration)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium mb-1">{integration.name}</h4>
                      <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                        {integration.category}
                      </Badge>
                    </div>
                    {integration.status === 'connected' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="text-gray-400 text-xs mb-2">Capabilities:</div>
                    <div className="flex flex-wrap gap-1">
                      {integration.capabilities.slice(0, 3).map((cap, idx) => (
                        <Badge key={idx} className="bg-blue-500/20 text-blue-300 text-xs">
                          {cap}
                        </Badge>
                      ))}
                      {integration.capabilities.length > 3 && (
                        <Badge className="bg-gray-700 text-gray-400 text-xs">
                          +{integration.capabilities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {integration.status === 'not_configured' && (
                    <p className="text-yellow-400 text-xs">
                      ⚠️ Integration not configured
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}