"use client"

import React from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">


      {/* Hero */}
      <section className="text-center pt-32 px-6">
        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
          Your Thoughts, <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Enhanced by AI
          </span>
        </h2>

        <p className="mt-6 text-zinc-400 max-w-xl mx-auto text-lg">
          Capture your thoughts, reflect deeply, and grow with the help of
          intelligent journaling powered by AI.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => router.push('/journal')}
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition"
          >
            Start Journaling
          </button>
          <button className="px-6 py-3 border border-zinc-600 rounded-full font-medium hover:bg-zinc-800 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="mt-28 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 group shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all text-indigo-400 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9Z" /><path d="M12 8v4l2 2" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white">AI Insights</h3>
          </div>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Get deep reflections, summaries, and emotional insights from your entries automatically.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 group shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all text-purple-400 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white">Smart Prompts</h3>
          </div>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Never run out of ideas with intelligent, context-aware journaling prompts.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-pink-500/50 transition-all duration-300 group shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all text-pink-400 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white">Private & Secure</h3>
          </div>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Your thoughts are encrypted and stored securely, ensuring total privacy.
          </p>
        </div>

      </section>

      {/* Footer */}
      <footer className="mt-32 text-center text-zinc-500 text-sm pb-8">
        © {new Date().getFullYear()} AI Journal. All rights reserved.
      </footer>
    </div>
  );
}