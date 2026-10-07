"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import TiptapEditor from "./TiptapEditor";
import api from "@/app/lib/axios";

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

export default function JournalEditor({
  journalId,
  initialTitle = "",
  initialContent = "",
  initialInsights = [],
  onUpdate,
}: JournalEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [insights, setInsights] = useState(initialInsights);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isGenerating, setIsGenerating] = useState(false);

  // Update internal state if active journal changes
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setInsights(initialInsights);
    setStatus("idle");
  }, [journalId, initialTitle, initialContent, initialInsights]);

  // Auto-save logic (5s debounce)
  useEffect(() => {
    if (!title && !content) return;

    const handler = setTimeout(async () => {
      setStatus("saving");
      try {
        await api.post("/journal/save", { journalId, title, content });
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } catch {
        setStatus("error");
      }
    }, 5000);

    return () => clearTimeout(handler);
  }, [title, content, journalId]);

  const handleManualSave = async () => {
    if (!title && !content) return;
    setStatus("saving");
    try {
      await api.post("/journal/save", { journalId, title, content });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
      toast.success("Saved your entry!");
    } catch {
      setStatus("error");
      toast.error("Failed to save");
    }
  };

  const handleGenerateInsight = async () => {
    const textContent = content.replace(/<[^>]*>/g, "").trim();
    if (textContent.length < 20) {
      toast.error("Please write a bit more (at least 20 chars) before generating insights!");
      return;
    }

    setIsGenerating(true);
    try {
      const { data } = await api.post("/ai/insight", { journalId, content });
      const newInsights = [...insights, data];
      setInsights(newInsights);
      if (onUpdate) onUpdate(title, content, newInsights);
      toast.success("AI Insights generated ✨");
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to generate insights";
      toast.error(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900/40 text-slate-100 overflow-hidden relative">
      {/* Top Controls Bar */}
      <div className="h-14 border-b border-white/10 px-6 flex items-center justify-between bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Status:</span>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
              status === "saving"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : status === "saved"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : status === "error"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {status === "saving" && "Saving..."}
            {status === "saved" && "Saved"}
            {status === "error" && "Save Error"}
            {status === "idle" && "Ready"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateInsight}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Analyzing..." : "Generate AI Insight ✨"}
          </button>
          <button
            onClick={handleManualSave}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all border border-white/10"
          >
            Save Entry
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar">
          <input
            type="text"
            placeholder="Untitled Journal..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (onUpdate) onUpdate(e.target.value, content);
            }}
            className="text-3xl font-bold bg-transparent border-none outline-none text-white placeholder-slate-600 mb-6"
          />

          <div className="flex-1 min-h-[400px]">
            <TiptapEditor
              content={content}
              onChange={(newContent) => {
                setContent(newContent);
                if (onUpdate) onUpdate(title, newContent);
              }}
            />
          </div>
        </div>

        {/* Right AI Sidebar */}
        {insights.length > 0 && (
          <div className="w-80 border-l border-white/10 bg-slate-950/30 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span>✨</span> AI Insights Log
            </h3>
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col gap-3 shadow-xl backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium">
                    {insight.mood || "Reflection"}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{insight.summary}</p>
                {insight.tags && insight.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {insight.tags.map((t, i) => (
                      <span key={i} className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
