// Master Architecture Documentation for Outpost Zero
// This file exports the comprehensive architecture document

export const masterArchitectureDoc = `
  # Outpost Zero – Master Architecture Document
  ## Microsoft ISV Success Program – April 2026 GTM Target

  ---

  ## Executive Summary

  Outpost Zero is a unified physical and cyber security platform designed for enterprise 
  deployment on Microsoft Azure. This document outlines the complete architectural vision, 
  aligned with Microsoft frameworks and ISV program requirements.

  ---

  ## 1. Architecture Principles

  ### 1.1 Microsoft Cloud Adoption Framework (CAF) Alignment

  | CAF Phase | Outpost Zero Implementation |
  |-----------|----------------------------|
  | **Strategy** | Security SaaS for Microsoft-centric enterprises |
  | **Plan** | Multi-tenant architecture with per-customer data isolation |
  | **Ready** | Azure landing zone with dedicated subscription and RBAC |
  | **Adopt** | CI/CD pipelines via GitHub Actions for automated deployment |
  | **Govern** | Azure Policy, tagging standards, cost management dashboards |
  | **Secure** | Zero Trust principles, Defender integration, encryption everywhere |
  | **Manage** | Azure Monitor, Application Insights, automated alerting |

  ### 1.2 Azure Well-Architected Framework (WAF) Pillars

  | Pillar | Implementation |
  |--------|----------------|
  | **Reliability** | Multi-region capability, health probes, auto-restart, graceful degradation |
  | **Security** | Entra ID authentication, Key Vault secrets, encryption at rest/transit, RBAC |
  | **Cost Optimization** | Right-sized SKUs, auto-scaling, reserved instances for production |
  | **Operational Excellence** | Infrastructure as Code (Bicep), CI/CD, comprehensive logging |
  | **Performance Efficiency** | CDN for static assets, connection pooling, async processing |

  ### 1.3 Zero Trust Architecture

  | Principle | Implementation |
  |-----------|----------------|
  | **Verify Explicitly** | Every request authenticated via Microsoft Entra ID |
  | **Least Privilege** | Role-based access control with scoped permissions |
  | **Assume Breach** | Network segmentation, audit logging, encryption everywhere |

  ---

  ## 2. System Architecture

  ### 2.1 High-Level Architecture Diagram

  \`\`\`
  ┌─────────────────────────────────────────────────────────────────────┐
  │                           USERS                                      │
  │                    (Browser / Mobile / API)                          │
  └──────────────────────────┬──────────────────────────────────────────┘
                             │ HTTPS (TLS 1.3)
                             ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │                    AZURE FRONT DOOR                                  │
  │              (CDN, WAF, Global Load Balancing, DDoS)                 │
  └──────────────────────────┬──────────────────────────────────────────┘
                             │
           ┌─────────────────┴─────────────────┐
           ▼                                   ▼
  ┌─────────────────────┐           ┌─────────────────────┐
  │   FRONTEND APP      │           │    API LAYER        │
  │   (App Service)     │           │   (App Service)     │
  │   • React SPA       │           │   • Node.js         │
  │   • Entra ID Auth   │           │   • REST/GraphQL    │
  │   • TypeScript      │           │   • Multi-tenant    │
  └─────────────────────┘           └──────────┬──────────┘
                                               │
           ┌───────────────┬───────────────────┼───────────────┐
           ▼               ▼                   ▼               ▼
  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
  │  KEY VAULT  │  │  AZURE SQL  │  │  STORAGE    │  │  DEFENDER   │
  │  (Secrets)  │  │  (Data)     │  │  (Files)    │  │  (Signals)  │
  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
           │               │                   │               │
           └───────────────┴───────────────────┴───────────────┘
                                     │
                                     ▼
                      ┌─────────────────────────┐
                      │     AZURE MONITOR       │
                      │   • Application Insights│
                      │   • Log Analytics       │
                      │   • Alerts & Dashboards │
                      └─────────────────────────┘
  \`\`\`

  ### 2.2 Component Breakdown

  #### Frontend Layer
  - **Technology**: React 18, TypeScript, Vite, Tailwind CSS
  - **Hosting**: Azure App Service (Linux) or Static Web Apps
  - **Authentication**: MSAL.js with Entra ID OIDC
  - **Features**: Real-time dashboards, responsive design, offline capability

  #### API Layer
  - **Technology**: Node.js, Express/Fastify
  - **Hosting**: Azure App Service with Managed Identity
  - **Security**: JWT validation, rate limiting, request signing
  - **Multi-tenancy**: Tenant isolation via database partitioning

  #### Data Layer
  - **Primary**: Azure SQL Database (General Purpose)
  - **Alternative**: Cosmos DB for global distribution
  - **Encryption**: TDE enabled, customer-managed keys optional
  - **Backup**: Geo-redundant with 35-day retention

  #### Security Layer
  - **Secrets**: Azure Key Vault with RBAC
  - **Identity**: Managed Identity for all service-to-service
  - **Network**: Private endpoints for production
  - **Monitoring**: Defender for Cloud integration

  ---

  ## 3. Microsoft Entra ID Integration

  ### 3.1 Authentication Flow

  \`\`\`
  User → Frontend → MSAL.js → Entra ID → Token → API → Validate → Response
  \`\`\`

  ### 3.2 App Registration Configuration

  | Setting | Value |
  |---------|-------|
  | **Redirect URIs** | https://app.outpostzero.com/auth/callback |
  | **ID Tokens** | Enabled |
  | **Access Tokens** | Enabled |
  | **App Roles** | SecurityAdmin, Analyst, Viewer |
  | **API Permissions** | User.Read, Directory.Read.All (optional) |

  ### 3.3 Conditional Access Support

  - Multi-factor authentication enforcement
  - Device compliance policies
  - Location-based access controls
  - Session management

  ---

  ## 4. Microsoft Defender Integration

  ### 4.1 Supported Integrations

  | Defender Product | Integration Method |
  |------------------|-------------------|
  | **Defender for Endpoint** | Graph Security API |
  | **Defender for Cloud** | Azure Resource Graph |
  | **Defender for Cloud Apps** | MCAS API |
  | **Microsoft Sentinel** | Log Analytics workspace |

  ### 4.2 Data Flow

  - Real-time alert ingestion via webhooks
  - Scheduled synchronization for inventory
  - Bi-directional incident management
  - Threat intelligence enrichment

  ---

  ## 5. SaaS Marketplace Requirements

  ### 5.1 Technical Requirements

  | Requirement | Implementation |
  |-------------|----------------|
  | **Landing Page** | Plan selection, tenant onboarding |
  | **Fulfillment API** | Subscription lifecycle webhooks |
  | **Metering API** | Usage-based billing (future) |
  | **Multi-tenancy** | Isolated data per customer |
  | **SSO** | Entra ID with OpenID Connect |

  ### 5.2 Subscription States

  \`\`\`
  PendingFulfillment → Subscribed → Suspended → Unsubscribed
  \`\`\`

  ---

  ## 6. Responsible AI Principles

  ### 6.1 AI/ML Components

  - Threat detection models
  - Anomaly detection for UEBA
  - Natural language processing for log analysis
  - Predictive risk scoring

  ### 6.2 Compliance

  | Principle | Implementation |
  |-----------|----------------|
  | **Fairness** | Bias testing in ML models |
  | **Reliability** | Model validation and monitoring |
  | **Privacy** | Data minimization, anonymization |
  | **Inclusiveness** | Accessible UI, multi-language support |
  | **Transparency** | Explainable AI outputs |
  | **Accountability** | Audit trails, human oversight |

  ---

  ## 7. Compliance & Certifications

  ### 7.1 Target Certifications

  | Framework | Status | Target Date |
  |-----------|--------|-------------|
  | SOC 2 Type II | Roadmap | Q4 2026 |
  | ISO 27001 | Roadmap | Q1 2027 |
  | FedRAMP | Design-ready | TBD |
  | GDPR | Compliant | Current |
  | HIPAA | Design-ready | Current |

  ### 7.2 Azure Compliance Inheritance

  Outpost Zero inherits Azure's comprehensive compliance certifications 
  for underlying infrastructure.

  ---

  ## 8. Deployment Architecture

  ### 8.1 Environment Strategy

  | Environment | Purpose | SKU | Region |
  |-------------|---------|-----|--------|
  | **Dev** | Development, testing | B1 | East US |
  | **Staging** | Pre-production validation | S1 | East US |
  | **Production** | Customer workloads | P1v3 | Multi-region |

  ### 8.2 CI/CD Pipeline

  \`\`\`
  GitHub → Actions → Build → Test → Bicep Deploy → Smoke Test → Release
  \`\`\`

  ### 8.3 Deployment Command

  \`\`\`bash
  az deployment group create \\
    --resource-group rg-outpost-zero \\
    --template-file infra/main.bicep \\
    --parameters environment=prod namePrefix=ozprod
  \`\`\`

  ---

  ## 9. Monitoring & Observability

  ### 9.1 Telemetry Stack

  - **Application Insights**: Request tracing, dependencies, custom events
  - **Log Analytics**: Centralized log aggregation, KQL queries
  - **Azure Monitor**: Metrics, dashboards, alerts
  - **Defender for Cloud**: Security posture, recommendations

  ### 9.2 Key Metrics

  | Metric | Target | Alert Threshold |
  |--------|--------|-----------------|
  | Availability | 99.9% | < 99.5% |
  | Response Time | < 200ms | > 500ms |
  | Error Rate | < 0.1% | > 1% |
  | CPU Usage | < 70% | > 85% |

  ---

  ## 10. Security Controls

  ### 10.1 Network Security

  - Azure Front Door with WAF
  - DDoS Protection Standard
  - Private endpoints for data services
  - Network Security Groups

  ### 10.2 Data Security

  - Encryption at rest (AES-256)
  - Encryption in transit (TLS 1.3)
  - Customer-managed keys (optional)
  - Data residency controls

  ### 10.3 Identity Security

  - Passwordless authentication support
  - Privileged Identity Management
  - Just-in-time access
  - Continuous access evaluation

  ---

  ## Document Information

  | Field | Value |
  |-------|-------|
  | **Version** | 1.0 |
  | **Last Updated** | November 2024 |
  | **Owner** | Cyber Dojo Solutions, LLC |
  | **Classification** | Internal / Partner |

  ---

  © 2024 Cyber Dojo Solutions, LLC. All rights reserved.
`;

export default masterArchitectureDoc;