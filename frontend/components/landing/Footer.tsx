"use client";

import Link from "next/link";
import { Twitter, Github, Linkedin, Slack } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-neutral-50 py-20 px-6 border-t border-claeron-primary/5">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Column 1: Logo & Info */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="Logo" className="h-20 w-auto object-contain" />
            </Link>
            <p className="text-[14px] text-claeron-text/60 leading-relaxed max-w-xs">
              The enterprise meeting intelligence platform. Automatically capture, transcribe, and analyze every conversation.
            </p>
            <div className="flex items-center gap-4 mt-2">
               <Link href="#" className="text-claeron-text/40 hover:text-claeron-accent transition-colors">
                  <Twitter className="w-5 h-5" />
               </Link>
               <Link href="#" className="text-claeron-text/40 hover:text-claeron-accent transition-colors">
                  <Linkedin className="w-5 h-5" />
               </Link>
               <Link href="#" className="text-claeron-text/40 hover:text-claeron-accent transition-colors">
                  <Github className="w-5 h-5" />
               </Link>
               <Link href="#" className="text-claeron-text/40 hover:text-claeron-accent transition-colors">
                  <Slack className="w-5 h-5" />
               </Link>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <h4 className="text-[14px] font-bold text-claeron-primary uppercase tracking-widest">Product</h4>
            <div className="flex flex-col gap-3">
              <Link href="#features" className="text-[14px] text-claeron-text/60 hover:text-claeron-primary transition-colors">Features</Link>
              <Link href="/record" className="text-[14px] text-claeron-text/60 hover:text-claeron-primary transition-colors">Record Meetings</Link>
              <Link href="/uploads" className="text-[14px] text-claeron-text/60 hover:text-claeron-primary transition-colors">Upload Recordings</Link>
              <Link href="/search" className="text-[14px] text-claeron-text/60 hover:text-claeron-primary transition-colors">Search Conversations</Link>
              <Link href="/insights" className="text-[14px] text-claeron-text/60 hover:text-claeron-primary transition-colors">Meeting Insights</Link>
            </div>
          </div>

          {/* Column 3: Company */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <h4 className="text-[14px] font-bold text-claeron-primary uppercase tracking-widest">Company</h4>
            <div className="flex flex-col gap-3">
              <Link href="#" className="text-[14px] text-claeron-text/60 hover:text-claeron-primary transition-colors">About Us</Link>
              <Link href="#security" className="text-[14px] text-claeron-text/60 hover:text-claeron-primary transition-colors">Security</Link>
              <Link href="#" className="text-[14px] text-claeron-text/60 hover:text-claeron-primary transition-colors">Careers</Link>
              <Link href="#" className="text-[14px] text-claeron-text/60 hover:text-claeron-primary transition-colors">Blog</Link>
              <Link href="#" className="text-[14px] text-claeron-text/60 hover:text-claeron-primary transition-colors">Brand Assets</Link>
            </div>
          </div>

          {/* Column 4: Resources */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <h4 className="text-[14px] font-bold text-claeron-primary uppercase tracking-widest">Resources</h4>
            <div className="flex flex-col gap-3">
              <Link href="#" className="text-[14px] text-claeron-text/60 hover:text-claeron-primary transition-colors">Documentation</Link>
              <Link href="#" className="text-[14px] text-claeron-text/60 hover:text-claeron-primary transition-colors">Help Center</Link>
              <Link href="#" className="text-[14px] text-claeron-text/60 hover:text-claeron-primary transition-colors">API Reference</Link>
              <Link href="#" className="text-[14px) text-claeron-text/60 hover:text-claeron-primary transition-colors">Contact Sales</Link>
              <Link href="#" className="text-[14px] text-claeron-text/60 hover:text-claeron-primary transition-colors">Privacy Privacy</Link>
            </div>
          </div>

        </div>

        {/* Bottom row */}
        <div className="mt-20 pt-8 border-t border-claeron-primary/5 flex flex-col md:flex-row items-center justify-between gap-6">
           <p className="text-[13px] text-claeron-text/40 font-medium">
             © {currentYear} Claeron Inc. All rights reserved.
           </p>
           <div className="flex items-center gap-8">
              <Link href="#" className="text-[13px] text-claeron-text/40 hover:text-claeron-primary transition-colors font-medium">Privacy Policy</Link>
              <Link href="#" className="text-[13px] text-claeron-text/40 hover:text-claeron-primary transition-colors font-medium">Terms of Service</Link>
              <Link href="#" className="text-[13px] text-claeron-text/40 hover:text-claeron-primary transition-colors font-medium">Cookie Settings</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
