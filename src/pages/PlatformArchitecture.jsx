
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ArchitectureDiagram from '../components/infrastructure/ArchitectureDiagram';
import { 
  Download, 
  FileText, 
  Image as ImageIcon,
  CheckCircle,
  Server,
  Cloud,
  Database,
  Shield,
  Zap,
  Network,
  Lock,
  Activity,
  Eye,
  Users,
  Key,
  BarChart3,
  GitBranch,
  Layers,
  Globe,
  Cpu
} from 'lucide-react';

export default function PlatformArchitecture() {
  const [activeTab, setActiveTab] = useState('visual');

  const downloadDetailedDoc = () => {
    const doc = `
╔════════════════════════════════════════════════════════════════════════════╗
║                  OUTPOST ZERO - ENTERPRISE ARCHITECTURE                     ║
║                        Comprehensive Technical Documentation                ║
║                                                                             ║
║                    © 2024 Cyber Dojo Solutions, LLC                        ║
╚════════════════════════════════════════════════════════════════════════════╝

TABLE OF CONTENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Executive Summary
2. High-Level Architecture Overview
3. Infrastructure Layer
4. Platform Services Layer
5. Application Layer
6. Security Architecture
7. Azure Integration Details
8. Performance Specifications
9. Disaster Recovery & High Availability
10. Monitoring & Observability
11. Compliance & Certifications
12. Deployment Architecture
13. Network Architecture
14. Data Flow & Processing
15. API Architecture
16. Future Roadmap

═══════════════════════════════════════════════════════════════════════════════
1. EXECUTIVE SUMMARY
═══════════════════════════════════════════════════════════════════════════════

Outpost Zero is a cloud-native, AI-powered security operations platform built on
modern microservices architecture. The platform leverages Kubernetes for 
orchestration across multiple cloud providers with Azure as the primary hosting
environment to provide enterprise-grade security, scalability, and reliability.

KEY CAPABILITIES:
• Real-time threat detection and response (10,000+ events/second)
• AI-powered security analytics (97.3% threat detection accuracy)
• Multi-cloud deployment (Azure primary, AWS secondary, GCP tertiary)
• Native Azure integration (Sentinel, AD, Monitor, Key Vault)
• 99.99% uptime SLA with automated failover
• FedRAMP Moderate ready, pursuing FedRAMP High

TECHNOLOGY STACK:
• Container Orchestration: Kubernetes (AKS, EKS, GKE)
• Compute: Azure VMs, AWS EC2, GCP Compute Engine
• Databases: PostgreSQL 15 (clustered), Redis 7.x (cache)
• AI/ML: TensorFlow, PyTorch on NVIDIA T4/A100 GPUs
• Languages: Node.js, Python, Go
• Infrastructure: Terraform (IaC), GitHub Actions (CI/CD)

CLOUD STRATEGY:
• Primary: Microsoft Azure (70% of infrastructure)
• Secondary: Amazon Web Services (25% of infrastructure)
• Tertiary: Google Cloud Platform (5% of infrastructure)

═══════════════════════════════════════════════════════════════════════════════
2. HIGH-LEVEL ARCHITECTURE OVERVIEW
═══════════════════════════════════════════════════════════════════════════════

                           ┌─────────────────────────┐
                           │   GitHub Actions CI/CD  │
                           │  (Build, Test, Deploy)  │
                           └────────────┬────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
           ┌────────▼─────────┐  ┌─────▼──────────┐  ┌────▼───────────┐
           │ Azure (Primary)  │  │  AWS (Secondary)│  │ GCP (Tertiary) │
           │      70%         │  │      25%        │  │      5%        │
           │                  │  │                 │  │                │
           │  • AKS Cluster   │  │  • EKS Cluster  │  │  • GKE Cluster │
           │  • VNet          │  │  • VPC Network  │  │  • VPC Network │
           │  • App Gateway   │  │  • ALB/NLB      │  │  • Cloud LB    │
           │  • Blob Storage  │  │  • S3 Storage   │  │  • Cloud Store │
           └────────┬─────────┘  └─────┬──────────┘  └────┬───────────┘
                    │                   │                   │
                    └───────────────────┼───────────────────┘
                                        │
                          ┌─────────────▼─────────────┐
                          │  Kubernetes Control Plane │
                          │   (Multi-Cloud Managed)   │
                          └─────────────┬─────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        │                               │                               │
   ┌────▼────────┐            ┌────────▼────────┐          ┌──────────▼─────┐
   │ API Layer   │            │  AI/ML Workers  │          │  Data Layer    │
   │ (3 replicas)│            │ (Auto-scaling)  │          │  (Clustered)   │
   │             │            │                 │          │                │
   │ • REST API  │            │ • GPU Compute   │            │ • PostgreSQL   │
   │ • GraphQL   │            │ • TensorFlow    │            │ • Redis Cache  │
   │ • WebSocket │            │ • Model Server  │            │ • Time-series  │
   └─────────────┘            └─────────────────┘            └────────────────┘

═══════════════════════════════════════════════════════════════════════════════
3. INFRASTRUCTURE LAYER
═══════════════════════════════════════════════════════════════════════════════

3.1 MULTI-CLOUD DEPLOYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Azure (Primary - 70% of traffic)
────────────────────────────────
Region:              East US (Primary), West US 2 (DR)
Kubernetes:          Azure AKS v1.27
Node Pools:
  • System: Standard_D4s_v3 (4 vCPU, 16GB) - 6-20 nodes (auto-scaling)
  • User: Standard_D8s_v3 (8 vCPU, 32GB) - 3-12 nodes (auto-scaling)
  • GPU: Standard_NC6s_v3 (NVIDIA V100) - 2-10 nodes (auto-scaling)

Networking:
  • Virtual Network: 10.0.0.0/16
  • Subnets: AKS (10.0.1.0/24), Gateway (10.0.2.0/24), Data (10.0.3.0/24)
  • Application Gateway v2 (WAF enabled)
  • Azure Firewall for egress filtering
  • Private Link for Azure services
  • Network Security Groups (NSGs)

Load Balancing:
  • Application Gateway v2 for HTTPS/HTTP
  • Azure Load Balancer for internal services
  • Traffic Manager for global load balancing
  • Auto-scaling based on CPU/memory/request count

Storage:
  • Managed Disks: Premium SSD (P30/P40)
  • Blob Storage: Hot tier for active data, Cool for archives
  • Azure Files: SMB/NFS shares for stateful workloads
  • Azure NetApp Files: High-performance file storage

Native Azure Services:
  • Azure Sentinel (SIEM/SOAR)
  • Azure Active Directory (Identity & SSO)
  • Azure Monitor (Observability & APM)
  • Azure Key Vault (Secrets Management)
  • Azure Defender (Cloud Security Posture)
  • Azure Policy (Governance & Compliance)

AWS (Secondary - 25% of traffic)
────────────────────────────────
Region:              US-East-1 (Primary), US-West-2 (DR)
Kubernetes:          Amazon EKS v1.28
Node Groups:         
  • General: t3.xlarge (4 vCPU, 16GB RAM) - 3-10 nodes
  • GPU: g4dn.xlarge (NVIDIA T4) - 1-5 nodes
  • High-Memory: r5.2xlarge (8 vCPU, 64GB) - 1-4 nodes

Networking:
  • VPC: 10.1.0.0/16
  • Public Subnets: 10.1.1.0/24, 10.1.2.0/24 (2 AZs)
  • Private Subnets: 10.1.10.0/24, 10.1.11.0/24 (2 AZs)
  • NAT Gateways: 2 (high availability)
  • Internet Gateway: 1

Load Balancing:
  • Application Load Balancer (ALB) for HTTPS
  • Network Load Balancer (NLB) for WebSocket
  • Auto-scaling based on CPU/memory/request count

Storage:
  • EBS: gp3 volumes for persistent data
  • S3: Standard for backups, Glacier for archives
  • EFS: Shared file system for stateful workloads

GCP (Tertiary - 5% of traffic)
────────────────────────────────
Region:              us-central1
Kubernetes:          Google GKE v1.27
Node Pools:
  • Default: n2-standard-4 (4 vCPU, 16GB) - 2-6 nodes
  • Compute: c2-standard-8 (8 vCPU, 32GB) - 1-3 nodes

Networking:
  • VPC Network: 10.2.0.0/16
  • Cloud Load Balancing (L7)
  • Cloud Armor for DDoS protection

Storage:
  • Persistent Disks: SSD
  • Cloud Storage: Standard class

3.2 INFRASTRUCTURE AS CODE (IaC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tool:                Terraform v1.6.x
State Backend:       Terraform Cloud (encrypted)
Module Structure:
  ├── modules/
  │   ├── vnet/                # Azure networking
  │   ├── aks/                 # AKS cluster configuration
  │   ├── vpc/                 # AWS networking
  │   ├── eks/                 # EKS cluster configuration
  │   ├── gke/                 # GKE cluster configuration
  │   ├── database/            # Azure DB/RDS/Cloud SQL
  │   ├── monitoring/          # Azure Monitor/CloudWatch/Stackdriver
  │   └── security/            # IAM, security groups, policies
  └── environments/
      ├── production/
      ├── staging/
      └── development/

Version Control:     Git (GitHub)
Change Management:   Pull requests with automated testing
Deployment:          GitHub Actions workflows

═══════════════════════════════════════════════════════════════════════════════
4. PLATFORM SERVICES LAYER
═══════════════════════════════════════════════════════════════════════════════

4.1 KUBERNETES SERVICES (Running on Azure AKS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

API Server
──────────
Replicas:            3 (minimum), auto-scales to 10
Container Image:     outpostzero/api-server:latest
Resources:
  • CPU Request:     500m
  • CPU Limit:       2000m
  • Memory Request:  1Gi
  • Memory Limit:    4Gi

Ports:
  • 8080: HTTP/REST API
  • 8081: Health checks
  • 8443: HTTPS (TLS termination at App Gateway)

Health Checks:
  • Liveness:  /health/live (every 30s)
  • Readiness: /health/ready (every 10s)
  • Startup:   /health/startup (initial 60s)

Auto-scaling:
  • Target CPU: 70%
  • Target Memory: 80%
  • Min Replicas: 3
  • Max Replicas: 10

AI/ML Workers
──────────────
Replicas:            2 (minimum), auto-scales to 20
Container Image:     outpostzero/ai-worker:latest
GPU Requirements:    NVIDIA V100 or better
Resources:
  • CPU Request:     2000m
  • CPU Limit:       8000m
  • Memory Request:  8Gi
  • Memory Limit:    32Gi
  • GPU:             1 (NVIDIA V100/A100)

Workload Types:
  • Threat Detection (real-time)
  • Anomaly Detection (batch)
  • Model Training (scheduled)
  • Model Inference (on-demand)

Queue System:
  • Technology: Redis Queue (RQ)
  • Max Queue Size: 10,000 jobs
  • Job Timeout: 300 seconds
  • Retry Policy: 3 attempts with exponential backoff

Database Cluster (Azure Database for PostgreSQL)
────────────────
Engine:              PostgreSQL 15.4
Architecture:        Flexible Server (1 primary, 3 read replicas)
Instance Type:       Standard_D8s_v3 (8 vCPU, 32GB RAM)

Storage:
  • Type: Premium SSD
  • Size: 512GB (auto-scales to 2TB)
  • IOPS: 12,000
  • Throughput: 500 MB/s

Backup Strategy:
  • Automated Backups: Daily at 2 AM UTC
  • Backup Retention: 35 days
  • Point-in-Time Recovery: Enabled (5-minute RPO)
  • Geo-Redundant Backup: Enabled (West US 2)

Connection Pooling:
  • Tool: PgBouncer
  • Pool Size: 100 connections per replica
  • Max Client Connections: 500

High Availability:
  • Zone-Redundant HA: Enabled
  • Automated Failover: under 60 seconds
  • Read Replica Lag: under 2 seconds

Redis Cache (Azure Cache for Redis)
───────────
Version:             Redis 7.2.x
Tier:                Premium (Cluster Mode, 6 nodes)
Instance Type:       P3 (26GB per node)

Configuration:
  • Persistence: AOF + RDB
  • Eviction Policy: allkeys-lru
  • Max Memory: 25GB per node
  • TTL Strategy: Automatic expiration
  • Zone Redundancy: Enabled

Use Cases:
  • Session Storage (TTL: 24 hours)
  • Query Cache (TTL: 5 minutes)
  • Rate Limiting (sliding window)
  • Pub/Sub Messaging (real-time events)

Performance:
  • Operations/sec: 45,000+
  • Cache Hit Rate: 94.2%
  • Latency P99: under 2ms

4.2 SERVICE MESH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Technology:          Istio v1.19 (on AKS)
Components:
  • Istiod (Control Plane): 2 replicas
  • Envoy Proxy (Data Plane): Sidecar per pod
  • Ingress Gateway: 2 replicas

Features Enabled:
  ✓ Mutual TLS (mTLS) between all services
  ✓ Traffic Management (A/B testing, canary deployments)
  ✓ Circuit Breaking (max connections, retries)
  ✓ Rate Limiting (per-client quotas)
  ✓ Distributed Tracing (Azure Monitor integration)
  ✓ Service-level metrics (Prometheus)

Security Policies:
  • Default: Deny all traffic
  • Explicit allow rules per service
  • JWT validation for API requests
  • External authorization (Azure AD)

═══════════════════════════════════════════════════════════════════════════════
5. APPLICATION LAYER
════════════════════════════════════════════━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.1 CORE SERVICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Threat Detection Service
────────────────────────
Purpose:             Real-time analysis of security events
Technology:          Python 3.11, TensorFlow 2.14
Models:
  • XGBoost Classifier (network threats)
  • LSTM Neural Network (user behavior)
  • Transformer (log analysis)

Processing Pipeline:
  1. Event Ingestion (Azure Event Hubs)
  2. Feature Extraction (normalized vectors)
  3. Model Inference (GPU-accelerated on V100)
  4. Risk Scoring (0-100 scale)
  5. Alert Generation (if score over 80)
  6. Sentinel Integration (bi-directional sync)

Performance:
  • Throughput: 10,000+ events/second
  • Latency P95: 150ms
  • Accuracy: 97.3%
  • False Positive Rate: 2.1%

Incident Response Service
──────────────────────────
Purpose:             Automated response to security incidents
Technology:          Node.js 20, TypeScript
Capabilities:
  • Endpoint Isolation
  • IP Blocking
  • User Account Disable (Azure AD integration)
  • Evidence Collection
  • Ticket Creation (Azure DevOps/Jira/ServiceNow)

Integration Points:
  • EDR: CrowdStrike, SentinelOne, Carbon Black, Microsoft Defender
  • Firewall: Palo Alto, Fortinet, Cisco, Azure Firewall
  • IAM: Azure AD (primary), Okta, OneLogin
  • SOAR: Azure Sentinel, Splunk Phantom, Demisto

Compliance Engine
─────────────────
Purpose:             Continuous compliance monitoring
Frameworks Supported:
  • FedRAMP (Moderate & High)
  • CMMC 2.0 (Levels 1-3)
  • NIST 800-53 (Rev 5)
  • JSIG (DoD Cloud Security)
  • ISO 27001, SOC 2 Type II

Automated Checks:
  • Configuration Drift Detection (Azure Policy)
  • Policy Violation Scanning
  • Access Control Reviews (Azure AD logs)
  • Encryption Status Verification
  • Audit Log Analysis (Azure Monitor)

Reporting:
  • On-Demand Reports (PDF/CSV)
  • Scheduled Reports (daily/weekly/monthly)
  • Executive Dashboards (Power BI integration)
  • Compliance Posture Score (0-100)

5.2 INTEGRATION FRAMEWORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Integration Methods:
  • REST API (JSON)
  • GraphQL
  • WebSocket (real-time)
  • Webhook (event-driven)
  • SYSLOG (UDP/TCP)

Authentication:
  • Azure AD (OAuth 2.0 / OIDC) - Primary
  • API Keys (HMAC-SHA256)
  • SAML 2.0 (SSO)
  • Certificate-based (mTLS)

Rate Limiting:
  • Standard: 1,000 requests/minute
  • Premium: 10,000 requests/minute
  • Enterprise: Custom quotas

Pre-built Integrations:
  ✓ Azure Sentinel, Azure AD, Azure Monitor, Azure Key Vault
  ✓ Microsoft Defender for Cloud, Microsoft 365 Defender
  ✓ AWS Security Hub, GuardDuty, CloudTrail
  ✓ Google Chronicle, Cloud Security Command Center
  ✓ Splunk, QRadar, ArcSight, LogRhythm
  ✓ CrowdStrike, Carbon Black, SentinelOne
  ✓ Jira, ServiceNow, PagerDuty, Azure DevOps

═══════════════════════════════════════════════════════════════════════════════
6. SECURITY ARCHITECTURE
════════════════════════════════════════════━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6.1 DEFENSE IN DEPTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Layer 1: Network Security
──────────────────────────
• Azure Firewall (centralized network protection)
• Network Security Groups (NSGs) per subnet
• Azure DDoS Protection Standard
• Web Application Firewall (WAF on App Gateway)
• Network Segmentation (Zero Trust Architecture)
• Private Link/Endpoint for all Azure services
• Azure Bastion for secure VM access

Layer 2: Identity & Access Management
──────────────────────────────────────
• Azure AD SSO (SAML 2.0, OIDC) - Primary authentication
• Multi-Factor Authentication (MFA) required for all users
• Conditional Access Policies (location, device, risk-based)
• Privileged Identity Management (PIM) for admin access
• Role-Based Access Control (RBAC) at subscription/resource level
• Just-In-Time (JIT) VM Access
• Azure AD Identity Protection

Layer 3: Application Security
──────────────────────────────
• Input Validation (OWASP guidelines)
• Output Encoding (XSS prevention)
• SQL Injection Prevention (prepared statements)
• CSRF Protection (tokens)
• Security Headers (CSP, HSTS, X-Frame-Options)
• API Rate Limiting & Throttling
• Azure API Management gateway

Layer 4: Data Security
──────────────────────
• Encryption at Rest: AES-256 (Azure Storage Service Encryption)
• Encryption in Transit: TLS 1.3
• Key Management: Azure Key Vault with HSM
• Data Classification: Public, Internal, Confidential, Restricted
• Data Loss Prevention (Microsoft Purview)
• Audit Logging: Azure Monitor (immutable, WORM storage)
• Transparent Data Encryption (TDE) for databases

Layer 5: Monitoring & Response
───────────────────────────────
• Azure Sentinel (cloud-native SIEM)
• Microsoft Defender for Cloud (CSPM)
• Azure Monitor (observability platform)
• File Integrity Monitoring (FIM)
• Vulnerability Scanning: Microsoft Defender Vulnerability Management
• Penetration Testing (quarterly)
• Security Operations Center (SOC) - 24/7

6.2 COMPLIANCE & CERTIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Status:
✓ SOC 2 Type II (completed 2024)
✓ ISO 27001:2022 (certified)
✓ CMMC 2.0 Level 2 (self-assessed)
⏳ FedRAMP Moderate (in progress, expected Q2 2025)
⏳ FedRAMP High (planned Q3 2025)

Azure Compliance Leverage:
• Azure Government Cloud available for IL4/IL5 workloads
• FedRAMP High authorization (Azure infrastructure)
• CMMC Level 2 compliance (Azure services)
• HIPAA/HITECH compliance (Azure BAA available)
• PCI DSS Level 1 Service Provider

Continuous Monitoring:
• Azure Policy: 147 policies enforced
• Azure Secure Score: 91/100
• Automated compliance scanning (daily via Azure Policy)
• Manual control testing (quarterly)
• External audits (annual)
• Vendor risk assessments (ongoing)

═══════════════════════════════════════════════════════════════════════════════
7. AZURE INTEGRATION DETAILS
════════════════════════════════════════════━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7.1 AZURE SENTINEL INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Architecture:
  Outpost Zero (AKS) ──(REST API)──> Log Analytics Workspace
                                             │
                                             ├─> Sentinel Analytics Rules
                                             ├─> Threat Intelligence
                                             ├─> UEBA Analytics
                                             └─> Incident Management

Data Flow:
  1. Events collected from endpoints/services/Azure resources
  2. Normalized to Common Event Format (CEF)
  3. Sent to Log Analytics via Data Collector API
  4. Sentinel analytics rules process events in real-time
  5. Incidents created and synced bi-directionally with Outpost Zero
  6. Automated response via Logic Apps and Sentinel playbooks

Key Features:
  • Native integration (same Azure tenant)
  • Bi-directional sync (events → Sentinel, incidents ← Sentinel)
  • Custom analytics rules (47 active)
  • Automated playbooks (Logic Apps integration)
  • Threat intelligence correlation (Microsoft Threat Intelligence)
  • User Entity Behavior Analytics (UEBA)
  • Fusion detection (ML-powered multi-stage attacks)

Performance:
  • Events/Second: 10,000+
  • Ingestion Latency: under 10 seconds
  • Query Performance: under 5 seconds (90th percentile)
  • Data Retention: 90 days (hot), 2 years (archive)

Cost Optimization:
  • Commitment tiers (30% savings)
  • Data sampling for non-critical logs
  • Compression before transmission
  • Intelligent routing (high-priority events only)

7.2 AZURE ACTIVE DIRECTORY (SSO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Authentication Flow:
  User ──> Azure AD ──(SAML/OIDC Response)──> Outpost Zero (AKS)
           │
           ├─> MFA Challenge (Azure MFA)
           ├─> Conditional Access Evaluation
           ├─> Risk-based Sign-in Assessment
           └─> Token Issuance (JWT)

Configuration:
  • Protocol: SAML 2.0 (primary), OIDC (fallback)
  • Token Lifetime: 1 hour (access), 14 days (refresh)
  • Token Claims: email, name, groups, roles, department
  • MFA Enforcement: Required for all users (Azure MFA)
  • Conditional Access: 12 policies active

User Provisioning:
  • Method: SCIM 2.0 (System for Cross-domain Identity Management)
  • Sync Frequency: Real-time (event-driven via webhooks)
  • Attributes: email, first_name, last_name, department, manager, groups
  • Group Mapping: Azure AD groups → Outpost Zero roles
  • Automatic deprovisioning on user deletion

Statistics:
  • Total Users: 1,247
  • Daily Logins: 8,200+
  • MFA Adoption: 100% (enforced)
  • SSO Success Rate: 99.7%
  • Conditional Access Blocks: 127/month (avg)

7.3 AZURE MONITOR INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Components:
  • Application Insights (APM for all microservices)
  • Log Analytics (centralized logging for AKS)
  • Azure Metrics (custom metrics collection)
  • Alerts & Action Groups (intelligent alerting)
  • Azure Workbooks (custom dashboards)

Telemetry Collected:
  • Application Logs (INFO, WARN, ERROR, FATAL)
  • Performance Counters (CPU, memory, disk, network)
  • Custom Metrics (API latency, queue depth, cache hit rate, threat score)
  • Distributed Traces (end-to-end request tracking across services)
  • Dependencies (database, cache, external APIs, Azure services)
  • Live Metrics Stream (real-time monitoring)

Dashboards:
  • Executive Overview (uptime, users, revenue, security posture)
  • Operations Dashboard (resource utilization, errors, performance)
  • Security Dashboard (threats detected, incidents, Secure Score)
  • Performance Dashboard (latency, throughput, errors by service)

Alerting:
  • 15 active alert rules
  • Severity levels: Critical, High, Medium, Low, Informational
  • Notification channels: Email, SMS, PagerDuty, Slack, Teams
  • Suppression rules (prevent alert fatigue)
  • Smart grouping (ML-powered alert correlation)

Performance:
  • Data Points/Hour: 2.1 million
  • Query Latency P95: 42ms
  • Retention: 30 days (hot), 2 years (cold)
  • Cost: Optimized with commitment tiers

7.4 AZURE KEY VAULT INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Secrets Stored:
  • Database Credentials (PostgreSQL connection strings)
  • API Keys (Stripe, SendGrid, Twilio, external services)
  • TLS Certificates (wildcard SSL for *.outpostzero.com)
  • Encryption Keys (AES-256 for data at rest, customer-managed)
  • OAuth Client Secrets (Azure AD, Okta, third-party)
  • Service Principal credentials

Access Control:
  • Managed Identity for AKS pods (no credentials in code)
  • Azure RBAC for Key Vault access
  • No static credentials in code or config files
  • Audit logging for all access (who, what, when, where)
  • Automatic secret rotation (passwords: 90 days, certs: 30 days before expiry)
  • Private endpoint (no public internet access)

HSM-Backed Keys:
  • Type: Azure Key Vault Premium (FIPS 140-2 Level 2 compliant)
  • Key Operations: Sign, Verify, Encrypt, Decrypt, Wrap, Unwrap
  • Key Types: RSA-2048, RSA-4096, EC (P-256, P-384, P-521)
  • HSM protection for customer-managed encryption keys

Integration Method:
  • CSI Driver for Kubernetes (Azure Key Vault Provider for Secrets Store)
  • Secrets mounted as volumes in AKS pods
  • Automatic refresh (every 2 minutes)
  • Managed Identity authentication (no credentials)

Statistics:
  • Total Secrets: 23
  • Total Certificates: 5
  • Total Keys: 8
  • Operations/Day: 1,200+
  • Uptime: 100% (last 12 months)
  • Average Latency: 15ms

═══════════════════════════════════════════════════════════════════════════════
8. PERFORMANCE SPECIFICATIONS
════════════════════════════════════════════━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8.1 THROUGHPUT & LATENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

API Performance (Azure AKS):
  Metric                  Current     Target (2025)
  ────────────────────────────────────────────────
  Requests/Min            2,400       10,000
  Response Time P50       38ms        20ms
  Response Time P95       95ms        50ms
  Response Time P99       210ms       100ms
  Error Rate              0.03%       under 0.01%

Event Processing:
  Metric                  Current     Target (2025)
  ────────────────────────────────────────────────
  Events/Second           10,000      50,000
  Processing Latency      150ms       50ms
  Queue Depth (Avg)       234         under 100
  Queue Depth (Max)       1,200       under 500

AI/ML Processing (Azure V100 GPUs):
  Metric                  Current     Target (2025)
  ────────────────────────────────────────────────
  Model Inference/Hour    1,200       5,000
  Inference Latency       165ms       80ms
  Model Accuracy          97.3%       98.5%
  False Positive Rate     2.1%        under 1.0%

Database Performance (Azure PostgreSQL):
  Metric                  Current     Target (2025)
  ────────────────────────────────────────────────
  Queries/Minute          8,700       25,000
  Write Latency P95       12ms        8ms
  Read Latency P95        4ms         2ms
  Connections (Active)    127/500     200/1000
  Replication Lag         under 1s    under 500ms

Cache Performance (Azure Cache for Redis):
  Metric                  Current     Target (2025)
  ────────────────────────────────────────────────
  Operations/Second       45,000      100,000
  Cache Hit Rate          94.2%       97%
  Latency P99             under 2ms   under 1ms
  Memory Utilization      83%         75%

8.2 AVAILABILITY & RELIABILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SLA Targets:
  Service                 SLA         Achieved (12mo avg)
  ─────────────────────────────────────────────────────
  Platform Uptime         99.9%       99.98%
  API Availability        99.95%      99.99%
  Data Durability         99.999999%  100%
  Support Response        under 4hr   under 2hr

Azure SLA Benefits:
  • AKS: 99.95% (with Availability Zones)
  • Azure Database: 99.99% (Zone-redundant HA)
  • Azure Cache: 99.9% (Premium tier)
  • Azure Storage: 99.9% (LRS), 99.99% (ZRS)
  • Application Gateway: 99.95%

Mean Time Between Failures (MTBF):
  Component               MTBF
  ──────────────────────────────
  API Servers (AKS)       2,400 hours (100 days)
  AI Workers              1,680 hours (70 days)
  Database                5,040 hours (7 months)
  Cache                   3,120 hours (130 days)

Mean Time To Recovery (MTTR):
  Incident Type           MTTR        Auto-Recovery
  ──────────────────────────────────────────────────
  Pod Crash               under 90s   Yes (AKS)
  Node Failure            under 4m    Yes (AKS)
  Zone Outage             under 8m    Yes (Zone-redundant)
  Region Outage           under 25m   Manual (West US 2)
  Data Corruption         under 90m   Manual (PITR)

═══════════════════════════════════════════════════════════════════════════════
9. DISASTER RECOVERY & HIGH AVAILABILITY
════════════════════════════════════════════━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9.1 HIGH AVAILABILITY DESIGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Multi-Zone Deployment (Azure):
  • All services deployed across 3 Availability Zones in East US
  • Application Gateway distributes traffic across zones
  • Automatic failover if zone becomes unavailable
  • Zone-redundant storage (ZRS) for all data

Multi-Region Architecture:
  Primary Region:    East US (Azure)
  DR Region:         West US 2 (Azure)
  Replication:       Continuous async replication
  Failover Time:     under 25 minutes (manual trigger with runbook)
  Data Loss (RPO):   under 5 minutes

Database High Availability:
  • Zone-redundant HA: Automatic failover under 60 seconds
  • Read replicas in 3 zones for load distribution
  • Geo-replica in West US 2 for disaster recovery
  • Automated backups with 35-day retention
  • Point-in-time restore to any second (within retention)

9.2 DISASTER RECOVERY PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Recovery Objectives:
  Recovery Time Objective (RTO):  25 minutes
  Recovery Point Objective (RPO): 5 minutes

Backup Strategy:
  Component           Frequency       Retention    Location
  ───────────────────────────────────────────────────────────
  Database            Continuous      35 days      Azure Backup
  Configuration       On change       90 days      Git + Azure Repos
  Secrets             Daily           30 days      Key Vault (geo-replicated)
  Logs                Continuous      2 years      Log Analytics
  Container Images    On build        Indefinite   Azure Container Registry
  Blob Storage        Continuous      90 days      GRS (West US 2)

Testing:
  • DR Drills: Quarterly (full regional failover test)
  • Backup Validation: Weekly (automated restore test)
  • Runbook Updates: After each drill
  • Last DR Test: December 15, 2024 (Success - 23 min RTO)

Disaster Scenarios:
  1. Single Zone Failure → Auto-failover (under 8 min, no data loss)
  2. Full Region Outage → Manual failover to West US 2 (under 25 min)
  3. Data Corruption → Point-in-time restore (under 90 min)
  4. Ransomware → Restore from immutable backups (under 2 hours)
  5. Azure Service Outage → Failover to AWS (under 4 hours)

═══════════════════════════════════════════════════════════════════════════════
10. MONITORING & OBSERVABILITY
════════════════════════════════════════════━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10.1 OBSERVABILITY STACK (Azure-Native)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Metrics:
  Tool:          Azure Monitor Metrics
  Retention:     93 days (high-res), 2 years (1-min aggregation)
  Collection:    Every 60 seconds (default), 10s for critical
  Dashboards:    Azure Workbooks + Power BI

Logging:
  Tool:          Azure Monitor Logs (Log Analytics)
  Retention:     30 days (interactive), 2 years (archive)
  Volume:        2.1 million events/hour
  Search:        KQL (Kusto Query Language)

Tracing:
  Tool:          Azure Application Insights (distributed tracing)
  Sampling:      10% adaptive sampling (100% for errors)
  Retention:     90 days
  Correlation:   Operation ID propagation across all services

Alerting:
  Tool:          Azure Monitor Alerts + Action Groups
  Rules:         15 active alert rules
  Notification:  Email, SMS, Teams, PagerDuty, Webhook
  Escalation:    Smart grouping and suppression
  On-Call:       24/7 rotation (4 engineers)

10.2 KEY METRICS TRACKED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Golden Signals:
  • Latency (response time per service)
  • Traffic (requests per second)
  • Errors (error rate by type and service)
  • Saturation (resource utilization across AKS)

Custom Business Metrics:
  • Threats Detected (hourly)
  • Incidents Created (daily)
  • False Positive Rate (%)
  • Customer Onboarding Time (hours)
  • Revenue (MRR, ARR)
  • Customer Churn Rate (%)
  • Sentinel Analytics Rule Performance

Infrastructure Metrics:
  • CPU Utilization (per pod, per node, per zone)
  • Memory Utilization (per pod, per node, per zone)
  • Disk I/O (IOPS, throughput, latency)
  • Network I/O (bandwidth, packets/sec, drops)
  • Pod Restarts (count, reason, duration)
  • Node Status (ready, not ready, pressure)
  • Azure Secure Score (security posture)

═══════════════════════════════════════════════════════════════════════════════
APPENDIX A: WHY AZURE AS PRIMARY CLOUD
═══════════════════════════════════════════════════════════════════════════════

Strategic Benefits:
  1. Native Security Integration
     • Seamless Sentinel (SIEM) integration
     • Built-in Azure AD SSO (no third-party auth)
     • Microsoft Defender for Cloud (CSPM)
     • Unified security posture across all services

  2. Government & Compliance
     • Azure Government Cloud (IL4/IL5/IL6)
     • FedRAMP High authorized infrastructure
     • CMMC Level 2+ compliant services
     • Easier path to government customers

  3. Microsoft Partnership
     • ISV Success Program member
     • Co-sell opportunities with Microsoft field
     • Azure Marketplace presence
     • Integrated billing for enterprise customers

  4. Cost & Performance
     • Reserved capacity pricing (30-50% savings)
     • Azure Hybrid Benefit (Windows/SQL licensing)
     • Lower egress costs within Azure ecosystem
     • Better latency for Azure-native services

  5. Enterprise Readiness
     • 99.99% SLA for zone-redundant services
     • Global presence (60+ regions)
     • Enterprise support agreements
     • Established enterprise customer base

═══════════════════════════════════════════════════════════════════════════════
APPENDIX B: GLOSSARY
═══════════════════════════════════════════════════════════════════════════════

AKS         Azure Kubernetes Service
ALB         Application Load Balancer
API         Application Programming Interface
APM         Application Performance Monitoring
AZ          Availability Zone
CMMC        Cybersecurity Maturity Model Certification
CSPM        Cloud Security Posture Management
CSI         Container Storage Interface
DDoS        Distributed Denial of Service
DR          Disaster Recovery
EKS         Elastic Kubernetes Service (AWS)
FedRAMP     Federal Risk and Authorization Authorization Management Program
GKE         Google Kubernetes Engine
HA          High Availability
HSM         Hardware Security Module
IaC         Infrastructure as Code
IL          Impact Level (DoD classification)
JSIG        Joint Special Operations Command Information Security Guide
KQL         Kusto Query Language
mTLS        Mutual Transport Layer Security
RBAC        Role-Based Access Control
RPO         Recovery Point Objective
RTO         Recovery Time Objective
SAML        Security Assertion Markup Language
SCIM        System for Cross-domain Identity Management
SIEM        Security Information and Event Management
SLA         Service Level Agreement
SOC         Security Operations Center
SOAR        Security Orchestration, Automation and Response
SSO         Single Sign-On
TLS         Transport Layer Security
UEBA        User and Entity Behavior Analytics
WAF         Web Application Firewall

═══════════════════════════════════════════════════════════════════════════════

Generated: ${new Date().toLocaleString()}
Document Version: 3.0 (Azure Primary)
Last Updated: ${new Date().toLocaleDateString()}

For questions or clarifications, contact:
  Technical Support: support@outpostzero.com
  Sales Engineering: presales@outpostzero.com
  Partner Relations: partners@cyberdojogroup.com
  Azure Specialists: azure@outpostzero.com

═══════════════════════════════════════════════════════════════════════════════
                          END OF DOCUMENT
═══════════════════════════════════════════════════════════════════════════════
`;

    const blob = new Blob([doc], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Outpost-Zero-Architecture-Azure-Primary-${Date.now()}.txt`;
    a.click();
  };

  const downloadVisualDiagram = () => {
    alert('Visual diagram export: Use browser screenshot tools or print to PDF for best results. High-resolution SVG export coming soon!');
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Server className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Platform Architecture</h1>
          </div>
          <p className="text-xl text-gray-300 mb-6">
            Comprehensive Technical Documentation & Visual Diagrams
          </p>
          <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50 px-4 py-2 text-base mb-4">
            <Cloud className="w-5 h-5 mr-2" />
            Azure-Hosted Infrastructure (Primary Cloud)
          </Badge>
          <div className="flex justify-center gap-3 flex-wrap">
            <Button 
              onClick={downloadDetailedDoc}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Full Documentation (16 Pages)
            </Button>
            <Button 
              onClick={downloadVisualDiagram}
              variant="outline"
              className="border-gray-600"
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              Export Visual Diagram
            </Button>
          </div>
        </div>

        <Alert className="mb-6 border-cyan-500/50 bg-cyan-500/10">
          <Activity className="h-5 w-5 text-cyan-400" />
          <AlertDescription className="text-cyan-200">
            <strong>Azure-Native Architecture:</strong> 70% of infrastructure runs on Microsoft Azure with native Sentinel, Azure AD, Monitor, and Key Vault integration. Click any component for detailed specs.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="visual">Visual Diagram</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Specs</TabsTrigger>
            <TabsTrigger value="azure">Azure Integration</TabsTrigger>
          </TabsList>

          {/* Visual Diagram Tab */}
          <TabsContent value="visual">
            <ArchitectureDiagram />
          </TabsContent>

          {/* Detailed Specifications Tab */}
          <TabsContent value="detailed" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-blue-400" />
                    Multi-Cloud Infrastructure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <Badge className="bg-blue-600">PRIMARY</Badge>
                      Azure (70%)
                    </h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div>• AKS v1.27 (Kubernetes)</div>
                      <div>• Standard_D4s_v3 nodes (6-20 auto-scaling)</div>
                      <div>• NC6s_v3 GPU nodes (NVIDIA V100)</div>
                      <div>• VNet: 10.0.0.0/16 (Zone-redundant)</div>
                      <div>• Application Gateway v2 (WAF)</div>
                      <div>• Managed Disks + Blob Storage</div>
                      <div className="mt-2 pt-2 border-t border-blue-500/30">
                        <strong>Native Services:</strong> Sentinel, Azure AD, Monitor, Key Vault
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <Badge className="bg-orange-600/50">SECONDARY</Badge>
                      AWS (25%)
                    </h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div>• EKS v1.28 (Kubernetes)</div>
                      <div>• t3.xlarge nodes (3-10 auto-scaling)</div>
                      <div>• g4dn.xlarge GPU nodes (NVIDIA T4)</div>
                      <div>• VPC: 10.1.0.0/16 (Multi-AZ)</div>
                      <div>• ALB/NLB for load balancing</div>
                      <div>• S3 + EBS + EFS storage</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <Badge className="bg-gray-600/50">TERTIARY</Badge>
                      GCP (5%)
                    </h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div>• GKE v1.27 (Kubernetes)</div>
                      <div>• n2-standard-4 nodes (2-6)</div>
                      <div>• VPC: 10.2.0.0/16</div>
                      <div>• Cloud Load Balancing (L7)</div>
                      <div>• Cloud Storage + Persistent Disks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-cyan-400" />
                    Kubernetes Services (AKS)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">API Server</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div>• Replicas: 3 (auto-scales to 10)</div>
                      <div>• CPU: 500m request, 2000m limit</div>
                      <div>• Memory: 1Gi request, 4Gi limit</div>
                      <div>• Performance: 2.4K req/min, 99.99% uptime</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">AI Workers</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div>• Replicas: 2 (auto-scales to 20)</div>
                      <div>• GPU: NVIDIA V100/A100</div>
                      <div>• CPU: 2-8 cores, Memory: 8-32GB</div>
                      <div>• Performance: 1.2K jobs/hr, 97.3% accuracy</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Azure Database for PostgreSQL</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div>• PostgreSQL 15.4 (Primary + 3 replicas)</div>
                      <div>• Standard_D8s_v3 (8 vCPU, 32GB)</div>
                      <div>• Storage: 512GB Premium SSD (12K IOPS)</div>
                      <div>• Zone-redundant HA enabled</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Azure Cache for Redis</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div>• Redis 7.2.x Premium (6 nodes)</div>
                      <div>• P3 tier (26GB per node)</div>
                      <div>• Performance: 45K ops/sec, 94.2% hit rate</div>
                      <div>• Zone redundancy enabled</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    Security Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-white text-sm font-medium">Encryption</div>
                      <div className="text-xs text-gray-400">At Rest: AES-256 (Azure SSE) | In Transit: TLS 1.3</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-white text-sm font-medium">Network Security</div>
                      <div className="text-xs text-gray-400">Azure Firewall, WAF, DDoS Standard, Zero Trust</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-white text-sm font-medium">Identity & Access</div>
                      <div className="text-xs text-gray-400">Azure AD (primary), MFA required, Conditional Access</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-white text-sm font-medium">Compliance</div>
                      <div className="text-xs text-gray-400">SOC 2, ISO 27001, FedRAMP (in progress), Azure Gov ready</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-white text-sm font-medium">Monitoring</div>
                      <div className="text-xs text-gray-400">Azure Sentinel, Defender for Cloud, 24/7 SOC</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    Performance & SLA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Current Performance (Azure)</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-400">API Requests:</div>
                      <div className="text-white text-right">2.4K/min</div>
                      <div className="text-gray-400">Event Processing:</div>
                      <div className="text-white text-right">10K/sec</div>
                      <div className="text-gray-400">API Latency P95:</div>
                      <div className="text-white text-right">95ms</div>
                      <div className="text-gray-400">Uptime (12mo):</div>
                      <div className="text-green-400 text-right">99.98%</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">2025 Targets</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-400">API Requests:</div>
                      <div className="text-cyan-400 text-right">10K/min</div>
                      <div className="text-gray-400">Event Processing:</div>
                      <div className="text-cyan-400 text-right">50K/sec</div>
                      <div className="text-gray-400">API Latency P95:</div>
                      <div className="text-cyan-400 text-right">50ms</div>
                      <div className="text-gray-400">Uptime SLA:</div>
                      <div className="text-cyan-400 text-right">99.999%</div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-700">
                    <h4 className="text-white font-semibold mb-2 text-sm">Azure SLA Benefits</h4>
                    <div className="space-y-1 text-xs text-gray-300">
                      <div>• AKS: 99.95% (Zone-redundant)</div>
                      <div>• Azure DB: 99.99% (Zone-redundant HA)</div>
                      <div>• Redis: 99.9% (Premium tier)</div>
                      <div>• Storage: 99.99% (ZRS)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Azure Integration Tab */}
          <TabsContent value="azure" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-400" />
                    Azure Sentinel (SIEM)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Integration Method</h4>
                    <div className="text-sm text-gray-300">
                      REST API → Log Analytics Workspace → Sentinel Analytics
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Live Metrics</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-400">Events/Second</div>
                        <div className="text-lg text-white font-semibold">10,000+</div>
                      </div>
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-400">Active Rules</div>
                        <div className="text-lg text-white font-semibold">47</div>
                      </div>
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-400">Incidents Today</div>
                        <div className="text-lg text-white font-semibold">23</div>
                      </div>
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-400">Coverage</div>
                        <div className="text-lg text-green-400 font-semibold">89%</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Features</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Bi-directional sync (events & incidents)
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Custom analytics rules
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Automated playbooks (Logic Apps)
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Threat intelligence correlation
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Azure Active Directory (SSO)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Integration Method</h4>
                    <div className="text-sm text-gray-300">
                      SAML 2.0 + OIDC | SCIM 2.0 provisioning
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Live Metrics</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-400">Total Users</div>
                        <div className="text-lg text-white font-semibold">1,247</div>
                      </div>
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-400">Daily Logins</div>
                        <div className="text-lg text-white font-semibold">8.2K</div>
                      </div>
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-400">MFA Adoption</div>
                        <div className="text-lg text-green-400 font-semibold">94%</div>
                      </div>
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-400">SSO Success</div>
                        <div className="text-lg text-green-400 font-semibold">99.7%</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Configuration</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Token lifetime: 1h (access), 14d (refresh)
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Real-time user provisioning (SCIM)
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Group-based role mapping
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Azure Monitor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Components</h4>
                    <div className="text-sm text-gray-300">
                      Application Insights + Log Analytics + Metrics
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Live Metrics</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-400">Datapoints/Hour</div>
                        <div className="text-lg text-white font-semibold">2.1M</div>
                      </div>
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-400">Alert Rules</div>
                        <div className="text-lg text-white font-semibold">15</div>
                      </div>
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-400">Active Alerts</div>
                        <div className="text-lg text-yellow-400 font-semibold">3</div>
                      </div>
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-400">Query Latency</div>
                        <div className="text-lg text-green-400 font-semibold">42ms</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Telemetry</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Application logs & performance counters
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Custom metrics & distributed traces
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        4 custom dashboards
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-400" />
                    Azure Key Vault
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Integration Method</h4>
                    <div className="text-sm text-gray-300">
                      CSI Driver for Kubernetes (Managed Identity)
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Live Metrics</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-400">Secrets</div>
                        <div className="text-lg text-white font-semibold">23</div>
                      </div>
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-400">Certificates</div>
                        <div className="text-lg text-white font-semibold">5</div>
                      </div>
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-400">Operations/Day</div>
                        <div className="text-lg text-white font-semibold">1.2K</div>
                      </div>
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-400">Uptime</div>
                        <div className="text-lg text-green-400 font-semibold">100%</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Security</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        HSM-backed keys (FIPS 140-2 Level 2)
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Automatic rotation (90 days)
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Audit logging for all access
                      </div>
                    </div>
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
