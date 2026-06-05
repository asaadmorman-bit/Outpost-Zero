import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Brain } from 'lucide-react';

export default function AutoResponsePanel() {
  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          AI-Powered Auto-Response
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-block" className="text-gray-300">Auto-block high-confidence IOCs</Label>
          <Switch id="auto-block" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-isolate" className="text-gray-300">Isolate endpoint on critical threat</Label>
          <Switch id="auto-isolate" />
        </div>
        <p className="text-xs text-gray-500">
          Automated actions require a confidence score of 95% or higher from at least two verified feeds.
        </p>
      </CardContent>
    </Card>
  );
}