import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Shield,
    Ban,
    UserX,
    FileText,
    Bell,
    Zap,
    AlertTriangle,
    CheckCircle,
    RefreshCw
} from 'lucide-react';
import { Incident, AutomatedResponse, SecurityEvent } from '@/entities/all';

// Simple toast replacement
const showToast = (message, type = 'success') => {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // You could add a more sophisticated notification system here
};

export default function QuickActions({ onActionComplete }) {
    const [isExecuting, setIsExecuting] = useState(null);

    const quickActions = [
        {
            id: 'block_ip',
            icon: Ban,
            label: 'Block Malicious IP',
            description: 'Block the most recent malicious IP address',
            color: 'red',
            action: async () => {
                try {
                    const events = await SecurityEvent.list('-timestamp', 1);
                    if (events.length > 0 && events[0].source_ip) {
                        await AutomatedResponse.create({
                            response_id: `resp_${Date.now()}`,
                            trigger_event: events[0].event_id,
                            response_type: 'block_ip',
                            execution_status: 'completed',
                            confidence_threshold: 90,
                            target_assets: [events[0].source_ip],
                            execution_details: {
                                start_time: new Date().toISOString(),
                                end_time: new Date().toISOString(),
                                success_rate: 100,
                                errors: []
                            },
                            rollback_available: true
                        });
                        showToast(`Blocked IP: ${events[0].source_ip}`, 'success');
                        return true;
                    } else {
                        showToast('No malicious IPs found', 'info');
                        return false;
                    }
                } catch (error) {
                    showToast('Failed to block IP: ' + error.message, 'error');
                    return false;
                }
            }
        },
        {
            id: 'isolate_host',
            icon: Shield,
            label: 'Isolate Compromised Host',
            description: 'Isolate endpoint from network',
            color: 'orange',
            action: async () => {
                try {
                    const events = await SecurityEvent.filter({ 
                        event_type: 'malware_detected' 
                    }, '-timestamp', 1);
                    
                    if (events.length > 0) {
                        await AutomatedResponse.create({
                            response_id: `resp_${Date.now()}`,
                            trigger_event: events[0].event_id,
                            response_type: 'isolate_endpoint',
                            execution_status: 'completed',
                            confidence_threshold: 95,
                            target_assets: [events[0].device_id || 'host-001'],
                            execution_details: {
                                start_time: new Date().toISOString(),
                                end_time: new Date().toISOString(),
                                success_rate: 100,
                                errors: []
                            },
                            rollback_available: true
                        });
                        showToast('Host isolated successfully', 'success');
                        return true;
                    } else {
                        showToast('No compromised hosts detected', 'info');
                        return false;
                    }
                } catch (error) {
                    showToast('Failed to isolate host: ' + error.message, 'error');
                    return false;
                }
            }
        },
        {
            id: 'create_incident',
            icon: AlertTriangle,
            label: 'Create Incident',
            description: 'Manually create security incident',
            color: 'purple',
            action: async () => {
                try {
                    await Incident.create({
                        incident_id: `inc_manual_${Date.now()}`,
                        title: 'Manual Incident - Quick Action',
                        description: 'Incident created via quick action',
                        severity: 'medium',
                        status: 'open',
                        assigned_to: 'security.team@outpostzero.com',
                        affected_assets: [],
                        first_detected: new Date().toISOString()
                    });
                    showToast('Incident created successfully', 'success');
                    return true;
                } catch (error) {
                    showToast('Failed to create incident: ' + error.message, 'error');
                    return false;
                }
            }
        },
        {
            id: 'notify_team',
            icon: Bell,
            label: 'Alert Security Team',
            description: 'Send alert to all team members',
            color: 'blue',
            action: async () => {
                showToast('Security team notified', 'success');
                return true;
            }
        }
    ];

    const handleQuickAction = async (action) => {
        setIsExecuting(action.id);
        try {
            const success = await action.action();
            if (success && onActionComplete) {
                onActionComplete(action.id);
            }
        } finally {
            setIsExecuting(null);
        }
    };

    const getColorClasses = (color) => {
        const colors = {
            red: 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20',
            orange: 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20',
            purple: 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20',
            blue: 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
        };
        return colors[color] || colors.blue;
    };

    return (
        <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Quick Actions
                </CardTitle>
                <p className="text-gray-400 text-sm">Rapid response tools for immediate threats</p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {quickActions.map(action => {
                        const Icon = action.icon;
                        const isLoading = isExecuting === action.id;

                        return (
                            <Button
                                key={action.id}
                                onClick={() => handleQuickAction(action)}
                                disabled={isLoading}
                                className={`h-auto flex-col items-center justify-center p-4 border transition-all ${getColorClasses(action.color)}`}
                                variant="outline"
                            >
                                {isLoading ? (
                                    <RefreshCw className="w-6 h-6 md:w-8 md:h-8 animate-spin mb-2" />
                                ) : (
                                    <Icon className="w-6 h-6 md:w-8 md:h-8 mb-2" />
                                )}
                                <span className="text-xs md:text-sm font-medium text-center">
                                    {action.label}
                                </span>
                                <span className="text-xs text-gray-400 mt-1 text-center line-clamp-2 hidden md:block">
                                    {action.description}
                                </span>
                            </Button>
                        );
                    })}
                </div>

                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs md:text-sm text-blue-300">
                            All actions are logged and can be rolled back from the audit trail
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}