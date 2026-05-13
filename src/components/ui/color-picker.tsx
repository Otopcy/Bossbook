"use client";

import React, { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { Grid, Droplet, MoreHorizontal, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export function CustomColorPicker({ color, onChange, className }: CustomColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format RGB for display
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb = hexToRgb(color);

  return (
    <div className={cn("relative inline-block", className)} ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full transition-all duration-200 shadow-sm border-2 border-white dark:border-[#1c2537] hover:scale-105"
        style={{ backgroundColor: color }}
      />

      {/* Popover */}
      {isOpen && (
        <div className="absolute z-50 top-12 left-0 sm:left-1/2 sm:-translate-x-1/2 w-[280px] bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:bg-[#1c2537] dark:shadow-none dark:border dark:border-white/10 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
          
          {/* Floating Dark Pill (above the card) */}
          <div className="absolute -top-[44px] left-1/2 -translate-x-1/2 bg-[#1c2537] dark:bg-gray-900 rounded-full py-2 px-4 flex items-center gap-4 shadow-lg border border-white/10">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Grid className="w-4 h-4" />
            </button>
            <button className="text-emerald-400 relative">
              <Droplet className="w-4 h-4" fill="currentColor" />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Little triangle pointing up to the floating pill */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#1c2537] rotate-45 border-l border-t border-transparent dark:border-white/10 rounded-sm" />

          {/* Inner Padding Container */}
          <div className="p-4 relative z-10 flex flex-col gap-4">
            
            {/* Top Opacity/Gradient Slider Fake UI */}
            <div className="w-full h-6 rounded-full bg-gradient-to-r from-[#1c2537] to-emerald-400 relative flex items-center px-1 shadow-inner border border-black/10 dark:border-white/10">
              <div className="absolute left-1 w-4 h-4 rounded-full border-2 border-white/50 bg-transparent" />
              <div className="absolute right-1/2 w-4 h-4 rounded-full border-[3px] border-white bg-transparent shadow-sm" />
              <div className="absolute right-1 w-4 h-4 rounded-full border-2 border-white bg-transparent" />
            </div>

            {/* Main Color Area (react-colorful wrapper) */}
            <div className="relative">
              <HexColorPicker 
                color={color} 
                onChange={onChange}
                className="custom-colorful-picker !w-full" 
              />
              {/* Hex and RGB display overlaid on the saturation area */}
              <div className="absolute bottom-3 left-4 text-white pointer-events-none drop-shadow-md">
                <div className="font-bold text-lg leading-tight uppercase">{color}</div>
                {rgb && (
                  <div className="text-[10px] font-medium opacity-90 font-mono">
                    R{rgb.r} G{rgb.g} B{rgb.b}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Tabs */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-black/20 rounded-b-[24px]">
            <button className="flex flex-col items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 rounded-full bg-gray-400" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Color</span>
            </button>
            <button className="flex flex-col items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1c2537] to-emerald-400 shadow-sm" />
              <span className="text-[10px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Gradient</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity">
              <ImageIcon className="w-6 h-6 text-blue-400" fill="currentColor" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Image</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
