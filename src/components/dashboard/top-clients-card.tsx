"use client";

import { FormattedAmount } from "@/components/ui/formatted-amount";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrency } from "@/context/currency-context";

interface TopClient {
  name: string;
  initials: string;
  avatarUrl?: string;
  color: string;
  paid: number;
  invoices: number;
}

interface Props {
  initialData?: TopClient[];
}

export function TopClientsCard({ initialData = [] }: Props) {
  const { currency, convert } = useCurrency();
  const sorted = [...initialData].sort((a, b) => b.paid - a.paid);
  const maxPaid = sorted.length > 0 ? Math.max(...sorted.map(c => c.paid)) : 1;

  return (
    <div className="glass-card rounded-[32px] p-4 md:p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Activité clients</h3>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">Paiement</span>
      </div>

      {/* Client rows */}
      <div className="space-y-2.5 md:space-y-4">
        {sorted.map((client, i) => {
          const pct = (client.paid / maxPaid) * 100;
          return (
            <div key={client.name} className="flex items-center gap-3">
              {/* Rank */}
              <span className="text-[11px] font-black text-gray-300 dark:text-gray-600 w-4 shrink-0 text-center">{i + 1}</span>

              {/* Photo avatar */}
              <Avatar className="w-9 h-9 shrink-0 ring-2 ring-white dark:ring-white/10 shadow-sm">
                <AvatarImage src={client.avatarUrl} alt={client.name} />
                <AvatarFallback
                  className="text-white text-[10px] font-black"
                  style={{ backgroundColor: client.color }}
                >
                  {client.initials}
                </AvatarFallback>
              </Avatar>

              {/* Info + bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] font-semibold text-gray-800 dark:text-gray-200 truncate">{client.name}</span>
                  <span className="text-[11px] font-black ml-2 shrink-0" style={{ color: client.color }}>
                    <FormattedAmount amount={convert(client.paid)} currency={currency} className="text-[11px]" />
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: client.color + "BB" }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 block">
                  {client.invoices} facture{client.invoices > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="mt-5 pt-4 border-t border-gray-50 dark:border-white/[0.05]">
        <Link
          href="/clients"
          className="flex items-center justify-center gap-2 text-[12px] font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Voir l&apos;activité de tous les clients
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
