"use client";

import { CheckCircle, Clock, AlertTriangle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormattedAmount } from "@/components/ui/formatted-amount";
import { DashboardStats } from "@/types";
import { useCurrency } from "@/context/currency-context";

// Liquid-glass color tokens per accent
const glassStyles = {
  blue: {
    grad:      "from-[#1D6FD8]/10 to-[#1D6FD8]/5",
    ring:      "ring-[#1D6FD8]/20",
    iconGrad:  "from-[#1D6FD8]/20 to-[#1D6FD8]/10",
    iconColor: "text-[#1D6FD8]",
    trendText: "text-[#1D6FD8]",
    trendBg:   "bg-[#1D6FD8]/10",
    dot:       "bg-[#1D6FD8]",
  },
  yellow: {
    grad:      "from-[#F59E0B]/10 to-[#F59E0B]/5",
    ring:      "ring-[#F59E0B]/20",
    iconGrad:  "from-[#F59E0B]/20 to-[#F59E0B]/10",
    iconColor: "text-[#D97706]",
    trendText: "text-[#D97706]",
    trendBg:   "bg-[#F59E0B]/10",
    dot:       "bg-[#F59E0B]",
  },
  red: {
    grad:      "from-[#EF4444]/10 to-[#EF4444]/5",
    ring:      "ring-[#EF4444]/20",
    iconGrad:  "from-[#EF4444]/20 to-[#EF4444]/10",
    iconColor: "text-[#DC2626]",
    trendText: "text-[#DC2626]",
    trendBg:   "bg-[#EF4444]/10",
    dot:       "bg-[#EF4444]",
  },
  green: {
    grad:      "from-[#22C55E]/10 to-[#22C55E]/5",
    ring:      "ring-[#22C55E]/20",
    iconGrad:  "from-[#22C55E]/20 to-[#22C55E]/10",
    iconColor: "text-[#16A34A]",
    trendText: "text-[#16A34A]",
    trendBg:   "bg-[#22C55E]/10",
    dot:       "bg-[#22C55E]",
  },
  emerald: {
    grad:      "from-[#10B981]/10 to-[#10B981]/5",
    ring:      "ring-[#10B981]/20",
    iconGrad:  "from-[#10B981]/20 to-[#10B981]/10",
    iconColor: "text-[#059669]",
    trendText: "text-[#059669]",
    trendBg:   "bg-[#10B981]/10",
    dot:       "bg-[#10B981]",
  },
};

interface StatsCardProps {
  title: string;
  subtitle: string;
  value: number;
  trend?: number;
  currency?: string;
  icon: React.ComponentType<{ className?: string }>;
  isCount?: boolean;
  colorAccent?: keyof typeof glassStyles;
}

export function StatsCard({
  title, value, trend, currency: propCurrency, icon: Icon, isCount = false, colorAccent = "blue"
}: StatsCardProps) {
  const { currency: globalCurrency, convert } = useCurrency();
  const s = glassStyles[colorAccent];
  const trendUp = trend !== undefined && trend > 0;
  
  const displayValue = isCount ? value : convert(value);
  const displayCurrency = propCurrency || globalCurrency;

  return (
    <div className={cn(
      "stats-card relative overflow-hidden rounded-[28px] p-4 md:p-5",
      "bg-white/55 dark:bg-white/[0.04] backdrop-blur-md",
      "ring-1 shadow-md shadow-black/5 dark:shadow-black/30",
      "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer",
      s.ring,
    )}>
      {/* Color gradient wash */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80 dark:opacity-45 pointer-events-none rounded-[28px]", s.grad)} />

      {/* Gloss highlight — hidden in dark mode */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent pointer-events-none rounded-t-[28px] dark:hidden" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon + title row */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className={cn(
            "w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0",
            s.iconGrad
          )}>
            <Icon className={cn("w-4 h-4 md:w-5 md:h-5", s.iconColor)} />
          </div>
          <h3 className="text-[11px] md:text-[12px] font-bold text-gray-600 dark:text-gray-400 leading-tight">{title}</h3>
        </div>

        {/* Value */}
        <div className="text-[14px] sm:text-[18px] md:text-[22px] font-black tracking-tight text-gray-900 dark:text-gray-100 mb-2 md:mb-3 leading-tight">
          {isCount ? (
            displayValue.toLocaleString("fr-FR").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          ) : (
            <FormattedAmount amount={displayValue} currency={displayCurrency} />
          )}
        </div>

        {/* Trend */}
        {trend !== undefined && (
          <div className="flex items-center gap-1.5">
            <div className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold", s.trendBg, s.trendText)}>
              <span>{trendUp ? "↑" : "↓"}</span>
              <span>{Math.abs(trend)}%</span>
            </div>
            <span className="text-[9px] md:text-[10px] text-gray-400 dark:text-gray-500 font-medium">vs sem. dernière</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <StatsCard title="Total encaissé"     subtitle="" value={stats.total_paid}    trend={-0.10} icon={CheckCircle}  colorAccent="blue"   />
      <StatsCard title="Factures en attente" subtitle="" value={stats.total_pending} trend={-0.20} icon={Clock}         colorAccent="yellow" />
      <StatsCard title="Factures en retard"  subtitle="" value={stats.total_overdue} trend={11.5}  icon={AlertTriangle} colorAccent="red"    />
      <StatsCard title="Total Clients"       subtitle="" value={stats.total_clients} isCount trend={6.5}   icon={Users}         colorAccent="green"  />
    </div>
  );
}
