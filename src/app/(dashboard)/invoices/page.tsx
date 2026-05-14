/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, FileText, CheckCircle2, Clock, AlertCircle, MoreHorizontal, Download, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getInvoices } from "@/lib/dashboard-actions";

type StatusFilter = "all" | "paid" | "pending" | "late" | "partial";

export default function InvoicesPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getInvoices();
        setInvoices(data || []);
      } catch (error) {
        console.error("Failed to fetch invoices", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesFilter = filter === "all" || inv.status === filter;
    const matchesSearch = !search || 
      inv.client_name?.toLowerCase().includes(search.toLowerCase()) || 
      inv.reference?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Factures</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez toutes vos factures et suivez vos encaissements.</p>
        </div>
        <Link href="/invoices/new">
          <Button className="w-full md:w-auto rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-10 px-6 hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Nouvelle facture
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
              placeholder="Rechercher une facture..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] transition-all text-gray-800 dark:text-gray-200"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {[
              { id: "all", label: "Toutes" },
              { id: "paid", label: "Encaissées", icon: CheckCircle2, color: "text-emerald-500" },
              { id: "pending", label: "En attente", icon: Clock, color: "text-amber-500" },
              { id: "partial", label: "Partielles", icon: AlertCircle, color: "text-blue-500" },
              { id: "late", label: "En retard", icon: AlertCircle, color: "text-red-500" }
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
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-4">N° Facture</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Montant</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Statut</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-50 dark:border-white/[0.02] last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-blue-500" />
                        </div>
                        <Link href={`/invoices/${inv.id}`} className="hover:underline">
                          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{inv.reference}</span>
                        </Link>
                      </div>
                    </td>
                    <td className="py-4 text-xs font-semibold text-gray-700 dark:text-gray-300">{inv.client_name}</td>
                    <td className="py-4 text-[14px] font-black text-gray-900 dark:text-gray-100">{formatCurrency(inv.total_amount, "XAF")}</td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-800 dark:text-gray-200">{new Date(inv.created_at).toLocaleDateString("fr-FR")}</span>
                        <span className="text-[10px] text-gray-400">Échéance: {inv.due_date ? new Date(inv.due_date).toLocaleDateString("fr-FR") : "-"}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      {inv.status === "paid" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          Payée
                        </span>
                      )}
                      {inv.status === "pending" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                          En attente
                        </span>
                      )}
                      {inv.status === "partial" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                          Partielle
                        </span>
                      )}
                      {inv.status === "late" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 text-[10px] font-bold">
                          En retard
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
                          <DropdownMenuItem asChild className="text-xs rounded-xl cursor-pointer font-medium py-2.5 px-3 gap-2 dark:hover:bg-white/[0.04] text-gray-700 dark:text-gray-200">
                            <Link href={`/invoices/${inv.id}`}>
                              <FileText className="w-3.5 h-3.5 text-gray-400" /> Voir le détail
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs rounded-xl cursor-pointer font-medium py-2.5 px-3 gap-2 dark:hover:bg-white/[0.04] text-gray-700 dark:text-gray-200">
                            <Download className="w-3.5 h-3.5 text-gray-400" /> Télécharger
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs rounded-xl cursor-pointer font-medium py-2.5 px-3 gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                            <Trash2 className="w-3.5 h-3.5" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Aucune facture trouvée.
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
