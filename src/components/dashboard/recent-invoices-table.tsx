"use client";

import { Search, MoreHorizontal, FileText, FileCheck, RefreshCw, CreditCard, CheckCircle2, Eye, Copy, XCircle, ChevronDown, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FormattedAmount } from "@/components/ui/formatted-amount";
import { useState, useEffect, useMemo, useRef } from "react";
import { useCurrency } from "@/context/currency-context";

/* ── Activity types ── */
type ActivityType = "invoice_created" | "invoice_paid" | "invoice_sent" | "quote_created" | "quote_validated" | "recurring_registered";

interface Activity {
  id: string;
  type: ActivityType;
  ref: string;
  client: string;
  date: string;
  amount: number;
  currency: string;
}

const typeConfig: Record<ActivityType, { label: string; icon: typeof FileText; dot: string; iconBg: string }> = {
  invoice_created:      { label: "Facture créée",               icon: FileText,     dot: "bg-blue-500",    iconBg: "bg-blue-500/10 text-blue-500 dark:bg-blue-400/15 dark:text-blue-400" },
  invoice_paid:         { label: "Facture payée",               icon: CreditCard,   dot: "bg-emerald-500", iconBg: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400" },
  invoice_sent:         { label: "Facture envoyée",             icon: FileText,     dot: "bg-gray-400",    iconBg: "bg-gray-400/10 text-gray-500 dark:bg-gray-400/15 dark:text-gray-400" },
  quote_created:        { label: "Devis créé",                  icon: FileCheck,    dot: "bg-violet-500",  iconBg: "bg-violet-500/10 text-violet-600 dark:bg-violet-400/15 dark:text-violet-400" },
  quote_validated:      { label: "Devis validé",                icon: CheckCircle2, dot: "bg-amber-500",   iconBg: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400" },
  recurring_registered: { label: "Facture périodique enregistrée", icon: RefreshCw,  dot: "bg-cyan-500",    iconBg: "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/15 dark:text-cyan-400" },
};

/**
 * Robust label mapper to ensure French terms are used.
 */
const getFriendlyFilterLabel = (type: string) => {
  if (type === "invoice") return "Factures";
  if (type === "quote") return "Devis";
  if (type === "recurring") return "Récurrentes";
  return "Filtrer";
};

const getActivityHref = (activity: Activity) => {
  if (activity.type.startsWith("invoice")) return `/invoices/${activity.ref}`;
  if (activity.type.startsWith("quote")) return `/quotes/${activity.ref}`;
  if (activity.type.startsWith("recurring")) return `/recurring`;
  return "#";
};

export function RecentInvoicesTable({ initialActivities = [] }: { initialActivities?: Activity[] }) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { currency: globalCurrency, convert } = useCurrency();

  useEffect(() => {
    if (initialActivities.length > 0) {
      setActivities(initialActivities);
    }
  }, [initialActivities]);

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesSearch = 
        activity.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        typeConfig[activity.type].label.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterType === "all" || activity.type.includes(filterType);
      
      return matchesSearch && matchesFilter;
    });
  }, [activities, searchQuery, filterType]);

  const handleFilterEnter = () => {
    if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current);
    setIsFilterOpen(true);
  };

  const handleFilterLeave = () => {
    filterTimeoutRef.current = setTimeout(() => setIsFilterOpen(false), 200);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Activités récentes</h3>
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full md:w-48 bg-card border border-border rounded-lg py-1.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground shadow-sm"
            />
          </div>
          
          {/* Custom Hover Filter Dropdown */}
          <div 
            className="relative"
            onMouseEnter={handleFilterEnter}
            onMouseLeave={handleFilterLeave}
          >
            <Button variant="outline" size="sm" className="bg-card border-border text-[10px] h-8 flex items-center gap-2 shadow-sm shrink-0 rounded-lg font-bold min-w-[100px] justify-between">
              <span className="flex items-center gap-2">
                {getFriendlyFilterLabel(filterType)}
              </span>
              {filterType !== "all" ? (
                <X 
                  className="w-3 h-3 text-red-500 hover:scale-110 transition-transform cursor-pointer" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFilterType("all");
                  }}
                />
              ) : (
                <ChevronDown className="w-3 h-3 opacity-50" />
              )}
            </Button>

            {isFilterOpen && (
              <div 
                className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#1c2537] rounded-xl shadow-lg border border-gray-100 dark:border-white/[0.08] z-[100] p-1 animate-in fade-in zoom-in-95 duration-200"
                onMouseEnter={handleFilterEnter}
                onMouseLeave={handleFilterLeave}
              >
                <div className="text-[10px] font-bold uppercase text-gray-400 px-3 py-2">Type d&apos;activité</div>
                <button onClick={() => { setFilterType("all"); setIsFilterOpen(false); }} className="w-full text-left text-xs py-2 px-3 hover:bg-gray-50 dark:hover:bg-white/[0.04] rounded-lg transition-colors">Tous</button>
                <button onClick={() => { setFilterType("invoice"); setIsFilterOpen(false); }} className="w-full text-left text-xs py-2 px-3 hover:bg-gray-50 dark:hover:bg-white/[0.04] rounded-lg transition-colors">Factures</button>
                <button onClick={() => { setFilterType("quote"); setIsFilterOpen(false); }} className="w-full text-left text-xs py-2 px-3 hover:bg-gray-50 dark:hover:bg-white/[0.04] rounded-lg transition-colors">Devis</button>
                <button onClick={() => { setFilterType("recurring"); setIsFilterOpen(false); }} className="w-full text-left text-xs py-2 px-3 hover:bg-gray-50 dark:hover:bg-white/[0.04] rounded-lg transition-colors">Récurrentes</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Card className="glass-card border-none overflow-hidden rounded-[32px]">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[50px] text-[10px] uppercase text-muted-foreground font-bold px-6">#</TableHead>
              <TableHead className="text-[10px] uppercase text-muted-foreground font-bold">Type</TableHead>
              <TableHead className="text-[10px] uppercase text-muted-foreground font-bold">Client</TableHead>
              <TableHead className="text-[10px] uppercase text-muted-foreground font-bold">Référence</TableHead>
              <TableHead className="text-[10px] uppercase text-muted-foreground font-bold">Date</TableHead>
              <TableHead className="text-[10px] uppercase text-muted-foreground font-bold">Montant</TableHead>
              <TableHead className="text-[10px] uppercase text-muted-foreground font-bold">Statut</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.map((activity, index) => (
              <ActivityTableRow key={activity.id} activity={activity} index={index} />
            ))}
          </TableBody>
        </Table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col divide-y divide-gray-100 dark:divide-white/[0.08]">
          {filteredActivities.map((activity) => {
            const cfg = typeConfig[activity.type];
            return (
              <Link href={getActivityHref(activity)} key={activity.id} className="p-4 flex flex-col gap-3 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", cfg.iconBg)}>
                      <cfg.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{activity.client}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{cfg.label}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <FormattedAmount amount={convert(activity.amount)} currency={globalCurrency} className="text-sm font-black text-gray-900 dark:text-gray-100" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{activity.ref}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] text-gray-400">{formatDate(activity.date)}</p>
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{cfg.label.split(" ")[1] ?? cfg.label}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function ActivityTableRow({ activity, index }: { activity: Activity; index: number }) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { currency: globalCurrency, convert } = useCurrency();
  const cfg = typeConfig[activity.type];

  const handleActionsEnter = () => {
    if (actionsTimeoutRef.current) clearTimeout(actionsTimeoutRef.current);
    setIsActionsOpen(true);
  };

  const handleActionsLeave = () => {
    actionsTimeoutRef.current = setTimeout(() => setIsActionsOpen(false), 200);
  };

  return (
    <TableRow className="border-border hover:bg-muted transition-colors group">
      <TableCell className="px-6 text-[10px] font-bold text-muted-foreground opacity-50">
        {(index + 1).toString().padStart(2, "0")}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2.5">
          <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", cfg.iconBg)}>
            <cfg.icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium whitespace-nowrap">{cfg.label}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2.5">
          <Avatar className="h-7 w-7 border border-border shrink-0">
            <AvatarFallback className="text-[9px] font-bold bg-muted text-muted-foreground">
              {activity.client.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium">{activity.client}</span>
        </div>
      </TableCell>
      <TableCell className="text-xs font-mono text-muted-foreground">
        <Link href={getActivityHref(activity)} className="hover:underline">
          {activity.ref}
        </Link>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">{formatDate(activity.date)}</TableCell>
      <TableCell>
        <FormattedAmount amount={convert(activity.amount)} currency={globalCurrency} className="text-xs" />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
          <span className="text-[11px] font-medium">{cfg.label.split(" ")[1] ?? cfg.label}</span>
        </div>
      </TableCell>
      <TableCell>
        <div 
          className="relative h-8 w-8 flex items-center justify-center"
          onMouseEnter={handleActionsEnter}
          onMouseLeave={handleActionsLeave}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </Button>
          
          {isActionsOpen && (
            <div 
              className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#1c2537] rounded-xl shadow-lg border border-gray-100 dark:border-white/[0.08] z-[100] p-1 animate-in fade-in zoom-in-95 duration-200"
              onMouseEnter={handleActionsEnter}
              onMouseLeave={handleActionsLeave}
            >
              <Link href={getActivityHref(activity)} className="flex items-center gap-2 text-xs py-2 px-3 hover:bg-gray-50 dark:hover:bg-white/[0.04] rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                <Eye className="w-3.5 h-3.5 opacity-50" /> Voir les détails
              </Link>
              <button className="w-full flex items-center gap-2 text-xs py-2 px-3 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors text-blue-500">
                <Copy className="w-3.5 h-3.5" /> Dupliquer
              </button>
              <div className="h-[1px] bg-gray-100 dark:bg-white/[0.05] my-1" />
              <button className="w-full flex items-center gap-2 text-xs py-2 px-3 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors text-red-500">
                <XCircle className="w-3.5 h-3.5" /> Marquer comme annulé
              </button>
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

