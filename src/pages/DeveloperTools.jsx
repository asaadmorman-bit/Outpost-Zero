import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Terminal, 
  Copy, 
  Download, 
  CheckCircle,
  Code,
  Rocket,
  Settings,
  FileCode
} from 'lucide-react';

export default function DeveloperToolsPage() {
  const [copiedItem, setCopiedItem] = useState(null);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const base44CLI = `#!/usr/bin/env bash
set -euo pipefail

# Outpost Zero - Base44 CLI Wrapper
# Quick access to common build, setup, and deployment commands

CMD="\${1:-}"; shift || true

case "$CMD" in
  build)
    bash scripts/build.sh "$@"
    ;;
  
  setup)
    bash scripts/setup_staging.sh "$@"
    ;;
  
  deploy)
    bash scripts/setup_staging.sh --env staging --deploy k8s --verify --report "$@"
    ;;
  
  video)
    echo "Opening Video Orchestrator..."
    echo "Navigate to: Training → Video Generation in the app"
    echo "Or run: node scripts/generate-videos.js $@"
    ;;
  
  test)
    npm run test:all "$@"
    ;;
  
  *)
    cat << 'EOF'
Outpost Zero - Base44 CLI

Usage: ./base44 <command> [options]

Commands:
  build                    Build the application
    Options: --env, --clean, --docker, --no-cache
    
  setup                    Setup staging environment
    Options: --env, --deploy, --seed, --purge-placeholders,
             --autocapture, --verify, --report, --dry-run
    
  deploy                   Deploy to staging with verification
    
  video                    Generate training videos
    
  test                     Run test suite

Examples:
  ./base44 build --env staging --docker
  ./base44 setup --seed --autocapture --verify --report
  ./base44 deploy
  ./base44 video
EOF
    exit 1
    ;;
esac`;

  const packageJsonScripts = `{
  "scripts": {
    "build:staging": "bash scripts/build.sh --env staging --docker",
    "build:production": "bash scripts/build.sh --env production --docker --clean --no-cache",
    "setup:staging": "bash scripts/setup_staging.sh --env staging --seed --verify --report",
    "setup:production": "bash scripts/setup_staging.sh --env production --verify --report",
    "deploy:staging": "bash scripts/setup_staging.sh --env staging --deploy k8s --verify --report",
    "deploy:production": "bash scripts/setup_staging.sh --env production --deploy k8s --verify --report",
    "video:generate": "node scripts/generate-videos.js",
    "video:update-refs": "node scripts/update-video-refs.js --map=replacement-map.json"
  }
}`;

  const quickCommands = [
    {
      title: 'Build for Staging',
      command: 'bash scripts/build.sh --env staging --docker --clean',
      description: 'Clean build with Docker image'
    },
    {
      title: 'Setup Staging Environment',
      command: 'bash scripts/setup_staging.sh --env staging --seed --verify --report',
      description: 'Full staging setup with data seeding'
    },
    {
      title: 'Deploy to Staging',
      command: 'bash scripts/setup_staging.sh --env staging --deploy k8s --verify',
      description: 'Deploy to Kubernetes with verification'
    },
    {
      title: 'Update Video References',
      command: 'node scripts/update-video-refs.js --map=replacement-map.json',
      description: 'Update all video URLs from replacement map'
    },
    {
      title: 'Dry Run Setup',
      command: 'bash scripts/setup_staging.sh --dry-run --verify --report',
      description: 'Preview setup actions without making changes'
    },
    {
      title: 'Run All Tests',
      command: 'npm run test:all',
      description: 'Execute full test suite'
    }
  ];

  const installSteps = [
    {
      step: '1',
      title: 'Create CLI Wrapper',
      description: 'Create a file named "base44" in your project root',
      action: () => downloadFile('base44', base44CLI)
    },
    {
      step: '2',
      title: 'Make Executable',
      description: 'Run: chmod +x base44',
      command: 'chmod +x base44'
    },
    {
      step: '3',
      title: 'Make Scripts Executable',
      description: 'Run: chmod +x scripts/*.sh',
      command: 'chmod +x scripts/*.sh'
    },
    {
      step: '4',
      title: 'Configure Environment',
      description: 'Edit .env.staging with your settings',
      command: 'nano .env.staging'
    },
    {
      step: '5',
      title: 'Test CLI',
      description: 'Run: ./base44 --help',
      command: './base44 --help'
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Developer Tools</h1>
          <p style={{color: 'var(--text-secondary)'}} className="text-sm md:text-base">
            Scripts, CLI tools, and automation helpers for Outpost Zero
          </p>
        </div>

        <Tabs defaultValue="cli" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="cli">CLI Setup</TabsTrigger>
            <TabsTrigger value="commands">Quick Commands</TabsTrigger>
            <TabsTrigger value="npm">NPM Scripts</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
          </TabsList>

          <TabsContent value="cli" className="mt-6">
            <Card className="border-gray-700 bg-gray-800/50 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-blue-400" />
                  Base44 CLI Wrapper
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-blue-300 text-sm mb-2">
                    ℹ️ Due to platform restrictions, the CLI wrapper cannot be created automatically.
                    Follow these steps to set it up manually:
                  </p>
                </div>

                <div className="space-y-3">
                  {installSteps.map((step, idx) => (
                    <Card key={idx} className="border-gray-700 bg-gray-900/50">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                            Step {step.step}
                          </Badge>
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">{step.title}</h4>
                            <p className="text-gray-400 text-sm mb-2">{step.description}</p>
                            {step.command && (
                              <div className="bg-gray-800 rounded p-2 font-mono text-xs text-green-300 flex items-center justify-between">
                                <code>{step.command}</code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(step.command, `step-${step.step}`)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  {copiedItem === `step-${step.step}` ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            )}
                            {step.action && (
                              <Button
                                onClick={step.action}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 mt-2"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download File
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <h4 className="text-white font-medium mb-3">CLI Wrapper Code</h4>
                  <div className="bg-gray-900 rounded-lg p-4 relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(base44CLI, 'cli-code')}
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    >
                      {copiedItem === 'cli-code' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <pre className="text-xs text-gray-300 overflow-x-auto">
                      <code>{base44CLI}</code>
                    </pre>
                  </div>
                  <Button
                    onClick={() => downloadFile('base44', base44CLI)}
                    className="mt-3 bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download base44 CLI
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commands" className="mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {quickCommands.map((cmd, idx) => (
                <Card key={idx} className="border-gray-700 bg-gray-800/50">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{cmd.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-3">{cmd.description}</p>
                    <div className="bg-gray-900 rounded p-3 font-mono text-xs text-green-300 flex items-start justify-between gap-2">
                      <code className="flex-1">{cmd.command}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(cmd.command, `cmd-${idx}`)}
                        className="text-gray-400 hover:text-white flex-shrink-0"
                      >
                        {copiedItem === `cmd-${idx}` ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="npm" className="mt-6">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-purple-400" />
                  NPM Scripts Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Add these scripts to your <code className="text-blue-300">package.json</code> for easy command access:
                </p>
                <div className="bg-gray-900 rounded-lg p-4 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(packageJsonScripts, 'npm-scripts')}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                  >
                    {copiedItem === 'npm-scripts' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    <code>{packageJsonScripts}</code>
                  </pre>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <h4 className="text-white font-medium mb-3">Usage Examples</h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-gray-900 rounded p-2">
                      <code className="text-green-300">npm run build:staging</code>
                      <span className="text-gray-400 ml-3">→ Build for staging</span>
                    </div>
                    <div className="bg-gray-900 rounded p-2">
                      <code className="text-green-300">npm run setup:staging</code>
                      <span className="text-gray-400 ml-3">→ Setup staging environment</span>
                    </div>
                    <div className="bg-gray-900 rounded p-2">
                      <code className="text-green-300">npm run deploy:staging</code>
                      <span className="text-gray-400 ml-3">→ Deploy to staging</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows" className="mt-6">
            <div className="space-y-4">
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-orange-400" />
                    Common Workflows
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-white font-medium mb-2">1. Full Staging Deployment</h4>
                    <div className="bg-gray-900 rounded-lg p-3 space-y-2 text-sm">
                      <div className="text-gray-400"># Build application</div>
                      <div className="text-green-300 font-mono">bash scripts/build.sh --env staging --clean --docker</div>
                      <div className="text-gray-400 mt-2"># Deploy and verify</div>
                      <div className="text-green-300 font-mono">bash scripts/setup_staging.sh --seed --verify --report</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">2. Quick Deploy After Changes</h4>
                    <div className="bg-gray-900 rounded-lg p-3 space-y-2 text-sm">
                      <div className="text-green-300 font-mono">bash scripts/build.sh --env staging</div>
                      <div className="text-green-300 font-mono">bash scripts/setup_staging.sh --deploy k8s</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">3. Generate & Update Videos</h4>
                    <div className="bg-gray-900 rounded-lg p-3 space-y-2 text-sm">
                      <div className="text-gray-400"># Generate videos in app UI (Training → Video Generation)</div>
                      <div className="text-gray-400 mt-2"># Update references</div>
                      <div className="text-green-300 font-mono">node scripts/update-video-refs.js --map=replacement-map.json</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">4. Pre-Deployment Checks</h4>
                    <div className="bg-gray-900 rounded-lg p-3 space-y-2 text-sm">
                      <div className="text-green-300 font-mono">npm run test:all</div>
                      <div className="text-green-300 font-mono">npm run lint</div>
                      <div className="text-green-300 font-mono">bash scripts/setup_staging.sh --dry-run --verify</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-cyan-400" />
                    Environment Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-3">
                    Before running scripts, ensure <code className="text-blue-300">.env.staging</code> is configured:
                  </p>
                  <div className="bg-gray-900 rounded-lg p-3 text-xs space-y-1 font-mono">
                    <div className="text-gray-400"># Required variables:</div>
                    <div className="text-green-300">APP_NAME=outpostzero</div>
                    <div className="text-green-300">ENV=staging</div>
                    <div className="text-green-300">IMAGE_TAG=outpostzero:staging</div>
                    <div className="text-green-300">FRONTEND_URL=https://staging.outpostzero.com</div>
                    <div className="text-green-300">API_HEALTH_URL=https://api.staging.../health</div>
                    <div className="text-gray-400 mt-2"># Deployment target:</div>
                    <div className="text-green-300">DEPLOY_TARGET=k8s</div>
                    <div className="text-green-300">KUBE_CONTEXT=staging-cluster</div>
                    <div className="text-green-300">K8S_NAMESPACE=outpostzero-staging</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}