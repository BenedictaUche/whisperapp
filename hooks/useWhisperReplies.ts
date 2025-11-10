'use client'

import { useState, useEffect } from 'react'
import { supabase, type WhisperReply } from '@/lib/supabase'

export const useWhisperReplies = (whisperId: string) => {
  const [replies, setReplies] = useState<WhisperReply[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReplies = async () => {
    if (!supabase || !whisperId) return

    try {
      const { data, error } = await supabase
        .from('whisper_replies')
        .select('*')
        .eq('whisper_id', whisperId)
        .gt('expire_at', new Date().toISOString())
        .eq('is_moderated', false)
        .order('created_at', { ascending: true })

      if (error) throw error
      setReplies(data || [])
    } catch (error) {
      console.error('Error fetching replies:', error)
    } finally {
      setLoading(false)
    }
  }

  const createReply = async (content: { text?: string; gif_url?: string; voice_url?: string }) => {
    if (!supabase) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get anonymous label for this user in this whisper thread
      const { data: labelData, error: labelError } = await supabase
        .rpc('get_anonymous_label', {
          p_whisper_id: whisperId,
          p_user_id: user.id
        })

      if (labelError) throw labelError

      const expireAt = new Date()
      expireAt.setHours(expireAt.getHours() + 48)

      const { error } = await supabase
        .from('whisper_replies')
        .insert({
          whisper_id: whisperId,
          user_id: user.id,
          anonymous_label: labelData,
          ...content,
          expire_at: expireAt.toISOString()
        })

      if (error) throw error
      fetchReplies()
    } catch (error) {
      console.error('Error creating reply:', error)
      throw error
    }
  }

  const deleteReply = async (replyId: string) => {
    if (!supabase) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('whisper_replies')
        .delete()
        .eq('id', replyId)
        .eq('user_id', user.id)

      if (error) throw error
      fetchReplies()
    } catch (error) {
      console.error('Error deleting reply:', error)
    }
  }

  useEffect(() => {
    fetchReplies()

    if (!supabase) return

    const subscription = supabase
      .channel(`replies_${whisperId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'whisper_replies', filter: `whisper_id=eq.${whisperId}` },
        () => fetchReplies()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [whisperId])

  return {
    replies,
    loading,
    createReply,
    deleteReply,
    refreshReplies: fetchReplies
  }
}