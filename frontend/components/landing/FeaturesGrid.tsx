"use client";

import { Mic, FileAudio, Sparkles, ListTodo, Search, Bookmark } from "lucide-react";

export default function FeaturesGrid() {
  return (
    <section id="features" className="w-full bg-neutral-50 py-24 px-6 border-b border-eden-primary/5">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[28px] md:text-[32px] font-semibold text-eden-primary tracking-tight mb-4">
            Powerful workflows out of the box
          </h2>
          <p className="text-[15px] text-eden-text/70 leading-relaxed">
            Whether you want to capture conversations in real-time or upload past recordings, Eden Intelligence adapts to your process.
          </p>
        </div>

        {/* Staggered Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Large Card 1: Record Meetings Live */}
          <div className="md:col-span-6 bg-white rounded-2xl p-8 shadow-sm border border-eden-primary/10 hover:shadow-md transition-shadow group overflow-hidden relative">
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-eden-bg flex items-center justify-center text-eden-accent border border-eden-primary/5">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-[18px] font-semibold text-eden-primary">Record Meetings Live</h3>
            </div>
            <p className="text-[14px] text-eden-text/70 mb-8 relative z-10 pr-6">
              Capture in-room audio directly from your browser. Perfect for physical standups, 1-on-1s, and impromptu whiteboarding sessions.
            </p>
            {/* UI Mockup */}
            <div className="w-full h-32 bg-eden-bg rounded-xl border border-eden-primary/5 p-4 relative z-10 overflow-hidden group-hover:border-eden-accent/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[12px] font-medium text-eden-text">Recording 05:22...</span>
                 </div>
                 <div className="h-6 w-16 bg-eden-primary/5 rounded border border-eden-primary/10"></div>
              </div>
              <div className="w-full h-8 flex items-center gap-1 opacity-50">
                {[...Array(24)].map((_, i) => (
                   <div key={i} className="w-1.5 bg-eden-accent rounded-full" style={{ height: Math.max(4, Math.random() * 24) + 'px' }}></div>
                ))}
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-eden-accent/5 rounded-full blur-[40px] z-0"></div>
          </div>

          {/* Large Card 2: Upload Recordings */}
          <div className="md:col-span-6 bg-white rounded-2xl p-8 shadow-sm border border-eden-primary/10 hover:shadow-md transition-shadow group overflow-hidden relative">
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-eden-bg flex items-center justify-center text-eden-primary border border-eden-primary/5">
                <FileAudio className="w-5 h-5" />
              </div>
              <h3 className="text-[18px] font-semibold text-eden-primary">Upload Recordings</h3>
            </div>
            <p className="text-[14px] text-eden-text/70 mb-8 relative z-10 pr-6">
              Bring your own archives. Drag and drop audio and video recordings from Zoom, Teams, or anywhere else.
            </p>
            {/* UI Mockup */}
            <div className="w-full h-32 bg-eden-bg rounded-xl border border-eden-primary/5 p-4 relative z-10 flex items-center justify-center group-hover:border-eden-primary/20 transition-colors border-dashed">
              <div className="flex flex-col items-center gap-2">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-eden-primary/10 text-eden-text/40 shadow-sm">
                    <FileAudio className="w-5 h-5" />
                 </div>
                 <span className="text-[12px] font-medium text-eden-text/60">Drag and drop file here</span>
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-eden-primary/5 rounded-full blur-[40px] z-0"></div>
          </div>

          {/* Small Card 1 */}
          <div className="md:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-eden-primary/10 flex flex-col gap-3">
            <div className="w-8 h-8 rounded-lg bg-eden-bg flex items-center justify-center text-eden-accent">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-[15px] font-semibold text-eden-primary">AI Transcription</h4>
            <p className="text-[13px] text-eden-text/60 leading-relaxed">Near-instant transcription supporting 99+ languages securely.</p>
          </div>

          {/* Small Card 2 */}
          <div className="md:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-eden-primary/10 flex flex-col gap-3">
            <div className="w-8 h-8 rounded-lg bg-eden-bg flex items-center justify-center text-eden-primary">
              <ListTodo className="w-4 h-4" />
            </div>
            <h4 className="text-[15px] font-semibold text-eden-primary">Task Extraction</h4>
            <p className="text-[13px] text-eden-text/60 leading-relaxed">Pulls assigned action items and automatically tracks deadlines.</p>
          </div>

          {/* Small Card 3 */}
          <div className="md:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-eden-primary/10 flex flex-col gap-3">
            <div className="w-8 h-8 rounded-lg bg-eden-bg flex items-center justify-center text-eden-accent">
              <Search className="w-4 h-4" />
            </div>
            <h4 className="text-[15px] font-semibold text-eden-primary">Global Search</h4>
            <p className="text-[13px] text-eden-text/60 leading-relaxed">Find any conversation point across your entire organizational history.</p>
          </div>

          {/* Small Card 4 */}
          <div className="md:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-eden-primary/10 flex flex-col gap-3">
            <div className="w-8 h-8 rounded-lg bg-eden-bg flex items-center justify-center text-eden-primary">
              <Bookmark className="w-4 h-4" />
            </div>
            <h4 className="text-[15px] font-semibold text-eden-primary">Meeting Highlights</h4>
            <p className="text-[13px] text-eden-text/60 leading-relaxed">Key moments are automatically identified and separated for review.</p>
          </div>

        </div>
      </div>
    </section>
  );
}
