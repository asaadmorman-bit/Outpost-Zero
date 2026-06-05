import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle } from 'lucide-react';

const videos = [
  { title: "Building Your First SOAR Playbook", use_case: "Automation", difficulty: "Intermediate", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { title: "Integrating with Jira for Ticketing", use_case: "Integrations", difficulty: "Beginner", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { title: "Advanced Threat Hunting with CSQL", use_case: "Threat Hunting", difficulty: "Advanced", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { title: "Setting Up Your First Dashboard", use_case: "Reporting", difficulty: "Beginner", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { title: "Responding to a Ransomware Incident", use_case: "Incident Response", difficulty: "Intermediate", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { title: "Installing the Linux Agent", use_case: "Installation", difficulty: "Beginner", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
];

const VideoCard = ({ video }) => (
    <Card className="border-gray-700 bg-gray-800/50 flex flex-col">
        <div className="aspect-video rounded-t-lg overflow-hidden">
            <iframe
                className="w-full h-full"
                src={video.url}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
            </iframe>
        </div>
        <CardHeader>
            <CardTitle className="text-white">{video.title}</CardTitle>
        </CardHeader>
        <CardContent>
             <div className="flex gap-2">
                <Badge variant="secondary">{video.use_case}</Badge>
                <Badge variant="outline" className="text-cyan-300 border-cyan-300/50">{video.difficulty}</Badge>
            </div>
        </CardContent>
    </Card>
);

export default function VideoLibrary() {
    return (
        <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-red-400" />
                    Video Training Library
                </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(video => <VideoCard key={video.title} video={video} />)}
            </CardContent>
        </Card>
    );
}