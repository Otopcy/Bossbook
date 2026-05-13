"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

const DAYS_SHORT = ["L", "M", "M", "J", "V", "S", "D"];
const MONTHS_SHORT = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

const TODAY = new Date();
const TODAY_YMD = toYMD(TODAY);

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function fromYMD(s: string) {
  const [y,m,d] = s.split("-").map(Number);
  return new Date(y,m-1,d);
}

interface Props {
  value: string;
  onChange: (date: string) => void;
  className?: string;
  placeholder?: string;
}

export function DatePicker({ value, onChange, className, placeholder = "Sélectionner une date" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value for calendar view
  const initialDate = value ? fromYMD(value) : TODAY;
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [editingMY, setEditingMY] = useState(false);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setEditingMY(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); }
    else setViewMonth(m => m-1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1); }
    else setViewMonth(m => m+1);
  };

  const firstDay    = new Date(viewYear, viewMonth, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday start
  const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
  const daysInPrev  = new Date(viewYear, viewMonth,   0).getDate();

  const cells: { date: string; inMonth: boolean }[] = [];
  for (let i = startOffset-1; i >= 0; i--)
    cells.push({ date: toYMD(new Date(viewYear, viewMonth-1, daysInPrev-i)), inMonth: false });
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: toYMD(new Date(viewYear, viewMonth, i)), inMonth: true });
  }
  let next = 1;
  while (cells.length < 42) // 6 rows max
    cells.push({ date: toYMD(new Date(viewYear, viewMonth+1, next++)), inMonth: false });

  const handleDayClick = (date: string) => {
    onChange(date);
    setIsOpen(false);
  };

  const isSelected = (d: string) => d === value;
  const isToday   = (d: string) => d === TODAY_YMD;

  const displayValue = value ? fromYMD(value).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : placeholder;

  const yearOptions = Array.from({ length: 11 }, (_, i) => TODAY.getFullYear() - 5 + i);

  return (
    <div className={`relative ${className || ""}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none text-gray-900 dark:text-gray-100 flex items-center justify-between transition-all"
      >
        <span className={value ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-400"}>
          {displayValue}
        </span>
        <CalendarIcon className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-[100] mt-2 top-full left-0 bg-white dark:bg-[#1c2537] rounded-[18px] shadow-2xl w-[256px] overflow-hidden border border-gray-100 dark:border-white/[0.05]">
          <div className="flex items-center justify-between px-3 pt-3 pb-1.5">
            <button type="button" onClick={prevMonth}
              className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/[0.05] hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-all flex items-center justify-center text-gray-500">
              <ChevronLeft className="w-3 h-3" />
            </button>

            {editingMY ? (
              <div className="flex items-center gap-1">
                <select
                  value={viewMonth}
                  onChange={e => setViewMonth(Number(e.target.value))}
                  className="text-[11px] font-bold border-none outline-none bg-gray-50 dark:bg-white/[0.05] text-[#011223] dark:text-[#5b9de8] rounded-lg px-1 py-0.5 cursor-pointer"
                >
                  {MONTHS_SHORT.map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                  ))}
                </select>
                <select
                  value={viewYear}
                  onChange={e => setViewYear(Number(e.target.value))}
                  className="text-[11px] font-bold border-none outline-none bg-gray-50 dark:bg-white/[0.05] text-[#011223] dark:text-[#5b9de8] rounded-lg px-1 py-0.5 cursor-pointer"
                >
                  {yearOptions.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <button type="button" onClick={() => setEditingMY(false)}
                  className="text-[10px] text-gray-400 hover:text-gray-700 px-1">✓</button>
              </div>
            ) : (
              <button type="button" onClick={() => setEditingMY(true)}
                className="text-[12px] font-bold hover:underline transition-all text-[#011223] dark:text-[#5b9de8]"
                title="Modifier mois/année">
                {MONTHS_SHORT[viewMonth]} {viewYear}
              </button>
            )}

            <button type="button" onClick={nextMonth}
              className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/[0.05] hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-all flex items-center justify-center text-gray-500">
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-7 px-2 pb-0.5">
            {DAYS_SHORT.map((d, i) => (
              <div key={i} className="text-center text-[9px] font-bold text-gray-300 dark:text-gray-600 py-0.5">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 px-2 pb-3">
            {cells.map(({ date, inMonth }) => {
              const selected = isSelected(date);
              const todayC = isToday(date);
              return (
                <div key={date} className="flex items-center justify-center py-[2px]">
                  <button
                    type="button"
                    onClick={() => handleDayClick(date)}
                    className={`w-7 h-7 rounded-full text-[11px] font-semibold transition-all flex items-center justify-center ${
                      selected
                        ? "bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223]"
                        : inMonth
                        ? todayC
                          ? "text-[#011223] dark:text-[#5b9de8] ring-1 ring-[#011223]/30 dark:ring-[#5b9de8]/30 hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.08]"
                        : "text-gray-300 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    }`}
                  >
                    {new Date(date + "T12:00:00").getDate()}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
