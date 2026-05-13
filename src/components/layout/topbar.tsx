"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useCurrency } from "@/context/currency-context";
import { logout } from "@/app/(auth)/login/actions";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";


import {
  Bell, ChevronLeft, ChevronRight, Plus, ChevronDown, Menu,
  Sun, Moon, Crown, User, Share2, LogOut, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReactCountryFlag from "react-country-flag";
import Link from "next/link";

const BRAND = "#011223";

const companies = [
  { id: "c1", name: "BOSSBOOK Tech",   countryCode: "CM", currency: "XAF" },
  { id: "c2", name: "Orange Cameroun", countryCode: "CM", currency: "XAF" },
  { id: "c3", name: "Afriland Bank",   countryCode: "CM", currency: "XAF" },
  { id: "c4", name: "BossBook France", countryCode: "FR", currency: "EUR" },
  { id: "c5", name: "BossBook UK",     countryCode: "GB", currency: "GBP" },
];


const NOTIF_COUNT = 3;

export function Topbar() {
  const [activeCompany, setActiveCompany] = useState(companies[0]);
  const { theme, setTheme } = useTheme();
  const { currency } = useCurrency();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  const isDark = mounted && theme === "dark";
  const [anyOpen, setAnyOpen]   = useState(false);
  const openCount = useRef(0);

  // Track open count so multiple dropdowns don't race
  const handleOpenChange = (open: boolean) => {
    openCount.current = Math.max(0, openCount.current + (open ? 1 : -1));
    setAnyOpen(openCount.current > 0);
  };

  // Toggle CSS overlay-backdrop class for smooth global blur
  useEffect(() => {
    const backdrop = document.getElementById("overlay-backdrop");
    if (backdrop) {
      backdrop.classList.toggle("active", anyOpen);
    }
  }, [anyOpen]);

  return (
    <header className="relative z-50 h-16 border-none bg-transparent w-full flex items-center justify-center shrink-0 px-4 md:px-6">
      <div className="w-full max-w-[1150px] flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center lg:hidden mr-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/[0.04] text-gray-700 dark:text-gray-300 mr-2"
            onClick={() => window.dispatchEvent(new Event("toggle-mobile-sidebar"))}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <Image src={mounted && theme === "dark" ? "/logo-white.svg" : "/logo-black-final.svg"} alt="BOSSBOOK" width={110} height={24} priority />
        </div>

        <div className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-gray-500 dark:text-gray-400">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-gray-500 dark:text-gray-400">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
          <span>Bossbook</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-800 dark:text-gray-200 font-semibold truncate max-w-[120px] md:max-w-none">Abonnement</span>
        </div>
      </div>

      {/* Right: [🔔] [toggle] [Company] [Avatar] */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden md:flex items-center gap-2">

        {/* Bell with brand-color badge */}
        <DropdownMenu onOpenChange={handleOpenChange}>

          <DropdownMenuTrigger asChild>
            <button className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/[0.08] text-gray-500 dark:text-gray-400 transition-all">
              <Bell className="w-4 h-4" />
              {NOTIF_COUNT > 0 && (
                <span
                  className="absolute flex items-center justify-center text-white dark:text-[#011223] font-black rounded-full border-2 border-white dark:border-[#1a2744]"
                  style={{ top: "3px", right: "3px", minWidth: "15px", height: "15px", fontSize: "9px", lineHeight: 1, padding: "0 2.5px" }}
                >
                  <span className="absolute inset-0 rounded-full bg-[#011223] dark:bg-[#5b9de8]" />
                  <span className="relative">{NOTIF_COUNT}</span>
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 rounded-2xl border-none shadow-xl p-0 overflow-hidden bg-white dark:bg-[#1c2537]">
            <div className="px-4 py-3 bg-[#011223] dark:bg-[#5b9de8]">
              <p className="text-white font-bold text-sm">{NOTIF_COUNT} notifications</p>
              <p className="text-blue-200 dark:text-[#011223] text-[11px] font-medium">Activités récentes</p>
            </div>
            <div className="p-2 space-y-1">
              {[
                { msg: "Facture #0042 payée",      time: "Il y a 5 min", dot: "bg-green-400" },
                { msg: "Nouveau devis en attente",  time: "Il y a 1h",    dot: "bg-yellow-400" },
                { msg: "Client ajouté : MTN",       time: "Il y a 2h",    dot: "bg-blue-400" },
              ].map(n => (
                <div key={n.msg} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.04] cursor-pointer">
                  <span className={`w-2 h-2 ${n.dot} rounded-full shrink-0 mt-1.5`} />
                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{n.msg}</p>
                    <p className="text-[10px] text-gray-400">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-3 pb-3">
              <button className="w-full text-[11px] font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 py-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all">
                Voir toutes les notifications
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Day/Night pill toggle */}
        <button
          onClick={() => {
            document.documentElement.classList.add("theme-transitioning");
            setTheme(isDark ? "light" : "dark");
            setTimeout(() => document.documentElement.classList.remove("theme-transitioning"), 350);
          }}
          className="relative w-14 h-7 rounded-full transition-all duration-300 flex items-center px-1 mx-0.5"
          style={{ background: isDark ? BRAND : "#e5e7eb" }}
          title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          <Sun  className="absolute left-1.5  w-3.5 h-3.5 text-gray-400 opacity-50 pointer-events-none" />
          <Moon className="absolute right-1.5 w-3   h-3   text-gray-400 opacity-50 pointer-events-none" />
          <div
            className="relative z-10 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300"
            style={{ transform: isDark ? "translateX(28px)" : "translateX(0px)" }}
          >
            {mounted && isDark
              ? <Moon className="w-3 h-3 text-gray-800" />
              : <Sun  className="w-3 h-3 text-amber-500" />
            }
          </div>
        </button>

        {/* Company Selector — crisp SVG flags via react-country-flag, no dot after currency */}
        <DropdownMenu onOpenChange={handleOpenChange}>

          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 px-3 gap-2 rounded-full bg-white dark:bg-white/[0.04] shadow-sm hover:bg-gray-50 dark:hover:bg-white/[0.08] text-gray-700 dark:text-gray-200 border-none">
              <span className="w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-gray-200 dark:ring-white/[0.1] flex items-center justify-center bg-gray-50 dark:bg-white/[0.1]">
                <ReactCountryFlag
                  countryCode={activeCompany.countryCode}
                  svg
                  style={{ width: "20px", height: "20px", objectFit: "cover", borderRadius: "50%" }}
                />
              </span>
              <span className="text-xs font-semibold max-w-[100px] truncate hidden md:inline">{activeCompany.name}</span>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/[0.08] px-1.5 py-0.5 rounded-full shrink-0">
                {currency}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400 dark:text-gray-500 hidden sm:inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl border-none shadow-xl p-2 bg-white dark:bg-[#1c2537]">
            <DropdownMenuLabel className="text-[10px] text-gray-400 uppercase tracking-wider px-2 py-1.5">Mes entreprises</DropdownMenuLabel>
            {companies.map((c) => {
              const isActive = c.id === activeCompany.id;
              return (
                <DropdownMenuItem
                  key={c.id}
                  className={cn(
                    "text-xs rounded-xl cursor-pointer py-2.5 px-3 gap-3 mb-0.5 transition-all",
                    isActive ? "text-gray-900 dark:text-gray-100 bg-black/[0.06] dark:bg-white/[0.08]" : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                  )}
                  onClick={() => setActiveCompany(c)}
                >
                  {/* Crisp SVG flag in round container */}
                  <span className="w-6 h-6 rounded-full overflow-hidden shrink-0 ring-1 ring-gray-100 dark:ring-white/[0.1] flex items-center justify-center bg-gray-50 dark:bg-white/[0.05]">
                    <ReactCountryFlag
                      countryCode={c.countryCode}
                      svg
                      style={{ width: "24px", height: "24px", objectFit: "cover", borderRadius: "50%" }}
                    />
                  </span>
                  {/* Name */}
                  <span className={`flex-1 ${isActive ? "font-bold" : "font-medium"}`}>{c.name}</span>
                  {/* Currency */}
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0",
                    isActive ? "bg-[#01122312] dark:bg-white/[0.15] text-[#011223] dark:text-[#a8c8f0]" : "bg-gray-100 dark:bg-white/[0.05] text-gray-400 dark:text-gray-500"
                  )}>
                    {c.currency}
                  </span>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator className="my-1.5 bg-gray-100 dark:bg-white/[0.08]" />
            <DropdownMenuItem className="text-xs rounded-xl text-gray-500 dark:text-gray-400 font-medium py-2.5 gap-2 px-3 cursor-pointer dark:hover:bg-white/[0.04]">
              <Plus className="w-3.5 h-3.5" /> Nouvelle entreprise
            </DropdownMenuItem>
            {/* Footer note */}
            <p className="text-[10px] text-gray-400 px-3 py-2 leading-relaxed border-t border-gray-100 dark:border-white/[0.08] mt-1">
              Vous pouvez modifier la devise dans les paramètres.
            </p>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>

        {/* Avatar */}
        <DropdownMenu onOpenChange={handleOpenChange}>

          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-9 w-9 rounded-full overflow-hidden border-2 border-gray-200 dark:border-white/[0.1] hover:border-gray-400 dark:hover:border-white/[0.2] transition-all">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                <AvatarFallback className="text-white text-xs font-bold bg-[#011223] dark:bg-[#5b9de8]">
                  {user?.user_metadata?.full_name?.substring(0, 2).toUpperCase() || "GE"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 rounded-2xl border-none shadow-xl p-0 overflow-hidden bg-white dark:bg-[#1c2537]">
            {/* User info */}
            <div className="px-4 py-3.5 flex items-center gap-3 bg-gray-50 dark:bg-white/[0.04]">
              <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-[#1c2537]">
                <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                <AvatarFallback className="text-white text-xs font-bold bg-[#011223] dark:bg-[#5b9de8]">
                  {user?.user_metadata?.full_name?.substring(0, 2).toUpperCase() || "GE"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                  {user?.user_metadata?.full_name || "Utilisateur"}
                </p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email || "chargement..."}</p>
              </div>
            </div>

            <div className="p-1.5 space-y-0.5">

              <div className="mx-0.5 mb-1 rounded-xl overflow-hidden" style={{ background: BRAND }}>
                <div className="relative px-3 py-2.5 flex items-center gap-3 cursor-pointer group">
                  {/* Glow orb */}
                  <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-xl opacity-30 pointer-events-none"
                    style={{ background: "rgba(0,180,255,0.6)" }} />
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 relative z-10"
                    style={{ background: "rgba(255,255,255,0.12)" }}>
                    <Crown className="w-3.5 h-3.5 text-yellow-300" />
                  </div>
                  <div className="min-w-0 relative z-10">
                    <p className="text-[12px] font-black text-white leading-none mb-0.5">BOSSBOOK Pro</p>
                    <p className="text-[10px] text-blue-200 leading-none">Passer à la version Pro</p>
                  </div>
                </div>
              </div>

              {/* Theme toggle — independent row */}
              <div className="md:hidden flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.04] cursor-pointer mx-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  document.documentElement.classList.add("theme-transitioning");
                  setTheme(isDark ? "light" : "dark");
                  setTimeout(() => document.documentElement.classList.remove("theme-transitioning"), 350);
                }}
              >
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                  {isDark ? "Mode nuit" : "Mode jour"}
                </span>
                
                {/* Segmented Toggle */}
                <div className="relative flex items-center p-1 rounded-full bg-gray-200 dark:bg-white/[0.08] shrink-0">
                  {/* Sliding pill */}
                  <div
                    className="absolute left-1 top-1 w-7 h-6 rounded-full bg-white dark:bg-[#011223] shadow-sm transition-transform duration-300"
                    style={{ transform: isDark ? "translateX(28px)" : "translateX(0px)" }}
                  />
                  {/* Icons */}
                  <div className="relative z-10 w-7 h-6 flex items-center justify-center">
                    <Sun className={cn("w-3.5 h-3.5 transition-colors", !isDark ? "text-amber-500" : "text-gray-400 dark:text-gray-500")} />
                  </div>
                  <div className="relative z-10 w-7 h-6 flex items-center justify-center">
                    <Moon className={cn("w-3.5 h-3.5 transition-colors", isDark ? "text-blue-400" : "text-gray-400 dark:text-gray-500")} />
                  </div>
                </div>
              </div>

              {[
                { label: "Profil",          Icon: User, href: "/settings" },
                { label: "Mes entreprises", Icon: Briefcase, href: "/settings" },
                { label: "Partager",        Icon: Share2, href: "#" },
              ].map(({ label, Icon, href }) => (
                <DropdownMenuItem key={label} asChild className="text-xs rounded-xl cursor-pointer font-medium py-2.5 px-3 gap-3">
                  <Link href={href}>
                    <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/[0.08] flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    </div>
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator className="bg-gray-100 dark:bg-white/[0.05] mx-1" />
              <DropdownMenuItem 
                className="text-xs rounded-xl cursor-pointer font-bold py-2.5 px-3 gap-3 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                onClick={() => logout()}
              >
                <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                </div>
                Déconnexion
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      </div>
    </header>
  );
}
