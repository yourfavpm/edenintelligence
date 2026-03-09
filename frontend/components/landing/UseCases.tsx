"use client";

import { Users, Briefcase, Rocket, Heart } from "lucide-react";

export default function UseCases() {
  const cases = [
    {
      icon: Rocket,
      title: "Product Teams",
      description: "Gather user feedback from research calls and turn insights into clear feature tickets instantly.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Briefcase,
      title: "Sales Teams",
      description: "Capture client requirements and ensure every follow-up task is tracked in your CRM automatically.",
      color: "bg-eden-bg text-eden-accent",
    },
    {
      icon: Users,
      title: "Founders",
      description: "Keep the pulse of every department without attending every meeting. Read summaries in minutes.",
      color: "bg-purple-50 text-eden-primary",
    },
    {
      icon: Heart,
      title: "Customer Success",
      description: "Understand customer pain points deeper and share meeting highlights with the engineering team.",
      color: "bg-red-50 text-red-500",
    },
  ];

  return (
    <section className="w-full bg-white py-24 px-6 border-b border-eden-primary/5">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[28px] md:text-[32px] font-semibold text-eden-primary tracking-tight mb-4">
            Designed for high-performance teams
          </h2>
          <p className="text-[15px] text-eden-text/70 leading-relaxed">
            Eden Intelligence scales with your team, from early-stage startups to enterprise organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((item, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl border border-eden-primary/5 bg-neutral-50/50 hover:bg-white hover:shadow-lg hover:border-eden-accent/10 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-[18px] font-semibold text-eden-primary mb-3">
                {item.title}
              </h3>
              <p className="text-[14px] text-eden-text/60 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
