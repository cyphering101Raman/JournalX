"use client";

interface Journal {
  id: string;
  title: string;
  content: string;
}

interface JournalSidebarProps {
  journals: Journal[];
  activeId: string;
  onCreate: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function JournalSidebar({
  journals,
  activeId,
  onCreate,
  onSelect,
  onDelete,
}: JournalSidebarProps) {
  return (
    <aside className="w-[280px] bg-[#0c0d15] border-r border-white/5 flex flex-col p-5 shrink-0 relative z-10 select-none">
      {/* New Journal Button */}
      <button
        onClick={onCreate}
        className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-[#9da0ff] hover:bg-[#8b8eff] text-[#0c0d15] active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/10 mb-6"
      >
        <span className="text-lg leading-none font-medium">+</span>
        <span>New Journal</span>
      </button>

      {/* Entries List Header */}
      <div className="flex-grow overflow-y-auto pr-1 no-scrollbar">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 px-2">
          Your Entries
        </h3>
        <ul className="flex flex-col gap-1.5">
          {journals.map((journal) => {
            const isActive = activeId === journal.id;

            return (
              <li key={journal.id} className="relative group">
                <button
                  onClick={() => onSelect(journal.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-center gap-3 relative border ${isActive
                      ? "bg-[#1c1e30] border-indigo-500/20 text-white shadow-md shadow-indigo-950/40"
                      : "bg-transparent border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                    }`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`shrink-0 ${isActive ? "text-indigo-400" : "text-zinc-500"}`}
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>

                  <div className="flex-1 min-w-0 pr-6">
                    <p className={`text-xs font-semibold truncate ${isActive ? "text-white" : "text-zinc-300"}`}>
                      {journal.title}
                    </p>
                  </div>

                  {isActive && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#9da0ff] shadow-[0_0_8px_#9da0ff] transition-opacity duration-200 group-hover:opacity-0" />
                  )}
                </button>

                {/* Delete icon on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(journal.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-400 hover:bg-white/10 transition-all z-10"
                  title="Delete journal"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Quote Banner */}
      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#3b2042] via-[#241738] to-[#10121d] border border-purple-400/20 shadow-xl relative overflow-hidden group">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-6 -top-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />
        <p className="relative z-10 text-xs font-serif font-normal text-amber-100/90 leading-relaxed drop-shadow-sm">
          &ldquo;A calmer mind builds a clearer tomorrow.&rdquo;
        </p>
      </div>
    </aside>
  );
}
