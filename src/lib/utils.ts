import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "XAF") {
  const isCFA = currency === "XAF" || currency === "XOF";
  
  return new Intl.NumberFormat(isCFA ? "fr-FR" : "en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: isCFA ? 0 : 2,
    maximumFractionDigits: isCFA ? 0 : 2,
  }).format(amount);
}

export function formatDate(dateString: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
