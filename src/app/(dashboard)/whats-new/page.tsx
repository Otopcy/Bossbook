"use client";

import React from "react";
import { Sparkles, Rocket, Bug, Palette, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const updates = [
  {
    version: "v2.1.0",
    date: "10 Nov 2024",
    title: "Le nouveau Design System est là ! 🎨",
    description: `Nous avons entièrement repensé l'interface de BOSSBOOK pour vous offrir une expérience fluide, moderne et ultra-rapide sur mobile comme sur PC.`,
    type: "feature",
    icon: Palette,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-500/10"
  },
  {
    version: "v2.0.5",
    date: "28 Oct 2024",
    title: "Facturation Périodique Automatisée",
    description: "Vous pouvez désormais programmer la création et l'envoi de factures à une fréquence définie (Hebdo, Mensuel, Annuel). Fini les oublis !",
    type: "feature",
    icon: Rocket,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10"
  },
  {
    version: "v2.0.1",
    date: "15 Oct 2024",
    title: "Correctifs mineurs et améliorations",
    description: `Correction d'un bug d'affichage sur les PDF exportés avec le navigateur Safari. Optimisation de la vitesse de chargement du dashboard.`,
    type: "fix",
    icon: Bug,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-500/10"
  }
];

export default function WhatsNewPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-500">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#011223] dark:text-[#5b9de8]" /> Nouveautés
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Découvrez les dernières améliorations ajoutées à BOSSBOOK.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-white/[0.1] before:to-transparent pt-4">
        {updates.map((update, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both ease-out" style={{ animationDelay: `${150 + idx * 150}ms` }}>
            {/* Timeline Icon */}
            <div className={cn("flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-50 dark:border-[#1c2537] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10", update.bgColor)}>
              <update.icon className={cn("w-4 h-4", update.color)} />
            </div>
            
            {/* Content Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card border-none rounded-[24px] p-5 shadow-sm group-hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-100 dark:bg-white/[0.05] px-2 py-1 rounded-md">
                  {update.version}
                </span>
                <time className="text-[11px] font-bold text-gray-400">{update.date}</time>
              </div>
              <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 mb-2">{update.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{update.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
