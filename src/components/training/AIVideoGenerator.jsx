
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Added AlertTitle for VideoServiceSetup
import { 
  Video, 
  Wand2, 
  Download, 
  Play, 
  Users,
  Clock,
  Star,
  Loader,
  AlertTriangle,
  CheckCircle,
  Info, // Added for VideoServiceSetup
  XCircle // Added for VideoServiceSetup
} from 'lucide-react';
import { InvokeLLM } from '@/integrations/Core';

// Mock VideoServiceIntegration for demonstration purposes.
// In a real application, this would interact with a backend API
// to manage connections to external video generation services.
const VideoServiceIntegration = {
  list: async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    // Load from local storage for persistence across reloads
    const storedIntegrations = JSON.parse(localStorage.getItem('videoIntegrations') || '[]');
    return storedIntegrations;
  },
  connect: async (serviceProvider, apiKey) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real scenario, this would validate the API key with the service provider's API
    // and store sensitive information securely on the backend.
    const newIntegration = {
      integration_id: `int_${Date.now()}`,
      service_provider: serviceProvider,
      service_name: serviceProvider.charAt(0).toUpperCase() + serviceProvider.slice(1), // Capitalize
      api_key_masked: apiKey.substring(0, 4) + '...', // Mask API key for display
      status: 'connected',
      connected_at: new Date().toISOString()
    };
    const storedIntegrations = JSON.parse(localStorage.getItem('videoIntegrations') || '[]');
    localStorage.setItem('videoIntegrations', JSON.stringify([...storedIntegrations, newIntegration]));
    return newIntegration;
  }
};

