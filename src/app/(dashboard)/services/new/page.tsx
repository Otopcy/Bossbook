"use client";

import React from "react";
import { ArrowLeft, Save, Briefcase, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mockStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewServicePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("hourly");
  const [price, setPrice] = useState("");

  const handleSave = () => {
    if (!name) {
      toast.error("Veuillez entrer un nom");
      return;
    }

    const newService = {
      id: "SRV-" + Math.floor(Math.random() * 1000).toString().padStart(3, "0"),
      name: name,
      type: type === "hourly" ? "Taux Horaire" : type === "fixed" ? "Forfait" : "Abonnement Mensuel",
      price: parseInt(price).toLocaleString() + " XAF" + (type === "hourly" ? " / h" : type === "monthly" ? " / mois" : ""),
      status: "active"
    };

    mockStore.add("services", newService);
    router.push("/services");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="flex items-center gap-3">
          <Link href="/services">
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-500">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Nouveau Service</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ajoutez une nouvelle prestation de service</p>
          </div>
        </div>
        <Button 
          onClick={handleSave}
          className="w-full md:w-auto rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-10 px-6 hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-sm"
        >
          <Save className="w-4 h-4 mr-2" /> Enregistrer le service
        </Button>
      </div>

      {/* Form Content */}
      <div className="glass-card border-none rounded-[32px] p-6 md:p-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both ease-out space-y-8">
        
        {/* Informations Générales */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-orange-500" /> Détails du service
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Nom du service</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Développement Web" 
                className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100" 
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description (Optionnel)</label>
              <textarea placeholder="Description détaillée..." className="w-full h-24 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 resize-none"></textarea>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Catégorie du service</label>
              <select 
                className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 appearance-none"
              >
                <option value="digital">Services digitaux</option>
                <option value="pro">Services professionnels</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Type de facturation</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 appearance-none"
              >
                <option value="hourly">Taux horaire</option>
                <option value="fixed">Forfait (Prix fixe)</option>
                <option value="monthly">Abonnement Mensuel</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Référence interne</label>
              <input type="text" placeholder="Ex: SRV-DEV-001" className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-500" /> Tarification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tarif de base (HT)</label>
              <div className="relative">
                <input 
                  type="number" 
                  min="0" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0" 
                  className="w-full h-11 pl-4 pr-12 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">XAF</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Taux de taxe applicable</label>
              <select className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 appearance-none">
                <option value="19.25">TVA Standard (19.25%)</option>
                <option value="0">Exonéré (0%)</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
