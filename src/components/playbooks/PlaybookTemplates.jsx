import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Play, BookOpen, Shield } from 'lucide-react';

export default function PlaybookTemplates({ onUseTemplate, onExecute }) {
  const templates = [
    {
      name: "NIST Phishing Response",
      description: "Based on NIST SP 800-61 guidelines for phishing incident response",
      incident_type: "phishing",
      steps: 5,
      source: "NIST",
      maturity: "enterprise"
    },
    {
      name: "SANS Ransomware Playbook",
      description: "SANS Institute's comprehensive ransomware response procedures",
      incident_type: "ransomware",
      steps: 8,
      source: "SANS",
      maturity: "advanced"
    },
    {
      name: "CISA Insider Threat",
      description: "CISA guidelines for detecting and responding to insider threats",
      incident_type: "insider_threat",
      steps: 6,
      source: "CISA",
      maturity: "intermediate"
    },
    {
      name: "ISO 27035 Data Breach",
      description: "ISO 27035-compliant data breach response playbook",
      incident_type: "data_breach",
      steps: 7,
      source: "ISO",
      maturity: "enterprise"
    }
  ];

  const getSourceColor = (source) => {
    const colors = {
      "NIST": "bg-blue-500/20 text-blue-300 border-blue-500/50",
      "SANS": "bg-purple-500/20 text-purple-300 border-purple-500/50",
      "CISA": "bg-green-500/20 text-green-300 border-green-500/50",
      "ISO": "bg-orange-500/20 text-orange-300 border-orange-500/50"
    };
    return colors[source] || "bg-gray-500/20 text-gray-300 border-gray-500/50";
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <h3 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Industry-Standard Templates
        </h3>
        <p className="text-blue-200 text-sm">
          Pre-built playbooks based on industry best practices from NIST, SANS, CISA, and ISO standards. 
          Customize these templates to match your organization's specific needs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {templates.map((template, index) => (
          <Card key={index} className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                <Badge variant="outline" className={getSourceColor(template.source)}>
                  {template.source}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                  {template.incident_type.replace(/_/g, ' ')}
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                  {template.steps} steps
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                  {template.maturity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">{template.description}</p>

              <div className="flex gap-2">
                <Button
                  onClick={() => onUseTemplate(template)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
                <Button
                  onClick={() => alert('Preview functionality coming soon')}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  size="sm"
                >
                  <BookOpen className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}