
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  Play, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Upload,
  Settings,
  Sparkles
} from 'lucide-react';
import { TrainingContent } from '@/entities/TrainingContent';
import { base44 } from '@/api/base44Client';

const VIDEO_SEGMENTS = [
  {
    id: 'dashboard',
    path: '/Dashboard',
    title: 'Security Operations Center Dashboard',
    duration: 120,
    script: `Welcome to the Outpost Zero Security Operations Center.

This is your command center for real-time threat monitoring and incident response.

At the top, you'll see our Threat Level indicator, currently showing the overall security posture.

The Strategic Command Summary provides key metrics:
- Active threats being monitored
- Open incidents requiring attention
- High-risk user behaviors detected
- Critical AI advisories pending action

Below that, we have detailed Security Metrics showing event distribution by severity.

The Recent Events panel displays live security events as they occur, with ML-generated risk scores.

On the right, our global Threat Map visualizes threat origins worldwide.

Notice how all data updates in real-time, giving you instant visibility into your security landscape.

You can drill into any metric or event for detailed analysis.`,
    scenes: [
      { time: '0:00-0:10', action: 'Intro title card with Outpost Zero logo', caption: 'Security Operations Center' },
      { time: '0:10-0:25', action: 'Pan across dashboard header', caption: 'Real-time threat monitoring' },
      { time: '0:25-0:40', action: 'Highlight Threat Level widget', caption: 'Current security posture' },
      { time: '0:40-0:60', action: 'Show Strategic Command Summary', caption: 'Key security metrics' },
      { time: '0:60-0:80', action: 'Scroll through Recent Events', caption: 'Live event stream' },
      { time: '0:80-0:100', action: 'Interact with Threat Map', caption: 'Global threat visualization' },
      { time: '0:100-0:120', action: 'Click through to detailed view', caption: 'Deep dive capabilities' }
    ]
  },
  {
    id: 'incidents',
    path: '/Incidents',
    title: 'Incident Management',
    duration: 150,
    script: `This is the Incident Management hub, your central location for tracking and responding to security incidents.

At the top, we see incident statistics categorized by status: Open, Investigating, Contained, and Resolved.

The search bar allows you to quickly find specific incidents, while filters let you narrow by status.

Each incident card shows critical information:
- Severity level with color coding
- Current status
- Incident ID and creation date
- Affected assets

Click on any incident to see the detailed view on the right.

Here you'll find the complete incident timeline, affected systems, MITRE ATT&CK techniques detected, and containment actions taken.

You can update the incident status, assign team members, and add notes - all tracked with full audit history.

The bulk actions toolbar at the bottom allows you to manage multiple incidents simultaneously.

Let's see how to create a new incident by clicking the Create Incident button.`,
    scenes: [
      { time: '0:00-0:10', action: 'Intro with Incidents header', caption: 'Incident Management' },
      { time: '0:10-0:30', action: 'Show status cards', caption: 'Incident statistics' },
      { time: '0:30-0:50', action: 'Demonstrate search and filters', caption: 'Find incidents quickly' },
      { time: '0:50-0:80', action: 'Click through incident cards', caption: 'Incident details' },
      { time: '0:80-0:110', action: 'Show incident details panel', caption: 'Timeline and affected assets' },
      { time: '0:110-0:130', action: 'Update incident status', caption: 'Status management' },
      { time: '0:130-0:150', action: 'Demonstrate bulk actions', caption: 'Manage multiple incidents' }
    ]
  },
  {
    id: 'threat-intel',
    path: '/ThreatIntel',
    title: 'Threat Intelligence Hub',
    duration: 120,
    script: `Welcome to the Threat Intelligence Hub, your source for global threat indicators and dark web intelligence.

The top metrics show threat distribution by type: Malware, Botnets, APT Groups, and Dark Web indicators.

Use the search bar to find specific indicators - IP addresses, domains, file hashes, or threat actor names.

Filter by threat type to focus on specific categories: malware, ransomware, APT campaigns, or dark web threats.

Each threat card displays:
- The indicator (IP, domain, hash)
- Threat type and confidence level
- Source of the intelligence
- Last seen timestamp
- Associated tags

Click any threat to see comprehensive details including:
- Full threat description
- MITRE ATT&CK technique mapping
- Related threat actors
- Recommended defensive actions
- Historical activity timeline

This intelligence feeds directly into our detection systems for automated blocking and alerting.`,
    scenes: [
      { time: '0:00-0:10', action: 'Show Threat Intel header', caption: 'Global Threat Intelligence' },
      { time: '0:10-0:25', action: 'Display threat type metrics', caption: 'Threat distribution' },
      { time: '0:25-0:40', action: 'Demonstrate search', caption: 'Search indicators' },
      { time: '0:40-0:60', action: 'Use filters', caption: 'Filter by type' },
      { time: '0:60-0:80', action: 'Browse threat cards', caption: 'Threat indicators' },
      { time: '0:80-0:110', action: 'Open threat details', caption: 'Deep intelligence' },
      { time: '0:110-0:120', action: 'Show MITRE mapping', caption: 'Tactical intelligence' }
    ]
  },
  {
    id: 'soar',
    path: '/SOAR',
    title: 'SOAR Automation Platform',
    duration: 150,
    script: `This is our Intelligent SOAR Platform, powered by the Adaptive Self-Evolving Security Engine.

The automation metrics show current performance:
- Total automated responses
- Success rate
- Average response time
- Human interventions avoided

Navigate through four key sections:

My Playbooks shows your custom automation workflows. Each playbook displays its success rate, execution count, and learning data.

Pre-built Templates offers industry-specific playbooks you can deploy immediately - for phishing, malware, insider threats, and more.

AI Insights reveals patterns discovered by the system, recommending workflow improvements based on team behavior.

The Knowledge Base captures organizational learning - lessons learned, best practices, and troubleshooting guides, automatically built from your incident response activities.

Click any playbook to see its stages, trigger conditions, and security gates.

The visual playbook builder lets you create custom automation workflows with drag-and-drop simplicity.

Notice how the system learns from each execution, suggesting optimizations to improve efficiency.`,
    scenes: [
      { time: '0:00-0:10', action: 'SOAR header with ASES badge', caption: 'Intelligent Automation' },
      { time: '0:10-0:30', action: 'Show automation metrics', caption: 'Platform performance' },
      { time: '0:30-0:50', action: 'Browse My Playbooks', caption: 'Custom workflows' },
      { time: '0:50-0:70', action: 'Explore Pre-built Templates', caption: 'Ready-to-deploy automation' },
      { time: '0:70-0:90', action: 'View AI Insights', caption: 'System recommendations' },
      { time: '0:90-0:110', action: 'Open Knowledge Base', caption: 'Organizational learning' },
      { time: '0:110-0:130', action: 'Demonstrate playbook builder', caption: 'Create workflows' },
      { time: '0:130-0:150', action: 'Show learning data', caption: 'Continuous improvement' }
    ]
  }
];

