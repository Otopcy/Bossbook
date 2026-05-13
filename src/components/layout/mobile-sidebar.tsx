"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleToggle = () => setOpen(prev => !prev);
    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-mobile-sidebar", handleToggle);
  }, []);

  // Close when pathname changes (user clicked a link)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden transition-opacity" 
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-[101] w-64 bg-background shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 z-[102] w-8 h-8 rounded-full bg-black/5 dark:bg-white/[0.08]"
          onClick={() => setOpen(false)}
        >
          <X className="w-4 h-4" />
        </Button>
        <Sidebar className="w-full shadow-none border-none h-full" />
      </div>
    </>
  );
}
