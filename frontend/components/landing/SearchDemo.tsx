"use client";

import { Search, CornerDownRight, Clock } from "lucide-react";

export default function SearchDemo() {
  return (
    <section className="w-full bg-white py-24 px-6 border-b border-eden-primary/5">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Column: Search Bar UI Mockup */}
        <div className="relative w-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-eden-primary/5 blur-[60px] rounded-full z-0"></div>
          
          <div className="relative z-10 bg-white shadow-[0_20px_50px_rgb(0,0,0,0.08)] rounded-2xl border border-eden-primary/10 overflow-hidden">
             {/* Search Input */}
             <div className="flex items-center gap-3 px-6 py-5 border-b border-eden-primary/5 bg-neutral-50/50">
                <Search className="w-5 h-5 text-eden-text/40" />
                <span className="text-[16px] text-eden-primary font-medium flex-1">budget discussion</span>
                <div className="hidden sm:flex items-center gap-1 text-[12px] font-medium text-eden-text/40 bg-white border border-eden-primary/10 px-2 py-1 rounded">
                   <span>⌘</span><span>K</span>
                </div>
             </div>

             {/* Search Results */}
             <div className="p-3 bg-white">
                <div className="p-4 rounded-xl hover:bg-eden-bg cursor-pointer transition-colors border border-transparent hover:border-eden-accent/20 group">
                   <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded bg-indigo-50 text-eden-primary flex items-center justify-center text-[10px] font-bold">Q3</div>
                         <span className="text-[13px] font-semibold text-eden-primary">Q3 Planning Sync</span>
                      </div>
                      <span className="text-[12px] text-eden-text/50">Oct 12</span>
                   </div>
                   <p className="text-[13px] text-eden-text/70 leading-relaxed px-1">
                      ...we need to finalize the <span className="bg-amber-100 text-amber-800 px-1 rounded font-medium">budget discussion</span> before next Friday to ensure alignment across teams...
                   </p>
                </div>

                <div className="p-4 rounded-xl bg-eden-bg border border-eden-accent/20 cursor-pointer transition-colors flex flex-col relative mt-2">
                   <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded bg-purple-50 text-eden-accent flex items-center justify-center text-[10px] font-bold">MK</div>
                         <span className="text-[13px] font-semibold text-eden-primary">Marketing Kickoff</span>
                      </div>
                      <span className="text-[12px] text-eden-text/50">Sep 28</span>
                   </div>
                   <p className="text-[13px] text-eden-text/70 leading-relaxed px-1">
                      ...if we table the <span className="bg-amber-100 text-amber-800 px-1 rounded font-medium">budget discussion</span> for now, we can focus on the campaign creatives...
                   </p>
                   {/* Jump to recording indicator */}
                   <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 bg-white shadow-md border border-eden-primary/10 rounded-full pl-2 pr-3 py-1.5 animate-bounce">
                      <CornerDownRight className="w-4 h-4 text-eden-accent" />
                      <span className="text-[12px] font-semibold text-eden-primary">Jump to 14:22</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="flex flex-col gap-6">
          <h2 className="text-[28px] md:text-[32px] font-semibold text-eden-primary tracking-tight leading-[1.2]">
            Search your entire organizational memory
          </h2>

          <p className="text-[15px] text-eden-text/70 leading-relaxed">
            Stop digging through old meeting recordings. Eden Intelligence creates a searchable library of every conversation your team has ever had.
          </p>

          <div className="mt-4 flex flex-col gap-4">
             <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-eden-bg flex items-center justify-center text-eden-primary shrink-0 mt-0.5">
                   <Search className="w-4 h-4" />
                </div>
                <div>
                   <h4 className="text-[15px] font-semibold text-eden-primary mb-1">Keyword & Context Search</h4>
                   <p className="text-[13px] text-eden-text/60">Find exact phrases or contextual topics across all transcripts.</p>
                </div>
             </div>
             <div className="flex items-start gap-3 mt-2">
                <div className="w-8 h-8 rounded-lg bg-eden-bg flex items-center justify-center text-eden-accent shrink-0 mt-0.5">
                   <Clock className="w-4 h-4" />
                </div>
                <div>
                   <h4 className="text-[15px] font-semibold text-eden-primary mb-1">Jump to Exact Timestamp</h4>
                   <p className="text-[13px] text-eden-text/60">Click any search result to instantly play the audio from that exact moment.</p>
                </div>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}
