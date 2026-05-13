"use client";

import React from "react";
import { Crown } from "lucide-react";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1c2537] flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#011223] dark:bg-[#5b9de8] flex items-center justify-center shadow-lg">
              <Crown className="w-4 h-4 text-white dark:text-[#011223]" />
            </div>
            <span className="text-sm font-black text-gray-900 dark:text-gray-100 tracking-tighter">BOSSBOOK</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-8 h-1 rounded-full bg-[#011223] dark:bg-[#5b9de8]" />
            <div className="w-8 h-1 rounded-full bg-gray-100 dark:bg-white/[0.08]" />
            <div className="w-8 h-1 rounded-full bg-gray-100 dark:bg-white/[0.08]" />
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
