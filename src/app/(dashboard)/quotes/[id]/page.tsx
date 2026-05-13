"use client";

import React from "react";
import { ArrowLeft, Download, Edit, FileCheck, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function QuoteDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // Mock data for the specific quote
  const quote = {
    id: id || "DEV-2024-001",
    client: {
      name: "Société Générale",
      email: "finance@socgen.cm",
      phone: "+237 233 44 55 66",
      address: "Boulevard de la République, Douala",
    },
    company: {
      name: "BOSSBOOK Tech",
      email: "hello@bossbook.com",
      phone: "+237 600 00 00 00",
      address: "Rue des Palmiers, Akwa, Douala",
    },
    items: [
      { desc: "Audit de Sécurité Infrastructure", qty: 1, price: 2500000 },
      { desc: "Formation Cybersécurité (3j)", qty: 1, price: 700000 },
    ],
    date: "20 Nov 2024",
    validity: "20 Dec 2024",
    status: "pending",
    subtotal: 3200000,
    tax: 616000,
    total: 3816000
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header / Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="flex items-center gap-3">
          <Link href="/quotes">
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-500">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{quote.id}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                <Clock className="w-2.5 h-2.5 mr-1" /> En attente
              </span>
              <span className="text-[10px] text-gray-400 font-medium">Créé le {quote.date}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="rounded-full text-xs font-bold h-9 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.08]">
            <Edit className="w-3.5 h-3.5 mr-2" /> Modifier
          </Button>
          <Button variant="ghost" className="rounded-full text-xs font-bold h-9 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.08]">
            <Download className="w-3.5 h-3.5 mr-2" /> PDF
          </Button>
          <Button className="rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-9 px-5 hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-sm">
            <FileText className="w-3.5 h-3.5 mr-2" /> Convertir en facture
          </Button>
        </div>
      </div>

      {/* Quote Document Preview */}
      <div className="glass-card border-none rounded-[32px] p-6 md:p-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both ease-out bg-white dark:bg-[#1c2537]/50 relative overflow-hidden">
        {/* Background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        {/* Document Header */}
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#011223] dark:bg-[#5b9de8] flex items-center justify-center shadow-lg">
                <FileCheck className="w-6 h-6 text-white dark:text-[#011223]" />
              </div>
              <span className="text-xl font-black text-gray-900 dark:text-gray-100">BOSSBOOK</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p className="font-bold text-gray-700 dark:text-gray-300">{quote.company.name}</p>
              <p>{quote.company.address}</p>
              <p>{quote.company.email}</p>
            </div>
          </div>

          <div className="text-right space-y-4">
            <h2 className="text-4xl font-black text-gray-900 dark:text-gray-100 opacity-20 uppercase tracking-tighter">Devis</h2>
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p><span className="font-bold text-gray-700 dark:text-gray-300">Numéro:</span> {quote.id}</p>
              <p><span className="font-bold text-gray-700 dark:text-gray-300">Date:</span> {quote.date}</p>
              <p><span className="font-bold text-gray-700 dark:text-gray-300">Validité:</span> {quote.validity}</p>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-12 p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] relative z-10">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Destinataire</p>
          <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-1">{quote.client.name}</h3>
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>{quote.client.address}</p>
            <p>{quote.client.email}</p>
          </div>
        </div>

        {/* Table */}
        <div className="relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 dark:border-white/[0.08]">
                <th className="py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-2">Prestation / Article</th>
                <th className="py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Qté</th>
                <th className="py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Prix Unit.</th>
                <th className="py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right pr-2">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {quote.items.map((item, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-white/[0.04]">
                  <td className="py-5 font-bold text-gray-800 dark:text-gray-200 pl-2">{item.desc}</td>
                  <td className="py-5 text-center text-gray-600 dark:text-gray-400">{item.qty}</td>
                  <td className="py-5 text-right text-gray-600 dark:text-gray-400">{item.price.toLocaleString()} XAF</td>
                  <td className="py-5 text-right font-bold text-gray-900 dark:text-gray-100 pr-2">{(item.qty * item.price).toLocaleString()} XAF</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-8 flex justify-end relative z-10">
          <div className="w-full md:w-80 space-y-3">
            <div className="flex justify-between text-sm font-semibold text-gray-600 dark:text-gray-400">
              <span>Sous-total HT</span>
              <span>{quote.subtotal.toLocaleString()} XAF</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-600 dark:text-gray-400">
              <span>TVA (19.25%)</span>
              <span>{quote.tax.toLocaleString()} XAF</span>
            </div>
            <div className="h-px w-full bg-gray-200 dark:bg-white/[0.1] my-4" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-black text-gray-900 dark:text-gray-100">Total Devis TTC</span>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 tracking-tight">
                {quote.total.toLocaleString()} XAF
              </span>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-white/[0.08] text-[10px] text-gray-400 italic leading-relaxed relative z-10">
          <p>Cette proposition est valable pendant 30 jours à compter de sa date { "d&apos;émission" }. Passé ce délai, les tarifs pourront être réévalués.</p>
        </div>
      </div>
    </div>
  );
}
