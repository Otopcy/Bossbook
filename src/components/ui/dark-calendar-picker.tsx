"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BRAND    = "#011223";
const BRAND_10 = "rgba(1,18,35,0.07)";

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
  onApply: (start: string, end: string) => void;
  onClose: () => void;
}

export function DarkCalendarPicker({ onApply, onClose }: Props) {
  const [viewYear,   setViewYear]   = useState(TODAY.getFullYear());
  const [viewMonth,  setViewMonth]  = useState(TODAY.getMonth());
  const [startDate,  setStartDate]  = useState<string | null>(null);
  const [endDate,    setEndDate]    = useState<string | null>(null);
  const [hoverDate,  setHoverDate]  = useState<string | null>(null);
  const [editingMY,  setEditingMY]  = useState(false); // editing month/year inline

  // Only allow navigating to current month or past
  const isCurrentOrFuture = viewYear > TODAY.getFullYear() ||
    (viewYear === TODAY.getFullYear() && viewMonth >= TODAY.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); }
    else setViewMonth(m => m-1);
  };
  const nextMonth = () => {
    if (isCurrentOrFuture) return; // past only
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1); }
    else setViewMonth(m => m+1);
  };

  // Calendar cells
  const firstDay    = new Date(viewYear, viewMonth, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday start
  const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
  const daysInPrev  = new Date(viewYear, viewMonth,   0).getDate();

  const cells: { date: string; inMonth: boolean; isFuture: boolean }[] = [];
  for (let i = startOffset-1; i >= 0; i--)
    cells.push({ date: toYMD(new Date(viewYear, viewMonth-1, daysInPrev-i)), inMonth: false, isFuture: false });
  for (let i = 1; i <= daysInMonth; i++) {
    const d = toYMD(new Date(viewYear, viewMonth, i));
    cells.push({ date: d, inMonth: true, isFuture: d > TODAY_YMD });
  }
  let next = 1;
  while (cells.length < 35) // 5 rows max
    cells.push({ date: toYMD(new Date(viewYear, viewMonth+1, next++)), inMonth: false, isFuture: false });

  const handleDayClick = (date: string, isFuture: boolean) => {
    if (isFuture) return;
    if (!startDate || (startDate && endDate)) { setStartDate(date); setEndDate(null); }
    else {
      if (date < startDate) { setEndDate(startDate); setStartDate(date); }
      else setEndDate(date);
    }
  };

  const isStart   = (d: string) => d === startDate;
  const isEnd     = (d: string) => d === endDate;
  const isToday   = (d: string) => d === TODAY_YMD;
  const isInRange = (d: string) => {
    const rangeEnd = endDate || hoverDate;
    if (!startDate || !rangeEnd) return false;
    const [s,e] = startDate <= rangeEnd ? [startDate, rangeEnd] : [rangeEnd, startDate];
    return d > s && d < e;
  };

  const canApply = startDate && endDate;
  const fmt = (d: string | null) => d
    ? fromYMD(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "—";

  // Year options: 5 years back to current
  const yearOptions = Array.from({ length: 6 }, (_, i) => TODAY.getFullYear() - i);

  return (
    <div className="bg-white rounded-[18px] shadow-2xl w-[256px] overflow-hidden border border-gray-100/80">
      {/* Month/Year Navigation */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1.5">
        <button onClick={prevMonth}
          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center text-gray-500">
          <ChevronLeft className="w-3 h-3" />
        </button>

        {/* Clickable Month/Year — opens inline pickers */}
        {editingMY ? (
          <div className="flex items-center gap-1">
            {/* Month select */}
            <select
              value={viewMonth}
              onChange={e => setViewMonth(Number(e.target.value))}
              className="text-[11px] font-bold border-none outline-none bg-gray-50 rounded-lg px-1 py-0.5 cursor-pointer"
              style={{ color: BRAND }}
            >
              {MONTHS_SHORT.map((m, i) => (
                <option key={i} value={i} disabled={i > TODAY.getMonth() && viewYear >= TODAY.getFullYear()}>
                  {m}
                </option>
              ))}
            </select>
            {/* Year select */}
            <select
              value={viewYear}
              onChange={e => setViewYear(Number(e.target.value))}
              className="text-[11px] font-bold border-none outline-none bg-gray-50 rounded-lg px-1 py-0.5 cursor-pointer"
              style={{ color: BRAND }}
            >
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button onClick={() => setEditingMY(false)}
              className="text-[10px] text-gray-400 hover:text-gray-700 px-1">✓</button>
          </div>
        ) : (
          <button onClick={() => setEditingMY(true)}
            className="text-[12px] font-bold hover:underline transition-all"
            style={{ color: BRAND }}
            title="Modifier mois/année">
            {MONTHS_SHORT[viewMonth]} {viewYear}
          </button>
        )}

        <button onClick={nextMonth}
          disabled={isCurrentOrFuture}
          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center text-gray-500 disabled:opacity-25 disabled:cursor-not-allowed">
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 px-2 pb-0.5">
        {DAYS_SHORT.map((d, i) => (
          <div key={i} className="text-center text-[9px] font-bold text-gray-300 py-0.5">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 px-2 pb-2">
        {cells.map(({ date, inMonth, isFuture }) => {
          const start   = isStart(date);
          const end     = isEnd(date);
          const inRange = isInRange(date);
          const todayC  = isToday(date);
          return (
            <div key={date} className="flex items-center justify-center py-[1px]"
              onMouseEnter={() => !isFuture && setHoverDate(date)}
              onMouseLeave={() => setHoverDate(null)}
            >
              <div className="w-full flex items-center justify-center"
                style={inRange ? { background: BRAND_10 } : {}}>
                <button
                  onClick={() => handleDayClick(date, isFuture)}
                  disabled={isFuture || !inMonth}
                  className="w-7 h-7 rounded-full text-[11px] font-semibold transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-default"
                  style={
                    start || end
                      ? { background: BRAND, color: "white" }
                      : inRange
                      ? { color: BRAND }
                      : inMonth && todayC
                      ? { color: BRAND, boxShadow: `0 0 0 1.5px ${BRAND}35` }
                      : inMonth
                      ? { color: "#374151" }
                      : { color: "#D1D5DB" }
                  }
                >
                  {new Date(date + "T12:00:00").getDate()}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Range display */}
      <div className="mx-2.5 mb-2 rounded-xl p-2 flex items-center" style={{ background: BRAND_10 }}>
        <div className="text-center flex-1">
          <p className="text-[8px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Du</p>
          <p className="text-[11px] font-bold" style={{ color: BRAND }}>{fmt(startDate)}</p>
        </div>
        <div className="w-px h-6 bg-gray-200" />
        <div className="text-center flex-1">
          <p className="text-[8px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Au</p>
          <p className="text-[11px] font-bold" style={{ color: BRAND }}>{fmt(endDate)}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="px-2.5 pb-3 flex gap-2">
        <button onClick={onClose}
          className="flex-1 py-1.5 rounded-full text-[10px] font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all">
          Annuler
        </button>
        <button
          onClick={() => canApply && onApply(startDate!, endDate!)}
          disabled={!canApply}
          className="flex-1 py-1.5 rounded-full text-[10px] font-bold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: BRAND }}
        >
          Appliquer
        </button>
      </div>
    </div>
  );
}
