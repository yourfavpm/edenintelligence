'use client';

import React, { useState, useEffect } from 'react';

import { CloudLightning, FileText, Cpu, CheckSquare } from 'lucide-react';

interface Stage {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

const STAGES: Stage[] = [
  { id: 'uploading', title: 'Uploading recording', subtitle: 'Transferring file securely...', icon: CloudLightning },
  { id: 'transcribing', title: 'Transcribing conversation', subtitle: 'Converting speech directly to text...', icon: FileText },
  { id: 'summarizing', title: 'Generating meeting summary', subtitle: 'Analyzing key topics and decisions...', icon: Cpu },
  { id: 'extracting', title: 'Extracting action items', subtitle: 'Organizing tasks and owners...', icon: CheckSquare },
];

export function AILoader() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    // 4 stages, each ~2 seconds
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= STAGES.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const progress = Math.min(((currentStage + 1) / STAGES.length) * 100, 100);

  return (
    <div className="w-full max-w-md mx-auto space-y-12 animate-fade-in p-6 bg-white rounded-2xl shadow-xl border border-[#E5E7EB]">
      {/* Title section */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-[#6C63FF]/10 text-[#6C63FF] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#6C63FF]/20 relative overflow-hidden">
             <div className="absolute inset-0 bg-[#6C63FF]/5 animate-pulse" />
             <Cpu size={32} className="relative z-10 animate-pulse" />
        </div>
        <h2 className="text-[22px] font-bold text-[#1F2937] tracking-tight">Analyzing your meeting.</h2>
        <p className="text-[13px] text-neutral-500 font-medium">Eden is transcribing and extracting insights.</p>
      </div>

      {/* Progress Bar Area */}
      <div className="space-y-4">
         <div className="w-full h-1.5 bg-[#F7F8FB] rounded-full overflow-hidden">
             <div 
                className="h-full bg-gradient-to-r from-[#6C63FF] to-[#A5A0FF] transition-all duration-[2000ms] ease-linear" 
                style={{ width: `${progress}%` }} 
             />
         </div>
         <div className="flex justify-between items-center px-1">
             <span className="text-[11px] font-bold text-[#6C63FF] uppercase tracking-widest animate-pulse">
                {STAGES[currentStage].title}
             </span>
             <span className="text-[11px] font-bold text-neutral-400 font-mono">
                {Math.round(progress)}%
             </span>
         </div>
      </div>

      {/* Dynamic Stages List */}
      <div className="space-y-4">
        {STAGES.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index === currentStage;
          const isPast = index < currentStage;

          return (
            <div 
              key={stage.id} 
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-500 ${
                isActive ? 'bg-[#F7F8FB] border border-[#E5E7EB] scale-100 opacity-100' : 
                isPast ? 'opacity-50 scale-95 border border-transparent' : 
                'opacity-20 scale-95 border border-transparent'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${
                  isActive ? 'bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/20' : 
                  isPast ? 'bg-[#10B981] text-white' : 
                  'bg-neutral-100 text-neutral-400'
              }`}>
                {isPast ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                    <Icon size={18} className={isActive ? 'animate-bounce' : ''} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                  <h4 className={`text-[14px] font-bold truncate transition-colors duration-500 ${isActive ? 'text-[#1F2937]' : isPast ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {stage.title}
                  </h4>
                  <p className="text-[12px] font-medium text-neutral-400 truncate">
                      {stage.subtitle}
                  </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
