'use client'

import { useState, useEffect } from 'react'
import { supabase, type WhisperCategory } from '@/lib/supabase'

export const useWhisperCategories = () => {
  const [categories, setCategories] = useState<WhisperCategory[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('whisper_categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return { categories, loading, refreshCategories: fetchCategories }
}