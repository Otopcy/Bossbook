/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import { 
  CheckCircle2, Zap, Shield, Users, 
  CreditCard, FileText, Send, Wallet,
  Crown, Infinity, XCircle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";

// ── Types & Data ──────────────────────────────────────────────────

type Currency = "XAF" | "USD" | "EUR";
type BillingCycle = "monthly" | "yearly";

const PRICING_DATA = {
  XAF: { symbol: "XAF", monthly: 10000, yearly: 100000 },
  USD: { symbol: "$", monthly: 16, yearly: 160 },
  EUR: { symbol: "€", monthly: 15, yearly: 150 },
};

const PLANS = [
  {
    id: "gratuit",
    name: "Gratuit",
    desc: "Pour bien démarrer.",
    price: 0,
    features: [
      "Jusqu'à 5 factures / mois",
      "10 clients maximum",
      "10 produits et services",
      "Modèle de facture basique",
      "Logo BossBook inclus",
      "Support par email"
    ],
    cta: "Votre forfait actuel",
    disabled: true
  },
  {
    id: "pro",
    name: "Pro",
    desc: "Pour les professionnels.",
    price: 10000, // base XAF
    recommended: true,
    features: [
      "Factures et devis illimités",
      "Clients et produits illimités",
      "Factures périodiques auto",
      "Rapports avancés (PDF, PNG, PPTX)",
      "Support prioritaire 24/7",
      "Marque blanche (Sans logo)"
    ],
    cta: "Essayer 14 jours gratuitement",
    highlight: true
  },
  {
    id: "enterprise",
    name: "Entreprise",
    desc: "Puissance & Automatisation.",
    price: "Custom",
    features: [
      "Tout ce qui est dans Pro",
      "Automatisation IA avancée",
      "Gestion des commerciaux",
      "Compte manager dédié",
      "Support stratégique dédié",
      "Intégrations sur mesure"
    ],
    cta: "Contactez-nous",
    highlight: false
  }
];

// ── Components ──────────────────────────────────────────────────────

const Navbar = () => (
  <motion.nav 
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-[#011223]/40 backdrop-blur-2xl"
  >
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2.5 group cursor-pointer">
        <div className="w-10 h-10 bg-gradient-to-br from-[#5b9de8] to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-[#5b9de8]/20 group-hover:rotate-6 transition-transform duration-500">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-black text-white tracking-tighter italic">BOSSBOOK</span>
      </div>
      
      <div className="hidden lg:flex items-center gap-10">
        {['Fonctionnalités', 'Comment ça marche', 'Tarifs'].map((item, i) => (
          <a key={i} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#5b9de8] transition-colors">
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <Link href="/login" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Connexion</Link>
        <Link href="/register">
          <Button className="rounded-full bg-white text-[#011223] font-black text-[10px] uppercase tracking-widest px-8 h-11 hover:bg-[#5b9de8] hover:text-white transition-all">
            Démarrer
          </Button>
        </Link>
      </div>
    </div>
  </motion.nav>
);

const StepItem = ({ step, title, desc, icon: Icon, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: index * 0.2 }}
    className="flex gap-8 group"
  >
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#5b9de8] to-indigo-600 flex items-center justify-center text-white shadow-2xl relative z-10">
        <Icon className="w-8 h-8" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#011223] border-2 border-[#5b9de8] flex items-center justify-center text-[10px] font-black text-[#5b9de8]">
          {step}
        </div>
      </div>
      {index !== 2 && <div className="w-0.5 h-full bg-gradient-to-b from-[#5b9de8]/50 to-transparent my-4" />}
    </div>
    <div className="pt-2 pb-12">
      <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-[#5b9de8] transition-colors">{title}</h3>
      <p className="text-gray-400 font-medium leading-relaxed max-w-md">{desc}</p>
    </div>
  </motion.div>
);

// ── Main Page ────────────────────────────────────────────────────────

export default function LandingPage() {
  const [currency, setCurrency] = useState<Currency>("XAF");
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  
  const dashboardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: dashboardRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  const getPlanPrice = (planId: string) => {
    if (planId === "gratuit") return "0";
    if (planId === "enterprise") return "Custom";
    
    const data = PRICING_DATA[currency];
    const price = cycle === "monthly" ? data.monthly : data.yearly;
    return `${price.toLocaleString()} ${data.symbol}`;
  };

  return (
    <div className="min-h-screen bg-[#011223] text-white selection:bg-[#5b9de8]/40 overflow-x-hidden font-sans scroll-smooth">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 -z-50 pointer-events-none opacity-40">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-[#5b9de8]/20 blur-[160px] rounded-full" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute -bottom-[20%] -right-[10%] w-[80%] h-[80%] bg-indigo-600/15 blur-[160px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl">
            <div className="w-2 h-2 rounded-full bg-[#5b9de8] animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5b9de8]">Nouveau : Facturation Intelligente</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.95]"
          >
            L&apos;art de la <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5b9de8] via-indigo-400 to-emerald-400">Facturation.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="text-lg md:text-2xl text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed">
            Propulsez votre entreprise vers l&apos;excellence avec la plateforme de facturation la plus avancée du marché.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
            <Link href="/register">
              <Button className="h-16 px-14 rounded-full bg-[#5b9de8] text-[#011223] font-black text-sm uppercase tracking-widest hover:scale-110 transition-all shadow-2xl shadow-[#5b9de8]/30">
                Commencer gratuitement
              </Button>
            </Link>
            <Button variant="ghost" className="h-16 px-14 rounded-full text-white font-black text-sm uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all">
              Explorer la démo
            </Button>
          </div>
        </div>

        {/* Dashboard Preview - Fixed Animation */}
        <div className="max-w-7xl mx-auto mt-40 px-4" ref={dashboardRef}>
          <motion.div 
            style={{ rotateX, scale, translateY }}
            className="relative rounded-[48px] p-2 bg-gradient-to-br from-white/20 via-white/5 to-white/20 shadow-2xl perspective-2000"
          >
            <div className="relative rounded-[44px] overflow-hidden bg-[#011223] h-[600px]">
              <motion.div animate={{ y: [0, -600, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="w-full">
                <img src="/dashboard-mockup.png" alt="Dashboard" className="w-full h-auto" />
                <img src="/dashboard-mockup.png" alt="Dashboard" className="w-full h-auto" />
              </motion.div>
              <div className="absolute top-8 left-8 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
            </div>
            <div className="absolute -inset-20 bg-[#5b9de8]/20 blur-[100px] -z-10 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* How it Works - Fixed Image */}
      <section id="comment-ça-marche" className="py-32 px-6 relative bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="absolute -inset-10 bg-[#5b9de8]/10 blur-[100px] rounded-full" />
              <img src="/process-steps.png" alt="Processus Bossbook" className="relative rounded-[40px] border border-white/10 shadow-2xl" />
            </motion.div>
            
            <div className="space-y-12">
              <h2 className="text-5xl font-black tracking-tight leading-tight">
                Prenez le contrôle en <br /> <span className="text-[#5b9de8]">quelques minutes.</span>
              </h2>
              <div className="space-y-2">
                <StepItem step="01" icon={Users} title="Configurez votre boîte" desc="Importez vos clients et paramétrez vos préférences en un clin d'œil." index={0} />
                <StepItem step="02" icon={Send} title="Émettez vos factures" desc="Générez des documents professionnels et envoyez-les par email ou SMS." index={1} />
                <StepItem step="03" icon={Wallet} title="Encaissez vos gains" desc="Suivez vos paiements en temps réel et automatisez vos relances." index={2} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Real Data & Toggles */}
      <section id="tarifs" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 mb-24 flex flex-col items-center">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter italic">Nos Tarifs.</h2>
            
            {/* Toggles Container */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Billing Cycle Toggle */}
              <div className="p-1.5 bg-white/[0.05] rounded-full flex items-center border border-white/10">
                <button onClick={() => setCycle("monthly")} className={cn("px-8 py-2.5 rounded-full text-[10px] font-black transition-all", cycle === "monthly" ? "bg-white text-[#011223] shadow-xl" : "text-gray-400 hover:text-white")}>
                  MENSUEL
                </button>
                <button onClick={() => setCycle("yearly")} className={cn("px-8 py-2.5 rounded-full text-[10px] font-black transition-all relative", cycle === "yearly" ? "bg-white text-[#011223] shadow-xl" : "text-gray-400 hover:text-white")}>
                  ANNUEL
                  {cycle === "yearly" && <span className="absolute -top-3 -right-6 bg-emerald-500 text-white text-[7px] px-2 py-0.5 rounded-full">-2 MOIS</span>}
                </button>
              </div>

              {/* Currency Toggle */}
              <div className="p-1.5 bg-white/[0.05] rounded-full flex items-center border border-white/10">
                {(["XAF", "USD", "EUR"] as Currency[]).map((cur) => (
                  <button key={cur} onClick={() => setCurrency(cur)} className={cn("px-6 py-2.5 rounded-full text-[10px] font-black transition-all", currency === cur ? "bg-[#5b9de8] text-[#011223] shadow-xl" : "text-gray-400 hover:text-white")}>
                    {cur}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
            {PLANS.map((plan, i) => (
              <motion.div 
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-10 rounded-[48px] border transition-all duration-700 flex flex-col h-full relative overflow-hidden",
                  plan.recommended ? "bg-white/[0.06] border-[#5b9de8] shadow-2xl lg:scale-105 z-10" : "bg-white/[0.02] border-white/10"
                )}
              >
                {plan.recommended && (
                  <div className="absolute top-0 right-0 p-8">
                    <div className="bg-[#5b9de8] text-[#011223] text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 italic">
                      <Crown className="w-3 h-3" /> Recommandé
                    </div>
                  </div>
                )}

                <div className="mb-10">
                  <h3 className="text-2xl font-black text-white tracking-tighter italic mb-4">{plan.name}</h3>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-white">{getPlanPrice(plan.id)}</span>
                      {plan.price !== "Custom" && plan.price !== 0 && <span className="text-gray-500 font-bold text-sm">/ {cycle === "monthly" ? "mois" : "an"}</span>}
                    </div>
                    {plan.id === "pro" && cycle === "yearly" && (
                      <span className="text-[10px] text-gray-500 line-through mt-1">
                        {(PRICING_DATA[currency].monthly * 12).toLocaleString()} {PRICING_DATA[currency].symbol}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium mt-4">{plan.desc}</p>
                </div>

                <div className="space-y-4 mb-12 flex-1">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-3">
                      <CheckCircle2 className={cn("w-4 h-4", plan.recommended ? "text-[#5b9de8]" : "text-gray-500")} />
                      <span className="text-[13px] font-medium text-gray-300">{f}</span>
                    </div>
                  ))}
                </div>

                <Button className={cn(
                  "w-full h-16 rounded-full font-black text-xs uppercase tracking-widest transition-all",
                  plan.recommended ? "bg-[#5b9de8] text-[#011223] hover:shadow-xl shadow-[#5b9de8]/30" : "bg-white/10 text-white hover:bg-white/20",
                  plan.disabled && "opacity-50 pointer-events-none"
                )}>
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 border-t border-white/5 pt-20">
          {[
            { icon: Shield, text: "Sécurisé", sub: "CB, Mobile Money" },
            { icon: Zap, text: "Immédiat", sub: "Prêt en 3s" },
            { icon: CreditCard, text: "Garantie", sub: "14 jours satisfait" },
            { icon: Infinity, text: "Flexible", sub: "Résiliez à tout moment" },
            { icon: XCircle, text: "Support", sub: "Réponse < 2h" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center group-hover:scale-110 transition-all border border-white/5">
                <item.icon className="w-6 h-6 text-gray-500" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{item.text}</p>
                <p className="text-[9px] text-gray-500 font-bold">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto rounded-[64px] p-16 md:p-32 text-center relative overflow-hidden bg-white text-[#011223] shadow-2xl">
          <div className="relative z-10 space-y-10">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic leading-none">
              Prêt pour <br /> l&apos;excellence ?
            </h2>
            <Link href="/register">
              <Button className="h-20 px-16 rounded-full bg-[#011223] text-white font-black text-xl hover:scale-105 transition-all">
                Démarrer maintenant
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-20 px-6 border-t border-white/10 text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-8 h-8 bg-[#5b9de8] rounded-lg flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-[#011223]" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter italic">BOSSBOOK</span>
        </div>
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">
          © 2026 BOSSBOOK • L&apos;EXCELLENCE DANS LA FACTURATION
        </p>
      </footer>

      <style jsx global>{`
        html { scroll-behavior: smooth; }
        .perspective-2000 { perspective: 2000px; }
      `}</style>
    </div>
  );
}
