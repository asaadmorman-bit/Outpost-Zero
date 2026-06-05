import React from "react";
import { useAppContext } from "./AppContext";
import { Badge } from "@/components/ui/badge";
import { Building2, User } from "lucide-react";

export default function DemoTopbar() {
  const { user, tenantId, licenseTier } = useAppContext();
  
  return (
    <header className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
          {licenseTier === 'pro' ? '✓ Pro License' : 'Demo Mode'}
        </Badge>
        <span className="text-slate-500 text-sm">|</span>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Building2 className="w-4 h-4" />
          <span>{user?.org || 'Demo Organization'}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-white text-sm font-medium">{user?.name}</div>
          <div className="text-slate-500 text-xs">{user?.email}</div>
        </div>
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    </header>
  );
}