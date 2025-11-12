import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type Whisper = {
  id: string
  text: string
  latitude: number
  longitude: number
  timestamp: string
  expire_at: string
  user_id?: string
  category_id?: string
  voice_url?: string
  is_moderated?: boolean
  reply_count?: number
  reaction_count?: number
}

export type WhisperCategory = {
  id: string
  name: string
  emoji: string
  color: string
  created_at: string
}

export type WhisperReaction = {
  id: string
  whisper_id: string
  user_id?: string
  emoji: string
  created_at: string
}

export type WhisperReply = {
  id: string
  whisper_id: string
  user_id?: string
  anonymous_label: string
  text?: string
  gif_url?: string
  voice_url?: string
  created_at: string
  expire_at: string
  is_moderated: boolean
}

export type UserProfile = {
  id: string
  user_id?: string
  whisper_count: number
  reply_count: number
  reaction_count: number
  current_streak: number
  max_streak: number
  last_activity_date?: string
  badges: string[]
  avatar_url?: string
  preferences: {
    incognito_mode: boolean
    location_radius: number
    notifications_enabled: boolean
    voice_distortion: boolean
  }
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      whispers: {
        Row: Whisper
        Insert: Omit<Whisper, 'id' | 'timestamp'>
        Update: Partial<Omit<Whisper, 'id'>>
      }
      whisper_categories: {
        Row: WhisperCategory
        Insert: Omit<WhisperCategory, 'id' | 'created_at'>
        Update: Partial<Omit<WhisperCategory, 'id'>>
      }
      whisper_reactions: {
        Row: WhisperReaction
        Insert: Omit<WhisperReaction, 'id' | 'created_at'>
        Update: Partial<Omit<WhisperReaction, 'id'>>
      }
      whisper_replies: {
        Row: WhisperReply
        Insert: Omit<WhisperReply, 'id' | 'created_at'>
        Update: Partial<Omit<WhisperReply, 'id'>>
      }
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'id'>>
      }
    }
  }
}
