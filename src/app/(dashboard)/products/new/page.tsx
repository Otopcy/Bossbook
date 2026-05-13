"use client";

import React from "react";
import { ArrowLeft, Save, Package, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mockStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");

  const handleSave = () => {
    if (!name) {
      toast.error("Veuillez entrer un nom");
      return;
    }

    const newProduct = {
      id: "PRD-" + Math.floor(Math.random() * 1000).toString().padStart(3, "0"),
      name: name,
      category: category === "hardware" ? "Matériel" : category === "software" ? "Logiciel" : "Hébergement",
      price: parseInt(price).toLocaleString() + " XAF",
      stock: stock === "unlimited" ? "Illimité" : stock,
      status: parseInt(stock) > 0 || stock === "unlimited" ? "active" : "out_of_stock"
    };

    mockStore.add("products", newProduct);
    router.push("/products");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="flex items-center gap-3">
          <Link href="/products">
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-500">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Nouveau Produit</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ajoutez un produit matériel ou logiciel</p>
          </div>
        </div>
        <Button 
          onClick={handleSave}
          className="w-full md:w-auto rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-10 px-6 hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-sm"
        >
          <Save className="w-4 h-4 mr-2" /> Enregistrer le produit
        </Button>
      </div>

      {/* Form Content */}
      <div className="glass-card border-none rounded-[32px] p-6 md:p-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both ease-out space-y-8">
        
        {/* Informations Générales */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-rose-500" /> Détails du produit
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Nom du produit</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Routeur Cisco" 
                className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100" 
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description (Optionnel)</label>
              <textarea placeholder="Description détaillée..." className="w-full h-24 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 resize-none"></textarea>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Catégorie</label>
              <input 
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Matériel informatique"
                className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Sous-catégorie</label>
              <input 
                type="text"
                placeholder="Ex: Réseau"
                className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Référence interne / SKU</label>
              <input type="text" placeholder="Ex: HW-CIS-001" className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100" />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-500" /> Tarification & Stock
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Prix unitaire (HT)</label>
              <div className="relative">
                <input 
                  type="number" 
                  min="0" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0" 
                  className="w-full h-11 pl-4 pr-12 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">XAF</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Taux de taxe applicable</label>
              <select className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 appearance-none">
                <option value="19.25">TVA Standard (19.25%)</option>
                <option value="0">Exonéré (0%)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Gestion du stock</label>
              <select className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100 appearance-none">
                <option value="tracked">Suivre le stock</option>
                <option value="unlimited">Stock illimité</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Quantité initiale / Type</label>
              <input 
                type="text" 
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Ex: 10 ou unlimited" 
                className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100" 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
