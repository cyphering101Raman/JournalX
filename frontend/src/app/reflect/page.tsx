"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import api from "@/app/lib/axios";
import toast from "react-hot-toast";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  references?: string[];
  createdAt: Date;
}

interface ReflectHistoryItem {
  id: string;
  query: string;
  answer: string;
  references: string[];
  createdAt: string;
}

const QUICK_PROMPTS = [
  "What thoughts have been occupying my mind most lately?",
  "What triggers my anxiety, and how do I cope?",
  "What goals and future plans have I mentioned?",
  "What positive moments or wins have I recorded recently?",
];

const LOCAL_STORAGE_KEY = "journalx_reflect_history";

function formatDateBadge(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  } catch {
    // fallback
  }
  return dateStr;
}

function formatRelativeTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function cleanIsoTimestamps(text: string): string {
  return text.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?/g, (match) => {
    try {
      const d = new Date(match);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    } catch {
      // fallback
    }
    return match;
  });
}

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderFormattedText(rawText: string): React.ReactNode[] {
  const cleaned = cleanIsoTimestamps(rawText);
  const lines = cleaned.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`${keyPrefix}-list`} className="space-y-2.5 my-3 pl-1">
          {currentList.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-zinc-300">
              <span className="text-indigo-400 mt-1 shrink-0 text-[10px]">◆</span>
              <span className="leading-relaxed text-sm">{parseInlineMarkdown(item)}</span>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(`flush-${index}`);
      return;
    }

    const bulletMatch = trimmed.match(/^[\*\-]\s+(.*)$/);
    if (bulletMatch) {
      currentList.push(bulletMatch[1]);
    } else {
      flushList(`flush-before-${index}`);
      elements.push(
        <p key={index} className="leading-relaxed my-2 text-zinc-200 text-sm">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    }
  });

  flushList("flush-end");
  return elements;
}

