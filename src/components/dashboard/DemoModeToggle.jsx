import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Zap, AlertTriangle } from 'lucide-react';

export default function DemoModeToggle({ isLiveDemo, onToggle }) {
    return (
        <div className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2">
                {isLiveDemo ? (
                    <Zap className="w-5 h-5 text-red-400 animate-pulse" />
                ) : (
                    <AlertTriangle className="w-5 h-5 text-gray-500" />
                )}
                <Label htmlFor="demo-mode" className="text-sm font-medium text-white cursor-pointer">
                    Live Demo Mode
                </Label>
            </div>
            <Switch
                id="demo-mode"
                checked={isLiveDemo}
                onCheckedChange={onToggle}
                className="data-[state=checked]:bg-red-600"
            />
        </div>
    );
}