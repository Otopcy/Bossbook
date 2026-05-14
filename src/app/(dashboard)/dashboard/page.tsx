/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentInvoicesTable } from "@/components/dashboard/recent-invoices-table";
import { TopClientsCard } from "@/components/dashboard/top-clients-card";
import { DarkCalendarPicker } from "@/components/ui/dark-calendar-picker";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RotateCcw, ChevronDown, Plus, Users,
  FileCheck, CalendarRange, Calendar, RefreshCw,
  Package, Briefcase
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  getDashboardStats, 
  getRecentActivities, 
  getTopClientsData, 
  getRevenueChartData,
  ensureCompany 
} from "@/lib/dashboard-actions";

type PeriodOption = "Aujourd'hui" | "Vue hebdomadaire" | "Vue mensuelle" | "Vue annuelle" | "Personnalisée";

export default function DashboardPage() {
  const [period, setPeriod] = useState<PeriodOption>("Vue mensuelle");
  const [showPicker, setShowPicker] = useState(false);
  const [appliedRange, setAppliedRange] = useState<{ start: string; end: string } | null>(null);
  const [stats, setStats] = useState<any>({ total_paid: 0, total_pending: 0, total_overdue: 0, total_clients: 0 });
  const [activities, setActivities] = useState<any[]>([]);
  const [topClients, setTopClients] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pickerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const initDashboard = async () => {
      setIsLoading(true);
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        if (currentUser) {
          // Ensure company exists first
          const company = await ensureCompany();
          if (!company) {
            router.push("/setup-company");
            return;
          }

          // Parallel fetch for speed
          const [statsData, activityData, clientsData, revenue] = await Promise.all([
            getDashboardStats(),
            getRecentActivities(),
            getTopClientsData(),
            getRevenueChartData()
          ]);

          if (statsData) setStats(statsData);
          setActivities(activityData || []);
          setTopClients(clientsData || []);
          setRevenueData(revenue);
        }
      } catch (error) {
        console.error("Error initializing dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initDashboard();

    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [supabase]);

  useEffect(() => {
    const backdrop = document.getElementById("overlay-backdrop");
    if (!backdrop) return;
    if (showPicker) {
      backdrop.classList.add("active");
    } else {
      if (!document.body.hasAttribute("data-scroll-locked")) {
        backdrop.classList.remove("active");
      }
    }
  }, [showPicker]);


  const handlePeriodSelect = (p: PeriodOption) => {
    setPeriod(p);
    if (p === "Personnalisée") {
      setShowPicker(true);
    } else {
      setShowPicker(false);
      setAppliedRange(null);
    }
  };

  const handleApply = (start: string, end: string) => {
    setAppliedRange({ start, end });
    setShowPicker(false);
  };

  const handleReset = () => {
    setPeriod("Vue mensuelle");
    setShowPicker(false);
    setAppliedRange(null);
  };

  const formatDate = (d: string) => {
    const date = new Date(d + "T12:00:00");
    const day = date.getDate();
    const month = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"][date.getMonth()];
    return `${day} ${month}`;
  };

  const periodLabel =
    appliedRange
      ? `${formatDate(appliedRange.start)} → ${formatDate(appliedRange.end)}`
      : period;

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Bonjour {user?.user_metadata?.full_name?.split(' ')[0] || 'Génial'} 👋
          </h1>
          <p className="text-muted-foreground text-sm">Voici un clin d&apos;œil de votre activité de facturation.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">

          {/* 1. Quick Create button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="h-9 px-4 gap-2 rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-sm border-none text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                Créer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44 rounded-2xl border-none shadow-lg p-1 bg-white dark:bg-[#1c2537]">
              {[
                { label: "Nouvelle facture", href: "/invoices/new", Icon: Plus },
                { label: "Nouveau devis", href: "/quotes/new", Icon: FileCheck },
                { label: "Nouveau produit", href: "/products/new", Icon: Package },
                { label: "Nouveau service", href: "/services/new", Icon: Briefcase },
                { label: "Nouveau client", href: "/clients/new", Icon: Users },
              ].map(({ label, href, Icon }) => (
                <DropdownMenuItem key={href} asChild className="dark:hover:bg-white/[0.04]">
                  <Link href={href} className="flex items-center gap-2.5 text-xs rounded-xl cursor-pointer font-medium py-2.5 px-3 text-gray-700 dark:text-gray-200">
                    <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-white/[0.08] flex items-center justify-center shrink-0">
                      <Icon className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                    </div>
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 2. Period Selector + Reset icon — grouped */}
          <div className="relative flex items-center gap-1" ref={pickerRef}>

            {/* Period dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-4 bg-white dark:bg-white/[0.04] border-none rounded-full text-xs font-semibold shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.08] gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {periodLabel}
                  <ChevronDown className="w-3 h-3 opacity-40" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44 rounded-2xl border-none shadow-lg p-1 bg-white dark:bg-[#1c2537]">
                {(["Aujourd'hui", "Vue hebdomadaire", "Vue mensuelle", "Vue annuelle"] as PeriodOption[]).map((p) => (
                  <DropdownMenuItem
                    key={p}
                    className="text-xs rounded-xl cursor-pointer font-medium py-2.5 text-gray-700 dark:text-gray-200 dark:hover:bg-white/[0.04]"
                    onClick={() => handlePeriodSelect(p)}
                  >
                    {p}
                    {period === p && !appliedRange && (
                      <span className="ml-auto text-[10px] text-white px-1.5 py-0.5 rounded-full bg-[#011223] dark:bg-[#5b9de8]">&#x2713;</span>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-white/[0.05]" />
                <DropdownMenuItem
                  className="text-xs rounded-xl cursor-pointer font-medium py-2.5 gap-2 text-gray-700 dark:text-gray-200 dark:hover:bg-white/[0.04]"
                  onClick={() => handlePeriodSelect("Personnalisée")}
                >
                  <CalendarRange className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  Personnalisée
                  {appliedRange && (
                    <span className="ml-auto text-[10px] text-white px-1.5 py-0.5 rounded-full bg-[#011223] dark:bg-[#5b9de8] opacity-70">&#x2713;</span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Reset icon — same line */}
            <Button
              variant="ghost"
              size="icon"
              title="Réinitialiser"
              className="h-9 w-9 rounded-full bg-white dark:bg-white/[0.04] shadow-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.08]"
              onClick={handleReset}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>

            {/* Calendar popup — centered under the group */}
            {showPicker && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[55]">
                <DarkCalendarPicker
                  onApply={handleApply}
                  onClose={() => setShowPicker(false)}
                />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[32px] glass-card" />)}
          </div>
        ) : (
          <StatsGrid stats={stats} />
        )}
      </div>

      {/* ── Middle Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both ease-out">

        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">

          {/* Quick Actions */}
          <div className="glass-card border-none rounded-[32px] p-6">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 text-left mb-5">Actions rapides</h3>

            {/* Desktop: 2-column grid */}
            <div className="hidden md:grid grid-cols-2 gap-3">
              {/* ... (no changes needed here, just keep the same) */}
              {[
                { label: "Nouvelle facture", href: "/invoices/new", icon: Plus },
                { label: "Nouveau devis", href: "/quotes/new", icon: FileCheck },
                { label: "Nouveau client", href: "/clients/new", icon: Users },
                { label: "Facture périodique", href: "/recurring", icon: RefreshCw },
                { label: "Nouveau produit", href: "/products/new", icon: Package },
                { label: "Nouveau service", href: "/services/new", icon: Briefcase },
              ].map(({ label, href, icon: Icon }) => (
                <Link key={href + label} href={href} className="w-full">
                  <button className="w-full h-[76px] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all bg-gray-50 dark:bg-white/[0.04] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-100 dark:border-white/[0.08]">
                    <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-[10px] font-bold text-center leading-snug px-1">{label}</span>
                  </button>
                </Link>
              ))}
            </div>

            {/* Mobile: custom layout */}
            <div className="md:hidden space-y-2">
               {/* ... (keep existing mobile layout) */}
               <Link href="/invoices/new" className="w-full block">
                <button className="w-full h-[52px] rounded-2xl flex flex-row items-center justify-center gap-2.5 transition-all bg-gray-50 dark:bg-white/[0.04] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-100 dark:border-white/[0.08]">
                  <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-[11px] font-bold">Nouvelle facture</span>
                </button>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/quotes/new" className="w-full">
                  <button className="w-full h-[60px] rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all bg-gray-50 dark:bg-white/[0.04] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-100 dark:border-white/[0.08]">
                    <FileCheck className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-[9px] font-bold text-center">Nouveau devis</span>
                  </button>
                </Link>
                <Link href="/clients/new" className="w-full">
                  <button className="w-full h-[60px] rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all bg-gray-50 dark:bg-white/[0.04] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-100 dark:border-white/[0.08]">
                    <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-[9px] font-bold text-center">Nouveau client</span>
                  </button>
                </Link>
              </div>
              <Link href="/recurring" className="w-full block">
                <button className="w-full h-[52px] rounded-2xl flex flex-row items-center justify-center gap-2.5 transition-all bg-gray-50 dark:bg-white/[0.04] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-100 dark:border-white/[0.08]">
                  <RefreshCw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-[11px] font-bold">Facture périodique</span>
                </button>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/products/new" className="w-full">
                  <button className="w-full h-[60px] rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all bg-gray-50 dark:bg-white/[0.04] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-100 dark:border-white/[0.08]">
                    <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-[9px] font-bold text-center">Nouveau produit</span>
                  </button>
                </Link>
                <Link href="/services/new" className="w-full">
                  <button className="w-full h-[60px] rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all bg-gray-50 dark:bg-white/[0.04] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-100 dark:border-white/[0.08]">
                    <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-[9px] font-bold text-center">Nouveau service</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Activity Clients */}
          {isLoading ? (
            <Skeleton className="h-[400px] rounded-[32px] glass-card" />
          ) : (
            <TopClientsCard initialData={topClients} />
          )}
        </div>

        {/* Chart */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <Skeleton className="h-[400px] rounded-[32px] glass-card" />
          ) : (
            <RevenueChart appliedRange={appliedRange} initialData={revenueData} />
          )}
        </div>
      </div>

      {/* ── Recent Activities ── */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both ease-out">
        {isLoading ? (
          <Skeleton className="h-[300px] rounded-[32px] glass-card" />
        ) : (
          <RecentInvoicesTable initialActivities={activities} />
        )}
      </div>
    </div>
  );
}
