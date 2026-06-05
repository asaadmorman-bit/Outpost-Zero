
import React, { useState, useEffect } from 'react';
import { CustomQueryLanguage } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Play,
    Save,
    Code,
    BookOpen,
    Lightbulb,
    Copy,
    Download,
    Share2,
    Clock,
    TrendingUp,
    Search,
    AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

// Mock query execution engine
const executeOZQL = async (query) => {
    // Simulate query execution
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Parse query and return mock results
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('event_type')) {
        return {
            columns: ['timestamp', 'event_type', 'severity', 'source_ip', 'description'],
            rows: [
                ['2024-01-15 10:23:45', 'malware_detected', 'critical', '192.168.1.50', 'Ransomware detected on endpoint'],
                ['2024-01-15 10:22:10', 'privilege_escalation', 'high', '10.0.0.15', 'Unauthorized privilege elevation attempt'],
                ['2024-01-15 10:20:33', 'data_exfiltration', 'critical', '203.0.113.55', 'Large data transfer to external IP']
            ],
            execution_time_ms: 1247,
            rows_returned: 3
        };
    }
    
    if (lowerQuery.includes('count')) {
        return {
            columns: ['event_type', 'count'],
            rows: [
                ['malware_detected', 47],
                ['privilege_escalation', 23],
                ['data_exfiltration', 12],
                ['login_attempt', 1543]
            ],
            execution_time_ms: 892,
            rows_returned: 4
        };
    }
    
    return {
        columns: ['result'],
        rows: [['Query executed successfully']],
        execution_time_ms: 450,
        rows_returned: 1
    };
};

