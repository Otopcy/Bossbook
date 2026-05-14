"use client";

import React, { useEffect, useState } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-[#0c1425] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Immersive Background Mesh (Matching Landing Page) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-50/50 dark:bg-blue-900/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-50/50 dark:bg-indigo-900/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="glass-card border-none rounded-[40px] md:rounded-[48px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
           {/* Top accent line */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#5b9de8]/30 to-transparent opacity-50" />
           {children}
        </div>
      </div>

      {/* Footer copyright */}
      <div className="fixed bottom-6 left-0 w-full text-center pointer-events-none opacity-30">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-white">Bossbook © 2026</p>
      </div>
    </div>
  );
}
