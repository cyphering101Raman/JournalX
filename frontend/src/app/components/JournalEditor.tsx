"use client";

import { useState, useEffect, useRef } from "react";
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

function countWords(html: string): number {
  if (!html) return 0;
  const text = html.replace(/<[^>]*>/g, " ").trim();
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
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
  const [status, setStatus] = useState<"idle" | "typing" | "saving" | "saved" | "error">("saved");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const latestRef = useRef({ journalId, title: initialTitle, content: initialContent, isDirty: false });

  // Save outgoing journal entry when switching journalId or unmounting
  useEffect(() => {
    return () => {
      if (latestRef.current.isDirty) {
        const { journalId: saveId, title: saveTitle, content: saveContent } = latestRef.current;
        latestRef.current.isDirty = false;
        api.post("/journal/save", { journalId: saveId, title: saveTitle, content: saveContent }).catch(() => {});
      }
    };
  }, [journalId]);

  // Update internal state if active journal changes
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setInsights(initialInsights);
    setStatus("saved");
    latestRef.current = { journalId, title: initialTitle, content: initialContent, isDirty: false };
  }, [journalId]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setStatus("typing");
    latestRef.current.title = newTitle;
    latestRef.current.isDirty = true;
    if (onUpdate) onUpdate(newTitle, content);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setStatus("typing");
    latestRef.current.content = newContent;
    latestRef.current.isDirty = true;
    if (onUpdate) onUpdate(title, newContent);
  };

  // Auto-save logic (1.2s debounce after typing stops)
  useEffect(() => {
    if (!latestRef.current.isDirty) return;

    const currentSaveId = journalId;
    const handler = setTimeout(async () => {
      if (!latestRef.current.isDirty) return;
      setStatus("saving");
      try {
        await api.post("/journal/save", {
          journalId: currentSaveId,
          title: latestRef.current.title,
          content: latestRef.current.content,
        });
        latestRef.current.isDirty = false;
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, 1200);

    return () => {
      clearTimeout(handler);
    };
  }, [title, content, journalId]);

  const handleManualSave = async () => {
    if (!title && !content) return;
    setStatus("saving");
    try {
      await api.post("/journal/save", {
        journalId,
        title: latestRef.current.title,
        content: latestRef.current.content,
      });
      latestRef.current.isDirty = false;
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

  const wordCount = countWords(content);
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0c13] text-slate-100 overflow-hidden relative">
      {/* Main Top Header */}
      <div className="px-8 pt-8 pb-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Untitled Journal..."
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-3xl md:text-4xl font-serif font-normal bg-transparent border-none outline-none text-white placeholder-zinc-700 tracking-tight"
          />

          {/* Top Right Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium transition-all ${
                status === "typing"
                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  : status === "saving"
                  ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  : status === "error"
                  ? "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  status === "typing"
                    ? "bg-amber-400 animate-pulse"
                    : status === "saving"
                    ? "bg-indigo-400 animate-pulse"
                    : status === "error"
                    ? "bg-rose-400"
                    : "bg-emerald-400"
                }`}
              />
              {status === "typing"
                ? "Typing..."
                : status === "saving"
                ? "Saving..."
                : status === "error"
                ? "Save Error"
                : "Saved"}
            </span>

            <button
              onClick={handleGenerateInsight}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600/80 to-indigo-600/80 text-white hover:from-purple-500 hover:to-indigo-500 transition-all border border-purple-400/30 shadow-md shadow-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"
            >
              <span>✨</span>
              <span>{isGenerating ? "Analyzing..." : "Generate AI Insight"}</span>
            </button>
          </div>
        </div>

        {/* Subheader Metadata */}
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
          <span>☀️ 28°C</span>
          <span>•</span>
          <span>New Delhi</span>
          <span>•</span>
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Editor Main Content */}
      <div className="flex-1 flex overflow-hidden px-8 pb-4">
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          <TiptapEditor
            content={content}
            onChange={(newContent) => handleContentChange(newContent)}
          />
        </div>

        {/* AI Insights Log Sidebar */}
        {insights.length > 0 && (
          <div className="w-72 ml-6 border-l border-white/5 pl-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <span>✨</span> Insights Log
            </h3>
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#141522] border border-white/5 flex flex-col gap-2.5 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-semibold border border-purple-500/20">
                    {insight.mood || "Reflection"}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{insight.summary}</p>
                {insight.tags && insight.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {insight.tags.map((t, i) => (
                      <span key={i} className="text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full">
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

      {/* Footer Controls Bar */}
      <div className="h-16 px-8 border-t border-white/5 flex items-center justify-between bg-[#090a0f] text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full border border-zinc-500" />
          <span>Writing privately...</span>
        </div>

        <div className="flex items-center gap-6">
          <span>Word count: {wordCount} • {readTime} min read</span>

          <button
            onClick={handleManualSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-[#0c0d15] bg-[#9da0ff] hover:bg-[#8b8eff] active:scale-[0.98] transition-all shadow-md shadow-indigo-500/15"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>Save Entry</span>
          </button>
        </div>
      </div>
    </div>
  );
}
