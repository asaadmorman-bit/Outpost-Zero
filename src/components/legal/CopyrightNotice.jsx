import React from 'react';
import { Shield, Lock } from 'lucide-react';

export default function CopyrightNotice({ compact = false }) {
  if (compact) {
    return (
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6358de6e2_188ec1ee-2ae7-4d9b-aacd-de581b4988ff.png" 
          alt="Cyber Dojo Solutions" 
          className="h-3 object-contain"
        />
        <span>© {new Date().getFullYear()} Cyber Dojo Solutions, LLC</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6358de6e2_188ec1ee-2ae7-4d9b-aacd-de581b4988ff.png" 
          alt="Cyber Dojo Solutions" 
          className="h-8 object-contain"
        />
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-white">Proprietary Software</span>
        </div>
      </div>
      <p className="text-sm text-gray-300 mb-2">
        © {new Date().getFullYear()} Cyber Dojo Solutions, LLC. All Rights Reserved.
      </p>
      <p className="text-xs text-gray-400 mb-3">
        This software contains proprietary technology protected by patents, 
        trade secrets, and copyright laws. Unauthorized use, reproduction, 
        or distribution is strictly prohibited.
      </p>
      <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
        <span>Patent Portfolio: 12+ Filed</span>
        <span>•</span>
        <span>International Protection: 25+ Countries</span>
      </div>
    </div>
  );
}