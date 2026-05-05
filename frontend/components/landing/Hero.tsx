"use client";

import Link from "next/link";
import { Mic, FileAudio, CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden pt-[120px] md:pt-[160px] pb-24 px-6 bg-white min-h-[80vh] flex items-center">
      <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Content */}
        <div className="md:col-span-5 flex flex-col gap-6" style={{ width: '100%' }}>
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-claeron-bg border border-claeron-primary/10 w-fit">
            <span className="w-2h-2 rounded-full bg-claeron-accent/80 shadow-[0_0_8px_rgba(108,99,255,0.6)]"></span>
            <span className="text-[13px] font-medium text-claeron-primary">V1 Now Available</span>
          </div>

          {/* Headline */}
          <h1 className="text-[34px] md:text-[42px] leading-[1.15] font-semibold text-claeron-primary tracking-tight">
            Turn Every Meeting Into Actionable Intelligence
          </h1>

          {/* Subheadline */}
          <p className="text-[15px] md:text-[16px] leading-relaxed text-claeron-text/70 mt-2">
            Upload recordings or record meetings live. Claeron automatically
            transcribes conversations, extracts summaries, and turns discussions
            into properly tracked action items.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-12 px-6 rounded-lg bg-gradient-to-r from-claeron-primary to-claeron-accent text-white text-[15px] font-medium shadow-md shadow-claeron-accent/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                <Mic className="w-4 h-4" />
                Start Recording
              </button>
            </Link>
            <Link href="/auth/signup?tab=upload" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-12 px-6 rounded-lg bg-white border border-claeron-primary/10 text-claeron-primary text-[15px] font-medium hover:bg-claeron-bg transition-colors flex items-center justify-center gap-2">
                <FileAudio className="w-4 h-4" />
                Upload Recording
              </button>
            </Link>
          </div>
          
          <div className="flex items-center gap-6 mt-2">
            <div className="flex items-center gap-2 text-[13px] text-claeron-text/60 font-medium">
              <CheckCircle className="w-4 h-4 text-claeron-soft" /> No credit card required
            </div>
            <div className="flex items-center gap-2 text-[13px] text-claeron-text/60 font-medium">
               <CheckCircle className="w-4 h-4 text-claeron-soft" /> 5 free meetings
            </div>
          </div>
        </div>

        {/* Right Column: Layered UI Mockup */}
        <div className="md:col-span-7 relative w-full h-[400px] md:h-[500px] ml-0 md:ml-6 mt-8 md:mt-0">
          {/* Subtle Purple Glow behind UI */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-claeron-accent/20 blur-[100px] rounded-full z-0"></div>
          
          {/* Transcripts Window (Background Layer) */}
          <div className="absolute top-[5%] left-[5%] right-[25%] bottom-[25%] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-claeron-primary/5 p-5 z-10 flex-col hidden sm:flex">
             <div className="flex items-center justify-between border-b border-claeron-primary/5 pb-3 mb-4">
                 <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                 </div>
                 <div className="text-[12px] font-medium text-claeron-text/50 uppercase tracking-wider">Transcript</div>
             </div>
             <div className="space-y-4 overflow-hidden">
                <div className="flex gap-3">
                   <div className="w-6 h-6 rounded-full bg-claeron-soft/20 flex items-center justify-center text-[10px] font-bold text-claeron-primary shrink-0">SA</div>
                   <div>
                     <div className="text-[12px] font-medium text-claeron-primary mb-1">Sarah Adams <span className="text-claeron-text/40 font-normal ml-1">0:00</span></div>
                     <div className="text-[13px] text-claeron-text/80 leading-relaxed">Let's review the new design specs for the marketing page.</div>
                   </div>
                </div>
                <div className="flex gap-3">
                   <div className="w-6 h-6 rounded-full bg-claeron-accent/20 flex items-center justify-center text-[10px] font-bold text-claeron-primary shrink-0">JD</div>
                   <div>
                     <div className="text-[12px] font-medium text-claeron-primary mb-1">John Doe <span className="text-claeron-text/40 font-normal ml-1">0:14</span></div>
                     <div className="text-[13px] text-claeron-text/80 leading-relaxed">I think we should stick to the deep blue and purple accents to ensure it feels enterprise tier. I'll get that updated tomorrow.</div>
                   </div>
                </div>
             </div>
          </div>

          {/* Action Items Window (Middle Layer) */}
          <div className="absolute top-[20%] -right-[5%] left-[45%] bottom-[10%] bg-white rounded-xl shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-claeron-primary/5 p-5 z-20 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                 <div className="text-[13px] font-semibold text-claeron-primary uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-claeron-accent"></div>
                    Action Items
                 </div>
                 <span className="text-[11px] bg-claeron-bg px-2 py-1 rounded text-claeron-text/60 font-medium">2 Pending</span>
              </div>
              <div className="space-y-3">
                 <div className="p-3 bg-claeron-bg rounded-lg border border-claeron-primary/5">
                    <div className="text-[13px] font-medium text-claeron-text mb-2">Update landing page color palette</div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-1.5 text-[11px] font-medium text-claeron-text/60">
                           <div className="w-4 h-4 rounded-full bg-claeron-accent/20 flex items-center justify-center text-[8px] text-claeron-primary">JD</div>
                           John Doe
                       </div>
                       <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-medium">Tomorrow</span>
                    </div>
                 </div>
                 <div className="p-3 bg-claeron-bg rounded-lg border border-claeron-primary/5">
                    <div className="text-[13px] font-medium text-claeron-text mb-2">Configure backend meeting bot</div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-1.5 text-[11px] font-medium text-claeron-text/60">
                           <div className="w-4 h-4 rounded-full bg-claeron-primary/10 flex items-center justify-center text-[8px] text-claeron-primary">Team</div>
                           Unassigned
                       </div>
                       <span className="text-[10px] text-claeron-text/50 px-2 py-0.5 rounded font-medium">No date</span>
                    </div>
                 </div>
              </div>
          </div>

          {/* Summary Panel (Top Layer overlapping left-bottom) */}
          <div className="absolute top-[45%] left-[0%] right-[35%] bottom-[5%] bg-white rounded-xl shadow-[0_20px_50px_rgb(0,0,0,0.12)] border border-claeron-primary/10 p-5 z-30 hidden sm:flex flex-col">
             <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded bg-claeron-primary flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">AI</span>
                </div>
                <span className="text-[13px] font-semibold text-claeron-primary uppercase tracking-wider">Executive Summary</span>
             </div>
             <p className="text-[13px] text-claeron-text/80 leading-relaxed font-medium">
                The team decided to embrace the enterprise SaaS design system, avoiding generic AI templates. The dark slate text and deep blue primary colors were explicitly approved.
             </p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
