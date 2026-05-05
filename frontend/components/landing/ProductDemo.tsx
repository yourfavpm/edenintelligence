"use client";

import { useState } from "react";
import { MessageSquare, ListTodo, FileText, CheckCircle } from "lucide-react";

export default function ProductDemo() {
  const [activeTab, setActiveTab] = useState<"transcript" | "summary" | "actions">("transcript");

  return (
    <section className="w-full bg-white py-24 px-6 border-b border-claeron-primary/5">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Left Column: Feature Explanation & Tabs */}
        <div className="md:col-span-5 flex flex-col gap-8">
          <div>
            <h2 className="text-[28px] md:text-[32px] font-semibold text-claeron-primary tracking-tight mb-4 leading-[1.2]">
              Everything you need to run better meetings
            </h2>
            <p className="text-[15px] text-claeron-text/70 leading-relaxed">
              Claeron captures the full context of your conversations, automatically distilling hours of audio into searchable data, instant summaries, and trackable action items.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Tab 1 */}
            <button
              onClick={() => setActiveTab("transcript")}
              className={`p-4 rounded-xl border transition-all duration-200 text-left flex items-start gap-4 ${
                activeTab === "transcript"
                  ? "bg-claeron-bg border-claeron-accent/20 shadow-sm"
                  : "bg-transparent border-transparent hover:bg-neutral-50"
              }`}
            >
              <div className={`mt-0.5 ${activeTab === "transcript" ? "text-claeron-accent" : "text-claeron-text/40"}`}>
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-[15px] font-semibold mb-1 ${activeTab === "transcript" ? "text-claeron-primary" : "text-claeron-text"}`}>
                  Speaker-Aware Transcripts
                </h3>
                <p className="text-[14px] text-claeron-text/60 leading-relaxed">
                  Automatic transcription with speaker detection. Click any word to jump to that exact moment in the audio.
                </p>
              </div>
            </button>

            {/* Tab 2 */}
            <button
              onClick={() => setActiveTab("summary")}
              className={`p-4 rounded-xl border transition-all duration-200 text-left flex items-start gap-4 ${
                activeTab === "summary"
                  ? "bg-claeron-bg border-claeron-accent/20 shadow-sm"
                  : "bg-transparent border-transparent hover:bg-neutral-50"
              }`}
            >
              <div className={`mt-0.5 ${activeTab === "summary" ? "text-claeron-accent" : "text-claeron-text/40"}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-[15px] font-semibold mb-1 ${activeTab === "summary" ? "text-claeron-primary" : "text-claeron-text"}`}>
                  Automated Summaries
                </h3>
                <p className="text-[14px] text-claeron-text/60 leading-relaxed">
                  Executive summaries generated instantly. No more spending 30 minutes writing meeting notes.
                </p>
              </div>
            </button>

            {/* Tab 3 */}
            <button
              onClick={() => setActiveTab("actions")}
              className={`p-4 rounded-xl border transition-all duration-200 text-left flex items-start gap-4 ${
                activeTab === "actions"
                  ? "bg-claeron-bg border-claeron-accent/20 shadow-sm"
                  : "bg-transparent border-transparent hover:bg-neutral-50"
              }`}
            >
              <div className={`mt-0.5 ${activeTab === "actions" ? "text-claeron-accent" : "text-claeron-text/40"}`}>
                <ListTodo className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-[15px] font-semibold mb-1 ${activeTab === "actions" ? "text-claeron-primary" : "text-claeron-text"}`}>
                  Action Item Extraction
                </h3>
                <p className="text-[14px] text-claeron-text/60 leading-relaxed">
                  Tasks are automatically extracted and assigned to team members securely.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive UI Preview */}
        <div className="md:col-span-7 bg-claeron-bg border border-claeron-primary/10 rounded-2xl p-6 md:p-8 h-[450px] shadow-sm flex flex-col relative overflow-hidden">
          
          {/* Header Mockup */}
          <div className="flex items-center justify-between border-b border-claeron-primary/5 pb-4 mb-6 relative z-10 w-full">
            <div className="space-y-1">
              <div className="h-4 w-48 bg-claeron-text/10 rounded"></div>
              <div className="h-3 w-32 bg-claeron-text/5 rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-white border border-claeron-primary/10 rounded-full"></div>
              <div className="h-8 w-24 bg-claeron-primary/5 border border-claeron-primary/10 rounded-lg"></div>
            </div>
          </div>

          <div className="relative w-full h-full">
            {/* Transcript Preview */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === "transcript" ? "opacity-100 z-20" : "opacity-0 z-0 pointer-events-none"}`}>
              <div className="bg-white rounded-xl shadow-sm border border-claeron-primary/5 p-5 h-full space-y-5 overflow-hidden">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-claeron-primary flex items-center justify-center text-[12px] font-semibold shrink-0">SA</div>
                  <div>
                    <div className="text-[13px] font-semibold text-claeron-primary mb-1">Sarah Adams <span className="text-claeron-text/40 font-normal text-[12px] ml-2">0:00</span></div>
                    <p className="text-[14px] text-claeron-text/80 leading-relaxed">Okay everyone, let's look at the product roadmap for Q3. We need to prioritize the integration with tracking systems.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-claeron-accent flex items-center justify-center text-[12px] font-semibold shrink-0">JD</div>
                  <div className="bg-claeron-bg p-2 -m-2 rounded-lg border border-claeron-primary/5">
                    <div className="text-[13px] font-semibold text-claeron-primary mb-1">John Doe <span className="text-claeron-text/40 font-normal text-[12px] ml-2">1:15</span></div>
                    <p className="text-[14px] text-claeron-text/80 leading-relaxed">I agree. I will start outlining the API requirements by <span className="bg-amber-100 text-amber-800 px-1 rounded">this Friday</span>.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[12px] font-semibold shrink-0">EK</div>
                  <div>
                    <div className="text-[13px] font-semibold text-claeron-primary mb-1">Emily K. <span className="text-claeron-text/40 font-normal text-[12px] ml-2">1:42</span></div>
                    <p className="text-[14px] text-claeron-text/80 leading-relaxed">Perfect. Our decision then is to push the UI redesign to Q4 and focus on API performance.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Preview */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === "summary" ? "opacity-100 z-20" : "opacity-0 z-0 pointer-events-none"}`}>
              <div className="bg-white rounded-xl shadow-sm border border-claeron-primary/5 p-6 h-full space-y-6">
                <div>
                  <h4 className="text-[12px] font-bold text-claeron-text/50 uppercase tracking-widest mb-3">Executive Summary</h4>
                  <p className="text-[14px] text-claeron-text/80 leading-relaxed bg-claeron-bg p-4 rounded-lg">
                    The Q3 roadmap meeting concluded with a strategic shift to prioritize API integration and backend performance over frontend UI alterations. The team agreed that data tracking is the most critical bottleneck for enterprise clients.
                  </p>
                </div>
                <div>
                  <h4 className="text-[12px] font-bold text-claeron-text/50 uppercase tracking-widest mb-3">Key Decisions</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-[14px] text-claeron-text/80">
                      <CheckCircle className="w-5 h-5 text-claeron-accent shrink-0 mt-0.5" />
                      Delay the main UI overhaul until Q4 2026.
                    </li>
                    <li className="flex items-start gap-3 text-[14px] text-claeron-text/80">
                      <CheckCircle className="w-5 h-5 text-claeron-accent shrink-0 mt-0.5" />
                      Allocate 2 additional engineers to the tracking systems API squad.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions Preview */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === "actions" ? "opacity-100 z-20" : "opacity-0 z-0 pointer-events-none"}`}>
              <div className="bg-white rounded-xl shadow-sm border border-claeron-primary/5 p-6 h-full flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-claeron-primary/5 pb-3">
                  <h4 className="text-[14px] font-semibold text-claeron-primary">Action Items</h4>
                  <span className="text-[12px] font-medium text-claeron-text/50">3 Total</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border border-claeron-primary/10 hover:border-claeron-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border-2 border-claeron-text/20"></div>
                    <span className="text-[14px] font-medium text-claeron-primary">Outline API requirements</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className="text-[12px] font-medium px-2 py-1 bg-amber-50 text-amber-600 rounded">Friday</span>
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-claeron-accent">JD</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-claeron-primary/10 hover:border-claeron-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border-2 border-claeron-text/20"></div>
                    <span className="text-[14px] font-medium text-claeron-primary">Reassign 2 engineers to API squad</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className="text-[12px] font-medium px-2 py-1 bg-claeron-bg text-claeron-text/60 rounded">No date</span>
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">SA</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-claeron-primary/10 hover:border-claeron-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border-2 border-claeron-text/20"></div>
                    <span className="text-[14px] font-medium text-claeron-primary">Update Jira roadmap to reflect Q4 UI</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className="text-[12px] font-medium px-2 py-1 bg-claeron-bg text-claeron-text/60 rounded">No date</span>
                    <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-500">EK</div>
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
