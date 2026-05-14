"use client";

import React from "react";
import { useEffect, useState } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c1425] flex flex-col items-center justify-start relative overflow-x-hidden">
      {/* Auth Content - Simple & Clean */}
      <div className="w-full relative z-10">
        {children}
      </div>
    </div>
  );
}
