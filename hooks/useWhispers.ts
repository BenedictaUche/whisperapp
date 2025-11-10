'use client'

import { useState, useEffect } from 'react'
import { supabase, type Whisper } from '@/lib/supabase'
import { calculateDistance, formatDistance, obfuscateLocation } from '@/lib/geolocation'
import { notifyNewWhisper, showWhisperCreatedNotification } from '@/lib/notifications'
import { useUserProfile } from './useUserProfile'

export const useWhispers = (userLat?: number, userLon?: number, radiusKm: number = 5) => {
  const [whispers, setWhispers] = useState<(Whisper & { distance: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const { incrementActivity } = useUserProfile()

  // Get current user ID for deletion permissions
  useEffect(() => {
    const getCurrentUser = async () => {
      if (!supabase) return
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)
    }
    getCurrentUser()
  }, [])

  const fetchNearbyWhispers = async () => {
    if (!userLat || !userLon) return
    if (!supabase) {
      console.error('Supabase client not initialized')
      return
    }

    try {
      setLoading(true)
      
      // Fetch whispers that haven't expired
      const { data, error } = await supabase
        .from('whispers')
        .select(`
          *,
          whisper_categories (
            id,
            name,
            emoji,
            color
          )
        `)
        .gt('expire_at', new Date().toISOString())
        .eq('is_moderated', false)
        .order('timestamp', { ascending: false })

      if (error) throw error

      // Filter by distance and sort by proximity
      const nearbyWhispers = (data || [])
        .map(whisper => ({
          ...whisper,
          distance: calculateDistance(userLat, userLon, whisper.latitude, whisper.longitude)
        }))
        .filter(whisper => whisper.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance)

      setWhispers(nearbyWhispers)
    } catch (error) {
      console.error('Error fetching whispers:', error)
    } finally {
      setLoading(false)
    }
  }

  const createWhisper = async (data: { text?: string; voice_url?: string; category_id?: string }) => {
    if (!userLat || !userLon || (!data.text?.trim() && !data.voice_url)) return null
    if (!supabase) {
      console.error('Supabase client not initialized')
      return null
    }

    try {
      const expireAt = new Date()
      expireAt.setHours(expireAt.getHours() + 48) // Expire after 48 hours

      // Obfuscate location for privacy (within ~100m radius)
      const obfuscatedLocation = obfuscateLocation(userLat, userLon, 0.1)

      const { data: whisperData, error } = await supabase
        .from('whispers')
        .insert({
          text: data.text?.trim(),
          voice_url: data.voice_url,
          category_id: data.category_id,
          latitude: obfuscatedLocation.latitude,
          longitude: obfuscatedLocation.longitude,
          expire_at: expireAt.toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Update user activity
      incrementActivity('whisper')

      // Show success notification
      showWhisperCreatedNotification()

      // Refresh whispers to include the new one
      fetchNearbyWhispers()
      
      return whisperData
    } catch (error) {
      console.error('Error creating whisper:', error)
      throw error
    }
  }

  const deleteWhisper = async (whisperId: string) => {
    if (!supabase || !currentUserId) {
      console.error('Cannot delete whisper: not authenticated')
      return false
    }

    try {
      const { error } = await supabase
        .from('whispers')
        .delete()
        .eq('id', whisperId)
        .eq('user_id', currentUserId) // Only allow deletion by original poster

      if (error) throw error

      // Refresh whispers after deletion
      fetchNearbyWhispers()
      return true
    } catch (error) {
      console.error('Error deleting whisper:', error)
      return false
    }
  }

  // Set up real-time subscription for new whispers
  useEffect(() => {
    if (!userLat || !userLon) return
    if (!supabase) return

    const subscription = supabase
      .channel('whispers')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'whispers' },
        (payload) => {
          const newWhisper = payload.new as Whisper
          const distance = calculateDistance(userLat, userLon, newWhisper.latitude, newWhisper.longitude)
          
          // Show notification if whisper is within 2km and not from current user
          if (distance <= 2 && newWhisper.user_id !== currentUserId) {
            notifyNewWhisper(formatDistance(distance))
          }
          
          // Refresh if within current radius
          if (distance <= radiusKm) {
            fetchNearbyWhispers()
          }
        }
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'whispers' },
        () => {
          // Refresh whispers when any whisper is deleted
          fetchNearbyWhispers()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userLat, userLon, currentUserId, radiusKm])

  useEffect(() => {
    fetchNearbyWhispers()
  }, [userLat, userLon, radiusKm])

  return { 
    whispers, 
    loading, 
    createWhisper, 
    deleteWhisper,
    refreshWhispers: fetchNearbyWhispers,
    currentUserId
  }
}