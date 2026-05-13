"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Hash, ArrowRight, Upload, CheckCircle2, ChevronRight, Briefcase, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { updateCompany } from "@/lib/dashboard-actions";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function SetupCompanyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    industry: "Technologie & Digital",
    niu: "",
    address: "",
    logo_url: "",
  });
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let finalLogoUrl = "";
      
      // Handle logo upload if present
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `logos/${fileName}`;
        
        const { error: uploadError } = await createClient().storage
          .from('assets')
          .upload(filePath, logoFile);

        if (uploadError) {
          throw new Error(`Erreur d'upload du logo: ${uploadError.message}. Assurez-vous que le bucket 'assets' existe dans Supabase.`);
        }

        const { data: { publicUrl } } = createClient().storage
          .from('assets')
          .getPublicUrl(filePath);
        finalLogoUrl = publicUrl;
      }

      await updateCompany({
        ...formData,
        logo_url: finalLogoUrl || formData.logo_url
      });
      
      toast.success("Entreprise configurée avec succès !");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error updating company:", error);
      toast.error(error.message || "Erreur lors de la configuration de l'entreprise.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Configuration de votre entreprise</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Ces informations apparaîtront sur vos factures et devis.</p>
      </div>

      <div className="glass-card border-none rounded-[32px] p-8 shadow-sm">
        <form onSubmit={handleFinish} className="space-y-6">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Nom de l&apos;entreprise</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="BOSSBOOK Tech Sarl" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Domaine d&apos;activité</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select 
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="w-full h-12 pl-11 pr-10 rounded-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] appearance-none transition-all"
                  >
                    <option>Technologie & Digital</option>
                    <option>Services & Conseil</option>
                    <option>Commerce & Retail</option>
                    <option>Immobilier</option>
                    <option>Autre</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90" />
                </div>
              </div>

              <Button type="button" onClick={nextStep} disabled={!formData.name} className="w-full h-12 rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-black text-sm hover:scale-[1.02] transition-all">
                Continuer <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Numéro d&apos;Identifiant Unique (NIU)</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="M0123456789X" 
                    value={formData.niu}
                    onChange={(e) => setFormData({...formData, niu: e.target.value})}
                    className="w-full h-12 pl-11 pr-4 rounded-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Adresse physique</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Rue des Palmiers, Akwa, Douala" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full h-12 pl-11 pr-4 rounded-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={prevStep} className="flex-1 h-12 rounded-full font-bold text-xs">Retour</Button>
                <Button type="button" onClick={nextStep} className="flex-[2] h-12 rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-black text-sm hover:scale-[1.02] transition-all">
                  Continuer <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center block">Logo de l&apos;entreprise (Optionnel)</label>
                <div 
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-100 dark:border-white/[0.08] rounded-[32px] bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all cursor-pointer group relative overflow-hidden h-40"
                >
                  <input 
                    id="logo-upload"
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    onChange={handleLogoChange}
                  />
                  {logoPreview ? (
                    <div className="relative w-full h-full">
                      <img src={logoPreview} alt="Logo preview" className="absolute inset-0 w-full h-full object-contain p-4" />
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white shadow-lg hover:scale-110 transition-all z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/[0.08] flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-xs font-bold text-gray-600 dark:text-gray-300">Cliquez pour uploader</p>
                      <p className="text-[10px] text-gray-400 mt-1">PNG, JPG jusqu&apos;à 5Mo</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">Presque fini ! Votre compte sera configuré avec des paramètres par défaut pour le Cameroun (XAF, TVA 19.25%).</p>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={prevStep} className="flex-1 h-12 rounded-full font-bold text-xs">Retour</Button>
                <Button type="submit" disabled={isLoading} className="flex-[2] h-12 rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-black text-sm hover:scale-[1.02] transition-all shadow-lg">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Finaliser la configuration
                </Button>
              </div>
            </div>
          )}

        </form>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            step === s ? "w-6 bg-[#011223] dark:bg-[#5b9de8]" : "bg-gray-200 dark:bg-white/[0.1]"
          )} />
        ))}
      </div>
    </div>
  );
}
