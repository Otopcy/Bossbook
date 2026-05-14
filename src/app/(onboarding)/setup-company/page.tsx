/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Building2, MapPin, Hash, ArrowRight, Upload, 
  X, Phone, User, Palette, CheckCircle2, ChevronLeft,
  Briefcase, Star, Zap, Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { updateCompany } from "@/lib/dashboard-actions";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

// ── Sub-components ──────────────────────────────────────────────────

const StageHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="space-y-3 mb-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-700">
    <h1 className="text-2xl md:text-3xl font-semibold text-[#011223] dark:text-white tracking-tight leading-tight">
      {title}
    </h1>
    {subtitle && <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium max-w-md mx-auto">{subtitle}</p>}
  </div>
);

const InputWrapper = ({ children, icon: Icon }: { children: React.ReactNode, icon: any }) => (
  <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 group-focus-within:text-[#011223] dark:group-focus-within:text-[#5b9de8] transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    {children}
  </div>
);

const inputCls = "w-full h-[64px] pl-16 pr-6 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.08] text-base focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] transition-all text-gray-900 dark:text-white placeholder:text-gray-400 font-medium";

// ── Invoice Previews ──────────────────────────────────────────────────

const ModernPreview = () => (
  <div className="w-full h-full bg-white dark:bg-slate-900 p-4 flex flex-col gap-2 overflow-hidden rounded-xl">
    <div className="flex justify-between items-start mb-2"><div className="w-12 h-3 bg-gray-100 dark:bg-white/10 rounded" /><div className="w-6 h-6 bg-blue-500/10 rounded-full" /></div>
    <div className="w-full h-1.5 bg-gray-50 dark:bg-white/5 rounded" /><div className="w-2/3 h-1.5 bg-gray-50 dark:bg-white/5 rounded" />
    <div className="mt-4 space-y-2"><div className="flex justify-between border-b border-gray-50 dark:border-white/5 pb-1"><div className="w-1/3 h-1 bg-gray-100 dark:bg-white/10 rounded" /><div className="w-1/6 h-1 bg-gray-100 dark:bg-white/10 rounded" /></div></div>
    <div className="mt-auto flex justify-end"><div className="w-1/3 h-3 bg-blue-500 rounded" /></div>
  </div>
);

const ClassicPreview = () => (
  <div className="w-full h-full bg-white dark:bg-slate-900 p-4 flex flex-col gap-2 overflow-hidden rounded-xl">
    <div className="text-center mb-2 border-b border-gray-100 dark:border-white/5 pb-1 uppercase text-[6px] font-bold opacity-40">Facture</div>
    <div className="flex justify-between"><div className="w-12 h-1 bg-gray-200 dark:bg-white/20 rounded" /><div className="w-8 h-8 border border-gray-100 dark:border-white/10 rounded" /></div>
    <div className="mt-4 grid grid-cols-3 gap-1"><div className="h-1 bg-gray-200 dark:bg-white/20 rounded" /><div className="h-1 bg-gray-200 dark:bg-white/20 rounded" /><div className="h-1 bg-gray-200 dark:bg-white/20 rounded" /></div>
    <div className="mt-auto pt-1 border-t border-gray-100 dark:border-white/5 flex justify-between"><div className="w-10 h-1.5 bg-gray-100 dark:bg-white/10 rounded" /><div className="w-10 h-1.5 bg-gray-900 dark:bg-white rounded" /></div>
  </div>
);

const PremiumPreview = () => (
  <div className="w-full h-full bg-slate-900 p-4 flex flex-col gap-2 overflow-hidden rounded-xl border border-amber-500/10">
    <div className="flex justify-between items-center mb-2"><div className="w-14 h-3 bg-gradient-to-r from-amber-500 to-amber-200 rounded" /><div className="w-4 h-4 bg-amber-500/20 rounded-full" /></div>
    <div className="w-1/2 h-1 bg-white/5 rounded" />
    <div className="mt-4 space-y-2"><div className="h-0.5 bg-amber-500/20 w-full" /><div className="flex justify-between"><div className="w-1/4 h-1 bg-white/10 rounded" /><div className="w-1/6 h-1 bg-white/10 rounded" /></div></div>
    <div className="mt-auto flex justify-between items-end"><div className="w-10 h-1 bg-white/5 rounded" /><div className="p-1.5 bg-amber-600 rounded shadow-lg shadow-amber-600/10"><div className="w-8 h-2 bg-white/20 rounded" /></div></div>
  </div>
);

const MinimalPreview = () => (
  <div className="w-full h-full bg-white dark:bg-slate-900 p-4 flex flex-col gap-4 overflow-hidden rounded-xl">
    <div className="flex flex-col gap-1"><div className="w-20 h-2 bg-gray-900 dark:bg-white rounded-full" /><div className="w-12 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full" /></div>
    <div className="mt-4 space-y-2"><div className="w-full h-1 bg-gray-50 dark:bg-white/5 rounded-full" /><div className="w-full h-1 bg-gray-50 dark:bg-white/5 rounded-full" /><div className="w-1/2 h-1 bg-gray-50 dark:bg-white/5 rounded-full" /></div>
    <div className="mt-auto flex justify-between"><div className="w-12 h-2 bg-gray-100 dark:bg-white/10 rounded-full" /><div className="w-12 h-2 bg-gray-100 dark:bg-white/10 rounded-full" /></div>
  </div>
);

const BoldPreview = () => (
  <div className="w-full h-full bg-white dark:bg-slate-900 p-0 flex flex-col overflow-hidden rounded-xl">
    <div className="h-10 bg-[#011223] dark:bg-white/10 flex items-center px-4 justify-between"><div className="w-12 h-2 bg-white/40 rounded-full" /><div className="w-8 h-2 bg-white/20 rounded-full" /></div>
    <div className="p-4 space-y-3 flex-1">
      <div className="flex justify-between"><div className="w-1/2 h-2 bg-gray-100 dark:bg-white/5 rounded-full" /><div className="w-1/4 h-2 bg-blue-500 rounded-full" /></div>
      <div className="mt-4 space-y-1"><div className="w-full h-4 bg-gray-50 dark:bg-white/5 rounded" /><div className="w-full h-4 bg-gray-50 dark:bg-white/5 rounded" /></div>
    </div>
    <div className="p-4 bg-gray-50 dark:bg-white/5 flex justify-end"><div className="w-20 h-4 bg-[#011223] dark:bg-blue-500 rounded" /></div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────

export default function SetupCompanyPage() {
  const router = useRouter();
  const [stage, setStage] = useState(0); 
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    user_name: "", user_phone: "", name: "", industry: "Technologie & Digital", niu: "", address: "", email: "", phone: "", logo_url: "", template: "modern",
  });

  const nextStage = () => setStage(prev => prev + 1);
  const prevStage = () => setStage(prev => prev - 1);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    const supabase = createClient();
    try {
      await supabase.auth.updateUser({ data: { full_name: formData.user_name, phone_number: formData.user_phone } });
      let finalLogoUrl = "";
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `logos/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, logoFile);
        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
        const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(filePath);
        finalLogoUrl = publicUrl;
      }
      await updateCompany({ name: formData.name, industry: formData.industry, niu: formData.niu, address: formData.address, email: formData.email || null, phone: formData.phone || formData.user_phone || null, logo_url: finalLogoUrl || formData.logo_url || null, template: formData.template });
      toast.success("Bienvenue à bord !");
      router.push(`/invoices/new?template=${formData.template}`);
    } catch (error: any) { toast.error(error.message || "Erreur."); } finally { setIsLoading(false); }
  };

  const renderStage = () => {
    if (stage === 0) return (
      <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 py-6">
        <div className="w-16 h-16 bg-[#011223] dark:bg-white/[0.05] rounded-[24px] flex items-center justify-center mx-auto shadow-2xl mb-6">
           <Briefcase className="w-8 h-8 text-white dark:text-[#5b9de8]" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#011223] dark:text-white tracking-tight leading-none">
            Prêt à passer <br /><span className="text-blue-500 dark:text-[#5b9de8]">au niveau supérieur ?</span>
          </h1>
          <p className="text-sm md:text-lg text-gray-500 dark:text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
            Configurons votre espace Bossbook pour que vous puissiez facturer dès aujourd&apos;hui.
          </p>
        </div>
        <div className="pt-4">
          <Button onClick={nextStage} className="h-[64px] px-10 rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-base hover:scale-[1.03] transition-all shadow-xl active:scale-95 group">
            C&apos;est parti <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    );

    if (stage === 1) return (
      <div className="space-y-8 max-w-md mx-auto">
        <StageHeader title="Qui êtes-vous ?" subtitle="Dites-nous en un peu plus sur vous." />
        <div className="space-y-4">
          <InputWrapper icon={User}><input type="text" placeholder="Votre nom complet" value={formData.user_name} onChange={(e) => setFormData({...formData, user_name: e.target.value})} autoFocus className={inputCls} /></InputWrapper>
          <InputWrapper icon={Phone}><input type="tel" placeholder="Votre numéro de téléphone" value={formData.user_phone} onChange={(e) => setFormData({...formData, user_phone: e.target.value})} className={inputCls} /></InputWrapper>
          <Button disabled={!formData.user_name} onClick={nextStage} className="w-full h-[60px] rounded-2xl bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-base hover:opacity-90 transition-all shadow-xl disabled:opacity-50">Continuer</Button>
        </div>
      </div>
    );

    if (stage === 2) return (
      <div className="space-y-8 max-w-md mx-auto">
        <StageHeader title="Votre entreprise" subtitle="Comment s'appelle votre structure ?" />
        <div className="space-y-6">
          <InputWrapper icon={Building2}><input type="text" placeholder="Nom de l'entreprise" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} autoFocus className={inputCls} /></InputWrapper>
          <div className="grid grid-cols-1 gap-2">
            <p className="text-[10px] font-bold text-gray-400 mb-2 px-2 uppercase tracking-widest">Secteur d&apos;activité</p>
            <div className="grid grid-cols-2 gap-2">
              {["Technologie", "Services", "Commerce", "Artisanat"].map((item) => (
                <button key={item} onClick={() => setFormData({...formData, industry: item})} className={cn("h-12 rounded-xl border text-[11px] font-bold transition-all", formData.industry === item ? "bg-[#011223] dark:bg-[#5b9de8] border-transparent text-white dark:text-[#011223]" : "bg-gray-50 dark:bg-white/[0.03] border-gray-100 dark:border-white/[0.08] text-gray-500 hover:bg-gray-100")}>{item}</button>
              ))}
            </div>
          </div>
          <Button disabled={!formData.name} onClick={nextStage} className="w-full h-[60px] rounded-2xl bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-base hover:opacity-90 transition-all shadow-xl disabled:opacity-50">Suivant</Button>
        </div>
      </div>
    );

    if (stage === 3) return (
      <div className="space-y-8 max-w-md mx-auto">
        <StageHeader title="Informations légales" subtitle="Ces infos apparaîtront sur vos factures." />
        <div className="space-y-4">
          <InputWrapper icon={Hash}><input type="text" placeholder="Numéro NIU" value={formData.niu} onChange={(e) => setFormData({...formData, niu: e.target.value})} autoFocus className={inputCls} /></InputWrapper>
          <InputWrapper icon={MapPin}><input type="text" placeholder="Adresse du siège" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className={inputCls} /></InputWrapper>
          <Button onClick={nextStage} className="w-full h-[60px] rounded-2xl bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-base hover:opacity-90 transition-all shadow-xl">Continuer</Button>
        </div>
      </div>
    );

    if (stage === 4) return (
      <div className="space-y-8 w-full max-w-full">
        <StageHeader title="Choisissez votre style" subtitle="Sélectionnez le modèle qui vous ressemble." />
        
        {/* Mobile Carousel & Desktop Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:overflow-visible hide-scrollbar scroll-smooth">
          {[
            { id: "modern", name: "Moderne", desc: "Épuré", Preview: ModernPreview, icon: Zap },
            { id: "classic", name: "Classique", desc: "Sobre", Preview: ClassicPreview, icon: Briefcase },
            { id: "premium", name: "Premium", desc: "Élégant", Preview: PremiumPreview, icon: Star },
            { id: "minimal", name: "Minimal", desc: "Simple", Preview: MinimalPreview, icon: User },
            { id: "bold", name: "Impact", desc: "Fort", Preview: BoldPreview, icon: Zap }
          ].map((tpl) => (
            <button 
              key={tpl.id} 
              onClick={() => { setFormData({...formData, template: tpl.id}); }} 
              className={cn(
                "relative flex flex-col p-4 rounded-[32px] border-2 transition-all group overflow-hidden min-h-[340px] md:min-h-[380px] text-left shrink-0 snap-center w-[80vw] md:w-auto", 
                formData.template === tpl.id 
                  ? "border-[#011223] dark:border-[#5b9de8] bg-white dark:bg-white/[0.05] shadow-lg" 
                  : "border-gray-100 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.02] hover:border-gray-200"
              )}
            >
              <div className="flex-1 rounded-2xl overflow-hidden mb-4 bg-gray-100 dark:bg-black/20 p-1"><tpl.Preview /></div>
              <div className="px-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-0.5">{tpl.name}</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{tpl.desc}</p>
              </div>
              {formData.template === tpl.id && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white rounded-full p-1 shadow-lg">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </button>
          ))}
        </div>
        
        <div className="flex justify-center pt-4">
          <Button onClick={nextStage} className="h-[60px] px-12 rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-base shadow-xl">
            Valider ce style
          </Button>
        </div>
      </div>
    );

    if (stage === 5) return (
      <div className="space-y-8 max-w-md mx-auto">
        <StageHeader title="Une image de marque" subtitle="Ajoutez votre logo." />
        <div className="space-y-6">
          <div onClick={() => document.getElementById('logo-upload')?.click()} className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-100 dark:border-white/[0.08] rounded-[32px] bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-all cursor-pointer relative h-48">
            <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            {logoPreview ? <div className="relative w-full h-full"><img src={logoPreview} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-4" /><button onClick={(e) => { e.stopPropagation(); setLogoFile(null); setLogoPreview(null); }} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white"><X className="w-4 h-4" /></button></div> : <div className="text-center space-y-3"><div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/[0.08] flex items-center justify-center shadow-lg mx-auto"><Upload className="w-6 h-6 text-gray-400" /></div><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Logo (Optionnel)</p></div>}
          </div>
          <Button disabled={isLoading} onClick={handleFinish} className="w-full h-[64px] rounded-2xl bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-lg shadow-xl">{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Terminer"}</Button>
        </div>
      </div>
    );

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-[#0c1425] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40"><div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-50/50 dark:bg-blue-900/5 rounded-full blur-[100px]" /><div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-50/50 dark:bg-indigo-900/5 rounded-full blur-[100px]" /></div>
      {stage > 0 && (
        <div className="fixed top-0 left-0 w-full p-4 md:p-8 flex items-center justify-between z-50">
          <button onClick={prevStage} className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white/80 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-full shadow-sm"><ChevronLeft className="w-4 h-4" /><span className="hidden sm:inline uppercase tracking-widest">Retour</span></button>
          <div className="flex items-center gap-1.5">{[1, 2, 3, 4, 5].map((s) => (<div key={s} className={cn("h-1 rounded-full transition-all duration-500", stage >= s ? "w-6 bg-[#011223] dark:bg-[#5b9de8]" : "w-1.5 bg-gray-200 dark:bg-white/10")} />))}</div>
          <div className="text-[10px] font-bold text-gray-400">{stage}/5</div>
        </div>
      )}
      <div className={cn("w-full z-10 transition-all duration-700", stage === 4 ? "max-w-6xl" : "max-w-2xl")}>
        <div className={cn("bg-white dark:bg-white/[0.02] dark:border dark:border-white/[0.05] rounded-[40px] md:rounded-[48px] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]", stage === 0 && "bg-transparent dark:bg-transparent border-none shadow-none")}>
          {renderStage()}
        </div>
      </div>
      <div className="fixed bottom-6 left-0 w-full text-center pointer-events-none opacity-30"><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-white">Bossbook © 2026</p></div>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
