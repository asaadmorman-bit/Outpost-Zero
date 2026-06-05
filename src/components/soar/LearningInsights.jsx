import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, XCircle, Clock, TrendingUp, Users, Lightbulb } from 'lucide-react';

const impactColors = {
  low: "bg-green-500/20 text-green-300 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  high: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  critical: "bg-red-500/20 text-red-300 border-red-500/30"
};

const effortColors = {
  low: "bg-green-500/20 text-green-300 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  high: "bg-red-500/20 text-red-300 border-red-500/30"
};

export default function LearningInsights({ insights }) {
  const [selectedInsight, setSelectedInsight] = useState(null);

  const handleInsightAction = (insight, action) => {
    const actions = {
      approve: `✅ INSIGHT APPROVED\n\nInsight: ${insight.insight_summary}\n\nIn production, this would:\n• Mark insight as approved\n• Create implementation task\n• Notify relevant team members\n• Schedule playbook updates\n• Track implementation progress`,
      reject: `❌ INSIGHT REJECTED\n\nInsight: ${insight.insight_summary}\n\nIn production, this would:\n• Mark insight as rejected\n• Log rejection reason\n• Provide feedback to AI learning model\n• Archive for future reference`,
      implement: `🚀 IMPLEMENTING INSIGHT\n\nInsight: ${insight.insight_summary}\nAction: ${insight.recommended_action}\n\nIn production, this would:\n• Auto-update relevant playbooks\n• Create new automation rules\n• Schedule testing phase\n• Document changes\n• Monitor effectiveness`
    };
    
    alert(actions[action]);
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'workflow_optimization': return TrendingUp;
      case 'pattern_recognition': return Brain;
      case 'security_improvement': return CheckCircle;
      case 'training_recommendation': return Users;
      default: return Lightbulb;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
            <Brain className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
            AI Learning Insights
          </CardTitle>
          <p className="text-gray-400 text-xs md:text-sm">System-generated improvements based on your team's activities</p>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
          {insights.map(insight => {
            const IconComponent = getInsightIcon(insight.insight_type);
            return (
              <Card 
                key={insight.insight_id} 
                className={`border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all cursor-pointer ${selectedInsight?.insight_id === insight.insight_id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedInsight(insight)}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex items-start gap-2 md:gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-purple-500/10 flex-shrink-0">
                        <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm md:text-lg mb-1">
                          {insight.insight_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        <p className="text-gray-300 text-xs md:text-sm leading-relaxed">{insight.insight_summary}</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs w-fit">
                      {insight.confidence_score}% confident
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="truncate">{insight.team_member.split('@')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="truncate">{insight.source_activity}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className={`${impactColors[insight.impact_assessment]} text-xs`}>
                      {insight.impact_assessment} impact
                    </Badge>
                    <Badge variant="outline" className={`${effortColors[insight.implementation_effort]} text-xs`}>
                      {insight.implementation_effort} effort
                    </Badge>
                  </div>

                  {insight.status === 'new' && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-green-600/20 border-green-500/50 text-green-300 hover:bg-green-600/30 flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInsightAction(insight, 'approve');
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/30 flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInsightAction(insight, 'reject');
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="lg:block">
          {selectedInsight ? (
            <Card className="border-gray-700 bg-gray-800/50 lg:sticky lg:top-4">
              <CardHeader>
                <CardTitle className="text-white text-base md:text-lg">Implementation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2 text-sm md:text-base">Recommended Action</h4>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                    {selectedInsight.recommended_action}
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2 text-sm md:text-base">Expected Benefits</h4>
                  <ul className="text-gray-300 text-xs md:text-sm space-y-1">
                    <li>• Improved automation efficiency</li>
                    <li>• Reduced manual intervention</li>
                    <li>• Enhanced threat detection</li>
                    <li>• Better team productivity</li>
                  </ul>
                </div>

                {selectedInsight.status === 'approved' && (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
                    onClick={() => handleInsightAction(selectedInsight, 'implement')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Implement Now
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-gray-700 bg-gray-800/50 hidden lg:block">
              <CardContent className="p-6 text-center">
                <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">Select an Insight</h3>
                <p className="text-gray-400 text-sm">
                  Click on an insight to view implementation details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}