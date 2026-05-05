"use client";

import { Calendar, Users, Video } from "lucide-react";

export default function ComingSoon() {
  return (
    <section className="w-full bg-white py-24 px-6 border-b border-claeron-primary/5 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        
        {/* Left Column: Content */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-claeron-bg border border-claeron-primary/10 w-fit">
            <span className="text-[13px] font-medium text-claeron-accent tracking-widest uppercase">Coming Soon</span>
          </div>

          <h2 className="text-[28px] md:text-[32px] font-semibold text-claeron-primary tracking-tight leading-[1.2]">
            Meetings That Record Themselves
          </h2>

          <p className="text-[15px] text-claeron-text/70 leading-relaxed">
            Soon, you'll be able to connect your calendar or paste a meeting link directly into Claeron. Our meeting bot will automatically join the call, record the discussion, and generate insights without you lifting a finger.
          </p>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 text-[14px] font-medium text-claeron-text/80">
              <Calendar className="w-4 h-4 text-claeron-accent" />
              Calendar Sync
            </div>
            <div className="flex items-center gap-2 text-[14px] font-medium text-claeron-text/80">
              <Video className="w-4 h-4 text-claeron-accent" />
              Auto-Join Links
            </div>
          </div>
        </div>

        {/* Right Column: Calendar Bot UI Mockup */}
        <div className="relative w-full h-[350px] md:h-[400px]">
          {/* Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-claeron-accent/20 blur-[80px] rounded-full z-0"></div>

          {/* Main Calendar Card */}
          <div className="absolute top-[10%] left-[5%] right-[5%] bg-white rounded-xl shadow-lg border border-claeron-primary/10 p-5 z-10 overflow-hidden">
            <div className="flex items-center justify-between border-b border-claeron-primary/5 pb-4 mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                    <Calendar className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="text-[15px] font-semibold text-claeron-primary">Q3 Product Review</h4>
                    <p className="text-[13px] text-claeron-text/50">Today, 2:00 PM - 3:00 PM</p>
                 </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-claeron-bg rounded-full text-[12px] font-medium text-claeron-text/60">
                 <Video className="w-3.5 h-3.5" />
                 Google Meet
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <Users className="w-4 h-4 text-claeron-text/40" />
                 <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-claeron-primary/10 flex items-center justify-center text-[10px] font-medium text-claeron-primary">SA</div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-claeron-accent/10 flex items-center justify-center text-[10px] font-medium text-claeron-accent">JD</div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center text-[10px] font-medium text-claeron-text/50">+3</div>
                 </div>
                 <span className="text-[13px] text-claeron-text/60 ml-2">5 Guests</span>
              </div>

              {/* Bot Join Status */}
              <div className="mt-4 p-4 rounded-lg border border-claeron-accent/20 bg-claeron-accent/5 relative overflow-hidden">
                 {/* Shimmer effect */}
                 <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-0"></div>
                 <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-claeron-accent flex items-center justify-center shadow-sm">
                          <span className="text-[12px] font-bold text-white">E</span>
                       </div>
                       <div>
                          <p className="text-[14px] font-medium text-claeron-primary">Claeron Bot</p>
                          <p className="text-[12px] text-claeron-accent">Waiting to join meeting...</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
