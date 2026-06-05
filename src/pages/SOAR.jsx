
import React, { useState, useEffect, useCallback } from "react";
import { SOARPlaybook, AutomatedResponse, LearningInsight, OrganizationalKnowledge } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Brain, BookOpen, Lightbulb, Shield } from "lucide-react";
import AutomationMetrics from "../components/soar/AutomationMetrics";
import PlaybookCard from "../components/soar/PlaybookCard";
import PrebuiltPlaybooks from "../components/soar/PrebuiltPlaybooks";
import LearningInsights from "../components/soar/LearningInsights";
import KnowledgeBase from "../components/soar/KnowledgeBase";
import VisualSOARBuilder from "../components/soar/VisualSOARBuilder"; // Updated import
import LoadingSpinner from "../components/shared/LoadingSpinner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function SOARPage() {
  const [playbooks, setPlaybooks] = useState([]);
  const [responses, setResponses] = useState([]);
  const [insights, setInsights] = useState([]);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showVisualBuilder, setShowVisualBuilder] = useState(false); // New state
  const [selectedPlaybook, setSelectedPlaybook] = useState(null); // New state

  const mockPlaybooks = [
    { 
      id: '1', 
      playbook_name: 'Phishing Email Triage', 
      description: 'Automatically analyzes suspicious emails, detonates attachments, and blocks malicious indicators.',
      category: 'incident_response',
      industry_template: 'generic',
      trigger_conditions: ['email_reported'], 
      automation_steps: [], 
      success_rate: 98, 
      active: true, 
      severity_mapping: ['medium', 'high'],
      pre_built_template: true,
      learning_data: { execution_count: 247, common_variations: ['Attachment analysis', 'URL sandboxing'], improvement_suggestions: ['Add domain reputation check'] }
    },
    { 
      id: '2', 
      playbook_name: 'Malware Containment', 
      description: 'Isolates infected endpoints, blocks C2 communication, and creates an investigation ticket.',
      category: 'incident_response',
      industry_template: 'generic',
      trigger_conditions: ['malware_detected'], 
      automation_steps: [], 
      success_rate: 95, 
      active: true, 
      severity_mapping: ['high', 'critical'],
      pre_built_template: true,
      learning_data: { execution_count: 89, common_variations: ['Network isolation', 'Process termination'], improvement_suggestions: ['Add memory dump collection'] }
    },
    { 
      id: '3', 
      playbook_name: 'Insider Threat Lockout', 
      description: 'Disables user account upon detection of high-risk anomalous behavior and alerts HR.',
      category: 'user_management',
      industry_template: 'generic',
      trigger_conditions: ['ueba_high_risk'], 
      automation_steps: [], 
      success_rate: 99, 
      active: false, 
      severity_mapping: ['critical'],
      pre_built_template: true,
      learning_data: { execution_count: 12, common_variations: ['Gradual access removal', 'Immediate lockout'], improvement_suggestions: ['Add legal team notification'] }
    }
  ];

  const mockInsights = [
    {
      insight_id: 'ins_001',
      insight_type: 'workflow_optimization',
      source_activity: 'Phishing Email Response',
      team_member: 'alice.security@company.com',
      confidence_score: 87,
      insight_summary: 'Team consistently adds domain reputation check after email analysis - this should be automated',
      recommended_action: 'Add domain reputation step to phishing playbook',
      impact_assessment: 'medium',
      implementation_effort: 'low',
      status: 'new'
    },
    {
      insight_id: 'ins_002',
      insight_type: 'pattern_recognition',
      source_activity: 'Incident Investigation',
      team_member: 'bob.analyst@company.com',
      confidence_score: 92,
      insight_summary: 'Similar malware families consistently use specific registry keys - create detection rule',
      recommended_action: 'Build automated detection for registry key patterns',
      impact_assessment: 'high',
      implementation_effort: 'medium',
      status: 'approved'
    }
  ];

  const mockKnowledge = [
    {
      knowledge_id: 'kb_001',
      knowledge_type: 'lessons_learned',
      title: 'Phishing Campaign Response - Q1 2024',
      content: 'During the Q1 phishing campaign, we learned that checking sender reputation immediately after email analysis reduces false positives by 40%. Key steps: 1) Parse email headers, 2) Check sender domain age, 3) Cross-reference with threat intel feeds.',
      tags: ['phishing', 'email', 'threat-intel', 'false-positives'],
      source: 'incident_response',
      contributor: 'security.team@company.com',
      confidence_level: 95,
      usage_count: 23,
      effectiveness_rating: 4.8,
      auto_generated: false
    },
    {
      knowledge_id: 'kb_002',
      knowledge_type: 'best_practice',
      title: 'Malware Containment Best Practices',
      content: 'Best practices for malware containment based on 200+ incidents: 1) Isolate network first, 2) Preserve memory dump, 3) Check for lateral movement, 4) Update threat intelligence, 5) Document lessons learned.',
      tags: ['malware', 'containment', 'incident-response', 'best-practices'],
      source: 'ai_analysis',
      contributor: 'system',
      confidence_level: 89,
      usage_count: 45,
      effectiveness_rating: 4.6,
      auto_generated: true
    }
  ];

  const loadSOARData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [playbookData, responseData, insightData, knowledgeData] = await Promise.all([
        SOARPlaybook.list(),
        AutomatedResponse.list("-execution_details.start_time", 100),
        LearningInsight.list("-created_date", 50),
        OrganizationalKnowledge.list("-usage_count", 100)
      ]);
      
      setPlaybooks(playbookData.length > 0 ? playbookData : mockPlaybooks);
      setResponses(responseData);
      setInsights(insightData.length > 0 ? insightData : mockInsights);
      setKnowledgeBase(knowledgeData.length > 0 ? knowledgeData : mockKnowledge);
    } catch (error) {
      console.error("Error loading SOAR data:", error);
      setPlaybooks(mockPlaybooks);
      setInsights(mockInsights);
      setKnowledgeBase(mockKnowledge);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadSOARData();
  }, [loadSOARData]);

  if (showVisualBuilder) {
    return (
      <VisualSOARBuilder
        playbook={selectedPlaybook}
        onSave={async (playbook) => {
          await loadSOARData();
          setShowVisualBuilder(false);
          setSelectedPlaybook(null);
        }}
        onCancel={() => {
          setShowVisualBuilder(false);
          setSelectedPlaybook(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Intelligent SOAR Platform
            </h1>
            <p style={{color: 'var(--text-secondary)'}} className="text-sm md:text-base">
              Adaptive Self-Evolving Security Engine (ASES)
            </p>
          </div>
          <Button 
            onClick={() => setShowVisualBuilder(true)}
            className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Visual Playbook
          </Button>
        </div>

        <AutomationMetrics responses={responses} />

        <Tabs defaultValue="playbooks" className="w-full mt-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="playbooks">My Playbooks</TabsTrigger>
            <TabsTrigger value="prebuilt">Pre-built Templates</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          </TabsList>
          
          <TabsContent value="playbooks" className="mt-6">
            {isLoading ? (
              <LoadingSpinner message="Loading playbooks..." />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playbooks.map(playbook => (
                  <PlaybookCard key={playbook.id} playbook={playbook} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="prebuilt" className="mt-6">
            <PrebuiltPlaybooks />
          </TabsContent>
          
          <TabsContent value="insights" className="mt-6">
            <LearningInsights insights={insights} />
          </TabsContent>
          
          <TabsContent value="knowledge" className="mt-6">
            <KnowledgeBase knowledgeBase={knowledgeBase} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
