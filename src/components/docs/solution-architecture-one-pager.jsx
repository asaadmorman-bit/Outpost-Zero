// Solution Architecture One-Pager for Outpost Zero
// Microsoft ISV Success Program - Seller Reference Document

export const solutionArchitectureOnePager = `
# Outpost Zero – Solution Architecture One-Pager
## For Microsoft Sellers & Partners

---

## What is Outpost Zero?

**Outpost Zero** is a unified physical and cyber security platform that consolidates 
threat detection, incident response, and compliance management into a single pane of glass. 
Purpose-built for Microsoft Azure and deeply integrated with the Microsoft security stack.

---

## Key Value Propositions

| For Customer | Benefit |
|--------------|---------|
| **Unified Security** | Single platform for physical and cyber security operations |
| **Microsoft-Native** | Deep integration with Entra ID, Defender, Sentinel, and Azure |
| **AI-Powered** | Predictive threat detection and automated response |
| **Compliance-Ready** | Built-in frameworks for SOC 2, ISO 27001, CMMC, FedRAMP |
| **Cost Reduction** | Consolidate 5-10 point solutions into one platform |

---

## Microsoft Integration Points

| Microsoft Product | Integration |
|-------------------|-------------|
| **Microsoft Entra ID** | SSO, MFA, Conditional Access, Identity Protection |
| **Microsoft Defender** | Endpoint, Cloud, Office 365, Identity signals |
| **Microsoft Sentinel** | SIEM correlation, incident sync, playbook execution |
| **Azure Monitor** | Telemetry, logging, alerting, dashboards |
| **Microsoft Graph** | User/device data, security alerts, compliance |
| **Power Platform** | Custom workflows, reporting, automation |

---

## Target Customer Profile

### Ideal Customer
- **Size**: 500-10,000 employees
- **Industries**: Healthcare, Financial Services, Manufacturing, Government
- **Characteristics**:
  - Microsoft E3/E5 customers
  - Multiple security tools causing alert fatigue
  - Compliance requirements (HIPAA, PCI, SOC 2)
  - Physical security operations (facilities, events)

### Buying Personas
| Role | Pain Point | Value Message |
|------|------------|---------------|
| **CISO** | Tool sprawl, board reporting | Unified visibility, executive dashboards |
| **SOC Manager** | Alert fatigue, staffing | Automation, efficiency gains |
| **Compliance Officer** | Audit preparation | Continuous compliance, evidence collection |
| **Facilities Director** | Siloed physical security | Integrated threat response |

---

## Competitive Differentiation

| vs. Competitor | Outpost Zero Advantage |
|----------------|------------------------|
| **Splunk** | Lower TCO, native Azure, easier deployment |
| **Palo Alto Cortex** | Microsoft-native, physical security included |
| **IBM QRadar** | Modern UX, faster time-to-value, Azure-first |
| **Point Solutions** | Unified platform, single vendor, integrated data |

---

## Technical Architecture

\`\`\`
┌────────────────────────────────────────────────────┐
│                   OUTPOST ZERO                      │
├────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Dashboard│  │ Incidents│  │ Threat Intel     │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
├────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐  │
│  │            AI/ML Engine                       │  │
│  │   • Anomaly Detection  • Risk Scoring        │  │
│  │   • Threat Prediction  • Auto-Response       │  │
│  └──────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Entra ID │  │ Defender │  │ Sentinel         │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└────────────────────────────────────────────────────┘
                        │
                   AZURE CLOUD
\`\`\`

---

## Deployment Options

| Option | Description | Timeline |
|--------|-------------|----------|
| **SaaS** | Azure Marketplace, multi-tenant | 1-2 days |
| **Dedicated** | Single-tenant Azure deployment | 1-2 weeks |
| **Hybrid** | On-prem collectors + Azure backend | 2-4 weeks |

---

## Pricing Model

| Tier | Users | Features | Price |
|------|-------|----------|-------|
| **Essentials** | Up to 500 | Core security, 5 integrations | $5/user/mo |
| **Professional** | Up to 2,500 | Full platform, AI features | $12/user/mo |
| **Enterprise** | Unlimited | Custom, dedicated, 24/7 support | Custom |

*Available on Azure Marketplace with MACC eligibility*

---

## Customer Success Metrics

| Metric | Typical Result |
|--------|----------------|
| **MTTD** (Mean Time to Detect) | 60% reduction |
| **MTTR** (Mean Time to Respond) | 75% reduction |
| **Alert Volume** | 80% reduction (noise filtering) |
| **Compliance Audit Time** | 50% reduction |
| **Tool Consolidation** | 5-10 tools → 1 platform |

---

## Quick Qualification Questions

1. How many security tools are you currently managing?
2. What's your current Microsoft licensing (E3/E5)?
3. Do you have physical security operations to integrate?
4. What compliance frameworks apply to your organization?
5. How much time does your team spend on manual alert triage?

---

## Next Steps

| Action | Owner | Resource |
|--------|-------|----------|
| **Demo Request** | Customer/Seller | demo@outpostzero.com |
| **Technical Deep-Dive** | SE Team | Architecture workshop |
| **POC Engagement** | Customer Success | 14-day trial |
| **Marketplace Purchase** | Customer | Azure Marketplace |

---

## Resources

- **Website**: https://outpostzero.com
- **Azure Marketplace**: [Outpost Zero Listing]
- **Partner Portal**: https://partners.outpostzero.com
- **Documentation**: https://docs.outpostzero.com

---

## Contact

**Cyber Dojo Solutions, LLC**
- Sales: sales@cyberdojogroup.com
- Partners: partners@cyberdojogroup.com
- Support: support@outpostzero.com

---

*© 2024 Cyber Dojo Solutions, LLC. Microsoft Partner.*
`;

export default solutionArchitectureOnePager;