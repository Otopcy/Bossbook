"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BOSSPhoneInput } from "@/components/ui/phone-input";

// Reuse the same input style
const inputCls = "w-full h-[62px] px-6 rounded-2xl bg-gray-50/50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.08] text-base focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] transition-all text-gray-900 dark:text-white placeholder:text-gray-400 font-medium shadow-sm";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [regMethod, setRegMethod] = useState<"email" | "phone">("email");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/setup-company");
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-1000 max-w-sm mx-auto">
      <div className="flex justify-center mb-8">
        <Image src="/logo-black-final.svg" alt="BOSSBOOK" width={180} height={40} priority className="dark:invert opacity-90" />
      </div>

      <div className="text-center space-y-3 mb-8">
        <h1 className="text-[28px] md:text-[32px] font-black text-[#011223] dark:text-white tracking-tight leading-tight">
          Prêt à automatiser ?
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-[280px] mx-auto leading-relaxed">
          Rejoignez Bossbook et simplifiez votre facturation en un clin d&apos;œil.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-4">Nom complet</label>
          <div className="relative group">
            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#5b9de8] transition-colors" />
            <input 
              type="text" 
              placeholder="Giovanny MBOG" 
              required
              className={cn(inputCls, "pl-14")}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
        </div>

        <div className="flex p-1 bg-gray-100 dark:bg-white/[0.04] rounded-2xl mb-4">
          <button 
            type="button"
            onClick={() => setRegMethod("email")}
            className={cn(
              "flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              regMethod === "email" ? "bg-white dark:bg-white/[0.1] text-[#011223] dark:text-white shadow-sm" : "text-gray-500"
            )}
          >
            Email
          </button>
          <button 
            type="button"
            onClick={() => setRegMethod("phone")}
            className={cn(
              "flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              regMethod === "phone" ? "bg-white dark:bg-white/[0.1] text-[#011223] dark:text-white shadow-sm" : "text-gray-500"
            )}
          >
            Téléphone
          </button>
        </div>

        {regMethod === "email" ? (
          <div className="space-y-1.5 animate-in slide-in-from-left-4 duration-300">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-4">Email professionnel</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#5b9de8] transition-colors" />
              <input 
                type="email" 
                placeholder="giovanny@entreprise.com" 
                required
                className={cn(inputCls, "pl-14")}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 animate-in slide-in-from-right-4 duration-300">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-4">Numéro de téléphone</label>
            <div className={cn(inputCls, "flex items-center")}>
              <BOSSPhoneInput 
                value={formData.phone} 
                onChange={(val) => setFormData({...formData, phone: val})} 
                className="w-full"
                placeholder="Votre numéro"
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-4">Mot de passe</label>
          <div className="relative group">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#5b9de8] transition-colors" />
            <input 
              type="password" 
              placeholder="8+ caractères" 
              required
              className={cn(inputCls, "pl-14")}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
        </div>

        <div className="flex items-start gap-3 px-2 py-2">
          <div className="mt-0.5 w-5 h-5 rounded-md border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.02] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5b9de8]" />
          </div>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-normal">
            J&apos;accepte les <span className="underline cursor-pointer">conditions</span> et la <span className="underline cursor-pointer">politique de confidentialité</span>.
          </span>
        </div>

        <Button type="submit" className="w-full h-[62px] rounded-2xl bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-black text-base hover:scale-[1.02] active:scale-95 transition-all shadow-xl mt-2">
          Commencer l&apos;aventure <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </form>

      <div className="pt-4 text-center">
        <p className="text-xs text-gray-500 font-medium">
          Déjà membre ? {" "}
          <Link href="/login" className="text-[#5b9de8] font-bold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
