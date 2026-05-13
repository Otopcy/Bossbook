import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "XAF") {
  const parts = amount.toFixed(2).split(".");
  const integerPart = parts[0];
  
  const groups = [];
  let temp = integerPart;
  while (temp.length > 3) {
    groups.unshift(temp.slice(-3));
    temp = temp.slice(0, -3);
  }
  groups.unshift(temp);

  let formatted = "";
  if (groups.length >= 2) {
    formatted = groups.join(".");
  } else {
    formatted = groups[0];
  }
  
  return `${formatted},${parts[1]} ${currency}`;
}

export function formatDate(dateString: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
