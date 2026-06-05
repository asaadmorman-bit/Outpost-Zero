import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, CheckCircle, AlertTriangle, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function MarketplaceOptimizer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const analyzeMarketplace = async () => {
    setIsAnalyzing(true);
    try {
      // Simulated marketplace data - in production, fetch from Partner Center API
      const marketplaceData = {
        pageViews: 1247,
        trialStarts: 38,
        conversions: 12,
        avgRating: 4.3,
        reviewCount: 13,
        lastUpdated: new Date().toISOString()
      };

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this Azure Marketplace listing performance and provide actionable recommendations:

CURRENT METRICS:
- Page Views (monthly): ${marketplaceData.pageViews}
- Trial Starts: ${marketplaceData.trialStarts}
- Trial → Paid Conversion: ${((marketplaceData.conversions / marketplaceData.trialStarts) * 100).toFixed(1)}%
- Average Rating: ${marketplaceData.avgRating}/5
- Review Count: ${marketplaceData.reviewCount}

INDUSTRY BENCHMARKS:
- Good page views: 2,000+/month
- Good conversion rate: 25%+
- Good rating: 4.5+/5
- Good review count: 15+

Provide analysis in this format:

1. OVERALL HEALTH SCORE (out of 100)

2. STRENGTHS (what's working well)
- Bullet point format
- Be specific

3. AREAS FOR IMPROVEMENT (prioritized)
- High priority items first
- Include impact estimate
- Be actionable

4. QUICK WINS (things they can do today)
- Specific actions
- Expected impact

5. 30-DAY ACTION PLAN
- Week-by-week breakdown
- Concrete tasks

Make it actionable and specific to their numbers.`,
        response_json_schema: null
      });

      setAnalysis(response);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze marketplace. Please try again.');
    }
    setIsAnalyzing(false);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <LineChart className="w-6 h-6 text-blue-400" />
              AI Marketplace Optimizer
            </CardTitle>
            <p className="text-gray-400 text-sm mt-1">
              Get AI-powered insights to improve your Azure Marketplace performance
            </p>
          </div>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
            GPT-4 Powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {!analysis ? (
          <div className="text-center py-12">
            <LineChart className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">
              Optimize Your Marketplace Listing
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              AI will analyze your listing performance against industry benchmarks and provide specific, actionable recommendations to increase conversions and revenue.
            </p>
            <Button 
              onClick={analyzeMarketplace}
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze Marketplace
                </>
              )}
            </Button>
            <p className="text-gray-500 text-xs mt-4">
              Analysis takes ~20 seconds
            </p>
          </div>
        ) : (
          <div>
            <div className="flex gap-2 mb-4">
              <Button 
                onClick={() => setAnalysis(null)}
                variant="outline"
                className="border-gray-600"
              >
                Analyze Again
              </Button>
            </div>
            <div className="space-y-4">
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-200">
                  <strong>Analysis Complete:</strong> AI has reviewed your marketplace performance and generated recommendations.
                </AlertDescription>
              </Alert>
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                  {analysis}
                </pre>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}