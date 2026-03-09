"use client";

import { Building2, Command, Hexagon, Component, Layers, Globe } from "lucide-react";

export default function SocialProof() {
  return (
    <section className="w-full bg-neutral-50 py-12 border-y border-eden-primary/5">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-center text-[14px] font-medium text-eden-text/50 uppercase tracking-widest mb-8">
          Trusted by teams that run productive meetings
        </p>

        {/* Logos container with horizontal scrolling on mobile */}
        <div className="flex items-center justify-start md:justify-center gap-8 md:gap-16 overflow-x-auto pb-4 md:pb-0 scrollbar-hide opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          
          <div className="flex items-center gap-2 shrink-0">
            <Command className="w-6 h-6 text-eden-text" />
            <span className="text-[18px] font-bold text-eden-text tracking-tight">Acme Corp</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Globe className="w-6 h-6 text-eden-text" />
            <span className="text-[18px] font-bold text-eden-text tracking-tight">GlobalNet</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Hexagon className="w-6 h-6 text-eden-text" />
            <span className="text-[18px] font-bold text-eden-text tracking-tight">Nexus</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Layers className="w-6 h-6 text-eden-text" />
            <span className="text-[18px] font-bold text-eden-text tracking-tight">StackFlow</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Component className="w-6 h-6 text-eden-text" />
            <span className="text-[18px] font-bold text-eden-text tracking-tight">Forge</span>
          </div>
          
        </div>
      </div>
    </section>
  );
}
