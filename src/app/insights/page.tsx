"use client";

import { useState, useEffect } from "react";
import RangeCalendar from "../components/RangeCalendar";
import toast from "react-hot-toast";

interface AISummary {
  summary: string;
  patterns: string[];
  overallMood: string;
}

export default function InsightsPage() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISummary | null>(null);
  const [historyList, setHistoryList] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/ai/summary-range/history");
      const data = await res.json();
      if (res.ok) setHistoryList(data.history);
    } catch (err) {
      console.error("History fetch error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleRangeSelect = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
    setResult(null); // Reset result when range changes
  };

  const handleSelectHistory = (item: any) => {
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    setResult(item.output);
    // Smooth scroll to report
    const reportSection = document.getElementById("report-section");
    if (reportSection) {
      reportSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGenerateSummary = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const response = await fetch("/api/ai/summary-range", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate summary");
      }

      setResult(data.aiSummary);
      toast.success("Summary generated successfully!");
      fetchHistory(); // Refresh sidebar
    } catch (error: any) {
      console.error("Generation Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formatDateLabel = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const canGenerate = startDate && endDate && !loading;

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] pt-20">
      {/* Left Panel - History (25-30%) */}
      <aside className="w-full md:w-[300px] border-r border-zinc-800 bg-[#09090b] p-6 flex flex-col shrink-0 overflow-y-auto max-h-[calc(100vh-64px)]">
        <h2 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-6 px-2">
          Past Summaries
        </h2>
        <div className="flex flex-col gap-2">
          {historyList.length === 0 && (
            <p className="text-zinc-600 text-xs px-2 italic">No summaries generated yet.</p>
          )}
          {historyList.map((item) => {
            const isActive = startDate === item.startDate && endDate === item.endDate && result?.summary === item.output.summary;
            return (
              <button
                key={item._id}
                onClick={() => handleSelectHistory(item)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${isActive
                    ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/30"
                    : "bg-transparent text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200 border-transparent hover:border-zinc-800"
                  }`}
              >
                {formatDateLabel(item.startDate)} — {formatDateLabel(item.endDate)}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Right Panel - Main Area (Remaining) */}
      <main className="flex-grow p-8 bg-black overflow-y-auto h-[calc(100vh-64px)]">
        <div className="max-w-4xl mx-auto space-y-8">
          <header>
            <h1 className="text-3xl font-bold text-white mb-2">Insights Dashboard</h1>
            <p className="text-zinc-400 text-sm">
              Generate AI-powered summaries for your journaling history.
            </p>
          </header>

          {/* Range Selector Section */}
          <section className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-shrink-0">
              <h3 className="text-lg font-semibold text-zinc-200 mb-6 font-geist-sans">Select Date Range</h3>
              <RangeCalendar onRangeSelect={handleRangeSelect} />
            </div>

            <div className="flex-grow flex flex-col justify-between h-full py-2 space-y-10">
              <div className="space-y-6">
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Selection Overview</h3>
                <div className="flex items-center gap-4 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                  <div className="flex-1">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Start</p>
                    <p className="text-xl font-bold text-white truncate">{formatDateLabel(startDate)}</p>
                  </div>
                  <div className="w-8 h-[1px] bg-zinc-700" />
                  <div className="flex-1">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">End</p>
                    <p className="text-xl font-bold text-white truncate">{formatDateLabel(endDate)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-zinc-500 italic">
                  * Select a window between 3 and 15 days to generate analytical insights.
                </p>
                <button
                  onClick={handleGenerateSummary}
                  className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
                  disabled={!canGenerate}
                >
                  <span className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}>Generate Summary</span>
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                  {!loading && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Result Display Section */}
          <section id="report-section" className="space-y-6 scroll-mt-24">
            <h3 className="text-lg font-semibold text-zinc-200">Report</h3>

            {!result && !loading && (
              <div className="min-h-[300px] rounded-3xl border-2 border-dashed border-zinc-800 bg-zinc-900/10 flex flex-col items-center justify-center text-center p-10 group hover:bg-zinc-900/20 transition-all">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <p className="text-zinc-500 font-medium">Summary will appear here</p>
                <p className="text-zinc-600 text-xs mt-2 max-w-xs">
                  Select a date range and click generate to see AI-powered analytical insights.
                </p>
              </div>
            )}

            {loading && (
              <div className="min-h-[400px] rounded-3xl border border-zinc-800 bg-zinc-900/20 p-8 space-y-8 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-32 bg-zinc-800 rounded-lg" />
                  <div className="h-10 w-24 bg-zinc-800 rounded-full" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-zinc-800 rounded" />
                  <div className="h-4 w-5/6 bg-zinc-800 rounded" />
                  <div className="h-4 w-4/6 bg-zinc-800 rounded" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="h-24 bg-zinc-800 rounded-2xl" />
                  <div className="h-24 bg-zinc-800 rounded-2xl" />
                  <div className="h-24 bg-zinc-800 rounded-2xl" />
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-8 shadow-2xl space-y-10 animate-in fade-in zoom-in-95 duration-500">
                {/* Header with Mood Badge */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h4 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Period Mood</h4>
                    <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      {result.overallMood}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Range</p>
                    <p className="text-zinc-300 font-medium">{formatDateLabel(startDate)} — {formatDateLabel(endDate)}</p>
                  </div>
                </div>

                {/* Summary Text */}
                <div className="space-y-4">
                  <h4 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Cohesive Summary</h4>
                  <p className="text-white text-lg leading-relaxed font-geist-sans">
                    {result.summary}
                  </p>
                </div>

                {/* Patterns Section */}
                <div className="space-y-6 pt-4">
                  <h4 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Identified Patterns</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.patterns.map((pattern, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors flex items-start gap-3 group"
                      >
                        <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-400 font-bold group-hover:bg-indigo-500 group-hover:text-white transition-all">
                          {i + 1}
                        </div>
                        <p className="text-zinc-300 text-sm font-medium leading-tight">
                          {pattern}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
