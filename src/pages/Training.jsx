
import React, { useState, useEffect } from "react";
import { TabletopExercise, TrainingContent } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Users, Clock, Target, Award, Wand2, Video, CheckCircle } from "lucide-react";
import ExerciseCard from "../components/training/ExerciseCard";
import ExerciseBuilder from "../components/training/ExerciseBuilder";
import ActiveExercise from "../components/training/ActiveExercise";
import AIVideoGenerator from "../components/training/AIVideoGenerator";
import VideoOrchestrator from '../components/training/VideoOrchestrator';
import VideoPlayer from '../components/training/VideoPlayer';
import PersonalizedDashboard from '../components/training/PersonalizedDashboard';
import SkillAssessment from '../components/training/SkillAssessment';
import { User } from '@/entities/User';

export default function TrainingPage() {
  const [exercises, setExercises] = useState([]);
  const [trainingContent, setTrainingContent] = useState([]);
  const [activeExercise, setActiveExercise] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [showPersonalized, setShowPersonalized] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentSkill, setAssessmentSkill] = useState('incident_response');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadTrainingData();
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading user:', error);
      // Potentially set a mock user or handle anonymous state
    }
  };

  const loadTrainingData = async () => {
    setIsLoading(true);
    try {
      const [exerciseData, contentData] = await Promise.all([
        TabletopExercise.list("-created_date"),
        TrainingContent.list("-created_date")
      ]);
      
      setExercises(exerciseData.length > 0 ? exerciseData : mockExercises);
      // Only show generated videos, no mock data
      setTrainingContent(contentData);
    } catch (error) {
      console.error("Error loading training data:", error);
      setExercises(mockExercises);
      setTrainingContent([]);
    }
    setIsLoading(false);
  };

  const handleAIVideoCreated = async (videoContent) => {
    // Reload all data to get fresh list from database
    await loadTrainingData();
    setShowAIGenerator(false);
  };

  const mockExercises = [
    {
      id: "ex_001",
      exercise_id: "TTE-2024-001",
      title: "Advanced Persistent Threat Response",
      description: "A sophisticated APT group has infiltrated your network. Practice detection, containment, and eradication.",
      theme: "apt_campaign",
      difficulty_level: "advanced",
      participants: [],
      instructor: "security.lead@company.com",
      status: "draft",
      duration_minutes: 120
    },
    {
      id: "ex_002",
      exercise_id: "TTE-2024-002", 
      title: "Ransomware Incident Simulation",
      description: "Your organization has been hit by ransomware. Navigate the crisis management process.",
      theme: "ransomware",
      difficulty_level: "intermediate",
      participants: [],
      instructor: "incident.manager@company.com",
      status: "scheduled",
      duration_minutes: 90
    }
  ];

  const handleStartAssessment = (skillArea) => {
    setAssessmentSkill(skillArea);
    setShowAssessment(true);
    setShowPersonalized(false);
  };

  const handleAssessmentComplete = (results) => {
    setShowAssessment(false);
    setShowPersonalized(true);
    loadUser(); // Reload user to get updated profile with assessment results
  };

  const handleStartContentFromRec = (contentId) => {
    const content = trainingContent.find(c => c.content_id === contentId);
    if (content) {
      setPlayingVideo(content);
    }
  };

  if (activeExercise) {
    return <ActiveExercise exercise={activeExercise} onExit={() => setActiveExercise(null)} />;
  }

  if (showBuilder) {
    return <ExerciseBuilder onSave={(exercise) => { console.log("Saving exercise:", exercise); setShowBuilder(false); }} onCancel={() => setShowBuilder(false)} />;
  }

  if (showAIGenerator) {
    return (
      <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => setShowAIGenerator(false)} className="border-gray-700 text-gray-300">
              ← Back to Training
            </Button>
            <h1 className="text-2xl font-bold text-white">AI Training Video Generator</h1>
          </div>
          <AIVideoGenerator onVideoCreated={handleAIVideoCreated} />
        </div>
      </div>
    );
  }

  if (showAssessment && currentUser) {
    return (
      <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => setShowAssessment(false)} className="border-gray-700 text-gray-300">
              ← Back to Training
            </Button>
            <h1 className="text-2xl font-bold text-white">Skill Assessment</h1>
          </div>
          <SkillAssessment 
            skillArea={assessmentSkill}
            onComplete={handleAssessmentComplete}
            user={currentUser}
          />
        </div>
      </div>
    );
  }

  // Check if we have real generated videos
  const hasGeneratedVideos = trainingContent.length > 0;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-purple-500/10 rounded-lg">
            <Video className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Professional Video Training Center</h1>
            <p className="text-gray-300">Generate AI-powered professional training videos with interactive demos</p>
          </div>
        </div>

        <Tabs defaultValue={showPersonalized ? "personalized" : "videos"} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="personalized" onClick={() => setShowPersonalized(true)}>
              My Learning Path
            </TabsTrigger>
            <TabsTrigger value="videos">
              Video Library
              {hasGeneratedVideos && (
                <Badge className="ml-2 bg-green-500/20 text-green-300 border-green-500/50 text-xs">
                  {trainingContent.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="orchestrator">Generate Videos</TabsTrigger>
            <TabsTrigger value="ai-videos">AI Video Studio</TabsTrigger>
            <TabsTrigger value="exercises">Tabletop Exercises</TabsTrigger>
            <TabsTrigger value="analytics">Training Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="personalized" className="mt-6">
            {currentUser ? (
              <PersonalizedDashboard 
                user={currentUser}
                trainingContent={trainingContent}
                onStartContent={handleStartContentFromRec}
                onTakeAssessment={handleStartAssessment}
              />
            ) : (
              <Card className="border-gray-700 bg-gray-800/50">
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-gray-400">Loading user profile...</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            {hasGeneratedVideos ? (
              <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <h3 className="text-green-300 font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Video Library
                </h3>
                <p className="text-green-200 text-sm">
                  {trainingContent.length} professional training video(s) ready to watch. Each video features unique content, interactive dashboards, and continuous AI narration.
                </p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <h3 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Video Library - Empty
                </h3>
                <p className="text-blue-200 text-sm mb-4">
                  No videos generated yet. Use the <strong>Generate Videos</strong> or <strong>AI Video Studio</strong> tabs to create professional training content.
                </p>
                <div className="flex gap-3">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700" 
                    onClick={() => document.querySelector('[value="orchestrator"]').click()}
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Videos (Batch)
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700" 
                    onClick={() => document.querySelector('[value="ai-videos"]').click()}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    AI Video Studio (Single)
                  </Button>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <Card className="border-gray-700 bg-gray-800/50 col-span-full">
                  <CardContent className="pt-12 pb-12 text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading video library...</p>
                  </CardContent>
                </Card>
              ) : trainingContent.length === 0 ? (
                <Card className="border-gray-700 bg-gray-800/50 col-span-full">
                  <CardContent className="pt-12 pb-12 text-center">
                    <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2 text-xl">Fresh Start - No Videos Yet</h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      Your video library is empty. Generate your first professional training videos using either batch generation or the AI studio.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700" 
                        onClick={() => document.querySelector('[value="orchestrator"]').click()}
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Videos
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700" 
                        onClick={() => document.querySelector('[value="ai-videos"]').click()}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        AI Video Studio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                trainingContent.map(content => (
                  <Card key={content.content_id} className="border-gray-700 bg-gray-800/50 flex flex-col hover:border-blue-500/50 transition-colors">
                    <CardHeader>
                      <div 
                        className="aspect-video rounded-lg overflow-hidden mb-4 relative bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center cursor-pointer group"
                        onClick={() => setPlayingVideo(content)}
                      >
                        <div className="text-center p-6">
                          <PlayCircle className="w-16 h-16 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                          <p className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">
                            Click to Watch
                          </p>
                          <p className="text-gray-500 text-xs mt-1">{content.duration_minutes} minutes</p>
                        </div>
                        <div className="absolute top-2 left-2 right-2">
                          <div className="bg-green-500/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Ready to Watch
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors" />
                      </div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-blue-400" />
                        {content.title}
                      </CardTitle>
                      <div className="flex gap-2 pt-2 flex-wrap">
                        <Badge variant="secondary">{content.use_case?.replace(/_/g, ' ') || 'training'}</Badge>
                        <Badge variant="outline" className="text-cyan-300 border-cyan-300/50">
                          {content.difficulty_level}
                        </Badge>
                        <Badge variant="outline" className="text-gray-400 border-gray-400/50">
                          <Clock className="w-3 h-3 mr-1" />
                          {content.duration_minutes}m
                        </Badge>
                        {content.ai_generated && (
                          <Badge className="bg-purple-500/20 text-purple-400">
                            <Wand2 className="w-3 h-3 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-gray-300 text-sm mb-4 flex-1">{content.description}</p>
                      
                      {content.learning_objectives && (
                        <div className="mb-4">
                          <h4 className="text-white font-medium mb-2 text-sm">Learning Objectives:</h4>
                          <ul className="space-y-1">
                            {content.learning_objectives.slice(0, 2).map((objective, index) => (
                              <li key={index} className="text-gray-300 text-xs flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                {objective}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {(content.effectiveness_rating || content.completion_rate) && (
                        <div className="flex justify-between items-center text-xs text-gray-300 mb-4">
                          {content.effectiveness_rating && (
                            <div className="flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {content.effectiveness_rating}/5 rating
                            </div>
                          )}
                          {content.completion_rate && (
                            <div>{content.completion_rate}% completion</div>
                          )}
                        </div>
                      )}

                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700" 
                        onClick={() => setPlayingVideo(content)}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Watch Video
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="orchestrator" className="mt-6">
            <VideoOrchestrator onVideosGenerated={loadTrainingData} />
          </TabsContent>

          <TabsContent value="ai-videos" className="mt-6">
            <AIVideoGenerator onVideoCreated={handleAIVideoCreated} />
          </TabsContent>

          <TabsContent value="exercises" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <p className="text-white">Loading exercises...</p>
              ) : (
                exercises.map(exercise => (
                  <ExerciseCard 
                    key={exercise.id} 
                    exercise={exercise} 
                    onStart={() => setActiveExercise(exercise)}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">Training Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Player Modal */}
      {playingVideo && (
        <VideoPlayer 
          video={playingVideo} 
          onClose={() => setPlayingVideo(null)} 
        />
      )}
    </div>
  );
}
