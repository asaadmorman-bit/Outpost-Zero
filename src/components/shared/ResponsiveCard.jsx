import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ResponsiveCard({ children, className, ...props }) {
    return (
        <Card 
            className={cn(
                "bg-gray-800/50 border-gray-700",
                className
            )}
            {...props}
        >
            {children}
        </Card>
    );
}