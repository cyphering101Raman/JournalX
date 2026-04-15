"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface JournalEditorProps {
  journalId: string;
  initialTitle?: string;
  initialContent?: string;
  onUpdate?: (title: string, content: string) => void;
}

import TiptapEditor from "./TiptapEditor";

export default function JournalEditor({ journalId, initialTitle = "", initialContent = "", onUpdate }: JournalEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

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
                if (onUpdate) onUpdate(e.target.value, content);
              }}
              className="flex-grow bg-transparent text-4xl md:text-[3.2rem] leading-tight font-extrabold tracking-tight text-white placeholder-zinc-700 focus:outline-none focus:ring-0 min-w-0"
            />

            {/* Save Elements */}
            <div className="flex items-center gap-4 shrink-0">
              {status === "saving" && <span className="text-sm font-medium text-zinc-500">Saving...</span>}
              {status === "saved" && <span className="text-sm font-medium text-emerald-500/80">Saved just now</span>}
              {status === "error" && <span className="text-sm font-medium text-red-500/80">Error saving</span>}

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
              if (onUpdate) onUpdate(title, newContent);
            }}
          />
        </div>
      </div>
    </div>
  );
}
