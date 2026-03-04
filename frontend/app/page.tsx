'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui';

// =============================================================================
// PraxiomNotes - Editorial Landing Page
// ===================================
// A premium, intentional, and structured design following a "product story"
// approach. Focuses on Inter typography, whitespace, and product-focused visuals.
// =============================================================================

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-white text-[#111827] font-inter selection:bg-blue-100 antialiased">
      
      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] h-16' : 'bg-transparent h-20'
      } flex items-center`}>
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <img src="/logo.png" alt="Logo" className="h-11 w-auto transition-transform group-hover:scale-105" />
          </Link>
          
          <div className="hidden lg:flex items-center gap-10">
            <a href="#vision" className="text-[13px] font-medium text-[#4B5563] hover:text-[#111827] transition-colors uppercase tracking-widest">Our Goal</a>
            <a href="#capabilities" className="text-[13px] font-medium text-[#4B5563] hover:text-[#111827] transition-colors uppercase tracking-widest">Features</a>
            <a href="#workflow" className="text-[13px] font-medium text-[#4B5563] hover:text-[#111827] transition-colors uppercase tracking-widest">How it Works</a>
            <a href="#trust" className="text-[13px] font-medium text-[#4B5563] hover:text-[#111827] transition-colors uppercase tracking-widest">Trust</a>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <Link href="/auth/login" className="text-sm font-semibold text-[#4B5563] hover:text-[#111827] transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-[#111827] hover:bg-neutral-800 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-xl shadow-black/5">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-[#111827] relative z-[60]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-white z-[100] lg:hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
          <div className="flex flex-col h-full pt-32 px-10 space-y-10">
            <div className="flex flex-col space-y-8">
              <a href="#vision" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-semibold tracking-tighter text-[#111827]">Our Goal</a>
              <a href="#capabilities" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-semibold tracking-tighter text-[#111827]">Features</a>
              <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-semibold tracking-tighter text-[#111827]">How it Works</a>
              <a href="#trust" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-semibold tracking-tighter text-[#111827]">Trust</a>
            </div>
            
            <div className="pt-10 border-t border-neutral-100 flex flex-col gap-6">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="text-xl font-semibold text-[#111827] tracking-tight">
                Sign In
              </Link>
              <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full h-14 bg-[#111827] text-white rounded-full text-lg font-semibold shadow-xl shadow-black/10">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-20 items-center">
            <div className="space-y-10 max-w-2xl">
              <div className="inline-flex items-center px-3 py-1 bg-neutral-100 rounded-full text-[12px] font-semibold tracking-[0.2em] text-[#6B7280] uppercase">
                Enterprise Meeting Intelligence
              </div>
              <h1 className="text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.1] text-[#111827]">
                Clarity from every <span className="text-neutral-400">meeting.</span>
              </h1>
              <p className="text-lg md:text-xl text-[#4B5563] leading-relaxed font-normal max-w-[540px]">
                The platform records meetings, transcribes conversations, and converts discussions into simple summaries, decisions, and action items.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <Link href="/auth/signup">
                  <Button className="h-14 px-8 text-base bg-[#111827] hover:bg-neutral-800 text-white rounded-full shadow-2xl shadow-black/10 font-semibold transition-all transform hover:-translate-y-0.5">
                    Start using PraxiomNotes
                  </Button>
                </Link>
                <Button variant="ghost" className="h-14 px-8 text-base text-[#111827] font-semibold border-2 border-neutral-100 rounded-full hover:bg-neutral-50 hover:border-neutral-200 transition-all">
                  See how it works
                </Button>
              </div>
            </div>

            <div className="relative group perspective-1000">
              <div className="relative z-10 p-2 bg-white/50 backdrop-blur-xl rounded-[32px] border border-white/20 shadow-[0_32px_120px_-20px_rgba(0,0,0,0.15)] transform transition-transform duration-700 hover:scale-[1.02]">
                <img 
                  src="/product_screenshot.png" 
                  alt="PraxiomNotes Dashboard - Meeting Intelligence in Action" 
                  className="rounded-[24px] w-full h-auto"
                />
              </div>
              {/* Decorative Blur */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-100/50 rounded-full blur-[100px] -z-10 animate-pulse" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-neutral-100/50 rounded-full blur-[100px] -z-10 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* --- PRODUCT MOMENT --- */}
      <section id="vision" className="bg-[#111827] py-32 md:py-48 overflow-hidden rounded-[48px] mx-4 md:mx-6 my-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-4xl mx-auto mb-24 space-y-6">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-white/40 uppercase">The Experience</span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">Every meeting becomes useful knowledge.</h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              We've redesigned the meeting experience to prioritize results. No more hunting for links or forgotten tasks.
            </p>
          </div>
          
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-4 md:p-8 backdrop-blur-sm shadow-2xl">
              <img 
                src="/hero_ui_mockup.png" 
                alt="Immersive Experience" 
                className="w-full rounded-[24px] shadow-2xl transform hover:scale-[1.01] transition-transform duration-700" 
              />
            </div>
            
            {/* Floating UI Elements (Abstracted) */}
            <div className="absolute -right-12 top-1/4 hidden xl:block w-72 p-6 bg-white rounded-3xl shadow-2xl border border-neutral-100 transform rotate-3 animate-float-slow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-semibold text-neutral-400">DECISION DETECTED</span>
              </div>
              <p className="text-sm font-semibold text-neutral-800 leading-snug">"Finalize the Q3 product roadmap by end of week."</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- STORY SECTIONS (Alternating) --- */}
      <section id="capabilities" className="py-32 md:py-48 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-48">
          
          {/* Section 1: Capture */}
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2 space-y-8">
              <div className="w-16 h-1 bg-[#111827] rounded-full" />
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tighter text-[#111827] leading-[1.2]">The conversation, <br/>perfectly recorded.</h3>
              <p className="text-lg md:text-xl text-[#4B5563] leading-relaxed">
                The intelligent system records the full context of conversations with accurate transcription and instant speaker identification.
              </p>
              <div className="flex items-center gap-6 pt-4">
                <div className="space-y-1">
                  <p className="text-3xl font-semibold">99.2%</p>
                  <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Accuracy rate</p>
                </div>
                <div className="w-px h-12 bg-neutral-200" />
                <div className="space-y-1">
                  <p className="text-3xl font-semibold">&lt; 3min</p>
                  <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Processing time</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="aspect-[4/3] bg-neutral-50 rounded-[48px] p-8 flex items-center justify-center border border-neutral-100 overflow-hidden group">
                  <div className="w-full h-full bg-white rounded-[32px] shadow-2xl p-8 space-y-6 transform translate-x-12 translate-y-12 rotate-[-5deg] transition-all group-hover:rotate-0 group-hover:translate-x-0 group-hover:translate-y-0 duration-700">
                    <div className="flex items-center gap-4 border-b border-neutral-100 pb-6">
                       <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">AM</div>
                       <div className="space-y-1">
                          <p className="text-sm font-semibold">Alice Morgan</p>
                          <p className="text-[10px] text-neutral-400 font-medium">10:02 AM • 1:34s</p>
                       </div>
                    </div>
                    <p className="text-lg text-neutral-600 leading-relaxed font-medium">"We need to ensure the Q3 roadmap aligns with our core performance objectives. Let's prioritize the API scalability layer before moving to the UI polish..."</p>
                    <div className="w-1/2 h-4 bg-neutral-50 rounded-full" />
                  </div>
               </div>
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50/50 rounded-full blur-3xl -z-10" />
            </div>
          </div>

          {/* Section 2: Summaries */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-24">
            <div className="lg:w-1/2 space-y-8">
               <div className="w-16 h-1 bg-[#111827] rounded-full" />
               <h3 className="text-3xl md:text-4xl font-semibold tracking-tighter text-[#111827] leading-[1.2]">Structure from <br/>complexity.</h3>
               <p className="text-lg md:text-xl text-[#4B5563] leading-relaxed">
                 Meetings are automatically condensed into clear, actionable summaries. We strip away the filler and highlight the most important outcomes from your discussions.
               </p>
               <Button className="h-12 px-6 rounded-full border-2 border-neutral-100 font-semibold bg-white text-[#111827] hover:bg-neutral-50 transition-all shadow-none">
                 How summaries work
               </Button>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="aspect-[4/3] bg-neutral-50 rounded-[48px] p-8 flex items-center justify-center border border-neutral-100 overflow-hidden group">
                  <div className="w-full h-full bg-white rounded-[32px] shadow-2xl p-10 space-y-8 transform -translate-x-12 translate-y-12 rotate-[5deg] transition-all group-hover:rotate-0 group-hover:translate-x-0 group-hover:translate-y-0 duration-700">
                    <div className="space-y-2">
                       <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Executive Summary</p>
                       <h4 className="text-2xl font-semibold">Product Strategy Sync</h4>
                    </div>
                    <div className="space-y-4">
                       <div className="flex gap-4">
                          <div className="w-1 h-12 bg-blue-600 rounded-full" />
                          <p className="text-sm font-medium text-neutral-600 leading-relaxed">Aligned on Q3 technical roadmap with a focus on API stability and data encryption protocols.</p>
                       </div>
                       <div className="flex gap-4">
                          <div className="w-1 h-12 bg-neutral-200 rounded-full" />
                          <p className="text-sm font-medium text-neutral-400 leading-relaxed">Agreed to defer the dashboard redesign until initial load-testing is completed in August.</p>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Section 3: Action Items */}
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2 space-y-8">
               <div className="w-16 h-1 bg-[#111827] rounded-full" />
               <h3 className="text-3xl md:text-4xl font-semibold tracking-tighter text-[#111827] leading-[1.2]">Decisions that <br/>stay decided.</h3>
               <p className="text-lg md:text-xl text-[#4B5563] leading-relaxed">
                 Action items and strategic decisions are automatically extracted. Teams leave meetings with clear next steps, owners, and zero ambiguity.
               </p>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="aspect-[4/3] bg-neutral-50 rounded-[48px] p-8 flex items-center justify-center border border-neutral-100 overflow-hidden group">
                  <div className="w-full max-w-sm bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] p-10 space-y-6 relative z-10">
                    <h5 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-6">Action Items (4)</h5>
                    <div className="space-y-5">
                       {[
                         { title: 'Finalize API Spec', owner: 'Sarah J.', date: 'Mar 18' },
                         { title: 'Complete Load Testing', owner: 'Ben K.', date: 'Mar 20' },
                         { title: 'Update Documentation', owner: 'Alice M.', date: 'Mar 22' },
                       ].map((task, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                           <div className="space-y-1">
                             <p className="text-sm font-semibold text-neutral-800">{task.title}</p>
                             <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-tight">Assigned to {task.owner}</p>
                           </div>
                           <div className="w-6 h-6 rounded-full border-2 border-neutral-200" />
                         </div>
                       ))}
                    </div>
                  </div>
                  {/* Decorative element */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 border-dashed border-neutral-200 rounded-[60px] transform scale-[1.1]" />
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- WORKFLOW EXPERIENCE --- */}
      <section id="workflow" className="py-32 md:py-48 bg-neutral-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <div className="max-w-3xl mx-auto mb-32 space-y-6">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#2563EB] uppercase">The Platform</span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#111827]">Seamless workflow. <br/>Intelligent results.</h2>
          </div>

          <div className="relative">
             {/* Horizontal Connection */}
             <div className="absolute top-14 left-0 w-full h-px bg-neutral-200 hidden lg:block" />
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative">
                {[
                  { step: '01', title: 'Record', desc: 'Securely record your sessions.' },
                  { step: '02', title: 'Transcribe', desc: 'Instant conversion to text.' },
                  { step: '03', title: 'Understand', desc: 'AI extracts notes, decisions, and tasks.' },
                  { step: '04', title: 'Share', desc: 'Insights sent to your team.' }
                ].map((item, i) => (
                  <div key={i} className="space-y-8 flex flex-col items-center group">
                     <div className="w-24 h-24 bg-white rounded-[28px] border border-neutral-100 shadow-xl flex items-center justify-center transform transition-transform group-hover:scale-105 group-hover:-translate-y-1 duration-500">
                        <span className="text-2xl font-semibold text-[#111827]">{item.step}</span>
                     </div>
                     <div className="space-y-3">
                        <h4 className="text-xl font-semibold text-[#111827]">{item.title}</h4>
                        <p className="text-[#6B7280] font-medium text-sm leading-relaxed max-w-[180px] mx-auto">{item.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* --- SHOWCASE GALLERY --- */}
      <section className="py-32 md:py-48 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-24 items-center">
             <div className="space-y-12">
                <div className="space-y-6">
                   <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-[#111827] leading-[1.2]">Designed for the <br/>modern enterprise.</h2>
                   <p className="text-lg text-[#4B5563] leading-relaxed">
                     Every pixel is intentional. We've built an interface that's powerful enough for complex legal reviews but simple enough for daily stand-ups.
                   </p>
                </div>
                
                <div className="space-y-6 border-l-2 border-neutral-100 pl-8">
                   <div className="space-y-1">
                      <p className="font-semibold text-[#111827]">Searchable Archive</p>
                      <p className="text-sm text-[#6B7280] font-medium leading-relaxed">Every word ever spoken across your organization is indexed and searchable.</p>
                   </div>
                   <div className="space-y-1">
                      <p className="font-semibold text-[#111827]">Privacy First</p>
                      <p className="text-sm text-[#6B7280] font-medium leading-relaxed">SOC-2 compliant infrastructure with end-to-end encryption for all audio files.</p>
                   </div>
                </div>
             </div>

             <div className="relative flex items-center justify-center py-20">
                <div className="w-full max-w-lg aspect-square relative">
                   <div className="absolute top-0 right-0 w-80 h-96 bg-white rounded-[40px] shadow-2xl border border-neutral-100 z-20 p-8 transform rotate-3 hover:rotate-0 transition-all duration-700">
                      <div className="w-full h-full bg-neutral-50 rounded-2xl border border-neutral-100 border-dashed" />
                   </div>
                   <div className="absolute top-20 left-0 w-80 h-96 bg-white rounded-[40px] shadow-2xl border border-neutral-100 z-10 p-8 transform -rotate-6 hover:rotate-0 transition-all duration-700">
                      <div className="w-full h-full bg-neutral-50 rounded-2xl border border-neutral-100 border-dashed" />
                   </div>
                   <div className="absolute -bottom-10 left-1/4 w-80 h-96 bg-[#111827] rounded-[40px] shadow-2xl z-0 transform translate-x-12 translate-y-12" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- USE CASE NARRATIVES --- */}
      <section id="trust" className="py-32 md:py-48 bg-[#F8FAFC]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-8">
               <h4 className="text-2xl font-semibold tracking-tight">Leadership Meetings</h4>
               <p className="text-base text-[#4B5563] leading-relaxed font-medium">Capture and track strategic decisions across executive discussions to ensure alignment across the organization. Never lose track of a commitment made in the boardroom.</p>
               <Link href="/auth/signup" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-4 transition-all">
                  Read leadership case study
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </Link>
            </div>
            <div className="space-y-8">
               <h4 className="text-3xl font-semibold tracking-tight">Product Development</h4>
               <p className="text-lg text-[#4B5563] leading-relaxed font-medium">Ensure product discussions, technical constraints, and requirements are documented with 100% accuracy. Bridge the gap between engineering and design effortlessly.</p>
               <Link href="/auth/signup" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-4 transition-all">
                  Product workflow guide
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </Link>
            </div>
            <div className="space-y-8">
               <h4 className="text-3xl font-semibold tracking-tight">Customer Conversations</h4>
               <p className="text-lg text-[#4B5563] leading-relaxed font-medium">Extract voice-of-customer insights from sales calls and user interviews without manual synthesis. Feed the direct feedback loop into your development cycle.</p>
               <Link href="/auth/signup" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-4 transition-all">
                  Sales intelligence ebook
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS (LARGE QUOTE) --- */}
      <section className="py-32 md:py-64 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
           <div className="max-w-5xl mx-auto space-y-16">
              <div className="text-neutral-200">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H14.017L14.017 5H19.017C21.2261 5 23.017 6.79086 23.017 9V15C23.017 18.3137 20.3307 21 17.017 21H14.017ZM1 15V9C1 6.79086 2.79086 5 5 5H10V8H5C4.44772 8 4 8.44772 4 9V15C4 15.5523 4.44772 16 5 16H8C9.10457 16 10 16.8954 10 18V21H7C3.68629 21 1 18.3137 1 15ZM10 18H5.017L5.017 21H8.017C9.12157 21 10.017 20.1046 10.017 19V18Z" /></svg>
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#111827] leading-[1.2]">
                "PraxiomNotes eliminated the need for manual meeting notes across our entire organization. We finally have a reliable record of truth."
              </h2>
              <div className="space-y-4 pt-12">
                 <div className="w-20 h-20 mx-auto bg-neutral-100 rounded-full border border-neutral-200 overflow-hidden">
                    <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-semibold text-2xl">SC</div>
                 </div>
                 <div>
                   <p className="text-2xl font-semibold text-[#111827]">Sarah Chen</p>
                   <p className="text-[14px] font-semibold text-[#6B7280] uppercase tracking-widest">Head of Product at Aether Systems</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="pb-24 md:pb-32 px-6 md:px-12">
         <div className="max-w-[1400px] mx-auto bg-neutral-50 rounded-[40px] py-16 md:py-24 px-6 text-center space-y-8 relative overflow-hidden group border border-neutral-100">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
               <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-[#111827] leading-[1.2]">Bring structure to <br/>every meeting.</h2>
               <p className="text-base md:text-lg text-[#6B7280] leading-relaxed font-normal">
                 Replace fragmented notes and forgotten follow-ups with reliable meeting intelligence your team can act on today.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Link href="/auth/signup">
                    <Button className="h-12 px-8 text-sm bg-[#111827] hover:bg-neutral-800 text-white rounded-full shadow-lg shadow-black/5 font-semibold transition-all">
                      Start recording
                    </Button>
                  </Link>
                  <Button variant="ghost" className="h-12 px-8 text-sm text-[#4B5563] font-semibold border border-neutral-200 rounded-full hover:bg-neutral-100 transition-all">
                    Request demo
                  </Button>
               </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-32 md:py-48 bg-white border-t border-neutral-100">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-20">
            <div className="space-y-10">
              <Link href="/" className="flex items-center mb-8">
                <img src="/logo.png" alt="Logo" className="h-12 w-auto brightness-0 invert opacity-90" />
              </Link>
              <p className="text-lg text-[#6B7280] leading-relaxed max-w-sm font-medium">
                Infrastructure for teams that rely on accurate decisions. Meeting intelligence that works for you.
              </p>
              <div className="flex gap-6">
                 <a href="#" className="w-10 h-10 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-[#111827] hover:border-neutral-200 transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                 </a>
                 <a href="#" className="w-10 h-10 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-[#111827] hover:border-neutral-200 transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                 </a>
              </div>
            </div>

            <div className="space-y-8">
              <h6 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#111827]">Product</h6>
              <ul className="space-y-4 text-lg text-[#6B7280] font-medium">
                <li><a href="#" className="hover:text-[#111827] transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-[#111827] transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-[#111827] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#111827] transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h6 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#111827]">Company</h6>
              <ul className="space-y-4 text-lg text-[#6B7280] font-medium">
                <li><a href="#" className="hover:text-[#111827] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[#111827] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#111827] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#111827] transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h6 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#111827]">Resources</h6>
              <ul className="space-y-4 text-lg text-[#6B7280] font-medium">
                <li><a href="#" className="hover:text-[#111827] transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-[#111827] transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-[#111827] transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-[#111827] transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-24 mt-24 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-8 text-[13px] text-[#9CA3AF] font-semibold uppercase tracking-widest">
            <span>&copy; 2026. Crafted for clarity.</span>
            <div className="flex gap-8">
               <a href="#" className="hover:text-[#111827] transition-colors">Status</a>
               <a href="#" className="hover:text-[#111827] transition-colors">Sitemap</a>
               <a href="#" className="hover:text-[#111827] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- ADD CUSTOM STYLES FOR ANIMATIONS --- */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(3deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 2000px;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
