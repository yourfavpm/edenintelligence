"use client";

import { ShieldCheck, Lock, EyeOff } from "lucide-react";

export default function Security() {
  return (
    <section id="security" className="w-full bg-neutral-50 py-24 px-6 border-b border-eden-primary/5">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
        
        {/* Left Column: Content */}
        <div className="flex flex-col gap-6">
          <h2 className="text-[28px] md:text-[32px] font-semibold text-eden-primary tracking-tight leading-[1.2]">
            Enterprise-grade security by default
          </h2>
          <p className="text-[15px] text-eden-text/70 leading-relaxed max-w-md">
            Your conversations are your most valuable assets. We protect them with industry-leading encryption and strict access controls, ensuring your data remains private and secure.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <div className="px-3 py-1 rounded bg-white border border-eden-primary/10 text-[12px] font-bold text-eden-primary uppercase tracking-wider shadow-sm">
              SOC2 Type II
            </div>
            <div className="px-3 py-1 rounded bg-white border border-eden-primary/10 text-[12px] font-bold text-eden-primary uppercase tracking-wider shadow-sm">
              GDPR Compliant
            </div>
          </div>
        </div>

        {/* Right Column: Security Cards */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-start gap-5 p-6 bg-white rounded-2xl border border-eden-primary/10 shadow-sm transition-all hover:shadow-md hover:border-eden-accent/20">
            <div className="w-10 h-10 rounded-lg bg-eden-bg flex items-center justify-center text-eden-accent shrink-0 mt-1">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-eden-primary mb-1">Encrypted Recordings</h3>
              <p className="text-[14px] text-eden-text/60 leading-relaxed">
                All audio samples and transcripts are encrypted at rest with AES-256 and in transit via TLS 1.3.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5 p-6 bg-white rounded-2xl border border-eden-primary/10 shadow-sm transition-all hover:shadow-md hover:border-eden-accent/20">
            <div className="w-10 h-10 rounded-lg bg-eden-bg flex items-center justify-center text-eden-primary shrink-0 mt-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-eden-primary mb-1">Secure Cloud Storage</h3>
              <p className="text-[14px] text-eden-text/60 leading-relaxed">
                Data is isolated within secure VPCs, utilizing premium storage providers with 99.99% durability.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5 p-6 bg-white rounded-2xl border border-eden-primary/10 shadow-sm transition-all hover:shadow-md hover:border-eden-accent/20">
            <div className="w-10 h-10 rounded-lg bg-eden-bg flex items-center justify-center text-eden-soft shrink-0 mt-1">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-eden-primary mb-1">Granular Access Control</h3>
              <p className="text-[14px] text-eden-text/60 leading-relaxed">
                Manage who can view, edit, or delete recordings with role-based permissions and audit logs.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
