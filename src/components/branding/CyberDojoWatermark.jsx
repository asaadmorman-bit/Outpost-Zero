import React from 'react';

export default function CyberDojoWatermark({ position = 'bottom-right', opacity = 0.8 }) {
  const positions = {
    'bottom-right': 'fixed bottom-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'top-right': 'fixed top-4 right-4',
    'footer': 'relative'
  };

  return (
    <div 
      className={`${positions[position]} z-50 flex items-center gap-3 text-xs text-gray-400 pointer-events-none`}
      style={{ opacity }}
    >
      <img 
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6358de6e2_188ec1ee-2ae7-4d9b-aacd-de581b4988ff.png" 
        alt="Cyber Dojo Solutions" 
        className="h-6 object-contain"
      />
      <span className="font-mono text-blue-300">
        Powered by <span className="font-semibold">Cyber Dojo Solutions</span>
      </span>
    </div>
  );
}