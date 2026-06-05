
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Server, 
    Cloud, 
    Cpu, 
    Copy,
    CheckCircle,
    GitBranch,
    RefreshCw,
    Shield,
    HardDrive,
    Zap,
    Download
} from 'lucide-react';
import ArchitectureDiagram from '../components/infrastructure/ArchitectureDiagram';

export default function InfrastructureAsCodeManagementPlatformPage() {
    const [copiedId, setCopiedId] = useState(null);
    
    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const CodeBlock = ({ title, code, id, description }) => (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-900/50">
                <h4 className="text-white font-semibold">{title}</h4>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(code, id)}>
                    {copiedId === id ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </Button>
            </div>
            {description && <p className="text-xs text-gray-400 px-4 pt-2">{description}</p>}
            <div className="p-2">
                <pre className="bg-[#282a36] text-white p-4 rounded-md overflow-x-auto text-xs leading-relaxed font-mono">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                       <Cloud className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Infrastructure as Code Management Platform</h1>
                        <p className="text-gray-300">Deploy Outpost Zero with Terraform, Kubernetes, and CI/CD</p>
                    </div>
                </div>

                <Tabs defaultValue="architecture" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="architecture">Phase 1: Architecture</TabsTrigger>
                        <TabsTrigger value="prereqs">Phase 2: Prerequisites</TabsTrigger>
                        <TabsTrigger value="terraform">Phase 3: Terraform (IaC)</TabsTrigger>
                        <TabsTrigger value="kubernetes">Phase 4: Kubernetes</TabsTrigger>
                        <TabsTrigger value="cicd">Phase 5: CI/CD Automation</TabsTrigger>
                    </TabsList>

                    <TabsContent value="architecture" className="mt-6">
                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardHeader><CardTitle className="text-white">Target State Architecture</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-gray-300 mb-6">
                                    The goal is a multi-cloud, containerized deployment managed by Kubernetes and defined by Infrastructure as Code. This architecture ensures high availability, scalability, and disaster recovery.
                                </p>
                                
                                <ArchitectureDiagram />
                                
                                <ul className="mt-6 space-y-3 text-gray-300">
                                  <li className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" /> 
                                    <div>
                                      <strong>IaC with Terraform:</strong> A single codebase to manage infrastructure across AWS, Azure, and GCP.
                                    </div>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <HardDrive className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" /> 
                                    <div>
                                      <strong>Kubernetes Orchestration:</strong> Application components (API, AI Models, Workers) run as scalable, self-healing microservices.
                                    </div>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" /> 
                                    <div>
                                      <strong>CI/CD Automation:</strong> Code commits automatically trigger builds, tests, and deployments to Kubernetes, managed by GitHub Actions.
                                    </div>
                                  </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="prereqs" className="mt-6">
                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardHeader><CardTitle className="text-white">Prerequisites & Local Setup</CardTitle></CardHeader>
                            <CardContent className="prose prose-invert text-gray-300">
                                <p>Before deploying, your engineering team must install and configure the following tools on their local machines.</p>
                                <ol>
                                    <li><strong>Terraform:</strong> <a href="https://learn.hashicorp.com/tutorials/terraform/install-cli" target="_blank" rel="noopener noreferrer">Download and install Terraform.</a> This will be used to build the cloud infrastructure.</li>
                                    <li><strong>Kubectl:</strong> <a href="https://kubernetes.io/docs/tasks/tools/install-kubectl/" target="_blank" rel="noopener noreferrer">Install the Kubernetes command-line tool.</a> This is used to interact with your Kubernetes cluster.</li>
                                    <li><strong>Cloud Provider CLIs:</strong>
                                        <ul>
                                            <li><a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html" target="_blank" rel="noopener noreferrer">AWS CLI:</a> Install and configure with your credentials (`aws configure`).</li>
                                            <li><a href="https://cloud.google.com/sdk/docs/install" target="_blank" rel="noopener noreferrer">Google Cloud SDK:</a> Install and login (`gcloud auth login`).</li>
                                            <li><a href="https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" target="_blank" rel="noopener noreferrer">Azure CLI:</a> Install and login (`az login`).</li>
                                        </ul>
                                    </li>
                                    <li><strong>GitHub Account:</strong> A GitHub account is required for source control and for implementing the CI/CD pipeline.</li>
                                </ol>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="terraform" className="mt-6">
                        <p className="text-gray-300 mb-4">Use this Terraform code to provision your cloud infrastructure. Create a new directory, save these files inside it, then run the commands.</p>
                        <div className="grid lg:grid-cols-2 gap-6 mb-6">
                            <CodeBlock id="tf-main" title="main.tf" code={`terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source         = "terraform-aws-modules/vpc/aws"
  version        = "5.0.0"
  name           = "outpost-zero-vpc"
  cidr           = "10.0.0.0/16"
  azs            = ["\${var.aws_region}a", "\${var.aws_region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
  enable_nat_gateway = true
}

module "eks" {
  source        = "./modules/eks"
  cluster_name  = "outpost-zero-cluster"
  vpc_id        = module.vpc.vpc_id
  subnet_ids    = module.vpc.private_subnets
  aws_region    = var.aws_region
}`} description="Main entrypoint. Defines providers and calls modules for VPC and EKS." />
                            <CodeBlock id="tf-vars" title="variables.tf" code={`variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type         = string
  default     = "us-east-1"
}`} description="Defines variables for your configuration." />
                            <CodeBlock id="tf-eks" title="modules/eks/main.tf" code={`variable "cluster_name" {}
variable "vpc_id" {}
variable "subnet_ids" {}
variable "aws_region" {}

resource "aws_iam_role" "eks_cluster_role" {
  name = "\${var.cluster_name}-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
  })
}

resource "aws_eks_cluster" "outpost_zero" {
  name     = var.cluster_name
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids = var.subnet_ids
  }
}

# Add node groups here...`} description="Module for creating the Elastic Kubernetes Service (EKS) cluster." />
                        </div>
                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardHeader><CardTitle className="text-white">Deployment Commands</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <CodeBlock id="tf-init" title="1. Initialize Terraform" code="terraform init" description="Downloads the necessary provider plugins."/>
                                <CodeBlock id="tf-plan" title="2. Plan Deployment" code="terraform plan" description="Shows you what infrastructure will be created."/>
                                <CodeBlock id="tf-apply" title="3. Apply Deployment" code="terraform apply --auto-approve" description="Builds the infrastructure in your cloud account."/>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="kubernetes" className="mt-6">
                      <p className="text-gray-300 mb-4">Once your cluster is running, use these manifests to deploy the Outpost Zero services. Save them as `.yaml` files and apply them with `kubectl`.</p>
                      <div className="grid lg:grid-cols-2 gap-6">
                          <CodeBlock id="k8s-dep" title="api-deployment.yaml" code={`apiVersion: apps/v1
kind: Deployment
metadata:
  name: outpost-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: outpost-api
  template:
    metadata:
      labels:
        app: outpost-api
    spec:
      containers:
      - name: api-server
        image: cyberdojo/outpost-zero-api:latest
        ports:
        - containerPort: 8080
`} description="Deploys 3 replicas of the API server for high availability." />
                          <CodeBlock id="k8s-svc" title="api-service.yaml" code={`apiVersion: v1
kind: Service
metadata:
  name: outpost-api-service
spec:
  selector:
    app: outpost-api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: LoadBalancer
`} description="Exposes the API deployment to the internet via a cloud load balancer." />
                      </div>
                      <div className="mt-6">
                          <CodeBlock id="k8s-apply" title="Deployment Command" code={`kubectl apply -f api-deployment.yaml
kubectl apply -f api-service.yaml`} description="Applies the configuration to your cluster." />
                      </div>
                    </TabsContent>

                    <TabsContent value="cicd" className="mt-6">
                      <p className="text-gray-300 mb-4">This is the key to automation. By adding this workflow to your source code repository (e.g., GitHub), every code change can be automatically built, tested, and deployed.</p>
                      <Card className="bg-gray-800/50 border-gray-700">
                        <CardHeader><CardTitle className="text-white">CI/CD Pipeline with GitHub Actions</CardTitle></CardHeader>
                        <CardContent>
                          <p className="mb-4 text-gray-300">Create a file at `.github/workflows/deploy.yml` in your repository and add the following content.</p>
                          <CodeBlock id="gh-actions" title=".github/workflows/deploy.yml" code={`name: Deploy to Kubernetes

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2

    - name: Log in to Docker Hub
      uses: docker/login-action@v2
      with:
        username: \${{ secrets.DOCKER_USERNAME }}
        password: \${{ secrets.DOCKER_PASSWORD }}

    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: yourdockerhub/outpost-zero-api:latest

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1

    - name: Set up Kubeconfig
      run: aws eks update-kubeconfig --name outpost-zero-cluster --region us-east-1

    - name: Deploy to Kubernetes
      run: kubectl apply -f kubernetes/
`} description="This workflow automates building the Docker image and deploying it to your EKS cluster on every push to the main branch." />
                        </CardContent>
                      </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
