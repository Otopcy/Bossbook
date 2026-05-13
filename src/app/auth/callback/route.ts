import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: company } = await supabase
          .from('companies')
          .select('id')
          .eq('owner_id', user.id)
          .single()

        if (!company) {
          // Create a default company for new users (e.g. from Google Auth)
          await supabase.from('companies').insert([{
            owner_id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Ma Compagnie',
            email: user.email,
          }])
          // Force onboarding for new users
          return NextResponse.redirect(`${origin}/setup-company`)
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=L'authentification a échoué`)
}
