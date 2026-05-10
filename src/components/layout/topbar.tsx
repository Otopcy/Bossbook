"use client";

import { 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Search, 
  Settings,
  Share2,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
  return (
    <div className="h-16 border-b border-border bg-[#0F0F0F] flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-[#1A1A1A] text-muted-foreground">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-[#1A1A1A] text-muted-foreground">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Bossbook</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 mr-2">
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-[#1A1A1A]">
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-[#1A1A1A]">
            <Mail className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-[#1A1A1A]">
            <Bell className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-9 w-9 rounded-full overflow-hidden border border-border">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>BB</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#1A1A1A] border-border text-foreground">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="hover:bg-[#2A2A2A] cursor-pointer">Profil</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#2A2A2A] cursor-pointer">Paramètres</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#2A2A2A] cursor-pointer text-red-500">Déconnexion</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button className="orange-gradient h-9 px-4 rounded-lg flex items-center gap-2 text-xs font-bold">
          <Share2 className="w-3 h-3" />
          Share
        </Button>
      </div>
    </div>
  );
}
