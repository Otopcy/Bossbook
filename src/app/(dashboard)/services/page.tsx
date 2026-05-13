/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Briefcase, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getServices } from "@/lib/dashboard-actions";
import { formatCurrency } from "@/lib/utils";

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getServices();
        setServices(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = services.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Services</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gérez votre catalogue de prestations de services.</p>
        </div>
        <Link href="/services/new">
          <Button size="sm" className="rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-9 px-5">
            <Plus className="w-3.5 h-3.5 mr-2" /> Nouveau Service
          </Button>
        </Link>
      </div>

      <div className="glass-card border-none rounded-[32px] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-white/[0.04] border-none text-sm focus:outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm font-medium">Aucun service trouvé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((service) => (
              <div key={service.id} className="p-4 rounded-2xl border border-gray-100 dark:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-none shadow-lg">
                      <DropdownMenuItem className="text-red-500">
                        <Trash2 className="w-3.5 h-3.5 mr-2" /> Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{service.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-8">{service.description || "Aucune description"}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-white/[0.04]">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{service.category || "Service"}</span>
                  <span className="font-black text-gray-900 dark:text-gray-100">{formatCurrency(service.base_price)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
