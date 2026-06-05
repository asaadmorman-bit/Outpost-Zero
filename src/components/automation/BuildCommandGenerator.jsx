import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Terminal } from 'lucide-react';

export default function BuildCommandGenerator({ config }) {
  const {
    app = 'Outpost Zero',
    env = 'staging',
    branch = 'staging',
    clean = true,
    no_cache = true,
    run_tests = true,
    frontend_build = true,
    backend_build = true,
    docker = true,
    docker_tag = 'outpostzero:staging',
    package_artifacts = true,
    artifact_name = 'outpostzero_build',
    notify = '@asaad.morman'
  } = config || {};

  const commands = [
    clean && {
      step: '1',
      name: 'Clean Build',
      command: 'rm -rf dist/ build/ node_modules/.cache && docker system prune -f',
      description: 'Remove previous build artifacts and Docker cache'
    },
    {
      step: '2',
      name: 'Install Dependencies',
      command: 'npm ci --no-optional',
      description: 'Clean install of npm dependencies'
    },
    run_tests && backend_build && {
      step: '3',
      name: 'Backend Tests',
      command: 'npm run test:backend',
      description: 'Run backend test suite'
    },
    run_tests && frontend_build && {
      step: '4',
      name: 'Frontend Tests',
      command: 'npm run test:frontend',
      description: 'Run frontend test suite'
    },
    {
      step: '5',
      name: 'Security Scan',
      command: 'npm audit --audit-level=high && npm run security:scan',
      description: 'Run dependency audit and security scanning'
    },
    frontend_build && {
      step: '6',
      name: 'Build Frontend',
      command: `NODE_ENV=${env} npm run build`,
      description: `Build frontend for ${env} environment`
    },
    package_artifacts && {
      step: '7',
      name: 'Package Artifacts',
      command: `tar -czf ${artifact_name}_${env}_$(date +%Y%m%d).tar.gz dist/`,
      description: 'Create compressed artifact package'
    },
    docker && {
      step: '8',
      name: 'Build Docker Image',
      command: `docker build ${no_cache ? '--no-cache' : ''} --build-arg ENV=${env} --build-arg BRANCH=${branch} -t ${docker_tag} .`,
      description: `Build Docker image: ${docker_tag}`
    },
    docker && {
      step: '9',
      name: 'Tag Docker Image',
      command: `docker tag ${docker_tag} ${docker_tag}-$(date +%Y%m%d_%H%M%S)`,
      description: 'Tag image with timestamp'
    },
    {
      step: '10',
      name: 'Notify',
      command: `echo "Build complete for ${app} (${env})" | mail -s "Build Success" ${notify}@cyberdojo.com`,
      description: `Send notification to ${notify}`
    }
  ].filter(Boolean);

  const fullScript = commands.map(cmd => cmd.command).join(' && \\\n  ');

  const copyCommand = (command) => {
    navigator.clipboard.writeText(command);
    alert('Command copied to clipboard!');
  };

  const copyAllCommands = () => {
    const allCommands = `#!/bin/bash\nset -e\n\n${commands.map(cmd => `# ${cmd.name}\n${cmd.command}`).join('\n\n')}`;
    navigator.clipboard.writeText(allCommands);
    alert('All commands copied to clipboard!');
  };

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-green-400" />
            Build Command Sequence
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={copyAllCommands}
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
          <p className="text-blue-300 text-sm mb-2">📋 Build Configuration:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-gray-400">App:</span> <span className="text-white">{app}</span></div>
            <div><span className="text-gray-400">Environment:</span> <span className="text-white">{env}</span></div>
            <div><span className="text-gray-400">Branch:</span> <span className="text-white">{branch}</span></div>
            <div><span className="text-gray-400">Docker Tag:</span> <span className="text-white">{docker_tag}</span></div>
            <div><span className="text-gray-400">Clean Build:</span> <span className="text-white">{clean ? 'Yes' : 'No'}</span></div>
            <div><span className="text-gray-400">Run Tests:</span> <span className="text-white">{run_tests ? 'Yes' : 'No'}</span></div>
          </div>
        </div>

        <div className="space-y-3">
          {commands.map((cmd, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-3 border border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-400 font-mono text-xs">Step {cmd.step}</span>
                    <span className="text-white font-medium text-sm">{cmd.name}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{cmd.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyCommand(cmd.command)}
                  className="text-gray-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <pre className="bg-black/30 rounded p-2 overflow-x-auto">
                <code className="text-green-300 text-xs font-mono">{cmd.command}</code>
              </pre>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-700">
          <p className="text-gray-400 text-sm mb-3">Complete build script (one-liner):</p>
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
            <pre className="overflow-x-auto">
              <code className="text-green-300 text-xs font-mono whitespace-pre-wrap">{fullScript}</code>
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}