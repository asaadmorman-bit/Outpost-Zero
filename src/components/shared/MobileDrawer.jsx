import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function MobileDrawer({ 
    trigger, 
    title, 
    description, 
    children,
    side = 'right',
    open,
    onOpenChange 
}) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
            <SheetContent 
                side={side} 
                className="bg-gray-900 border-gray-700 w-full sm:max-w-md overflow-y-auto"
            >
                <SheetHeader className="text-left">
                    <SheetTitle className="text-white">{title}</SheetTitle>
                    {description && (
                        <SheetDescription className="text-gray-400">
                            {description}
                        </SheetDescription>
                    )}
                </SheetHeader>
                <div className="mt-6">
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    );
}