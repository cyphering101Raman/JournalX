"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

function SectionDivider() {
  return (
    <div className="relative flex items-center justify-center py-4 px-6 max-w-7xl mx-auto">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      <div className="mx-6 flex items-center justify-center">
        <div className="w-2 h-2 rotate-45 bg-indigo-500/80 shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-indigo-500/30 to-transparent" />
    </div>
  );
}

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#07080e] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Ambient Top Light Scrim */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
        <div className="w-full h-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.22),transparent_70%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-36 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.08] tracking-tight text-white">
            Journaling that <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
              looks back at you.
            </span>
          </h1>

          <p className="mt-7 text-zinc-400 max-w-xl mx-auto lg:mx-0 text-lg md:text-xl leading-relaxed font-normal">
            Stop just storing entries. JournalX uses AI to decode your thoughts,
            identify emotional patterns, and summarize your weeks automatically.
          </p>

          <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
            <button
              onClick={() => router.push("/journal")}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-full shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:shadow-[0_0_45px_rgba(99,102,241,0.55)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Start Journaling Now
            </button>
            <button
              onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="px-8 py-4 border border-white/15 bg-white/[0.04] rounded-full font-bold hover:bg-white/[0.08] hover:border-white/30 transition-all duration-300 text-zinc-200 backdrop-blur-md cursor-pointer"
            >
              See how this works
            </button>
          </div>
        </div>

        {/* Visual Glassmorphic Preview Card */}
        <div className="flex-1 w-full max-w-lg">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-xl group-hover:opacity-60 transition duration-700" />
            
            <div className="relative rounded-3xl bg-[#0d0f20]/85 backdrop-blur-2xl border border-indigo-500/25 p-7 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  Live AI Insight
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/35 text-[10px] font-bold text-indigo-300 uppercase">
                    Mood: Reflective
                  </span>
                  <span className="text-[11px] text-zinc-500 font-medium">Just analyzed</span>
                </div>
                <p className="text-zinc-200 text-sm sm:text-base leading-relaxed italic bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  &ldquo;You&apos;ve been focused but slightly anxious about the move this week. Midweek journaling shows your stress levels peaked Wednesday but dropped after your social rest.&rdquo;
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-400 font-medium">#Productive</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-400 font-medium">#MovingHouse</span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300 font-medium">#SelfCare</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* How It Works - Bento Box Layout */}
      <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            From raw thoughts to life-long insights.
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg">
            A linear progression designed to help you understand your evolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Write", desc: "Capture your day in our distraction-free, rich text editor." },
            { step: "02", title: "Analyze", desc: "AI instantly extracts mood badges, summaries, and key topics." },
            { step: "03", title: "Discover", desc: "Combine multiple days into high-level range reports." },
            { step: "04", title: "Reflect", desc: "Use recognized patterns to make better life decisions." },
          ].map((item, i) => (
            <div
              key={i}
              className="relative group p-7 rounded-3xl bg-[#0c0e1a]/60 backdrop-blur-xl border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.04] transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl font-extrabold text-indigo-500/20 group-hover:text-indigo-400/60 transition-all mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* Core Benefits */}
      <section className="py-24 px-6 max-w-6xl mx-auto space-y-28">

        {/* Benefit 1 */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Every entry has a soul.</h2>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              Instant clarity on every entry without re-reading. Our AI extracts Mood badges and concise recaps so you can see your day&apos;s essence at a glance.
            </p>
            <div className="pt-2 flex flex-wrap justify-center lg:justify-start items-center gap-3 text-indigo-400 font-bold uppercase tracking-widest text-[11px]">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">Mood Detection</span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">Smart Summaries</span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">Auto-Tagging</span>
            </div>
          </div>
          
          <div className="flex-1 w-full p-8 rounded-3xl bg-[#0c0e1a]/80 border border-indigo-500/20 shadow-2xl space-y-4">
            <div className="flex gap-2.5">
              <div className="px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] uppercase font-bold text-emerald-300">Grateful</div>
              <div className="px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-[11px] uppercase font-bold text-indigo-300">#Productivity</div>
            </div>
            <p className="text-zinc-200 text-sm sm:text-base italic leading-relaxed">
              &ldquo;A morning of deep work followed by a peaceful walk. You felt particularly grateful for your progress today.&rdquo;
            </p>
          </div>
        </div>

        {/* Benefit 2 - Reverse */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Connect the dots across time.</h2>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              Zoom out to see the big picture. Our Time-Range Summaries identify recurring themes and environmental triggers across your week or month.
            </p>
            <div className="pt-2 flex flex-wrap justify-center lg:justify-start items-center gap-3 text-purple-400 font-bold uppercase tracking-widest text-[11px]">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">3-15 Day Analysis</span>
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">Pattern Identification</span>
            </div>
          </div>
          
          <div className="flex-1 w-full p-8 rounded-3xl bg-[#0c0e1a]/80 border border-purple-500/20 shadow-2xl">
            <div className="space-y-5">
              <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
              </div>
              <p className="text-xs text-zinc-400 uppercase font-bold tracking-widest leading-relaxed">
                Pattern: Energy peaks on midweek mornings, drops during rainy weather.
              </p>
            </div>
          </div>
        </div>

        {/* Range Report Example Showcase */}
        <div className="pt-6">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">This is your mind, summarized.</h2>
            <p className="text-zinc-400">A high-fidelity report generated across 7 entries.</p>
          </div>

          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-xl group-hover:opacity-50 transition duration-700" />
            <div className="relative rounded-3xl p-8 sm:p-10 bg-[#0d0e1c]/90 backdrop-blur-2xl border border-indigo-500/30 shadow-2xl space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Range Summary</span>
                  <p className="text-2xl font-bold text-white mt-1">Apr 1 — Apr 7</p>
                </div>
                <div className="px-5 py-2 rounded-full font-bold text-xs uppercase bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  Overall Mood: Balanced
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 pl-4 border-l-2 border-indigo-500/60">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Key Pattern</h3>
                  <p className="text-zinc-300 leading-relaxed font-medium text-sm sm:text-base">
                    &ldquo;Work anxiety peaks on Mondays; coffee intake correlates strongly with poor sleep on nights 3 and 4.&rdquo;
                  </p>
                </div>
                <div className="space-y-2 pl-4 border-l-2 border-purple-500/60">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Growth Tip</h3>
                  <p className="text-zinc-300 leading-relaxed font-medium text-sm sm:text-base">
                    &ldquo;Consider shifting deep work to Tuesday mornings when your focus is naturally 20% higher.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Why JournalX Section */}
      <section className="py-28 px-6 bg-white/[0.015] border-y border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Why JournalX?</h2>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              Most journaling apps are graveyards for text. JournalX is a conversation with your past self.
              We don&apos;t focus on what you wrote, but how it&apos;s changing over time.
            </p>
            <ul className="space-y-4">
              {[
                { t: "Intelligence, Not Just Text", d: "Generic AI writes for you; our AI listens to you." },
                { t: "Pattern Recognition", d: "We connect dots across days that you might miss." },
                { t: "Privacy First", d: "Your thoughts are encrypted and fully under your control." },
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{item.t}</h3>
                    <p className="text-zinc-400 text-sm">{item.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { img: "/private-card.png", val: "100%", label: "Private", tag: "Upcoming" },
              { img: "/ai-driven.png", val: "AI", label: "Driven" },
              { img: "/history-card.png", val: "∞", label: "History" },
              { img: "/insights-card.png", val: "3+", label: "Insights" },
            ].map((card, i) => (
              <div key={i} className="rounded-3xl bg-[#0c0e1a]/80 border border-white/10 aspect-square flex flex-col justify-end relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
                <img
                  src={card.img}
                  alt={card.label}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                />
                {card.tag && (
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[9px] font-bold text-indigo-300 uppercase tracking-widest z-10">
                    {card.tag}
                  </div>
                )}
                <div className="relative z-10 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <span className="text-2xl font-extrabold text-white">{card.val}</span>
                  <span className="block text-xs text-zinc-300 uppercase tracking-widest font-bold">{card.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Final CTA */}
      <section className="py-32 px-6 text-center relative">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            Ready to see the patterns in your life?
          </h2>
          <p className="text-zinc-400 text-lg sm:text-xl">
            Join a new generation of reflective journaling.
          </p>
          <div className="flex flex-col items-center gap-4 pt-4">
            <button
              onClick={() => router.push("/journal")}
              className="px-10 py-4.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg rounded-full shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Start Journaling Now
            </button>
            <p className="text-zinc-500 text-xs">Free tier includes 3 daily insights.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 border-t border-white/5 bg-[#05060b]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <Image
            src="/JournalX-logo.png"
            alt="JournalX Logo"
            width={140}
            height={40}
            className="h-9 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity"
          />
          <p>© {new Date().getFullYear()} JournalX. Built for growth.</p>
        </div>
      </footer>
    </div>
  );
}