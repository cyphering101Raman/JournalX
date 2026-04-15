"use client"

import React from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-white">


      {/* Hero */}
      <section className="text-center mt-20 px-6">
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

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition">
          <h3 className="text-xl font-semibold mb-3">AI Insights</h3>
          <p className="text-zinc-400">
            Get deep reflections, summaries, and emotional insights from your entries.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition">
          <h3 className="text-xl font-semibold mb-3">Smart Prompts</h3>
          <p className="text-zinc-400">
            Never run out of ideas with AI-generated journaling prompts.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition">
          <h3 className="text-xl font-semibold mb-3">Private & Secure</h3>
          <p className="text-zinc-400">
            Your thoughts are encrypted and fully under your control.
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