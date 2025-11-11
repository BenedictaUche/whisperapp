'use client'

import { useState, useEffect } from 'react'
import { supabase, type WhisperReaction } from '@/lib/supabase'

export const useWhisperReactions = (whisperId: string) => {
  const [reactions, setReactions] = useState<WhisperReaction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReactions = async () => {
    if (!supabase || !whisperId) return

    try {
      const { data, error } = await supabase
        .from('whisper_reactions')
        .select('*')
        .eq('whisper_id', whisperId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReactions(data || [])
    } catch (error) {
      console.error('Error fetching reactions:', error)
    } finally {
      setLoading(false)
    }
  }
  //test

  const addReaction = async (emoji: string) => {
    if (!supabase) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('whisper_reactions')
        .insert({
          whisper_id: whisperId,
          user_id: user.id,
          emoji
        })

      if (error) throw error
      fetchReactions()
    } catch (error) {
      // Handle duplicate key constraint violation (user already reacted with this emoji)
      if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === '23505') {
        console.warn('Reaction already exists, refreshing state')
        fetchReactions() // Re-sync client state
      } else {
        console.error('Error adding reaction:', error)
      }
    }
  }

  const removeReaction = async (emoji: string) => {
    if (!supabase) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('whisper_reactions')
        .delete()
        .eq('whisper_id', whisperId)
        .eq('user_id', user.id)
        .eq('emoji', emoji)

      if (error) throw error
      fetchReactions()
    } catch (error) {
      console.error('Error removing reaction:', error)
    }
  }

  const toggleReaction = async (emoji: string) => {
    const { data: { user } } = await supabase?.auth.getUser() || { data: { user: null } }
    if (!user) return

    const existingReaction = reactions.find(r => r.user_id === user.id && r.emoji === emoji)

    if (existingReaction) {
      await removeReaction(emoji)
    } else {
      await addReaction(emoji)
    }
  }

  useEffect(() => {
    fetchReactions()

    if (!supabase) return

    const subscription = supabase
      .channel(`reactions_${whisperId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'whisper_reactions', filter: `whisper_id=eq.${whisperId}` },
        () => fetchReactions()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [whisperId])

  return {
    reactions,
    loading,
    addReaction,
    removeReaction,
    toggleReaction,
    refreshReactions: fetchReactions
  }
}
