"use client";

import React, { useState } from "react";
import { X, UserPlus, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClientAction } from "@/lib/dashboard-actions";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: (clientId: string, clientName: string) => void;
}

export function NewClientDialog({ isOpen, onClose, onClientAdded }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSaving) return;
    
    setIsSaving(true);
    try {
      const newClient = await createClientAction({
        name,
        email,
        phone,
        address
      });
      
      onClientAdded(newClient.id, newClient.name);
      
      // Reset and close
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création du client");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#1c2537] rounded-[32px] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-300 mx-4">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-white/[0.05] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#011223]/5 dark:bg-[#5b9de8]/10 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-[#011223] dark:text-[#5b9de8]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100">Nouveau Client</h2>
            <p className="text-xs text-gray-500">Ajout rapide à votre carnet d&apos;adresses</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Nom de l&apos;entreprise ou client <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Otopcy Labs"
              className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="contact@email.com"
                className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Téléphone</label>
              <input 
                type="tel" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+237 600 000 000"
                className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Adresse</label>
            <input 
              type="text" 
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="BP 1234, Douala"
              className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-full text-xs font-bold px-4 hover:bg-gray-100 dark:hover:bg-white/[0.05]">
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving}
              className="rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs px-6 hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-md min-w-[140px]"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-2" />}
              {isSaving ? "Enregistrement..." : "Enregistrer le client"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
