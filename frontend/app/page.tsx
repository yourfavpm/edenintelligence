'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui';

// =============================================================================
// Landing Page (Marketing)
// =============================================================================

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-primary-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center font-bold text-white italic">
              E
            </div>
            <span className="font-bold text-xl tracking-tight">Eden Intelligence</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Features</a>
            <a href="#solutions" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Solutions</a>
            <a href="#pricing" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-bold text-neutral-900">
              Sign In
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-600 rounded-full border border-primary-100">
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">v2.0 is now live</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter leading-[1.05]">
              Meeting intelligence <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">for high-output teams.</span>
            </h1>
            <p className="text-xl text-neutral-500 max-w-lg leading-relaxed font-medium">
              Eden captures, transcribes, and extracts key decisions from your meetings automatically. Turn every conversation into a structured asset.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/signup">
                <Button className="h-14 px-8 text-lg rounded-2xl shadow-xl shadow-primary-500/10">Try Eden Intelligence</Button>
              </Link>
              <Button variant="ghost" className="h-14 px-8 text-lg text-neutral-900 font-bold border border-neutral-200 rounded-2xl hover:bg-neutral-50">
                Watch Demo
              </Button>
            </div>
            <div className="flex items-center gap-4 pt-8 border-t border-neutral-100 max-w-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center text-[10px] font-bold`}>
                    U{i}
                  </div>
                ))}
              </div>
              <p className="text-xs text-neutral-400 font-medium">
                Trusted by <span className="text-neutral-900">10,000+</span> product managers worldwide.
              </p>
            </div>
          </div>

          {/* Visual Placeholder */}
          <div className="relative animate-float">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary-500/10 to-indigo-500/10 blur-3xl rounded-full" />
            <div className="relative bg-white rounded-3xl border border-neutral-200 shadow-2xl p-4 overflow-hidden">
              <div className="bg-neutral-50 rounded-2xl h-[400px] flex flex-col justify-end p-8 space-y-4">
                <div className="w-3/4 h-4 bg-neutral-200 rounded-full" />
                <div className="w-1/2 h-4 bg-neutral-200 rounded-full" />
                <div className="w-full h-32 bg-primary-100/50 rounded-2xl border border-primary-200/50 flex flex-col items-center justify-center p-6 space-y-3">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Processing Audio...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Everything you need to ship faster.</h2>
            <p className="text-neutral-500 font-medium leading-relaxed">
              Stop wasting hours manually taking notes. Let Eden handle the heavy lifting while you focus on the conversation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Instant Transcription',
                desc: 'Multi-lingual speaker-attributed transcripts delivered seconds after your meeting ends.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )
              },
              {
                title: 'Decision Extraction',
                desc: 'AI automatically identifies and surfaces key decisions, action items, and next steps.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                )
              },
              {
                title: 'Team Collaboration',
                desc: 'Easily share minutes and highlights with anyone. Sync tasks directly to your existing CRM.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-neutral-500 text-[15px] leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center font-bold text-white italic">E</div>
              <span className="font-bold text-xl tracking-tight">Eden Intelligence</span>
            </div>
            <p className="text-sm text-neutral-400 font-medium">Enterprise intelligence for modern teams.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-900">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-500 font-medium">
                <li><a href="#" className="hover:text-primary-600 transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Security</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-900">Resources</h4>
              <ul className="space-y-2 text-sm text-neutral-500 font-medium">
                <li><a href="#" className="hover:text-primary-600 transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-neutral-50 flex justify-between items-center text-xs text-neutral-400 font-bold uppercase tracking-widest">
          <span>&copy; 2026 Eden Intelligence. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-900 transition-colors">Twitter</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
