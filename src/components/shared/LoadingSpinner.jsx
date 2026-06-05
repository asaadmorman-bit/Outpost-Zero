import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...', size = 'default' }) {
    const sizeClasses = {
        small: 'w-8 h-8',
        default: 'w-16 h-16',
        large: 'w-24 h-24'
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className={`${sizeClasses[size]} text-blue-400 animate-spin mb-4`} />
            <p className="text-gray-300 text-sm md:text-base">{message}</p>
        </div>
    );
}