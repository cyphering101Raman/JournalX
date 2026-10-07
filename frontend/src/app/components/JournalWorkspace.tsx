"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import JournalSidebar from "./JournalSidebar";
import JournalEditor from "./JournalEditor";
import api from "@/app/lib/axios";

interface Journal {
  id: string;
  title: string;
  content: string;
  insights: {
    mood: string;
    summary: string;
    tags: string[];
    createdAt: Date;
  }[];
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function JournalWorkspace() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [activeJournalId, setActiveJournalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all journals on component mount
  useEffect(() => {
    const loadJournals = async () => {
      try {
        const { data } = await api.get("/journal/all");
        const mapped = (data.journals || []).map((j: any) => ({
          id: j._id,
          title: j.title,
          content: j.content,
          insights: j.insights || [],
        }));
        setJournals(mapped);

        if (mapped.length > 0) {
          setActiveJournalId(mapped[0].id);
        }
      } catch (e) {
        console.error("Failed to load journals");
      } finally {
        setLoading(false);
      }
    };
    loadJournals();
  }, []);

  const handleCreateNew = async () => {
    const defaultTitle = getFormattedDate();
    const dateKey = new Date().toISOString();
    try {
      const { data } = await api.post("/journal/save", {
        dateKey,
        title: defaultTitle,
        content: "",
      });

      const newJournal = {
        id: data.journal._id,
        title: data.journal.title,
        content: data.journal.content,
        insights: data.journal.insights || [],
      };

      setJournals((prev) => [newJournal, ...prev.filter((j) => j.id !== newJournal.id)]);
      setActiveJournalId(newJournal.id);
    } catch (e) {
      console.error("Failed to prep a new journal entry");
      toast.error("Failed to create new journal");
    }
  };

  const handleUpdateJournal = (title: string, content: string, insights?: any[]) => {
    setJournals((prev) =>
      prev.map((journal) =>
        journal.id === activeJournalId
          ? { ...journal, title, content, insights: insights || journal.insights }
          : journal
      )
    );
  };

  const handleDeleteJournal = async (id: string) => {
    try {
      await api.delete(`/journal/${id}`);

      const filtered = journals.filter((j) => j.id !== id);
      setJournals(filtered);

      if (activeJournalId === id) {
        setActiveJournalId(filtered.length > 0 ? filtered[0].id : null);
      }
      toast.success("Journal deleted");
    } catch {
      toast.error("Failed to delete journal");
    }
  };

  const activeJournal = journals.find((j) => j.id === activeJournalId);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading workspace…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)] overflow-hidden">
      <JournalSidebar
        journals={journals}
        activeId={activeJournalId || ""}
        onSelect={(id) => setActiveJournalId(id)}
        onCreate={handleCreateNew}
        onDelete={handleDeleteJournal}
      />

      {activeJournal ? (
        <JournalEditor
          key={activeJournal.id}
          journalId={activeJournal.id}
          initialTitle={activeJournal.title}
          initialContent={activeJournal.content}
          initialInsights={activeJournal.insights}
          onUpdate={handleUpdateJournal}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/20 text-slate-500 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-2xl mb-4 shadow-xl">
            📓
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No Active Journal Selected</h3>
          <p className="text-xs text-slate-500 max-w-sm mb-6">
            Select an existing entry from the left sidebar or create a new journal to start writing.
          </p>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 transition-all"
          >
            Create New Journal Entry
          </button>
        </div>
      )}
    </div>
  );
}
