"use client";

import { useState, useMemo } from "react";

interface RangeCalendarProps {
  onRangeSelect: (start: string | null, end: string | null) => void;
  minDays?: number;
  maxDays?: number;
}

export default function RangeCalendar({ onRangeSelect, minDays = 3, maxDays = 15 }: RangeCalendarProps) {
  const now = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);
  const firstDayOfMonth = useMemo(() => new Date(year, month, 1).getDay(), [year, month]);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date > startDate && date < endDate;
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day);

    // If both are set, or if we want to reset
    if (startDate && endDate) {
      setStartDate(clickedDate);
      setEndDate(null);
      setError(null);
      onRangeSelect(formatDate(clickedDate), null);
      return;
    }

    // If nothing is set
    if (!startDate) {
      setStartDate(clickedDate);
      onRangeSelect(formatDate(clickedDate), null);
      return;
    }

    // If start is set, set end
    if (startDate && !endDate) {
      // Prevent selecting same or earlier date as start (logic can be adjusted)
      if (clickedDate <= startDate) {
        setStartDate(clickedDate);
        onRangeSelect(formatDate(clickedDate), null);
        return;
      }

      const diffTime = Math.abs(clickedDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include start and end

      if (diffDays < minDays || diffDays > maxDays) {
        setError(`Please select a range between ${minDays} and ${maxDays} days.`);
        // Don't set end date if invalid
        return;
      }

      setEndDate(clickedDate);
      setError(null);
      onRangeSelect(formatDate(startDate), formatDate(clickedDate));
    }
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="w-full max-w-sm bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">
          {months[month]} <span className="text-zinc-500 font-medium">{year}</span>
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-zinc-500 uppercase tracking-tighter py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 relative">
        {blanks.map((b) => (
          <div key={`blank-${b}`} className="aspect-square" />
        ))}
        {days.map((d) => {
          const date = new Date(year, month, d);
          const isStart = startDate && isSameDay(date, startDate);
          const isEnd = endDate && isSameDay(date, endDate);
          const inRange = isInRange(date);
          const isSelected = isStart || isEnd;

          return (
            <div key={d} className="relative aspect-square p-0.5">
              {inRange && (
                <div 
                  className={`absolute inset-y-0.5 z-0 ${
                    isSameDay(date, new Date(year, month, 1)) || d === 1 ? 'rounded-l-full' : ''
                  } ${
                    isSameDay(date, new Date(year, month, daysInMonth)) || d === daysInMonth ? 'rounded-r-full' : ''
                  } bg-indigo-500/10 w-full`} 
                />
              )}
              {/* Range background bridge */}
              {inRange && <div className="absolute inset-0 z-0 bg-indigo-500/10" />}
              {isStart && endDate && <div className="absolute inset-y-0.5 right-0 z-0 bg-indigo-500/10 w-1/2" />}
              {isEnd && startDate && <div className="absolute inset-y-0.5 left-0 z-0 bg-indigo-500/10 w-1/2" />}

              <button
                onClick={() => handleDateClick(d)}
                className={`relative z-10 w-full h-full flex items-center justify-center rounded-full text-xs font-semibold tracking-tight transition-all duration-200 ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                    : inRange
                    ? "text-indigo-300 hover:bg-indigo-500/20"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                }`}
              >
                {d}
              </button>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-2 items-center animate-in fade-in slide-in-from-top-2 duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p className="text-[11px] text-red-400 font-medium leading-tight">{error}</p>
        </div>
      )}
    </div>
  );
}
