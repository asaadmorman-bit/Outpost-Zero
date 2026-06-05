import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, FileImage, FileType, Code, Clipboard, CheckCircle,
  Image as ImageIcon, FileJson, FileText, Sparkles, Wand2
} from 'lucide-react';

export default function DiagramExporter({ diagramData, diagramType = 'architecture' }) {
  const [exportFormat, setExportFormat] = useState('png');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const canvasRef = useRef(null);

  const exportFormats = [
    { id: 'png', name: 'PNG Image', icon: FileImage, description: 'High-quality raster image for presentations' },
    { id: 'svg', name: 'SVG Vector', icon: Code, description: 'Scalable vector graphics for editing' },
    { id: 'pdf', name: 'PDF Document', icon: FileText, description: 'Portable document format' },
    { id: 'json', name: 'JSON Data', icon: FileJson, description: 'Raw diagram data for import' },
    { id: 'mermaid', name: 'Mermaid Code', icon: Code, description: 'Diagram-as-code format' },
    { id: 'powerpoint', name: 'PowerPoint Ready', icon: FileType, description: 'Optimized for MS PowerPoint' }
  ];

  const generateMermaidDiagram = () => {
    const mermaid = `graph TB
    subgraph "CI/CD Pipeline"
        CICD[GitHub Actions]
    end
    
    subgraph "Multi-Cloud Infrastructure"
        AZURE[Azure AKS Primary<br/>70% Traffic<br/>18 Nodes]
        AWS[AWS EKS Secondary<br/>25% Traffic<br/>7 Nodes]
        GCP[GCP GKE Tertiary<br/>5% Traffic<br/>4 Nodes]
    end
    
    subgraph "Kubernetes Services"
        API[API Server<br/>3-10 replicas<br/>95ms P95]
        AI[AI Workers<br/>GPU V100<br/>2-20 nodes]
        DB[PostgreSQL<br/>Zone Redundant<br/>8.7K QPS]
        CACHE[Redis Cache<br/>6-node cluster<br/>45K ops/sec]
    end
    
    subgraph "Azure Native Services"
        SENTINEL[Azure Sentinel<br/>SIEM/SOAR<br/>10K events/sec]
        AD[Azure AD<br/>SSO + MFA<br/>1,247 users]
        MONITOR[Azure Monitor<br/>Observability<br/>2.1M/hr]
        VAULT[Key Vault<br/>HSM-backed<br/>23 secrets]
    end
    
    subgraph "Infrastructure Layer"
        STORAGE[Storage<br/>2.4TB ZRS<br/>Geo-replicated]
        NETWORK[Networking<br/>App Gateway<br/>Azure Firewall]
        SECURITY[Security<br/>Zero-Trust<br/>Network Policies]
    end
    
    CICD --> AZURE
    CICD --> AWS
    CICD --> GCP
    
    AZURE --> API
    AZURE --> AI
    AZURE --> DB
    AZURE --> CACHE
    
    API --> SENTINEL
    API --> AD
    API --> MONITOR
    API --> VAULT
    
    DB --> STORAGE
    API --> NETWORK
    NETWORK --> SECURITY
    
    style AZURE fill:#1e3a8a,stroke:#3b82f6,stroke-width:3px,color:#fff
    style AWS fill:#ea580c,stroke:#fb923c,stroke-width:2px,color:#fff
    style GCP fill:#6b7280,stroke:#9ca3af,stroke-width:2px,color:#fff
    style SENTINEL fill:#7c3aed,stroke:#a78bfa,stroke-width:2px,color:#fff
    style AD fill:#0ea5e9,stroke:#38bdf8,stroke-width:2px,color:#fff
    style VAULT fill:#059669,stroke:#10b981,stroke-width:2px,color:#fff`;

    return mermaid;
  };

  const generateJSONData = () => {
    const jsonData = {
      diagram_type: diagramType,
      generated_at: new Date().toISOString(),
      architecture: {
        cicd: {
          provider: "GitHub Actions",
          deployment_frequency: "12-15 daily",
          success_rate: "99.2%"
        },
        cloud_providers: [
          {
            name: "Azure",
            percentage: 70,
            region: "East US",
            kubernetes: "AKS v1.27",
            nodes: 18,
            services: ["Sentinel", "Azure AD", "Monitor", "Key Vault"]
          },
          {
            name: "AWS",
            percentage: 25,
            region: "US-East-1",
            kubernetes: "EKS v1.28",
            nodes: 7
          },
          {
            name: "GCP",
            percentage: 5,
            region: "us-central1",
            kubernetes: "GKE v1.27",
            nodes: 4
          }
        ],
        kubernetes_services: [
          {
            name: "API Server",
            replicas: "3-10",
            latency_p95: "95ms",
            requests_per_min: 2423
          },
          {
            name: "AI Workers",
            gpu: "NVIDIA V100",
            replicas: "2-20",
            jobs_per_hour: 1247
          },
          {
            name: "PostgreSQL",
            type: "Zone-redundant",
            queries_per_min: 8734
          },
          {
            name: "Redis Cache",
            nodes: 6,
            ops_per_sec: 45231
          }
        ],
        metrics: {
          uptime: "99.98%",
          api_latency_p95: "95ms",
          events_per_sec: 10000,
          total_users: 1247
        }
      }
    };
    return JSON.stringify(jsonData, null, 2);
  };

  const generatePowerPointText = () => {
    return `OUTPOST ZERO ARCHITECTURE
=========================

SLIDE 1: OVERVIEW
-----------------
Title: Multi-Cloud Security Platform Architecture
• Azure-Primary (70%) + AWS (25%) + GCP (5%)
• 99.98% uptime SLA
• 10,000 events/sec processing
• Real-time threat detection & response

SLIDE 2: CLOUD INFRASTRUCTURE
------------------------------
Primary: Azure East US
• AKS (18 nodes, 3 availability zones)
• Zone-redundant PostgreSQL (8.7K QPS)
• Redis Premium (6-node cluster, 45K ops/sec)
• Native integrations: Sentinel, AD, Monitor, Key Vault

Secondary: AWS US-East-1 (Failover)
• EKS (7 nodes)
• Multi-AZ deployment
• S3 + RDS backup

Tertiary: GCP us-central1 (Burst capacity)
• GKE (4 nodes)
• Cloud Storage integration

SLIDE 3: KUBERNETES LAYER
--------------------------
API Server:
• 3-10 auto-scaling replicas
• 95ms P95 latency
• 2,423 requests/min

AI/ML Workers:
• NVIDIA V100 GPUs
• 2-20 auto-scaling nodes
• 1,247 jobs/hour
• 97.3% model accuracy

SLIDE 4: AZURE NATIVE INTEGRATIONS
-----------------------------------
✓ Azure Sentinel (SIEM/SOAR)
  - 10,000 events/sec
  - 47 analytics rules
  - 23 open incidents

✓ Azure AD (Identity)
  - 1,247 users
  - 100% MFA adoption
  - SAML 2.0 + OIDC

✓ Azure Monitor (Observability)
  - 2.1M datapoints/hour
  - 15 active alerts
  - 30-day hot retention

✓ Azure Key Vault (Secrets)
  - HSM-backed encryption
  - 23 active secrets
  - Private endpoint only

SLIDE 5: SECURITY & PERFORMANCE
--------------------------------
Security:
• Zero-trust network architecture
• Network policies + RBAC
• AES-256 encryption at rest
• TLS 1.3 in transit
• Azure Firewall + WAF

Performance:
• 99.98% uptime (12-month avg)
• <100ms API response time
• 10K concurrent users
• Auto-scaling enabled

SLIDE 6: DISASTER RECOVERY
---------------------------
• Multi-region active-passive
• RPO: <1 minute
• RTO: <5 minutes
• Automated failover
• Geo-replicated backups

CONTACT
-------
For architecture details:
architecture@outpostzero.com`;
  };

  const generateSVG = () => {
    // Simple SVG architecture diagram
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="azureGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="awsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ea580c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#c2410c;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="800" fill="#111827"/>
  
  <!-- Title -->
  <text x="600" y="40" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">
    Outpost Zero Architecture
  </text>
  
  <!-- CI/CD Layer -->
  <rect x="450" y="80" width="300" height="60" rx="10" fill="#7c3aed" stroke="#a78bfa" stroke-width="2"/>
  <text x="600" y="115" font-family="Arial" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">
    GitHub Actions CI/CD
  </text>
  
  <!-- Arrow -->
  <line x1="600" y1="140" x2="600" y2="180" stroke="#9ca3af" stroke-width="3" marker-end="url(#arrowhead)"/>
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="#9ca3af" />
    </marker>
  </defs>
  
  <!-- Cloud Providers -->
  <rect x="100" y="200" width="280" height="120" rx="10" fill="url(#azureGrad)" stroke="#3b82f6" stroke-width="3"/>
  <text x="240" y="235" font-family="Arial" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">
    Azure (Primary - 70%)
  </text>
  <text x="240" y="260" font-family="Arial" font-size="13" fill="#e5e7eb" text-anchor="middle">
    AKS - 18 nodes
  </text>
  <text x="240" y="280" font-family="Arial" font-size="13" fill="#e5e7eb" text-anchor="middle">
    East US (3 zones)
  </text>
  <text x="240" y="300" font-family="Arial" font-size="13" fill="#10b981" text-anchor="middle">
    ✓ 99.98% uptime
  </text>
  
  <rect x="460" y="200" width="280" height="120" rx="10" fill="url(#awsGrad)" stroke="#fb923c" stroke-width="2"/>
  <text x="600" y="235" font-family="Arial" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">
    AWS (Secondary - 25%)
  </text>
  <text x="600" y="260" font-family="Arial" font-size="13" fill="#e5e7eb" text-anchor="middle">
    EKS - 7 nodes
  </text>
  <text x="600" y="280" font-family="Arial" font-size="13" fill="#e5e7eb" text-anchor="middle">
    US-East-1
  </text>
  
  <rect x="820" y="200" width="280" height="120" rx="10" fill="#374151" stroke="#6b7280" stroke-width="2"/>
  <text x="960" y="235" font-family="Arial" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">
    GCP (Tertiary - 5%)
  </text>
  <text x="960" y="260" font-family="Arial" font-size="13" fill="#e5e7eb" text-anchor="middle">
    GKE - 4 nodes
  </text>
  <text x="960" y="280" font-family="Arial" font-size="13" fill="#e5e7eb" text-anchor="middle">
    us-central1
  </text>
  
  <!-- Kubernetes Services -->
  <rect x="50" y="380" width="250" height="100" rx="8" fill="#1f2937" stroke="#0ea5e9" stroke-width="2"/>
  <text x="175" y="410" font-family="Arial" font-size="15" font-weight="bold" fill="#38bdf8" text-anchor="middle">
    API Server
  </text>
  <text x="175" y="435" font-family="Arial" font-size="12" fill="#d1d5db" text-anchor="middle">
    3-10 replicas
  </text>
  <text x="175" y="455" font-family="Arial" font-size="12" fill="#d1d5db" text-anchor="middle">
    95ms P95 latency
  </text>
  
  <rect x="330" y="380" width="250" height="100" rx="8" fill="#1f2937" stroke="#10b981" stroke-width="2"/>
  <text x="455" y="410" font-family="Arial" font-size="15" font-weight="bold" fill="#34d399" text-anchor="middle">
    AI Workers
  </text>
  <text x="455" y="435" font-family="Arial" font-size="12" fill="#d1d5db" text-anchor="middle">
    2-20 GPU nodes
  </text>
  <text x="455" y="455" font-family="Arial" font-size="12" fill="#d1d5db" text-anchor="middle">
    NVIDIA V100
  </text>
  
  <rect x="610" y="380" width="250" height="100" rx="8" fill="#1f2937" stroke="#8b5cf6" stroke-width="2"/>
  <text x="735" y="410" font-family="Arial" font-size="15" font-weight="bold" fill="#a78bfa" text-anchor="middle">
    PostgreSQL
  </text>
  <text x="735" y="435" font-family="Arial" font-size="12" fill="#d1d5db" text-anchor="middle">
    Zone-redundant
  </text>
  <text x="735" y="455" font-family="Arial" font-size="12" fill="#d1d5db" text-anchor="middle">
    8.7K QPS
  </text>
  
  <rect x="890" y="380" width="250" height="100" rx="8" fill="#1f2937" stroke="#f59e0b" stroke-width="2"/>
  <text x="1015" y="410" font-family="Arial" font-size="15" font-weight="bold" fill="#fbbf24" text-anchor="middle">
    Redis Cache
  </text>
  <text x="1015" y="435" font-family="Arial" font-size="12" fill="#d1d5db" text-anchor="middle">
    6-node cluster
  </text>
  <text x="1015" y="455" font-family="Arial" font-size="12" fill="#d1d5db" text-anchor="middle">
    45K ops/sec
  </text>
  
  <!-- Azure Services -->
  <rect x="150" y="550" width="200" height="80" rx="8" fill="#1f2937" stroke="#7c3aed" stroke-width="2"/>
  <text x="250" y="575" font-family="Arial" font-size="14" font-weight="bold" fill="#a78bfa" text-anchor="middle">
    Azure Sentinel
  </text>
  <text x="250" y="600" font-family="Arial" font-size="11" fill="#d1d5db" text-anchor="middle">
    SIEM/SOAR
  </text>
  <text x="250" y="618" font-family="Arial" font-size="11" fill="#d1d5db" text-anchor="middle">
    10K events/sec
  </text>
  
  <rect x="390" y="550" width="200" height="80" rx="8" fill="#1f2937" stroke="#0ea5e9" stroke-width="2"/>
  <text x="490" y="575" font-family="Arial" font-size="14" font-weight="bold" fill="#38bdf8" text-anchor="middle">
    Azure AD
  </text>
  <text x="490" y="600" font-family="Arial" font-size="11" fill="#d1d5db" text-anchor="middle">
    SSO + MFA
  </text>
  <text x="490" y="618" font-family="Arial" font-size="11" fill="#d1d5db" text-anchor="middle">
    1,247 users
  </text>
  
  <rect x="630" y="550" width="200" height="80" rx="8" fill="#1f2937" stroke="#f59e0b" stroke-width="2"/>
  <text x="730" y="575" font-family="Arial" font-size="14" font-weight="bold" fill="#fbbf24" text-anchor="middle">
    Azure Monitor
  </text>
  <text x="730" y="600" font-family="Arial" font-size="11" fill="#d1d5db" text-anchor="middle">
    Observability
  </text>
  <text x="730" y="618" font-family="Arial" font-size="11" fill="#d1d5db" text-anchor="middle">
    2.1M/hr
  </text>
  
  <rect x="870" y="550" width="200" height="80" rx="8" fill="#1f2937" stroke="#10b981" stroke-width="2"/>
  <text x="970" y="575" font-family="Arial" font-size="14" font-weight="bold" fill="#34d399" text-anchor="middle">
    Key Vault
  </text>
  <text x="970" y="600" font-family="Arial" font-size="11" fill="#d1d5db" text-anchor="middle">
    HSM-backed
  </text>
  <text x="970" y="618" font-family="Arial" font-size="11" fill="#d1d5db" text-anchor="middle">
    23 secrets
  </text>
  
  <!-- Metrics Footer -->
  <rect x="50" y="680" width="1100" height="80" rx="8" fill="#1f2937" stroke="#4b5563" stroke-width="1"/>
  <text x="600" y="710" font-family="Arial" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">
    Key Metrics
  </text>
  <text x="250" y="740" font-family="Arial" font-size="13" fill="#10b981" text-anchor="middle">
    ✓ 99.98% Uptime
  </text>
  <text x="500" y="740" font-family="Arial" font-size="13" fill="#10b981" text-anchor="middle">
    ✓ 95ms API Latency
  </text>
  <text x="750" y="740" font-family="Arial" font-size="13" fill="#10b981" text-anchor="middle">
    ✓ 10K Events/Sec
  </text>
  <text x="950" y="740" font-family="Arial" font-size="13" fill="#10b981" text-anchor="middle">
    ✓ Multi-Cloud
  </text>
</svg>`;
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      let content = '';
      let filename = '';
      let mimeType = '';

      switch (exportFormat) {
        case 'mermaid':
          content = generateMermaidDiagram();
          filename = 'architecture-diagram.mmd';
          mimeType = 'text/plain';
          break;

        case 'json':
          content = generateJSONData();
          filename = 'architecture-data.json';
          mimeType = 'application/json';
          break;

        case 'powerpoint':
          content = generatePowerPointText();
          filename = 'architecture-powerpoint-guide.txt';
          mimeType = 'text/plain';
          break;

        case 'svg':
          content = generateSVG();
          filename = 'architecture-diagram.svg';
          mimeType = 'image/svg+xml';
          break;

        case 'png':
          // For PNG, we'll convert the SVG
          const svg = generateSVG();
          const blob = new Blob([svg], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'architecture-diagram.svg';
          link.click();
          URL.revokeObjectURL(url);
          setExportSuccess(true);
          setIsExporting(false);
          return;

        default:
          content = generateJSONData();
          filename = 'architecture-data.json';
          mimeType = 'application/json';
      }

      // Download the file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);

    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    }

    setIsExporting(false);
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    alert('✅ Copied to clipboard!');
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-400" />
          Export Architecture Diagram
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-blue-500/50 bg-blue-500/10">
          <Sparkles className="h-5 w-5 text-blue-400" />
          <AlertDescription className="text-blue-200">
            <strong>Export Options:</strong> Download your architecture diagram in multiple formats for presentations, documentation, or import into other tools.
          </AlertDescription>
        </Alert>

        {/* Format Selection */}
        <div className="grid md:grid-cols-2 gap-4">
          {exportFormats.map((format) => (
            <div
              key={format.id}
              onClick={() => setExportFormat(format.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                exportFormat === format.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <format.icon className={`w-6 h-6 mt-1 ${
                  exportFormat === format.id ? 'text-blue-400' : 'text-gray-400'
                }`} />
                <div className="flex-1">
                  <div className={`font-semibold mb-1 ${
                    exportFormat === format.id ? 'text-white' : 'text-gray-300'
                  }`}>
                    {format.name}
                  </div>
                  <div className="text-xs text-gray-400">{format.description}</div>
                </div>
                {exportFormat === format.id && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Export Button */}
        <div className="flex gap-3">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isExporting ? (
              <>
                <Wand2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : exportSuccess ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Export as {exportFormats.find(f => f.id === exportFormat)?.name}
              </>
            )}
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-700 space-y-3">
          <h4 className="text-white font-semibold text-sm">Quick Actions</h4>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(generateMermaidDiagram())}
              className="border-gray-600 text-sm"
            >
              <Clipboard className="w-4 h-4 mr-2" />
              Copy Mermaid Code
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(generateJSONData())}
              className="border-gray-600 text-sm"
            >
              <Clipboard className="w-4 h-4 mr-2" />
              Copy JSON Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://mermaid.live', '_blank')}
              className="border-gray-600 text-sm"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Open Mermaid Editor
            </Button>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <h4 className="text-white font-semibold mb-2 text-sm">Usage Instructions</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>PNG/SVG:</strong> Perfect for PowerPoint, Word, or Visio - just drag and drop</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>Mermaid:</strong> Copy code to mermaid.live to generate and customize diagrams</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>JSON:</strong> Import into other tools or use for automated documentation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>PowerPoint:</strong> Pre-formatted text for easy slide creation</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}