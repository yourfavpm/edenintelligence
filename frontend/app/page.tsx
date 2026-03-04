'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827] font-inter selection:bg-blue-100">
      
      {/* 1. Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-[#E5E7EB] h-[72px] flex items-center">
        <div className="max-w-[1200px] mx-auto w-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center font-bold text-white text-sm">
              P
            </div>
            <span className="font-semibold text-xl tracking-tight">PraxiomNotes</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 border-x border-transparent">
            <a href="#product" className="text-sm font-medium text-[#4B5563] hover:text-[#111827] transition-colors">Product</a>
            <a href="#how-it-works" className="text-sm font-medium text-[#4B5563] hover:text-[#111827] transition-colors">How It Works</a>
            <a href="#use-cases" className="text-sm font-medium text-[#4B5563] hover:text-[#111827] transition-colors">Use Cases</a>
            <a href="#security" className="text-sm font-medium text-[#4B5563] hover:text-[#111827] transition-colors">Security</a>
            <a href="#pricing" className="text-sm font-medium text-[#4B5563] hover:text-[#111827] transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-semibold text-[#4B5563] hover:text-[#111827] px-4 py-2 transition-colors">
              Login
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all">
                Start using PraxiomNotes
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-[160px] pb-[120px] px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-[64px] font-semibold tracking-tight leading-[1.1] text-[#111827]">
              Turn conversations into structured meeting intelligence
            </h1>
            <p className="text-lg lg:text-xl text-[#4B5563] leading-relaxed max-w-[540px]">
              PraxiomNotes captures meetings, transcribes discussions, and converts conversations into clear summaries, decisions, and action items your team can rely on.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/signup">
                <Button className="h-14 px-8 text-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg shadow-sm font-semibold">
                  Start using PraxiomNotes
                </Button>
              </Link>
              <Button variant="ghost" className="h-14 px-8 text-lg text-[#111827] font-semibold border border-[#E5E7EB] rounded-lg hover:bg-[#F8FAFC]">
                Request demo
              </Button>
            </div>
          </div>

          {/* Product UI Preview */}
          <div className="relative">
            <div className="bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] shadow-2xl p-6 overflow-hidden aspect-[4/3] flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="h-2 w-32 bg-[#E5E7EB] rounded-full" />
              </div>
              <div className="space-y-4">
                <div className="w-2/3 h-4 bg-[#E5E7EB] rounded-lg" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-2">
                    <div className="w-8 h-8 rounded bg-blue-50" />
                    <div className="w-full h-2 bg-neutral-100 rounded" />
                  </div>
                  <div className="h-24 bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-2">
                    <div className="w-8 h-8 rounded bg-green-50" />
                    <div className="w-full h-2 bg-neutral-100 rounded" />
                  </div>
                  <div className="h-24 bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-2">
                    <div className="w-8 h-8 rounded bg-amber-50" />
                    <div className="w-full h-2 bg-neutral-100 rounded" />
                  </div>
                </div>
                <div className="w-full h-32 bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600" />
                    <div className="w-1/4 h-2 bg-neutral-200 rounded" />
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded" />
                  <div className="w-5/6 h-2 bg-neutral-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product Explanation Section */}
      <section id="product" className="py-[100px] bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-semibold tracking-tight text-[#111827]">Understand every meeting without manual notes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-[#E5E7EB] flex items-center justify-center text-[#2563EB]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </div>
              <h3 className="text-xl font-semibold">Accurate transcription</h3>
              <p className="text-[#4B5563] leading-relaxed">Meetings are transcribed with speaker identification and timestamps.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-[#E5E7EB] flex items-center justify-center text-[#2563EB]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-xl font-semibold">Structured summaries</h3>
              <p className="text-[#4B5563] leading-relaxed">PraxiomNotes converts conversations into concise summaries highlighting key topics and outcomes.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-[#E5E7EB] flex items-center justify-center text-[#2563EB]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <h3 className="text-xl font-semibold">Actionable insights</h3>
              <p className="text-[#4B5563] leading-relaxed">Decisions and responsibilities are automatically extracted so teams leave meetings with clear next steps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-[120px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-20 text-[#111827]">How PraxiomNotes works</h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-6 left-0 w-full h-px bg-[#E5E7EB] hidden md:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { step: 'Step 1', title: 'Record or upload meetings', text: 'PraxiomNotes captures audio from live sessions or external files.' },
                { step: 'Step 2', title: 'Accurate speech to text', text: 'Speech is converted into structured transcripts with speaker identification.' },
                { step: 'Step 3', title: 'AI insight extraction', text: 'AI extracts summaries, action items, and strategic decisions.' },
                { step: 'Step 4', title: 'Automatic distribution', text: 'Meeting insights are shared with your team automatically.' },
              ].map((item, i) => (
                <div key={i} className="relative space-y-6">
                  <div className="w-12 h-12 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center text-sm font-semibold text-[#2563EB] relative z-10 shadow-sm">
                    {i + 1}
                  </div>
                  <div className="space-y-2">
                    <span className="text-[12px] font-bold text-[#6B7280] uppercase tracking-widest">{item.step}</span>
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                    <p className="text-sm text-[#4B5563] leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Product Capabilities Section */}
      <section className="py-[120px] bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-20 text-[#111827]">Built for teams that rely on accurate decisions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Speaker diarization', text: 'Automatically separate and label individual voices across discussions.' },
              { title: 'Structured summaries', text: 'Transform hour-long meetings into 5-minute actionable executive summaries.' },
              { title: 'Decision detection', text: 'Never miss a commitment. PraxiomNotes flags all decisions made in real-time.' },
              { title: 'Action item extraction', text: 'Automatic task assignment with owners and context pulled directly from the audio.' },
              { title: 'Searchable meeting archive', text: 'A central library for all team knowledge. Search across every conversation.' },
              { title: 'Exportable transcripts', text: 'Download or sync transcripts and insights to your existing CRM or documentation hex.' },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm hover:border-[#CBD5E1] transition-all">
                <h4 className="text-lg font-semibold mb-3">{feature.title}</h4>
                <p className="text-sm text-[#4B5563] leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Workflow Benefits Section */}
      <section className="py-[120px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-20 text-[#111827]">Replace manual meeting notes with structured intelligence</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-12 lg:border-r border-[#E5E7EB] bg-white">
              <h4 className="text-lg font-semibold mb-8 text-[#6B7280] uppercase tracking-wider text-sm">Traditional meetings</h4>
              <ul className="space-y-6">
                {['Manual note taking', 'Important details missed', 'Unclear responsibilities', 'Decisions forgotten'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-[#4B5563] font-medium">
                    <div className="w-5 h-5 rounded-full border border-red-200 bg-red-50 flex items-center justify-center">
                      <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-12 bg-[#F8FAFC]">
              <h4 className="text-lg font-semibold mb-8 text-[#2563EB] uppercase tracking-wider text-sm">With PraxiomNotes</h4>
              <ul className="space-y-6">
                {['Automatic transcription', 'Structured summaries', 'Clear ownership of tasks', 'Persistent meeting knowledge'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-[#111827] font-medium">
                    <div className="w-5 h-5 rounded-full border border-green-200 bg-green-50 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Use Case Section */}
      <section id="use-cases" className="py-[120px] bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-20 text-[#111827]">Used across critical team conversations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
              <h4 className="text-xl font-semibold">Leadership meetings</h4>
              <p className="text-[#4B5563] text-sm leading-relaxed font-medium">Capture and track strategic decisions across executive discussions to ensure alignment across the organization.</p>
            </div>
            <div className="bg-white p-10 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
              <h4 className="text-xl font-semibold">Product development</h4>
              <p className="text-[#4B5563] text-sm leading-relaxed font-medium">Ensure product discussions, technical constraints, and requirements are documented with 100% accuracy.</p>
            </div>
            <div className="bg-white p-10 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
              <h4 className="text-xl font-semibold">Customer conversations</h4>
              <p className="text-[#4B5563] text-sm leading-relaxed font-medium">Extract voice-of-customer insights from sales calls and user interviews without manual synthesis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Trust Section */}
      <section id="security" className="py-[120px]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-[#111827] mb-20 font-medium">Built for reliability</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: 'Secure infrastructure', text: 'Encrypted storage at rest and in transit.' },
              { title: 'Private by design', text: 'You control all meeting and team data.' },
              { title: 'Enterprise-grade', text: 'Built on a global, redundant architecture.' },
              { title: 'Audit ready', text: 'Complete logs of all meeting intelligence.' },
            ].map((item, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-[#2563EB]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                </div>
                <h5 className="font-semibold text-[#111827]">{item.title}</h5>
                <p className="text-sm text-[#4B5563] font-medium leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Testimonials Section */}
      <section className="py-[120px] bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-20 text-[#111827]">Trusted by teams that rely on accurate decisions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "PraxiomNotes eliminated the need for manual meeting notes across our product team. We now have a reliable record of decisions.", name: "Sarah Chen", role: "Head of Product", company: "Aether Systems" },
              { quote: "The accuracy of the transcription and automated summaries is unmatched. It has saved us at least 10 hours a week.", name: "James Miller", role: "Chief of Staff", company: "Stratford & Co." },
              { quote: "Meeting documentation used to be a point of friction. Now, insights are distributed before the next meeting even starts.", name: "Linda Rodriguez", role: "Operations Lead", company: "NexGen Logistics" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-2xl border border-[#E5E7EB] flex flex-col justify-between shadow-sm">
                <p className="text-[#4B5563] italic leading-relaxed font-medium">"{item.quote}"</p>
                <div className="mt-8 pt-8 border-t border-[#E5E7EB]">
                  <p className="font-semibold text-[#111827]">{item.name}</p>
                  <p className="text-sm text-[#6B7280]">{item.role}, {item.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Final Call-to-Action Section */}
      <section className="py-[120px] bg-[#111827] text-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight">Bring structure to every meeting</h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Replace fragmented meeting notes with reliable meeting intelligence your team can act on.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/auth/signup">
              <Button className="h-14 px-8 text-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg shadow-xl shadow-blue-500/10 font-semibold border-none">
                Start using PraxiomNotes
              </Button>
            </Link>
            <Button className="h-14 px-8 text-lg bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 font-semibold transition-all backdrop-blur-sm">
              Request demo
            </Button>
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="py-[100px] bg-[#111827] text-[#9CA3AF] border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-white text-sm border border-white/10">
                P
              </div>
              <span className="font-semibold text-xl tracking-tight text-white">PraxiomNotes</span>
            </div>
            <p className="text-sm leading-relaxed max-w-[240px]">
              Meeting intelligence infrastructure for teams that rely on accurate decisions.
            </p>
          </div>

          <div className="space-y-6">
            <h6 className="text-xs font-bold uppercase tracking-widest text-white">Product</h6>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h6 className="text-xs font-bold uppercase tracking-widest text-white">Company</h6>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h6 className="text-xs font-bold uppercase tracking-widest text-white">Resources</h6>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-[1200px] mx-auto px-6 pt-12 mt-20 border-t border-white/5 flex justify-between items-center text-xs text-[#4B5563] font-medium tracking-wide">
          <span>&copy; 2026 PraxiomNotes. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#9CA3AF] transition-colors">Twitter</a>
            <a href="#" className="hover:text-[#9CA3AF] transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
