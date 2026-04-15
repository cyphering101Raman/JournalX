"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import JournalSidebar from "./JournalSidebar";
import JournalEditor from "./JournalEditor";

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
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  const getOrdinalSuffix = (n: number) => {
    // Handling 1st, 2nd, 3rd logic accurately based on remainder tracking
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

export default function JournalWorkspace() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [activeJournalId, setActiveJournalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all journals on component mount
  useEffect(() => {
    const loadJournals = async () => {
      try {
        const res = await fetch("/api/journal/all");
        if (res.ok) {
          const data = await res.json();
          // Remap Mongo backend _id safely to local generic string ID framework
          const mapped = data.journals.map((j: any) => ({
            id: j._id,
            title: j.title,
            content: j.content,
            insights: j.insights,
          }));
          setJournals(mapped);
          
          if (mapped.length > 0) {
            setActiveJournalId(mapped[0].id);
          }
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
    try {
      // Intentionally trigger API post early to map ID safely right off the bat
      const res = await fetch("/api/journal/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: defaultTitle, content: "" })
      });
      
      if (res.ok) {
        const data = await res.json();
        const newJournal = {
          id: data.journal._id,
          title: data.journal.title,
          content: data.journal.content,
          insights: data.journal.insights || []
        };
        
        // Add securely to the top of the local state array natively
        setJournals([newJournal, ...journals]);
        setActiveJournalId(newJournal.id);
      }
    } catch (e) {
      console.error("Failed to rapidly prep a new notebook block");
    }
  };

  const handleUpdateJournal = (title: string, content: string, insights?: any[]) => {
    setJournals(prev => prev.map(journal => 
      journal.id === activeJournalId 
        ? { ...journal, title, content, insights: insights || journal.insights }
        : journal
    ));
  };

  const handleDeleteJournal = async (id: string) => {
    try {
      const res = await fetch(`/api/journal/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Failed to delete journal");
        return;
      }

      // Safe state execution
      const idx = journals.findIndex(j => j.id === id);
      const newJournals = journals.filter(j => j.id !== id);
      
      setJournals(newJournals);
      
      if (activeJournalId === id) {
        if (newJournals.length === 0) {
          setActiveJournalId(null);
        } else {
          const nextItem = newJournals[idx] || newJournals[idx - 1] || newJournals[0];
          setActiveJournalId(nextItem.id);
        }
      }
      
      toast.success("Journal deleted");
    } catch (error) {
      toast.error("An error occurred trying to delete");
    }
  };

  const activeJournal = journals.find(j => j.id === activeJournalId);

  return (
    <>
      <JournalSidebar 
        journals={journals} 
        activeId={activeJournalId || ""} 
        onCreate={handleCreateNew} 
        onSelect={(id: string) => setActiveJournalId(id)} 
        onDelete={handleDeleteJournal}
      />
      <main className="flex-grow flex flex-col overflow-hidden bg-[#0a0a0a] relative z-0">
        {loading && (
           <div className="flex items-center justify-center h-full w-full text-zinc-500 animate-pulse">
             Loading journals...
           </div>
        )}
        
        {!loading && activeJournal && (
          <JournalEditor 
            key={activeJournal.id} 
            journalId={activeJournal.id}
            initialTitle={activeJournal.title} 
            initialContent={activeJournal.content} 
            initialInsights={activeJournal.insights}
            onUpdate={handleUpdateJournal}
          />
        )}

        {!loading && !activeJournal && (
           <div className="flex items-center justify-center h-full w-full text-zinc-500">
             Select or complete a new journal to begin writing...
           </div>
        )}
      </main>
    </>
  );
}
