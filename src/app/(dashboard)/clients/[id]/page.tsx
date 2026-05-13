"use client";

import React from "react";
import { ArrowLeft, Edit, Mail, Phone, MapPin, Globe, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function ClientDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // Mock data for the specific client
  const client = {
    id: id || "CLI-001",
    name: "MTN Cameroon",
    email: "contact@mtn.cm",
    phone: "+237 670 00 00 00",
    address: "Boulevard de la Liberté, Akwa, Douala",
    website: "https://www.mtn.cm",
    niu: "M0123456789",
    stats: {
      totalInvoiced: "15 450 000 XAF",
      totalPaid: "12 250 000 XAF",
      pending: "3 200 000 XAF",
    },
    invoices: [
      { id: "FAC-2024-001", amount: "1 250 000 XAF", date: "12 Nov 2024", status: "paid" },
      { id: "FAC-2024-002", amount: "850 000 XAF", date: "14 Nov 2024", status: "pending" },
      { id: "FAC-2024-006", amount: "3 200 000 XAF", date: "20 Nov 2024", status: "pending" },
    ]
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="flex items-center gap-3">
          <Link href="/clients">
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-500">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{client.name}</h1>
            <p className="text-[10px] text-gray-400 font-medium">ID Client: {client.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="rounded-full text-xs font-bold h-9 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.08]">
            <Edit className="w-3.5 h-3.5 mr-2" /> Modifier le profil
          </Button>
          <Link href={`/invoices/new?client=${client.id}`}>
            <Button className="rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-9 px-5 hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-sm">
              <Plus className="w-3.5 h-3.5 mr-2" /> Créer une facture
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both ease-out">
        
        {/* Left Col: Info */}
        <div className="md:col-span-4 space-y-6">
          <div className="glass-card border-none rounded-[32px] p-6 space-y-6">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Coordonnées</p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400">Email</p>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400">Téléphone</p>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{client.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Globe className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400">Site Web</p>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{client.website}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-gray-100 dark:bg-white/[0.05]" />

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Adresse & NIU</p>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-purple-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{client.address}</p>
                  <p className="text-[10px] text-gray-400 mt-1">NIU: {client.niu}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Stats & History */}
        <div className="md:col-span-8 space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card border-none rounded-[24px] p-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Facturé</p>
              <p className="text-lg font-black text-gray-900 dark:text-gray-100">{client.stats.totalInvoiced}</p>
            </div>
            <div className="glass-card border-none rounded-[24px] p-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Payé</p>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{client.stats.totalPaid}</p>
            </div>
            <div className="glass-card border-none rounded-[24px] p-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">En attente</p>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400">{client.stats.pending}</p>
            </div>
          </div>

          {/* Invoices History */}
          <div className="glass-card border-none rounded-[32px] p-6 md:p-8">
            <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" /> Historique des factures
            </h3>
            
            <div className="space-y-4">
              {client.invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05] hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1c2537] flex items-center justify-center shadow-sm">
                      <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{inv.id}</p>
                      <p className="text-[10px] text-gray-400">{inv.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900 dark:text-gray-100">{inv.amount}</p>
                      <span className={cn(
                        "text-[10px] font-bold uppercase",
                        inv.status === "paid" ? "text-emerald-500" : "text-amber-500"
                      )}>
                        {inv.status === "paid" ? "Payée" : "En attente"}
                      </span>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-gray-300 rotate-180 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
