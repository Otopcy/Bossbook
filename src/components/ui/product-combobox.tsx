"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Search } from "lucide-react";

import { getProducts as getRealProducts } from "@/lib/dashboard-actions";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Props {
  value: string;
  onChange: (desc: string, defaultPrice?: number) => void;
  placeholder?: string;
}

export function ProductCombobox({ value, onChange, placeholder = "Nom du produit ou service" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [products, setProducts] = useState<Product[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal query with external value if external value changes unexpectedly
  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getRealProducts();
      setProducts(data.map((p: Product) => ({
        id: p.id,
        name: p.name,
        price: p.price || 0
      })));
    };
    fetch();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const exactMatch = products.find(p => p.name.toLowerCase() === query.trim().toLowerCase());

  const handleSelect = (product: Product) => {
    setQuery(product.name);
    onChange(product.name, product.price);
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: query.trim(),
      price: 0 // Price will be typed by user manually on the line
    };
    setProducts([...products, newProduct]);
    handleSelect(newProduct);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value); // Sync desc instantly as typing
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full h-10 px-3 pr-8 rounded-xl bg-white dark:bg-[#1c2537] border-none shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#011223] dark:focus:ring-[#5b9de8] text-gray-900 dark:text-gray-100"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      </div>

      {isOpen && query.trim() !== "" && (
        <div className="absolute z-[100] mt-1 top-full left-0 w-full bg-white dark:bg-[#1c2537] rounded-xl shadow-xl border border-gray-100 dark:border-white/[0.05] overflow-hidden">
          <div className="max-h-48 overflow-y-auto py-1">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelect(product)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors flex justify-between items-center"
              >
                <span className="font-medium text-gray-900 dark:text-gray-100">{product.name}</span>
                <span className="text-xs text-gray-400">{product.price > 0 ? product.price.toLocaleString() + " XAF" : ""}</span>
              </button>
            ))}

            {!exactMatch && query.trim() !== "" && (
              <button
                type="button"
                onClick={handleCreateNew}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/[0.05] text-[#011223] dark:text-[#5b9de8] font-bold flex items-center gap-2 transition-colors border-t border-gray-50 dark:border-white/[0.02]"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter &quot;{query}&quot;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
