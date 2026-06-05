
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  Award,
  Clock,
  PlayCircle,
  CheckCircle,
  Brain,
  Flame,
  BookOpen,
  Zap
} from 'lucide-react';
import { UserTrainingProfile, TrainingRecommendation, TrainingContent } from '@/entities/all';
import { base44 } from '@/api/base44Client';

export default function PersonalizedDashboard({ user, trainingContent, onStartContent, onTakeAssessment }) {
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const profiles = await UserTrainingProfile.filter({ user_email: user.email });
      
      if (profiles.length === 0) {
        // Create initial profile
        const newProfile = await UserTrainingProfile.create({
          user_email: user.email,
          role: 'beginner',
          experience_level: 'beginner',
          skill_scores: {},
          completed_content: [],
          in_progress_content: [],
          learning_preferences: {
            preferred_format: 'video',
            pace: 'moderate',
            difficulty_preference: 'comfortable'
          },
          adaptive_difficulty: {
            current_level: 1,
            performance_trend: 'stable',
            adjustment_needed: false
          },
          total_learning_hours: 0,
          streak_days: 0
        });
        setProfile(newProfile);
      } else {
        setProfile(profiles[0]);
        await loadRecommendations(profiles[0]);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
    setIsLoading(false);
  };

  const loadRecommendations = async (userProfile) => {
    try {
      const recs = await TrainingRecommendation.filter({ 
        user_email: user.email,
        status: 'pending'
      });
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    
    try {
      // Use passed trainingContent or fetch all
      const allContent = trainingContent && trainingContent.length > 0 ? 
        trainingContent : await TrainingContent.list();
      
      // Use AI to generate personalized recommendations
      const prompt = `Analyze this user's training profile and recommend the best 5 training modules:

User Profile:
- Role: ${profile.role}
- Experience Level: ${profile.experience_level}
- Skill Scores: ${JSON.stringify(profile.skill_scores || {})}
- Completed Content: ${profile.completed_content?.length || 0} modules
- Learning Preference: ${profile.learning_preferences?.preferred_format || 'video'}
- Difficulty Preference: ${profile.learning_preferences?.difficulty_preference || 'comfortable'}

Available Content:
${allContent.slice(0, 10).map(c => `- ${c.title} (${c.use_case}, ${c.difficulty_level})`).join('\n')}

For each recommendation, provide:
1. Content title (must match one of the available titles above)
2. Specific reason why it's recommended
3. Skills it will improve
4. Priority (high/medium/low)
5. Estimated impact score (0-100)`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  content_title: { type: "string" },
                  reason: { type: "string" },
                  skills: {
                    type: "array",
                    items: { type: "string" }
                  },
                  priority: { type: "string" },
                  impact_score: { type: "number" }
                }
              }
            }
          }
        }
      });

      // Save recommendations
      const newRecs = [];
      for (const rec of aiResponse.recommendations || []) {
        const matchingContent = allContent.find(c => 
          c.title.toLowerCase().includes(rec.content_title.toLowerCase().substring(0, 10))
        );
        
        if (matchingContent) {
          const recommendation = await TrainingRecommendation.create({
            recommendation_id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            user_email: user.email,
            content_id: matchingContent.content_id,
            content_title: matchingContent.title,
            content_type: matchingContent.content_type,
            recommendation_reason: rec.reason,
            relevance_score: rec.impact_score || 80,
            priority: rec.priority || 'medium',
            skill_alignment: rec.skills || [],
            estimated_impact: {
              skill_improvement: rec.impact_score || 15,
              gap_closure: rec.impact_score || 20
            },
            prerequisites_met: true,
            ai_generated: true,
            status: 'pending',
            generated_date: new Date().toISOString()
          });
          newRecs.push(recommendation);
        }
      }

      setRecommendations(newRecs);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
    
    setIsGenerating(false);
  };

  if (isLoading) {
    return (
      <Card className="border-gray-700 bg-gray-800/50">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your personalized training dashboard...</p>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="border-gray-700 bg-gray-800/50">
        <CardContent className="pt-12 pb-12 text-center">
          <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-white text-xl font-bold mb-2">Welcome to Personalized Training!</h3>
          <p className="text-gray-400 mb-6">Let's assess your skills and create a custom learning path</p>
          <Button onClick={onTakeAssessment} className="bg-purple-600 hover:bg-purple-700">
            Take Initial Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  const overallProgress = profile.skill_scores ? 
    Object.values(profile.skill_scores).reduce((a, b) => a + b, 0) / Object.keys(profile.skill_scores).length : 0;

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-gray-700 bg-gradient-to-br from-blue-900/30 to-blue-800/20">
          <CardContent className="pt-6">
            <Target className="w-8 h-8 text-blue-400 mb-2" />
            <div className="text-2xl font-bold text-white">{Math.round(overallProgress)}%</div>
            <div className="text-sm text-blue-300">Overall Progress</div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gradient-to-br from-green-900/30 to-green-800/20">
          <CardContent className="pt-6">
            <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
            <div className="text-2xl font-bold text-white">{profile.completed_content?.length || 0}</div>
            <div className="text-sm text-green-300">Completed Modules</div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gradient-to-br from-orange-900/30 to-orange-800/20">
          <CardContent className="pt-6">
            <Flame className="w-8 h-8 text-orange-400 mb-2" />
            <div className="text-2xl font-bold text-white">{profile.streak_days || 0}</div>
            <div className="text-sm text-orange-300">Day Streak</div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gradient-to-br from-purple-900/30 to-purple-800/20">
          <CardContent className="pt-6">
            <Clock className="w-8 h-8 text-purple-400 mb-2" />
            <div className="text-2xl font-bold text-white">{Math.round(profile.total_learning_hours || 0)}h</div>
            <div className="text-sm text-purple-300">Learning Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Breakdown */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Your Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(profile.skill_scores || {}).map(([skill, score]) => (
            <div key={skill}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 capitalize">{skill.replace(/_/g, ' ')}</span>
                <Badge className={score >= 70 ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}>
                  {Math.round(score)}%
                </Badge>
              </div>
              <Progress value={score} className="h-2" />
            </div>
          ))}
          
          {Object.keys(profile.skill_scores || {}).length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">Take assessments to track your skills</p>
              <Button onClick={onTakeAssessment} variant="outline" className="border-gray-600 text-gray-300">
                Start Assessment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="border-purple-700 bg-purple-900/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              AI-Powered Recommendations
            </CardTitle>
            <Button 
              onClick={generateRecommendations}
              disabled={isGenerating}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? 'Generating...' : 'Refresh Recommendations'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">Generate personalized recommendations based on your profile</p>
              <Button 
                onClick={generateRecommendations}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Generate Recommendations
              </Button>
            </div>
          ) : (
            recommendations.map((rec, idx) => (
              <Card key={idx} className="border-gray-700 bg-gray-900/50">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={
                          rec.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                          rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-blue-500/20 text-blue-300'
                        }>
                          {rec.priority} priority
                        </Badge>
                        <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                          {rec.relevance_score}% match
                        </Badge>
                      </div>
                      <h4 className="text-white font-medium mb-1">{rec.content_title}</h4>
                      <p className="text-gray-400 text-sm mb-2">{rec.recommendation_reason}</p>
                      {rec.skill_alignment && rec.skill_alignment.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {rec.skill_alignment.map((skill, sidx) => (
                            <Badge key={sidx} variant="outline" className="border-purple-600 text-purple-300 text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => onStartContent(rec.content_id)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 ml-3"
                    >
                      <PlayCircle className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Current Learning Path */}
      {profile.recommended_pathway && (
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Your Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Current Focus:</span>
                <Badge className="bg-blue-500/20 text-blue-300">
                  {profile.recommended_pathway.current_focus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Estimated Completion:</span>
                <span className="text-white font-medium">
                  {profile.recommended_pathway.estimated_completion_weeks} weeks
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
