import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Brain,
  TrendingUp,
  AlertCircle,
  Award
} from 'lucide-react';
import { SkillAssessment as SkillAssessmentEntity, UserTrainingProfile } from '@/entities/all';
import { base44 } from '@/api/base44Client';

export default function SkillAssessment({ skillArea, onComplete, user }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState({});
  const [startTime, setStartTime] = useState(Date.now());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  // AI-generated adaptive questions
  const [questions, setQuestions] = useState([
    {
      question_id: 'q1',
      question_text: 'What is the first step in the incident response lifecycle?',
      question_type: 'multiple_choice',
      difficulty: 'beginner',
      options: [
        'Preparation',
        'Detection and Analysis',
        'Containment',
        'Recovery'
      ],
      correct_answer: 'Preparation'
    },
    {
      question_id: 'q2',
      question_text: 'Which MITRE ATT&CK tactic involves an adversary trying to avoid detection?',
      question_type: 'multiple_choice',
      difficulty: 'intermediate',
      options: [
        'Initial Access',
        'Defense Evasion',
        'Lateral Movement',
        'Command and Control'
      ],
      correct_answer: 'Defense Evasion'
    },
    {
      question_id: 'q3',
      question_text: 'A user reports receiving a suspicious email with an attachment. What should be your immediate first action?',
      question_type: 'scenario',
      difficulty: 'intermediate',
      options: [
        'Open the attachment to verify',
        'Isolate the user\'s computer from the network',
        'Delete the email immediately',
        'Analyze email headers and scan attachment in sandbox'
      ],
      correct_answer: 'Analyze email headers and scan attachment in sandbox'
    },
    {
      question_id: 'q4',
      question_text: 'What is the primary purpose of a SOAR platform?',
      question_type: 'multiple_choice',
      difficulty: 'intermediate',
      options: [
        'Replace security analysts',
        'Orchestrate and automate response workflows',
        'Detect all threats automatically',
        'Store security logs'
      ],
      correct_answer: 'Orchestrate and automate response workflows'
    },
    {
      question_id: 'q5',
      question_text: 'You observe unusual outbound traffic to multiple IPs on port 443. Which tool would you use first?',
      question_type: 'scenario',
      difficulty: 'advanced',
      options: [
        'Firewall logs to identify source',
        'EDR to check process responsible',
        'Threat intelligence feeds to check IPs',
        'All of the above in parallel'
      ],
      correct_answer: 'All of the above in parallel'
    }
  ]);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestion]);

  const handleAnswer = (answer) => {
    const questionTime = Math.floor((Date.now() - startTime) / 1000);
    
    setAnswers({
      ...answers,
      [questions[currentQuestion].question_id]: answer
    });
    
    setTimeSpent({
      ...timeSpent,
      [questions[currentQuestion].question_id]: questionTime
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeAssessment(answer, questionTime);
    }
  };

  const completeAssessment = async (finalAnswer, finalTime) => {
    setIsAnalyzing(true);

    // Calculate scores
    const finalAnswers = {
      ...answers,
      [questions[currentQuestion].question_id]: finalAnswer
    };

    const finalTimeSpent = {
      ...timeSpent,
      [questions[currentQuestion].question_id]: finalTime
    };

    let correctCount = 0;
    const answeredQuestions = questions.map(q => {
      const userAnswer = finalAnswers[q.question_id];
      const isCorrect = userAnswer === q.correct_answer;
      if (isCorrect) correctCount++;
      
      return {
        ...q,
        user_answer: userAnswer,
        is_correct: isCorrect,
        time_spent_seconds: finalTimeSpent[q.question_id]
      };
    });

    const overallScore = Math.round((correctCount / questions.length) * 100);

    // AI Analysis
    const analysisPrompt = `Analyze this security training assessment:
    
Skill Area: ${skillArea}
Overall Score: ${overallScore}%
Questions Answered: ${answeredQuestions.length}

Performance Breakdown:
${answeredQuestions.map((q, idx) => 
  `Q${idx + 1} (${q.difficulty}): ${q.is_correct ? 'Correct' : 'Incorrect'} - Time: ${q.time_spent_seconds}s`
).join('\n')}

Based on this performance:
1. Identify 3 key knowledge gaps
2. Identify 2 strengths
3. Recommend appropriate training level (beginner/intermediate/advanced)
4. Provide 3 specific training recommendations
5. Give personalized feedback`;

    try {
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: analysisPrompt,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            knowledge_gaps: {
              type: "array",
              items: { type: "string" }
            },
            strengths: {
              type: "array",
              items: { type: "string" }
            },
            recommended_level: {
              type: "string"
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            },
            feedback: {
              type: "string"
            }
          }
        }
      });

      // Save assessment
      const assessment = await SkillAssessmentEntity.create({
        assessment_id: `assess_${Date.now()}`,
        user_email: user.email,
        skill_area: skillArea,
        assessment_type: 'initial',
        questions: answeredQuestions,
        overall_score: overallScore,
        knowledge_gaps: aiResponse.knowledge_gaps || [],
        strengths: aiResponse.strengths || [],
        recommended_level: aiResponse.recommended_level || 'intermediate',
        completion_time_minutes: Math.round(Object.values(finalTimeSpent).reduce((a, b) => a + b, 0) / 60),
        status: 'completed',
        ai_analysis: aiResponse.feedback || '',
        personalized_recommendations: aiResponse.recommendations || []
      });

      // Update user profile
      const profiles = await UserTrainingProfile.filter({ user_email: user.email });
      if (profiles.length > 0) {
        const profile = profiles[0];
        await UserTrainingProfile.update(profile.id, {
          skill_scores: {
            ...profile.skill_scores,
            [skillArea]: overallScore
          },
          experience_level: aiResponse.recommended_level || profile.experience_level,
          assessment_history: [
            ...(profile.assessment_history || []),
            {
              assessment_id: assessment.assessment_id,
              date: new Date().toISOString(),
              score: overallScore,
              skill_area: skillArea
            }
          ]
        });
      }

      setResults({
        score: overallScore,
        analysis: aiResponse,
        questions: answeredQuestions
      });

    } catch (error) {
      console.error('Error analyzing assessment:', error);
      setResults({
        score: overallScore,
        analysis: {
          knowledge_gaps: ['Unable to generate detailed analysis'],
          strengths: ['Completed assessment'],
          recommended_level: overallScore >= 70 ? 'intermediate' : 'beginner',
          recommendations: ['Review incident response fundamentals'],
          feedback: 'Assessment completed. Review your answers and continue learning.'
        },
        questions: answeredQuestions
      });
    }

    setIsAnalyzing(false);
  };

  if (results) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-400" />
              Assessment Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/30">
              <div className="text-6xl font-bold text-white mb-2">{results.score}%</div>
              <div className="text-gray-300 text-lg">Overall Score</div>
              <Badge className={`mt-3 ${
                results.score >= 80 ? 'bg-green-500/20 text-green-300' :
                results.score >= 60 ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {results.analysis.recommended_level?.toUpperCase() || 'INTERMEDIATE'} LEVEL
              </Badge>
            </div>

            {/* AI Feedback */}
            <Card className="border-purple-700 bg-purple-900/20">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{results.analysis.feedback}</p>
              </CardContent>
            </Card>

            {/* Strengths & Gaps */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-green-700 bg-green-900/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Your Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.analysis.strengths?.map((strength, idx) => (
                      <li key={idx} className="text-green-300 text-sm flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-700 bg-orange-900/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-400" />
                    Areas to Improve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.analysis.knowledge_gaps?.map((gap, idx) => (
                      <li key={idx} className="text-orange-300 text-sm flex items-start gap-2">
                        <span className="text-orange-400 mt-1">•</span>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="border-blue-700 bg-blue-900/20">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  Personalized Training Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.analysis.recommendations?.map((rec, idx) => (
                    <li key={idx} className="text-blue-300 text-sm flex items-start gap-2">
                      <span className="text-blue-400 font-bold mt-1">{idx + 1}.</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                onClick={() => onComplete(results)}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                View Personalized Training Plan
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <Card className="border-gray-700 bg-gray-800/50 max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-12 text-center">
          <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
          <h3 className="text-white text-xl font-bold mb-2">Analyzing Your Performance...</h3>
          <p className="text-gray-400 mb-6">Our AI is generating personalized insights and recommendations</p>
          <Progress value={66} className="max-w-xs mx-auto" />
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-white">
              {skillArea.replace(/_/g, ' ').toUpperCase()} Assessment
            </CardTitle>
            <Badge className="bg-purple-500/20 text-purple-300">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question */}
          <div>
            <div className="flex items-start gap-3 mb-4">
              <Badge variant="outline" className={`border-${
                currentQ.difficulty === 'beginner' ? 'blue' :
                currentQ.difficulty === 'intermediate' ? 'yellow' : 'red'
              }-500 text-${
                currentQ.difficulty === 'beginner' ? 'blue' :
                currentQ.difficulty === 'intermediate' ? 'yellow' : 'red'
              }-300`}>
                {currentQ.difficulty}
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-400">
                {currentQ.question_type.replace(/_/g, ' ')}
              </Badge>
            </div>
            
            <h3 className="text-white text-xl mb-6">{currentQ.question_text}</h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="w-full p-4 text-left rounded-lg border border-gray-700 bg-gray-900/50 hover:bg-gray-800 hover:border-blue-500 transition-all text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <Clock className="w-4 h-4" />
            <span>Time: {Math.floor((Date.now() - startTime) / 1000)}s</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}