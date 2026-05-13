"use client";

import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Mail, Lock, ArrowRight, User, Zap,
  Eye, EyeOff, ChevronLeft, Loader2, Phone
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { login, signup } from "./actions";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────
type AuthMethod = "email" | "phone" | null;

// ── Google SVG ─────────────────────────────────────────────────────────────
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

// ── Shared input classes ───────────────────────────────────────────────────
const inputCls =
  "w-full h-[54px] pl-11 pr-4 rounded-2xl bg-gray-50/50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-gray-900 placeholder:text-gray-400 font-medium";

// ── Main component ─────────────────────────────────────────────────────────
function LoginForm() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Sign-up flow state
  const [signupMethod, setSignupMethod] = useState<AuthMethod>(null); // null = choose, email/phone = form
  const [signupStep, setSignupStep] = useState(0); // 0: identifier, 1: password

  // Sign-in flow state
  const [loginMethod, setLoginMethod] = useState<AuthMethod>(null); // null = choose
  const [loginStep, setLoginStep] = useState(0); // 0: identifier, 1: password

  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");

  // ── Tab switch ─────────────────────────────────────────────────────────
  const switchTab = (login: boolean) => {
    setIsLogin(login);
    setSignupMethod(null);
    setSignupStep(0);
    setLoginMethod(null);
    setLoginStep(0);
    setIdentifier("");
    setShowPassword(false);
  };

  // ── Form submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const action = isLogin ? login : signup;
    
    try {
      const result = await action(formData);
      console.log("Auth result:", result);
      
      if (result?.success === 'OTP_SENT') {
        if (isLogin) setLoginStep(1);
        else setSignupStep(1);
      } else if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        // Handle direct success if applicable
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast.error("Une erreur inattendue s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  // ── Demo ───────────────────────────────────────────────────────────────
  const handleDemoMode = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("identifier", "demo@bossbook.pro");
    formData.append("password", "password123");
    const result = await login(formData);
    if (result?.error) {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  // ── Description text ───────────────────────────────────────────────────
  const subtitle = "Gérer vos factures et automatiser votre processus de facturation en un seul endroit et gratuitement.";

  // ══════════════════════════════════════════════════════════════════════
  // REGISTER — Step 0 : choose method
  // ══════════════════════════════════════════════════════════════════════
  const renderSignupChoose = () => (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-400">
      {/* Phone */}
      <button
        type="button"
        onClick={() => setSignupMethod("phone")}
        className="w-full h-[54px] rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100/70 transition-all flex items-center gap-3 px-5 text-sm font-normal text-gray-800 group"
      >
        <Phone className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
        <span>S&apos;inscrire avec le téléphone</span>
        <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-gray-500 transition-colors" />
      </button>

      {/* Email */}
      <button
        type="button"
        onClick={() => setSignupMethod("email")}
        className="w-full h-[54px] rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100/70 transition-all flex items-center gap-3 px-5 text-sm font-normal text-gray-800 group"
      >
        <Mail className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
        <span>S&apos;inscrire avec l&apos;e-mail</span>
        <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-gray-500 transition-colors" />
      </button>

      {/* Divider */}
      <div className="relative flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">Ou</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full h-[54px] rounded-2xl border border-gray-100 bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-100 transition-all flex items-center justify-center gap-3 text-sm font-normal text-gray-700 group disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
        S&apos;inscrire avec Google
      </button>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════
  // REGISTER — Step 1 : identifier (email or phone)
  // REGISTER — Step 2 : password + name
  // ══════════════════════════════════════════════════════════════════════
  const renderSignupForm = () => (
    <form onSubmit={handleSubmit} className="space-y-5 animate-in slide-in-from-right-4 duration-500">
      {/* Back */}
      <button
        type="button"
        onClick={() => {
          if (signupStep === 1) {
            setSignupStep(0);
          } else {
            setSignupMethod(null);
            setIdentifier("");
          }
        }}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        {signupStep === 1 ? identifier : signupMethod === "email" ? "E-mail" : "Téléphone"}
      </button>

      {signupStep === 0 ? (
        /* ── Identifier (+ Name for phone signup) ── */
        <div className="space-y-5">
          {signupMethod === "phone" && (
            <div className="relative group animate-in fade-in slide-in-from-top-2 duration-300">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
              <input type="text" name="full_name" placeholder="Votre nom complet" required className={inputCls} />
            </div>
          )}
          <div className="relative group">
            {signupMethod === "email" ? (
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
            ) : (
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
            )}
            <input
              type={signupMethod === "email" ? "email" : "tel"}
              name="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={signupMethod === "email" ? "votre@email.com" : "+237 6XX XXX XXX"}
              required
              autoFocus
              className={inputCls}
            />
            {signupMethod === "phone" && (
              <p className="text-[10px] text-gray-400 mt-1.5 ml-1">Format international requis (ex: +237...)</p>
            )}
          </div>
          <Button
            type={signupMethod === "phone" ? "submit" : "button"}
            disabled={loading || !identifier.trim()}
            onClick={signupMethod === "email" ? () => setSignupStep(1) : undefined}
            className="w-full h-[56px] rounded-2xl bg-gray-900 text-white font-semibold text-sm hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {signupMethod === "phone" ? "Continuer" : "Suivant"} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      ) : (
        /* ── Password or OTP Verification ── */
        <div className="space-y-4">
          {signupMethod === "email" && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
              <input type="text" name="full_name" placeholder="Votre nom complet" required className={inputCls} />
            </div>
          )}
          <div className="relative group">
            {signupMethod === "email" ? (
              <>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mot de passe (min. 8 car.)"
                  required
                  autoFocus
                  className="w-full h-[54px] pl-11 pr-12 rounded-2xl bg-gray-50/50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </>
            ) : (
              <>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                <input
                  type="text"
                  name="token"
                  placeholder="Code de vérification (SMS)"
                  required
                  autoFocus
                  className="w-full h-[54px] pl-11 pr-4 rounded-2xl bg-gray-50/50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                />
              </>
            )}
          </div>
          {/* Hidden identifier */}
          <input type="hidden" name="identifier" value={identifier} />
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[56px] rounded-2xl bg-gray-900 text-white font-semibold text-sm hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (signupMethod === "phone" ? "Vérifier le code" : "Inscription")}
          </Button>
        </div>
      )}
    </form>
  );

  // ══════════════════════════════════════════════════════════════════════
  // LOGIN — Step 0 : choose method
  // ══════════════════════════════════════════════════════════════════════
  const renderLoginChoose = () => (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-400">
      {/* Phone */}
      <button
        type="button"
        onClick={() => setLoginMethod("phone")}
        className="w-full h-[54px] rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100/70 transition-all flex items-center gap-3 px-5 text-sm font-normal text-gray-800 group"
      >
        <Phone className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
        <span>Se connecter avec le téléphone</span>
        <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-gray-500 transition-colors" />
      </button>

      {/* Email */}
      <button
        type="button"
        onClick={() => setLoginMethod("email")}
        className="w-full h-[54px] rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100/70 transition-all flex items-center gap-3 px-5 text-sm font-normal text-gray-800 group"
      >
        <Mail className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
        <span>Se connecter avec l&apos;e-mail</span>
        <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-gray-500 transition-colors" />
      </button>

      {/* Divider */}
      <div className="relative flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">Ou</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full h-[54px] rounded-2xl border border-gray-100 bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-100 transition-all flex items-center justify-center gap-3 text-sm font-normal text-gray-700 group disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
        Se connecter avec Google
      </button>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════
  // LOGIN — Step 1 : identifier → Step 2 : password
  // ══════════════════════════════════════════════════════════════════════
  const renderLoginForm = () => (
    <form onSubmit={handleSubmit} className="space-y-5 animate-in slide-in-from-right-4 duration-500">
      {/* Back */}
      <button
        type="button"
        onClick={() => {
          if (loginStep === 1) {
            setLoginStep(0);
          } else {
            setLoginMethod(null);
            setIdentifier("");
          }
        }}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        {loginStep === 1 ? identifier : loginMethod === "email" ? "E-mail" : "Téléphone"}
      </button>

      {loginStep === 0 ? (
        /* ── Identifier ── */
        <div className="space-y-5">
          <div className="relative group">
            {loginMethod === "email" ? (
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
            ) : (
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
            )}
            <input
              type={loginMethod === "email" ? "email" : "tel"}
              name="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={loginMethod === "email" ? "votre@email.com" : "+237 6XX XXX XXX"}
              required
              autoFocus
              className={inputCls}
            />
            {loginMethod === "phone" && (
              <p className="text-[10px] text-gray-400 mt-1.5 ml-1">Format international requis (ex: +237...)</p>
            )}
          </div>
          <Button
            type={loginMethod === "phone" ? "submit" : "button"}
            disabled={loading || !identifier.trim()}
            onClick={loginMethod === "email" ? () => setLoginStep(1) : undefined}
            className="w-full h-[56px] rounded-2xl bg-gray-900 text-white font-semibold text-sm hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {loginMethod === "phone" ? "Continuer" : "Suivant"} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      ) : (
        /* ── Password ── */
        <div className="space-y-4">
          <div className="relative group">
            {loginMethod === "email" ? (
              <>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Votre mot de passe"
                  required
                  autoFocus
                  className="w-full h-[54px] pl-11 pr-12 rounded-2xl bg-gray-50/50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </>
            ) : (
              <>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                <input
                  type="text"
                  name="token"
                  placeholder="Code de vérification (SMS)"
                  required
                  autoFocus
                  className="w-full h-[54px] pl-11 pr-4 rounded-2xl bg-gray-50/50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                />
              </>
            )}
          </div>
          <div className="flex justify-end px-1">
            <button type="button" className="text-[11px] font-semibold text-gray-900 hover:underline underline-offset-4">
              Mot de passe oublié ?
            </button>
          </div>
          {/* Hidden identifier */}
          <input type="hidden" name="identifier" value={identifier} />
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[56px] rounded-2xl bg-gray-900 text-white font-semibold text-sm hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (loginMethod === "phone" && loginStep === 1 ? "Vérifier le code" : "Connexion")}
          </Button>
        </div>
      )}
    </form>
  );

  // ══════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-1000">
      {/* ── Logo ── */}
      <div className="flex justify-center">
        <Image src="/logo-black-final.svg" alt="Logo" width={180} height={40} priority />
      </div>

      {/* ── Header ── */}
      <div className="text-center space-y-3 px-2">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          {isLogin ? "Connexion" : "Inscription"}
        </h2>
        <p className="text-[13px] text-gray-500 font-medium leading-relaxed">{subtitle}</p>
      </div>

      {/* ── Segmented Control ── */}
      <div className="p-1 bg-gray-100/80 rounded-2xl flex relative h-12">
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out z-0 ${!isLogin ? "left-[calc(50%+2px)]" : "left-1"}`}
        />
        <button
          onClick={() => switchTab(true)}
          className={`flex-1 relative z-10 text-xs font-semibold transition-colors ${isLogin ? "text-gray-900" : "text-gray-500"}`}
        >
          Connexion
        </button>
        <button
          onClick={() => switchTab(false)}
          className={`flex-1 relative z-10 text-xs font-semibold transition-colors ${!isLogin ? "text-gray-900" : "text-gray-500"}`}
        >
          Inscription
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold text-center animate-in zoom-in duration-300">
          {error}
        </div>
      )}

      {/* ── Content ── */}
      {isLogin ? (
        loginMethod === null ? renderLoginChoose() : renderLoginForm()
      ) : (
        signupMethod === null ? renderSignupChoose() : renderSignupForm()
      )}

      {/* ── Demo mode ── */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          onClick={handleDemoMode}
          className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1.5"
        >
          <Zap className="w-3 h-3" /> Mode Démo
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
