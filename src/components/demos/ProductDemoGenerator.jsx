
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Loader, Video, Wand2, Shield, Brain, Users, AlertTriangle, CheckCircle, ArrowLeft, ArrowRight, X, MousePointerClick } from 'lucide-react';
import { InvokeLLM, GenerateImage } from '@/integrations/Core';

// --- Mock UI Components ---
const MockDashboardUI = ({ highlight, mockData, onElementClick }) => {
  const isHighlighted = (id) => highlight === id;

  const getHighlightClass = (id) => {
    return isHighlighted(id) ? 'ring-2 ring-offset-4 ring-offset-gray-900 ring-blue-500 transition-all duration-300 scale-105' : '';
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-4">SOC Dashboard</h2>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {mockData.metrics.map(metric => (
          <Card
            key={metric.id}
            data-testid={metric.id}
            onClick={() => onElementClick(metric.id)}
            className={`bg-gray-900/50 border-gray-700 cursor-pointer ${getHighlightClass(metric.id)}`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <h3 className="text-lg font-bold text-white mb-3">Active Incidents</h3>
      <div className="space-y-3">
        {mockData.incidents.map(incident => (
          <div
            key={incident.id}
            data-testid={incident.id}
            onClick={() => onElementClick(incident.id)}
            className={`p-3 rounded-lg flex justify-between items-center bg-gray-900/50 border-gray-700 cursor-pointer ${getHighlightClass(incident.id)}`}
          >
            <div>
              <p className="font-medium text-white">{incident.title}</p>
              <p className="text-sm text-gray-400">Severity: {incident.severity}</p>
            </div>
            <Badge className={
              incident.status === 'Contained' ? 'bg-green-500/20 text-green-300' :
              incident.status === 'Open' ? 'bg-red-500/20 text-red-300' : 'bg-gray-600'
            }>
              {incident.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};


// --- Main Component ---
export default function ProductDemoGenerator({ demoType, onDemoReady }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDemo, setGeneratedDemo] = useState(null);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

  // This state will now be dynamically populated by the AI
  const [mockUiData, setMockUiData] = useState({
    metrics: [],
    incidents: []
  });

  // Storing the initial state to reset the demo
  const [initialUiData, setInitialUiData] = useState(null);


  const demoConfigs = {
    'platform-overview': {
      title: 'Outpost Zero Platform Overview',
      description: 'Complete walkthrough of the unified security platform',
      duration: 8,
      features: ['Dashboard Navigation', 'Incident Response', 'Threat Intelligence', 'AI Advisories'],
      icon: Shield,
      color: 'blue'
    },
    'ransomware-simulation': {
      title: 'Ransomware Incident Response',
      description: 'Live simulation of ransomware detection and automated response',
      duration: 5,
      features: ['Real-time Detection', 'Containment Actions', 'Recovery Process', 'Post-Incident Analysis'],
      icon: AlertTriangle,
      color: 'red'
    },
    'insider-threat': {
      title: 'Insider Threat Detection',
      description: 'Advanced behavioral analytics identifying insider threats',
      duration: 7,
      features: ['User Behavior Analysis', 'Risk Scoring', 'Investigation Tools', 'Compliance Reporting'],
      icon: Users,
      color: 'yellow'
    },
    'ai-response': {
      title: 'AI-Powered Incident Response',
      description: 'Autonomous AI handling security incidents from detection to resolution',
      duration: 6,
      features: ['Automated Triage', 'Intelligent Escalation', 'Response Orchestration', 'Learning Integration'],
      icon: Brain,
      color: 'purple'
    }
  };

  const generateDemo = async () => {
    setIsGenerating(true);
    setGeneratedDemo(null);

    try {
      const config = demoConfigs[demoType];

      const scriptResponse = await InvokeLLM({
        prompt: `Create a script and corresponding UI data for an interactive cybersecurity demo: "${config.title}".

        **Scenario Context:** ${config.description}
        **Key Features to Showcase:** ${config.features.join(', ')}

        **Your task is to provide TWO main components in JSON format:**

        1.  **initial_ui_data**: A JSON object representing the initial state of the SOC Dashboard UI. This data should be realistic and relevant to the scenario described. It must contain:
            *   \`metrics\`: An array of objects, each with \`id\` (e.g., "metric-active-alerts"), \`label\` (e.g., "Active Alerts"), and \`value\` (number).
            *   \`incidents\`: An array of objects, each with \`id\` (e.g., "incident-ransomware-01"), \`title\` (descriptive name), \`severity\` (e.g., "Critical", "High", "Medium", "Low"), and \`status\` (e.g., "Open", "Contained", "Resolved").
            *   **Important:** The \`id\`s for metrics and incidents should be unique and descriptive.

        2.  **demo_segments**: An array of steps for the interactive demo script. Each step must have:
            *   \`narration\`: The spoken script for that step.
            *   \`action\`: "highlight" (to draw attention to a UI element) or "update_status" (to change the status of an incident).
            *   \`target_id\`: **Crucially, this ID must exactly match an \`id\` you defined in the \`initial_ui_data\` (e.g., "metric-active-alerts" or "incident-ransomware-01").**
            *   \`details\`: (Only for \`action: "update_status"\`) The new status text for the \`target_id\` incident (e.g., "Contained", "Resolved").

        **Example for a step (using a generated ID):**
        { "action": "highlight", "target_id": "incident-ransomware-01", "narration": "Here we observe a critical ransomware incident. Let's click to begin our investigation." }

        **Considerations for generating data and script:**
        *   **Ransomware Simulation:** \`initial_ui_data\` might include a 'Critical Events' metric with a high value, and an 'Open' incident like 'WannaCry Detected on HR-Server-03'. The script would guide containing and resolving it.
        *   **Insider Threat:** \`initial_ui_data\` might show a 'High-Risk User Score' metric and an 'Open' incident like 'Unusual Data Exfiltration by [Employee Name]'. The script would highlight investigation tools.
        *   **AI-Powered Response:** \`initial_ui_data\` could show multiple open incidents. The script would narrate how AI autonomously processes and changes their statuses.

        Ensure the script logically walks the user through the scenario using the UI data you provide.`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            opening_hook: { type: "string" },
            initial_ui_data: {
                type: "object",
                properties: {
                    metrics: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                label: { type: "string" },
                                value: { type: "number" }
                            },
                            required: ["id", "label", "value"]
                        }
                    },
                    incidents: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                title: { type: "string" },
                                severity: { type: "string" },
                                status: { type: "string" }
                            },
                            required: ["id", "title", "severity", "status"]
                        }
                    }
                },
                required: ["metrics", "incidents"]
            },
            demo_segments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  narration: { type: "string" },
                  action: { "type": "string", "enum": ["highlight", "update_status"] },
                  target_id: { "type": "string" }, // No enum here, as IDs are dynamic
                  details: { "type": "string" }
                },
                required: ["narration", "action", "target_id"]
              }
            },
            closing_cta: { type: "string" }
          },
          required: ["title", "opening_hook", "initial_ui_data", "demo_segments", "closing_cta"]
        }
      });

      const thumbnailResponse = await GenerateImage({
        prompt: `Professional cybersecurity demo thumbnail for "${config.title}". Style: Modern dark theme with ${config.color} accents, showing a security operations dashboard.`
      });

      // Store the generated initial UI data
      setInitialUiData(scriptResponse.initial_ui_data);

      const newGeneratedDemo = { // Create a temporary object to pass to onDemoReady
        ...config,
        script: scriptResponse,
        thumbnail_url: thumbnailResponse.url,
        initial_ui_data: scriptResponse.initial_ui_data // also save it here for reset
      };
      setGeneratedDemo(newGeneratedDemo);

      if (onDemoReady) onDemoReady(newGeneratedDemo); // Pass the updated generatedDemo

    } catch (error) {
      console.error('Error generating demo:', error);
      // Fallback logic can be added here if needed
    }

    setIsGenerating(false);
  };

  const handleStartDemo = () => {
    // Reset the UI to the specific initial state for this demo
    setMockUiData(generatedDemo.initial_ui_data);
    setCurrentSegmentIndex(0);
    setIsDemoPlaying(true);
  };

  const handleEndDemo = () => {
    setIsDemoPlaying(false);
  };

  const handleElementClick = (elementId) => {
    if (!isDemoPlaying || !generatedDemo) return;

    const currentSegment = generatedDemo.script.demo_segments[currentSegmentIndex];
    if (currentSegment.target_id === elementId) {
      // If it's an update action, apply it to the mock state
      if (currentSegment.action === 'update_status') {
        setMockUiData(prevData => ({
          ...prevData,
          incidents: prevData.incidents.map(inc =>
            inc.id === elementId ? { ...inc, status: currentSegment.details } : inc
          )
        }));
      }

      // Advance to the next segment
      if (currentSegmentIndex < generatedDemo.script.demo_segments.length - 1) {
        setCurrentSegmentIndex(currentSegmentIndex + 1);
      } else {
        handleEndDemo();
      }
    }
  };

  const renderInteractiveDemo = () => {
    if (!generatedDemo || !generatedDemo.script || !generatedDemo.script.demo_segments) {
      return <p className="text-white">Error: Demo script not loaded.</p>;
    }
    const IconComponent = generatedDemo.icon;
    const currentSegment = generatedDemo.script.demo_segments[currentSegmentIndex];
    const totalSegments = generatedDemo.script.demo_segments.length;
    const progress = ((currentSegmentIndex + 1) / totalSegments) * 100;

    return (
      <Card className="border-gray-700 bg-gray-900/80 backdrop-blur-sm w-full max-w-6xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-${generatedDemo.color}-500/20`}>
              <IconComponent className={`w-6 h-6 text-${generatedDemo.color}-400`} />
            </div>
            {generatedDemo.title}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={handleEndDemo} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel: Narration & Instructions */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-white">Step {currentSegmentIndex + 1} / {totalSegments}</h3>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className={`bg-${generatedDemo.color}-500 h-2.5 rounded-full`} style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>
            <div className="p-4 bg-gray-800/70 rounded-lg border border-gray-700 h-64 overflow-y-auto">
              <p className="text-gray-300 leading-relaxed">{currentSegment.narration}</p>
            </div>
            <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500/50 text-center">
              <MousePointerClick className="w-6 h-6 mx-auto text-blue-400 mb-2" />
              <p className="font-semibold text-white">Click the highlighted element to continue.</p>
            </div>
          </div>
          {/* Right Panel: Mock UI */}
          <div className="lg:col-span-2">
            <MockDashboardUI
              highlight={currentSegment.target_id}
              mockData={mockUiData}
              onElementClick={handleElementClick}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isDemoPlaying) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {renderInteractiveDemo()}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!generatedDemo && (
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-400" />
              Generate Interactive Product Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Create a unique, AI-powered interactive demo for a specific security scenario.
            </p>
            <Button
              onClick={generateDemo}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <><Loader className="w-4 h-4 mr-2 animate-spin" /> Generating Demo...</>
              ) : (
                <><Video className="w-4 h-4 mr-2" /> Generate Product Demo</>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {generatedDemo && !isDemoPlaying && (
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white">Your Demo is Ready</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <img src={generatedDemo.thumbnail_url} alt="Demo thumbnail" className="rounded-lg mb-4 aspect-video object-cover" />
            <h3 className="text-xl font-bold text-white mb-2">{generatedDemo.title}</h3>
            <p className="text-gray-400 mb-4">{generatedDemo.description}</p>
            <Button onClick={handleStartDemo} className={`bg-${generatedDemo.color}-600 hover:bg-${generatedDemo.color}-700`}>
              <Play className="w-5 h-5 mr-2" />
              Start Interactive Demo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
