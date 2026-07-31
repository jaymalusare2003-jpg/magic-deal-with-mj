import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Profile } from '@/lib/db/types'

export async function getSession() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return user
}

export async function getProfile(): Promise<Profile> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error || !profile) {
    return {
      id: '',
      user_id: user.id,
      email: user.email || '',
      full_name: null,
      role: 'user',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  return profile as Profile
}

export async function requireAdmin() {
  const profile = await getProfile()
  if (profile.role !== 'super_admin' && profile.role !== 'admin') {
    redirect('/unauthorized')
  }
  return profile
}

export async function requireSuperAdmin() {
  const profile = await getProfile()
  if (profile.role !== 'super_admin') {
    redirect('/unauthorized')
  }
  return profile
}
