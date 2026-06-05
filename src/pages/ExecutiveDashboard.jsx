
import React, { useState, useEffect } from "react";
import { ExecutiveMetrics, BusinessRiskMetrics } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    TrendingUp, 
    TrendingDown, 
    Shield, 
    DollarSign, 
    AlertTriangle,
    CheckCircle,
    Activity // Replaced Clock icon from original code as per outline's import changes
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts"; // Added Legend as per outline
import BoardReportGenerator from "../components/executive/BoardReportGenerator"; // New component import

export default function ExecutiveDashboard() {
    const [metrics, setMetrics] = useState(null);
    // Removed businessRisk, incidents, and events state variables as per outline
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadMetrics(); // Renamed from loadExecutiveData as per outline
    }, []);

    // Re-defined formatCurrency as it is used in one of the 'kept' cards (Estimated Breach Cost)
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1 // Corrected typo from maximumFranchments
        }).format(value);
    };

    // Removed getTrendIcon, getTrendColor, getRiskLevel as they are no longer used in the updated JSX structure.

    const loadMetrics = async () => { // Renamed from loadExecutiveData
        setIsLoading(true);
        try {
            // Updated Promise.all to only fetch ExecutiveMetrics as per outline
            const data = await ExecutiveMetrics.list("-timestamp", 1);

            if (data && data.length > 0) {
                setMetrics(data[0]);
            } else {
                // Mock data for demonstration as specified in the outline
                setMetrics({
                    business_risk_score: 45,
                    financial_metrics: {
                        estimated_breach_cost: 5200000,
                        security_investment_roi: 285,
                        compliance_fine_risk: 150000
                    },
                    operational_metrics: {
                        mttr_hours: 2.5,
                        automation_rate: 78,
                        false_positive_rate: 12
                    },
                    compliance_metrics: {
                        overall_compliance_score: 87,
                        frameworks_tracked: [
                            { name: 'CMMC', score: 92 },
                            { name: 'ISO 27001', score: 85 },
                            { name: 'SOC 2', score: 88 }
                        ],
                        audit_readiness: 85
                    },
                    trend_analysis: {
                        month_over_month: -5,
                        quarter_over_quarter: -12,
                        year_over_year: -18
                    },
                    peer_comparison: {
                        industry_average_risk: 62,
                        industry_percentile: 75
                    }
                });
            }
        } catch (error) {
            console.error("Error loading metrics:", error);
            // Fallback to mock data on error as well, mirroring original behavior
            setMetrics({
                business_risk_score: 45,
                financial_metrics: {
                    estimated_breach_cost: 5200000,
                    security_investment_roi: 285,
                    compliance_fine_risk: 150000
                },
                operational_metrics: {
                    mttr_hours: 2.5,
                    automation_rate: 78,
                    false_positive_rate: 12
                },
                compliance_metrics: {
                    overall_compliance_score: 87,
                    frameworks_tracked: [
                        { name: 'CMMC', score: 92 },
                        { name: 'ISO 27001', score: 85 },
                        { name: 'SOC 2', score: 88 }
                    ],
                    audit_readiness: 85
                },
                trend_analysis: {
                    month_over_month: -5,
                    quarter_over_quarter: -12,
                    year_over_year: -18
                },
                peer_comparison: {
                    industry_average_risk: 62,
                    industry_percentile: 75
                }
            });
        }
        setIsLoading(false);
    };

    // Updated isLoading block with a new spinner as per outline
    if (isLoading) {
        return (
            <div className="min-h-screen p-8 flex items-center justify-center" style={{ background: 'var(--primary-bg)' }}>
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // New: If no metrics available after loading, display a message as per outline
    if (!metrics) {
        return (
            <div className="min-h-screen p-8" style={{ background: 'var(--primary-bg)' }}>
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-6">Executive Dashboard</h1>
                    <Card className="bg-gray-800/50 border-gray-700">
                        <CardContent className="p-12 text-center">
                            <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Metrics Available</h3>
                            <p className="text-gray-400">Executive metrics will appear here once data is collected.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Inline risk color logic as specified in the outline for the Business Risk card
    const riskColor = metrics.business_risk_score > 70 ? 'text-red-400' :
        metrics.business_risk_score > 50 ? 'text-yellow-400' : 'text-green-400';

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
            <div className="max-w-7xl mx-auto">
                {/* NEW: Dashboard Header as per outline */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Executive Dashboard</h1>
                    <p className="text-gray-300">Strategic security posture and business risk overview</p>
                </div>

                {/* Key Risk Metrics - REVISED structure */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {/* NEW: Business Risk Score Card (as per outline) */}
                    <Card className="bg-gray-800/50 border-gray-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-sm">Business Risk</span>
                                <Shield className={`w-5 h-5 ${riskColor}`} />
                            </div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className={`text-4xl font-bold ${riskColor}`}>
                                    {metrics.business_risk_score}
                                </span>
                                <span className="text-gray-500 text-sm">/100</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                {metrics.trend_analysis.month_over_month < 0 ? (
                                    <>
                                        <TrendingDown className="w-4 h-4 text-green-400" />
                                        <span className="text-green-400">
                                            {Math.abs(metrics.trend_analysis.month_over_month)}% vs last month
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingUp className="w-4 h-4 text-red-400" />
                                        <span className="text-red-400">
                                            +{metrics.trend_analysis.month_over_month}% vs last month
                                        </span>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* KEPT EXISTING CODE: Estimated Breach Cost (as specified by outline) */}
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <DollarSign className="w-8 h-8 text-green-400" />
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                                    ROI {metrics.financial_metrics.security_investment_roi}%
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-400 mb-2">
                                {formatCurrency(metrics.financial_metrics.estimated_breach_cost)}
                            </div>
                            <p className="text-sm text-gray-300 mb-3">Estimated Breach Cost</p>
                            <p className="text-xs text-gray-400">
                                Based on current risk posture
                            </p>
                        </CardContent>
                    </Card>

                    {/* KEPT EXISTING CODE: Mean Time to Resolve (Icon changed from Clock to Activity as per outline's import changes) */}
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <Activity className="w-8 h-8 text-blue-400" /> {/* Replaced Clock icon */}
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                                    Industry Leading
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-400 mb-2">
                                {metrics.operational_metrics.mttr_hours}h
                            </div>
                            <p className="text-sm text-gray-300 mb-3">Mean Time to Resolve</p>
                            <p className="text-xs text-gray-400">
                                Industry avg: 4.2h
                            </p>
                        </CardContent>
                    </Card>

                    {/* KEPT EXISTING CODE: Active Frameworks (as specified by outline) */}
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CheckCircle className="w-8 h-8 text-purple-400" />
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                                    {metrics.compliance_metrics.overall_compliance_score}%
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-400 mb-2">
                                {metrics.compliance_metrics.frameworks_tracked.length}
                            </div>
                            <p className="text-sm text-gray-300 mb-3">Active Frameworks</p>
                            <p className="text-xs text-gray-400">
                                Audit ready: {metrics.compliance_metrics.audit_readiness}%
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* NEW: Board Report Generator component as per outline */}
                <div className="mb-8">
                    <BoardReportGenerator 
                        businessRiskScore={metrics.business_risk_score}
                        financialMetrics={metrics.financial_metrics}
                        operationalMetrics={metrics.operational_metrics}
                        complianceMetrics={metrics.compliance_metrics}
                        trendData={metrics.trend_analysis}
                    />
                </div>

                {/* REMOVED: Charts Row section (LineChart and Compliance Progress) as per outline */}
                {/* REMOVED: Key Insights section (Strong Areas, Areas for Improvement, Recommended Actions) as per outline */}
            </div>
        </div>
    );
}
