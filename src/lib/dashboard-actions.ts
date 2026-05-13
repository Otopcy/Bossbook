/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { createClient } from './supabase/server'

export interface DashboardStats {
  total_paid: number
  total_pending: number
  total_overdue: number
  total_clients: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { total_paid: 0, total_pending: 0, total_overdue: 0, total_clients: 0 }

  // Get user's company
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!company) {
    return { total_paid: 0, total_pending: 0, total_overdue: 0, total_clients: 0 }
  }

  // Fetch stats from invoices
  const { data: invoices } = await supabase
    .from('invoices')
    .select('status, total_amount')
    .eq('company_id', company.id)

  const stats: DashboardStats = {
    total_paid: invoices?.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total_amount, 0) || 0,
    total_pending: invoices?.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.total_amount, 0) || 0,
    total_overdue: invoices?.filter(i => i.status === 'late').reduce((sum, i) => sum + i.total_amount, 0) || 0,
    total_clients: 0
  }

  const { count: clientCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', company.id)

  stats.total_clients = clientCount || 0
  return stats
}

export async function createInvoice(invoiceData: Record<string, any>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).single()
  if (!company) throw new Error('Company not found')

  const { data, error } = await supabase
    .from('invoices')
    .insert([{ 
      ...invoiceData, 
      company_id: company.id,
      logo_url: invoiceData.logo_url || null,
      signature_url: invoiceData.signature_url || null,
      watermark_text: invoiceData.watermark_text || null,
      paid_amount: invoiceData.paid_amount || 0,
      payment_method: invoiceData.payment_method || 'transfer'
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createQuote(quoteData: Record<string, any>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).single()
  if (!company) throw new Error('Company not found')

  const { data, error } = await supabase
    .from('quotes')
    .insert([{ ...quoteData, company_id: company.id }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getRecentActivities() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).single()
  if (!company) return []

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: quotes } = await supabase
    .from('quotes')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Merge and sort
  const activities = [
    ...(invoices || []).map(i => ({
      id: i.id,
      type: 'invoice_created',
      ref: i.reference,
      client: i.client_name,
      date: i.created_at,
      amount: i.total_amount,
      currency: 'XAF',
      created_at: i.created_at
    })),
    ...(quotes || []).map(q => ({
      id: q.id,
      type: 'quote_created',
      ref: q.reference,
      client: q.client_name,
      date: q.created_at,
      amount: q.total_amount,
      currency: 'XAF',
      created_at: q.created_at
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  .slice(0, 10)

  return activities
}

export async function createClientAction(clientData: Record<string, any>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).single()
  if (!company) throw new Error('Company not found')

  const { data, error } = await supabase
    .from('clients')
    .insert([{ ...clientData, company_id: company.id }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getInvoices() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).single()
  if (!company) return []

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })

  return invoices || []
}

export async function getQuotes() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).single()
  if (!company) return []

  const { data: quotes } = await supabase
    .from('quotes')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })

  return quotes || []
}

export async function getProducts() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).single()
  if (!company) return []

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('company_id', company.id)
    .order('name', { ascending: true })

  return products || []
}

export async function getServices() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).single()
  if (!company) return []

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('company_id', company.id)
    .order('name', { ascending: true })

  return services || []
}

export async function ensureCompany() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!company) {
    const { data: newCompany, error } = await supabase.from('companies').insert([{
      owner_id: user.id,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Ma Compagnie',
      email: user.email,
    }]).select().single()
    
    if (error) {
      console.error("Error creating company:", error)
      return null
    }
    return newCompany
  }

  return company
}

export async function updateCompany(companyData: Record<string, any>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  let { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).single()
  
  if (!company) {
    // Create company if it doesn't exist
    const { data: newComp, error: createError } = await supabase.from('companies').insert([{
      owner_id: user.id,
      name: companyData.name || 'Ma Compagnie'
    }]).select().single()
    
    if (createError) throw createError
    company = newComp
  }

  const { data, error } = await supabase
    .from('companies')
    .update(companyData)
    .eq('id', company!.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating company:", error)
    
    // If a column is missing, try a super-safe update with only basic fields
    if (error.code === 'PGRST204') {
      console.log("Retrying with safe fields...")
      const safeData = { name: companyData.name }
      const { data: safeRes, error: safeError } = await supabase
        .from('companies')
        .update(safeData)
        .eq('id', company!.id)
        .select()
        .single()
        
      if (!safeError) return safeRes
      throw safeError
    }
    
    throw new Error(`Erreur Base de Données: ${error.message} (Code: ${error.code})`)
  }
  return data
}

export async function getClients() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).single()
  if (!company) return []

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('company_id', company.id)
    .order('name', { ascending: true })

  return clients || []
}

export async function getTopClientsData() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).single()
  if (!company) return []

  const { data: invoices } = await supabase
    .from('invoices')
    .select('client_name, total_amount, status')
    .eq('company_id', company.id)

  if (!invoices) return []

  const clientMap: Record<string, any> = {}
  invoices.forEach(inv => {
    if (!clientMap[inv.client_name]) {
      clientMap[inv.client_name] = { 
        name: inv.client_name, 
        paid: 0, 
        invoices: 0,
        initials: inv.client_name.substring(0, 2).toUpperCase(),
        color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color for new clients
      }
    }
    if (inv.status === 'paid') {
      clientMap[inv.client_name].paid += inv.total_amount
    }
    clientMap[inv.client_name].invoices += 1
  })

  return Object.values(clientMap).sort((a, b) => b.paid - a.paid).slice(0, 4)
}

export async function getRevenueChartData() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).single()
  if (!company) return null

  const { data: invoices } = await supabase
    .from('invoices')
    .select('total_amount, status, created_at')
    .eq('company_id', company.id)

  if (!invoices) return { weekly: [], monthly: [], yearly: [] }

  const months = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"]
  const monthly = months.map(m => ({ label: m, encaisse: 0, attente: 0 }))
  
  invoices.forEach(inv => {
    const date = new Date(inv.created_at)
    if (date.getFullYear() === new Date().getFullYear()) {
      const mIdx = date.getMonth()
      if (inv.status === 'paid') monthly[mIdx].encaisse += inv.total_amount
      else monthly[mIdx].attente += inv.total_amount
    }
  })

  return { 
    weekly: monthly.slice(0, 7).map((m, i) => ({ ...m, label: `S${i+1}` })),
    monthly, 
    yearly: [{ label: `${new Date().getFullYear()}`, encaisse: monthly.reduce((s, m) => s + m.encaisse, 0), attente: monthly.reduce((s, m) => s + m.attente, 0) }]
  }
}
