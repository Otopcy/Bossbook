"use client";

import React from "react";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1c2537]">
      {children}
    </div>
  );
}
