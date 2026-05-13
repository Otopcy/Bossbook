"use client";

import React from "react";
import { useEffect, useState } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-300/10 blur-[120px] rounded-full" />
      
      {/* Auth Content */}
      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[40px] shadow-2xl shadow-blue-900/5 p-8 md:p-10">
          {children}
        </div>
        
        {/* Footer info */}
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            BOSSBOOK © 2026 • Billing Excellence
          </p>
        </div>
      </div>
    </div>
  );
}
