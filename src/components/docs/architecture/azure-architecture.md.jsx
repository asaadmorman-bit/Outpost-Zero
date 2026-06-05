// Azure Architecture Documentation for Outpost Zero
// This file stores the markdown content as a JavaScript export for use in the app

export const azureArchitectureDoc = `
# Outpost Zero – Azure Architecture & ISV POC

## Architecture

Outpost Zero is deployed as a multi-tenant SaaS solution on Microsoft Azure, designed to meet enterprise security requirements and Microsoft Marketplace technical standards.

---

## 1. High-Level Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                           USERS                                      │
│                    (Browser / Mobile)                                │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AZURE FRONT DOOR                                  │
│              (CDN, WAF, Global Load Balancing)                       │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         ▼                                   ▼
┌─────────────────────┐           ┌─────────────────────┐
│   FRONTEND APP      │           │    API LAYER        │
│   (App Service)     │           │   (App Service)     │
│   • React SPA       │           │   • Node.js         │
│   • Entra ID Auth   │           │   • REST APIs       │
└─────────────────────┘           └──────────┬──────────┘
                                             │
         ┌───────────────┬───────────────────┼───────────────┐
         ▼               ▼                   ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  KEY VAULT  │  │  COSMOS DB  │  │  STORAGE    │  │  DEFENDER   │
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
                    │   • Alerts              │
                    └─────────────────────────┘
\`\`\`

---

## 2. Cloud Adoption Framework (CAF) Alignment

| CAF Phase | Implementation |
|-----------|----------------|
| **Strategy** | Security SaaS for Microsoft-centric organizations |
| **Plan** | Multi-tenant architecture with per-customer isolation |
| **Ready** | Landing zone with dedicated subscription and RBAC |
| **Adopt** | CI/CD pipelines for automated deployment |
| **Govern** | Azure Policy, tagging standards, cost management |
| **Secure** | Zero Trust, Defender integration, encryption |
| **Manage** | Azure Monitor, automated alerts, SLA tracking |

---

## 3. Well-Architected Framework Pillars

### Reliability
- Multi-region deployment capability
- Health probes and auto-restart
- Graceful degradation patterns

### Security
- Microsoft Entra ID authentication
- Key Vault for all secrets
- Encryption at rest and in transit
- RBAC with least privilege

### Cost Optimization
- Right-sized SKUs per environment
- Auto-scaling rules
- Reserved instances for production

### Operational Excellence
- Infrastructure as Code (Bicep)
- CI/CD with GitHub Actions
- Comprehensive logging

### Performance Efficiency
- CDN for static assets
- Connection pooling
- Async processing for heavy workloads

---

## 4. Zero Trust Implementation

| Principle | Implementation |
|-----------|----------------|
| **Verify Explicitly** | Every request authenticated via Entra ID |
| **Least Privilege** | Role-based access, scoped permissions |
| **Assume Breach** | Network segmentation, audit logging, encryption |

---

## 5. Microsoft Entra Integration

- **Authentication**: OAuth 2.0 / OIDC via Microsoft identity platform
- **Authorization**: App roles mapped to Outpost Zero permissions
- **Conditional Access**: Supports MFA and device compliance policies
- **Single Sign-On**: Seamless SSO for enterprise users

---

## 6. Microsoft Defender Integration

- Ingest alerts from Defender for Endpoint
- Correlate with Defender for Cloud Apps signals
- Surface coverage gaps and misconfigurations
- Real-time threat intelligence enrichment

---

## 7. Compliance Alignment

| Framework | Status |
|-----------|--------|
| SOC 2 Type II | Roadmap |
| ISO 27001 | Roadmap |
| GDPR | Compliant |
| HIPAA | Design-ready |

Azure's underlying certifications extend to Outpost Zero deployments.

---

## 8. SaaS Marketplace Requirements

- **Landing Page**: Plan selection and onboarding
- **Fulfillment API**: Subscription lifecycle management
- **Metering API**: Usage-based billing (future)
- **Multi-tenancy**: Isolated data per customer

---

## 9. Monitoring & Observability

- **Application Insights**: Request tracing, dependencies, custom events
- **Log Analytics**: Centralized log aggregation
- **Dashboards**: Real-time KPIs and health metrics
- **Alerts**: Proactive notification on anomalies

---

## 10. Deployment

Deploy using Azure CLI:

\`\`\`bash
az deployment group create \\
  --resource-group rg-outpost-zero \\
  --template-file infra/main.bicep \\
  --parameters environment=prod entraTenantId=<tenant-id> entraClientId=<client-id>
\`\`\`

---

© 2024 Cyber Dojo Solutions, LLC. All rights reserved.
`;

export default azureArchitectureDoc;