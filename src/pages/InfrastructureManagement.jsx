
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Copy, CheckCircle, Cloud, Server, Database, Eye, Users, Key, BarChart3, FileImage, Wand2 } from 'lucide-react';
import ArchitectureDiagram from '../components/infrastructure/ArchitectureDiagram';
import DiagramExporter from '../components/infrastructure/DiagramExporter';
import CustomDiagramBuilder from '../components/infrastructure/CustomDiagramBuilder';

export default function InfrastructureManagement() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFullDoc = () => {
    const doc = `OUTPOST ZERO - ENTERPRISE DEPLOYMENT GUIDE
==========================================

AZURE PRIMARY INFRASTRUCTURE (70% of workload)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Region: East US (Primary), West US 2 (DR)
Kubernetes: AKS v1.27
Node Pools:
  - System: Standard_D4s_v3 (6-20 nodes)
  - User: Standard_D8s_v3 (3-12 nodes)
  - GPU: NC6s_v3 NVIDIA V100 (2-10 nodes)

Networking: VNet 10.0.0.0/16
Services: Sentinel, Azure AD, Monitor, Key Vault
Database: Azure PostgreSQL Flexible Server (Zone-redundant)
Cache: Azure Cache for Redis Premium (6-node cluster)

Native Integrations:
✓ Azure Sentinel (SIEM) - 10K events/sec
✓ Azure AD (SSO) - 1,247 users, 100% MFA
✓ Azure Monitor - 2.1M datapoints/hour
✓ Azure Key Vault - 23 secrets, HSM-backed

Performance: 99.98% uptime, 95ms API latency P95

---

AWS SECONDARY INFRASTRUCTURE (25% of workload)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Region: US-East-1
Kubernetes: EKS v1.28
Node Groups: t3.xlarge (3-10), g4dn.xlarge GPU (1-5)
Network: VPC 10.1.0.0/16

---

For full documentation, visit Platform Architecture page.`;

    const blob = new Blob([doc], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'infrastructure-deployment-guide.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Enterprise Infrastructure</h1>
          <p className="text-xl text-gray-300 mb-4">Azure-Hosted Multi-Cloud Deployment</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50 px-4 py-2">
              <Cloud className="w-4 h-4 mr-2" />
              Hosted on Microsoft Azure (Primary)
            </Badge>
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50 px-4 py-2">
              <FileImage className="w-4 h-4 mr-2" />
              Export Diagrams
            </Badge>
            <Badge className="bg-green-600/20 text-green-300 border-green-500/50 px-4 py-2">
              <Wand2 className="w-4 h-4 mr-2" />
              Custom Builder
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="builder">Custom Builder</TabsTrigger>
            <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
            <TabsTrigger value="terraform">Terraform</TabsTrigger>
            <TabsTrigger value="kubernetes">Kubernetes</TabsTrigger>
          </TabsList>

          {/* Architecture Tab with Visual Diagram */}
          <TabsContent value="architecture" className="space-y-6">
            <Alert className="border-blue-500/50 bg-blue-500/10">
              <Cloud className="h-5 w-5 text-blue-400" />
              <AlertDescription className="text-blue-200">
                <strong>Azure-Primary Architecture:</strong> 70% of infrastructure on Azure with native Sentinel, Azure AD, Monitor, and Key Vault. Click any component below for detailed specifications.
              </AlertDescription>
            </Alert>

            <ArchitectureDiagram />

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-base">Target State</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Multi-cloud containerized deployment (Azure primary)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Infrastructure as Code (Terraform)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Kubernetes orchestration (AKS, EKS, GKE)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Automated CI/CD (GitHub Actions)</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-base">Key Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-300">
                  <div>• <strong>AKS</strong>: Azure Kubernetes Service (primary)</div>
                  <div>• <strong>PostgreSQL</strong>: Azure Database (zone-redundant)</div>
                  <div>• <strong>Redis</strong>: Azure Cache Premium</div>
                  <div>• <strong>Sentinel</strong>: Cloud-native SIEM</div>
                  <div>• <strong>Azure AD</strong>: SSO & identity</div>
                  <div>• <strong>Monitor</strong>: Observability platform</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={downloadFullDoc}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Guide
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-gray-600 text-sm"
                    asChild
                  >
                    <a href="/PlatformArchitecture">
                      View Full Architecture Docs
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <DiagramExporter diagramType="architecture" />
          </TabsContent>

          {/* Custom Builder Tab */}
          <TabsContent value="builder" className="space-y-6">
            <CustomDiagramBuilder />
          </TabsContent>

          <TabsContent value="prerequisites" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Local Setup Prerequisites</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Required Tools</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <a href="https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" target="_blank" className="text-blue-400 hover:underline">
                        Azure CLI
                      </a> - Azure command-line interface
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <a href="https://kubectl.docs.kubernetes.io/installation/kubectl/" target="_blank" className="text-blue-400 hover:underline">
                        kubectl
                      </a> - Kubernetes CLI
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <a href="https://www.terraform.io/downloads" target="_blank" className="text-blue-400 hover:underline">
                        Terraform
                      </a> - Infrastructure as Code tool
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <a href="https://helm.sh/docs/intro/install/" target="_blank" className="text-blue-400 hover:underline">
                        Helm
                      </a> - Kubernetes package manager
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <a href="https://docs.docker.com/get-docker/" target="_blank" className="text-blue-400 hover:underline">
                        Docker
                      </a> - Container runtime
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terraform" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Azure Infrastructure (Terraform)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{`# Azure AKS Cluster (Primary Infrastructure)
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                = "outpostzero-aks"
  location            = "eastus"
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = "outpostzero"

  default_node_pool {
    name                = "system"
    node_count          = 6
    vm_size            = "Standard_D4s_v3"
    enable_auto_scaling = true
    min_count          = 6
    max_count          = 20
    zones              = [1, 2, 3]
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
  }
}

# GPU Node Pool for AI/ML
resource "azurerm_kubernetes_cluster_node_pool" "gpu" {
  name                  = "gpu"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.aks.id
  vm_size              = "Standard_NC6s_v3"
  enable_auto_scaling  = true
  min_count           = 2
  max_count           = 10
  zones               = [1, 2, 3]
}

# Azure Database for PostgreSQL
resource "azurerm_postgresql_flexible_server" "db" {
  name                = "outpostzero-db"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  version             = "15"
  
  sku_name   = "Standard_D8s_v3"
  storage_mb = 524288 # 512GB

  zone               = "1"
  high_availability {
    mode = "ZoneRedundant"
  }
}

# Azure Cache for Redis
resource "azurerm_redis_cache" "cache" {
  name                = "outpostzero-redis"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  capacity            = 3
  family              = "P"
  sku_name            = "Premium"
  enable_non_ssl_port = false
  
  redis_configuration {
    enable_authentication = true
  }
  
  zones = [1, 2, 3]
}`}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => copyToClipboard('terraform init && terraform plan && terraform apply -auto-approve')}
                    variant="outline"
                    className="border-gray-600"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    Copy Commands
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kubernetes" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Kubernetes Deployment (AKS)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{`# API Server Deployment (AKS)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
  namespace: outpost-zero
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-server
  template:
    metadata:
      labels:
        app: api-server
    spec:
      containers:
      - name: api-server
        image: outpostzero/api-server:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: 500m
            memory: 1Gi
          limits:
            cpu: 2000m
            memory: 4Gi
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: connection-string
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 10`}
                  </pre>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Deployment Commands</h3>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <code className="text-green-400 text-sm">
                      # Connect to AKS cluster<br/>
                      az aks get-credentials --resource-group outpostzero --name outpostzero-aks<br/><br/>
                      
                      # Deploy to AKS<br/>
                      kubectl apply -f k8s/namespace.yaml<br/>
                      kubectl apply -f k8s/deployments/<br/>
                      kubectl apply -f k8s/services/<br/><br/>
                      
                      # Check status<br/>
                      kubectl get pods -n outpost-zero<br/>
                      kubectl get svc -n outpost-zero
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cicd" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">GitHub Actions CI/CD Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{`# .github/workflows/azure-deploy.yml
name: Deploy to Azure AKS

on:
  push:
    branches: [main, staging]

env:
  AZURE_RESOURCE_GROUP: outpostzero
  AKS_CLUSTER_NAME: outpostzero-aks
  ACR_NAME: outpostzeroregistry

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: \${{ secrets.AZURE_CREDENTIALS }}
      
      - name: Build and push to ACR
        run: |
          az acr login --name \${{ env.ACR_NAME }}
          docker build -t \${{ env.ACR_NAME }}.azurecr.io/api-server:latest .
          docker push \${{ env.ACR_NAME }}.azurecr.io/api-server:latest
      
      - name: Deploy to AKS
        uses: azure/k8s-deploy@v4
        with:
          resource-group: \${{ env.AZURE_RESOURCE_GROUP }}
          name: \${{ env.AKS_CLUSTER_NAME }}
          manifests: |
            k8s/deployments/
            k8s/services/`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
