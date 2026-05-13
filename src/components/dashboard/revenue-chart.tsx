/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";

import {
  Area, AreaChart, Bar, BarChart,
  PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from "recharts";
import { formatCurrency, cn } from "@/lib/utils";
import { FormattedAmount } from "@/components/ui/formatted-amount";

import { AreaChart as AreaIcon, BarChart2, Circle, ChevronLeft, ChevronRight, Download, FileSpreadsheet, FileImage, FileText as FilePdf } from "lucide-react";
import { useCurrency } from "@/context/currency-context";


const BLUE  = "#1D6FD8";
const AMBER = "#F59E0B";
const BRAND = "#011223";

type ChartPeriod = "Hebdomadaire" | "Mensuel" | "Annuel";
type ViewMode    = "area" | "circular" | "bar";

interface Props {
  appliedRange?: { start: string; end: string } | null;
  initialData?: {
    weekly: any[];
    monthly: any[];
    yearly: any[];
  } | null;
}

/* ── Tooltip ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  const { currency, convert } = useCurrency();
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-3 py-2.5 shadow-xl min-w-[150px]">
      <p className="text-gray-400 text-[10px] font-semibold mb-1.5 uppercase tracking-wider">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-500 text-[11px]">{p.name === "encaisse" ? "Encaissé" : "En attente"}</span>
          </div>
          <span className="text-[11px] font-bold" style={{ color: p.color }}>
            {formatCurrency(convert(p.value ?? 0), currency)}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ── Circular Tooltip ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CircularTooltip = ({ active, payload }: any) => {
  const { currency, convert } = useCurrency();
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-3 py-2 shadow-xl text-[11px] font-bold" style={{ color: p.payload.fill }}>
      {p.name} : {formatCurrency(convert(p.value), currency)}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const viewModes: { key: ViewMode; Icon: any; label: string }[] = [
  { key: "area",     Icon: AreaIcon,  label: "Vue en diagramme" },
  { key: "circular", Icon: Circle,    label: "Vue circulaire"   },
  { key: "bar",      Icon: BarChart2, label: "Histogramme"      },
];


const MONTHS_FR = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"];
const CUR_YEAR  = new Date().getFullYear();

export function RevenueChart({ appliedRange, initialData }: Props = {}) {
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("Mensuel");
  const [viewMode,    setViewMode]    = useState<ViewMode>("area");
  const [year,        setYear]        = useState(CUR_YEAR);
  const [month,       setMonth]       = useState(new Date().getMonth());
  const [weekOffset,  setWeekOffset]  = useState(0);
  const [editingYear, setEditingYear] = useState(false);
  const [yearInput,   setYearInput]   = useState(String(CUR_YEAR));
  const [downloading, setDownloading] = useState(false);
  const chartRef = React.useRef<HTMLDivElement>(null);
  const { currency, convert } = useCurrency();

  // Past-only helpers
  const canGoForward = () => {
    if (chartPeriod === "Annuel")   return year < CUR_YEAR;
    if (chartPeriod === "Mensuel")  return !(year === CUR_YEAR && month >= new Date().getMonth());
    return weekOffset < 0; // week: only past
  };

  const handlePrev = () => {
    if (chartPeriod === "Annuel")        setYear(y => y - 1);
    else if (chartPeriod === "Mensuel")  setMonth(m => m === 0 ? (setYear(y => y-1), 11) : m - 1);
    else                                  setWeekOffset(w => w - 1);
  };
  const handleNext = () => {
    if (!canGoForward()) return;
    if (chartPeriod === "Annuel")        setYear(y => y + 1);
    else if (chartPeriod === "Mensuel")  setMonth(m => m === 11 ? (setYear(y => y+1), 0) : m + 1);
    else                                  setWeekOffset(w => w + 1);
  };

  // Download helpers
  const downloadCSV = () => {
    const rows = [["Période","Encaissé (XAF)","En attente (XAF)","Total (XAF)"],
      ...data.map(r => [r.label, r.encaisse, r.attente, r.encaisse + r.attente])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `tresorerie_${navLabel.replace(/ /g,"_")}.csv`;
    a.click();
  };
  const downloadPNG = async () => {
    if (!chartRef.current) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(chartRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const a = document.createElement("a");
      a.download = `tresorerie_${navLabel.replace(/ /g,"_")}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } finally { setDownloading(false); }
  };
  const downloadPDF = async () => {
    if (!chartRef.current) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(chartRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width/2, canvas.height/2] });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width/2, canvas.height/2);
      pdf.save(`tresorerie_${navLabel.replace(/ /g,"_")}.pdf`);
    } finally { setDownloading(false); }
  };


  const data =
    chartPeriod === "Hebdomadaire" ? (initialData?.weekly || [])
    : chartPeriod === "Mensuel"   ? (initialData?.monthly || [])
    : (initialData?.yearly || []);

  const total        = data.reduce((s, d) => s + d.encaisse, 0);
  const totalPending = data.reduce((s, d) => s + d.attente,  0);

  const pieData = [
    { name: "Encaissé",   value: total,        fill: BLUE  },
    { name: "En attente", value: totalPending,  fill: AMBER },
  ];
  const totalCombined = total + totalPending;
  const encPct = totalCombined > 0 ? Math.round((total / totalCombined) * 100) : 0;

  const rangeLabel = appliedRange
    ? `${new Date(appliedRange.start + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} → ${new Date(appliedRange.end + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}`
    : null;

  const navLabel =
    chartPeriod === "Annuel"        ? `${year}`
    : chartPeriod === "Mensuel"     ? `${MONTHS_FR[month]} ${year}`
    : weekOffset === 0              ? "Sem. actuelle"
    : `Sem. ${weekOffset > 0 ? "+" : ""}${weekOffset}`;

  /* Shared chart props */
  const axisGrid = <CartesianGrid strokeDasharray="4 6" stroke="rgba(1,18,35,0.05)" vertical={false} />;
  const axisX = (
    <XAxis dataKey="label" axisLine={false} tickLine={false}
      tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} dy={8}
      interval={chartPeriod === "Annuel" ? 1 : "preserveStartEnd"} minTickGap={10} />
  );
  const axisY = (
    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }}
      tickFormatter={(v: number) => v >= 1_000_000 ? `${(v/1_000_000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}k` : `${v}`}
      width={42} />
  );
  const tooltipEl = (
    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(1,18,35,0.07)", strokeWidth: 1, strokeDasharray: "4 4" }} />
  );

  return (
    <div ref={chartRef} className="glass-card rounded-[32px] p-5 flex flex-col h-full min-h-[360px]">

      {/* DESKTOP HEADER */}
      <div className="hidden md:flex flex-row items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1.5 truncate">Évolution de la trésorerie</h3>
          {rangeLabel && <p className="text-[10px] mb-1 truncate" style={{ color: BRAND, opacity: 0.55 }}>{rangeLabel}</p>}
          <div className="flex items-center gap-4 flex-wrap mt-1">
            <div className="flex items-baseline gap-2">
              <FormattedAmount amount={convert(total)} currency={currency} className="text-[16px] md:text-[22px] text-gray-900 dark:text-gray-100" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trésorerie</span>
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-white/[0.08]" />
            <div className="flex items-baseline gap-2">
              <FormattedAmount amount={convert(totalPending)} currency={currency} className="text-[16px] md:text-[22px] text-amber-500/80" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dettes</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-white/[0.08] p-0.5 rounded-full">
            {viewModes.map(({ key, Icon, label }) => (
              <button key={key} onClick={() => setViewMode(key)} title={label}
                className="w-6 h-6 rounded-full flex items-center justify-center transition-all"
                style={viewMode === key ? { background: BLUE, color: "white" } : { color: "#9CA3AF" }}
              >
                <Icon className="w-3 h-3" />
              </button>
            ))}
          </div>
          <div className="w-px h-4 bg-gray-200 dark:bg-white/[0.12]" />
          <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-black/[0.07] dark:bg-white/[0.08]">
            {(["Hebdomadaire", "Mensuel", "Annuel"] as ChartPeriod[]).map((p) => {
              const short = p === "Hebdomadaire" ? "Hebdo." : p === "Mensuel" ? "Mensuel" : "Annuel";
              return (
                <button key={p} onClick={() => setChartPeriod(p)}
                  style={chartPeriod === p ? { background: BLUE, color: "white" } : {}}
                  className={cn("px-2 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap", chartPeriod !== p && "text-[#011223]/45 dark:text-gray-400")}
                >
                  {short}
                </button>
              );
            })}
          </div>
          <div className="w-px h-4 bg-gray-200 dark:bg-white/[0.12]" />
          <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-white/[0.08] rounded-full px-0.5 py-0.5">
            <button onClick={handlePrev} className="w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:bg-white/80 dark:hover:bg-white/[0.12] hover:text-gray-700 transition-all">
              <ChevronLeft className="w-3 h-3" />
            </button>
            {chartPeriod === "Annuel" && editingYear ? (
              <input type="number" value={yearInput} onChange={e => setYearInput(e.target.value)}
                onBlur={() => { const y = parseInt(yearInput); if (y > 1990 && y < 2100) setYear(y); setEditingYear(false); }}
                onKeyDown={e => { if (e.key === "Enter") { const y = parseInt(yearInput); if (y > 1990 && y < 2100) setYear(y); setEditingYear(false); } }}
                autoFocus className="w-12 text-center text-[11px] font-bold outline-none bg-transparent border-b border-blue-400 text-[#011223] dark:text-gray-200" />
            ) : (
              <button onClick={() => chartPeriod === "Annuel" && (setEditingYear(true), setYearInput(String(year)))}
                className={cn("text-[11px] font-bold px-1 whitespace-nowrap text-[#011223] dark:text-gray-200", chartPeriod === "Annuel" ? "hover:underline cursor-pointer" : "cursor-default")}
                title={chartPeriod === "Annuel" ? "Cliquez pour changer l’année" : undefined}
              >{navLabel}</button>
            )}
            <button onClick={handleNext} disabled={!canGoForward()}
              className="w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:bg-white/80 dark:hover:bg-white/[0.12] hover:text-gray-700 transition-all disabled:opacity-25 disabled:cursor-not-allowed">
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-px h-4 bg-gray-200 dark:bg-white/[0.12]" />
          <div className="relative group">
            <button title="Télécharger" className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/[0.08] hover:bg-gray-200 dark:hover:bg-white/[0.15] text-gray-500 dark:text-gray-300 transition-all" disabled={downloading}>
              <Download className="w-3 h-3" />
            </button>
            <div className="absolute right-0 top-8 bg-white dark:bg-[#1c2537] ring-1 ring-black/8 dark:ring-white/10 shadow-xl rounded-2xl p-1.5 w-44 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-150 translate-y-1 group-hover:translate-y-0">
              {[
                { label: "Image PNG",   Icon: FileImage,       fn: downloadPNG },
                { label: "CSV / Excel", Icon: FileSpreadsheet, fn: downloadCSV },
                { label: "PDF",         Icon: FilePdf,         fn: downloadPDF },
              ].map(({ label, Icon, fn }) => (
                <button key={label} onClick={fn} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/8 transition-all">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />{label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE HEADER: vertical stack */}
      <div className="md:hidden mb-3 space-y-3">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Évolution de la trésorerie</h3>
        {/* Amounts */}
        <div className="flex flex-col gap-0.5">
          <div>
            <FormattedAmount amount={convert(total)} currency={currency} className="text-xl text-[#1D6FD8]" />
            <span className="text-[10px] text-gray-400 ml-2">Encaissé</span>
          </div>
          <div>
            <FormattedAmount amount={convert(totalPending)} currency={currency} className="text-xl text-amber-500" />
            <span className="text-[10px] text-gray-400 ml-2">En attente</span>
          </div>
        </div>
        {/* Period selector + nav */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-black/[0.07] dark:bg-white/[0.08]">
            {(["Hebdomadaire", "Mensuel", "Annuel"] as ChartPeriod[]).map((p) => {
              const short = p === "Hebdomadaire" ? "Hebdo." : p === "Mensuel" ? "Mensuel" : "Annuel";
              return (
                <button key={p} onClick={() => setChartPeriod(p)}
                  style={chartPeriod === p ? { background: BLUE, color: "white" } : {}}
                  className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap", chartPeriod !== p && "text-[#011223]/45 dark:text-gray-400")}
                >{short}</button>
              );
            })}
          </div>
          <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-white/[0.08] rounded-full px-0.5 py-0.5">
            <button onClick={handlePrev} className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-white/80 dark:hover:bg-white/[0.12] transition-all">
              <ChevronLeft className="w-3 h-3" />
            </button>
            {chartPeriod === "Annuel" && editingYear ? (
              <input type="number" value={yearInput} onChange={e => setYearInput(e.target.value)}
                onBlur={() => { const y = parseInt(yearInput); if (y > 1990 && y < 2100) setYear(y); setEditingYear(false); }}
                onKeyDown={e => { if (e.key === "Enter") { const y = parseInt(yearInput); if (y > 1990 && y < 2100) setYear(y); setEditingYear(false); } }}
                autoFocus className="w-12 text-center text-[11px] font-bold outline-none bg-transparent border-b border-blue-400 text-[#011223] dark:text-gray-200" />
            ) : (
              <button onClick={() => chartPeriod === "Annuel" && (setEditingYear(true), setYearInput(String(year)))}
                className={cn("text-[11px] font-bold px-1 whitespace-nowrap text-[#011223] dark:text-gray-200", chartPeriod === "Annuel" ? "hover:underline cursor-pointer" : "cursor-default")}
              >{navLabel}</button>
            )}
            <button onClick={handleNext} disabled={!canGoForward()}
              className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-white/80 dark:hover:bg-white/[0.12] transition-all disabled:opacity-25">
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
        {/* View switcher + Download */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-white/[0.08] p-0.5 rounded-full">
            {viewModes.map(({ key, Icon, label }) => (
              <button key={key} onClick={() => setViewMode(key)} title={label}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                style={viewMode === key ? { background: BLUE, color: "white" } : { color: "#9CA3AF" }}
              ><Icon className="w-3.5 h-3.5" /></button>
            ))}
          </div>
          {/* Download */}
          <div className="relative group">
            <button title="Télécharger"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/[0.08] hover:bg-gray-200 dark:hover:bg-white/[0.15] text-gray-500 dark:text-gray-300 transition-all" disabled={downloading}>
              <Download className="w-3.5 h-3.5" />
            </button>
            <div className="absolute left-0 top-10 bg-white dark:bg-[#1c2537] ring-1 ring-black/8 dark:ring-white/10 shadow-xl rounded-2xl p-1.5 w-44 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-150">
              {[
                { label: "Image PNG",   Icon: FileImage,       fn: downloadPNG },
                { label: "CSV / Excel", Icon: FileSpreadsheet, fn: downloadCSV },
                { label: "PDF",         Icon: FilePdf,         fn: downloadPDF },
              ].map(({ label, Icon, fn }) => (
                <button key={label} onClick={fn} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/8 transition-all">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />{label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />
          <span className="text-gray-400 dark:text-gray-500 text-[10px]">Encaissé</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-gray-400 dark:text-gray-500 text-[10px]">En attente</span>
        </div>
        <span className="ml-auto text-[9px] font-semibold text-gray-300 dark:text-gray-600 uppercase tracking-wider">
          {viewMode === "area" ? "Vue en diagramme" : viewMode === "circular" ? "Vue circulaire" : "Histogramme"}
        </span>
      </div>

      {/* ── Chart ── */}
      <div className="flex-1 w-full min-h-[250px] relative">
        {viewMode === "circular" ? (
          /* ── Circular (donut) ── */
          <div className="flex items-center justify-center gap-6 h-full px-4">

            {/* Donut — takes most of the width */}
            <div className="flex-1 h-full min-h-[220px] max-w-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius="48%"
                    outerRadius="82%"
                    paddingAngle={3}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} opacity={0.92} />
                    ))}
                  </Pie>
                  <Tooltip content={<CircularTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Right: big % + legend */}
            <div className="shrink-0 space-y-5 min-w-[130px]">
              {/* Centre stat */}
              <div className="text-center">
                <div className="text-4xl font-black leading-none" style={{ color: BLUE }}>{encPct}%</div>
                <div className="text-xs text-gray-400 mt-1 font-medium">encaissé</div>
              </div>

              {/* Legend items */}
              <div className="space-y-3">
                {pieData.map(p => (
                  <div key={p.name} className="flex items-center gap-3">
                    <div className="w-10 h-2 rounded-full shrink-0" style={{ background: p.fill }} />
                    <div>
                      <div className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-tight">{p.name}</div>
                      <div className="text-xs font-semibold mt-0.5" style={{ color: p.fill }}>
                        <FormattedAmount amount={convert(p.value)} currency={currency} className="text-xs" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            {viewMode === "bar" ? (
              <BarChart data={data} margin={{ top: 6, right: 6, left: 0, bottom: 0 }} barGap={3} barSize={chartPeriod === "Annuel" ? 14 : 9}>
                {axisGrid}{axisX}{axisY}{tooltipEl}
                <Bar dataKey="encaisse" name="Encaissé" stackId="a"  fill={BLUE}  radius={[0,0,0,0]} fillOpacity={0.9} />
                <Bar dataKey="attente"  name="En attente" stackId="a" fill={AMBER} radius={[5,5,0,0]} fillOpacity={0.8} />
              </BarChart>
            ) : (
              <AreaChart data={data} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradEnc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={BLUE}  stopOpacity={0.22} />
                    <stop offset="85%"  stopColor={BLUE}  stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="gradAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={AMBER} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={AMBER} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                {axisGrid}{axisX}{axisY}{tooltipEl}
                <Area type="monotone" dataKey="encaisse" name="Encaissé"   stroke={BLUE}  strokeWidth={2.5} fill="url(#gradEnc)" dot={false}
                  activeDot={{ r: 4, fill: BLUE,  stroke: "white", strokeWidth: 2 }} />
                <Area type="monotone" dataKey="attente"  name="En attente" stroke={AMBER} strokeWidth={2}   fill="url(#gradAtt)" dot={false}
                  activeDot={{ r: 4, fill: AMBER, stroke: "white", strokeWidth: 2 }} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
