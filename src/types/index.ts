export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export type Currency =
  | 'XAF' | 'XOF' | 'GHS' | 'NGN' | 'KES' | 'MAD' | 'EGP' | 'ZAR' | 'TND' | 'DZD' | 'ETB' | 'TZS' | 'UGX' | 'RWF'
  | 'EUR' | 'GBP' | 'CHF'
  | 'USD' | 'CAD' | 'BRL'
  | 'CNY' | 'JPY' | 'INR' | 'AED' | 'SAR';

export type RecurringInterval = 'monthly' | 'quarterly' | 'yearly';

export interface Company {
  id: string;
  owner_id: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  default_currency: Currency;
  tax_rate: number;
  invoice_prefix: string;
  next_invoice_number: number;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  company_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  unit_price: number;
  unit: string | null;
  currency: Currency;
  is_taxable: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LineItem {
  id: string;
  invoice_id: string;
  product_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  sort_order: number;
}

export interface Invoice {
  id: string;
  company_id: string;
  client_id: string;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  currency: Currency;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string | null;
  terms: string | null;
  paid_at: string | null;
  sent_at: string | null;
  is_recurring: boolean;
  recurring_interval: RecurringInterval | null;
  recurring_next_date: string | null;
  recurring_end_date: string | null;
  parent_invoice_id: string | null;
  payment_link: string | null;
  payment_transaction_id: string | null;
  created_at: string;
  updated_at: string;
  client?: Client;
  line_items?: LineItem[];
}

export interface DashboardStats {
  total_invoices: number;
  total_billed: number;
  total_paid: number;
  total_pending: number;
  total_overdue: number;
  total_clients: number;
  currency: Currency;
}