export default function ReflectPage() {
  const [historyList, setHistoryList] = useState<ReflectHistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load history from Backend or fallback to localStorage
  const loadHistory = async () => {
    try {
      const { data } = await api.get("/rag/history");
      if (data?.history && Array.isArray(data.history)) {
        setHistoryList(data.history);
        return;
      }
    } catch {
      // Backend history endpoint not yet implemented; fallback to localStorage
    }

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setHistoryList(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load local history:", e);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const saveToLocalHistory = (item: ReflectHistoryItem) => {
    setHistoryList((prev) => {
      const updated = [item, ...prev.filter((h) => h.id !== item.id)];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Local storage error:", e);
      }
      return updated;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSelectHistory = (item: ReflectHistoryItem) => {
    setSelectedHistoryId(item.id);
    setMessages([
      {
        id: `${item.id}-q`,
        sender: "user",
        text: item.query,
        createdAt: new Date(item.createdAt),
      },
      {
        id: `${item.id}-a`,
        sender: "ai",
        text: item.answer,
        references: item.references || [],
        createdAt: new Date(item.createdAt),
      },
    ]);
    setSidebarOpen(false);
  };

  const handleNewReflection = () => {
    setSelectedHistoryId(null);
    setMessages([]);
    setInputQuery("");
    setSidebarOpen(false);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your reflection history?")) {
      setHistoryList([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      handleNewReflection();
      toast.success("Reflection history cleared");
    }
  };

  const handleCopyQA = (aiMsg: Message, aiIndex: number) => {
    const priorUserMessage = messages
      .slice(0, aiIndex)
      .reverse()
      .find((m) => m.sender === "user");

    const questionText = priorUserMessage?.text || "";
    const copyText = questionText
      ? `Query: ${questionText}\n\nReflection: ${aiMsg.text}`
      : `Reflection: ${aiMsg.text}`;

    navigator.clipboard.writeText(copyText);
    setCopiedId(aiMsg.id);
    toast.success("Copied Reflection to clipboard!");
    setTimeout(() => {
      setCopiedId((curr) => (curr === aiMsg.id ? null : curr));
    }, 2000);
  };

  const handleSend = async (queryToSend?: string) => {
    const q = (queryToSend || inputQuery).trim();
    if (!q || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: q,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setLoading(true);

    try {
      const response = await api.post("/rag/query", { query: q });
      const data = response.data?.data || response.data;
      const answer = data?.answer || "I couldn't generate a reflection for that question.";
      const references = data?.references || [];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: answer,
        references,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Add to History
      const newHistoryItem: ReflectHistoryItem = {
        id: Date.now().toString(),
        query: q,
        answer,
        references,
        createdAt: new Date().toISOString(),
      };
      setSelectedHistoryId(newHistoryItem.id);
      saveToLocalHistory(newHistoryItem);
    } catch (err: any) {
      console.error("RAG Query Error:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to retrieve reflection. Please try again.";
      toast.error(errMsg);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "I encountered an issue connecting to your journal memory. Please ensure your journal entries have been saved and try again.",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen pt-16 bg-[#07080e] text-zinc-100 overflow-hidden">
      {/* Left Sidebar - Past Reflections */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-[290px] lg:w-[320px] h-full bg-[#09090b] border-r border-white/5 p-5 flex flex-col shrink-0 transition-transform duration-300 md:translate-x-0 pt-20 md:pt-5 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* New Reflection Button */}
        <button
          onClick={handleNewReflection}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all mb-6"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Reflection
        </button>

        {/* Header & Clear */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
            Past Reflections
          </h2>
          {historyList.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Clear all local history"
            >
              Clear
            </button>
          )}
        </div>

        {/* History Items List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {historyList.length === 0 ? (
            <div className="text-center py-8 px-2">
              <p className="text-zinc-600 text-xs italic">
                No past reflections yet. Ask a question to begin.
              </p>
            </div>
          ) : (
            historyList.map((item) => {
              const isActive = selectedHistoryId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectHistory(item)}
                  className={`w-full text-left p-3 rounded-xl text-xs transition-all duration-200 border group ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-300 border-indigo-500/35 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "bg-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 border-transparent hover:border-white/5"
                  }`}
                >
                  <p className="font-medium line-clamp-2 leading-relaxed">
                    {item.query}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-zinc-500">
                    <span>{formatRelativeTime(item.createdAt)}</span>
                    {item.references?.length > 0 && (
                      <span className="flex items-center gap-1 text-indigo-400/80">
                        <span>📅</span>
                        <span>{item.references.length}</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Main Chat/Reflection Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#07080e]">
        {/* Header Bar */}
        <header className="px-6 py-4 border-b border-white/5 bg-[#07080e]/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
              title="Toggle History"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-indigo-100 to-purple-300 bg-clip-text text-transparent">
                Reflect
              </h1>
              <p className="text-xs text-zinc-400">
                Semantic inquiry across your encrypted memories, grounded in exact dates.
              </p>
            </div>
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 max-w-4xl mx-auto w-full custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-indigo-400"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
                Explore your personal patterns
              </h2>
              <p className="text-sm text-zinc-400 max-w-md mb-8">
                Ask anything about your past reflections. JournalX searches your vector memory to synthesize insights and cite specific journal dates.
              </p>

              {/* Quick Prompt Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl w-full text-left">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="p-3.5 rounded-xl border border-white/5 bg-zinc-900/40 hover:bg-zinc-800/60 hover:border-indigo-500/30 text-xs text-zinc-300 transition-all active:scale-[0.98] group flex items-start gap-2.5"
                  >
                    <span className="text-indigo-400 group-hover:scale-110 transition-transform mt-0.5">
                      ✦
                    </span>
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-zinc-900/80 border border-white/10 text-zinc-200 backdrop-blur-md"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/5">
                      <span className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1.5">
                        <span>✦</span> Reflection
                      </span>
                      <button
                        onClick={() => handleCopyQA(msg, index)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Copy Question & Answer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span className="text-emerald-400 font-medium">Copied</span>
                          </>
                        ) : (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                            <span>Copy Reflection</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                  {msg.sender === "user" ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  ) : (
                    <div>
                      {renderFormattedText(msg.text)}
                    </div>
                  )}

                  {/* References Badges */}
                  {msg.references && msg.references.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Referenced Entries:
                      </span>
                      {Array.from(
                        new Set(msg.references.map((d) => formatDateBadge(d)))
                      ).map((formattedDate, index) => (
                        <Link
                          key={index}
                          href="/journal"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition-colors"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                            <line x1="16" x2="16" y1="2" y2="6" />
                            <line x1="8" x2="8" y1="2" y2="6" />
                            <line x1="3" x2="21" y1="10" y2="10" />
                          </svg>
                          {formattedDate}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 px-1">
                  {msg.sender === "user" ? "You" : "JournalX"}
                </span>
              </div>
            ))
          )}

          {/* Loading Animation Bubble */}
          {loading && (
            <div className="flex flex-col items-start">
              <div className="rounded-2xl px-5 py-4 bg-zinc-900/80 border border-white/10 text-zinc-400 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                </div>
                <span className="text-xs text-zinc-400">
                  Searching vector memories & synthesizing reflection...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Bar */}
        <div className="p-4 sm:p-6 border-t border-white/5 bg-[#07080e]/90 backdrop-blur-md shrink-0">
          <div className="max-w-4xl mx-auto flex items-end gap-3">
            <div className="flex-1 relative rounded-2xl bg-zinc-900/90 border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <textarea
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your thoughts, memories, or habits... (Press Enter to send)"
                rows={1}
                className="w-full bg-transparent px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none max-h-32 min-h-[48px]"
              />
            </div>

            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || loading}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-indigo-500 hover:to-purple-500 active:scale-95 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center shrink-0"
              title="Send inquiry"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
