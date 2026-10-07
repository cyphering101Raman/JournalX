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

export default function JournalSidebar({ journals, activeId, onCreate, onSelect, onDelete }: JournalSidebarProps) {
  return (
    <aside className="w-[300px] border-r border-zinc-800 bg-[#09090b] shadow-[1px_0_15px_-5px_rgba(0,0,0,0.5)] flex flex-col p-6 shrink-0 relative z-10">
      {/* New Journal Button */}
      <button 
        onClick={onCreate}
        className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm border border-zinc-800 bg-zinc-900/80 shadow-sm hover:bg-zinc-800 hover:border-zinc-700 cursor-pointer transition-all duration-200 flex items-center justify-between text-zinc-200 hover:text-white group active:scale-[0.98]"
      >
        <span>New Journal</span>
        <span className="text-zinc-500 group-hover:text-white transition-colors text-xl leading-none">+</span>
      </button>

      {/* Journal List */}
      <div className="mt-10 flex-grow overflow-y-auto pr-2">
        <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2">Your Entries</h3>
        <ul className="flex flex-col gap-2">
          {journals.map((journal) => (
            <li key={journal.id} className="relative group">
              <button 
                onClick={() => onSelect(journal.id)}
                className={`w-full text-left px-4 py-3 pr-11 rounded-xl text-sm font-medium transition-all duration-200 truncate cursor-pointer ${
                  activeId === journal.id 
                    ? "bg-zinc-800 text-zinc-50 shadow-sm" 
                    : "bg-transparent text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                }`}
              >
                {journal.title}
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(journal.id);
                }}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center cursor-pointer ${
                  activeId === journal.id 
                    ? "text-zinc-400 hover:text-red-400 hover:bg-zinc-700" 
                    : "text-zinc-500 hover:text-red-400 hover:bg-zinc-800"
                }`}
                title="Delete journal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
