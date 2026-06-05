
import React, { useState, useEffect } from "react";
import { CIPipeline } from "@/entities/CIPipeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  PlayCircle,
  RefreshCw,
  GitBranch,
  Package,
  Rocket,
  FileCode,
  Settings,
  Terminal,
  Download
} from "lucide-react";
import PipelineCard from "../components/automation/PipelineCard";
import PipelineBuilder from "../components/automation/PipelineBuilder";
import PipelineExecutionLogs from "../components/automation/PipelineExecutionLogs";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import BuildScriptGenerator from "../components/automation/BuildScriptGenerator";
import BuildCommandGenerator from "../components/automation/BuildCommandGenerator";

const mockPipelines = [
  {
    pipeline_id: 'pipeline_staging',
    name: 'Staging Deployment',
    description: 'Automated staging build with tests and Docker packaging',
    pipeline_type: 'integrations',
    repository_url: 'https://github.com/cyberdojo/outpost-zero',
    branch: 'staging',
    trigger_conditions: ['code_commit', 'manual'],
    stages: [
      { stage_name: 'Backend Tests', stage_type: 'test', success_criteria: 'All tests pass', commands: ['npm run test:backend'] },
      { stage_name: 'Frontend Build', stage_type: 'deploy', success_criteria: 'Build succeeds', commands: ['npm run build:frontend'] },
      { stage_name: 'Package Artifacts', stage_type: 'deploy', success_criteria: 'Artifacts created', commands: ['npm run package'] },
      { stage_name: 'Docker Build', stage_type: 'deploy', success_criteria: 'Image tagged', commands: ['docker build -t outpostzero:staging .'] }
    ],
    last_execution: {
      execution_id: 'exec_001',
      status: 'success',
      start_time: new Date(Date.now() - 3600000).toISOString(),
      end_time: new Date(Date.now() - 3000000).toISOString(),
      logs: 'Build completed successfully. Image: outpostzero:staging'
    },
    security_gates: [
      { gate_name: 'SAST Scan', gate_type: 'sast', threshold: 0, required: true },
      { gate_name: 'Dependency Check', gate_type: 'dependency_check', threshold: 0, required: true },
      { gate_name: 'Secrets Scan', gate_type: 'secrets_scan', threshold: 0, required: true }
    ],
    auto_rollback_enabled: true,
    notification_recipients: ['devops@cyberdojo.com']
  },
  {
    pipeline_id: 'pipeline_production',
    name: 'Production Deployment',
    description: 'Production deployment with comprehensive testing and approval gates',
    pipeline_type: 'integrations',
    repository_url: 'https://github.com/cyberdojo/outpost-zero',
    branch: 'main',
    trigger_conditions: ['manual'],
    stages: [
      { stage_name: 'Full Test Suite', stage_type: 'test', success_criteria: 'All tests pass', commands: ['npm run test:all'] },
      { stage_name: 'Security Scan', stage_type: 'security_scan', success_criteria: 'No critical vulnerabilities', commands: ['npm run security:scan'] },
      { stage_name: 'Build Production', stage_type: 'deploy', success_criteria: 'Build succeeds', commands: ['npm run build:production'] },
      { stage_name: 'Docker Build & Push', stage_type: 'deploy', success_criteria: 'Image pushed to registry', commands: ['docker build -t outpostzero:latest .', 'docker push outpostzero:latest'] }
    ],
    last_execution: {
      execution_id: 'exec_002',
      status: 'success',
      start_time: new Date(Date.now() - 86400000).toISOString(),
      end_time: new Date(Date.now() - 86000000).toISOString(),
      logs: 'Production deployment completed. Version: 1.5.0'
    },
    security_gates: [
      { gate_name: 'SAST Scan', gate_type: 'sast', threshold: 0, required: true },
      { gate_name: 'DAST Scan', gate_type: 'dast', threshold: 0, required: true },
      { gate_name: 'Dependency Check', gate_type: 'dependency_check', threshold: 0, required: true },
      { gate_name: 'Secrets Scan', gate_type: 'secrets_scan', threshold: 0, required: true },
      { gate_name: 'Compliance Check', gate_type: 'compliance_check', threshold: 100, required: true }
    ],
    auto_rollback_enabled: true,
    notification_recipients: ['devops@cyberdojo.com', 'security@cyberdojo.com']
  }
];

