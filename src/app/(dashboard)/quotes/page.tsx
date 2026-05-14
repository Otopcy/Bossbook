/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, FileCheck, CheckCircle2, Clock, AlertCircle, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getQuotes } from "@/lib/dashboard-actions";

type StatusFilter = "all" | "accepted" | "pending" | "rejected";

export default function QuotesPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [quotes, setQuotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const data = await getQuotes();
        setQuotes(data || []);
      } catch (error) {
        console.error("Failed to fetch quotes", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  const filteredQuotes = quotes.filter((q) => {
    const matchesFilter = filter === "all" || q.status === filter;
    const matchesSearch = !search || 
      q.client_name?.toLowerCase().includes(search.toLowerCase()) || 
      q.reference?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Devis</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Créez des propositions commerciales et convertissez-les en factures.</p>
        </div>
        <Link href="/quotes/new">
          <Button className="w-full md:w-auto rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-10 px-6 hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Nouveau devis
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
              placeholder="Rechercher un devis..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] transition-all text-gray-800 dark:text-gray-200"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {[
              { id: "all", label: "Tous" },
              { id: "accepted", label: "Acceptés", icon: CheckCircle2, color: "text-emerald-500" },
              { id: "pending", label: "En attente", icon: Clock, color: "text-amber-500" },
              { id: "rejected", label: "Refusés", icon: AlertCircle, color: "text-red-500" }
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
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 w-full rounded-2xl bg-gray-50 dark:bg-white/[0.04] animate-pulse" />
              ))}
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.05]">
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-4">N° Devis</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Montant</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Statut</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((q) => (
                  <tr key={q.id} className="border-b border-gray-50 dark:border-white/[0.02] last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center shrink-0">
                          <FileCheck className="w-4 h-4 text-purple-500" />
                        </div>
                        <Link href={`/quotes/${q.id}`} className="hover:underline">
                          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{q.reference}</span>
                        </Link>
                      </div>
                    </td>
                    <td className="py-4 text-xs font-semibold text-gray-700 dark:text-gray-300">{q.client_name}</td>
                    <td className="py-4 text-[14px] font-black text-gray-900 dark:text-gray-100">{formatCurrency(q.total_amount, "XAF")}</td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-800 dark:text-gray-200">{new Date(q.created_at).toLocaleDateString("fr-FR")}</span>
                        <span className="text-[10px] text-gray-400">Valide jsq: {q.valid_until ? new Date(q.valid_until).toLocaleDateString("fr-FR") : "-"}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      {q.status === "accepted" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          Accepté
                        </span>
                      )}
                      {q.status === "pending" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                          En attente
                        </span>
                      )}
                      {q.status === "rejected" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 text-[10px] font-bold">
                          Refusé
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
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl border-none shadow-lg p-1 bg-white dark:bg-[#1c2537]">
                          <DropdownMenuItem asChild className="text-xs rounded-xl cursor-pointer font-medium py-2.5 px-3 gap-2 dark:hover:bg-white/[0.04] text-gray-700 dark:text-gray-200">
                            <Link href={`/quotes/${q.id}`}>
                              <FileCheck className="w-3.5 h-3.5 text-gray-400" /> Voir le détail
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs rounded-xl cursor-pointer font-medium py-2.5 px-3 gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                            <Trash2 className="w-3.5 h-3.5" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredQuotes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Aucun devis trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
