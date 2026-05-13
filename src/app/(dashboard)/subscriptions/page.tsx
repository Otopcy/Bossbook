/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { CreditCard, Check, Crown, Zap, Shield, Infinity, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormattedAmount } from "@/components/ui/formatted-amount";
import { useCurrency } from "@/context/currency-context";

type BillingCycle = "monthly" | "yearly";

export default function SubscriptionsPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const { currency, convert, setCurrency } = useCurrency();

  const getPrice = (baseXAF: number): number => {
    if (baseXAF === 0) return 0;
    
    let price = baseXAF;
    if (billingCycle === "yearly") price = baseXAF * 10; // 2 months free

    return convert(price);
  };

  const getSavingAmount = (): number => {
    return convert(200000);
  };

  const getCurrencySymbol = () => {
    if (currency === "XAF") return "XAF";
    if (currency === "USD") return "$";
    if (currency === "EUR") return "€";
    return "";
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20 px-4">
      {/* Header with Centered Controls */}
      <div className="flex flex-col items-center gap-8 pt-12 animate-in fade-in slide-in-from-top-4 duration-700 text-center">
        <div className="space-y-3">
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
            Passez à <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c6ff] via-[#0078d4] to-[#00a8e8]">BOSSBOOK Pro</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium max-w-lg mx-auto">
            Sélectionnez le plan idéal pour propulser votre activité commerciale.
          </p>
        </div>

        {/* Unified Control Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          {/* Billing Toggle (Main) */}
          <div className="p-1 bg-gray-100 dark:bg-white/[0.05] rounded-full flex items-center shadow-inner border border-gray-200 dark:border-white/[0.05]">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full text-[10px] font-black transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-[#1c2537] text-gray-900 dark:text-white shadow-md"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
              }`}
            >
              MENSUEL
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full text-[10px] font-black transition-all duration-300 relative ${
                billingCycle === "yearly"
                  ? "bg-white dark:bg-[#1c2537] text-gray-900 dark:text-white shadow-md"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
              }`}
            >
              ANNUEL
              <span className="absolute -top-3 -right-8 px-2 py-0.5 bg-blue-500 text-white text-[7px] font-black rounded-full shadow-lg whitespace-nowrap flex items-center gap-1">
                ÉCONOMISEZ <FormattedAmount amount={getSavingAmount()} currency={getCurrencySymbol()} className="text-[7px]" centsClassName="hidden" currencyClassName="hidden" /> {currency === "XAF" ? "XAF" : getCurrencySymbol()}
              </span>
            </button>
          </div>

          {/* Currency Toggle (Syncs with Global Settings) */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-white/[0.05] rounded-full border border-gray-200 dark:border-white/[0.05]">
            {(["XAF", "USD", "EUR"] as any[]).map((cur) => (
              <button
                key={cur}
                onClick={() => setCurrency(cur as any)}
                className={`px-4 py-1.5 rounded-full text-[10px] uppercase transition-all duration-300 ${
                  currency === cur
                    ? "bg-white dark:bg-[#1c2537] text-blue-500 dark:text-[#00c6ff] shadow-md font-bold"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 font-light"
                }`}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Cards: 3 Plans Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
        
        {/* Gratuit Card */}
        <div className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05] rounded-[32px] p-6 md:p-8 flex flex-col transition-all duration-500 hover:translate-y-[-4px] items-start">
          <div className="mb-6 w-full">
            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/[0.05] flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Gratuit</h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">Pour bien démarrer.</p>
          </div>
          
          <div className="mb-6 flex items-baseline gap-1.5 w-full">
            <FormattedAmount amount={0} currency={getCurrencySymbol()} className="text-4xl" />
          </div>

          <div className="flex flex-col items-start w-full mb-8">
            <Button variant="outline" className="self-start rounded-full h-11 px-8 text-xs font-bold border border-gray-100 dark:border-white/[0.05] text-gray-400 dark:text-gray-500 transition-all opacity-80 pointer-events-none shadow-sm ml-0">
              Votre forfait actuel
            </Button>
          </div>

          <div className="space-y-4 flex-1 w-full">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Inclus</p>
            {[
              "Jusqu'à 5 factures par mois",
              "Gestion de 10 clients maximum",
              "10 produits maximum et services",
              "Modèle de facture basique",
              "Facture avec le logo BossBook",
              "Support par email disponible",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-gray-300" />
                <span className="text-[12px] font-bold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/[0.03] pb-0.5">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Card (Middle Premium) */}
        <div className="bg-[#1c2537] rounded-[32px] p-6 md:p-8 flex flex-col shadow-2xl shadow-blue-900/20 relative overflow-hidden transition-all duration-500 hover:translate-y-[-6px] items-start border border-blue-500/10">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <div className="mb-6 relative z-10 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00c6ff] to-[#0078d4] flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-light text-amber-400 uppercase tracking-[0.2em] bg-amber-400/10 px-3 py-1 rounded-full">Populaire</span>
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">Pro</h3>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Pour les professionnels.</p>
          </div>
          
          <div className="mb-6 relative z-10 flex flex-col gap-1 w-full items-start">
            {billingCycle === "yearly" && (
              <div className="ml-0 mb-1">
                <FormattedAmount 
                  amount={getPrice(10000) * 1.2} // 12 months vs 10 months (discounted)
                  currency={getCurrencySymbol()} 
                  className="text-xs text-gray-500/70 line-through decoration-gray-400" 
                />
              </div>
            )}
            <div className="flex items-baseline gap-1.5 ml-0">
              <FormattedAmount amount={getPrice(10000)} currency={getCurrencySymbol()} className="text-4xl text-white" />
              <span className="text-xs text-gray-400 font-bold ml-1"> / {billingCycle === "monthly" ? "mois" : "an"}</span>
            </div>
          </div>

          <div className="mb-8 w-full group flex flex-col items-start">
            <Button className="self-start relative z-10 rounded-full h-12 px-12 text-sm font-black bg-gradient-to-r from-[#00c6ff] via-[#0078d4] to-[#00c6ff] bg-[length:200%_auto] hover:bg-right text-white transition-all duration-500 shadow-xl shadow-blue-500/40 border-none ml-0">
              Essayer pendant 14 jours
            </Button>
            <p className="text-[11px] text-gray-400 font-light mt-3 px-2 ml-0">
              C&apos;est gratuit et sans engagement.
            </p>
          </div>

          <div className="relative z-10 space-y-4 flex-1 w-full">
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Avantages</p>
            {[
              "Facture et devis illimités",
              "Client produit service illimités",
              "Facture périodique automatisées",
              "Rapport avancé en PDF, en PNG et en PPTX",
              "Support prioritaire 24h/7j",
              "Marque blanche (sans logo Bossbook)",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#00c6ff]" />
                <span className="text-[12px] font-bold text-gray-300 border-b border-white/5 pb-0.5">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Entreprise Card (Right) */}
        <div className="bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.1] rounded-[32px] p-6 md:p-8 flex flex-col transition-all duration-500 hover:translate-y-[-4px] items-start">
          <div className="mb-6 w-full">
            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/[0.1] flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Entreprise</h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">Puissance & Automatisation.</p>
          </div>
          
          <div className="mb-6 flex flex-col w-full">
            <span className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Personnalisé</span>
          </div>

          <div className="flex flex-col items-start w-full mb-8">
            <Button variant="outline" className="self-start rounded-full h-11 px-8 text-xs font-bold border border-gray-100 dark:border-white/[0.05] text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm ml-0">
              Contactez-nous
            </Button>
          </div>

          <div className="space-y-4 flex-1 w-full">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Exclusivités</p>
            {[
              "Tout ce qui est dans Pro",
              "Automatisation IA",
              "Gestion des commerciaux",
              "Compte manager dédié",
              "Support dédié",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[12px] font-bold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/[0.03] pb-0.5">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust & Benefits Footer */}
      <div className="mt-20 pt-16 border-t border-gray-100 dark:border-white/[0.05] w-full">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-6xl mx-auto px-4 pb-20">
          {[
            { icon: Shield, text: "Paiement sécurisé", sub: "Mobile money, Carte bancaire, PayPal", color: "text-gray-400", bg: "bg-gray-100/50 dark:bg-white/[0.04]" },
            { icon: Zap, text: "Activation immédiate", sub: "Prêt en moins de 3 s", color: "text-gray-400", bg: "bg-gray-100/50 dark:bg-white/[0.04]" },
            { icon: CreditCard, text: "Satisfait ou remboursé", sub: "Garantie de 14 jours", color: "text-gray-400", bg: "bg-gray-100/50 dark:bg-white/[0.04]" },
            { icon: Infinity, text: "Abonnements", sub: "Paiement mensuel, résiliation facile", color: "text-gray-400", bg: "bg-gray-100/50 dark:bg-white/[0.04]" },
            { icon: XCircle, text: "Garantie", sub: "Résilier à tout moment", color: "text-gray-400", bg: "bg-gray-100/50 dark:bg-white/[0.04]" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3 group">
              <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{item.text}</p>
                <p className="text-[9px] font-bold text-gray-400/80">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
