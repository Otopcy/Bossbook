/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Package, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getProducts } from "@/lib/dashboard-actions";
import { formatCurrency } from "@/lib/utils";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (search && !p.name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Produits</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez votre catalogue de produits et de matériel.</p>
        </div>
        <Link href="/products/new">
          <Button className="w-full md:w-auto rounded-full bg-[#011223] dark:bg-[#5b9de8] text-white dark:text-[#011223] font-bold text-xs h-10 px-6 hover:bg-[#0a2a4a] dark:hover:bg-[#7db4f0] shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Nouveau produit
          </Button>
        </Link>
      </div>

      {/* Search & Table */}
      <div className="glass-card border-none rounded-[32px] p-4 md:p-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both ease-out">
        <div className="mb-6 relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher un produit..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] transition-all text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 text-[#5b9de8] animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Chargement de vos produits...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.05]">
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-4">Nom du produit</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Catégorie</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Prix unitaire</th>
                  <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 dark:border-white/[0.02] last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                          <Link href={`/products/${p.id}`} className="hover:underline">
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{p.name}</p>
                          </Link>
                          <p className="text-[10px] text-gray-400">{p.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-xs font-semibold text-gray-700 dark:text-gray-300">{p.category || "Général"}</td>
                    <td className="py-4 text-[14px] font-black text-gray-900 dark:text-gray-100">{formatCurrency(p.price, "XAF")}</td>
                    <td className="py-4 pr-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-500">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-2xl border-none shadow-lg p-1 bg-white dark:bg-[#1c2537]">
                          <DropdownMenuItem className="text-xs rounded-xl cursor-pointer font-medium py-2.5 px-3 gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                            <Trash2 className="w-3.5 h-3.5" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Aucun produit trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
