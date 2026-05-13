"use client";

import React from "react";
import { ArrowLeft, Save, Building2, User, Mail, Phone, MapPin, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mockStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewClientPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [niu, setNiu] = useState("");

  const handleSave = () => {
    if (!name) {
      toast.error("Veuillez entrer un nom");
      return;
    }

    const newClient = {
      id: "CLT-" + Math.floor(Math.random() * 1000).toString().padStart(3, "0"),
      name: name,
      email: email || "contact@" + name.toLowerCase().replace(/\s/g, "") + ".com",
      status: "active",
      totalInvoiced: "0 XAF"
    };

    mockStore.add("clients", newClient);
    router.push("/clients");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="flex items-center gap-3">
          <Link href="/clients">
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-500">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Nouveau Client</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ajoutez un nouveau client à votre répertoire</p>
          </div>
        </div>
        <Button 
          onClick={handleSave}
          className="w-full md:w-auto rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-10 px-6 hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-sm"
        >
          <Save className="w-4 h-4 mr-2" /> Enregistrer le client
        </Button>
      </div>

      {/* Form Content */}
      <div className="glass-card border-none rounded-[32px] p-6 md:p-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both ease-out space-y-8">
        
        {/* Type de client */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Type de client</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="clientType" value="company" defaultChecked className="text-[#011223] dark:text-[#5b9de8] focus:ring-[#011223] dark:focus:ring-[#5b9de8]" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Entreprise</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="clientType" value="individual" className="text-[#011223] dark:text-[#5b9de8] focus:ring-[#011223] dark:focus:ring-[#5b9de8]" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Particulier</span>
            </label>
          </div>
        </div>

        {/* Informations Générales */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-500" /> Informations générales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Nom de l&apos;entreprise / Nom complet</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: MTN Cameroon" 
                className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Numéro de SIRET / NIU</label>
              <input 
                type="text" 
                value={niu}
                onChange={(e) => setNiu(e.target.value)}
                placeholder="Ex: M0123456789" 
                className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Secteur d&apos;activité</label>
              <input type="text" placeholder="Ex: Télécommunications" className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100" />
            </div>
          </div>
        </div>

        {/* Coordonnées */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-500" /> Coordonnées
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@entreprise.com" 
                  className="w-full h-11 pl-10 pr-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100" 
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Numéro de téléphone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" placeholder="+237 600 00 00 00" className="w-full h-11 pl-10 pr-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100" />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Site Web</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="url" placeholder="https://www.entreprise.com" className="w-full h-11 pl-10 pr-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" /> Adresse de facturation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Adresse complète</label>
              <input type="text" placeholder="Rue, Quartier, Bâtiment" className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Ville</label>
              <input type="text" placeholder="Douala" className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Pays</label>
              <select className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 appearance-none">
                <option value="CM">Cameroun</option>
                <option value="FR">France</option>
                <option value="GA">Gabon</option>
                <option value="CI">Côte d&apos;Ivoire</option>
              </select>
            </div>
          </div>
        </div>

        {/* Paramètres Financiers */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
             <span className="w-4 h-4 text-emerald-500 flex items-center justify-center font-bold text-xs">$</span>
             Paramètres financiers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Devise du client</label>
              <select className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 appearance-none">
                <option value="XAF">Franc CFA (XAF)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">Dollar (USD)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Solde d&apos;ouverture</label>
              <div className="relative">
                <input type="number" placeholder="0" className="w-full h-11 pl-4 pr-12 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
