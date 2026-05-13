"use client";

import React from "react";
import { ArrowLeft, Edit, BarChart3, ArrowUpRight, Plus, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // Mock data for the specific service
  const service = {
    id: id || "SRV-001",
    name: "Développement Web",
    description: "Création de sites internet modernes et responsives, optimisés pour le SEO et la performance.",
    type: "Taux Horaire",
    price: "35 000 XAF / h",
    taxRate: "19.25%",
    status: "active",
    stats: {
      hoursInvoiced: "450h",
      revenue: "15 750 000 XAF",
      lastMonth: "+8%"
    },
    features: [
      "Développement Frontend (React, Next.js)",
      "Développement Backend (Node.js, Supabase)",
      "Design UI/UX personnalisé",
      "Maintenance & Support 24/7"
    ]
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="flex items-center gap-3">
          <Link href="/services">
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-500">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{service.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                Actif
              </span>
              <span className="text-[10px] text-gray-400 font-medium">{service.type}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="rounded-full text-xs font-bold h-9 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.08]">
            <Edit className="w-3.5 h-3.5 mr-2" /> Modifier le service
          </Button>
          <Link href={`/invoices/new?service=${service.id}`}>
            <Button className="rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-9 px-5 hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-sm">
              <Plus className="w-3.5 h-3.5 mr-2" /> Facturer ce service
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both ease-out">
        
        {/* Left Col: Details */}
        <div className="md:col-span-8 space-y-6">
          <div className="glass-card border-none rounded-[32px] p-6 md:p-8 space-y-8">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Description</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{service.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Inclus dans la prestation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tarif de base</p>
                <p className="text-sm font-black text-gray-900 dark:text-gray-100">{service.price}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Taxe</p>
                <p className="text-sm font-black text-gray-900 dark:text-gray-100">{service.taxRate}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ID Service</p>
                <p className="text-sm font-black text-gray-900 dark:text-gray-100">{service.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Stats */}
        <div className="md:col-span-4 space-y-6">
          <div className="glass-card border-none rounded-[32px] p-6 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-sm font-black text-gray-900 dark:text-gray-100">Performance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04]">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Heures facturées</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-black text-gray-900 dark:text-gray-100">{service.stats.hoursInvoiced}</p>
                  <span className="text-[10px] font-bold text-emerald-500 flex items-center">
                    <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> {service.stats.lastMonth}
                  </span>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04]">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Revenu généré</p>
                <p className="text-xl font-black text-gray-900 dark:text-gray-100">{service.stats.revenue}</p>
              </div>
            </div>

            <Button variant="outline" className="w-full rounded-2xl text-xs font-bold border-gray-200 dark:border-white/[0.1] h-10">
              Voir { "l&apos;analyse" } complète
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
