import React, { useState, useEffect } from "react";
import { IncidentPlaybook } from "@/entities/IncidentPlaybook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Play, 
  Plus, 
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Settings,
  Download,
  Copy
} from "lucide-react";
import PlaybookLibrary from "../components/playbooks/PlaybookLibrary";
import PlaybookBuilder from "../components/playbooks/PlaybookBuilder";
import PlaybookExecutor from "../components/playbooks/PlaybookExecutor";
import PlaybookTemplates from "../components/playbooks/PlaybookTemplates";
import PlaybookMetrics from "../components/playbooks/PlaybookMetrics";
import LoadingSpinner from "../components/shared/LoadingSpinner";

export default function IncidentPlaybooksPage() {
  const [playbooks, setPlaybooks] = useState([]);
  const [selectedPlaybook, setSelectedPlaybook] = useState(null);
  const [executingPlaybook, setExecutingPlaybook] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("library");

  useEffect(() => {
    loadPlaybooks();
  }, []);

  const loadPlaybooks = async () => {
    setIsLoading(true);
    try {
      const data = await IncidentPlaybook.list("-created_date");
      setPlaybooks(data.length > 0 ? data : getMockPlaybooks());
    } catch (error) {
      console.error("Error loading playbooks:", error);
      setPlaybooks(getMockPlaybooks());
    }
    setIsLoading(false);
  };

  const getMockPlaybooks = () => [
    {
      id: "pb_001",
      playbook_id: "PB-PHI-001",
      name: "Phishing Email Response",
      description: "Comprehensive playbook for investigating and responding to phishing attacks",
      incident_type: "phishing",
      severity_levels: ["medium", "high", "critical"],
      steps: [
        {
          step_number: 1,
          title: "Initial Triage",
          description: "Review the reported phishing email and assess threat level",
          action_type: "manual",
          assigned_role: "security_analyst",
          estimated_duration_minutes: 10,
          checklist_items: [
            "Verify email headers and sender information",
            "Check for malicious links or attachments",
            "Assess potential impact and scope"
          ],
          documentation_required: true,
          success_criteria: "Threat level determined and documented"
        },
        {
          step_number: 2,
          title: "Isolate Affected Users",
          description: "Identify and isolate users who may have been affected",
          action_type: "automated",
          assigned_role: "system_admin",
          estimated_duration_minutes: 5,
          automation_config: {
            soar_playbook_id: "soar_isolation_001",
            action_name: "isolate_user_accounts"
          },
          success_criteria: "All affected accounts isolated"
        },
        {
          step_number: 3,
          title: "Block Malicious Indicators",
          description: "Add malicious IPs, domains, and hashes to blocklists",
          action_type: "automated",
          assigned_role: "security_analyst",
          estimated_duration_minutes: 5,
          automation_config: {
            integration_name: "firewall",
            action_name: "add_blocklist"
          }
        },
        {
          step_number: 4,
          title: "User Communication",
          description: "Send security awareness communication to affected users",
          action_type: "manual",
          assigned_role: "incident_commander",
          estimated_duration_minutes: 15,
          checklist_items: [
            "Draft communication message",
            "Get approval from management",
            "Send notification to affected users"
          ]
        },
        {
          step_number: 5,
          title: "Post-Incident Review",
          description: "Document lessons learned and update security controls",
          action_type: "manual",
          assigned_role: "incident_commander",
          estimated_duration_minutes: 30,
          documentation_required: true
        }
      ],
      tools_required: ["Email Security Gateway", "SIEM", "Firewall", "EDR"],
      compliance_requirements: ["GDPR", "SOC 2"],
      metrics: {
        total_executions: 23,
        successful_executions: 21,
        average_duration_minutes: 65,
        average_rating: 4.5
      },
      is_template: true,
      template_source: "SANS",
      status: "active",
      tags: ["phishing", "email", "user-awareness"]
    },
    {
      id: "pb_002",
      playbook_id: "PB-MAL-001",
      name: "Malware Outbreak Response",
      description: "Rapid response procedures for containing and eradicating malware outbreaks",
      incident_type: "malware_outbreak",
      severity_levels: ["high", "critical"],
      steps: [
        {
          step_number: 1,
          title: "Identify Patient Zero",
          description: "Determine the initial infection source",
          action_type: "manual",
          assigned_role: "security_analyst",
          estimated_duration_minutes: 15
        },
        {
          step_number: 2,
          title: "Network Segmentation",
          description: "Isolate affected network segments",
          action_type: "automated",
          assigned_role: "network_engineer",
          estimated_duration_minutes: 10,
          automation_config: {
            integration_name: "network",
            action_name: "isolate_segment"
          }
        },
        {
          step_number: 3,
          title: "Endpoint Quarantine",
          description: "Quarantine all infected endpoints",
          action_type: "automated",
          assigned_role: "system_admin",
          estimated_duration_minutes: 5
        },
        {
          step_number: 4,
          title: "Malware Analysis",
          description: "Submit samples for analysis",
          action_type: "hybrid",
          assigned_role: "security_analyst",
          estimated_duration_minutes: 30
        },
        {
          step_number: 5,
          title: "System Remediation",
          description: "Clean or reimage affected systems",
          action_type: "manual",
          assigned_role: "system_admin",
          estimated_duration_minutes: 120
        }
      ],
      tools_required: ["EDR", "Sandbox", "Network Firewall", "SIEM"],
      metrics: {
        total_executions: 8,
        successful_executions: 7,
        average_duration_minutes: 180,
        average_rating: 4.2
      },
      is_template: true,
      template_source: "NIST",
      status: "active",
      tags: ["malware", "outbreak", "containment"]
    },
    {
      id: "pb_003",
      playbook_id: "PB-RAN-001",
      name: "Ransomware Incident Response",
      description: "Critical response procedures for ransomware attacks",
      incident_type: "ransomware",
      severity_levels: ["critical"],
      steps: [
        {
          step_number: 1,
          title: "Emergency Response Activation",
          description: "Activate incident response team and executive notification",
          action_type: "manual",
          assigned_role: "incident_commander",
          estimated_duration_minutes: 5
        },
        {
          step_number: 2,
          title: "Immediate Isolation",
          description: "Disconnect all affected systems from network",
          action_type: "automated",
          assigned_role: "network_engineer",
          estimated_duration_minutes: 5,
          automation_config: {
            integration_name: "network",
            action_name: "emergency_isolation"
          }
        },
        {
          step_number: 3,
          title: "Backup Verification",
          description: "Verify backup integrity and isolation",
          action_type: "manual",
          assigned_role: "system_admin",
          estimated_duration_minutes: 15
        },
        {
          step_number: 4,
          title: "Law Enforcement Notification",
          description: "Contact appropriate law enforcement agencies",
          action_type: "approval_required",
          assigned_role: "executive",
          estimated_duration_minutes: 30
        },
        {
          step_number: 5,
          title: "Recovery Operations",
          description: "Begin system recovery from clean backups",
          action_type: "manual",
          assigned_role: "system_admin",
          estimated_duration_minutes: 240
        }
      ],
      tools_required: ["EDR", "Backup System", "Network Firewall", "SIEM"],
      compliance_requirements: ["GDPR", "HIPAA", "PCI-DSS"],
      metrics: {
        total_executions: 2,
        successful_executions: 2,
        average_duration_minutes: 300,
        average_rating: 5.0
      },
      is_template: true,
      template_source: "CISA",
      status: "active",
      tags: ["ransomware", "critical", "executive"]
    }
  ];

  const handleCreatePlaybook = () => {
    setShowBuilder(true);
    setSelectedPlaybook(null);
  };

  const handleEditPlaybook = (playbook) => {
    setSelectedPlaybook(playbook);
    setShowBuilder(true);
  };

  const handleExecutePlaybook = (playbook, incidentId = null) => {
    setExecutingPlaybook({ playbook, incidentId });
    setActiveTab("executor");
  };

  const handlePlaybookSaved = async (playbook) => {
    await loadPlaybooks();
    setShowBuilder(false);
    setSelectedPlaybook(null);
  };

  const handleExecutionComplete = async () => {
    await loadPlaybooks();
    setExecutingPlaybook(null);
  };

  const filteredPlaybooks = playbooks.filter(pb => {
    const matchesSearch = pb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pb.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || pb.incident_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: playbooks.length,
    active: playbooks.filter(p => p.status === "active").length,
    templates: playbooks.filter(p => p.is_template).length,
    totalExecutions: playbooks.reduce((sum, p) => sum + (p.metrics?.total_executions || 0), 0)
  };

  if (showBuilder) {
    return (
      <PlaybookBuilder
        playbook={selectedPlaybook}
        onSave={handlePlaybookSaved}
        onCancel={() => {
          setShowBuilder(false);
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
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Incident Playbooks</h1>
            <p style={{color: 'var(--text-secondary)'}} className="text-sm md:text-base">
              Define, store, and execute step-by-step incident response procedures
            </p>
          </div>
          <Button 
            onClick={handleCreatePlaybook}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Playbook
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Total Playbooks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{stats.active}</div>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{stats.templates}</div>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Total Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{stats.totalExecutions}</div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading incident playbooks..." />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
              <TabsTrigger value="library">
                <BookOpen className="w-4 h-4 mr-2" />
                Library
              </TabsTrigger>
              <TabsTrigger value="templates">
                <Copy className="w-4 h-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="executor">
                <Play className="w-4 h-4 mr-2" />
                Executor
              </TabsTrigger>
              <TabsTrigger value="metrics">
                <TrendingUp className="w-4 h-4 mr-2" />
                Metrics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="mt-6">
              <PlaybookLibrary
                playbooks={filteredPlaybooks}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterType={filterType}
                onFilterChange={setFilterType}
                onEdit={handleEditPlaybook}
                onExecute={handleExecutePlaybook}
                onDelete={async (id) => {
                  await IncidentPlaybook.delete(id);
                  await loadPlaybooks();
                }}
              />
            </TabsContent>

            <TabsContent value="templates" className="mt-6">
              <PlaybookTemplates
                onUseTemplate={async (template) => {
                  setSelectedPlaybook(template);
                  setShowBuilder(true);
                }}
                onExecute={handleExecutePlaybook}
              />
            </TabsContent>

            <TabsContent value="executor" className="mt-6">
              {executingPlaybook ? (
                <PlaybookExecutor
                  playbook={executingPlaybook.playbook}
                  incidentId={executingPlaybook.incidentId}
                  onComplete={handleExecutionComplete}
                  onCancel={() => setExecutingPlaybook(null)}
                />
              ) : (
                <Card className="border-gray-700 bg-gray-800/50">
                  <CardContent className="pt-6 text-center">
                    <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No Active Execution</h3>
                    <p className="text-gray-400 mb-4">Select a playbook from the library to execute it</p>
                    <Button onClick={() => setActiveTab("library")} className="bg-blue-600 hover:bg-blue-700">
                      Go to Library
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="metrics" className="mt-6">
              <PlaybookMetrics playbooks={playbooks} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}