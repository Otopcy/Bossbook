/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Save, Building, CreditCard, Bell, Shield, Paintbrush, ArrowLeft, Globe, ChevronDown, User, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useCurrency } from "@/context/currency-context";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { deleteAccount } from "@/lib/dashboard-actions";
import { useRouter } from "next/navigation";

type TabType = "entreprise" | "profil" | "personalization" | "billing" | "notifications" | "security";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("entreprise");
  const { theme, setTheme } = useTheme();
  const { currency: currentCurrency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      setUser(authUser);

      const { data } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', authUser.id)
        .single();
      
      setCompany(data);
    };
    fetchData();
  }, [supabase]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (activeTab === "entreprise") {
        const { error } = await supabase
          .from('companies')
          .update({
            name: company.name,
            address: company.address,
            phone: company.phone,
            industry: company.industry,
            currency: currentCurrency
          })
          .eq('id', company.id);
        if (error) throw error;
      } else if (activeTab === "profil") {
        const { error } = await supabase.auth.updateUser({
          data: { 
            full_name: user.user_metadata?.full_name,
            phone_number: user.user_metadata?.phone_number
          }
        });
        if (error) throw error;
      }
      toast.success("Paramètres enregistrés !");
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "SUPPRIMER") {
      toast.error("Veuillez saisir SUPPRIMER pour confirmer.");
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success("Compte supprimé définitivement.");
      router.push("/login");
    } catch (error: any) {
      toast.error("Erreur lors de la suppression: " + error.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const tabs = [
    { id: "entreprise", label: "Entreprise", icon: Building },
    { id: "profil", label: "Profil", icon: User },
    { id: "personalization", label: "Personnalisation", icon: Paintbrush },
    { id: "billing", label: "Facturation", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-500">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Paramètres</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Gérez les configurations de votre compte et de votre entreprise.</p>
          </div>
        </div>
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="w-full md:w-auto rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-11 px-8 hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-sm border-none transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Save className="w-3.5 h-3.5 mr-2" /> 
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both ease-out">
        
        {/* Sidebar Settings Navigation */}
        <div className="md:col-span-3 space-y-1">
          <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 custom-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all shrink-0 w-full text-left",
                  activeTab === tab.id 
                    ? "bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] shadow-sm" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="col-span-1 md:col-span-9 space-y-6">
          {/* TAB: ENTREPRISE */}
          {activeTab === "entreprise" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="glass-card border-none rounded-[32px] p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                    <Building className="w-5 h-5 text-[#5b9de8]" />
                  </div>
                  Profil de l&apos;Entreprise
                </h3>
                
                <div className="space-y-8">
                  {/* Logo */}
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-gray-100 dark:bg-white/[0.04] border-2 border-dashed border-gray-200 dark:border-white/[0.1] flex items-center justify-center overflow-hidden transition-all hover:border-[#5b9de8]">
                      {company?.logo_url ? (
                        <img src={company.logo_url} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Logo</span>
                      )}
                    </div>
                    <div>
                      <Button variant="outline" className="rounded-full text-xs font-bold h-10 px-6 border-gray-200 dark:border-white/[0.1] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04]">
                        Changer le logo
                      </Button>
                      <p className="text-[10px] text-gray-400 mt-2">Format recommandé: PNG ou JPG, 500x500px min.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2.5 ml-1">Nom de l&apos;entreprise</label>
                      <input 
                        type="text" 
                        value={company?.name || ""} 
                        onChange={(e) => setCompany({ ...company, name: e.target.value })}
                        className="w-full h-13 px-6 rounded-2xl bg-gray-50/50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 font-medium transition-all focus:bg-white dark:focus:bg-white/[0.08]" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2.5 ml-1">Secteur d&apos;activité</label>
                      <div className="relative">
                        <select 
                          value={company?.industry || "tech"}
                          onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                          className="w-full h-13 px-6 pr-10 rounded-2xl bg-gray-50/50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 appearance-none font-medium transition-all focus:bg-white dark:focus:bg-white/[0.08]"
                        >
                          <option value="tech">Technologie & Digital</option>
                          <option value="commerce">Commerce & Retail</option>
                          <option value="service">Services aux entreprises</option>
                          <option value="construction">Construction & Immobilier</option>
                          <option value="autre">Autre</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none opacity-50" />
                      </div>
                    </div>
 
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2.5 ml-1">Numéro de téléphone</label>
                      <input 
                        type="tel" 
                        value={company?.phone || ""} 
                        onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                        className="w-full h-13 px-6 rounded-2xl bg-gray-50/50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 font-medium transition-all focus:bg-white dark:focus:bg-white/[0.08]" 
                      />
                    </div>
 
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2.5 ml-1">Adresse complète</label>
                      <input 
                        type="text" 
                        value={company?.address || ""} 
                        onChange={(e) => setCompany({ ...company, address: e.target.value })}
                        className="w-full h-13 px-6 rounded-2xl bg-gray-50/50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 font-medium transition-all focus:bg-white dark:focus:bg-white/[0.08]" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROFIL */}
          {activeTab === "profil" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="glass-card border-none rounded-[32px] p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-500" />
                  </div>
                  Informations Personnelles
                </h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2.5 ml-1">Votre Nom</label>
                      <input 
                        type="text" 
                        value={user?.user_metadata?.full_name || ""} 
                        onChange={(e) => setUser({ ...user, user_metadata: { ...user.user_metadata, full_name: e.target.value } })}
                        className="w-full h-13 px-6 rounded-2xl bg-gray-50/50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 font-medium transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2.5 ml-1">Numéro de téléphone</label>
                      <input 
                        type="tel" 
                        value={user?.user_metadata?.phone_number || user?.phone || ""} 
                        onChange={(e) => setUser({ ...user, user_metadata: { ...user.user_metadata, phone_number: e.target.value } })}
                        className="w-full h-13 px-6 rounded-2xl bg-gray-50/50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 font-medium transition-all" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2.5 ml-1">Adresse E-mail</label>
                    <input 
                      type="email" 
                      value={user?.email || ""} 
                      disabled
                      className="w-full h-13 px-6 rounded-2xl bg-gray-100/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] text-sm text-gray-400 font-medium cursor-not-allowed" 
                    />
                  </div>

                  <div className="pt-4">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3 ml-1">Méthodes de connexion liées</label>
                    <div className="flex flex-wrap gap-2">
                      {user?.app_metadata?.provider === 'google' && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20">
                          <Globe className="w-3.5 h-3.5" /> Google Connected
                        </div>
                      )}
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                        <Shield className="w-3.5 h-3.5" /> Email Verified
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DANGER ZONE */}
              <div className="glass-card border-none rounded-[32px] p-6 md:p-8 border-t-4 border-red-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-500 dark:text-red-400">Zone de Danger</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Actions irréversibles sur votre compte.</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Supprimer mon compte BOSSBOOK</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
                      La suppression de votre compte effacera définitivement toutes vos données d&apos;entreprise, factures, devis et clients. Cette opération ne peut pas être annulée.
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowDeleteModal(true)}
                    variant="ghost" 
                    className="rounded-full h-11 px-6 bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    Supprimer le compte
                  </Button>
                </div>
              </div>
            </div>
          )}


          {/* TAB: PERSONALIZATION */}
          {activeTab === "personalization" && (
            <div className="glass-card border-none rounded-[32px] p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Paintbrush className="w-5 h-5 text-[#5b9de8]" /> Personnalisation de l&apos;interface
              </h3>
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4 ml-1">Thème visuel</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button 
                      onClick={() => setTheme("light")}
                      className={cn(
                        "p-4 rounded-2xl border transition-all text-left",
                        theme === "light" 
                          ? "border-[#011223] dark:border-[#5b9de8] bg-[#011223]/5 dark:bg-[#5b9de8]/5" 
                          : "border-gray-100 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/[0.2]"
                      )}
                    >
                      <div className="w-full h-12 bg-white border border-gray-200 rounded-lg mb-3 shadow-inner" />
                      <span className={cn("text-sm font-bold", theme === "light" ? "text-[#011223] dark:text-[#5b9de8]" : "")}>Clair</span>
                    </button>
                    <button 
                      onClick={() => setTheme("dark")}
                      className={cn(
                        "p-4 rounded-2xl border transition-all text-left",
                        theme === "dark" 
                          ? "border-[#011223] dark:border-[#5b9de8] bg-[#011223]/5 dark:bg-[#5b9de8]/5" 
                          : "border-gray-100 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/[0.2]"
                      )}
                    >
                      <div className="w-full h-12 bg-gray-900 rounded-lg mb-3 shadow-inner" />
                      <span className={cn("text-sm font-bold", theme === "dark" ? "text-[#011223] dark:text-[#5b9de8]" : "")}>Sombre</span>
                    </button>
                    <button 
                      onClick={() => setTheme("system")}
                      className={cn(
                        "p-4 rounded-2xl border transition-all text-left",
                        theme === "system" 
                          ? "border-[#011223] dark:border-[#5b9de8] bg-[#011223]/5 dark:bg-[#5b9de8]/5" 
                          : "border-gray-100 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/[0.2]"
                      )}
                    >
                      <div className="w-full h-12 bg-gradient-to-br from-white to-gray-800 rounded-lg mb-3 shadow-inner" />
                      <span className={cn("text-sm font-bold", theme === "system" ? "text-[#011223] dark:text-[#5b9de8]" : "")}>Système</span>
                    </button>
                  </div>
                </div>

                <div className="h-px w-full bg-gray-100 dark:bg-white/[0.05]" />

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4 ml-1">Langue de l&apos;interface</label>
                  <div className="relative max-w-[200px]">
                    <select className="w-full h-10 px-4 pr-10 rounded-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 appearance-none transition-all">
                      <option value="fr">Français (France)</option>
                      <option value="en">English (US)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-3 italic">Toutes les dates et formats monétaires s&apos;adapteront à ce choix.</p>
                </div>
              </div>
            </div>
          )}


          {/* TAB: BILLING */}
          {activeTab === "billing" && (
            <div className="glass-card border-none rounded-[32px] p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-6">Facturation & Abonnement</h3>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Plan Actuel : Professionnel</h4>
                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">Votre abonnement se renouvelle le 12 Juin 2024.</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full">ACTIF</span>
                </div>
                <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold h-9">
                  Gérer l&apos;abonnement
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4 ml-1">Moyens de paiement</h4>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Visa se terminant par 4242</p>
                      <p className="text-[10px] text-gray-500">Expire le 12/26</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-xs font-bold text-red-500">Supprimer</Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="glass-card border-none rounded-[32px] p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-6">Préférences de Notification</h3>
              <div className="space-y-6">
                {[
                  { label: "Rapports hebdomadaires", desc: "Recevez un résumé de votre activité par email." },
                  { label: "Paiements reçus", desc: "Soyez alerté dès qu'une facture est encaissée." },
                  { label: "Retards de paiement", desc: "Notifications pour les factures arrivées à échéance." },
                  { label: "Nouveautés BOSSBOOK", desc: "Restez informé des dernières fonctionnalités." },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.label}</p>
                      <p className="text-[11px] text-gray-500 mt-1 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="w-12 h-6 bg-[#5b9de8] rounded-full relative p-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SECURITY */}
          {activeTab === "security" && (
            <div className="glass-card border-none rounded-[32px] p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-6">Sécurité du Compte</h3>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4 ml-1">Changer le mot de passe</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <input type="password" placeholder="Mot de passe actuel" className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 text-sm focus:outline-none" />
                    <input type="password" placeholder="Nouveau mot de passe" className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 text-sm focus:outline-none" />
                  </div>
                  <Button className="rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-9 px-6">
                    Mettre à jour le mot de passe
                  </Button>
                </div>

                <div className="h-px w-full bg-gray-100 dark:bg-white/[0.05]" />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">Authentification à deux facteurs (2FA)</h4>
                    <p className="text-xs text-gray-500 mt-1">Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
                  </div>
                  <Button variant="outline" className="rounded-full text-xs font-bold h-9 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10">
                    Activer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete Account Confirmation Modal ─────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1c2537] w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto ring-8 ring-red-50/50 dark:ring-red-500/5">
                <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Supprimer définitivement ?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  Cette action est <span className="text-red-500 font-bold underline">irréversible</span>. Vous perdrez l&apos;accès à toutes vos données (factures, clients, paramètres).
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Saisissez <span className="text-gray-900 dark:text-white">SUPPRIMER</span> pour confirmer</p>
                <input 
                  type="text" 
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value.toUpperCase())}
                  placeholder="SUPPRIMER"
                  className="w-full h-12 text-center text-lg font-black tracking-widest rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteConfirmation !== "SUPPRIMER"}
                  className={cn(
                    "h-12 rounded-2xl font-bold transition-all shadow-lg",
                    deleteConfirmation === "SUPPRIMER" 
                      ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" 
                      : "bg-gray-100 dark:bg-white/[0.05] text-gray-400 cursor-not-allowed shadow-none"
                  )}
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Oui, supprimer mon compte"}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="h-12 rounded-2xl text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-white/[0.05]"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
