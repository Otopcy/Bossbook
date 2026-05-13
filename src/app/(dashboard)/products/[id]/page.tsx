"use client";

import React from "react";
import { ArrowLeft, Edit, BarChart3, History, ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // Mock data for the specific product
  const product = {
    id: id || "PRD-001",
    name: "Licence Logiciel Annuelle",
    description: "Licence d'utilisation complète de la suite BOSSBOOK Pro pour une durée de 12 mois.",
    category: "Logiciels",
    price: "120 000 XAF",
    taxRate: "19.25%",
    stock: "Illimité",
    status: "active",
    stats: {
      totalSold: 124,
      revenue: "14 880 000 XAF",
      lastMonth: "+12%"
    },
    history: [
      { date: "10 Nov 2024", action: "Vente", qty: 1, user: "Admin" },
      { date: "08 Nov 2024", action: "Vente", qty: 2, user: "Admin" },
      { date: "05 Nov 2024", action: "Mise à jour tarif", qty: "-", user: "Admin" },
    ]
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="flex items-center gap-3">
          <Link href="/products">
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-500">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                Actif
              </span>
              <span className="text-[10px] text-gray-400 font-medium">{product.category}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="rounded-full text-xs font-bold h-9 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.08]">
            <Edit className="w-3.5 h-3.5 mr-2" /> Modifier le produit
          </Button>
          <Button className="rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-9 px-5 hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-sm">
            <Plus className="w-3.5 h-3.5 mr-2" /> Ajuster le stock
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both ease-out">
        
        {/* Left Col: Details */}
        <div className="md:col-span-8 space-y-6">
          <div className="glass-card border-none rounded-[32px] p-6 md:p-8 space-y-8">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Description</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Prix HT</p>
                <p className="text-sm font-black text-gray-900 dark:text-gray-100">{product.price}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Taxe</p>
                <p className="text-sm font-black text-gray-900 dark:text-gray-100">{product.taxRate}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stock</p>
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{product.stock}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">SKU</p>
                <p className="text-sm font-black text-gray-900 dark:text-gray-100">{product.id}</p>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="glass-card border-none rounded-[32px] p-6 md:p-8">
            <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <History className="w-4 h-4 text-gray-400" /> Historique des mouvements
            </h3>
            <div className="space-y-4">
              {product.history.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05]">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1c2537] flex items-center justify-center shadow-sm">
                      {h.action === "Vente" ? <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" /> : <Edit className="w-3.5 h-3.5 text-amber-500" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{h.action}</p>
                      <p className="text-[10px] text-gray-400">{h.date} • par {h.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-gray-900 dark:text-gray-100">{h.qty === "-" ? "-" : `-${h.qty}`}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Stats */}
        <div className="md:col-span-4 space-y-6">
          <div className="glass-card border-none rounded-[32px] p-6 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="text-sm font-black text-gray-900 dark:text-gray-100">Performance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04]">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Unités vendues</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-black text-gray-900 dark:text-gray-100">{product.stats.totalSold}</p>
                  <span className="text-[10px] font-bold text-emerald-500 flex items-center">
                    <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> {product.stats.lastMonth}
                  </span>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04]">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Chiffre d&apos;affaires</p>
                <p className="text-xl font-black text-gray-900 dark:text-gray-100">{product.stats.revenue}</p>
              </div>
            </div>

            <Button variant="outline" className="w-full rounded-2xl text-xs font-bold border-gray-200 dark:border-white/[0.1] h-10">
              Voir le rapport détaillé
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
