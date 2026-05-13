"use client";

import React, { useState } from "react";
import { Search, Plus, RefreshCw, CheckCircle2, PauseCircle, PlayCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const mockRecurring = [
  { id: "REC-001", client: "MTN Cameroon", amount: "500 000 XAF", frequency: "Mensuel", nextDate: "01 Dec 2024", status: "active" },
  { id: "REC-002", client: "Orange Cameroun", amount: "250 000 XAF", frequency: "Hebdomadaire", nextDate: "25 Nov 2024", status: "paused" },
  { id: "REC-003", client: "Société Générale", amount: "1 200 000 XAF", frequency: "Trimestriel", nextDate: "01 Jan 2025", status: "active" },
];

type StatusFilter = "all" | "active" | "paused";

export default function RecurringInvoicesPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const filteredRecurring = mockRecurring.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (search && !r.client.toLowerCase().includes(search.toLowerCase()) && !r.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Factures Périodiques</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Automatisez la création et l&apos;envoi de vos factures régulières.</p>
        </div>
        <Link href="/recurring/new">
          <Button className="w-full md:w-auto rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-10 px-6 hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Nouveau modèle
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="glass-card border-none rounded-[32px] p-4 md:p-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both ease-out">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un abonnement..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] transition-all text-gray-800 dark:text-gray-200"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {[
              { id: "all", label: "Tous" },
              { id: "active", label: "Actifs", icon: CheckCircle2, color: "text-emerald-500" },
              { id: "paused", label: "En pause", icon: PauseCircle, color: "text-amber-500" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as StatusFilter)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0",
                  filter === tab.id 
                    ? "bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] shadow-sm" 
                    : "bg-gray-50 dark:bg-white/[0.04] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08]"
                )}
              >
                {tab.icon && <tab.icon className={cn("w-3.5 h-3.5", filter === tab.id ? "text-current" : tab.color)} />}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/[0.05]">
                <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-4">Réf.</th>
                <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Client</th>
                <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Montant</th>
                <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Fréquence</th>
                <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Prochaine Échéance</th>
                <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecurring.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 dark:border-white/[0.02] last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center shrink-0">
                        <RefreshCw className="w-4 h-4 text-cyan-500" />
                      </div>
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{r.id}</span>
                    </div>
                  </td>
                  <td className="py-4 text-xs font-semibold text-gray-700 dark:text-gray-300">{r.client}</td>
                  <td className="py-4 text-[14px] font-black text-gray-900 dark:text-gray-100">{r.amount}</td>
                  <td className="py-4 text-xs font-semibold text-gray-700 dark:text-gray-300">{r.frequency}</td>
                  <td className="py-4 text-xs text-gray-800 dark:text-gray-200">{r.nextDate}</td>
                  <td className="py-4">
                    {r.status === "active" ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                        En pause
                      </span>
                    )}
                  </td>
                  <td className="py-4 pr-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-500">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-2xl border-none shadow-lg p-1 bg-white dark:bg-[#1c2537]">
                        <DropdownMenuItem className="text-xs rounded-xl cursor-pointer font-medium py-2.5 px-3 gap-2 dark:hover:bg-white/[0.04] text-gray-700 dark:text-gray-200">
                          <Edit className="w-3.5 h-3.5 text-gray-400" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs rounded-xl cursor-pointer font-medium py-2.5 px-3 gap-2 dark:hover:bg-white/[0.04] text-gray-700 dark:text-gray-200">
                          {r.status === "active" ? (
                            <><PauseCircle className="w-3.5 h-3.5 text-amber-500" /> Suspendre</>
                          ) : (
                            <><PlayCircle className="w-3.5 h-3.5 text-emerald-500" /> Reprendre</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs rounded-xl cursor-pointer font-medium py-2.5 px-3 gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                          <Trash2 className="w-3.5 h-3.5" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filteredRecurring.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Aucune facture périodique trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
