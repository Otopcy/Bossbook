"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Users, Package, HelpCircle,
  Search, CreditCard, Settings, Briefcase, FileCheck, RefreshCw, Sparkles
} from "lucide-react";

import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const mainNav = [
  { name: "Tableau de bord",    href: "/dashboard",  icon: LayoutDashboard },
  { name: "Devis",              href: "/quotes",     icon: FileCheck },
  { name: "Factures",           href: "/invoices",   icon: FileText },
  { name: "Facture périodique", href: "/recurring",  icon: RefreshCw },
  { name: "Clients",            href: "/clients",    icon: Users },
  { name: "Produits",           href: "/products",   icon: Package },
  { name: "Services",           href: "/services",   icon: Briefcase },
];

const bottomNav = [
  { name: "Nouveautés",   href: "/whats-new",    icon: Sparkles },
  { name: "Paramètres",  href: "/settings",      icon: Settings },
  { name: "Abonnement",  href: "/subscriptions", icon: CreditCard },
  { name: "Support",     href: "/feedback",      icon: HelpCircle },
];


export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const renderLink = (item: typeof mainNav[0]) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-full text-sm transition-all mx-2",
          isActive
            // Light: brand dark bg. Dark: muted blue accent, never harsh white
            ? "bg-[#011223] text-white font-semibold shadow-md dark:bg-[#5b9de8]/20 dark:text-[#a8c8f0] dark:shadow-none dark:ring-1 dark:ring-[#5b9de8]/20"
            : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/[0.06] font-medium"
        )}
      >
        <item.icon className={cn(
          "w-4 h-4 shrink-0",
          isActive ? "text-white dark:text-[#a8c8f0]" : "text-gray-400 dark:text-gray-500"
        )} />
        {item.name}
      </Link>
    );
  };

  return (
    <div className={cn(
      // Light: transparent border-r. Dark: no border, just a right shadow
      "flex flex-col h-screen bg-background",
      "border-r border-gray-200/70 dark:border-transparent",
      "dark:shadow-[2px_0_20px_rgba(0,0,0,0.35)]",
      "w-64 shrink-0 z-20 relative",
      className
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src={mounted && theme === "dark" ? "/logo-white.svg" : "/logo-black-final.svg"} alt="BOSSBOOK" width={180} height={40} priority />
        </Link>
      </div>


      {/* Search */}
      <div className="px-4 py-2 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full bg-black/5 dark:bg-white/[0.04] border-none rounded-full py-2.5 pl-10 pr-12 text-sm focus:bg-white dark:focus:bg-white/[0.08] focus:shadow-sm outline-none text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-white dark:bg-white/10 shadow-sm px-1.5 py-0.5 rounded-full text-gray-400 dark:text-gray-300 font-mono">⌘K</span>
        </div>
      </div>

      {/* Main Nav — flex-1 with max-height so footer stays high */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {mainNav.map(renderLink)}
      </nav>


      {/* Separator — subtle, soft in dark */}
      <div className="mx-4 border-t border-gray-200 dark:border-white/[0.08] shrink-0" />

      {/* Bottom Nav — Nouveautés alone without section label */}
      <div className="px-2 pt-2 pb-0.5 shrink-0">
        {renderLink(bottomNav[0])}
      </div>

      {/* Paramètres, Abonnement, Support */}
      <div className="px-2 py-1 space-y-0.5 shrink-0">

        {bottomNav.slice(1).map(renderLink)}
      </div>

      {/* ── Upgrade Banner ── */}
      <div className="px-3 pb-2 shrink-0">
        <style>{`
          @keyframes shimmer-neon {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes float-orb {
            0%   { transform: translate(0px, 0px) scale(1); }
            20%  { transform: translate(26px, -16px) scale(1.12); }
            45%  { transform: translate(-6px, 20px) scale(0.92); }
            65%  { transform: translate(20px, 6px) scale(1.08); }
            85%  { transform: translate(-10px, -6px) scale(0.96); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          @keyframes lock-bounce {
            0%, 100%  { transform: translateY(0px) scale(1); }
            12%        { transform: translateY(-5px) scale(1.05); }
            28%        { transform: translateY(1px) scale(0.97); }
            44%        { transform: translateY(-3px) scale(1.02); }
            60%        { transform: translateY(0px) scale(1); }
          }
          @keyframes shackle-lift {
            0%, 45%, 100% { transform: translateY(0px); }
            20%            { transform: translateY(-5px); }
          }
        `}</style>
        <div
          className="rounded-[16px] px-4 py-3.5 relative overflow-hidden"
          style={{ background: "#011223" }}
        >
          {/* Floating orbs — neon teal/cyan tones */}
          <div
            className="absolute w-28 h-28 rounded-full blur-2xl pointer-events-none"
            style={{
              background: "rgba(0, 180, 255, 0.18)",
              animation: "float-orb 5s ease-in-out infinite",
              top: "-20px", left: "-12px",
            }}
          />
          <div
            className="absolute w-20 h-20 rounded-full blur-xl pointer-events-none"
            style={{
              background: "rgba(0, 120, 200, 0.14)",
              animation: "float-orb 7s ease-in-out infinite reverse",
              bottom: "-8px", right: "-8px",
            }}
          />

          {/* Lock + title */}
          <div className="flex items-center gap-2.5 mb-3 relative">
            {/* Bigger smooth lock */}
            <div
              className="shrink-0 flex items-center justify-center"
              style={{ animation: "lock-bounce 2.2s ease-in-out infinite" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <g style={{ animation: "shackle-lift 2.2s ease-in-out infinite" }}>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="rgba(0,200,255,0.9)" strokeWidth="2" />
                </g>
                <rect x="3" y="11" width="18" height="11" rx="3.5" fill="rgba(0,150,220,0.85)" />
                {/* Keyhole */}
                <circle cx="12" cy="16" r="2" fill="white" fillOpacity="0.9" />
                <line x1="12" y1="16" x2="12" y2="19" stroke="white" strokeWidth="1.6" strokeOpacity="0.9" />
              </svg>
            </div>
            <p className="text-[11.5px] font-bold text-white leading-snug">
              Débloquez toutes les fonctionnalités avec la version Pro
            </p>
          </div>

          {/* Neon blue shimmer button */}
          <button
            className="relative w-full overflow-hidden h-8 rounded-full text-[11.5px] font-bold text-white"
            style={{
              background: "linear-gradient(270deg, #00c6ff, #0078d4, #00a8e8, #011223, #0078d4, #00c6ff)",
              backgroundSize: "400% 400%",
              animation: "shimmer-neon 3s ease infinite",
              boxShadow: "0 0 14px rgba(0, 180, 255, 0.5)",
            }}
          >
            Obtenir la version Pro
          </button>
        </div>
      </div>


      {/* ── App version + copyright + OTOPCY LABS ── */}
      <div className="px-5 pb-8 pt-0 shrink-0">
        <p className="text-[10px] text-gray-400 font-medium">Version 1.0.0 — Beta</p>
        <p className="text-[10px] text-gray-400">© {new Date().getFullYear()} BOSSBOOK. Tous droits réservés.</p>
        <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mt-1.5">OTOPCY LABS</p>
      </div>
    </div>
  );
}
