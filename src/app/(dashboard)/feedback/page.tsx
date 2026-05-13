"use client";

import React from "react";
import { Send, MessageSquare, Mail, LifeBuoy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeedbackPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-500">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Support & Feedback</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Besoin d&apos;aide ou une suggestion ? Notre équipe est à votre écoute.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both ease-out">
        
        {/* Contact Info (Left) */}
        <div className="col-span-1 md:col-span-4 space-y-4">
          <div className="glass-card border-none rounded-[24px] p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <LifeBuoy className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">Centre d&apos;aide</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Consultez nos articles et guides pour utiliser BOSSBOOK.</p>
            <Button variant="outline" className="w-full rounded-full text-xs font-bold border-gray-200 dark:border-white/[0.1]">
              Voir la FAQ
            </Button>
          </div>
          
          <div className="glass-card border-none rounded-[24px] p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">Email</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Nous répondons généralement sous 24h.</p>
            <a href="mailto:support@bossbook.com" className="text-xs font-bold text-indigo-500 hover:underline">
              support@bossbook.com
            </a>
          </div>
        </div>

        {/* Contact Form (Right) */}
        <div className="col-span-1 md:col-span-8">
          <div className="glass-card border-none rounded-[32px] p-6 md:p-8">
            <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" /> Envoyez-nous un message
            </h3>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Sujet de votre demande</label>
                <select className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 appearance-none">
                  <option value="support">Problème technique (Support)</option>
                  <option value="billing">Question sur la facturation</option>
                  <option value="feature">Suggestion de fonctionnalité</option>
                  <option value="other">Autre demande</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                <textarea 
                  placeholder="Décrivez votre problème ou votre suggestion avec le plus de détails possible..." 
                  className="w-full h-40 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <Button className="w-full rounded-2xl bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-12 hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-sm">
                  <Send className="w-4 h-4 mr-2" /> Envoyer le message
                </Button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
