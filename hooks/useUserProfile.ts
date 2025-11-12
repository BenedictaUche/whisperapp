'use client'

import { useState, useEffect } from 'react'
import { supabase, type UserProfile } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const fetchProfile = async () => {
    if (!supabase || !user) return

    try {

      const { data, error }: { data: any; error: any } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        throw error
      }

      if (!data) {
        // Check for avatar selected during registration
        const selectedAvatar = typeof window !== 'undefined' ? sessionStorage.getItem('selectedAvatar') : null

        // Create new profile
        const newProfile = {
          user_id: user.id,
          whisper_count: 0,
          reply_count: 0,
          reaction_count: 0,
          current_streak: 0,
          max_streak: 0,
          badges: [],
          avatar_url: selectedAvatar || null,
          preferences: {
            incognito_mode: false,
            location_radius: 5,
            notifications_enabled: true,
            voice_distortion: true
          }
        }

        // Clear the temporary storage
        if (selectedAvatar && typeof window !== 'undefined') {
          sessionStorage.removeItem('selectedAvatar')
        }

        const { data: created, error: createError }: { data: any; error: any } = await supabase
          .from('user_profiles')
          .insert(newProfile)
          .select()
          .single()

        if (createError) {
          // Handle duplicate key error by re-fetching
          if (createError.code === '23505') {
            const { data: existing } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('user_id', user.id)
              .single()
            if (existing) {
              setProfile(existing)
            }
          } else {
            throw createError
          }
        } else {
          setProfile(created)
        }
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!supabase || !profile) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
        .select()
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const setAvatar = async (avatarUrl: string | null) => {
    await updateProfile({ avatar_url: avatarUrl || undefined })
  }

  const updatePreferences = async (preferences: Partial<UserProfile['preferences']>) => {
    if (!profile) return

    const newPreferences = { ...profile.preferences, ...preferences }
    await updateProfile({ preferences: newPreferences })
  }

  const incrementActivity = async (type: 'whisper' | 'reply' | 'reaction') => {
    if (!profile) return

    const today = new Date().toISOString().split('T')[0]
    const isNewDay = profile.last_activity_date !== today

    const updates: Partial<UserProfile> = {
      last_activity_date: today,
      [`${type}_count`]: profile[`${type}_count`] + 1
    }

    if (isNewDay) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const wasYesterday = profile.last_activity_date === yesterday.toISOString().split('T')[0]

      if (wasYesterday) {
        updates.current_streak = profile.current_streak + 1
        updates.max_streak = Math.max(profile.max_streak, updates.current_streak)
      } else {
        updates.current_streak = 1
      }
    }

    await updateProfile(updates)
  }

  useEffect(() => {
    if (!supabase) return

    // Get initial auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setProfile(null)
      setLoading(false)
    }
  }, [user])

  return {
    profile,
    loading,
    updateProfile,
    updatePreferences,
    incrementActivity,
    setAvatar,
    refreshProfile: fetchProfile
  }
}
