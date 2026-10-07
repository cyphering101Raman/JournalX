"use client"

import React from "react";
import { useRouter } from "next/navigation";

function SectionDivider() {
  return (
    <div className="relative flex items-center justify-center py-2 px-6 max-w-7xl mx-auto">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(99,102,241,0.25), transparent)" }} />
      <div className="mx-4 flex items-center justify-center">
        <div
          className="w-1.5 h-1.5 rotate-45"
          style={{
            background: "rgba(99,102,241,0.7)",
            boxShadow: "0 0 8px 2px rgba(99,102,241,0.45)",
          }}
        />
      </div>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(99,102,241,0.25), transparent)" }} />
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
            Journaling that <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 text-transparent bg-clip-text">
              looks back at you.
            </span>
          </h2>

          <p className="mt-8 text-zinc-400 max-w-xl mx-auto lg:mx-0 text-lg md:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Stop just storing entries. JournalX uses AI to decode your thoughts,
            identify emotional patterns, and summarize your weeks automatically.
          </p>

          <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <button
              onClick={() => router.push('/journal')}
              className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all shadow-xl shadow-white/10 hover:scale-105 active:scale-95"
            >
              Start Journaling Now
            </button>
            <button className="px-8 py-4 border border-zinc-700 rounded-full font-bold hover:bg-white/5 transition-all text-zinc-300"
              onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              See how this works
            </button>
          </div>
        </div>

        {/* Visual Preview Card */}
        <div className="flex-1 w-full max-w-md animate-in fade-in zoom-in duration-1000 delay-500">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative rounded-3xl bg-zinc-900/40 backdrop-blur-3xl border border-white/10 p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Live Insight</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase">Reflective</div>
                  <div className="text-[10px] text-zinc-500">Analyzed 2 mins ago</div>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed italic">
                  "You've been focused but slightly anxious about the move this week. Midweek journaling shows your stress levels peaked Wednesday but dropped after your social rest."
                </p>
              </div>
              <div className="pt-4 flex gap-2">
                <div className="px-2 py-1 rounded-md bg-white/5 text-[9px] text-zinc-500">#Productive</div>
                <div className="px-2 py-1 rounded-md bg-white/5 text-[9px] text-zinc-500">#MovingHouse</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-5xl font-bold mb-4">From raw thoughts to life-long insights.</h3>
          <p className="text-zinc-500 max-w-2xl mx-auto">A linear progression designed to help you understand your evolution.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Write", desc: "Capture your day in our distraction-free editor." },
            { step: "02", title: "Analyze", desc: "AI instantly extracts mood, summary, and context." },
            { step: "03", title: "Discover", desc: "Combine multiple days into high-level reports." },
            { step: "04", title: "Reflect", desc: "Use patterns to make better decisions." }
          ].map((item, i) => (
            <div key={i} className="relative group p-6 rounded-2xl hover:bg-white/5 transition-all">
              <div className="text-4xl font-extrabold text-white/5 mb-4 group-hover:text-indigo-500/20 transition-all">{item.step}</div>
              <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* Core Benefits Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto space-y-32">

        {/* Benefit 1 */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h3 className="text-4xl font-bold">Every entry has a soul.</h3>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Instant clarity on every entry without re-reading. Our AI extracts Mood badges and concise recaps so you can see your day's essence at a glance.
            </p>
            <div className="pt-4 flex justify-center lg:justify-start items-center gap-4 text-indigo-400 font-bold uppercase tracking-widest text-[10px]">
              <span>Mood Detection</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
              <span>Smart Summaries</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
              <span>Auto-Tagging</span>
            </div>
          </div>
          <div className="flex-1 w-full p-8 rounded-3xl bg-white/5 border border-white/10 shadow-2xl space-y-4">
            <div className="flex gap-2">
              <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] uppercase font-bold text-green-400">Grateful</div>
              <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] uppercase font-bold text-blue-400">#Productivity</div>
            </div>
            <p className="text-zinc-300 text-sm italic">"A morning of deep work followed by a peaceful walk. You felt particularly grateful for your progress today."</p>
          </div>
        </div>

        {/* Benefit 2 - Reverse */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h3 className="text-4xl font-bold">Connect the dots across time.</h3>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Zoom out to see the big picture. Our Time-Range Summaries identify recurring themes and environmental triggers across your week or month.
            </p>
            <div className="pt-4 flex justify-center lg:justify-start items-center gap-4 text-purple-400 font-bold uppercase tracking-widest text-[10px]">
              <span>3-15 Day Analysis</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
              <span>Pattern Identification</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
              <span>Life Flow</span>
            </div>
          </div>
          <div className="flex-1 w-full p-8 rounded-3xl bg-white/5 border border-white/10 shadow-2xl">
            <div className="space-y-4">
              <div className="h-2 w-3/4 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-purple-500"></div>
              </div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest leading-relaxed">Pattern: Energy peaks on midweek mornings, drops during rainy weather.</p>
            </div>
          </div>
        </div>

        <SectionDivider />

        {/* Example Output Section */}
        <div className="pt-0">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-4xl font-bold">This is your mind, summarized.</h3>
            <p className="text-zinc-500">A high-fidelity report generated across 7 entries.</p>
          </div>

          <div className="max-w-4xl mx-auto relative group">
            {/* Outer glow */}
            <div
              className="absolute -inset-px rounded-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"
              style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.5), rgba(168,85,247,0.3), rgba(99,102,241,0.1))" }}
            />
            <div
              className="relative rounded-3xl p-10 shadow-2xl hover:scale-[1.01] transform transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, rgba(30,27,75,0.6) 0%, rgba(15,23,42,0.8) 60%, rgba(25,20,60,0.5) 100%)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(99,102,241,0.2)",
                boxShadow: "0 0 40px rgba(99,102,241,0.08), 0 25px 50px rgba(0,0,0,0.4)",
              }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 mb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(99,102,241,0.7)" }}>Range Summary</h4>
                  <p className="text-2xl font-bold text-white">Apr 1 — Apr 7</p>
                </div>
                <div
                  className="px-6 py-2 rounded-full font-bold text-xs uppercase"
                  style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))",
                    border: "1px solid rgba(99,102,241,0.35)",
                    color: "rgba(165,180,252,1)",
                    boxShadow: "0 0 16px rgba(99,102,241,0.2)",
                  }}
                >
                  Overall Mood: Balanced
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-3 pl-4" style={{ borderLeft: "2px solid rgba(99,102,241,0.4)" }}>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(99,102,241,0.6)" }}>Key Pattern</h5>
                  <p className="text-zinc-200 leading-relaxed font-medium">
                    &ldquo;Work anxiety peaks on Mondays; coffee intake correlates strongly with poor sleep on nights 3 and 4.&rdquo;
                  </p>
                </div>
                <div className="space-y-3 pl-4" style={{ borderLeft: "2px solid rgba(168,85,247,0.4)" }}>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(168,85,247,0.7)" }}>Growth Tip</h5>
                  <p className="text-zinc-200 leading-relaxed font-medium">
                    &ldquo;Consider shifting deep work to Tuesday mornings when your focus is naturally 20% higher.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Why JournalX */}
      <section className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h3 className="text-4xl font-bold">Why JournalX?</h3>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Most journaling apps are graveyards for text. JournalX is a conversation with your past self.
              We don't focus on what you wrote, but how it's changing over time.
            </p>
            <ul className="space-y-4">
              {[
                { t: "Intelligence, Not Just Text", d: "Generic AI writes for you; our AI listens to you." },
                { t: "Pattern Recognition", d: "We connect dots across days that you might miss." },
                { t: "Privacy First", d: "Your thoughts are encrypted and fully under your control." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">{item.t}</h5>
                    <p className="text-zinc-500 text-sm">{item.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 aspect-square flex flex-col justify-end relative overflow-hidden group">
              <img
                src="/private-card.png"
                alt="Privacy visualization"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-bold text-indigo-400 uppercase tracking-widest z-10">Upcoming</div>
              <div className="relative z-10 p-6" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
                <span className="text-2xl font-bold text-white">100%</span>
                <span className="block text-xs text-zinc-300 uppercase tracking-widest font-bold">Private</span>
              </div>
            </div>
            <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 aspect-square flex flex-col justify-end relative overflow-hidden">
              <img
                src="/ai-driven.png"
                alt="AI visualization"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
              <div className="relative z-10 p-6" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
                <span className="text-2xl font-bold text-indigo-200">AI</span>
                <span className="block text-xs text-zinc-300 uppercase tracking-widest font-bold">Driven</span>
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 aspect-square flex flex-col justify-end relative overflow-hidden">
              <img
                src="/history-card.png"
                alt="History visualization"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
              <div className="relative z-10 p-6" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
                <span className="text-2xl font-bold text-white">∞</span>
                <span className="block text-xs text-zinc-300 uppercase tracking-widest font-bold">History</span>
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 aspect-square flex flex-col justify-end relative overflow-hidden">
              <img
                src="/insights-card.png"
                alt="Insights visualization"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
              <div className="relative z-10 p-6" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
                <span className="text-2xl font-bold text-white">3+</span>
                <span className="block text-xs text-zinc-300 uppercase tracking-widest font-bold">Insights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Use Cases */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h3 className="text-4xl font-bold mb-4">Built for your growth cycles.</h3>
          <p className="text-zinc-500">Real scenarios where JournalX makes a difference.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Understand Patterns",
              desc: "Identify what triggers your best (and worst) emotional days.",
              color: "rgba(99,102,241,0.5)"
            },
            {
              title: "Optimize Focus",
              desc: "See if your work-life balance is actually balancing over weeks.",
              color: "rgba(168,85,247,0.5)"
            },
            {
              title: "Weekly Reflection",
              desc: "Get a full week's recap in 20 seconds instead of scrolling through pages.",
              color: "rgba(236,72,153,0.5)"
            }
          ].map((item, i) => (
            <div key={i} className="relative group">

              {/* Glow */}
              <div
                className="absolute -inset-px rounded-3xl opacity-30 group-hover:opacity-60 transition duration-700"
                style={{
                  background: `linear-gradient(135deg, ${item.color}, transparent)`
                }}
              />

              {/* Card */}
              <div
                className="relative p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(30,27,75,0.5) 0%, rgba(15,23,42,0.85) 70%)",
                  backdropFilter: "blur(18px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow:
                    "0 0 30px rgba(0,0,0,0.4), 0 20px 40px rgba(0,0,0,0.5)"
                }}
              >
                <h4 className="text-lg font-bold mb-3 text-white">
                  {item.title}
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* Insights Over Time - Visual Storytelling */}
      <section className="py-32 px-6 max-w-4xl mx-auto text-center space-y-12">
        <h3 className="text-4xl font-bold">Moving from Day 1 to Life Pattern.</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block"></div>
          {[
            { label: "The Day", val: "A single data point.", sub: "\"I'm tired.\"" },
            { label: "The Week", val: "A visible trend.", sub: "\"Tired on workdays.\"" },
            { label: "The Pattern", val: "The 'Why'.", sub: "\"Late-night screen time.\"" }
          ].map((item, i) => (
            <div key={i} className="relative z-10 w-full md:w-64 p-6 rounded-2xl bg-slate-950 border border-white/10 shadow-xl">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 block">{item.label}</span>
              <p className="text-white font-bold mb-2">{item.val}</p>
              <p className="text-zinc-500 text-xs italic">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* Upcoming Features */}
      <section className="py-26 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          Roadmap
        </div>
        <h3 className="text-4xl font-bold mb-16">The future of your personal vault.</h3>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-8 rounded-3xl bg-white/[0.01] border border-dashed border-white/10 text-left">
            <h4 className="font-bold text-white mb-2">End-to-End Encryption</h4>
            <p className="text-zinc-500 text-sm">Upcoming feature for total thought security and decentralization.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/[0.01] border border-dashed border-white/10 text-left">
            <h4 className="font-bold text-white mb-2">Advanced Analytics</h4>
            <p className="text-zinc-500 text-sm">Mood vs. Word count correlation charts and deep-dive visualization.</p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Final CTA */}
      <section className="py-40 px-6 text-center bg-gradient-to-b from-transparent to-indigo-950/20">
        <div className="max-w-4xl mx-auto space-y-10">
          <h3 className="text-5xl md:text-7xl font-extrabold tracking-tighter">Ready to see the patterns in your life?</h3>
          <p className="text-zinc-400 text-xl">Join a new generation of reflective journaling.</p>
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={() => router.push('/journal')}
              className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-zinc-200 transition-all hover:scale-105 shadow-2xl shadow-indigo-500/10"
            >
              Start Journaling Now
            </button>
            <p className="text-zinc-600 text-sm">Free tier includes 3 daily insights.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-zinc-600 text-sm border-t border-white/5">
        © {new Date().getFullYear()} AI Journal. Build for growth.
      </footer>
    </div>
  );
}