"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  Settings, 
  HelpCircle,
  Menu,
  X,
  CreditCard,
  LogOut,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Products", href: "/products", icon: Package },
];

const featureItems = [
  { name: "Recurring", href: "/recurring", icon: CreditCard, badge: "16" },
  { name: "Subscriptions", href: "/subscriptions", icon: Users },
  { name: "Feedback", href: "/feedback", icon: HelpCircle },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-screen bg-[#0F0F0F] border-r border-border w-64", className)}>
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 orange-gradient rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <span className="text-xl font-bold tracking-tight">BOSSBOOK</span>
        </Link>
      </div>

      <div className="px-4 py-2">
        <div className="relative">
          <Menu className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-[#1A1A1A] border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-[#2A2A2A] px-1.5 py-0.5 rounded text-muted-foreground">⌘ K</span>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-[#1A1A1A] hover:text-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}

        <div className="mt-8 mb-2 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Features
        </div>

        {featureItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-[#1A1A1A] hover:text-foreground",
              pathname === item.href && "text-foreground bg-[#1A1A1A]"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              {item.name}
            </div>
            {item.badge && (
              <span className="bg-[#1A1A1A] text-foreground text-[10px] px-1.5 py-0.5 rounded-full border border-border">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-[#1A1A1A] rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold">Upgrade Pro! 👑</span>
          </div>
          <p className="text-[11px] text-muted-foreground mb-4">
            Higher productivity with better organization
          </p>
          <div className="flex gap-2">
            <Button size="sm" className="w-full orange-gradient border-none h-8 text-[11px]">Upgrade</Button>
            <Button size="sm" variant="outline" className="w-full bg-transparent h-8 text-[11px]">Learn more</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
