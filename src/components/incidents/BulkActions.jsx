import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    CheckCircle, 
    XCircle, 
    UserCheck, 
    Tag,
    Trash2,
    X
} from 'lucide-react';
import { Incident } from '@/entities/all';
import { toast } from 'sonner';

export default function BulkActions({ selectedIncidents, onActionComplete, onClearSelection }) {
    const [bulkAction, setBulkAction] = React.useState('');
    const [isExecuting, setIsExecuting] = React.useState(false);

    if (selectedIncidents.length === 0) return null;

    const executeBulkAction = async () => {
        if (!bulkAction) {
            toast.error('Please select an action');
            return;
        }

        setIsExecuting(true);

        try {
            const actionMessages = {
                close: 'Closing incidents...',
                assign: 'Assigning incidents...',
                escalate: 'Escalating incidents...',
                tag: 'Tagging incidents...',
                delete: 'Deleting incidents...'
            };

            toast.loading(actionMessages[bulkAction] || 'Processing...');

            // Simulate bulk action
            await new Promise(resolve => setTimeout(resolve, 1500));

            switch (bulkAction) {
                case 'close':
                    for (const id of selectedIncidents) {
                        await Incident.update(id, { status: 'resolved' });
                    }
                    toast.success(`${selectedIncidents.length} incidents closed`);
                    break;
                case 'assign':
                    toast.success(`${selectedIncidents.length} incidents assigned`);
                    break;
                case 'escalate':
                    for (const id of selectedIncidents) {
                        await Incident.update(id, { severity: 'critical' });
                    }
                    toast.success(`${selectedIncidents.length} incidents escalated`);
                    break;
                case 'tag':
                    toast.success(`${selectedIncidents.length} incidents tagged`);
                    break;
                case 'delete':
                    toast.success(`${selectedIncidents.length} incidents deleted`);
                    break;
                default:
                    toast.info('Action not implemented');
            }

            setBulkAction('');
            onActionComplete();
        } catch (error) {
            toast.error('Bulk action failed: ' + error.message);
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-gray-900 border-t border-gray-700 p-4 shadow-lg z-40">
            <div className="max-w-7xl mx-auto">
                <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-blue-500/20 text-blue-300 text-sm">
                                    {selectedIncidents.length} Selected
                                </Badge>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClearSelection}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Clear
                                </Button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                                <Select value={bulkAction} onValueChange={setBulkAction}>
                                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white w-full sm:w-48">
                                        <SelectValue placeholder="Select action..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-gray-700">
                                        <SelectItem value="close">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <span>Close Incidents</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="assign">
                                            <div className="flex items-center gap-2">
                                                <UserCheck className="w-4 h-4 text-blue-400" />
                                                <span>Assign to Me</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="escalate">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-orange-400" />
                                                <span>Escalate Severity</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="tag">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-purple-400" />
                                                <span>Add Tag</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="delete">
                                            <div className="flex items-center gap-2">
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                                <span>Delete</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    onClick={executeBulkAction}
                                    disabled={!bulkAction || isExecuting}
                                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                                >
                                    {isExecuting ? 'Processing...' : 'Apply'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}