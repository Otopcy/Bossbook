"use client";

import React, { useState } from "react";
import { ArrowLeft, Plus, Trash2, Palette, LayoutTemplate, UserPlus, FileDigit, ChevronDown, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DatePicker } from "@/components/ui/date-picker";
import { NewClientDialog } from "@/components/clients/new-client-dialog";
import { ProductCombobox } from "@/components/ui/product-combobox";
import { toast } from "sonner";

export default function NewRecurringInvoicePage() {
  const router = useRouter();
  const [items, setItems] = useState([{ id: 1, desc: "", qty: 1, price: 0 }]);
  
  // Clients state
  const [client, setClient] = useState("");
  const [customClients, setCustomClients] = useState<{id: string, name: string}[]>([]);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);

  // Numbering settings
  const [prefix] = useState("REC-2024-");
  const [sequence, setSequence] = useState("001");
  
  // Dates & Frequency
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [frequency, setFrequency] = useState("Mensuel");
  const [notes, setNotes] = useState("Merci pour votre confiance.");
  
  // Template states
  const [templateColor, setTemplateColor] = useState("#011223");
  const [showLogo] = useState(true);
  const [layoutStyle, setLayoutStyle] = useState("classique");

  const recurringId = `${prefix}${sequence}`;

  const addItem = () => setItems([...items, { id: Date.now(), desc: "", qty: 1, price: 0 }]);
  const removeItem = (id: number) => setItems(items.filter(i => i.id !== id));

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const tax = subtotal * 0.1925;
  const total = subtotal + tax;

  const handleClientAdded = (newId: string, newName: string) => {
    setCustomClients([...customClients, { id: newId, name: newName }]);
    setClient(newId);
  };

  const getClientName = () => {
    if (client === "mtn") return "MTN Cameroon";
    if (client === "orange") return "Orange Cameroun";
    if (client === "afriland") return "Afriland First Bank";
    const custom = customClients.find(c => c.id === client);
    if (custom) return custom.name;
    return "Nom du client";
  };

  const handleSave = () => {
    if (!client) {
      toast.error("Veuillez sélectionner un client");
      return;
    }
    
    // In a real app, we would call a server action here
    router.push("/recurring");
  };

  // Helper to render the preview (same as invoice but with "Abonnement" label)
  const renderPreview = () => {
    const formattedDate = new Date(startDate).toLocaleDateString("fr-FR");

    return (
      <div className="absolute inset-0 p-8 flex flex-col scale-[0.8] origin-top-left w-[125%] h-[125%]">
        {/* Header */}
        <div className="flex justify-between items-start mb-12 border-b-2 pb-6" style={{ borderColor: templateColor }}>
          <div className="flex flex-col">
            {showLogo ? (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xl mb-2 text-white" style={{ backgroundColor: templateColor }}>BB</div>
            ) : (
              <h1 className="text-2xl font-black mb-2 tracking-tight" style={{ color: templateColor }}>BOSSBOOK Tech</h1>
            )}
            <p className="text-[11px] text-gray-500">123 Rue des Affaires<br/>Douala, Cameroun<br/>hello@bossbook.com</p>
          </div>
          <div className="flex flex-col items-end text-right">
            <h2 className="text-3xl font-bold mb-2 uppercase tracking-widest text-gray-800">Facture</h2>
            <p className="font-bold text-gray-800">{recurringId}</p>
            <p className="text-[11px] text-gray-500 mt-2">Fréquence: {frequency}</p>
            <p className="text-[11px] text-gray-500">Prochaine: {formattedDate}</p>
          </div>
        </div>
        {/* Bill To */}
        <div className="mb-12">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Facturer à</p>
          <h3 className="text-lg font-bold text-gray-900">{getClientName()}</h3>
          {client && <p className="text-[11px] text-gray-500 mt-1">Abonnement récurrent<br/>Cameroun</p>}
        </div>
        {/* Items */}
        <div className="flex-1">
          <div className="border-b-2 border-gray-900 mb-3 pb-2 flex text-[10px] font-bold uppercase tracking-widest" style={{ borderColor: templateColor }}>
            <div className="flex-1">Description</div>
            <div className="w-16 text-center">Qté</div>
            <div className="w-24 text-right">Prix Unitaire</div>
            <div className="w-28 text-right">Total</div>
          </div>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex text-xs border-b border-gray-100 pb-2">
                <div className="flex-1 font-medium">{item.desc || "Article..."}</div>
                <div className="w-16 text-center text-gray-600">{item.qty}</div>
                <div className="w-24 text-right text-gray-600">{item.price.toLocaleString()}</div>
                <div className="w-28 text-right font-bold text-gray-800">{(item.qty * item.price).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Totals */}
        <div className="mt-8 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Sous-total</span>
              <span className="font-medium">{subtotal.toLocaleString()} XAF</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">TVA (19.25%)</span>
              <span className="font-medium">{tax.toLocaleString()} XAF</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
              <span className="font-bold uppercase tracking-wider text-[11px]">Total TTC</span>
              <span className="text-lg font-black">{total.toLocaleString()} XAF</span>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-gray-200">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Notes & Conditions</p>
          <p className="text-[10px] text-gray-600">{notes}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 px-4">
      <NewClientDialog 
        isOpen={isClientDialogOpen} 
        onClose={() => setIsClientDialogOpen(false)} 
        onClientAdded={handleClientAdded} 
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="flex items-center gap-3">
          <Link href="/recurring">
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-500">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Nouveau Modèle Récurrent</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Automatisez vos factures</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleSave}
            className="rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-9 px-5 hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-2" /> Activer l&apos;automatisation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-7 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both ease-out">
          
          <div className="glass-card border-none rounded-[32px] p-6 md:p-8 space-y-8 relative z-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Row 1: Client & Fréquence */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Client</label>
                <div className="flex gap-2">
                  <select 
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="flex-1 h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none text-gray-900 dark:text-gray-100 appearance-none font-medium"
                  >
                    <option value="">Sélectionner un client...</option>
                    <option value="mtn">MTN Cameroon</option>
                    <option value="orange">Orange Cameroun</option>
                    <option value="afriland">Afriland First Bank</option>
                    {customClients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <Button type="button" variant="outline" size="icon" onClick={() => setIsClientDialogOpen(true)} className="w-11 h-11 rounded-2xl border-gray-200 dark:border-white/[0.1] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05]">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Fréquence</label>
                <div className="relative">
                  <select 
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full h-11 px-4 pr-10 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none text-gray-900 dark:text-gray-100 appearance-none font-medium cursor-pointer"
                  >
                    <option value="Quotidien">Quotidien</option>
                    <option value="Hebdomadaire">Hebdomadaire</option>
                    <option value="Bi-mensuel">Bi-mensuel</option>
                    <option value="Mensuel">Mensuel</option>
                    <option value="Trimestriel">Trimestriel</option>
                    <option value="Annuel">Annuel</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Row 2: Numérotation & Date de début */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2"><FileDigit className="w-3 h-3" /> Numérotation</label>
                <div className="flex gap-2 items-center">
                  <input type="text" value={prefix} readOnly className="w-full h-11 px-3 rounded-2xl bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05] text-sm text-gray-500 cursor-not-allowed focus:outline-none font-medium" />
                  <span className="text-gray-400 font-bold">-</span>
                  <input type="text" value={sequence} onChange={(e) => setSequence(e.target.value)} className="w-24 h-11 px-3 text-center rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none text-gray-900 dark:text-gray-100 font-bold" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date de début</label>
                <DatePicker value={startDate} onChange={setStartDate} />
              </div>
            </div>
          </div>

          <div className="glass-card border-none rounded-[32px] p-6 md:p-8 space-y-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Articles & Services</h3>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-gray-50/50 dark:bg-white/[0.02] p-3 md:p-2 rounded-2xl border border-gray-100 dark:border-white/[0.05]">
                  <div className="col-span-1 md:col-span-6">
                    <ProductCombobox value={item.desc} onChange={(desc, price) => {
                      const newItems = [...items];
                      newItems[idx].desc = desc;
                      if (price !== undefined && newItems[idx].price === 0) newItems[idx].price = price;
                      setItems(newItems);
                    }} />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <input type="number" min="1" value={item.qty} onChange={(e) => {
                      const newItems = [...items];
                      newItems[idx].qty = parseInt(e.target.value) || 1;
                      setItems(newItems);
                    }} className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#1c2537] border-none shadow-sm text-sm focus:outline-none text-gray-900 dark:text-gray-100" />
                  </div>
                  <div className="col-span-1 md:col-span-3">
                    <div className="relative">
                      <input type="number" min="0" value={item.price} onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].price = parseInt(e.target.value) || 0;
                        setItems(newItems);
                      }} className="w-full h-10 pl-3 pr-10 rounded-xl bg-white dark:bg-[#1c2537] border-none shadow-sm text-sm focus:outline-none text-gray-900 dark:text-gray-100" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">XAF</span>
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-1 flex items-center justify-center">
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-8 w-8 rounded-full text-red-400 hover:bg-red-50" disabled={items.length === 1}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" onClick={addItem} className="mt-4 rounded-full text-xs font-bold text-[#011223] dark:text-[#5b9de8]">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Ajouter une ligne
            </Button>
          </div>

          <div className="glass-card border-none rounded-[32px] p-6 md:p-8">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-6">Paramètres du modèle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><LayoutTemplate className="w-3.5 h-3.5" /> Modèle</label>
                  <select value={layoutStyle} onChange={(e) => setLayoutStyle(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none text-gray-900 dark:text-gray-100 appearance-none font-medium">
                    <option value="classique">Classique (Standard)</option>
                    <option value="moderne">Moderne</option>
                  </select>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Palette className="w-3.5 h-3.5" /> Couleur</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {["#011223", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"].map(c => (
                      <button key={c} onClick={() => setTemplateColor(c)} className={`w-8 h-8 rounded-2xl transition-all ${templateColor === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`} style={{ backgroundColor: c }} />
                    ))}
                    <div className="relative w-8 h-8 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <Palette className="w-3.5 h-3.5 text-gray-400" />
                      <input type="color" value={templateColor} onChange={(e) => setTemplateColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Note de bas de page</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full h-16 p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 text-sm focus:outline-none resize-none" />
            </div>
          </div>
        </div>

        <div className="xl:col-span-5 sticky top-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Aperçu
            </h3>
          </div>
          <div className="bg-white rounded-[32px] shadow-2xl border border-gray-100 dark:border-white/[0.05] aspect-[1/1.41] relative overflow-hidden">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}
