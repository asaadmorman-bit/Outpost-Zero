import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Users, Target, Award, X } from "lucide-react";

export default function ActiveExercise({ exercise, onExit }) {
  const [timeRemaining, setTimeRemaining] = useState(exercise.duration_minutes * 60);
  const [currentPhase, setCurrentPhase] = useState("briefing");
  const [score, setScore] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const mockScenarioEvents = [
    { time: "09:00", event: "Initial alert: Suspicious network activity detected", severity: "medium" },
    { time: "09:15", event: "Multiple endpoints showing signs of ransomware encryption", severity: "high" },
    { time: "09:30", event: "Ransom note discovered on executive workstations", severity: "critical" },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-400" />
              {exercise.title}
            </h1>
            <Badge className="mt-2 bg-green-500/20 text-green-400">Exercise Active</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-400">{formatTime(timeRemaining)}</div>
              <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Time Remaining</div>
            </div>
            <Button variant="outline" onClick={onExit} className="border-gray-700 text-gray-300">
              <X className="w-4 h-4 mr-2" />
              Exit Exercise
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">Scenario Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockScenarioEvents.map((event, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-gray-900/30 rounded">
                      <div className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-white font-medium">{event.time}</span>
                          <Badge className={`text-xs ${
                            event.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            event.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {event.severity}
                          </Badge>
                        </div>
                        <p className="text-gray-300">{event.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">Response Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700">
                    <span className="font-medium">Isolate Affected Systems</span>
                    <span className="text-xs opacity-75">Network Containment</span>
                  </Button>
                  <Button className="h-20 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700">
                    <span className="font-medium">Activate IR Team</span>
                    <span className="text-xs opacity-75">Escalate to Leadership</span>
                  </Button>
                  <Button className="h-20 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700">
                    <span className="font-medium">Backup Verification</span>
                    <span className="text-xs opacity-75">Check Recovery Options</span>
                  </Button>
                  <Button className="h-20 flex flex-col items-center justify-center bg-orange-600 hover:bg-orange-700">
                    <span className="font-medium">External Communication</span>
                    <span className="text-xs opacity-75">Law Enforcement & PR</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Exercise Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400">{score}</div>
                  <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Points Earned</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Security Analyst</span>
                    <Badge variant="outline" className="text-green-400 border-green-400/50">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">IT Manager</span>
                    <Badge variant="outline" className="text-green-400 border-green-400/50">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">CISO</span>
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">Observing</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">Exercise Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Identify ransomware indicators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Execute containment procedures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Coordinate response team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Make critical decisions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}