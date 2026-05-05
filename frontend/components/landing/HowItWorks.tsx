"use client";

import { Mic, BrainCircuit, ListTodo } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="w-full bg-neutral-50 py-24 px-6 border-b border-claeron-primary/5">
      <div className="max-w-[1200px] mx-auto text-center">
        <h2 className="text-[28px] md:text-[32px] font-semibold text-claeron-primary tracking-tight mb-16">
          How Claeron Works
        </h2>

        {/* Horizontal Timeline (Stacks vertically on Mobile) */}
        <div className="flex flex-col md:flex-row relative z-10">
          
          {/* Step 1 */}
          <div className="flex-1 flex flex-col items-center relative group px-4">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[28px] left-[50%] right-[-50%] h-[2px] bg-claeron-primary/5 -z-10 group-hover:bg-claeron-accent/20 transition-colors"></div>
            
            <div className="w-14 h-14 rounded-full bg-white border-2 border-claeron-primary/10 shadow-sm flex items-center justify-center text-claeron-primary mb-6 transition-transform group-hover:scale-110 duration-300">
              <Mic className="w-6 h-6" />
            </div>
            
            <span className="text-[12px] font-bold text-claeron-accent tracking-widest uppercase mb-2">Step 1</span>
            <h3 className="text-[18px] font-semibold text-claeron-primary mb-3">Record or Upload</h3>
            <p className="text-[14px] text-claeron-text/70 leading-relaxed text-center max-w-[260px]">
              Capture your meeting directly in the browser or upload an existing recording file securely.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex-1 flex flex-col items-center relative group px-4 mt-12 md:mt-0">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[28px] left-[50%] right-[-50%] h-[2px] bg-claeron-primary/5 -z-10 group-hover:bg-claeron-accent/20 transition-colors"></div>
            
            <div className="w-14 h-14 rounded-full bg-claeron-primary text-white shadow-md shadow-claeron-primary/20 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300">
              <BrainCircuit className="w-6 h-6" />
            </div>
            
            <span className="text-[12px] font-bold text-claeron-accent tracking-widest uppercase mb-2">Step 2</span>
            <h3 className="text-[18px] font-semibold text-claeron-primary mb-3">AI Analyzes Audio</h3>
            <p className="text-[14px] text-claeron-text/70 leading-relaxed text-center max-w-[260px]">
              Our engine processes the conversation, identifying speakers and converting speech to highly accurate text.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex-1 flex flex-col items-center relative group px-4 mt-12 md:mt-0">
            <div className="w-14 h-14 rounded-full bg-white border-2 border-claeron-primary/10 shadow-sm flex items-center justify-center text-claeron-primary mb-6 transition-transform group-hover:scale-110 duration-300">
              <ListTodo className="w-6 h-6 text-claeron-accent" />
            </div>
            
            <span className="text-[12px] font-bold text-claeron-accent tracking-widest uppercase mb-2">Step 3</span>
            <h3 className="text-[18px] font-semibold text-claeron-primary mb-3">Extract Insights</h3>
            <p className="text-[14px] text-claeron-text/70 leading-relaxed text-center max-w-[260px]">
              Get an executive summary, key decisions, and tracked action items instantly organized in your dashboard.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
