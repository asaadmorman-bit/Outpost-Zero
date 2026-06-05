import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipForward,
  SkipBack,
  CheckCircle,
  AlertCircle,
  Shield,
  Activity,
  TrendingUp,
  Users,
  Bell,
  Eye,
  MapPin
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function VideoPlayer({ video, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);
  const [liveData, setLiveData] = useState([]);
  const [narrationEnabled, setNarrationEnabled] = useState(true);
  const [currentNarrationIndex, setCurrentNarrationIndex] = useState(0);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const speechRef = useRef(null);
  const audioContextRef = useRef(null);
  const narrationTimeoutRef = useRef(null);

  const duration = video.duration_minutes * 60 || 120;
  const progress = (currentTime / duration) * 100;

  // Initialize Web Audio API and load voices
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    
    // Load voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (narrationTimeoutRef.current) {
        clearTimeout(narrationTimeoutRef.current);
      }
    };
  }, []);

  // Play sound effect
  const playSound = (frequency, duration) => {
    if (isMuted || !audioContextRef.current) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.error('Sound playback error:', error);
    }
  };

  // Enhanced text-to-speech with better voice quality
  const speak = (text) => {
    if (!narrationEnabled || isMuted || !text) return Promise.resolve();
    
    return new Promise((resolve) => {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Small delay to ensure previous speech is cancelled
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Enhanced voice settings for more natural speech
        utterance.rate = 0.9;
        utterance.pitch = 1.05;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';
        
        // Try to use a better quality voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoices = voices.filter(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.includes('Google') || voice.name.includes('Natural') || 
           voice.name.includes('Premium') || voice.name.includes('Enhanced') ||
           voice.name.includes('Samantha') || voice.name.includes('Daniel'))
        );
        
        if (preferredVoices.length > 0) {
          utterance.voice = preferredVoices[0];
        } else {
          const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
          if (englishVoice) utterance.voice = englishVoice;
        }
        
        utterance.onend = () => resolve();
        utterance.onerror = (error) => {
          console.error('Speech error:', error);
          resolve();
        };
        
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }, 100);
    });
  };

  // Continuous narration throughout the scene
  const speakContinuously = async (narrationSegments) => {
    if (!narrationEnabled || isMuted || !isPlaying || !narrationSegments) return;
    
    for (let i = 0; i < narrationSegments.length; i++) {
      if (!isPlaying || isMuted || !narrationEnabled) break;
      
      setCurrentNarrationIndex(i);
      await speak(narrationSegments[i]);
      
      // Pause between segments
      if (i < narrationSegments.length - 1) {
        await new Promise(resolve => {
          narrationTimeoutRef.current = setTimeout(resolve, 500);
        });
      }
    }
  };

  // Generate live data for charts
  useEffect(() => {
    const generateData = () => {
      const newData = [];
      for (let i = 0; i < 20; i++) {
        newData.push({
          time: `${i}:00`,
          events: Math.floor(Math.random() * 100) + 50,
          threats: Math.floor(Math.random() * 30) + 10,
          blocked: Math.floor(Math.random() * 40) + 20
        });
      }
      return newData;
    };
    
    setLiveData(generateData());
    const interval = setInterval(() => {
      setLiveData(generateData());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Define video scenes based on actual use_case
  const getVideoScenes = () => {
    const useCase = video.use_case || 'incident_response';
    
    const scenesMap = {
      incident_response: [
        {
          time: 0,
          title: "Security Operations Center Dashboard",
          narration: [
            "Welcome to the Outpost Zero Security Operations Center.",
            "This is your command center for monitoring real-time threats and coordinating incident response across your entire infrastructure.",
            "At the top of the dashboard, you can see our live metrics displaying events per hour, critical alerts, blocked threats, and active users.",
            "Notice how these numbers update in real-time, giving you instant visibility into your security posture.",
            "Below that, we have a comprehensive area chart showing security event trends over the last 24 hours.",
            "This visual representation helps you identify patterns and anomalies at a glance.",
            "The color-coded metric cards provide quick status updates, with animated pulse effects drawing attention to critical information.",
            "Everything you see here is designed for rapid situational awareness and quick decision-making during security incidents."
          ],
          content: (liveData) => (
            <div className="w-full space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-4 rounded-lg border border-blue-500/30 animate-pulse">
                  <Activity className="w-8 h-8 text-blue-400 mb-2" />
                  <div className="text-3xl font-bold text-white">{Math.floor(Math.random() * 500) + 1200}</div>
                  <div className="text-blue-300 text-sm">Events/Hour</div>
                </div>
                <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 p-4 rounded-lg border border-red-500/30 animate-pulse animation-delay-200">
                  <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
                  <div className="text-3xl font-bold text-white">{Math.floor(Math.random() * 10) + 3}</div>
                  <div className="text-red-300 text-sm">Critical Alerts</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 p-4 rounded-lg border border-green-500/30 animate-pulse animation-delay-400">
                  <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
                  <div className="text-3xl font-bold text-white">{Math.floor(Math.random() * 50) + 200}</div>
                  <div className="text-green-300 text-sm">Blocked Threats</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-4 rounded-lg border border-purple-500/30 animate-pulse animation-delay-600">
                  <Users className="w-8 h-8 text-purple-400 mb-2" />
                  <div className="text-3xl font-bold text-white">{Math.floor(Math.random() * 20) + 45}</div>
                  <div className="text-purple-300 text-sm">Active Users</div>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h4 className="text-white font-medium mb-3">Security Events - Last 24 Hours</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={liveData}>
                    <defs>
                      <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px'}} />
                    <Area type="monotone" dataKey="events" stroke="#3B82F6" fillOpacity={1} fill="url(#colorEvents)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )
        },
        {
          time: 30,
          title: "Real-Time Threat Detection",
          narration: [
            "Now let's look at our real-time threat detection capabilities.",
            "Our AI-powered threat detection engine analyzes thousands of events per second.",
            "It uses machine learning to identify anomalies and potential security incidents before they can escalate into major breaches.",
            "On your screen, you're seeing a live threat feed with the most recent security alerts.",
            "Each alert is color-coded by severity: red for critical, orange for high priority, yellow for medium, and blue for low severity threats.",
            "Notice the ransomware behavior detected on SERVER-DB-01. This is a critical alert that requires immediate attention.",
            "The system also shows multiple failed login attempts from a suspicious IP address, indicating a potential brute force attack.",
            "On the right side, we have a pie chart showing threat distribution across different categories.",
            "Below that, you can see our automated response status, showing that 87% of threats are handled automatically without human intervention.",
            "This level of automation significantly reduces our mean time to respond and frees up security analysts to focus on complex investigations."
          ],
          content: (liveData) => (
            <div className="w-full space-y-4">
              <div className="space-y-2">
                {[
                  { type: 'critical', text: 'Ransomware behavior detected on SERVER-DB-01', time: '2s ago', ip: '192.168.1.45' },
                  { type: 'high', text: 'Multiple failed login attempts from suspicious IP', time: '5s ago', ip: '203.0.113.42' },
                  { type: 'medium', text: 'Unusual outbound traffic pattern detected', time: '12s ago', ip: '10.0.0.123' },
                  { type: 'low', text: 'Security policy violation: USB device connected', time: '25s ago', ip: '10.0.0.67' }
                ].map((alert, idx) => (
                  <div key={idx} className={`bg-gray-800/50 p-3 rounded-lg border animate-slideInLeft animation-delay-${idx * 200}`}
                       style={{borderColor: alert.type === 'critical' ? '#EF4444' : alert.type === 'high' ? '#F97316' : alert.type === 'medium' ? '#EAB308' : '#3B82F6'}}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className={`w-4 h-4 ${alert.type === 'critical' ? 'text-red-400' : alert.type === 'high' ? 'text-orange-400' : alert.type === 'medium' ? 'text-yellow-400' : 'text-blue-400'}`} />
                        <span className="text-white text-sm font-medium">{alert.text}</span>
                      </div>
                      <Badge className={alert.type === 'critical' ? 'bg-red-500/20 text-red-300' : alert.type === 'high' ? 'bg-orange-500/20 text-orange-300' : 'bg-yellow-500/20 text-yellow-300'}>
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>Source: {alert.ip}</span>
                      <span>•</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <h4 className="text-white font-medium mb-3 text-sm">Threat Distribution</h4>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Malware', value: 35, color: '#EF4444' },
                          { name: 'Phishing', value: 28, color: '#F97316' },
                          { name: 'Intrusion', value: 22, color: '#EAB308' },
                          { name: 'Other', value: 15, color: '#3B82F6' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          { name: 'Malware', value: 35, color: '#EF4444' },
                          { name: 'Phishing', value: 28, color: '#F97316' },
                          { name: 'Intrusion', value: 22, color: '#EAB308' },
                          { name: 'Other', value: 15, color: '#3B82F6' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <h4 className="text-white font-medium mb-3 text-sm">Response Status</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Automated</span>
                        <span className="text-green-400">87%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '87%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Manual Review</span>
                        <span className="text-yellow-400">13%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '13%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ],
      threat_hunting: [
        {
          time: 0,
          title: "Proactive Threat Hunting Dashboard",
          narration: [
            "Welcome to threat hunting with Outpost Zero.",
            "Threat hunting is about finding adversaries before they find you.",
            "Using advanced analytics and custom queries, we proactively search through terabytes of security data to uncover hidden threats.",
            "This dashboard shows seven active hunting sessions currently running across your environment.",
            "We've analyzed one point two terabytes of data so far today, looking for anomalies and suspicious patterns.",
            "And we've already discovered three previously undetected threats that evaded automated detection systems.",
            "The console below shows our custom query language in action, scanning network traffic patterns and user behavior anomalies.",
            "Notice the yellow alert indicating potential lateral movement has been detected through our advanced correlation engine."
          ],
          content: (liveData) => (
            <div className="w-full space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h4 className="text-white font-medium mb-3">Active Hunting Sessions</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-purple-500/10 p-3 rounded border border-purple-500/30 animate-pulse">
                    <Eye className="w-6 h-6 text-purple-400 mb-2" />
                    <div className="text-2xl font-bold text-white">7</div>
                    <div className="text-xs text-purple-300">Active Hunts</div>
                  </div>
                  <div className="bg-blue-500/10 p-3 rounded border border-blue-500/30 animate-pulse animation-delay-300">
                    <Activity className="w-6 h-6 text-blue-400 mb-2" />
                    <div className="text-2xl font-bold text-white">1.2TB</div>
                    <div className="text-xs text-blue-300">Data Analyzed</div>
                  </div>
                  <div className="bg-red-500/10 p-3 rounded border border-red-500/30 animate-pulse animation-delay-600">
                    <AlertCircle className="w-6 h-6 text-red-400 mb-2" />
                    <div className="text-2xl font-bold text-white">3</div>
                    <div className="text-xs text-red-300">Threats Found</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 font-mono text-sm">
                <div className="text-green-400 mb-2">$ ozql-hunt --mode advanced</div>
                <div className="text-gray-400">
                  Scanning network traffic patterns...<br/>
                  Analyzing user behavior anomalies...<br/>
                  Correlating threat intelligence feeds...<br/>
                  <span className="text-yellow-400">⚠ Potential lateral movement detected</span>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h4 className="text-white font-medium mb-3">Query Results</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={liveData.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" style={{fontSize: '10px'}} />
                    <YAxis stroke="#9CA3AF" style={{fontSize: '10px'}} />
                    <Tooltip contentStyle={{backgroundColor: '#1F2937', border: '1px solid #374151'}} />
                    <Bar dataKey="threats" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )
        }
      ],
      soar_playbooks: [
        {
          time: 0,
          title: "SOAR Orchestration Dashboard",
          narration: [
            "Welcome to the Security Orchestration, Automation, and Response dashboard.",
            "This is where all your security tools come together for coordinated incident response.",
            "We currently have twenty-three active playbooks deployed across the environment, automating response to common security scenarios.",
            "These playbooks have been executed over fifteen hundred times this month with an average response time of just two point three seconds.",
            "Our overall success rate is ninety-seven percent, meaning nearly all automated responses complete successfully without human intervention.",
            "When a single incident is detected, it can trigger coordinated actions across firewalls, endpoint protection, identity systems, and communication platforms.",
            "This level of orchestration eliminates the need for manual coordination between different security tools.",
            "It dramatically reduces response times from hours or minutes down to just seconds, while ensuring consistent execution of your security policies."
          ],
          content: (liveData) => (
            <div className="w-full space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: 'Playbooks', value: 23, color: 'blue' },
                  { name: 'Executions', value: 1547, color: 'green' },
                  { name: 'Avg Time', value: '2.3s', color: 'purple' },
                  { name: 'Success', value: '97%', color: 'yellow' }
                ].map((stat, idx) => (
                  <div key={idx} className={`bg-${stat.color}-500/10 p-3 rounded border border-${stat.color}-500/30 animate-pulse`}
                       style={{animationDelay: `${idx * 200}ms`}}>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.name}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h4 className="text-white font-medium mb-3">Recent Executions</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={liveData.slice(0, 12)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" style={{fontSize: '10px'}} />
                    <YAxis stroke="#9CA3AF" style={{fontSize: '10px'}} />
                    <Tooltip contentStyle={{backgroundColor: '#1F2937', border: '1px solid #374151'}} />
                    <Line type="monotone" dataKey="events" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )
        }
      ]
    };

    return scenesMap[useCase] || scenesMap.incident_response;
  };

  const scenes = getVideoScenes();

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            clearInterval(interval);
            setIsPlaying(false);
            playSound(600, 0.2);
            window.speechSynthesis.cancel();
            return duration;
          }
          
          // Update current scene based on time
          const sceneIndex = scenes.findIndex((scene, idx) => {
            const nextScene = scenes[idx + 1];
            return newTime >= scene.time && (!nextScene || newTime < nextScene.time);
          });
          
          if (sceneIndex !== -1 && sceneIndex !== currentScene) {
            setCurrentScene(sceneIndex);
            playSound(800, 0.1);
            setCurrentNarrationIndex(0);
            
            // Start continuous narration for the new scene
            if (voicesLoaded && scenes[sceneIndex].narration) {
              speakContinuously(scenes[sceneIndex].narration);
            }
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      window.speechSynthesis.cancel();
    }
    return () => {
      clearInterval(interval);
      window.speechSynthesis.cancel();
    };
  }, [isPlaying, duration, scenes, currentScene, isMuted, narrationEnabled, voicesLoaded]);

  const handlePlayPause = () => {
    playSound(isPlaying ? 400 : 600, 0.1);
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    
    if (newPlayState && voicesLoaded && scenes[currentScene]?.narration) {
      setCurrentNarrationIndex(0);
      // Start narration after a small delay
      setTimeout(() => {
        speakContinuously(scenes[currentScene].narration);
      }, 300);
    } else {
      window.speechSynthesis.cancel();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSkip = (seconds) => {
    playSound(500, 0.1);
    window.speechSynthesis.cancel();
    
    setCurrentTime(prev => {
      const newTime = Math.max(0, Math.min(duration, prev + seconds));
      const sceneIndex = scenes.findIndex((scene, idx) => {
        const nextScene = scenes[idx + 1];
        return newTime >= scene.time && (!nextScene || newTime < nextScene.time);
      });
      
      if (sceneIndex !== -1) {
        if (sceneIndex !== currentScene) {
          setCurrentScene(sceneIndex);
          setCurrentNarrationIndex(0);
        }
        
        if (isPlaying && voicesLoaded && scenes[sceneIndex].narration) {
          setTimeout(() => {
            speakContinuously(scenes[sceneIndex].narration);
          }, 200);
        }
      }
      return newTime;
    });
  };

  const currentSceneData = scenes[currentScene];

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideInLeft { animation: slideInLeft 0.5s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-in; }
        .animation-delay-0 { animation-delay: 0s; }
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
      `}</style>
      
      <div className="max-w-7xl w-full">
        <Card className="border-gray-700 bg-gray-900">
          <CardContent className="p-0">
            {/* Video Display Area */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-t-lg overflow-hidden">
              {!isPlaying ? (
                // Start Screen
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center max-w-2xl p-8">
                    <div className="mb-6">
                      <img 
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/174051417_Screenshot2025-07-24110248.jpg" 
                        alt="Outpost Zero"
                        className="h-16 mx-auto opacity-60 mb-4"
                      />
                    </div>
                    <h3 className="text-white text-3xl font-bold mb-3">{video.title}</h3>
                    <p className="text-gray-400 text-lg mb-6">{video.description}</p>
                    <div className="flex gap-2 justify-center mb-6">
                      <Badge className="bg-blue-500/20 text-blue-300 text-sm">
                        {video.use_case?.replace(/_/g, ' ')}
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-300 text-sm">
                        {video.difficulty_level}
                      </Badge>
                      <Badge className="bg-gray-700 text-gray-300 text-sm">
                        {video.duration_minutes} minutes
                      </Badge>
                    </div>
                    {video.learning_objectives && (
                      <div className="bg-gray-800/50 rounded-lg p-4 text-left">
                        <h4 className="text-white font-medium mb-3 text-sm">What you'll learn:</h4>
                        <div className="space-y-2">
                          {video.learning_objectives.map((objective, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{objective}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handlePlayPause}
                    className="absolute inset-0 w-24 h-24 m-auto rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all transform hover:scale-110 shadow-2xl"
                  >
                    <Play className="w-12 h-12 text-white ml-1" />
                  </button>
                </div>
              ) : (
                // Playing Screen with actual dashboard content
                <div className="absolute inset-0 p-8 overflow-y-auto">
                  <div className="max-w-5xl mx-auto">
                    <h3 className="text-white text-2xl font-bold mb-6">{currentSceneData.title}</h3>
                    {typeof currentSceneData.content === 'function' ? currentSceneData.content(liveData) : currentSceneData.content}
                  </div>
                </div>
              )}

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {video.is_placeholder ? (
                  <Badge className="bg-blue-500/90 text-white">
                    <Activity className="w-3 h-3 mr-1" />
                    Interactive Demo
                  </Badge>
                ) : (
                  <Badge className="bg-green-500/90 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Production Video
                  </Badge>
                )}
                {narrationEnabled && !isMuted && isPlaying && (
                  <Badge className="bg-purple-500/90 text-white animate-pulse">
                    <Volume2 className="w-3 h-3 mr-1" />
                    Narration Active
                  </Badge>
                )}
              </div>

              {/* Time Display */}
              {isPlaying && (
                <div className="absolute top-4 right-4 bg-black/70 rounded px-3 py-1.5">
                  <span className="text-white text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="bg-gray-800 p-4 rounded-b-lg">
              {/* Progress Bar */}
              <div className="mb-4">
                <div 
                  className="w-full bg-gray-700 rounded-full h-2 cursor-pointer hover:h-3 transition-all relative group"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    const newTime = percent * duration;
                    window.speechSynthesis.cancel();
                    setCurrentTime(newTime);
                    const sceneIndex = scenes.findIndex((scene, idx) => {
                      const nextScene = scenes[idx + 1];
                      return newTime >= scene.time && (!nextScene || newTime < nextScene.time);
                    });
                    if (sceneIndex !== -1) {
                      setCurrentScene(sceneIndex);
                      setCurrentNarrationIndex(0);
                      if (isPlaying && voicesLoaded && scenes[sceneIndex].narration) {
                        setTimeout(() => {
                          speakContinuously(scenes[sceneIndex].narration);
                        }, 200);
                      }
                    }
                    playSound(500, 0.1);
                  }}
                >
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-blue-500 h-full rounded-full transition-all relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg group-hover:w-5 group-hover:h-5 transition-all"></div>
                  </div>
                  
                  {/* Scene markers */}
                  {scenes.map((scene, idx) => (
                    <div
                      key={idx}
                      className="absolute top-0 w-1 h-full bg-white/30"
                      style={{ left: `${(scene.time / duration) * 100}%` }}
                      title={scene.title}
                    />
                  ))}
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handlePlayPause}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>

                  <Button onClick={() => handleSkip(-10)} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <SkipBack className="w-4 h-4" />
                  </Button>

                  <Button onClick={() => handleSkip(10)} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <SkipForward className="w-4 h-4" />
                  </Button>

                  <Button
                    onClick={() => {
                      setIsMuted(!isMuted);
                      playSound(400, 0.1);
                      if (!isMuted) window.speechSynthesis.cancel();
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>

                  <Button
                    onClick={() => {
                      setNarrationEnabled(!narrationEnabled);
                      playSound(500, 0.1);
                      if (narrationEnabled) window.speechSynthesis.cancel();
                    }}
                    variant="ghost"
                    size="sm"
                    className={narrationEnabled ? "text-purple-400" : "text-gray-400"}
                    title="Toggle narration"
                  >
                    <Bell className="w-4 h-4" />
                  </Button>

                  <span className="text-gray-400 text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  
                  {/* Progress Dots */}
                  <div className="flex gap-1 ml-4">
                    {scenes.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentScene ? 'bg-blue-500 w-6' : 
                          idx < currentScene ? 'bg-green-500' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-gray-600 text-gray-400">
                    Scene {currentScene + 1}/{scenes.length}
                  </Badge>

                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Maximize className="w-4 h-4" />
                  </Button>

                  <Button
                    onClick={() => {
                      playSound(400, 0.1);
                      window.speechSynthesis.cancel();
                      onClose();
                    }}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Close
                  </Button>
                </div>
              </div>

              {/* Current Narration Display */}
              {isPlaying && narrationEnabled && !isMuted && currentSceneData.narration && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="text-sm text-gray-400 italic">
                    <Volume2 className="w-4 h-4 inline mr-2 text-purple-400 animate-pulse" />
                    {currentSceneData.narration[currentNarrationIndex] || currentSceneData.narration[0]}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}