const QueryTemplates = ({ onSelectTemplate }) => {
    const templates = [
        // Threat Hunting
        {
            name: 'Failed Login Attempts',
            category: 'threat_hunting',
            description: 'Find failed login attempts in the last 24 hours',
            query: `FROM SecurityEvent
WHERE event_type = "login_attempt"
  AND status = "failed"
  AND timestamp > NOW() - 24h
ORDER BY timestamp DESC
LIMIT 100`
        },
        {
            name: 'Anomalous User Behavior',
            category: 'threat_hunting',
            description: 'Users with anomaly scores above 80',
            query: `FROM UserBehavior
WHERE anomaly_score > 80
  AND normal_pattern = false
ORDER BY anomaly_score DESC
LIMIT 50`
        },
        {
            name: 'Data Exfiltration Detection',
            category: 'threat_hunting',
            description: 'Detect potential data exfiltration events',
            query: `FROM SecurityEvent
WHERE event_type = "data_exfiltration"
  AND ml_risk_score > 75
  AND timestamp > NOW() - 7d
GROUP BY source_ip, destination_ip
ORDER BY ml_risk_score DESC`
        },
        {
            name: 'Privilege Escalation Attempts',
            category: 'threat_hunting',
            description: 'Hunt for unauthorized privilege escalation',
            query: `FROM SecurityEvent
WHERE event_type = "privilege_escalation"
  AND status = "blocked"
  AND timestamp > NOW() - 48h
ORDER BY ml_risk_score DESC
LIMIT 100`
        },
        {
            name: 'Lateral Movement Detection',
            category: 'threat_hunting',
            description: 'Identify suspicious lateral movement across network',
            query: `FROM SecurityEvent
WHERE event_type = "lateral_movement"
  AND severity IN ("high", "critical")
  AND timestamp > NOW() - 7d
GROUP BY source_ip
COUNT(*) AS movement_count
ORDER BY movement_count DESC`
        },
        {
            name: 'Command & Control Communication',
            category: 'threat_hunting',
            description: 'Detect C2 beacon traffic patterns',
            query: `FROM ThreatIntelligence
WHERE threat_type = "c2"
  AND confidence > 85
  AND last_seen > NOW() - 24h
ORDER BY confidence DESC`
        },
        
        // Monitoring
        {
            name: 'High Severity Incidents',
            category: 'monitoring',
            description: 'Monitor critical and high severity incidents',
            query: `FROM Incident
WHERE severity IN ("critical", "high")
  AND status != "resolved"
ORDER BY created_date DESC`
        },
        {
            name: 'Real-Time Threat Dashboard',
            category: 'monitoring',
            description: 'Live view of active threats across environment',
            query: `FROM SecurityEvent
WHERE severity IN ("critical", "high")
  AND status = "open"
  AND timestamp > NOW() - 1h
ORDER BY ml_risk_score DESC
LIMIT 50`
        },
        {
            name: 'Endpoint Security Status',
            category: 'monitoring',
            description: 'Monitor endpoint health and security posture',
            query: `FROM EndpointData
WHERE status = "online"
  AND last_seen > NOW() - 5m
GROUP BY os_type
COUNT(*) AS endpoint_count`
        },
        {
            name: 'Active Malware Detections',
            category: 'monitoring',
            description: 'Track active malware across all endpoints',
            query: `FROM SecurityEvent
WHERE event_type = "malware_detected"
  AND status != "remediated"
  AND timestamp > NOW() - 24h
GROUP BY source_ip, event_type
ORDER BY timestamp DESC`
        },
        
        // Compliance
        {
            name: 'Compliance Violations',
            category: 'compliance',
            description: 'Non-compliant controls by framework',
            query: `FROM ComplianceControl
WHERE status = "non-compliant"
GROUP BY framework
COUNT(*) AS violations
ORDER BY violations DESC`
        },
        {
            name: 'NIST 800-53 Coverage',
            category: 'compliance',
            description: 'Review NIST compliance status',
            query: `FROM ComplianceControl
WHERE framework = "NIST_800-53"
GROUP BY status
COUNT(*) AS control_count`
        },
        {
            name: 'Failed Compliance Audits',
            category: 'compliance',
            description: 'Controls that failed recent assessments',
            query: `FROM ComplianceControl
WHERE status IN ("non-compliant", "partially-compliant")
  AND last_assessed > NOW() - 30d
ORDER BY last_assessed DESC`
        },
        {
            name: 'CMMC Level 2 Readiness',
            category: 'compliance',
            description: 'Assess CMMC Level 2 compliance gaps',
            query: `FROM ComplianceControl
WHERE framework = "CMMC"
  AND status != "compliant"
ORDER BY control_id`
        },
        
        // Investigation
        {
            name: 'Incident Timeline Analysis',
            category: 'investigation',
            description: 'Build timeline of events for active incident',
            query: `FROM SecurityEvent
WHERE timestamp > NOW() - 7d
  AND source_ip = "192.168.1.50"
ORDER BY timestamp ASC`
        },
        {
            name: 'User Activity Investigation',
            category: 'investigation',
            description: 'Deep dive into specific user behavior',
            query: `FROM UserBehavior
WHERE user_id = "john.doe@company.com"
  AND timestamp > NOW() - 30d
ORDER BY anomaly_score DESC`
        },
        {
            name: 'Network Connection Forensics',
            category: 'investigation',
            description: 'Analyze network connections from suspicious IP',
            query: `FROM SecurityEvent
WHERE source_ip = "203.0.113.55"
  OR destination_ip = "203.0.113.55"
  AND timestamp > NOW() - 14d
ORDER BY timestamp DESC`
        },
        {
            name: 'Compromised Account Analysis',
            category: 'investigation',
            description: 'Investigate potentially compromised user account',
            query: `FROM SecurityEvent
WHERE user_id CONTAINS "suspicious_user"
  AND event_type IN ("login_attempt", "privilege_escalation", "data_access")
  AND timestamp > NOW() - 7d
ORDER BY timestamp DESC`
        },
        
        // Reporting
        {
            name: 'Threat Intelligence Summary',
            category: 'reporting',
            description: 'Summary of threat intelligence by type',
            query: `FROM ThreatIntelligence
WHERE confidence > 70
  AND last_seen > NOW() - 30d
GROUP BY threat_type
COUNT(*) AS count
ORDER BY count DESC`
        },
        {
            name: 'Monthly Security Metrics',
            category: 'reporting',
            description: 'Generate monthly security performance report',
            query: `FROM SecurityEvent
WHERE timestamp > NOW() - 30d
GROUP BY severity
COUNT(*) AS event_count
ORDER BY severity DESC`
        },
        {
            name: 'Executive Security Briefing',
            category: 'reporting',
            description: 'High-level security posture for executives',
            query: `FROM Incident
WHERE created_date > NOW() - 7d
GROUP BY severity, status
COUNT(*) AS incident_count`
        },
        {
            name: 'Vulnerability Remediation Report',
            category: 'reporting',
            description: 'Track vulnerability remediation progress',
            query: `FROM Misconfiguration
WHERE status IN ("open", "remediating")
GROUP BY severity
COUNT(*) AS vuln_count
ORDER BY severity DESC`
        },
        {
            name: 'SOC Team Performance',
            category: 'reporting',
            description: 'Analyze SOC team response times and effectiveness',
            query: `FROM Incident
WHERE status = "resolved"
  AND created_date > NOW() - 30d
GROUP BY assigned_to
AVG(resolution_time) AS avg_resolution_hours`
        },
        {
            name: 'Top Attack Vectors',
            category: 'reporting',
            description: 'Identify most common attack methods',
            query: `FROM SecurityEvent
WHERE timestamp > NOW() - 90d
GROUP BY event_type
COUNT(*) AS attack_count
ORDER BY attack_count DESC
LIMIT 10`
        }
    ];

    const categories = [
        { value: 'all', label: 'All Templates', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
        { value: 'threat_hunting', label: 'Threat Hunting', color: 'bg-gradient-to-r from-red-500 to-orange-500' },
        { value: 'monitoring', label: 'Monitoring', color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
        { value: 'compliance', label: 'Compliance', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
        { value: 'investigation', label: 'Investigation', color: 'bg-gradient-to-r from-yellow-500 to-amber-500' },
        { value: 'reporting', label: 'Reporting', color: 'bg-gradient-to-r from-indigo-500 to-blue-500' }
    ];

    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredTemplates = selectedCategory === 'all' 
        ? templates 
        : templates.filter(t => t.category === selectedCategory);

    const getCategoryColor = (category) => {
        const cat = categories.find(c => c.value === category);
        return cat ? cat.color : 'bg-gray-600';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
                {categories.map(cat => (
                    <Button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`${
                            selectedCategory === cat.value 
                                ? `${cat.color} text-white shadow-lg scale-105` 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        } transition-all duration-200 font-semibold`}
                    >
                        {cat.label} ({templates.filter(t => cat.value === 'all' || t.category === cat.value).length})
                    </Button>
                ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template, idx) => (
                    <Card 
                        key={idx} 
                        className="bg-gray-800/50 border-gray-700 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all cursor-pointer group" 
                        onClick={() => onSelectTemplate(template.query)}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-white text-base group-hover:text-cyan-300 transition-colors">
                                    {template.name}
                                </CardTitle>
                                <Badge 
                                    className={`${getCategoryColor(template.category)} text-white text-xs flex-shrink-0 shadow-md`}
                                >
                                    {template.category.replace('_', ' ')}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                            <pre className="bg-gray-900/50 p-2 rounded text-xs text-cyan-300 overflow-x-auto border border-gray-700 group-hover:border-cyan-500/30 transition-colors">
                                {template.query.split('\n')[0]}...
                            </pre>
                            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                                <span>Click to use</span>
                                <Code className="w-3 h-3" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const QueryDocumentation = () => {
    return (
        <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    OZQL Language Reference
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="text-white font-semibold mb-2">Basic Syntax</h4>
                    <pre className="bg-gray-900 p-4 rounded-lg text-cyan-300 text-sm overflow-x-auto">
{`FROM <entity_name>
WHERE <conditions>
GROUP BY <fields>
ORDER BY <fields> [ASC|DESC]
LIMIT <number>`}
                    </pre>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-2">Available Entities</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {['SecurityEvent', 'Incident', 'ThreatIntelligence', 'UserBehavior', 'ComplianceControl', 'Misconfiguration', 'EndpointData', 'CloudAsset'].map(entity => (
                            <Badge key={entity} variant="outline" className="border-gray-600 text-gray-300">
                                {entity}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-2">Operators</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-cyan-400 font-mono">=, !=, &gt;, &lt;, &gt;=, &lt;=</p>
                            <p className="text-gray-400 text-xs">Comparison operators</p>
                        </div>
                        <div>
                            <p className="text-cyan-400 font-mono">IN, NOT IN</p>
                            <p className="text-gray-400 text-xs">List membership</p>
                        </div>
                        <div>
                            <p className="text-cyan-400 font-mono">AND, OR, NOT</p>
                            <p className="text-gray-400 text-xs">Logical operators</p>
                        </div>
                        <div>
                            <p className="text-cyan-400 font-mono">LIKE, CONTAINS</p>
                            <p className="text-gray-400 text-xs">Pattern matching</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-2">Time Functions</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                            <code className="text-cyan-400">NOW()</code>
                            <span className="text-gray-400">- Current timestamp</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <code className="text-cyan-400">NOW() - 24h</code>
                            <span className="text-gray-400">- 24 hours ago (supports: m, h, d, w)</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-2">Aggregation Functions</h4>
                    <div className="space-y-2 text-sm">
                        <div><code className="text-cyan-400">COUNT(*)</code> <span className="text-gray-400">- Count rows</span></div>
                        <div><code className="text-cyan-400">AVG(field)</code> <span className="text-gray-400">- Average value</span></div>
                        <div><code className="text-cyan-400">SUM(field)</code> <span className="text-gray-400">- Sum values</span></div>
                        <div><code className="text-cyan-400">MIN(field), MAX(field)</code> <span className="text-gray-400">- Min/Max values</span></div>
                    </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-blue-300 font-semibold mb-1">Pro Tip</h4>
                            <p className="text-sm text-blue-200">
                                Use AI-assisted query building by clicking the "AI Suggest" button. 
                                Describe what you want to find in plain English, and our AI will generate the OZQL query for you.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function QueryStudio() {
    const [query, setQuery] = useState('');
    const [queryResults, setQueryResults] = useState(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [savedQueries, setSavedQueries] = useState([]);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [queryName, setQueryName] = useState('');
    const [queryDescription, setQueryDescription] = useState('');

    useEffect(() => {
        loadSavedQueries();
    }, []);

    const loadSavedQueries = async () => {
        try {
            const queries = await CustomQueryLanguage.list('-created_date');
            setSavedQueries(queries);
        } catch (error) {
            console.error('Error loading queries:', error);
        }
    };

    const handleExecuteQuery = async () => {
        if (!query.trim()) {
            toast.error('Please enter a query');
            return;
        }

        setIsExecuting(true);
        setQueryResults(null);

        try {
            const results = await executeOZQL(query);
            setQueryResults(results);
            toast.success(`Query executed in ${results.execution_time_ms}ms`);
        } catch (error) {
            toast.error('Query execution failed: ' + error.message);
        } finally {
            setIsExecuting(false);
        }
    };

    const handleSaveQuery = async () => {
        if (!queryName.trim()) {
            toast.error('Please enter a query name');
            return;
        }

        try {
            await CustomQueryLanguage.create({
                query_id: `q_${Date.now()}`,
                name: queryName,
                description: queryDescription,
                query_text: query,
                complexity_level: 'intermediate',
                category: 'threat_hunting',
                created_by: 'current_user@example.com'
            });

            toast.success('Query saved successfully');
            setShowSaveDialog(false);
            setQueryName('');
            setQueryDescription('');
            loadSavedQueries();
        } catch (error) {
            toast.error('Failed to save query');
        }
    };

    const handleSelectTemplate = (templateQuery) => {
        setQuery(templateQuery);
        toast.success('Template loaded');
    };

    const handleCopyQuery = () => {
        navigator.clipboard.writeText(query);
        toast.success('Query copied to clipboard');
    };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-cyan-500/10 rounded-lg">
                        <Code className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">OZQL Query Studio</h1>
                        <p className="text-gray-300">Outpost Zero Query Language - Proprietary security data analysis</p>
                    </div>
                </div>

                <Tabs defaultValue="editor" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="editor">Query Editor</TabsTrigger>
                        <TabsTrigger value="templates">Templates</TabsTrigger>
                        <TabsTrigger value="documentation">Documentation</TabsTrigger>
                    </TabsList>

                    <TabsContent value="editor" className="space-y-6">
                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white">Query Editor</CardTitle>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCopyQuery}
                                            className="border-gray-600"
                                            disabled={!query}
                                        >
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowSaveDialog(true)}
                                            className="border-gray-600"
                                            disabled={!query}
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <textarea
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Enter your OZQL query here...

Example:
FROM SecurityEvent
WHERE severity = 'critical'
  AND timestamp > NOW() - 24h
ORDER BY timestamp DESC
LIMIT 100"
                                    className="w-full h-64 bg-gray-900 text-cyan-300 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
                                />

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Lightbulb className="w-4 h-4" />
                                        <span>Press Ctrl+Enter to execute query</span>
                                    </div>
                                    <Button
                                        onClick={handleExecuteQuery}
                                        disabled={isExecuting || !query}
                                        className="bg-cyan-600 hover:bg-cyan-700"
                                    >
                                        {isExecuting ? (
                                            <>
                                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                                Executing...
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-4 h-4 mr-2" />
                                                Execute Query
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {queryResults && (
                            <Card className="bg-gray-800/50 border-gray-700">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-white">Query Results</CardTitle>
                                        <div className="flex items-center gap-4 text-sm">
                                            <Badge variant="outline" className="border-green-500/50 text-green-300">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {queryResults.execution_time_ms}ms
                                            </Badge>
                                            <Badge variant="outline" className="border-blue-500/50 text-blue-300">
                                                {queryResults.rows_returned} rows
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-900">
                                                <tr>
                                                    {queryResults.columns.map((col, idx) => (
                                                        <th key={idx} className="text-left p-3 text-cyan-400 font-semibold">
                                                            {col}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {queryResults.rows.map((row, rowIdx) => (
                                                    <tr key={rowIdx} className="border-t border-gray-700 hover:bg-gray-700/30">
                                                        {row.map((cell, cellIdx) => (
                                                            <td key={cellIdx} className="p-3 text-gray-300">
                                                                {cell}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {savedQueries.length > 0 && (
                            <Card className="bg-gray-800/50 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white">My Saved Queries</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {savedQueries.slice(0, 5).map(savedQuery => (
                                            <div
                                                key={savedQuery.query_id}
                                                className="p-3 bg-gray-900/50 rounded-lg hover:bg-gray-700/30 cursor-pointer transition-all"
                                                onClick={() => setQuery(savedQuery.query_text)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-white font-medium">{savedQuery.name}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{savedQuery.description}</p>
                                                    </div>
                                                    <Badge variant="outline" className="text-xs">{savedQuery.category}</Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="templates">
                        <QueryTemplates onSelectTemplate={handleSelectTemplate} />
                    </TabsContent>

                    <TabsContent value="documentation">
                        <QueryDocumentation />
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogContent className="bg-gray-900 border-gray-700">
                    <DialogHeader>
                        <DialogTitle className="text-white">Save Query</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-300 mb-2 block">Query Name</label>
                            <Input
                                value={queryName}
                                onChange={(e) => setQueryName(e.target.value)}
                                placeholder="e.g., High Risk User Behavior"
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-300 mb-2 block">Description (Optional)</label>
                            <Input
                                value={queryDescription}
                                onChange={(e) => setQueryDescription(e.target.value)}
                                placeholder="What does this query do?"
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowSaveDialog(false)} className="border-gray-600">
                                Cancel
                            </Button>
                            <Button onClick={handleSaveQuery} className="bg-cyan-600 hover:bg-cyan-700">
                                <Save className="w-4 h-4 mr-2" />
                                Save Query
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