export default function DevSecOpsPage() {
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPipelineBuilder, setShowPipelineBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showBuildScripts, setShowBuildScripts] = useState(false);
  const [buildConfig, setBuildConfig] = useState({
    app: 'Outpost Zero',
    env: 'staging',
    branch: 'staging',
    clean: true,
    no_cache: true,
    run_tests: true,
    frontend_build: true,
    backend_build: true,
    docker: true,
    docker_tag: 'outpostzero:staging',
    package_artifacts: true,
    artifact_name: 'outpostzero_build',
    notify: '@asaad.morman'
  });

  useEffect(() => {
    loadPipelines();
  }, []);

  const loadPipelines = async () => {
    setIsLoading(true);
    try {
      const data = await CIPipeline.list("-last_execution.start_time");
      setPipelines(data.length > 0 ? data : mockPipelines);
      if (data.length > 0 || mockPipelines.length > 0) {
        setSelectedPipeline(data[0] || mockPipelines[0]);
      }
    } catch (error) {
      console.error("Error loading pipelines:", error);
      setPipelines(mockPipelines);
      setSelectedPipeline(mockPipelines[0]);
    }
    setIsLoading(false);
  };

  const triggerPipeline = async (pipeline) => {
    // Show build details
    setShowBuildScripts(true);
    setBuildConfig(prevConfig => ({
      ...prevConfig,
      env: pipeline.branch,
      branch: pipeline.branch,
      docker_tag: pipeline.branch === 'staging' ? 'outpostzero:staging' : 'outpostzero:latest'
    }));
    setActiveTab('build-scripts'); // Automatically switch to build scripts tab

    alert(`Pipeline Trigger Request:\n\n` +
      `Pipeline: ${pipeline.name}\n` +
      `Branch: ${pipeline.branch}\n` +
      `Docker Tag: ${pipeline.branch === 'staging' ? 'outpostzero:staging' : 'outpostzero:latest'}\n\n` +
      `To execute this build:\n` +
      `1. Download the build script from the "Build Scripts" tab\n` +
      `2. Run: chmod +x build.sh && ./build.sh\n` +
      `3. Or copy commands from the command generator\n\n` +
      `Build configuration has been loaded in the Build Scripts tab.`
    );
    // In production: await CIPipeline.trigger(pipeline.pipeline_id);
    await loadPipelines();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'running': return <Clock className="w-5 h-5 text-blue-400 animate-spin" />;
      default: return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      success: 'bg-green-500/20 text-green-300 border-green-500/50',
      failed: 'bg-red-500/20 text-red-300 border-red-500/50',
      running: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      cancelled: 'bg-gray-500/20 text-gray-300 border-gray-500/50'
    };
    return <Badge variant="outline" className={colors[status] || colors.cancelled}>{status}</Badge>;
  };

  const downloadCIConfig = () => {
    const config = `# Outpost Zero CI/CD Pipeline Configuration
# GitHub Actions Workflow

name: Outpost Zero CI/CD

on:
  push:
    branches: [ staging, main ]
  pull_request:
    branches: [ staging, main ]
  workflow_dispatch:

env:
  DOCKER_REGISTRY: ghcr.io
  IMAGE_NAME: outpostzero

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run backend tests
        run: npm run test:backend
      - name: Run frontend tests
        run: npm run test:frontend

  security-scan:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - name: Run SAST scan
        run: npm run security:sast
      - name: Dependency check
        run: npm audit
      - name: Secrets scan
        uses: trufflesecurity/trufflehog@main

  build-staging:
    runs-on: ubuntu-latest
    needs: [test, security-scan]
    if: github.ref == 'refs/heads/staging'
    steps:
      - uses: actions/checkout@v3
      - name: Build frontend
        run: npm run build
      - name: Build Docker image
        run: docker build --no-cache -t outpostzero:staging .
      - name: Push to registry
        run: |
          echo \${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u \${{ github.actor }} --password-stdin
          docker tag outpostzero:staging \${{ env.DOCKER_REGISTRY }}/\${{ github.repository }}/\${{ env.IMAGE_NAME }}:staging
          docker push \${{ env.DOCKER_REGISTRY }}/\${{ github.repository }}/\${{ env.IMAGE_NAME }}:staging

  build-production:
    runs-on: ubuntu-latest
    needs: [test, security-scan]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Build frontend
        run: npm run build:production
      - name: Build Docker image
        run: docker build --no-cache -t outpostzero:latest .
      - name: Push to registry
        run: |
          echo \${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u \${{ github.actor }} --password-stdin
          docker tag outpostzero:latest \${{ env.DOCKER_REGISTRY }}/\${{ github.repository }}/\${{ env.IMAGE_NAME }}:latest
          docker push \${{ env.DOCKER_REGISTRY }}/\${{ github.repository }}/\${{ env.IMAGE_NAME }}:latest
`;

    const blob = new Blob([config], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'github-actions.yml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">DevSecOps CI/CD Pipelines</h1>
            <p style={{color: 'var(--text-secondary)'}} className="text-sm md:text-base">
              Automated testing, security scanning, and deployment pipelines
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={downloadCIConfig}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Config
            </Button>
            <Button 
              onClick={() => setShowPipelineBuilder(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Create Pipeline
            </Button>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading CI/CD pipelines..." />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
              <TabsTrigger value="logs">Execution Logs</TabsTrigger>
              <TabsTrigger value="build-scripts">Build Scripts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card className="border-gray-700 bg-gray-800/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Pipelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{pipelines.length}</div>
                  </CardContent>
                </Card>

                <Card className="border-gray-700 bg-gray-800/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-400">Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400">
                      {pipelines.length > 0 ? Math.round((pipelines.filter(p => p.last_execution?.status === 'success').length / pipelines.length) * 100) : 0}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-700 bg-gray-800/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-400">Active Deployments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-400">
                      {pipelines.filter(p => p.last_execution?.status === 'running').length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-gray-700 bg-gray-800/50 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {pipelines.map(pipeline => (
                      <Card key={pipeline.pipeline_id} className="border-gray-600 bg-gray-900/50">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-white font-semibold mb-1">{pipeline.name}</h3>
                              <p className="text-gray-400 text-sm">{pipeline.branch}</p>
                            </div>
                            {getStatusBadge(pipeline.last_execution?.status || 'unknown')}
                          </div>
                          <Button
                            onClick={() => triggerPipeline(pipeline)}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Trigger Deployment
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white">CI/CD Best Practices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Automated Testing</h4>
                      <p className="text-gray-400 text-sm">Run comprehensive test suites on every commit</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Security Scanning</h4>
                      <p className="text-gray-400 text-sm">SAST, DAST, dependency checks, and secrets scanning</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Immutable Artifacts</h4>
                      <p className="text-gray-400 text-sm">Build once, deploy everywhere with Docker containers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Automatic Rollback</h4>
                      <p className="text-gray-400 text-sm">Revert to previous version if deployment fails</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pipelines" className="mt-6">
              <div className="grid gap-4">
                {pipelines.map(pipeline => (
                  <PipelineCard 
                    key={pipeline.pipeline_id}
                    pipeline={pipeline}
                    onTrigger={() => triggerPipeline(pipeline)}
                    onSelect={() => setSelectedPipeline(pipeline)}
                    isSelected={selectedPipeline?.pipeline_id === pipeline.pipeline_id}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="logs" className="mt-6">
              {selectedPipeline ? (
                <PipelineExecutionLogs pipeline={selectedPipeline} />
              ) : (
                <Card className="border-gray-700 bg-gray-800/50">
                  <CardContent className="pt-6 text-center text-gray-400">
                    Select a pipeline to view execution logs
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="build-scripts" className="mt-6">
              <div className="space-y-6">
                <BuildCommandGenerator config={buildConfig} />
                <BuildScriptGenerator 
                  environment={buildConfig.env}
                  dockerTag={buildConfig.docker_tag}
                  notifyUser={buildConfig.notify}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}

        {showPipelineBuilder && (
          <PipelineBuilder 
            onClose={() => {
              setShowPipelineBuilder(false);
              loadPipelines();
            }}
          />
        )}
      </div>
    </div>
  );
}
