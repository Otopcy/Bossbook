/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { ArrowLeft, Save, Plus, Trash2, Send, Palette, LayoutTemplate, UserPlus, FileDigit, ChevronDown, Check, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DatePicker } from "@/components/ui/date-picker";
import { NewClientDialog } from "@/components/clients/new-client-dialog";
import { ProductCombobox } from "@/components/ui/product-combobox";
import { createInvoice, getClients } from "@/lib/dashboard-actions";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function NewInvoicePage() {
  const router = useRouter();
  const [items, setItems] = useState([{ id: 1, desc: "", qty: 1, price: 0 }]);
  
  // Clients state
  const [client, setClient] = useState("");
  const [customClients, setCustomClients] = useState<{id: string, name: string}[]>([]);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("Merci pour votre confiance.");
  const [isSaving, setIsSaving] = useState(false);
  const [allClients, setAllClients] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);

  // New Professional Fields
  const [invoiceStatus, setInvoiceStatus] = useState("pending"); // paid, partial, unpaid, pending
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [watermarkText, setWatermarkText] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");

  // Numbering settings
  const [invoicePrefix] = useState("FAC-2024-");
  const [invoiceSequence, setInvoiceSequence] = useState(Math.floor(Math.random() * 1000).toString().padStart(3, "0"));

  React.useEffect(() => {
    const fetchInitialData = async () => {
      const clientsData = await getClients();
      setAllClients(clientsData);

      // Fetch company info
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: comp } = await supabase.from('companies').select('*').eq('owner_id', user.id).single();
        if (comp) setCompany(comp);
      }
    };
    fetchInitialData();
  }, []);
  
  // Template states
  const [templateColor, setTemplateColor] = useState("#011223");
  const [showLogo, setShowLogo] = useState(true);
  const [layoutStyle, setLayoutStyle] = useState("classique"); // classique, moderne, minimaliste, creatif, elegant, corporate

  const invoiceId = `${invoicePrefix}${invoiceSequence}`;

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
    const found = allClients.find(c => c.id === client);
    if (found) return found.name;
    return "Nom du client";
  };

  const handleSave = async () => {
    if (!client || isSaving) {
      if (!client) toast.error("Veuillez sélectionner un client");
      return;
    }
    
    setIsSaving(true);
    try {
      const invoiceData = {
        reference: invoiceId,
        client_id: client,
        client_name: getClientName(),
        total_amount: total,
        status: invoiceStatus,
        paid_amount: invoiceStatus === "partial" ? paidAmount : (invoiceStatus === "paid" ? total : 0),
        payment_method: paymentMethod,
        due_date: dueDate || null,
        created_at: date,
        notes: notes,
        items: items,
        watermark_text: watermarkText,
        logo_url: logoUrl,
        signature_url: signatureUrl
      };

      await createInvoice(invoiceData);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to render the preview based on selected template
  const renderInvoicePreview = () => {
    const formattedDate = new Date(date).toLocaleDateString("fr-FR");
    const formattedDueDate = dueDate ? new Date(dueDate).toLocaleDateString("fr-FR") : "-";

    if (layoutStyle === "classique") {
      return (
        <div className="absolute inset-0 p-8 flex flex-col scale-[0.8] origin-top-left w-[125%] h-[125%]">
          {/* Header */}
          <div className="flex justify-between items-start mb-12 border-b-2 pb-6" style={{ borderColor: templateColor }}>
            <div className="flex flex-col">
              {showLogo && logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-16 h-16 object-contain mb-2" />
              ) : showLogo ? (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xl mb-2 text-white" style={{ backgroundColor: templateColor }}>{company?.name?.substring(0, 2).toUpperCase() || "BB"}</div>
              ) : (
                <h1 className="text-2xl font-black mb-2 tracking-tight" style={{ color: templateColor }}>{company?.name || "Votre Entreprise"}</h1>
              )}
              <p className="text-[11px] text-gray-500">{company?.address || "Adresse de l'entreprise"}<br/>{company?.city || "Ville"}, {company?.country || "Pays"}<br/>{company?.email || ""}</p>
            </div>
            <div className="flex flex-col items-end text-right">
              <h2 className="text-3xl font-bold mb-2 uppercase tracking-widest text-gray-800">Facture</h2>
              <p className="font-bold text-gray-800">{invoiceId}</p>
              <p className="text-[11px] text-gray-500 mt-2">Date: {formattedDate}</p>
              <p className="text-[11px] text-gray-500">Échéance: {formattedDueDate}</p>
            </div>
          </div>
          {/* Bill To */}
          <div className="mb-12">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Facturer à</p>
            <h3 className="text-lg font-bold text-gray-900">{getClientName()}</h3>
            {client && <p className="text-[11px] text-gray-500 mt-1">Adresse du client<br/>BP 1234, Cameroun</p>}
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
    }

    if (layoutStyle === "moderne") {
      return (
        <div className="absolute inset-0 flex flex-col scale-[0.8] origin-top-left w-[125%] h-[125%] overflow-hidden bg-white">
          {/* Watermark */}
          {watermarkText && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07] -rotate-45 z-0">
              <span className="text-[100px] font-black uppercase tracking-[20px] whitespace-nowrap">{watermarkText}</span>
            </div>
          )}
          
          {/* Colored Header Block */}
          <div className="p-8 text-white flex justify-between items-start relative z-10" style={{ backgroundColor: templateColor }}>
            <div className="flex flex-col items-start text-left">
              <h2 className="text-4xl font-black mb-1 uppercase opacity-90">Facture</h2>
              <p className="font-medium opacity-80 text-sm">{invoiceId}</p>
            </div>
            <div className="flex flex-col items-end text-right">
              {showLogo && logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain mb-2" />
              ) : showLogo ? (
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg mb-2 backdrop-blur-sm">{company?.name?.substring(0, 2).toUpperCase() || "BB"}</div>
              ) : (
                <h1 className="text-xl font-black mb-2 tracking-tight">{company?.name || "Votre Entreprise"}</h1>
              )}
            </div>
          </div>
          <div className="p-8 flex-1 flex flex-col">
            <div className="flex justify-between mb-10">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Facturer à</p>
                <h3 className="text-lg font-bold text-gray-900" style={{ color: templateColor }}>{getClientName()}</h3>
                {client && <p className="text-[11px] text-gray-500 mt-1">Adresse du client<br/>Cameroun</p>}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Dates</p>
                <p className="text-xs font-semibold text-gray-800">Émise le : <span className="font-normal">{formattedDate}</span></p>
                <p className="text-xs font-semibold text-gray-800">Échéance : <span className="font-normal">{formattedDueDate}</span></p>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3 mb-2 flex text-[10px] font-bold uppercase tracking-widest text-gray-600">
                <div className="flex-1">Article</div>
                <div className="w-12 text-center">Qté</div>
                <div className="w-24 text-right">Prix</div>
                <div className="w-28 text-right">Montant</div>
              </div>
              <div className="space-y-1 px-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex text-xs border-b border-gray-100 py-2">
                    <div className="flex-1 font-semibold text-gray-800">{item.desc || "Article..."}</div>
                    <div className="w-12 text-center text-gray-500">{item.qty}</div>
                    <div className="w-24 text-right text-gray-500">{item.price.toLocaleString()}</div>
                    <div className="w-28 text-right font-bold text-gray-900">{(item.qty * item.price).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <div className="w-72 bg-gray-50 rounded-xl p-5 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Sous-total</span>
                  <span className="font-bold text-gray-700">{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">TVA (19.25%)</span>
                  <span className="font-bold text-gray-700">{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="font-black uppercase tracking-wider text-[11px]" style={{ color: templateColor }}>Total (XAF)</span>
                  <span className="text-xl font-black" style={{ color: templateColor }}>{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-4 flex justify-between items-end relative z-10">
              <div className="max-w-[60%]">
                <p className="text-[10px] text-gray-500">{notes}</p>
              </div>
              {signatureUrl ? (
                <div className="text-right">
                  <p className="text-[9px] text-gray-400 uppercase mb-2">Signature</p>
                  <img src={signatureUrl} alt="Signature" className="h-12 object-contain ml-auto" />
                </div>
              ) : (
                <div className="text-right border-t border-gray-200 pt-4 w-32">
                   <p className="text-[9px] text-gray-400 uppercase">Signature</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (layoutStyle === "minimaliste") {
      return (
        <div className="absolute inset-0 p-10 flex flex-col scale-[0.8] origin-top-left w-[125%] h-[125%] bg-white font-mono">
          {/* Header */}
          <div className="flex justify-between items-end mb-16">
            <h1 className="text-4xl font-light tracking-tighter text-gray-900">INVOICE.</h1>
            <div className="text-right">
              {showLogo ? (
                <div className="w-10 h-10 border-2 border-gray-900 rounded-full flex items-center justify-center font-bold text-sm ml-auto mb-2 text-gray-900">BB</div>
              ) : (
                <h2 className="text-lg font-bold mb-1 text-gray-900">BOSSBOOK</h2>
              )}
              <p className="text-[10px] text-gray-500">123 Rue des Affaires</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-8 mb-16">
            <div>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1 border-b border-gray-100 pb-1">Facture N°</p>
              <p className="text-sm font-medium">{invoiceId}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1 border-b border-gray-100 pb-1">Dates</p>
              <p className="text-xs text-gray-600 mb-0.5">Inv: {formattedDate}</p>
              <p className="text-xs text-gray-600">Due: {formattedDueDate}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1 border-b border-gray-100 pb-1">Client</p>
              <p className="text-sm font-medium">{getClientName()}</p>
            </div>
          </div>

          <div className="flex-1">
            <div className="border-y border-gray-200 py-2 flex text-[9px] text-gray-500 uppercase tracking-widest mb-4">
              <div className="flex-1">Description</div>
              <div className="w-16 text-center">Qté</div>
              <div className="w-24 text-right">Prix</div>
              <div className="w-28 text-right">Total</div>
            </div>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex text-xs">
                  <div className="flex-1 text-gray-800">{item.desc || "..."}</div>
                  <div className="w-16 text-center text-gray-500">{item.qty}</div>
                  <div className="w-24 text-right text-gray-500">{item.price.toLocaleString()}</div>
                  <div className="w-28 text-right text-gray-900">{(item.qty * item.price).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-end">
            <div className="w-64">
              <div className="flex justify-between text-xs mb-2 text-gray-500">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs mb-4 text-gray-500">
                <span>Tax (19.25%)</span>
                <span>{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-900">
                <span className="font-bold text-sm tracking-widest">TOTAL</span>
                <span className="text-xl font-light tracking-tighter">{total.toLocaleString()} XAF</span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-8 text-[9px] text-gray-400 text-center uppercase tracking-widest">
            {notes}
          </div>
        </div>
      );
    }

    if (layoutStyle === "creatif") {
      return (
        <div className="absolute inset-0 p-8 flex flex-col scale-[0.8] origin-top-left w-[125%] h-[125%]">
          {/* Creative Header */}
          <div className="relative h-40 rounded-3xl mb-8 p-6 overflow-hidden flex justify-between items-end" style={{ backgroundColor: templateColor }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
            <div className="relative z-10 text-white">
              <h2 className="text-3xl font-black mb-1">FACTURE</h2>
              <p className="text-sm opacity-80 font-medium">#{invoiceId}</p>
            </div>
            <div className="relative z-10 text-right text-white">
              {showLogo ? (
                 <div className="w-12 h-12 bg-white text-gray-900 rounded-full flex items-center justify-center font-black text-xl ml-auto shadow-lg">BB</div>
              ) : (
                <h1 className="text-xl font-black tracking-tight">BOSSBOOK Tech</h1>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2" style={{ color: templateColor }}>Client</p>
              <h3 className="text-lg font-black text-gray-900">{getClientName()}</h3>
              {client && <p className="text-xs text-gray-500 mt-1">Cameroun</p>}
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col justify-center">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-500 font-medium">Émission</span>
                <span className="text-xs font-bold text-gray-900">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 font-medium">Échéance</span>
                <span className="text-xs font-bold text-gray-900">{formattedDueDate}</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-gray-900 text-white rounded-xl py-3 px-4 flex text-[10px] font-bold uppercase tracking-widest shadow-md">
              <div className="flex-1">Description</div>
              <div className="w-16 text-center">Qté</div>
              <div className="w-24 text-right">Prix</div>
              <div className="w-28 text-right">Total</div>
            </div>
            <div className="space-y-2 mt-3 px-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex text-xs bg-gray-50 rounded-lg p-3 items-center border border-gray-100/50">
                  <div className="flex-1 font-bold text-gray-800">{item.desc || "Article..."}</div>
                  <div className="w-16 text-center text-gray-500 font-medium bg-white py-1 rounded-md shadow-sm">{item.qty}</div>
                  <div className="w-24 text-right text-gray-500">{item.price.toLocaleString()}</div>
                  <div className="w-28 text-right font-black" style={{ color: templateColor }}>{(item.qty * item.price).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <div className="w-72 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden" style={{ backgroundColor: templateColor }}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 space-y-3">
                <div className="flex justify-between text-xs opacity-90">
                  <span>Sous-total</span>
                  <span className="font-medium">{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs opacity-90">
                  <span>TVA (19.25%)</span>
                  <span className="font-medium">{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-white/20 mt-3">
                  <span className="font-bold uppercase tracking-wider text-[10px] opacity-90 mb-1">Montant Dû</span>
                  <span className="text-2xl font-black tracking-tight">{total.toLocaleString()} <span className="text-sm font-medium opacity-80">XAF</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center bg-gray-50 py-3 rounded-xl border border-gray-100">
            <p className="text-[10px] text-gray-500 font-medium">{notes}</p>
          </div>
        </div>
      );
    }
    
    if (layoutStyle === "elegant") {
      return (
        <div className="absolute inset-0 p-8 flex flex-col scale-[0.8] origin-top-left w-[125%] h-[125%] font-serif">
          <div className="border-b border-gray-200 pb-8 mb-8 flex justify-between items-center">
             <div>
               <h1 className="text-3xl italic text-gray-800 mb-1" style={{ color: templateColor }}>Bossbook</h1>
               <p className="text-xs text-gray-500">Excellence & Service</p>
             </div>
             <div className="text-right">
               <h2 className="text-xl uppercase tracking-widest text-gray-400">Facture</h2>
               <p className="text-sm font-medium text-gray-800">{invoiceId}</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 border-b border-gray-100 pb-1">Facturé à</p>
              <h3 className="text-base font-medium text-gray-900">{getClientName()}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 border-b border-gray-100 pb-1">Émission</p>
                 <p className="text-sm text-gray-800">{formattedDate}</p>
               </div>
               <div>
                 <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 border-b border-gray-100 pb-1">Échéance</p>
                 <p className="text-sm text-gray-800">{formattedDueDate}</p>
               </div>
            </div>
          </div>

          <div className="flex-1">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-gray-800 text-[10px] uppercase tracking-widest text-gray-600">
                  <th className="py-2 font-normal">Description</th>
                  <th className="py-2 font-normal text-center w-16">Qté</th>
                  <th className="py-2 font-normal text-right w-24">Prix</th>
                  <th className="py-2 font-normal text-right w-32">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 text-gray-800">{item.desc || "Article..."}</td>
                    <td className="py-3 text-center text-gray-500">{item.qty}</td>
                    <td className="py-3 text-right text-gray-500">{item.price.toLocaleString()}</td>
                    <td className="py-3 text-right text-gray-900 font-medium">{(item.qty * item.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-end">
            <div className="w-80 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm mb-2 text-gray-600">
                <span>Sous-total</span>
                <span>{subtotal.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between text-sm mb-4 text-gray-600">
                <span>TVA (19.25%)</span>
                <span>{tax.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <span className="uppercase tracking-widest text-[11px] font-bold" style={{ color: templateColor }}>Total Net</span>
                <span className="text-xl font-medium text-gray-900">{total.toLocaleString()} XAF</span>
              </div>
            </div>
          </div>

          <div className="mt-12 text-[10px] text-gray-500 italic text-center">
            {notes}
          </div>
        </div>
      );
    }

    if (layoutStyle === "corporate") {
      return (
        <div className="absolute inset-0 p-0 flex flex-col scale-[0.8] origin-top-left w-[125%] h-[125%] bg-white">
          <div className="h-4 w-full" style={{ backgroundColor: templateColor }} />
          <div className="px-10 py-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
               {showLogo && logoUrl ? (
                 <img src={logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
               ) : showLogo ? (
                 <div className="w-10 h-10 flex items-center justify-center font-bold text-white rounded-full shadow-sm" style={{ backgroundColor: templateColor }}>{company?.name?.substring(0, 2).toUpperCase() || "BB"}</div>
               ) : null}
               <div>
                 <h1 className="text-xl font-bold tracking-tight text-gray-900">{company?.name || "BOSSBOOK"}</h1>
                 <p className="text-[10px] text-gray-500 uppercase tracking-widest">{company?.category || "Solutions Entreprise"}</p>
               </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black text-gray-200 uppercase tracking-tighter">FACTURE</h2>
              <p className="text-sm font-bold text-gray-800">{invoiceId}</p>
            </div>
          </div>

          <div className="px-10 mb-8 grid grid-cols-2 gap-8">
            <div className="bg-gray-50 p-5 rounded-lg border-l-4" style={{ borderColor: templateColor }}>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Facturé à</p>
               <h3 className="text-base font-bold text-gray-900">{getClientName()}</h3>
               {client && <p className="text-xs text-gray-500">Dossier client</p>}
            </div>
            <div className="flex justify-end items-center gap-8">
               <div className="text-right">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date Facture</p>
                 <p className="text-sm font-bold text-gray-800">{formattedDate}</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Échéance</p>
                 <p className="text-sm font-bold text-gray-800">{formattedDueDate}</p>
               </div>
            </div>
          </div>

          <div className="px-10 flex-1">
            <div className="flex text-[10px] font-bold uppercase tracking-widest text-white py-2 px-4 rounded-md shadow-sm mb-3" style={{ backgroundColor: templateColor }}>
              <div className="flex-1">Description</div>
              <div className="w-16 text-center">Qté</div>
              <div className="w-24 text-right">Prix Unitaire</div>
              <div className="w-28 text-right">Montant</div>
            </div>
            <div className="space-y-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex text-xs py-2 px-4 border-b border-gray-100">
                  <div className="flex-1 text-gray-800 font-medium">{item.desc || "Article..."}</div>
                  <div className="w-16 text-center text-gray-600">{item.qty}</div>
                  <div className="w-24 text-right text-gray-600">{item.price.toLocaleString()}</div>
                  <div className="w-28 text-right text-gray-900 font-bold">{(item.qty * item.price).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-10 mt-8 mb-8 flex justify-between items-end">
            <div className="w-1/2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Conditions de paiement</p>
              <p className="text-[10px] text-gray-600">{notes}</p>
            </div>
            <div className="w-72">
              <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Sous-total</span>
                <span className="text-gray-800">{subtotal.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">TVA (19.25%)</span>
                <span className="text-gray-800">{tax.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between items-center mt-3 p-3 rounded-lg text-white shadow-md" style={{ backgroundColor: templateColor }}>
                <span className="font-bold uppercase tracking-wider text-[11px]">Total à Payer</span>
                <span className="text-xl font-black">{total.toLocaleString()} XAF</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 px-4">
      {/* Client Dialog */}
      <NewClientDialog 
        isOpen={isClientDialogOpen} 
        onClose={() => setIsClientDialogOpen(false)} 
        onClientAdded={handleClientAdded} 
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="flex items-center gap-3">
          <Link href="/invoices">
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-500">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Nouvelle Facture</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Brouillon non sauvegardé</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-full text-xs font-bold h-9 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.08]"
          >
            <Save className="w-3.5 h-3.5 mr-2" /> Enregistrer
          </Button>
          <Button 
            onClick={() => {
              handleSave();
              setTimeout(() => window.print(), 1000);
            }}
            variant="outline"
            disabled={isSaving}
            className="rounded-full text-xs font-bold h-9 px-5 border-gray-200 dark:border-white/[0.1] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.05] shadow-sm"
          >
             <Download className="w-3.5 h-3.5 mr-2" /> Télécharger
          </Button>
          <Button 
            onClick={() => handleSave()}
            disabled={isSaving}
            className="rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-9 px-5 hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-sm min-w-[140px]"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Send className="w-3.5 h-3.5 mr-2" />}
            {isSaving ? "Traitement..." : "Envoyer la facture"}
          </Button>
        </div>
      </div>

      {/* Main Content: Split View */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form (7 cols) */}
        <div className="xl:col-span-7 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both ease-out">
          
          {/* Client & Meta */}
          <div className="glass-card border-none rounded-[32px] p-6 md:p-8 space-y-8 relative z-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Row 1: Client & Date d'émission */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Client</label>
                <div className="flex gap-2">
                  <select 
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="flex-1 h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 appearance-none font-medium"
                  >
                    <option value="">Sélectionner un client...</option>
                    {allClients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setIsClientDialogOpen(true)}
                    className="w-11 h-11 rounded-2xl border-gray-200 dark:border-white/[0.1] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                    title="Nouveau Client"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date { "d'émission" }</label>
                <DatePicker 
                  value={date} 
                  onChange={setDate} 
                />
              </div>

              {/* Row 2: Numérotation & Date d'échéance */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2"><FileDigit className="w-3 h-3" /> Numérotation</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    value={invoicePrefix} 
                    readOnly
                    title="Modifiable dans les paramètres"
                    className="w-full h-11 px-3 rounded-2xl bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05] text-sm text-gray-500 cursor-not-allowed focus:outline-none font-medium" 
                  />
                  <span className="text-gray-400 font-bold">-</span>
                  <input 
                    type="text" 
                    value={invoiceSequence} 
                    onChange={(e) => setInvoiceSequence(e.target.value)}
                    className="w-24 h-11 px-3 text-center rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 font-bold" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date { "d'échéance" }</label>
                <DatePicker 
                  value={dueDate} 
                  onChange={setDueDate} 
                  placeholder="Aucune échéance"
                />
              </div>

              {/* Row 3: Statut & Moyen de paiement */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Statut de la facture</label>
                <select 
                  value={invoiceStatus}
                  onChange={(e) => setInvoiceStatus(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 appearance-none font-medium"
                >
                  <option value="pending">Paiement en attente</option>
                  <option value="paid">Payée</option>
                  <option value="partial">Payée partiellement</option>
                  <option value="late">Non réglée (Retard)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Moyen de paiement</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 appearance-none font-medium"
                >
                  <option value="transfer">Virement Bancaire</option>
                  <option value="cash">Espèces</option>
                  <option value="momo">MTN Mobile Money</option>
                  <option value="om">Orange Money</option>
                  <option value="card">Carte Bancaire</option>
                </select>
              </div>

              {invoiceStatus === "partial" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Montant déjà réglé</label>
                  <input 
                    type="number" 
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 font-bold"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Line Items */}
          <div className="glass-card border-none rounded-[32px] p-6 md:p-8 space-y-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Articles & Services</h3>
            <div className="space-y-3">
              <div className="hidden md:grid grid-cols-12 gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2">
                <div className="col-span-6">Description</div>
                <div className="col-span-2">Qté</div>
                <div className="col-span-3">Prix unitaire</div>
                <div className="col-span-1 text-right"></div>
              </div>

              {items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-gray-50/50 dark:bg-white/[0.02] p-3 md:p-2 rounded-2xl border border-gray-100 dark:border-white/[0.05]">
                  <div className="col-span-1 md:col-span-6">
                    <label className="md:hidden text-[10px] font-bold text-gray-400 uppercase mb-1 block">Description</label>
                    <ProductCombobox 
                      value={item.desc}
                      onChange={(desc, defaultPrice) => {
                        const newItems = [...items];
                        newItems[idx].desc = desc;
                        if (defaultPrice !== undefined && newItems[idx].price === 0) {
                          newItems[idx].price = defaultPrice;
                        }
                        setItems(newItems);
                      }}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="md:hidden text-[10px] font-bold text-gray-400 uppercase mb-1 block">Quantité</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.qty}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].qty = parseInt(e.target.value) || 1;
                        setItems(newItems);
                      }}
                      className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#1c2537] border-none shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-3">
                    <label className="md:hidden text-[10px] font-bold text-gray-400 uppercase mb-1 block">Prix unitaire</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        min="0" 
                        value={item.price}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[idx].price = parseInt(e.target.value) || 0;
                          setItems(newItems);
                        }}
                        className="w-full h-10 pl-3 pr-10 rounded-xl bg-white dark:bg-[#1c2537] border-none shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">XAF</span>
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-1 flex items-center justify-end md:justify-center mt-2 md:mt-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 rounded-full text-red-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                      disabled={items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              variant="ghost" 
              onClick={addItem}
              className="mt-4 rounded-full text-xs font-bold text-[#011223] dark:text-[#5b9de8] hover:bg-[#011223]/5 dark:hover:bg-[#5b9de8]/10"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Ajouter une ligne
            </Button>
          </div>

          {/* Templates & Notes */}
          <div className="glass-card border-none rounded-[32px] p-6 md:p-8">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-6">Paramètres du modèle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><LayoutTemplate className="w-3.5 h-3.5" /> Modèle de facture</label>
                  <div className="relative">
                    <select 
                      value={layoutStyle}
                      onChange={(e) => setLayoutStyle(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 appearance-none font-medium cursor-pointer"
                    >
                      <option value="classique">Classique (Standard)</option>
                      <option value="moderne">Moderne (En-tête Coloré)</option>
                      <option value="minimaliste">Minimaliste (N&B épuré)</option>
                      <option value="creatif">Créatif (Arrondi & Coloré)</option>
                      <option value="elegant">Élégant (Style Serif)</option>
                      <option value="corporate">Corporate (Entreprise)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showLogo}
                      onChange={(e) => setShowLogo(e.target.checked)}
                      className="rounded border-gray-300 text-[#011223] focus:ring-[#011223]"
                    />
                    Afficher le logo de l&apos;entreprise
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Filigrane (Watermark)</label>
                  <input 
                    type="text" 
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Ex: PAYÉ, ORIGINAL, COPIE"
                    className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05] text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Signature (URL)</label>
                    <input 
                      type="text" 
                      value={signatureUrl}
                      onChange={(e) => setSignatureUrl(e.target.value)}
                      placeholder="Lien vers signature PNG"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05] text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Logo (URL)</label>
                    <input 
                      type="text" 
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="Lien vers logo PNG"
                      className="w-full h-10 px-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05] text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Palette className="w-3.5 h-3.5" /> Couleur d&apos;accentuation</label>
                  
                  {/* Color presets as large circles */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {[
                      { color: "#011223", label: "Marine" },
                      { color: "#1e3a5f", label: "Navy" },
                      { color: "#3b82f6", label: "Blue" },
                      { color: "#10b981", label: "Green" },
                      { color: "#f59e0b", label: "Gold" },
                      { color: "#ec4899", label: "Pink" },
                    ].map(({ color }) => (
                      <button 
                        key={color}
                        onClick={() => setTemplateColor(color)}
                        className={`w-10 h-10 rounded-2xl transition-all duration-200 relative flex items-center justify-center shadow-sm border-2 ${
                          templateColor === color 
                            ? "scale-110 border-white dark:border-[#1c2537] ring-2 ring-current opacity-100" 
                            : "border-transparent hover:scale-110"
                        }`}
                        style={{ backgroundColor: color, color: color }}
                      >
                        {templateColor === color && (
                          <Check className="w-4 h-4 text-white drop-shadow-md" />
                        )}
                      </button>
                    ))}

                    {/* Modern Simple Color Picker */}
                    <div className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-sm border-2 border-dashed border-gray-300 dark:border-white/20 shrink-0 group hover:border-gray-400 dark:hover:border-white/30 transition-all cursor-pointer flex items-center justify-center bg-gray-50/50 dark:bg-white/[0.02]" title="Couleur personnalisée">
                      <Palette className="w-4 h-4 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors pointer-events-none" />
                      <input 
                        type="color" 
                        value={templateColor}
                        onChange={(e) => setTemplateColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Current color indicator */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full shadow-sm border border-gray-200 dark:border-white/10" style={{ backgroundColor: templateColor }} />
                    <span className="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 uppercase">{templateColor}</span>
                  </div>
                </div>
                <div>
                   <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Note de bas de page</label>
                   <textarea 
                     value={notes}
                     onChange={(e) => setNotes(e.target.value)}
                     className="w-full h-16 p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none text-gray-900 dark:text-gray-100 resize-none"
                   />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview (5 cols) */}
        <div className="xl:col-span-5 sticky top-6">
          <div className="hidden xl:block mb-4">
             <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Aperçu
             </h2>
          </div>
          
          {/* A4 Paper Container */}
          <div className="bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] rounded-none md:rounded-lg overflow-hidden w-full aspect-[1/1.414] text-gray-900 relative">
            {renderInvoicePreview()}
          </div>
        </div>
      </div>
    </div>
  );
}
