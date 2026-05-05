"use client";

import Link from "next/link";
import { Mic, FileAudio } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="w-full py-24 px-6">
      <div className="max-w-[1000px] mx-auto bg-claeron-primary rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-claeron-primary via-claeron-primary to-claeron-accent/30 z-0"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-claeron-accent blur-[120px] rounded-full opacity-40 z-10"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-claeron-soft blur-[100px] rounded-full opacity-20 z-10"></div>

        <div className="relative z-20 flex flex-col items-center gap-8">
          <h2 className="text-[32px] md:text-[42px] font-semibold text-white tracking-tight leading-[1.15] max-w-2xl">
            Start capturing insights from every meeting today.
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-14 px-8 rounded-xl bg-white text-claeron-primary text-[16px] font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3">
                <Mic className="w-5 h-5" />
                Start Recording
              </button>
            </Link>
            <Link href="/auth/signup?tab=upload" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-14 px-8 rounded-xl bg-white/10 border border-white/20 text-white text-[16px] font-bold backdrop-blur-md hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-3">
                <FileAudio className="w-5 h-5" />
                Upload Recording
              </button>
            </Link>
          </div>
          
          <p className="text-white/60 text-[14px] font-medium mt-2">
            Join 2,000+ teams worldwide already using Claeron.
          </p>
        </div>
      </div>
    </section>
  );
}
