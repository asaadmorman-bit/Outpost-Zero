import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Download, Copy, CheckCircle, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function CoSellBriefGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [brief, setBrief] = useState('');
  const [copied, setCopied] = useState(false);

  const generateBrief = async () => {
    setIsGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a professional co-sell solution brief for Outpost Zero, an AI-powered security operations platform.

The brief should be optimized for Microsoft field sellers and include:

1. ELEVATOR PITCH (30 seconds)
- What it is
- Who it's for
- Why it matters

2. CUSTOMER PAIN POINTS
- Alert fatigue (10K+ alerts/day)
- Slow incident response
- Compliance complexity
- Skills shortage

3. OUTPOST ZERO SOLUTION
- AI threat detection (97% accuracy)
- Automated response (SOAR)
- Compliance automation
- Native Azure integration

4. AZURE VALUE PROPOSITION
- Deploys in 15 minutes on Azure
- Integrates with Sentinel, AD, Monitor
- Drives $25K+ Azure consumption per customer
- Makes Azure security investment 10x more effective

5. IDEAL CUSTOMER PROFILE
- 500-5,000 employees
- Heavy Azure users (50%+ workloads)
- Existing Sentinel customers
- Regulated industries

6. DISCOVERY QUESTIONS
- "How many security alerts does your team process daily?"
- "What's your mean time to respond to incidents?"
- "What percentage of workloads are on Azure?"
- "When's your next compliance audit?"

7. OBJECTION HANDLING
- "We already have Sentinel" → Response
- "Too expensive" → ROI calculator
- "Evaluating competitors" → Differentiation

8. NEXT STEPS
- Schedule technical demo
- Provide ROI analysis
- Connect with reference customers

Make it concise, actionable, and sales-focused. Use bullet points and short paragraphs.`,
        response_json_schema: null
      });

      setBrief(response);
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate brief. Please try again.');
    }
    setIsGenerating(false);
  };

  const copyBrief = () => {
    navigator.clipboard.writeText(brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadBrief = () => {
    const blob = new Blob([brief], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Outpost-Zero-CoSell-Brief-${Date.now()}.txt`;
    a.click();
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              AI Co-Sell Brief Generator
            </CardTitle>
            <p className="text-gray-400 text-sm mt-1">
              Generate customized solution briefs for Microsoft sellers
            </p>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
            GPT-4 Powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {!brief ? (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">
              Ready to Generate Your Co-Sell Brief
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              AI will create a comprehensive solution brief optimized for Microsoft field sellers, including elevator pitch, discovery questions, and objection handling.
            </p>
            <Button 
              onClick={generateBrief}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Brief...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Co-Sell Brief
                </>
              )}
            </Button>
            <p className="text-gray-500 text-xs mt-4">
              Generation takes ~30 seconds
            </p>
          </div>
        ) : (
          <div>
            <div className="flex gap-2 mb-4">
              <Button 
                onClick={copyBrief}
                variant="outline"
                className="border-gray-600"
              >
                {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button 
                onClick={downloadBrief}
                variant="outline"
                className="border-gray-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                onClick={() => setBrief('')}
                variant="outline"
                className="border-gray-600 ml-auto"
              >
                Generate New
              </Button>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
              <pre className="text-gray-300 whitespace-pre-wrap text-sm font-mono leading-relaxed">
                {brief}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}