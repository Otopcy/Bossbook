"use client";

import { formatCurrency } from "@/lib/utils";
import { DashboardStats } from "@/types";

interface Props {
  stats: DashboardStats;
}

export function SummaryGauge({ stats }: Props) {
  const total = stats.total_paid + stats.total_pending + stats.total_overdue;
  const paidPct   = total > 0 ? (stats.total_paid    / total) * 100 : 0;
  const pendPct   = total > 0 ? (stats.total_pending / total) * 100 : 0;
  const overPct   = total > 0 ? (stats.total_overdue / total) * 100 : 0;

  const segments = [
    { label: "Encaissé",    pct: paidPct, value: stats.total_paid,    color: "#1565C0", bg: "bg-[#1565C0]", text: "text-[#1565C0]", lightBg: "bg-[#EBF3FF]" },
    { label: "En attente",  pct: pendPct, value: stats.total_pending,  color: "#F59E0B", bg: "bg-[#F59E0B]", text: "text-[#F59E0B]", lightBg: "bg-[#FFF9DE]" },
    { label: "En retard",   pct: overPct, value: stats.total_overdue,  color: "#DC2626", bg: "bg-[#DC2626]", text: "text-[#DC2626]", lightBg: "bg-[#FFE9EB]" },
  ];

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-800">Répartition</h3>
        <span className="text-[11px] text-gray-400 font-medium">Total facturé</span>
      </div>

      {/* Total */}
      <div className="text-2xl font-black text-gray-900 tracking-tight">
        {formatCurrency(stats.total_billed, "XAF")}
      </div>

      {/* Gauge bar */}
      <div className="w-full h-3 rounded-full overflow-hidden flex gap-0.5">
        {segments.map((s) => (
          <div
            key={s.label}
            className={`${s.bg} rounded-full transition-all duration-500`}
            style={{ width: `${s.pct}%` }}
            title={`${s.label}: ${s.pct.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Legend rows */}
      <div className="space-y-3">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${s.bg}`} />
              <span className="text-[12px] text-gray-500 font-medium">{s.label}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${s.lightBg} ${s.text}`}>
                {s.pct.toFixed(0)}%
              </span>
            </div>
            <span className={`text-xs font-black ${s.text}`}>
              {formatCurrency(s.value, "XAF")}
            </span>
          </div>
        ))}
      </div>

      {/* Overdue alert */}
      {stats.total_overdue > 0 && (
        <div className="p-3 bg-red-50 rounded-2xl text-center">
          <p className="text-[11px] text-red-600 font-semibold">
            ⚠️ {formatCurrency(stats.total_overdue, "XAF")} en retard — relancez vos clients.
          </p>
        </div>
      )}
    </div>
  );
}