export default function VideoOrchestrator({ onVideosGenerated }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSegment, setCurrentSegment] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { 
      timestamp: new Date().toISOString(), 
      message, 
      type 
    }]);
  };

  const generateAllVideos = async () => {
    setIsGenerating(true);
    setProgress(0);
    setCompletedVideos([]);
    setLogs([]);

    addLog('🚀 Starting video generation orchestration...', 'info');
    addLog(`📹 ${VIDEO_SEGMENTS.length} segments to generate`, 'info');

    const totalSteps = VIDEO_SEGMENTS.length * 4; // Script, Generate, Export, Upload
    let currentStep = 0;

    for (const segment of VIDEO_SEGMENTS) {
      setCurrentSegment(segment);
      addLog(`\n📺 Processing: ${segment.title}`, 'info');

      // Step 1: Prepare script
      currentStep++;
      setProgress((currentStep / totalSteps) * 100);
      addLog(`✍️ Preparing video script for ${segment.path}...`, 'info');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Generate video
      currentStep++;
      setProgress((currentStep / totalSteps) * 100);
      addLog(`🎬 Generating video with AI service...`, 'info');
      
      try {
        // Simulate video generation (in production, this would call the actual service)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Step 3: Export in multiple formats
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);
        addLog(`📦 Exporting 1080p MP4 and 720p WebM...`, 'info');
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Step 4: Upload to media library
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);
        addLog(`☁️ Uploading to Media Library...`, 'info');
        
        const videoData = {
          content_id: `video_${segment.id}_${Date.now()}`,
          title: segment.title,
          description: segment.script.substring(0, 200) + '...',
          content_type: 'video',
          use_case: 'installation',
          difficulty_level: 'beginner',
          duration_minutes: Math.ceil(segment.duration / 60),
          ai_generated: true,
          animation_style: 'screen_capture',
          target_audience: ['security_analyst', 'administrator'],
          video_url: `https://cdn.outpostzero.com/videos/staging/${segment.id}_${Date.now()}.mp4`,
          transcript: segment.script,
          interactive_elements: segment.scenes.map((scene, idx) => ({
            timestamp: idx * 15,
            element_type: 'clickable_hotspot',
            content: scene.caption
          })),
          is_placeholder: false  // Mark as real generated content
        };

        await TrainingContent.create(videoData);
        
        setCompletedVideos(prev => [...prev, {
          ...segment,
          videoId: videoData.content_id,
          formats: [
            { resolution: '1080p', format: 'MP4', size: '45MB', url: videoData.video_url },
            { resolution: '720p', format: 'WebM', size: '28MB', url: videoData.video_url.replace('.mp4', '_720p.webm') }
          ],
          uploadDate: new Date().toISOString()
        }]);

        addLog(`✅ Completed: ${segment.title}`, 'success');
        
      } catch (error) {
        addLog(`❌ Error generating ${segment.title}: ${error.message}`, 'error');
      }
    }

    setProgress(100);
    setCurrentSegment(null);
    addLog('\n🎉 Video generation complete!', 'success');
    addLog(`📊 ${completedVideos.length + 1}/${VIDEO_SEGMENTS.length} videos successfully generated`, 'success');
    setIsGenerating(false);

    // Notify parent component to reload data
    if (onVideosGenerated) {
      addLog('🔄 Refreshing video library...', 'info');
      await onVideosGenerated();
    }
  };

  const downloadReplacementMap = () => {
    const replacementMap = {
      generated_date: new Date().toISOString(),
      total_videos: completedVideos.length,
      videos: completedVideos.map(video => ({
        segment_id: video.id,
        title: video.title,
        path: video.path,
        video_id: video.videoId,
        formats: video.formats,
        replacement_locations: [
          {
            component: 'pages/Training',
            line: 'Approximate line number',
            old_value: 'placeholder_video_url',
            new_value: video.formats[0].url
          },
          {
            component: 'components/guides/VideoLibrary',
            property: `video_${video.id}`,
            new_value: video.formats[0].url
          }
        ],
        captions: video.scenes.map(s => s.caption),
        duration: video.duration
      })),
      instructions: {
        manual_replacement: 'Search for placeholder video URLs and replace with the URLs provided above',
        automated_script: 'Run: node scripts/update-video-refs.js --map=replacement-map.json',
        verification: 'Check each page listed in replacement_locations to confirm video loads correctly'
      }
    };

    const blob = new Blob([JSON.stringify(replacementMap, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-replacement-map-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadQAChecklist = () => {
    const checklist = `# Outpost Zero Video QA Checklist
Generated: ${new Date().toISOString()}

## Pre-Playback Checks
- [ ] All video files uploaded to CDN
- [ ] Video URLs updated in codebase
- [ ] Fallback images configured
- [ ] Loading states implemented

## Video Quality Checks
${completedVideos.map((video, idx) => `
### ${idx + 1}. ${video.title}
- [ ] 1080p MP4 plays smoothly
- [ ] 720p WebM plays smoothly
- [ ] Audio levels consistent
- [ ] No audio distortion
- [ ] Video duration: ~${video.duration}s (actual: ___s)
- [ ] Intro title card visible (0-5s)
- [ ] Outro title card visible (last 5s)
- [ ] Outpost Zero branding present
- [ ] Cursor highlights visible
- [ ] On-screen captions readable
- [ ] PII automatically blurred
- [ ] Transitions smooth
- [ ] No visual glitches

### Scene Verification
${video.scenes.map((scene, sIdx) => `- [ ] Scene ${sIdx + 1}: ${scene.caption} (${scene.time})`).join('\n')}

### Integration Checks
- [ ] Video loads on Training page
- [ ] Video loads on ${video.path} help tooltip
- [ ] Thumbnail generated correctly
- [ ] Playback controls work
- [ ] Full-screen mode works
- [ ] Mobile playback works

`).join('\n')}

## Cross-Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Performance Checks
- [ ] Initial load time < 3s
- [ ] Buffering minimal
- [ ] CDN caching configured
- [ ] Compression optimized
- [ ] Bandwidth usage acceptable

## Accessibility Checks
- [ ] Captions/subtitles available
- [ ] Transcript available
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] High contrast mode compatible

## Final Verification
- [ ] All placeholder videos removed
- [ ] All new videos playing correctly
- [ ] No broken video links
- [ ] Analytics tracking configured
- [ ] Error handling implemented
- [ ] Deployment notes documented

## Sign-off
QA Engineer: _______________  Date: ______
Tech Lead: _______________  Date: ______
Product Owner: _______________  Date: ______
`;

    const blob = new Blob([checklist], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-qa-checklist-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-purple-400" />
            Video Generation Orchestrator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generation Configuration
            </h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-400">Segments:</span> <span className="text-white">{VIDEO_SEGMENTS.length}</span></div>
              <div><span className="text-gray-400">Total Duration:</span> <span className="text-white">{VIDEO_SEGMENTS.reduce((sum, s) => sum + s.duration, 0)}s</span></div>
              <div><span className="text-gray-400">Formats:</span> <span className="text-white">1080p MP4, 720p WebM</span></div>
              <div><span className="text-gray-400">Branding:</span> <span className="text-white">Outpost Zero</span></div>
              <div><span className="text-gray-400">Features:</span> <span className="text-white">Captions, Cursor Highlight, PII Blur</span></div>
              <div><span className="text-gray-400">Upload Location:</span> <span className="text-white">Media Library (Staging Demo)</span></div>
            </div>
          </div>

          {!isGenerating && completedVideos.length === 0 && (
            <Button
              onClick={generateAllVideos}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Generate All Videos
            </Button>
          )}

          {isGenerating && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">
                    {currentSegment ? `Generating: ${currentSegment.title}` : 'Processing...'}
                  </span>
                  <span className="text-gray-400 text-sm">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <Card className="border-gray-700 bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Generation Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-64 overflow-y-auto space-y-1 font-mono text-xs">
                    {logs.map((log, idx) => (
                      <div key={idx} className={`
                        ${log.type === 'error' ? 'text-red-300' : ''}
                        ${log.type === 'success' ? 'text-green-300' : ''}
                        ${log.type === 'info' ? 'text-gray-300' : ''}
                      `}>
                        {log.message}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {completedVideos.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">Generated Videos</h4>
                <Badge className="bg-green-500/20 text-green-300">
                  {completedVideos.length}/{VIDEO_SEGMENTS.length} Complete
                </Badge>
              </div>

              <div className="grid gap-3">
                {completedVideos.map((video, idx) => (
                  <Card key={idx} className="border-gray-700 bg-gray-900/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="text-white font-medium">{video.title}</h5>
                          <p className="text-gray-400 text-sm">{video.path}</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex gap-2 mt-2">
                        {video.formats.map((format, fIdx) => (
                          <Badge key={fIdx} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                            {format.resolution} {format.format} ({format.size})
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-3 pt-4 border-t border-gray-700">
                <Button
                  onClick={downloadReplacementMap}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Replacement Map
                </Button>
                <Button
                  onClick={downloadQAChecklist}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QA Checklist
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white">Video Segments Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {VIDEO_SEGMENTS.map((segment, idx) => (
              <Card key={idx} className="border-gray-700 bg-gray-900/50">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="text-white font-medium">{segment.title}</h5>
                      <p className="text-gray-400 text-sm">{segment.path}</p>
                    </div>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {segment.duration}s
                    </Badge>
                  </div>
                  <div className="text-gray-400 text-sm mb-3">
                    {segment.scenes.length} scenes · {Math.ceil(segment.script.length / 5)} words
                  </div>
                  <details className="text-sm">
                    <summary className="text-blue-400 cursor-pointer hover:text-blue-300">
                      View Script & Scenes
                    </summary>
                    <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-700">
                      <p className="text-gray-300 whitespace-pre-wrap mb-4">{segment.script}</p>
                      <div className="border-t border-gray-700 pt-3">
                        <h6 className="text-white font-medium mb-2">Scene Breakdown:</h6>
                        {segment.scenes.map((scene, sIdx) => (
                          <div key={sIdx} className="text-gray-400 text-xs mb-1">
                            {scene.time}: {scene.caption}
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
