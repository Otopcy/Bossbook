/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function checkAndCreateCompany(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!company) {
    await supabase.from('companies').insert([{
      owner_id: user.id,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Ma Compagnie',
      email: user.email,
    }])
    redirect('/setup-company')
  }
}

export async function login(formData: FormData) {
  const supabase = createClient()
  const identifier = formData.get('identifier') as string
  const password = formData.get('password') as string
  const token = formData.get('token') as string

  // If token is present, it's an OTP verification
  if (token) {
    const { error } = await supabase.auth.verifyOtp({
      phone: identifier,
      token,
      type: 'sms'
    })
    if (error) return { error: error.message }
    
    await checkAndCreateCompany(supabase)
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  const isEmail = identifier.includes('@')
  
  if (isEmail) {
    const { error } = await supabase.auth.signInWithPassword({ email: identifier, password })
    if (error) return { error: error.message }
    await checkAndCreateCompany(supabase)
  } else {
    const { error } = await supabase.auth.signInWithOtp({ phone: identifier })
    if (error) return { error: error.message }
    return { success: 'OTP_SENT' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = createClient()
  const identifier = formData.get('identifier') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const token = formData.get('token') as string

  const isEmail = identifier.includes('@')

  if (isEmail) {
    const { error } = await supabase.auth.signUp({
      email: identifier,
      password,
      options: { data: { full_name } }
    })
    if (error) return { error: error.message }
    // Note: if confirmation is required, user won't be logged in yet
  } else {
    if (token) {
      const { error } = await supabase.auth.verifyOtp({
        phone: identifier,
        token,
        type: 'sms'
      })
      if (error) return { error: error.message }
      await checkAndCreateCompany(supabase)
    } else {
      const { error } = await supabase.auth.signInWithOtp({ 
        phone: identifier,
        options: { data: { full_name } }
      })
      if (error) return { error: error.message }
      return { success: 'OTP_SENT' }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
