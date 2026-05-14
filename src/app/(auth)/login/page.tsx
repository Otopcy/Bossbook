/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight, Zap, ChevronLeft, Loader2, Phone
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Icons ─────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#FBBC05" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#34A853" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.96.95-2.05 1.44-3.13 1.44-1.08 0-1.89-.36-2.92-.36-1.03 0-1.98.39-3.01.39-1.08 0-2.32-.58-3.41-1.67C2.79 18.29 1.44 15.35 1.44 12.3c0-4.66 3.06-7.14 6.01-7.14 1.54 0 2.87.97 3.82.97.95 0 2.45-1.11 4.31-1.11 1.03 0 2.45.41 3.44 1.44-4.14 2.29-3.41 7.84.86 9.68-.86 2.16-1.87 4.14-2.87 5.14zM12.03 4.2c-.11-2.14 1.63-4.04 3.73-4.2.22 2.37-2.09 4.38-3.73 4.2z" />
    </svg>
  );
}

const inputCls = "w-full h-[58px] px-6 rounded-2xl bg-gray-50/80 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.08] text-base focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] transition-all text-gray-900 dark:text-white placeholder:text-gray-400 font-medium";

function AuthForm() {
  const supabase = createClient();
  const router = useRouter();
  const [method, setMethod] = useState<"email" | "phone" | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handlePostLogin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!company) {
        router.push("/setup-company");
      } else {
        router.push("/dashboard");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: 'select_account' }
      },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setLoading(true);
    try {
      const isEmail = identifier.includes('@');
      if (isEmail && !identifier.includes('.')) {
        throw new Error("Veuillez entrer une adresse e-mail valide.");
      }
      const { error: authError } = await supabase.auth.signInWithOtp({
        [isEmail ? 'email' : 'phone']: identifier,
        options: isEmail ? { emailRedirectTo: `${window.location.origin}/auth/callback` } : undefined,
      });
      if (authError) throw authError;
      setVerifying(true);
      setError(null);
      toast.success(isEmail ? "Lien de connexion envoyé !" : "Code envoyé par SMS !");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isEmail = identifier.includes('@');
      const { error } = await supabase.auth.verifyOtp({
        [isEmail ? 'email' : 'phone']: identifier,
        token: otp,
        type: isEmail ? 'magiclink' : 'sms',
      });
      if (error) throw error;
      await handlePostLogin();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  if (verifying) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
        <button onClick={() => setVerifying(false)} className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Modifier l&apos;identifiant
        </button>
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Vérification</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            {identifier.includes('@') ? "Vérifiez vos e-mails." : "Entrez le code SMS reçu."}
          </p>
        </div>
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input type="text" placeholder="Code de vérification" value={otp} onChange={(e) => setOtp(e.target.value)} autoFocus className={inputCls} />
          <Button disabled={loading || otp.length < 6} className="w-full h-[58px] rounded-2xl bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-semibold hover:opacity-90 transition-all shadow-xl">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Vérifier"}
          </Button>
        </form>
      </div>
    );
  }

  if (method === "phone") {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
        <button onClick={() => setMethod(null)} className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Retour
        </button>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Numéro de téléphone</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Entrez votre numéro au format international.</p>
        </div>
        <form onSubmit={handleContinue} className="space-y-4">
          <input type="tel" placeholder="+237 6XX XXX XXX" value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoFocus className={inputCls} />
          <Button disabled={loading || !identifier.trim()} className="w-full h-[58px] rounded-2xl bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-semibold hover:opacity-90 transition-all shadow-xl">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continuer"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-1000 max-w-sm mx-auto">
      <div className="flex justify-center mb-2">
        <Image src="/logo-black-final.svg" alt="BOSSBOOK" width={140} height={32} priority className="dark:invert" />
      </div>

      <div className="text-center space-y-1 mb-5">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">Continuer avec</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Choisissez votre méthode de connexion.</p>
      </div>

      <div className="space-y-3">
        {/* Email Form - Integrated */}
        <form onSubmit={handleContinue} noValidate className="space-y-2">
          <div className="relative group">
            <input 
              type="email" 
              placeholder="Adresse e-mail" 
              value={identifier}
              onChange={(e) => { setIdentifier(e.target.value); setError(null); }}
              className={cn(inputCls, "pr-14", error && "border-red-500/50 bg-red-50/30 dark:bg-red-500/5")} 
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#011223] dark:bg-[#5b9de8] flex items-center justify-center text-white dark:text-[#011223] transition-all hover:scale-105 active:scale-95">
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          {error && (
            <div className="px-4 py-2 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl animate-in fade-in slide-in-from-top-1 duration-300">
              <p className="text-[11px] font-bold text-red-600 dark:text-red-400 leading-tight">
                {error}
              </p>
            </div>
          )}
        </form>

        {/* Phone Button - Primary list */}
        <button 
          onClick={() => { setMethod("phone"); setIdentifier(""); setError(null); }} 
          className="w-full h-[58px] rounded-2xl border border-gray-100 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-all flex items-center gap-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-200"
        >
          <Phone className="w-4 h-4 text-gray-400" /> Numéro de téléphone
        </button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100 dark:border-white/[0.05]"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 bg-white dark:bg-[#0c1425] px-2 tracking-widest">Ou</div>
        </div>

        {/* Social Buttons Side-by-Side */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleGoogleLogin} className="w-full h-[58px] rounded-2xl border border-gray-100 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-all flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <GoogleIcon /> Google
          </button>
          <button onClick={handleAppleLogin} className="w-full h-[58px] rounded-2xl border border-gray-100 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-all flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <AppleIcon /> Apple
          </button>
        </div>
      </div>

      <div className="pt-2 flex flex-col items-center gap-3">
        <p className="text-[9px] text-gray-400 text-center max-w-[280px] leading-relaxed">
          En continuant, vous acceptez nos <span onClick={() => setShowTerms(true)} className="underline cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">conditions d&apos;utilisation</span> et notre <span onClick={() => setShowPrivacy(true)} className="underline cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">politique de confidentialité</span>.
        </p>
        <button onClick={() => router.push("/dashboard")} className="text-[10px] font-semibold text-gray-400 hover:text-gray-900 flex items-center gap-1.5 transition-all">
          <Zap className="w-3 h-3" /> Mode Démo
        </button>
      </div>

      {/* Footer Text closer */}
      <div className="pt-4 pb-4 text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
          BOSSBOOK © 2026 • BILLING EXCELLENCE
        </p>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      {(showTerms || showPrivacy) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1c2537] w-full max-w-2xl max-h-[80vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 dark:border-white/[0.08] flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {showTerms ? "Conditions d'utilisation" : "Politique de confidentialité"}
              </h2>
              <button onClick={() => { setShowTerms(false); setShowPrivacy(false); }} className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-110">
                <ChevronLeft className="w-5 h-5 rotate-90" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="space-y-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                {showTerms ? (
                  <>
                    <p>Bienvenue sur Bossbook. En utilisant nos services, vous acceptez les présentes conditions.</p>
                    <h3 className="text-gray-900 dark:text-white font-bold">1. Utilisation du service</h3>
                    <p>Bossbook est un logiciel de facturation destiné aux professionnels. Vous vous engagez à fournir des informations exactes lors de votre inscription.</p>
                  </>
                ) : (
                  <>
                    <p>Nous accordons une grande importance à la protection de vos données personnelles.</p>
                    <h3 className="text-gray-900 dark:text-white font-bold">1. Collecte des données</h3>
                    <p>Nous collectons uniquement les données nécessaires à la fourniture de notre service de facturation (E-mail, téléphone, informations d&apos;entreprise).</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>}>
      <div className="min-h-screen bg-white dark:bg-[#0c1425] flex flex-col items-center justify-start pt-[10vh] pb-8 px-4">
        <AuthForm />
      </div>
    </Suspense>
  );
}
