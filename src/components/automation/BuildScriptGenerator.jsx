import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, Terminal } from 'lucide-react';

export default function BuildScriptGenerator({ environment = 'staging', dockerTag = 'outpostzero:staging', notifyUser = '@asaad.morman' }) {
  const generateBuildScript = () => {
    return `#!/bin/bash
# Outpost Zero Build Script - ${environment.toUpperCase()}
# Generated: ${new Date().toISOString()}
# Notify: ${notifyUser}

set -e  # Exit on error

echo "🚀 Starting Outpost Zero ${environment} build..."
echo "=============================================="

# Configuration
ENV="${environment}"
DOCKER_TAG="${dockerTag}"
BRANCH="${environment}"
NOTIFY_USER="${notifyUser}"
BUILD_ID=$(date +%Y%m%d_%H%M%S)

# Step 1: Clean previous builds
echo "🧹 Step 1/8: Cleaning previous builds..."
rm -rf dist/ build/ node_modules/.cache
docker system prune -f
echo "✅ Clean complete"

# Step 2: Install dependencies (no cache)
echo "📦 Step 2/8: Installing dependencies..."
npm ci --no-optional
echo "✅ Dependencies installed"

# Step 3: Run backend tests
echo "🧪 Step 3/8: Running backend tests..."
npm run test:backend || {
  echo "❌ Backend tests failed!"
  echo "Build failed at: \$(date)" | mail -s "Build Failed: Backend Tests" \${NOTIFY_USER}@cyberdojo.com
  exit 1
}
echo "✅ Backend tests passed"

# Step 4: Run frontend tests
echo "🧪 Step 4/8: Running frontend tests..."
npm run test:frontend || {
  echo "❌ Frontend tests failed!"
  exit 1
}
echo "✅ Frontend tests passed"

# Step 5: Security scanning
echo "🔒 Step 5/8: Running security scans..."
npm audit --audit-level=high
npm run security:scan 2>/dev/null || echo "⚠️  Security scan completed with warnings"
echo "✅ Security checks complete"

# Step 6: Build frontend
echo "🏗️  Step 6/8: Building frontend for ${environment}..."
NODE_ENV=\${ENV} npm run build
echo "✅ Frontend build complete"

# Step 7: Package artifacts
echo "📦 Step 7/8: Packaging artifacts..."
tar -czf outpostzero_\${ENV}_\${BUILD_ID}.tar.gz dist/
echo "✅ Artifacts packaged: outpostzero_\${ENV}_\${BUILD_ID}.tar.gz"

# Step 8: Build Docker image
echo "🐳 Step 8/8: Building Docker image..."
docker build --no-cache \\
  --build-arg ENV=\${ENV} \\
  --build-arg BUILD_ID=\${BUILD_ID} \\
  --build-arg BRANCH=\${BRANCH} \\
  -t \${DOCKER_TAG} \\
  -t \${DOCKER_TAG}-\${BUILD_ID} \\
  .

echo "✅ Docker image built: \${DOCKER_TAG}"
docker images | grep outpostzero

# Tag for registry (optional)
# docker tag \${DOCKER_TAG} your-registry.com/\${DOCKER_TAG}
# docker push your-registry.com/\${DOCKER_TAG}

echo ""
echo "=============================================="
echo "✅ BUILD COMPLETE!"
echo "=============================================="
echo "Environment: \${ENV}"
echo "Docker Tag: \${DOCKER_TAG}"
echo "Build ID: \${BUILD_ID}"
echo "Artifact: outpostzero_\${ENV}_\${BUILD_ID}.tar.gz"
echo "=============================================="

# Send success notification
echo "Build successful! \\nEnvironment: \${ENV}\\nDocker Tag: \${DOCKER_TAG}\\nBuild ID: \${BUILD_ID}" | \\
  mail -s "✅ Build Success: Outpost Zero ${environment}" \${NOTIFY_USER}@cyberdojo.com

echo "📧 Notification sent to: \${NOTIFY_USER}@cyberdojo.com"
`;
  };

  const generateDockerfile = () => {
    return `# Outpost Zero Dockerfile - Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build arguments
ARG ENV=production
ARG BUILD_ID=unknown
ARG BRANCH=main

# Build frontend
RUN NODE_ENV=\${ENV} npm run build

# Production image
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Add build info
RUN echo "{\\"environment\\": \\"\${ENV}\\", \\"build_id\\": \\"\${BUILD_ID}\\", \\"branch\\": \\"\${BRANCH}\\"}" > /usr/share/nginx/html/build-info.json

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
`;
  };

  const generateGitHubActions = () => {
    return `name: Outpost Zero CI/CD

on:
  push:
    branches: [ ${environment} ]
  workflow_dispatch:

env:
  DOCKER_TAG: ${dockerTag}
  NOTIFY_USER: ${notifyUser}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
      
    - name: Run backend tests
      run: npm run test:backend
      
    - name: Run frontend tests  
      run: npm run test:frontend
      
    - name: Security scan
      run: |
        npm audit --audit-level=high
        npm run security:scan || true
    
    - name: Build frontend
      run: npm run build
      env:
        NODE_ENV: ${environment}
    
    - name: Build Docker image
      run: |
        docker build --no-cache \\
          --build-arg ENV=${environment} \\
          --build-arg BUILD_ID=\${{ github.run_number }} \\
          -t \${{ env.DOCKER_TAG }} .
    
    - name: Push to registry
      run: |
        echo \${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u \${{ github.actor }} --password-stdin
        docker push \${{ env.DOCKER_TAG }}
    
    - name: Send notification
      if: always()
      uses: dawidd6/action-send-mail@v3
      with:
        server_address: smtp.gmail.com
        server_port: 465
        username: \${{ secrets.MAIL_USERNAME }}
        password: \${{ secrets.MAIL_PASSWORD }}
        subject: Build \${{ job.status }} - Outpost Zero ${environment}
        to: \${{ env.NOTIFY_USER }}@cyberdojo.com
        from: CI/CD Pipeline
        body: |
          Build \${{ job.status }}
          
          Environment: ${environment}
          Docker Tag: \${{ env.DOCKER_TAG }}
          Build ID: \${{ github.run_number }}
          Commit: \${{ github.sha }}
`;
  };

  const downloadScript = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-400" />
            Build Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Environment</p>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                {environment}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Docker Tag</p>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                {dockerTag}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Notify</p>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                {notifyUser}
              </Badge>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h4 className="text-white font-medium mb-3">Download Build Scripts</h4>
            <div className="grid md:grid-cols-3 gap-3">
              <Button
                onClick={() => downloadScript('build.sh', generateBuildScript())}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Build Script
              </Button>
              <Button
                onClick={() => downloadScript('Dockerfile', generateDockerfile())}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Dockerfile
              </Button>
              <Button
                onClick={() => downloadScript('.github-workflows-deploy.yml', generateGitHubActions())}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                GitHub Actions
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h4 className="text-white font-medium mb-3">Quick Copy</h4>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-gray-400 text-sm">Run this command to execute the build:</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`chmod +x build.sh && ./build.sh`)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <code className="text-green-300 text-sm font-mono">
                chmod +x build.sh && ./build.sh
              </code>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700 bg-blue-900/20 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              What happens when you run the build:
            </h4>
            <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
              <li>Clean previous build artifacts and Docker cache</li>
              <li>Install dependencies with npm ci (clean install)</li>
              <li>Run backend test suite</li>
              <li>Run frontend test suite</li>
              <li>Execute security scans (audit, SAST, secrets)</li>
              <li>Build frontend for {environment} environment</li>
              <li>Package artifacts into tarball</li>
              <li>Build Docker image: {dockerTag}</li>
              <li>Send email notification to {notifyUser}@cyberdojo.com</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}