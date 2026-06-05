import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, Target, Play } from "lucide-react";

const themeColors = {
  ransomware: "bg-red-500/20 text-red-400",
  apt_campaign: "bg-purple-500/20 text-purple-400",
  insider_threat: "bg-orange-500/20 text-orange-400",
  supply_chain: "bg-yellow-500/20 text-yellow-400",
  cloud_breach: "bg-blue-500/20 text-blue-400",
  phishing: "bg-green-500/20 text-green-400",
  ddos: "bg-gray-500/20 text-gray-400",
  data_exfiltration: "bg-pink-500/20 text-pink-400"
};

const difficultyColors = {
  beginner: "bg-green-500/20 text-green-400",
  intermediate: "bg-yellow-500/20 text-yellow-400",
  advanced: "bg-orange-500/20 text-orange-400",
  expert: "bg-red-500/20 text-red-400"
};

const statusColors = {
  draft: "bg-gray-500/20 text-gray-400",
  scheduled: "bg-blue-500/20 text-blue-400",
  active: "bg-green-500/20 text-green-400",
  completed: "bg-purple-500/20 text-purple-400",
  cancelled: "bg-red-500/20 text-red-400"
};

export default function ExerciseCard({ exercise, onStart }) {
  return (
    <Card className="border-gray-700 bg-gray-800/50 flex flex-col">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          {exercise.title}
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Badge className={themeColors[exercise.theme]}>
            {exercise.theme.replace('_', ' ')}
          </Badge>
          <Badge className={difficultyColors[exercise.difficulty_level]}>
            {exercise.difficulty_level}
          </Badge>
          <Badge className={statusColors[exercise.status]}>
            {exercise.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-gray-400 text-sm mb-4 flex-1">{exercise.description}</p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm" style={{color: 'var(--text-secondary)'}}>
            <Clock className="w-4 h-4" />
            <span>{exercise.duration_minutes} minutes</span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{color: 'var(--text-secondary)'}}>
            <Users className="w-4 h-4" />
            <span>{exercise.participants?.length || 0} participants</span>
          </div>
        </div>

        <Button 
          onClick={() => onStart(exercise)}
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={exercise.status === 'cancelled'}
        >
          <Play className="w-4 h-4 mr-2" />
          {exercise.status === 'active' ? 'Join Exercise' : 'Start Exercise'}
        </Button>
      </CardContent>
    </Card>
  );
}