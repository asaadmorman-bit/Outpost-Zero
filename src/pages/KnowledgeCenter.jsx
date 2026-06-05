
import React, { useState, useEffect, useCallback } from 'react';
import { PlatformGuide, Glossary } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    BookOpen,
    Search,
    Video,
    Users,
    Lightbulb,
    Shield,
    Zap,
    PlayCircle,
    ThumbsUp,
    ThumbsDown,
    Clock,
    Star,
    X,
    CheckCircle,
    AlertTriangle,
    TrendingUp,
    Code,
    FileText,
    BarChart3,
    Bell
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function KnowledgeCenter() {
    const [guides, setGuides] = useState([]);
    const [glossary, setGlossary] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedAudience, setSelectedAudience] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [selectedTerm, setSelectedTerm] = useState(null);

    const getMockGuides = useCallback(() => [
        {
            guide_id: 'g001',
            title: 'Getting Started with Outpost Zero',
            category: 'getting_started',
            audience: ['end_user', 'security_analyst'],
            difficulty_level: 'beginner',
            estimated_time_minutes: 15,
            plain_english_summary: 'Learn the basics of Outpost Zero and how to navigate the platform to protect your organization.',
            content: `# Getting Started with Outpost Zero

## Welcome to the Future of Cybersecurity

Outpost Zero is an AI-powered security operations platform that protects your organization from emerging threats.

## Step 1: Understanding the Dashboard

When you first log in, you'll see the main Security Operations Center (SOC) dashboard. Here's what each section means:

- **Threat Level Indicator**: Shows your current security posture (Green/Yellow/Orange/Red)
- **Recent Events**: Latest security events detected across your environment
- **Incident Summary**: Active security incidents requiring attention
- **AI Advisories**: Intelligent recommendations from our AI engine

## Step 2: Responding to Your First Alert

When you see a security alert:

1. Click on the incident to view details
2. Review the AI-generated analysis and recommendations
3. Execute automated response playbooks with one click
4. Document your actions for compliance

## Step 3: Getting Help

- Use the **Knowledge Center** (you're here!) for guides and definitions
- Click the **AI Assistant** button (bottom right) for instant help
- Visit the **Training** section for hands-on exercises
- Contact support via Settings → Support

## Next Steps

- **Connect Data Sources**: Integrate your security tools
- **Invite Team Members**: Collaborate with your security team
- **Review Compliance**: Check your compliance status
- **Create Custom Playbooks**: Automate your incident response`,
            key_takeaways: [
                'Understand the main dashboard and what each metric means',
                'Learn how to respond to your first security alert',
                'Know where to find help when you need it'
            ],
            tags: ['basics', 'navigation', 'dashboard'],
            popularity_score: 95,
            helpful_votes: 847,
            not_helpful_votes: 23
        },
        {
            guide_id: 'g002',
            title: 'Understanding Threat Levels: What They Mean for Your Business',
            category: 'concept',
            audience: ['executive', 'investor', 'end_user'],
            difficulty_level: 'beginner',
            estimated_time_minutes: 10,
            plain_english_summary: 'A simple explanation of how we calculate threat levels and what you should do at each level.',
            content: `# Understanding Threat Levels

## What is a Threat Level?

The Threat Level is a simple, color-coded indicator showing how dangerous the current security situation is for your organization.

## How We Calculate It

Outpost Zero's AI analyzes thousands of factors:
- Active attacks targeting your industry
- Vulnerabilities in your systems
- Suspicious activities detected
- Global threat intelligence
- Historical attack patterns

## The Four Threat Levels

### 🟢 Green (Low)
**What it means**: Normal operations, no active threats detected.

**What to do**:
- Continue routine monitoring
- Review security metrics weekly
- Maintain standard security practices

### 🟡 Yellow (Medium)
**What it means**: Potential threats detected, increased vigilance recommended.

**What to do**:
- Review recent security events
- Check for unpatched vulnerabilities
- Verify backup systems are functioning
- Brief security team on elevated risk

### 🟠 Orange (High)
**What it means**: Active threat campaign detected targeting organizations like yours.

**What to do**:
- Enable additional security controls
- Increase monitoring frequency
- Brief executive team
- Prepare incident response team
- Review and test disaster recovery procedures

### 🔴 Red (Critical)
**What it means**: Immediate threat to business operations, active attack detected.

**What to do**:
- Activate incident response team immediately
- Execute containment playbooks
- Notify executive leadership
- Consider activating disaster recovery procedures
- Document all actions for compliance

## Business Impact

Understanding threat levels helps you:
- Allocate resources appropriately
- Communicate risk to stakeholders
- Make informed business decisions
- Justify security investments`,
            key_takeaways: [
                'Green (Low) = Normal operations, routine monitoring',
                'Yellow (Medium) = Increased vigilance, review security posture',
                'Orange (High) = Active threat detected, response team engaged',
                'Red (Critical) = Immediate action required, business impact possible'
            ],
            tags: ['threat-level', 'basics', 'risk'],
            popularity_score: 92,
            helpful_votes: 654,
            not_helpful_votes: 18
        },
        {
            guide_id: 'g003',
            title: 'How to Create Your First SOAR Playbook',
            category: 'how_to',
            audience: ['security_analyst', 'admin'],
            difficulty_level: 'intermediate',
            estimated_time_minutes: 30,
            plain_english_summary: 'Step-by-step guide to building an automated response playbook that handles security incidents without human intervention.',
            content: `# Creating Your First SOAR Playbook

## What is a SOAR Playbook?

A SOAR (Security Orchestration, Automation and Response) playbook is a predefined set of automated actions that respond to security threats.

## Step 1: Identify a Repetitive Task

Choose a security task you perform frequently:
- Responding to phishing emails
- Blocking malicious IP addresses
- Disabling compromised user accounts
- Quarantining malware

## Step 2: Access the Playbook Builder

1. Navigate to **SOAR** from the main menu
2. Click **"Create Custom Playbook"**
3. Give your playbook a descriptive name

## Step 3: Define the Trigger

Choose what starts your playbook:
- Specific event type (e.g., "Malware Detected")
- Severity level (e.g., "High" or "Critical")
- Source system (e.g., "Endpoint Detection")

## Step 4: Build the Workflow

Drag and drop actions in sequence:

**Example Phishing Response Playbook**:
1. **Analyze Email** - Extract sender, links, attachments
2. **Check Threat Intelligence** - Cross-reference against known threats
3. **Quarantine Email** - Isolate from all inboxes
4. **Block Sender** - Add to email blacklist
5. **Create Ticket** - Log in ITSM system
6. **Notify Team** - Alert security analysts

## Step 5: Test in Safe Mode

1. Enable "Test Mode"
2. Run simulation with sample data
3. Review execution logs
4. Verify expected outcomes

## Step 6: Deploy and Monitor

1. Disable "Test Mode"
2. Activate playbook
3. Monitor execution success rate
4. Iterate based on results

## Best Practices

- Start simple, add complexity over time
- Always test before deploying
- Document your playbooks
- Review and update regularly
- Use AI recommendations for optimization`,
            key_takeaways: [
                'Identify repetitive security tasks that can be automated',
                'Use the visual playbook builder to create workflows',
                'Test your playbook in a safe environment before deploying',
                'Monitor playbook performance and iterate based on results'
            ],
            tags: ['soar', 'automation', 'playbooks', 'response'],
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            popularity_score: 88,
            helpful_votes: 432,
            not_helpful_votes: 31
        },
        {
            guide_id: 'g004',
            title: 'For Investors: Understanding Outpost Zero\'s Competitive Advantage',
            category: 'investor_guide',
            audience: ['investor', 'executive'],
            difficulty_level: 'beginner',
            estimated_time_minutes: 20,
            plain_english_summary: 'Learn what makes Outpost Zero unique in the cybersecurity market and why it represents a strong investment opportunity.',
            content: `# Outpost Zero: Investment Thesis

## Executive Summary

Outpost Zero represents a paradigm shift in cybersecurity, combining proprietary AI technology with quantum-safe security to address the rapidly evolving threat landscape.

## Market Opportunity

### The Problem
- Global cybercrime costs exceed $6 trillion annually
- Traditional security tools generate 99% false positives
- Average data breach costs $4.45 million
- Security analyst shortage: 3.5 million unfilled positions

### The Solution
Outpost Zero's AI-powered platform:
- Reduces false positives by 95%
- Automates 80% of security operations
- Detects threats 100x faster than human analysts
- Provides 24/7 protection without staffing constraints

## Competitive Advantages

### 1. Proprietary Technology (12+ Pending Patents)
**ASES (Adaptive Self-Evolving Security)**
- Self-learning AI that adapts to new threats in real-time
- No signature updates required
- Protects against zero-day attacks
- Patent-protected for 20+ years

### 2. Quantum-Safe Security
- First-mover advantage in post-quantum cryptography
- Future-proof protection against quantum computers
- Compliance with emerging government mandates
- 5-10 year technology lead over competitors

### 3. Proven ROI
**Average Customer Results**:
- 300% ROI in year one
- 80% reduction in security incidents
- 60% lower operational costs
- 90% faster incident response

### 4. Strategic Partnerships
- **Microsoft**: Co-sell partnership, Azure Marketplace
- **Major ISPs**: Residential security gateway services
- **Government**: FedRAMP authorization in progress

## Business Model

### Revenue Streams
1. **Enterprise SaaS**: $5,000-$50,000/month recurring
2. **SMB Subscriptions**: $1,500/month starting
3. **ISP White-Label**: $2-5 per subscriber/month
4. **Government Contracts**: $1M+ project sizes
5. **API Licensing**: Usage-based pricing

### Unit Economics
- CAC: $15,000 (enterprise), $500 (SMB)
- LTV: $180,000 (enterprise), $18,000 (SMB)
- LTV/CAC Ratio: 12:1 (enterprise), 36:1 (SMB)
- Gross Margin: 85%
- Net Revenue Retention: 130%

## Market Position

### TAM/SAM/SOM
- **TAM**: $200B (global cybersecurity market)
- **SAM**: $45B (SIEM + SOAR + XDR segments)
- **SOM**: $2B (target market within 5 years)

### Growth Strategy
- **Year 1-2**: Penetrate enterprise market, establish Microsoft partnership
- **Year 3-4**: Scale SMB through ISP channel
- **Year 5+**: Expand internationally, government vertical

## Investment Highlights

### Why Now?
1. **Threat Landscape**: Exponential growth in cyber attacks
2. **AI Maturity**: Technology finally matches the vision
3. **Regulatory Pressure**: Increasing compliance requirements
4. **Quantum Timeline**: 5-10 years to quantum threat realization
5. **Market Consolidation**: Prime acquisition target for major players

### Risks and Mitigations
- **Competition**: Differentiated through patented technology
- **Sales Cycle**: Microsoft partnership accelerates enterprise deals
- **Technology Risk**: Continuous innovation, strong R&D team
- **Regulatory**: Proactive compliance, government partnerships

## Financial Projections

### 5-Year Outlook
- **Year 1**: $2M ARR, 40 enterprise customers
- **Year 2**: $8M ARR, 150 customers
- **Year 3**: $25M ARR, 500 customers + ISP channel launch
- **Year 4**: $75M ARR, 1,500 customers
- **Year 5**: $200M ARR, 5,000+ customers

### Path to Profitability
- Break-even: Month 18
- EBITDA positive: Month 24
- Rule of 40: Achieved by Year 3

## Exit Opportunities

### Strategic Acquirers
- **Microsoft**: Azure Security suite expansion
- **Palo Alto Networks**: SIEM/SOAR consolidation
- **CrowdStrike**: AI capabilities enhancement
- **Google Cloud**: Security platform gap
- **Cisco**: Portfolio diversification

### Valuation Comparables
- **CrowdStrike**: 25x ARR at IPO
- **SentinelOne**: 20x ARR at IPO
- **Outpost Zero Target**: 15-20x ARR (accounting for early stage)

## Conclusion

Outpost Zero combines breakthrough technology, massive market opportunity, and experienced execution team to deliver exceptional returns for investors while solving one of the world's most critical problems.

**Investment Ask**: Series A, $15M at $45M pre-money valuation
**Use of Funds**: Product development (40%), Sales & Marketing (35%), Operations (25%)`,
            key_takeaways: [
                'Proprietary AI technology with 12+ pending patents',
                'First-mover advantage in quantum-safe security',
                'Proven ROI with average 300% cost savings for enterprises',
                'Scalable SaaS model with strong unit economics',
                'Strategic partnerships with Microsoft and major ISPs'
            ],
            tags: ['investment', 'competitive-advantage', 'roi', 'patents'],
            popularity_score: 85,
            helpful_votes: 234,
            not_helpful_votes: 12
        }
    ], []);

    const getMockGlossary = useCallback(() => [
        {
            term_id: 't001',
            term: 'SOAR (Security Orchestration, Automation and Response)',
            short_definition: 'Technology that automatically handles security alerts and incidents without requiring constant human intervention.',
            detailed_explanation: 'SOAR platforms like the one in Outpost Zero allow security teams to create "playbooks" - automated workflows that respond to security threats. When a threat is detected, the SOAR system automatically executes predefined steps like isolating a compromised computer, blocking a malicious IP address, or creating an investigation ticket.',
            plain_english_analogy: 'Think of SOAR as a smart security guard that follows a detailed instruction manual. If the guard sees something suspicious (like someone trying to break in), they automatically follow the steps in the manual: lock the doors, call the police, review the security footage, and write an incident report - all without needing to ask their manager what to do.',
            example_usage: 'When Outpost Zero detects a phishing email, the SOAR playbook automatically quarantines the email, blocks the sender, checks if anyone clicked the malicious link, and alerts the security team - all in under 30 seconds.',
            category: 'platform_feature',
            related_terms: ['Playbook', 'Automation', 'Incident Response']
        },
        {
            term_id: 't002',
            term: 'Threat Level',
            short_definition: 'A simple color-coded indicator showing how dangerous the current security situation is for your organization.',
            detailed_explanation: 'Outpost Zero calculates threat level by analyzing thousands of factors including: active attacks targeting your industry, vulnerabilities in your systems, suspicious activities detected, and global threat intelligence. The platform uses AI to distill this complex information into a single, easy-to-understand metric.',
            plain_english_analogy: 'Like a weather forecast for cyber threats. Green means sunny and safe. Yellow means clouds are forming (stay alert). Orange means a storm is approaching (take precautions). Red means you\'re in a hurricane (take shelter immediately).',
            example_usage: 'If your threat level jumps from Green to Orange, it means Outpost Zero has detected an active threat campaign targeting organizations like yours. The system will automatically increase monitoring and may recommend enabling additional security controls.',
            category: 'security_concept',
            related_terms: ['Risk Score', 'Threat Intelligence', 'Alert Severity']
        },
        {
            term_id: 't003',
            term: 'ASES (Adaptive Self-Evolving Security)',
            short_definition: 'Our proprietary AI technology that learns from attacks and automatically updates defenses without human programming.',
            detailed_explanation: 'ASES is a breakthrough technology developed by Cyber Dojo Solutions that allows the security system to "teach itself" how to block new attacks. When it encounters a threat it hasn\'t seen before, it analyzes the attack patterns, creates new defensive measures, and deploys them across all protected systems - all in real-time. This is covered by multiple patent applications.',
            plain_english_analogy: 'Imagine if your home security system watched how burglars tried to break in, then immediately invented new locks they couldn\'t pick, and installed those locks on every door and window in your neighborhood. That\'s what ASES does for cybersecurity.',
            example_usage: 'When a zero-day malware variant emerged in 2024, traditional security tools took 48 hours to develop signatures. ASES detected the new variant and created protective measures in 0.3 seconds, protecting all Outpost Zero customers before the threat could spread.',
            category: 'technology',
            related_terms: ['Machine Learning', 'AI', 'Zero-Day Protection', 'Patent']
        },
        {
            term_id: 't004',
            term: 'Quantum-Safe Encryption',
            short_definition: 'Security measures that will remain unbreakable even when quantum computers become available.',
            detailed_explanation: 'Current encryption methods (like those used by banks and governments) will be vulnerable to quantum computers expected in the next 5-10 years. Outpost Zero uses next-generation encryption algorithms that are "quantum-safe" - meaning they\'ll remain secure even against quantum computer attacks. This ensures your data stays protected for decades, not just years.',
            plain_english_analogy: 'Today\'s locks are pick-proof against regular lockpicks, but quantum computers are like super-powered lockpicks that can open them easily. Quantum-safe encryption is like upgrading to locks that even these super-tools can\'t open.',
            example_usage: 'If you\'re protecting sensitive data that needs to stay confidential for 20+ years (like patient records or classified documents), Outpost Zero\'s quantum-safe encryption ensures that even future quantum computers won\'t be able to decrypt it.',
            category: 'technology',
            related_terms: ['Encryption', 'QTML', 'Post-Quantum Cryptography']
        },
        {
            term_id: 't005',
            term: 'Incident Response',
            short_definition: 'The systematic process of detecting, investigating, containing, and recovering from security breaches.',
            detailed_explanation: 'Incident response is like having an emergency plan for cyberattacks. It includes: detecting that something bad happened, figuring out how bad it is, stopping it from spreading, fixing what broke, and learning lessons to prevent it next time. Outpost Zero automates many of these steps.',
            plain_english_analogy: 'Like having a fire department for cyber threats. When the alarm goes off: 1) Rush to the scene, 2) Assess the damage, 3) Put out the fire, 4) Save what can be saved, 5) Prevent it from reigniting, 6) File a report on what happened.',
            example_usage: 'When Outpost Zero detects a compromised user account, the incident response workflow automatically: resets the password, reviews all recent account activity, checks for data exfiltration, notifies the security team, and creates a detailed incident report.',
            category: 'security_concept',
            related_terms: ['SOAR', 'Containment', 'Investigation', 'Remediation']
        },
        {
            term_id: 't006',
            term: 'ROI (Return on Investment)',
            short_definition: 'How much money you save or earn compared to what you spent on the security platform.',
            detailed_explanation: 'In cybersecurity, ROI includes: costs avoided by preventing breaches, time saved through automation, reduced insurance premiums, faster compliance audits, and fewer security staff needed. Most Outpost Zero customers achieve 300%+ ROI within the first year.',
            plain_english_analogy: 'Like buying a $10,000 car that saves you $30,000 per year in taxi fares. You spent $10k but saved $30k, so your ROI is 300% (you got back 3x what you invested).',
            example_usage: 'A customer spent $100,000/year on Outpost Zero but saved: $200,000 (prevented breach costs), $80,000 (reduced staff time), $50,000 (lower insurance), and $70,000 (faster audits) = $400,000 saved. ROI = 400%.',
            category: 'business_term',
            related_terms: ['Cost Savings', 'Business Value', 'TCO']
        }
    ], []);

    const loadKnowledgeBase = useCallback(async () => {
        setIsLoading(true);
        try {
            const [guidesData, glossaryData] = await Promise.all([
                PlatformGuide.list('-popularity_score'),
                Glossary.list('term')
            ]);
            
            setGuides(guidesData.length > 0 ? guidesData : getMockGuides());
            setGlossary(glossaryData.length > 0 ? glossaryData : getMockGlossary());
        } catch (error) {
            console.error('Error loading knowledge base:', error);
            setGuides(getMockGuides());
            setGlossary(getMockGlossary());
        }
        setIsLoading(false);
    }, [getMockGuides, getMockGlossary]);

    useEffect(() => {
        loadKnowledgeBase();
    }, [loadKnowledgeBase]);

    const filteredGuides = guides.filter(guide => {
        const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             guide.plain_english_summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             guide.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
        const matchesAudience = selectedAudience === 'all' || guide.audience?.includes(selectedAudience);
        return matchesSearch && matchesCategory && matchesAudience;
    });

    const filteredGlossary = glossary.filter(term =>
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.short_definition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCategoryIcon = (category) => {
        const icons = {
            getting_started: Zap,
            how_to: BookOpen,
            concept: Lightbulb,
            investor_guide: TrendingUp,
            use_case: Users,
            troubleshooting: Shield,
            best_practice: Star,
            api_guide: Code,
            integration_guide: Code
        };
        return icons[category] || FileText;
    };

    const getDifficultyColor = (level) => {
        const colors = {
            beginner: 'bg-green-500/20 text-green-300 border-green-500/30',
            intermediate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
            advanced: 'bg-red-500/20 text-red-300 border-red-500/30'
        };
        return colors[level] || colors.beginner;
    };

    const handleVote = (guideId, voteType) => {
        console.log(`Voted ${voteType} on guide ${guideId}`);
        // In production, this would update the database
        alert(`Thank you for your feedback! This helps us improve our content.`);
    };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                        <BookOpen className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Knowledge Center</h1>
                        <p className="text-gray-300">Comprehensive guides, tutorials, and resources to master Outpost Zero</p>
                    </div>
                </div>

                {/* Search and Filters */}
                <Card className="bg-gray-800/50 border-gray-700 mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search guides, tutorials, and definitions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                                />
                            </div>
                            <select
                                value={selectedAudience}
                                onChange={(e) => setSelectedAudience(e.target.value)}
                                className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                            >
                                <option value="all">All Audiences</option>
                                <option value="end_user">End Users</option>
                                <option value="security_analyst">Security Analysts</option>
                                <option value="admin">Administrators</option>
                                <option value="executive">Executives</option>
                                <option value="investor">Investors</option>
                                <option value="developer">Developers</option>
                                <option value="compliance_officer">Compliance Officers</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="guides" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
                        <TabsTrigger value="guides">Guides</TabsTrigger>
                        <TabsTrigger value="glossary">Glossary</TabsTrigger>
                        <TabsTrigger value="videos">Videos</TabsTrigger>
                        <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
                        <TabsTrigger value="faq">FAQ</TabsTrigger>
                    </TabsList>

                    <TabsContent value="guides" className="mt-6">
                        <div className="flex gap-2 mb-6 flex-wrap">
                            {['all', 'getting_started', 'how_to', 'concept', 'investor_guide', 'use_case'].map(cat => (
                                <Button
                                    key={cat}
                                    variant={selectedCategory === cat ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={selectedCategory === cat ? 'bg-blue-600' : 'border-gray-700 text-gray-300'}
                                >
                                    {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Button>
                            ))}
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGuides.map(guide => {
                                const IconComponent = getCategoryIcon(guide.category);
                                return (
                                    <Card key={guide.guide_id} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all">
                                        <CardHeader>
                                            <div className="flex items-start justify-between mb-2">
                                                <IconComponent className="w-6 h-6 text-blue-400" />
                                                <Badge className={getDifficultyColor(guide.difficulty_level)}>
                                                    {guide.difficulty_level}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-white text-lg">
                                                {guide.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                                                {guide.plain_english_summary}
                                            </p>

                                            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {guide.estimated_time_minutes} min
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {guide.audience?.[0]?.replace(/_/g, ' ')}
                                                </div>
                                                {guide.video_url && (
                                                    <div className="flex items-center gap-1">
                                                        <Video className="w-3 h-3" />
                                                        Video
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {guide.tags?.slice(0, 3).map(tag => (
                                                    <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-400">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <ThumbsUp className="w-3 h-3 text-green-400" />
                                                        {guide.helpful_votes}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-yellow-400" />
                                                        {guide.popularity_score}
                                                    </div>
                                                </div>
                                                <Button 
                                                    size="sm" 
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                    onClick={() => setSelectedGuide(guide)}
                                                >
                                                    Read Guide
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>

                    <TabsContent value="glossary" className="mt-6">
                        <div className="grid gap-4">
                            {filteredGlossary.map(term => (
                                <Card 
                                    key={term.term_id} 
                                    className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all cursor-pointer"
                                    onClick={() => setSelectedTerm(term)}
                                >
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <BookOpen className="w-5 h-5 text-cyan-400" />
                                            {term.term}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-300 text-sm mb-2">{term.short_definition}</p>
                                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                                            Read More
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="videos" className="mt-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGuides.filter(g => g.video_url).map(guide => (
                                <Card key={guide.guide_id} className="bg-gray-800/50 border-gray-700">
                                    <CardHeader>
                                        <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-gray-900 flex items-center justify-center">
                                            <PlayCircle className="w-16 h-16 text-blue-400" />
                                        </div>
                                        <CardTitle className="text-white text-lg flex items-center gap-2">
                                            <PlayCircle className="w-5 h-5 text-blue-400" />
                                            {guide.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-300 text-sm mb-4">{guide.plain_english_summary}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                                            <Clock className="w-3 h-3" />
                                            {guide.estimated_time_minutes} minutes
                                        </div>
                                        <Button 
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            onClick={() => setSelectedGuide(guide)}
                                        >
                                            Watch Video
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="quickstart" className="mt-6">
                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Zap className="w-6 h-6 text-yellow-400" />
                                    Quick Start Guide: Get Up and Running in 15 Minutes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {[
                                        {
                                            step: 1,
                                            title: 'Review Your Dashboard',
                                            description: 'Familiarize yourself with the main dashboard. The threat level indicator shows your current security posture.',
                                            time: '2 min',
                                            icon: BarChart3
                                        },
                                        {
                                            step: 2,
                                            title: 'Connect Your First Data Source',
                                            description: 'Go to Data Sources and connect your firewall, EDR, or cloud provider. The platform will start analyzing your environment immediately.',
                                            time: '5 min',
                                            icon: Shield
                                        },
                                        {
                                            step: 3,
                                            title: 'Enable Automated Responses',
                                            description: 'Navigate to SOAR → Pre-built Templates. Deploy the "Malware Containment" playbook with one click.',
                                            time: '3 min',
                                            icon: PlayCircle
                                        },
                                        {
                                            step: 4,
                                            title: 'Invite Your Team',
                                            description: 'Go to Settings → Users and invite your security team members. Assign appropriate roles.',
                                            time: '3 min',
                                            icon: Users
                                        },
                                        {
                                            step: 5,
                                            title: 'Set Up Notifications',
                                            description: 'Configure alert preferences in Settings so you\'re notified of critical threats via email, SMS, or Slack.',
                                            time: '2 min',
                                            icon: Bell
                                        }
                                    ].map(item => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={item.step} className="flex gap-4">
                                                <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">
                                                    {item.step}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="text-white font-semibold flex items-center gap-2">
                                                            <Icon className="w-4 h-4" />
                                                            {item.title}
                                                        </h4>
                                                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                                                            {item.time}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-gray-300 text-sm">{item.description}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                                    <h4 className="text-green-300 font-semibold mb-2 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Congratulations! You're Now Protected
                                    </h4>
                                    <p className="text-gray-300 text-sm">
                                        Outpost Zero is now actively monitoring your environment and will automatically respond to threats. 
                                        Check your dashboard daily to stay informed about your security posture.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="faq" className="mt-6">
                        <div className="grid gap-4">
                            {[
                                {
                                    q: 'How does Outpost Zero compare to traditional SIEM tools like Splunk?',
                                    a: 'Traditional SIEMs collect and store security data but require extensive manual analysis. Outpost Zero goes further by automatically analyzing threats, responding to incidents, and learning from every attack. Think of it as having an AI security analyst that never sleeps, versus a filing cabinet that stores information.',
                                    icon: Shield
                                },
                                {
                                    q: 'Will I still need my current security tools?',
                                    a: 'Outpost Zero integrates with your existing tools (firewalls, EDR, etc.) rather than replacing them. We become the "brain" that coordinates everything, making your current investments more effective. Most customers keep their existing tools and add Outpost Zero as the orchestration layer.',
                                    icon: CheckCircle
                                },
                                {
                                    q: 'How long does implementation take?',
                                    a: 'Initial setup: 15 minutes. Full deployment with all integrations: 1-2 weeks. Most value is realized within the first 30 days as the AI learns your environment and begins automating responses.',
                                    icon: Clock
                                },
                                {
                                    q: 'What makes Outpost Zero worth the investment?',
                                    a: 'Average customers achieve 300%+ ROI in year one through: prevented breach costs ($millions saved), reduced headcount needs (80% automation), faster compliance (90% less audit prep time), and lower insurance premiums (20-40% discounts).',
                                    icon: TrendingUp
                                },
                                {
                                    q: 'Is my data safe? Do you have access to my sensitive information?',
                                    a: 'We use zero-knowledge architecture - your sensitive data never leaves your environment. We only analyze security metadata (logs, alerts) not actual business data. For additional security, we offer on-premise deployment for highly regulated industries.',
                                    icon: Shield
                                },
                                {
                                    q: 'Can small businesses afford this?',
                                    a: 'Yes! We have tiered pricing starting at $99/month for small businesses. Many SMBs find Outpost Zero is cheaper than hiring a single security analyst ($80k+ per year) while providing 24/7 AI-powered protection.',
                                    icon: Users
                                },
                                {
                                    q: 'What happens when a threat is detected?',
                                    a: '1) Outpost Zero immediately analyzes the threat severity. 2) For known threats, automated playbooks respond instantly (isolate, block, contain). 3) For unknown threats, AI generates a response strategy. 4) You receive a clear alert explaining what happened and what actions were taken. 5) Everything is logged for compliance.',
                                    icon: AlertTriangle
                                },
                                {
                                    q: 'Do I need technical expertise to use this?',
                                    a: 'No. The platform is designed for non-technical users with plain-English explanations. However, we also provide advanced features for security professionals. Think of it like a car - anyone can drive it, but mechanics can open the hood.',
                                    icon: Lightbulb
                                }
                            ].map((faq, index) => {
                                const Icon = faq.icon;
                                return (
                                    <Card key={index} className="bg-gray-800/50 border-gray-700">
                                        <CardHeader>
                                            <CardTitle className="text-white text-lg flex items-start gap-3">
                                                <span className="text-blue-400 flex-shrink-0 mt-1">
                                                    <Icon className="w-5 h-5" />
                                                </span>
                                                <span>{faq.q}</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex gap-3">
                                                <span className="text-green-400 flex-shrink-0 font-bold">A:</span>
                                                <p className="text-gray-300">{faq.a}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Guide Detail Modal */}
            <Dialog open={!!selectedGuide} onOpenChange={() => setSelectedGuide(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
                    <DialogHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <DialogTitle className="text-2xl text-white mb-2">
                                    {selectedGuide?.title}
                                </DialogTitle>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                                    <Badge className={getDifficultyColor(selectedGuide?.difficulty_level)}>
                                        {selectedGuide?.difficulty_level}
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {selectedGuide?.estimated_time_minutes} min
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {selectedGuide?.audience?.join(', ').replace(/_/g, ' ')}
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedGuide(null)}
                                className="flex-shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </DialogHeader>

                    <div className="mt-6">
                        {selectedGuide?.video_url && (
                            <div className="aspect-video rounded-lg overflow-hidden mb-6 bg-gray-800">
                                <div className="w-full h-full flex items-center justify-center">
                                    <PlayCircle className="w-16 h-16 text-blue-400" />
                                    <p className="ml-4 text-gray-400">Video player would load here</p>
                                </div>
                            </div>
                        )}

                        <div className="prose prose-invert max-w-none">
                            <ReactMarkdown className="text-gray-300">
                                {selectedGuide?.content || ''}
                            </ReactMarkdown>
                        </div>

                        {selectedGuide?.key_takeaways && selectedGuide.key_takeaways.length > 0 && (
                            <Card className="bg-blue-900/20 border-blue-500/30 mt-6">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-400" />
                                        Key Takeaways
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {selectedGuide.key_takeaways.map((takeaway, index) => (
                                            <li key={index} className="flex gap-3 text-gray-300">
                                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                                <span>{takeaway}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-700">
                            <p className="text-gray-400 text-sm mb-4">Was this guide helpful?</p>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="border-gray-600 text-gray-300 hover:bg-green-600 hover:text-white hover:border-green-600"
                                    onClick={() => handleVote(selectedGuide?.guide_id, 'helpful')}
                                >
                                    <ThumbsUp className="w-4 h-4 mr-2" />
                                    Helpful ({selectedGuide?.helpful_votes})
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-gray-600 text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600"
                                    onClick={() => handleVote(selectedGuide?.guide_id, 'not_helpful')}
                                >
                                    <ThumbsDown className="w-4 h-4 mr-2" />
                                    Not Helpful ({selectedGuide?.not_helpful_votes})
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Glossary Term Detail Modal */}
            <Dialog open={!!selectedTerm} onOpenChange={() => setSelectedTerm(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
                    <DialogHeader>
                        <div className="flex items-start justify-between">
                            <DialogTitle className="text-2xl text-white flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-cyan-400" />
                                {selectedTerm?.term}
                            </DialogTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedTerm(null)}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </DialogHeader>

                    <div className="mt-6 space-y-6">
                        <div>
                            <h4 className="text-white font-semibold text-sm mb-2">Quick Definition:</h4>
                            <p className="text-gray-300 text-sm">{selectedTerm?.short_definition}</p>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold text-sm mb-2">Detailed Explanation:</h4>
                            <p className="text-gray-300 text-sm">{selectedTerm?.detailed_explanation}</p>
                        </div>

                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                            <h4 className="text-blue-300 font-semibold text-sm mb-2 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" />
                                Plain English Analogy:
                            </h4>
                            <p className="text-gray-300 text-sm italic">{selectedTerm?.plain_english_analogy}</p>
                        </div>

                        {selectedTerm?.example_usage && (
                            <div>
                                <h4 className="text-white font-semibold text-sm mb-2">Example in Outpost Zero:</h4>
                                <p className="text-gray-300 text-sm">{selectedTerm.example_usage}</p>
                            </div>
                        )}

                        {selectedTerm?.related_terms && selectedTerm.related_terms.length > 0 && (
                            <div>
                                <h4 className="text-white font-semibold text-sm mb-2">Related Terms:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTerm.related_terms.map(relatedTerm => (
                                        <Badge key={relatedTerm} variant="outline" className="border-gray-600 text-gray-300">
                                            {relatedTerm}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
