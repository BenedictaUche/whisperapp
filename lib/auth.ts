import { supabase } from './supabase'

export async function getCurrentUser() {
  if (!supabase) return null
  
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function signOut() {
  if (!supabase) return
  
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function checkAuthStatus() {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Auth status check error:', error)
    throw error
  }
}