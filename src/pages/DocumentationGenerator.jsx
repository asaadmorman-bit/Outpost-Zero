
import React, { useState, useEffect } from 'react';
import { Documentation } from '@/entities/all';
import { generateDocumentation } from '@/functions/generateDocumentation';
import { testAnthropicConnection } from '@/functions/testAnthropicConnection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    FileText,
    Download,
    Copy,
    Github,
    Sparkles,
    BookOpen,
    Code,
    Users,
    Settings,
    Zap,
    CheckCircle,
    Loader2,
    AlertCircle,
    RefreshCw,
    AlertTriangle,
    TrendingUp, // Added import for TrendingUp icon
    Eye, // New: Added Eye icon
    Trash2 // New: Added Trash2 icon
} from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DocumentationGeneratorPage() {
    const [documentationType, setDocumentationType] = useState('readme');
    const [style, setStyle] = useState('technical');
    const [customPrompt, setCustomPrompt] = useState('');
    const [generatedDoc, setGeneratedDoc] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [savedDocs, setSavedDocs] = useState([]);
    const [activeTab, setActiveTab] = useState('generate');
    const [apiKeyStatus, setApiKeyStatus] = useState(null);
    const [isCheckingConnection, setIsCheckingConnection] = useState(false);

    useEffect(() => {
        loadSavedDocs();
        checkAnthropicConnection();
    }, []);

    const checkAnthropicConnection = async () => {
        setIsCheckingConnection(true);
        try {
            const response = await testAnthropicConnection();
            if (response.data.success) {
                setApiKeyStatus(response.data);
                if (!response.data.api_key_found) {
                    toast.error('API Key Not Found', {
                        description: 'ANTHROPIC_API_KEY is not accessible. Check diagnostics below.',
                        duration: 10000
                    });
                } else {
                    toast.success(`API Key Found: ${response.data.working_key_name}`);
                }
            } else {
                setApiKeyStatus({ success: false, error: response.data.error, diagnostics: response.data.diagnostics });
                toast.error('Connection Test Failed', {
                    description: response.data.error || 'An unexpected error occurred during connection test.',
                    duration: 10000
                });
            }
        } catch (error) {
            console.error('Connection test failed:', error);
            setApiKeyStatus({ success: false, error: error.message });
            toast.error('Connection Test Error', {
                description: `Failed to connect to backend for API key check: ${error.message}`,
                duration: 10000
            });
        }
        setIsCheckingConnection(false);
    };

    const loadSavedDocs = async () => {
        try {
            const docs = await Documentation.list('-created_date', 20);
            setSavedDocs(docs);
        } catch (error) {
            console.error('Error loading docs:', error);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
            console.log('Documentation generation request timed out on client side.');
        }, 180000); // 3 minutes

        try {
            // Pass the abort signal to the generation function
            const response = await generateDocumentation({
                documentation_type: documentationType,
                style,
                custom_prompt: customPrompt,
                signal: controller.signal
            });

            clearTimeout(timeoutId); // Clear timeout once response is received

            if (response.data.success) {
                setGeneratedDoc(response.data);
                toast.success('Documentation generated successfully!');
                setActiveTab('preview');
            } else {
                // Check for API key error specifically
                if (response.data.error && response.data.error.includes('ANTHROPIC_API_KEY')) {
                    toast.error('Configuration Error', {
                        description: 'ANTHROPIC_API_KEY is not set or accessible. Please ensure it is correctly configured in Dashboard → Settings → Environment Variables and redeploy your function.',
                        duration: 10000
                    });
                } else {
                    toast.error('Failed to generate documentation: ' + response.data.error);
                }
            }
        } catch (error) {
            clearTimeout(timeoutId); // Clear timeout if an error occurs
            console.error('Documentation generation error:', error);
            // Check for AbortError (from timeout) or general network errors
            if (error.name === 'AbortError' || (error.message && error.message.includes('Network Error'))) {
                toast.error('Request Timeout', {
                    description: 'The documentation generation took too long. Try a simpler request or try again.',
                    duration: 10000
                });
            } else {
                toast.error('Error: ' + error.message);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!generatedDoc) return;

        try {
            // Truncate content if too long (base44 has limits)
            const maxContentLength = 50000; // 50KB limit
            const content = generatedDoc.documentation.length > maxContentLength
                ? generatedDoc.documentation.substring(0, maxContentLength) + '\n\n... (content truncated, download full version)'
                : generatedDoc.documentation;

            await Documentation.create({
                doc_id: `doc_${Date.now()}`,
                title: getDocTitle(documentationType),
                documentation_type: documentationType,
                content: content,
                style,
                version: '1.0.0',
                ai_model: generatedDoc.metadata.model,
                word_count: generatedDoc.metadata.word_count,
                status: 'draft'
            });

            toast.success('Documentation saved!');
            loadSavedDocs();
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save. Try downloading instead.', {
                description: 'The content might be too large for database storage.'
            });
        }
    };

    const handleCopy = () => {
        if (generatedDoc) {
            navigator.clipboard.writeText(generatedDoc.documentation);
            toast.success('Copied to clipboard!');
        }
    };

    const handleDownload = () => {
        if (!generatedDoc) return;

        const blob = new Blob([generatedDoc.documentation], { type: 'text/markdown' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${getDocTitle(documentationType).replace(/\s+/g, '_')}.md`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        toast.success('Downloaded!');
    };

    // New function for downloading saved documents
    const downloadDoc = (doc) => {
        const blob = new Blob([doc.content], { type: 'text/markdown' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.title.replace(/\s+/g, '_')}.md`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        toast.success(`Downloaded "${doc.title}"!`);
    };

    // New function for viewing saved documents
    const viewDoc = (doc) => {
        setGeneratedDoc({
            documentation: doc.content,
            metadata: {
                word_count: doc.word_count,
                model: doc.ai_model,
                style: doc.style, // Pass the style from the saved doc
                documentation_type: doc.documentation_type // Pass the type from the saved doc
            }
        });
        setDocumentationType(doc.documentation_type); // Set the generator type so the title is correct in preview
        setStyle(doc.style); // Set the style for context in preview
        setActiveTab('preview');
        toast.info(`Viewing "${doc.title}"`);
    };

    // New function for deleting saved documents
    const deleteDoc = async (doc_id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) {
            return;
        }
        try {
            await Documentation.delete(doc_id);
            toast.success('Document deleted successfully!');
            loadSavedDocs(); // Reload the list of saved documents
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete document.');
        }
    };

    const handleGithubSync = () => {
        toast.info('GitHub integration coming soon! For now, download the markdown and commit manually.');
    };

    const getDocTitle = (type) => {
        const titles = {
            readme: 'README',
            api_docs: 'API Documentation',
            user_guide: 'User Guide',
            deployment_guide: 'Deployment Guide',
            admin_guide: 'Administrator Guide',
            feature_doc: 'Feature Documentation',
            integration_guide: 'Integration Guide',
            compliance_guide: 'Compliance Guide'
        };
        return titles[type] || 'Documentation';
    };

    const docTypes = [
        { value: 'readme', label: 'README.md', icon: FileText, description: 'Project overview and getting started' },
        { value: 'api_docs', label: 'API Documentation', icon: Code, description: 'Complete API reference' },
        { value: 'user_guide', label: 'User Guide', icon: Users, description: 'End-user documentation' },
        { value: 'deployment_guide', label: 'Deployment Guide', icon: Zap, description: 'Installation and setup' },
        { value: 'admin_guide', label: 'Admin Guide', icon: Settings, description: 'System administration' },
        { value: 'feature_doc', label: 'Feature Docs', icon: BookOpen, description: 'Individual feature documentation' },
        { value: 'integration_guide', label: 'Integration Guide', icon: Zap, description: 'Third-party integrations' },
        { value: 'compliance_guide', label: 'Compliance Guide', icon: CheckCircle, description: 'Regulatory compliance' }
    ];

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                        <Sparkles className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">AI Documentation Generator</h1>
                        <p className="text-gray-200">Powered by Claude AI - Generate comprehensive docs for Outpost Zero</p>
                    </div>
                </div>

                {/* Enhanced Diagnostic Info */}
                {apiKeyStatus && apiKeyStatus.diagnostics && (
                    <Card className="mb-6 border-gray-700 bg-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white text-sm">🔍 Environment Diagnostics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-gray-400">ANTHROPIC_API_KEY:</div>
                                    <div className={apiKeyStatus.diagnostics.ANTHROPIC_API_KEY_exists ? 'text-green-400' : 'text-red-400'}>
                                        {apiKeyStatus.diagnostics.ANTHROPIC_API_KEY_exists ? `✓ Found (${apiKeyStatus.diagnostics.ANTHROPIC_API_KEY_length} chars)` : '✗ Not Found'}
                                    </div>

                                    <div className="text-gray-400">anthrokeynew:</div>
                                    <div className={apiKeyStatus.diagnostics.anthrokeynew_exists ? 'text-green-400' : 'text-red-400'}>
                                        {apiKeyStatus.diagnostics.anthrokeynew_exists ? `✓ Found (${apiKeyStatus.diagnostics.anthrokeynew_length} chars)` : '✗ Not Found'}
                                    </div>

                                    <div className="text-gray-400">Total Env Vars:</div>
                                    <div className="text-white">{apiKeyStatus.diagnostics.total_env_vars}</div>

                                    <div className="text-gray-400">BASE44_APP_ID:</div>
                                    <div className="text-white font-mono text-xs">{apiKeyStatus.diagnostics.base44_app_id}</div>
                                </div>

                                {apiKeyStatus.diagnostics.relevant_env_vars && apiKeyStatus.diagnostics.relevant_env_vars.length > 0 && (
                                    <div className="mt-4">
                                        <div className="text-sm text-gray-400 mb-2">Relevant Environment Variables:</div>
                                        <div className="bg-gray-900/50 p-3 rounded font-mono text-xs text-green-400">
                                            {apiKeyStatus.diagnostics.relevant_env_vars.join(', ')}
                                        </div>
                                    </div>
                                )}

                                {apiKeyStatus.diagnostics.all_env_vars && (
                                    <details className="mt-4">
                                        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white">
                                            Show all environment variables ({apiKeyStatus.diagnostics.all_env_vars.length})
                                        </summary>
                                        <div className="mt-2 bg-gray-900/50 p-3 rounded font-mono text-xs text-gray-300 max-h-40 overflow-y-auto">
                                            {apiKeyStatus.diagnostics.all_env_vars.join(', ')}
                                        </div>
                                    </details>
                                )}

                                <div className="flex gap-2 mt-4">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={checkAnthropicConnection}
                                        disabled={isCheckingConnection}
                                        className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                                    >
                                        <RefreshCw className={`w-4 h-4 mr-2 ${isCheckingConnection ? 'animate-spin' : ''}`} />
                                        Recheck
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="generate">Generate</TabsTrigger>
                        <TabsTrigger value="preview" disabled={!generatedDoc}>Preview</TabsTrigger>
                        <TabsTrigger value="saved">Saved Docs ({savedDocs.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="generate">
                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 space-y-6">
                                <Card className="border-gray-700 bg-gray-800/50">
                                    <CardHeader>
                                        <CardTitle className="text-white">Documentation Type</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {docTypes.map(type => {
                                            const Icon = type.icon;
                                            return (
                                                <button
                                                    key={type.value}
                                                    onClick={() => setDocumentationType(type.value)}
                                                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                                                        documentationType === type.value
                                                            ? 'border-blue-500 bg-blue-500/10'
                                                            : 'border-gray-700 bg-gray-900/30 hover:border-gray-600'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <Icon className={`w-5 h-5 mt-0.5 ${
                                                            documentationType === type.value ? 'text-blue-400' : 'text-gray-400'
                                                        }`} />
                                                        <div>
                                                            <div className="font-medium text-white">{type.label}</div>
                                                            <div className="text-xs text-gray-400 mt-1">{type.description}</div>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </CardContent>
                                </Card>

                                <Card className="border-gray-700 bg-gray-800/50">
                                    <CardHeader>
                                        <CardTitle className="text-white">Style</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Select value={style} onValueChange={setStyle}>
                                            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700">
                                                <SelectItem value="technical">Technical (for engineers)</SelectItem>
                                                <SelectItem value="user_friendly">User-Friendly (for end users)</SelectItem>
                                                <SelectItem value="executive">Executive (for leadership)</SelectItem>
                                                <SelectItem value="developer">Developer (with code examples)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-2">
                                <Card className="border-gray-700 bg-gray-800/50">
                                    <CardHeader>
                                        <CardTitle className="text-white">Custom Requirements (Optional)</CardTitle>
                                        <p className="text-sm text-gray-300">Add specific instructions for the AI</p>
                                    </CardHeader>
                                    <CardContent>
                                        <Textarea
                                            value={customPrompt}
                                            onChange={(e) => setCustomPrompt(e.target.value)}
                                            placeholder="Example: Focus on agent deployment for Windows environments, include PowerShell examples, emphasize zero-trust architecture..."
                                            className="min-h-40 bg-gray-900 border-gray-700 text-white"
                                        />

                                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                            <h4 className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" />
                                                AI-Powered Generation
                                            </h4>
                                            <p className="text-sm text-blue-200">
                                                Claude AI will generate comprehensive, accurate documentation specifically for <strong>Outpost Zero</strong> -
                                                not generic base44 docs. It understands all security features, integrations, and use cases.
                                            </p>
                                        </div>

                                        <Button
                                            onClick={handleGenerate}
                                            disabled={isGenerating || (apiKeyStatus && !apiKeyStatus.api_key_found)}
                                            className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
                                            size="lg"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    Generating Documentation...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-5 h-5 mr-2" />
                                                    Generate with Claude AI
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="preview">
                        {generatedDoc && (
                            <div className="space-y-6">
                                <Card className="border-gray-700 bg-gray-800/50">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-white text-2xl">{getDocTitle(generatedDoc.metadata.documentation_type || documentationType)}</CardTitle>
                                                <div className="flex gap-2 mt-2">
                                                    <Badge variant="outline" className="text-purple-300 border-purple-300/50">
                                                        {generatedDoc.metadata.word_count} words
                                                    </Badge>
                                                    <Badge variant="outline" className="text-blue-300 border-blue-300/50">
                                                        {generatedDoc.metadata.style || style}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-green-300 border-green-300/50">
                                                        {generatedDoc.metadata.model}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button onClick={handleCopy} variant="outline" size="sm">
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Copy
                                                </Button>
                                                <Button onClick={handleDownload} variant="outline" size="sm">
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download
                                                </Button>
                                                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" size="sm">
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    Save
                                                </Button>
                                                <Button onClick={handleGithubSync} variant="outline" size="sm">
                                                    <Github className="w-4 h-4 mr-2" />
                                                    GitHub
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {generatedDoc.metadata.word_count > 5000 && ( // Threshold for warning
                                            <Alert className="mb-4 bg-blue-500/10 border-blue-500/50">
                                                <AlertTriangle className="h-4 w-4 text-blue-400" />
                                                <AlertTitle className="text-blue-300">Large Content Warning</AlertTitle>
                                                <AlertDescription className="text-blue-200">
                                                    This documentation is {generatedDoc.metadata.word_count} words. It's recommended to download it rather than save to the database.
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                        <div className="max-w-none bg-gray-900 p-6 rounded-lg">
                                            <ReactMarkdown
                                                className="text-white"
                                                components={{
                                                    h1: ({children}) => <h1 className="text-white text-3xl font-bold mb-4">{children}</h1>,
                                                    h2: ({children}) => <h2 className="text-white text-2xl font-bold mb-3 mt-6">{children}</h2>,
                                                    h3: ({children}) => <h3 className="text-white text-xl font-bold mb-2 mt-4">{children}</h3>,
                                                    h4: ({children}) => <h4 className="text-white text-lg font-semibold mb-2 mt-3">{children}</h4>,
                                                    p: ({children}) => <p className="text-gray-200 mb-4 leading-relaxed">{children}</p>,
                                                    ul: ({children}) => <ul className="text-gray-200 list-disc list-inside mb-4 space-y-2">{children}</ul>,
                                                    ol: ({children}) => <ol className="text-gray-200 list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                                                    li: ({children}) => <li className="text-gray-200">{children}</li>,
                                                    strong: ({children}) => <strong className="text-white font-bold">{children}</strong>,
                                                    em: ({children}) => <em className="text-gray-300 italic">{children}</em>,
                                                    code: ({inline, children}) =>
                                                        inline ?
                                                            <code className="bg-gray-800 text-blue-300 px-2 py-1 rounded text-sm">{children}</code> :
                                                            <code className="block bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto mb-4">{children}</code>,
                                                    pre: ({children}) => <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                                                    blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 text-gray-300 italic my-4">{children}</blockquote>,
                                                    a: ({children, href}) => <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                                                    table: ({children}) => <table className="w-full border-collapse mb-4">{children}</table>,
                                                    th: ({children}) => <th className="bg-gray-800 text-white border border-gray-700 px-4 py-2 text-left">{children}</th>,
                                                    td: ({children}) => <td className="text-gray-200 border border-gray-700 px-4 py-2">{children}</td>,
                                                }}
                                            >
                                                {generatedDoc.documentation}
                                            </ReactMarkdown>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="saved">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {savedDocs.length === 0 ? (
                                <Card className="border-gray-700 bg-gray-800/50 col-span-full">
                                    <CardContent className="p-12 text-center">
                                        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-white mb-2">No Saved Documentation</h3>
                                        <p className="text-gray-300">Generate and save documentation to see it here</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                savedDocs.map(doc => {
                                    // SUPER VIBRANT color schemes - much more visible!
                                    const styleConfig = {
                                        technical: {
                                            color: 'bg-blue-600/40 text-blue-100 border-blue-400',
                                            icon: Code,
                                            label: '👨‍💻 Technical',
                                            border: 'border-blue-400',
                                            cardBg: 'bg-blue-900/20',
                                            glow: 'shadow-lg shadow-blue-500/50'
                                        },
                                        user_friendly: {
                                            color: 'bg-green-600/40 text-green-100 border-green-400',
                                            icon: Users,
                                            label: '👥 User Friendly',
                                            border: 'border-green-400',
                                            cardBg: 'bg-green-900/20',
                                            glow: 'shadow-lg shadow-green-500/50'
                                        },
                                        executive: {
                                            color: 'bg-purple-600/40 text-purple-100 border-purple-400',
                                            icon: TrendingUp,
                                            label: '👔 Executive',
                                            border: 'border-purple-400',
                                            cardBg: 'bg-purple-900/20',
                                            glow: 'shadow-lg shadow-purple-500/50'
                                        },
                                        developer: {
                                            color: 'bg-orange-600/40 text-orange-100 border-orange-400',
                                            icon: Code,
                                            label: '🔧 Developer',
                                            border: 'border-orange-400',
                                            cardBg: 'bg-orange-900/20',
                                            glow: 'shadow-lg shadow-orange-500/50'
                                        }
                                    };

                                    const config = styleConfig[doc.style] || styleConfig.technical;
                                    const StyleIcon = config.icon;

                                    return (
                                        <Card
                                            key={doc.doc_id}
                                            className={`${config.cardBg} border-2 ${config.border} hover:${config.glow} transition-all duration-300`}
                                        >
                                            <CardHeader>
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className={`p-3 rounded-lg ${config.color} border-2 ${config.border}`}>
                                                        <StyleIcon className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <CardTitle className="text-white text-lg font-bold">{doc.title}</CardTitle>
                                                        <div className="flex gap-2 mt-2 flex-wrap">
                                                            <Badge className={`${config.color} font-semibold px-3 py-1`}>
                                                                {config.label}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-xs border-gray-500 text-gray-200 bg-gray-800/50">
                                                                {doc.documentation_type.replace(/_/g, ' ')}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-xs border-gray-500 text-gray-200 bg-gray-800/50">
                                                                {doc.word_count} words
                                                            </Badge>
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-xs font-semibold ${
                                                                    doc.status === 'published' ? 'text-green-300 border-green-400 bg-green-900/30' :
                                                                    'text-yellow-300 border-yellow-400 bg-yellow-900/30'
                                                                }`}
                                                            >
                                                                {doc.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-gray-100 mb-4 font-medium">
                                                    Version {doc.version} • {new Date(doc.created_date).toLocaleDateString()}
                                                </p>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => viewDoc(doc)}
                                                        className="flex-1 text-white hover:text-white border-gray-600 hover:bg-gray-700"
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => downloadDoc(doc)}
                                                        className="flex-1 text-white hover:text-white border-gray-600 hover:bg-gray-700"
                                                    >
                                                        <Download className="w-4 h-4 mr-1" />
                                                        Download
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteDoc(doc.doc_id)}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
