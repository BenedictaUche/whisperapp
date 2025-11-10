'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Send, MapPin, Mic, X, MessageCircle, CheckCircle, Smile, EarIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useWhisperCategories } from '@/hooks/useWhisperCategories'
import { VoiceRecorder } from './VoiceRecorder'
import { moderateContent } from '@/lib/contentModeration'

interface WhisperFormProps {
  onSubmit: (data: { text?: any; voice_url?: string; category_id?: string }) => Promise<void>
  isLoading?: boolean
  userLocation: { latitude: number; longitude: number } | null
  onClose?: () => void
  compact?: boolean
}

export const WhisperForm = ({ onSubmit, isLoading, userLocation, onClose, compact = false }: WhisperFormProps) => {
  const [text, setText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const { categories } = useWhisperCategories()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!text.trim() && !showVoiceRecorder) || !userLocation || isSubmitting) return

    // Content moderation
    if (text && moderateContent(text)) {
      alert('Your message contains inappropriate content. Please revise and try again.')
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({
        text: text.trim() || undefined,
        category_id: selectedCategory || undefined
      })
      setText('')
      setSelectedCategory('')
    } catch (error) {
      console.error('Error submitting whisper:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVoiceSubmit = async (voiceUrl: string) => {
    try {
      setIsSubmitting(true)
      await onSubmit({
        text: null,
        voice_url: voiceUrl,
        category_id: selectedCategory || undefined
      })
      setSelectedCategory('')
      setShowVoiceRecorder(false)
    } catch (error) {
      console.error('Error submitting voice whisper:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const remainingChars = 280 - text.length
  const selectedCategoryData = categories.find(c => c.id === selectedCategory)

  // Mock categories for demo (replace with your actual categories)
  const mockCategories = [
    { id: '1', name: 'Mood', emoji: '💭', color: '#8B5CF6' },
    { id: '2', name: 'Food', emoji: '🍕', color: '#F59E0B' },
    { id: '3', name: 'Music', emoji: '🎵', color: '#10B981' },
    { id: '4', name: 'Love', emoji: '💕', color: '#EF4444' },
    { id: '5', name: 'Travel', emoji: '✈️', color: '#3B82F6' },
    { id: '6', name: 'Study', emoji: '📚', color: '#6366F1' }
  ]

  const displayCategories = categories.length > 0 ? categories : mockCategories

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/5"
      >
        <div className={`${compact ? 'p-5' : 'p-7'}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
            <EarIcon className="text-pink-500 w-6 h-6 animate-bounce" />
          </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Share a whispr</h3>
                <p className="text-sm text-gray-500">What's on your mind?</p>
              </div>
            </div>
            {onClose && (
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="rounded-full w-8 h-8 p-0 hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-900 mb-3 block">Category</label>
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory('')}
                className={`px-2.5 py-2 h-7 text-center flex items-center rounded-xl text-xs font-medium transition-all duration-150 ${
                  !selectedCategory
                    ? 'bg-black text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                💬 General
              </motion.button>
              {categories.slice(0, 3).map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-2.5 py-2 h-7 text-center flex items-center rounded-xl text-sm font-medium transition-all duration-150 border ${
                    selectedCategory === category.id
                      ? 'text-white border-transparent'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id ? category.color : undefined
                  }}
                >
                  {category.emoji} {category.name}
                </motion.button>
              ))}
              {displayCategories.length > 3 && (
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-auto px-2.5 py-2 h-7 text-center flex items-center rounded-xl border-gray-200 bg-white hover:bg-gray-50">
                    <span className="text-sm font-medium">+{displayCategories.length - 3} more</span>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200 shadow-lg">
                    {displayCategories.slice(3).map((category) => (
                      <SelectItem key={category.id} value={category.id} className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <span>{category.emoji}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Content Input */}
          <AnimatePresence mode="wait">
            {showVoiceRecorder ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <VoiceRecorder
                  onSubmit={handleVoiceSubmit}
                  onClose={() => setShowVoiceRecorder(false)}
                />
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Text Input */}
                <div className="relative">
                  <div
                    className={`relative rounded-2xl border transition-all duration-200 ${
                      isFocused
                        ? 'border-black bg-white shadow-sm'
                        : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                    }`}
                  >
                    <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Share what's on your mind..."
                      className={`${compact ? 'min-h-[100px]' : 'min-h-[120px]'} resize-none border-0 bg-transparent placeholder:text-gray-400 text-gray-900 rounded-2xl focus:ring-0 focus:outline-none p-4 pr-16`}
                      maxLength={280}
                    />

                    {/* Character Count */}
                    <div className="absolute bottom-4 right-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                        remainingChars < 20
                          ? 'bg-red-50 text-red-600'
                          : remainingChars < 50
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {remainingChars}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Voice Button */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowVoiceRecorder(true)}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-150"
                    >
                      <Mic className="w-4 h-4 text-gray-600" />
                    </motion.button>

                    {/* Location Status */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
                      userLocation
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {userLocation ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <MapPin className="w-3 h-3" />
                      )}
                      <span>
                        {userLocation ? 'Location detected' : 'Location required'}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.div
                    whileHover={{ scale: text.trim() && userLocation && !isSubmitting ? 1.02 : 1 }}
                    whileTap={{ scale: text.trim() && userLocation && !isSubmitting ? 0.98 : 1 }}
                  >
                    <Button
                      type="submit"
                      disabled={!text.trim() || !userLocation || isSubmitting}
                      className={`px-2.5 py-2 h-7 text-center flex items-center rounded-xl font-semibold transition-all duration-150 ${
                        !text.trim() || !userLocation || isSubmitting
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200'
                          : 'bg-black text-white hover:bg-gray-800 shadow-sm'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin" />
                          <span>Sharing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          <span>Share</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export const CompactWhisperForm = (props: Omit<WhisperFormProps, 'compact'>) => {
  return <WhisperForm {...props} compact={true} />
}
