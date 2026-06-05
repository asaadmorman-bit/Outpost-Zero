import React from 'react';
import { Lock, Code, Zap } from 'lucide-react';

export default function ProprietaryHeader() {
  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-purple-500/30 px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4 text-xs">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6358de6e2_188ec1ee-2ae7-4d9b-aacd-de581b4988ff.png" 
            alt="Cyber Dojo Solutions" 
            className="h-4 object-contain"
          />
          <div className="flex items-center gap-1 text-purple-300">
            <Lock className="w-3 h-3" />
            <span>PROPRIETARY</span>
          </div>
          <div className="flex items-center gap-1 text-blue-300">
            <Code className="w-3 h-3" />
            <span>Patent Pending Technology</span>
          </div>
          <div className="flex items-center gap-1 text-green-300">
            <Zap className="w-3 h-3" />
            <span>Cyber Dojo Solutions, LLC</span>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          Build {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, '0')}.{String(new Date().getDate()).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}