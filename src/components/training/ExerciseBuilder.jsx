import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Save, X } from "lucide-react";

export default function ExerciseBuilder({ onSave, onCancel }) {
  const [exercise, setExercise] = useState({
    title: "",
    description: "",
    theme: "ransomware",
    difficulty_level: "intermediate",
    duration_minutes: 60,
    participants: [],
    instructor: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExercise = {
      ...exercise,
      exercise_id: `TTE-${Date.now()}`,
      status: "draft"
    };
    onSave(newExercise);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-4xl mx-auto">
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-400" />
              Create Tabletop Exercise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Exercise Title</label>
                  <Input
                    value={exercise.title}
                    onChange={(e) => setExercise({...exercise, title: e.target.value})}
                    placeholder="e.g., Ransomware Response Drill"
                    className="bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Instructor Email</label>
                  <Input
                    value={exercise.instructor}
                    onChange={(e) => setExercise({...exercise, instructor: e.target.value})}
                    placeholder="instructor@company.com"
                    type="email"
                    className="bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <Textarea
                  value={exercise.description}
                  onChange={(e) => setExercise({...exercise, description: e.target.value})}
                  placeholder="Describe the exercise scenario and objectives..."
                  className="bg-gray-900 border-gray-700 text-white h-24"
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Theme</label>
                  <Select value={exercise.theme} onValueChange={(value) => setExercise({...exercise, theme: value})}>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ransomware">Ransomware</SelectItem>
                      <SelectItem value="apt_campaign">APT Campaign</SelectItem>
                      <SelectItem value="insider_threat">Insider Threat</SelectItem>
                      <SelectItem value="supply_chain">Supply Chain Attack</SelectItem>
                      <SelectItem value="cloud_breach">Cloud Breach</SelectItem>
                      <SelectItem value="phishing">Phishing Campaign</SelectItem>
                      <SelectItem value="ddos">DDoS Attack</SelectItem>
                      <SelectItem value="data_exfiltration">Data Exfiltration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Difficulty</label>
                  <Select value={exercise.difficulty_level} onValueChange={(value) => setExercise({...exercise, difficulty_level: value})}>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={exercise.duration_minutes}
                    onChange={(e) => setExercise({...exercise, duration_minutes: parseInt(e.target.value)})}
                    className="bg-gray-900 border-gray-700 text-white"
                    min="15"
                    max="480"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Create Exercise
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} className="border-gray-700 text-gray-300">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}