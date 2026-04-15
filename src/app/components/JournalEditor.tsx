"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface JournalEditorProps {
  journalId: string;
  initialTitle?: string;
  initialContent?: string;
  initialInsights?: {
    mood: string;
    summary: string;
    tags: string[];
    createdAt: Date;
  }[];
  onUpdate?: (title: string, content: string, insights?: any[]) => void;
}

import TiptapEditor from "./TiptapEditor";

export default function JournalEditor({ 
  journalId, 
  initialTitle = "", 
  initialContent = "", 
  initialInsights = [],
  onUpdate 
}: JournalEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [insights, setInsights] = useState<any[]>(initialInsights);
  const [currentIndex, setCurrentIndex] = useState(initialInsights.length > 0 ? initialInsights.length - 1 : 0);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isGenerating, setIsGenerating] = useState(false);

  // Synchronize index when insights history changes (e.g. after generation)
  useEffect(() => {
    if (insights.length > 0) {
      setCurrentIndex(insights.length - 1);
    }
  }, [insights.length]);

  // Target insight based on carousel index
  const activeInsight = insights && insights.length > 0 ? insights[currentIndex] : null;

  // Auto-save logic (5s debounce)
  useEffect(() => {
    // Only auto-save if something is written
    if (!title && !content) return;

    const handler = setTimeout(async () => {
      setStatus("saving");
      try {
        const res = await fetch("/api/journal/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ journalId, title, content }),
        });
        
        if (res.ok) {
          setStatus("saved");
          setTimeout(() => setStatus("idle"), 2000);
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    }, 5000);

    // If user types again before 5s, clears previous timeout to prevent spam
    return () => clearTimeout(handler);
  }, [title, content]);

  const handleManualSave = async () => {
    if (!title && !content) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/journal/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journalId, title, content }),
      });
      
      if (res.ok) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
        toast.success("Saved your entry!");
      } else {
        setStatus("error");
        toast.error("Failed to save");
      }
    } catch {
      setStatus("error");
      toast.error("Failed to save");
    }
  };

  const handleGenerateInsight = async () => {
    // Basic validation
    const textContent = content.replace(/<[^>]*>/g, "").trim();
    if (textContent.length < 20) {
      toast.error("Please write a bit more (at least 20 chars) before generating insights!");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journalId }),
      });

      const data = await res.json();

      if (res.ok) {
        const newInsights = [...insights, data];
        setInsights(newInsights);
        if (onUpdate) onUpdate(title, content, newInsights);
        toast.success("AI Insights generated ✨");
      } else {
        toast.error(data.error || "Failed to generate insights");
      }
    } catch {
      toast.error("Something went wrong with the AI connection");
    } finally {
      setIsGenerating(false);
    }
  };

  const getMoodEmoji = (mood: string) => {
    const m = mood.toLowerCase();
    if (m.includes("happy") || m.includes("joy")) return "😊";
    if (m.includes("stress") || m.includes("anxious")) return "😰";
    if (m.includes("focus") || m.includes("productive")) return "🎯";
    if (m.includes("sad") || m.includes("low")) return "😔";
    if (m.includes("calm") || m.includes("peace")) return "🌊";
    if (m.includes("angry") || m.includes("frustrated")) return "😤";
    return "✨";
  };

  const getMoodStyles = (mood: string) => {
    const m = mood.toLowerCase();
    if (m.includes("happy")) return "bg-amber-400/10 text-amber-300 border-amber-400/20";
    if (m.includes("stress")) return "bg-rose-400/10 text-rose-300 border-rose-400/20";
    if (m.includes("focus")) return "bg-emerald-400/10 text-emerald-300 border-emerald-400/20";
    if (m.includes("sad")) return "bg-sky-400/10 text-sky-300 border-sky-400/20";
    if (m.includes("calm")) return "bg-indigo-400/10 text-indigo-300 border-indigo-400/20";
    if (m.includes("angry")) return "bg-orange-400/10 text-orange-300 border-orange-400/20";
    return "bg-zinc-800/50 text-zinc-300 border-zinc-700/50";
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Editor Content Area */}
      <div className="flex-grow overflow-y-auto w-full pt-14 pb-32">
        {/* Left-Aligned Layout Shift (Notion Style) */}
        <div className="max-w-[750px] w-full ml-4 md:ml-12 lg:ml-20 xl:ml-32 px-6 sm:px-10 flex flex-col min-h-full">
          
          {/* Top Bar: Title + Save Controls */}
          <div className="flex items-center justify-between border-b border-zinc-800/40 pb-6 mb-8 gap-6">
            {/* Title Input */}
            <input
              type="text"
              placeholder="Untitled Document"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (onUpdate) onUpdate(e.target.value, content, insights);
              }}
              className="flex-grow bg-transparent text-4xl md:text-[3.2rem] leading-tight font-extrabold tracking-tight text-white placeholder-zinc-700 focus:outline-none focus:ring-0 min-w-0"
            />

            {/* Action Elements */}
            <div className="flex items-center gap-4 shrink-0">
              {status === "saving" && <span className="text-sm font-medium text-zinc-500">Saving...</span>}
              {status === "saved" && <span className="text-sm font-medium text-emerald-500/80">Saved just now</span>}
              {status === "error" && <span className="text-sm font-medium text-red-500/80">Error saving</span>}

              <button
                onClick={handleGenerateInsight}
                disabled={isGenerating || (!title && !content)}
                className="px-5 py-2 text-sm font-semibold text-white border border-indigo-500/30 bg-indigo-600/10 rounded-xl hover:bg-indigo-600/20 transition-all duration-300 disabled:opacity-50 shadow-[0_0_15px_rgba(99,102,241,0.1)] cursor-pointer flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span className="text-indigo-400 text-lg leading-none">✨</span>
                    Generate Insight
                  </>
                )}
              </button>

              <button
                onClick={handleManualSave}
                disabled={status === "saving" || (!title && !content)}
                className="px-5 py-2 text-sm font-semibold text-zinc-200 border border-zinc-800 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-all duration-200 disabled:opacity-50 shadow-sm cursor-pointer active:scale-[0.98]"
              >
                {status === "saving" ? "Wait..." : "Save"}
              </button>
            </div>
          </div>

          {/* Core Rich Text Editor */}
          <TiptapEditor 
            content={content}
            onChange={(newContent) => {
              setContent(newContent);
              if (onUpdate) onUpdate(title, newContent, insights);
            }}
          />

          {/* Insight Display Section (CAROUSEL UI) */}
          {activeInsight && (
            <div className="mt-16 p-8 rounded-[2rem] bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)]">
                    <span className="text-3xl">✨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">AI Journal Insights</h3>
                    <p className="text-[0.65rem] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">Version {currentIndex + 1} of {insights.length}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Carousel Controls */}
                  <div className="flex items-center gap-2 mr-4 bg-zinc-950/50 p-1.5 rounded-2xl border border-zinc-800/50">
                    <button
                      onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentIndex === 0}
                      className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-20 disabled:hover:bg-transparent transition-all duration-200 cursor-pointer"
                    >
                      <span className="text-xl">←</span>
                    </button>
                    <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
                    <button
                      onClick={() => setCurrentIndex(prev => Math.min(insights.length - 1, prev + 1))}
                      disabled={currentIndex === insights.length - 1}
                      className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-20 disabled:hover:bg-transparent transition-all duration-200 cursor-pointer"
                    >
                      <span className="text-xl">→</span>
                    </button>
                  </div>

                  {/* Mood Badge */}
                  <div className={`px-5 py-2 rounded-2xl text-sm font-bold border flex items-center gap-2.5 shadow-sm transition-all duration-300 ${getMoodStyles(activeInsight.mood)}`}>
                    <span className="text-lg leading-none">{getMoodEmoji(activeInsight.mood)}</span>
                    {activeInsight.mood}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="relative mb-12 pl-8 border-l-2 border-indigo-500/30 group">
                <div className="absolute -left-[2px] top-0 h-0 w-[2px] bg-indigo-500 transition-all duration-1000 group-hover:h-full" />
                <p className="text-zinc-300 text-[1.1rem] leading-relaxed font-medium italic tracking-wide">
                  "{activeInsight.summary}"
                </p>
              </div>

              {/* Tags Section */}
              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">Associated Tags</p>
                <div className="flex flex-wrap gap-2.5">
                  {activeInsight.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-xl bg-zinc-800/40 border border-zinc-700/30 text-zinc-400 text-[0.7rem] font-bold hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all duration-300 cursor-default"
                    >
                      #{tag.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
