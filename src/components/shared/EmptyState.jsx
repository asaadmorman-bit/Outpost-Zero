import React from 'react';
import { Button } from '@/components/ui/button';
import { 
    AlertTriangle, 
    Search, 
    FileText, 
    Shield, 
    Users,
    Eye,
    Activity,
    RefreshCw,
    Plus
} from 'lucide-react';

const icons = {
    incidents: AlertTriangle,
    investigations: Search,
    reports: FileText,
    threats: Shield,
    behaviors: Users,
    intel: Eye,
    events: Activity,
    default: FileText
};

export default function EmptyState({ 
    type = 'default',
    title,
    description,
    showAction = false,
    actionLabel = 'Create New',
    onAction,
    showRefresh = false,
    onRefresh
}) {
    const Icon = icons[type] || icons.default;

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="p-4 bg-gray-800/50 rounded-full mb-4">
                <Icon className="w-12 h-12 md:w-16 md:h-16 text-gray-600" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                {title || 'No Data Available'}
            </h3>
            <p className="text-sm md:text-base text-gray-400 mb-6 max-w-md">
                {description || 'There is no data to display at this time.'}
            </p>
            <div className="flex gap-3">
                {showAction && onAction && (
                    <Button onClick={onAction} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        {actionLabel}
                    </Button>
                )}
                {showRefresh && onRefresh && (
                    <Button onClick={onRefresh} variant="outline" className="border-gray-700 text-gray-300">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                )}
            </div>
        </div>
    );
}