// New component for connecting video services
function VideoServiceSetup({ onServiceConfigured }) {
  const [serviceProvider, setServiceProvider] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', message: string }

  const handleConnect = async () => {
    if (!serviceProvider || !apiKey) {
      setStatusMessage({ type: 'error', message: 'Please select a service provider and enter an API key.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    try {
      await VideoServiceIntegration.connect(serviceProvider, apiKey);
      setStatusMessage({ type: 'success', message: `Successfully connected to ${serviceProvider.charAt(0).toUpperCase() + serviceProvider.slice(1)}!` });
      setApiKey(''); // Clear API key for security
      onServiceConfigured(); // Notify parent to refresh integrations
    } catch (err) {
      console.error('Connection error:', err);
      setStatusMessage({ type: 'error', message: `Failed to connect to ${serviceProvider.charAt(0).toUpperCase() + serviceProvider.slice(1)}. Please check your API key.` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <Info className="w-6 h-6 text-blue-400" />
          Connect Video Generation Service
        </CardTitle>
        <p className="text-gray-400">Integrate your accounts for Synthesia, Remotion, Visla, and more.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {statusMessage && (
          <Alert className={`${statusMessage.type === 'success' ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
            {statusMessage.type === 'success' ? <CheckCircle className="h-4 w-4 text-green-400" /> : <XCircle className="h-4 w-4 text-red-400" />}
            <AlertTitle className={`${statusMessage.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
              {statusMessage.type === 'success' ? 'Success' : 'Error'}
            </AlertTitle>
            <AlertDescription className={`${statusMessage.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
              {statusMessage.message}
            </AlertDescription>
          </Alert>
        )}

        <div>
          <Label htmlFor="service-provider" className="text-white">Service Provider</Label>
          <Select value={serviceProvider} onValueChange={setServiceProvider}>
            <SelectTrigger id="service-provider" className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="synthesia" className="text-white">Synthesia</SelectItem>
              <SelectItem value="remotion" className="text-white">Remotion</SelectItem>
              <SelectItem value="visla" className="text-white">Visla</SelectItem>
              {/* Add more services here as they become available */}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="api-key" className="text-white">API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <Button onClick={handleConnect} disabled={isLoading || !serviceProvider || !apiKey} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect Service'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}


export default function AIVideoGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState(null);
  const [productionMethod, setProductionMethod] = useState('demo_mode');
  const [showServiceSetup, setShowServiceSetup] = useState(false); // New state for showing service setup
  const [availableIntegrations, setAvailableIntegrations] = useState([]); // New state for integrations

  const [videoConfig, setVideoConfig] = useState({
    title: '',
    target_audience: 'executive',
    video_type: 'platform_overview',
    duration: '5',
    style: '3d_rendered',
    tone: 'professional',
    branding: 'cyber_dojo',
    resolution: '1080p'
  });

  const videoTypes = [
    { value: 'platform_overview', label: 'Platform Overview', description: 'Complete walkthrough of core features' },
    { value: 'threat_simulation', label: 'Live Threat Simulation', description: 'Real-time attack detection and response' },
    { value: 'ai_capabilities', label: 'AI & Automation Demo', description: 'Showcase predictive analytics and SOAR' },
    { value: 'compliance_reporting', label: 'Compliance & Reporting', description: 'Regulatory compliance features' },
    { value: 'executive_dashboard', label: 'Executive Overview', description: 'High-level business metrics and ROI' },
    { value: 'technical_deep_dive', label: 'Technical Deep Dive', description: 'Architecture and integration capabilities' },
    { value: 'investor_pitch', label: 'Investor Presentation', description: 'Market opportunity and competitive advantage' },
    { value: 'customer_success', label: 'Customer Success Story', description: 'Real customer use cases and outcomes' }
  ];

  const audienceProfiles = [
    { value: 'executive', label: 'C-Suite Executives', focus: 'Business impact, ROI, strategic value' },
    { value: 'technical', label: 'Technical Decision Makers', focus: 'Architecture, integrations, capabilities' },
    { value: 'security_analyst', label: 'Security Analysts', focus: 'Day-to-day operations, threat detection' },
    { value: 'investor', label: 'Investors/VCs', focus: 'Market size, competitive advantage, growth potential' },
    { value: 'compliance', label: 'Compliance Officers', focus: 'Regulatory requirements, audit readiness' },
    { value: 'government', label: 'Government/Defense', focus: 'Classification levels, security clearance integration' }
  ];

  // Effect to load available integrations when the component mounts
  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      const integrations = await VideoServiceIntegration.list();
      // Filter for connected integrations
      setAvailableIntegrations(integrations.filter(i => i.status === 'connected'));
    } catch (error) {
      console.error('Error loading integrations:', error);
      // Optionally set an error state here for UI feedback
    }
  };

  // Dynamically create productionMethods based on available integrations
  const baseProductionMethods = [
    {
      value: 'demo_mode',
      label: '🎬 Demo Mode (Available Now)',
      description: 'Generate script and storyboard with AI - actual video production coming soon',
      price: 'Free',
      time: '30 seconds',
      quality: 'Script & Storyboard',
      features: ['AI Script Generation', 'Detailed Storyboard', 'Production Blueprint', 'Instant Results']
    }
  ];

  const dynamicProductionMethods = [
    ...availableIntegrations.map(integration => ({
      value: integration.integration_id, // Use integration_id as value
      label: `${integration.service_name} ✅ (via ${integration.service_provider.charAt(0).toUpperCase() + integration.service_provider.slice(1)})`,
      description: `Render videos using your ${integration.service_name} account. API Key: ${integration.api_key_masked}`,
      price: 'Uses your credits', // User pays directly to the service provider
      time: '5-15 minutes', // Estimated rendering time
      quality: 'Professional Quality',
      features: ['Full Video Rendering', 'HD Quality', 'Download MP4', 'Your API Key'],
      integration: integration // Store the full integration object
    })),
    {
      value: 'add_service',
      label: '➕ Add Video Service',
      description: 'Connect Synthesia, Remotion, Visla, or other video generation services',
      price: 'Setup Required',
      time: '2 minutes',
      quality: 'N/A',
      features: ['Multiple Services', 'Your Own Account', 'Full Control', 'Cost Effective']
    }
  ];

  const allProductionMethods = [...baseProductionMethods, ...dynamicProductionMethods];


  const generateVideo = async () => {
    // If "Add Video Service" is selected, show the setup component
    if (productionMethod === 'add_service') {
      setShowServiceSetup(true);
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setCurrentStep('Analyzing requirements...');

    try {
      // Step 1: Generate script and storyboard
      setProgress(20);
      setCurrentStep('Creating professional script and storyboard with AI...');

      const selectedVideoType = videoTypes.find(vt => vt.value === videoConfig.video_type);
      const selectedAudience = audienceProfiles.find(ap => ap.value === videoConfig.target_audience);

      const scriptResponse = await InvokeLLM({
        prompt: `Create a professional video script for a cybersecurity platform demo video.

        **Video Configuration:**
        - Title: ${videoConfig.title || selectedVideoType.label}
        - Type: ${selectedVideoType.label} - ${selectedVideoType.description}
        - Target Audience: ${selectedAudience.label} - Focus on ${selectedAudience.focus}
        - Duration: ${videoConfig.duration} minutes
        - Tone: ${videoConfig.tone}
        - Style: ${videoConfig.style}

        **Platform Context:**
        You are creating a script for "Outpost Zero," the world's first cyber immune system by Cyber Dojo Solutions. Key differentiators:
        - AI-powered predictive threat detection (99.7% accuracy)
        - Autonomous response capabilities (0.3ms response time)
        - Quantum-safe cryptography
        - Multi-tier platform (AXIS Rebirth for home, RevSentinel for SMB, Outpost Zero Classified for government)
        - 12+ patented technologies
        - Real-time threat intelligence sharing
        - Blockchain-based evidence chain

        Generate a compelling script that includes:
        1. Hook (first 10 seconds to grab attention)
        2. Problem statement (what current security solutions miss)
        3. Solution overview (how Outpost Zero solves it)
        4. Key differentiators and proof points
        5. Call to action

        Also provide a detailed storyboard with visual descriptions for each scene.`,
        
        response_json_schema: {
          type: "object",
          properties: {
            script: {
              type: "object",
              properties: {
                hook: { type: "string" },
                problem_statement: { type: "string" },
                solution_overview: { type: "string" },
                key_differentiators: { type: "array", items: { type: "string" } },
                proof_points: { type: "array", items: { type: "string" } },
                call_to_action: { type: "string" },
                full_narration: { type: "string" }
              },
              required: ["hook", "problem_statement", "solution_overview", "call_to_action", "full_narration"]
            },
            storyboard: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  scene_number: { type: "number" },
                  duration_seconds: { type: "number" },
                  visual_description: { type: "string" },
                  narration: { type: "string" },
                  animation_style: { type: "string" }
                },
                required: ["scene_number", "duration_seconds", "visual_description", "narration"]
              }
            },
            estimated_production_time: { type: "string" },
            recommended_music: { type: "string" }
          },
          required: ["script", "storyboard"]
        }
      });

      setProgress(60);
      setCurrentStep('Generating production assets...');

      // Find the currently selected production method
      const selectedMethod = allProductionMethods.find(m => m.value === productionMethod);
      
      const videoData = {
        id: `video_${Date.now()}`,
        title: videoConfig.title || selectedVideoType.label,
        description: selectedVideoType.description,
        target_audience: selectedAudience.label,
        duration_minutes: parseInt(videoConfig.duration),
        script: scriptResponse.script,
        storyboard: scriptResponse.storyboard,
        thumbnail_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop', // Placeholder thumbnail
        video_type: videoConfig.video_type,
        style: videoConfig.style,
        estimated_production_time: scriptResponse.estimated_production_time,
        recommended_music: scriptResponse.recommended_music,
        created_date: new Date().toISOString(),
        status: selectedMethod?.integration ? 'rendering' : 'script_ready', // Status depends on method
        production_method: productionMethod,
        ready_for_download: false,
        demo_mode: !selectedMethod?.integration // If no integration, it's demo mode
      };

      if (selectedMethod?.integration) {
        // If an integration is selected, simulate submitting a render job
        setCurrentStep(`Submitting render job to ${selectedMethod.service_name} for production...`);
        // In a real application, you would call a backend function here to
        // interact with the chosen video service's API (e.g., Synthesia, Remotion)
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
        
        videoData.status = 'rendering';
        videoData.render_job_id = `job_${Date.now()}_${selectedMethod.integration.integration_id}`;
        videoData.estimated_completion = new Date(Date.now() + (parseInt(videoConfig.duration) * 60 * 1000) + (5 * 60 * 1000)).toISOString(); // Duration + 5 min buffer
        videoData.ready_for_download = false; // Not ready immediately when rendering
        videoData.thumbnail_url = 'https://images.unsplash.com/photo-1510511459019-5efa6440b573?w=800&h=450&fit=crop'; // "Rendering" placeholder
        setCurrentStep('Video rendering in progress! You will be notified when complete.');
      } else {
        // For demo mode, it's just script and storyboard
        setCurrentStep('Script and storyboard ready!');
      }

      setProgress(100);
      setGeneratedVideo(videoData);

    } catch (error) {
      console.error('Error generating video:', error);
      setError(error.message || 'Failed to generate video. Please try again.');
      setCurrentStep('');
    }

    setIsGenerating(false);
  };

  const downloadScript = () => {
    if (!generatedVideo) return;
    
    const scriptContent = `# ${generatedVideo.title}
**Target Audience:** ${generatedVideo.target_audience}
**Duration:** ${generatedVideo.duration_minutes} minutes
**Style:** ${generatedVideo.style}

## Full Narration Script
${generatedVideo.script.full_narration}

## Detailed Storyboard
${generatedVideo.storyboard.map(scene => `
### Scene ${scene.scene_number} (${scene.duration_seconds}s)
**Visual:** ${scene.visual_description}
**Narration:** ${scene.narration}
**Animation:** ${scene.animation_style || 'Standard'}
`).join('\n')}

## Production Notes
- Estimated Production Time: ${generatedVideo.estimated_production_time || 'N/A'}
- Recommended Music: ${generatedVideo.recommended_music || 'N/A'}
- Generated by Outpost Zero AI Video Generator
- © ${new Date().getFullYear()} Cyber Dojo Solutions, LLC
`;

    const blob = new Blob([scriptContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedVideo.title.replace(/\s+/g, '_')}_Script.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {showServiceSetup ? (
        <div>
          <Button
            variant="outline"
            onClick={() => setShowServiceSetup(false)}
            className="mb-4 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            ← Back to Video Generator
          </Button>
          <VideoServiceSetup onServiceConfigured={() => {
            loadIntegrations(); // Reload integrations after a new service is configured
            setShowServiceSetup(false); // Hide the setup screen
          }} />
        </div>
      ) : (
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Video className="w-6 h-6 text-purple-400" />
              AI Video Production Studio
              <Badge className="bg-purple-500/20 text-purple-300">AI-Powered</Badge>
            </CardTitle>
            <p className="text-gray-400">Generate professional video scripts and storyboards instantly</p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 bg-red-900/20 border-red-500/50">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Video Title (Optional)</Label>
                  <Input
                    placeholder="Auto-generated based on type"
                    value={videoConfig.title}
                    onChange={(e) => setVideoConfig({...videoConfig, title: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white">Video Type</Label>
                  <Select value={videoConfig.video_type} onValueChange={(value) => setVideoConfig({...videoConfig, video_type: value})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {videoTypes.map(vt => (
                        <SelectItem key={vt.value} value={vt.value} className="text-white">
                          <div>
                            <div className="font-medium">{vt.label}</div>
                            <div className="text-xs text-gray-400">{vt.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Target Audience</Label>
                  <Select value={videoConfig.target_audience} onValueChange={(value) => setVideoConfig({...videoConfig, target_audience: value})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {audienceProfiles.map(ap => (
                        <SelectItem key={ap.value} value={ap.value} className="text-white">
                          <div>
                            <div className="font-medium">{ap.label}</div>
                            <div className="text-xs text-gray-400">{ap.focus}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Duration (minutes)</Label>
                    <Select value={videoConfig.duration} onValueChange={(value) => setVideoConfig({...videoConfig, duration: value})}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="2" className="text-white">2 minutes</SelectItem>
                        <SelectItem value="5" className="text-white">5 minutes</SelectItem>
                        <SelectItem value="10" className="text-white">10 minutes</SelectItem>
                        <SelectItem value="15" className="text-white">15 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Animation Style</Label>
                    <Select value={videoConfig.style} onValueChange={(value) => setVideoConfig({...videoConfig, style: value})}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="3d_rendered" className="text-white">3D Rendered</SelectItem>
                        <SelectItem value="2d_animated" className="text-white">2D Animated</SelectItem>
                        <SelectItem value="screen_capture" className="text-white">Screen Capture</SelectItem>
                        <SelectItem value="interactive_walkthrough" className="text-white">Interactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Production Method</Label>
                  <div className="grid gap-3">
                    {allProductionMethods.map(method => (
                      <div 
                        key={method.value}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          productionMethod === method.value 
                            ? 'border-purple-500 bg-purple-500/10' 
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => setProductionMethod(method.value)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-medium">{method.label}</h4>
                          <div className="text-right">
                            <div className="font-semibold text-green-400">
                              {method.price}
                            </div>
                            <div className="text-xs text-gray-400">{method.time}</div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{method.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {method.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-400">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={generateVideo} 
                  disabled={isGenerating}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      {currentStep || 'Generating with AI...'}
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      {productionMethod === 'add_service' ? 'Configure Service' : 'Generate Video Production'}
                    </>
                  )}
                </Button>

                {isGenerating && (
                  <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-gray-400 text-center">{currentStep}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    Generated Content
                  </h3>
                  {generatedVideo ? (
                    <div className="space-y-3">
                      <img 
                        src={generatedVideo.thumbnail_url} 
                        alt="Video thumbnail" 
                        className="w-full rounded-lg border border-gray-600"
                      />
                      <div className="space-y-2">
                        <h4 className="text-white font-medium">{generatedVideo.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {generatedVideo.duration_minutes} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {generatedVideo.target_audience}
                          </span>
                          {generatedVideo.status === 'rendering' ? (
                            <Badge className="bg-yellow-500/20 text-yellow-400">
                              <Loader className="w-3 h-3 mr-1 animate-spin" />
                              Rendering...
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500/20 text-green-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Ready
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-300">{generatedVideo.description}</p>
                      </div>
                      <div className="flex gap-2">
                        {generatedVideo.demo_mode && (
                          <Button size="sm" onClick={downloadScript} className="bg-blue-600 hover:bg-blue-700 flex-1">
                            <Download className="w-4 h-4 mr-1" />
                            Download Script
                          </Button>
                        )}
                        {generatedVideo.status === 'rendering' && (
                          <Button size="sm" disabled className="bg-gray-600/50 text-gray-400 flex-1 cursor-not-allowed">
                            <Play className="w-4 h-4 mr-1" />
                            View Video (Rendering)
                          </Button>
                        )}
                        {generatedVideo.status === 'completed' && generatedVideo.ready_for_download && (
                           <Button size="sm" className="bg-green-600 hover:bg-green-700 flex-1">
                           <Play className="w-4 h-4 mr-1" />
                           View Video
                         </Button>
                        )}
                      </div>
                      <Alert className="bg-blue-900/20 border-blue-500/30">
                        <AlertDescription className="text-blue-300 text-xs">
                          💡 {generatedVideo.demo_mode ? 
                          'Script and storyboard ready for production! Actual video rendering with integrated services coming soon.' :
                          `Video production is in progress using your ${generatedVideo.production_method} integration. Estimated completion: ${new Date(generatedVideo.estimated_completion).toLocaleTimeString()} on ${new Date(generatedVideo.estimated_completion).toLocaleDateString()}.`
                        }
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>AI-generated content will appear here</p>
                    </div>
                  )}
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <h3 className="text-purple-300 font-semibold mb-2">🎬 AI Video Studio</h3>
                  <ul className="text-sm text-purple-200 space-y-1">
                    <li>• Professional scripts in seconds</li>
                    <li>• Detailed scene-by-scene storyboards</li>
                    <li>• Customized for your audience</li>
                    <li>• Production-ready blueprints</li>
                    <li>• Full video rendering now available with connected services!</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
