"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation register -> Go to onboarding
    router.push("/setup-company");
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Créer un compte</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">il faut juste gérer et automatiser votre facturation en un seul endroit et gratuitement.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Nom complet</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Giovanny MBOG" 
              required
              className="w-full h-12 pl-11 pr-4 rounded-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] transition-all text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Email professionnel</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="email" 
              placeholder="giovanny@entreprise.com" 
              required
              className="w-full h-12 pl-11 pr-4 rounded-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] transition-all text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="password" 
              placeholder="Minimum 8 caractères" 
              required
              className="w-full h-12 pl-11 pr-4 rounded-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] transition-all text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 pt-2">
          <div className="w-4 h-4 rounded-md border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.02] flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-[#5b9de8]" />
          </div>
          <span className="text-[10px] text-gray-500 font-medium">J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité.</span>
        </div>

        <Button type="submit" className="w-full h-12 rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-black text-sm hover:scale-[1.02] transition-all shadow-lg mt-2">
          Créer mon compte <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-6">
        Déjà un compte ? {" "}
        <Link href="/login" className="text-[#5b9de8] font-bold hover:underline">Se connecter</Link>
      </p>
    </div>
  );
}
