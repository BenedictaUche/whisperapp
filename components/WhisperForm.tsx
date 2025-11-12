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
        className="bg-card border border-border rounded-xl shadow-lg"
      >
        <div className={`${compact ? 'p-5' : 'p-6'}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <EarIcon className="text-primary w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Share a whisper</h3>
                <p className="text-sm text-muted-foreground">What&apos;s on your mind?</p>
              </div>
            </div>
            {onClose && (
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="rounded-full w-8 h-8 p-0 hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-foreground mb-3 block">Category</label>
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-2 h-8 text-center flex items-center rounded-lg text-sm font-medium transition-all duration-150 ${
                  !selectedCategory
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
                  className={`px-3 py-2 h-8 text-center flex items-center rounded-lg text-sm font-medium transition-all duration-150 ${
                    selectedCategory === category.id
                      ? 'text-primary-foreground border-transparent'
                      : 'bg-background text-muted-foreground hover:bg-muted border border-border'
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
                  <SelectTrigger className="w-auto px-3 py-2 h-8 text-center flex items-center rounded-lg border-border bg-background hover:bg-muted">
                    <span className="text-sm font-medium">+{displayCategories.length - 3} more</span>
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-border shadow-lg">
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
                    className={`relative rounded-lg border transition-all duration-200 ${
                      isFocused
                        ? 'border-primary bg-background shadow-sm'
                        : 'border-border bg-muted/50 hover:bg-background hover:border-border/80'
                    }`}
                  >
                    <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Share what's on your mind..."
                      className={`${compact ? 'min-h-[100px]' : 'min-h-[120px]'} resize-none border-0 bg-transparent placeholder:text-muted-foreground text-foreground rounded-lg focus:ring-0 focus:outline-none p-4 pr-16`}
                      maxLength={280}
                    />

                    {/* Character Count */}
                    <div className="absolute bottom-4 right-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                        remainingChars < 20
                          ? 'bg-destructive/10 text-destructive'
                          : remainingChars < 50
                          ? 'bg-warning/10 text-warning'
                          : 'bg-muted text-muted-foreground'
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
                      className="w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors duration-150"
                    >
                      <Mic className="w-4 h-4 text-muted-foreground" />
                    </motion.button>

                    {/* Location Status */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                      userLocation
                        ? 'bg-green-500/10 text-green-600'
                        : 'bg-destructive/10 text-destructive'
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
                      className={`px-4 py-2 h-8 text-center flex items-center rounded-lg font-semibold transition-all duration-150 ${
                        !text.trim() || !userLocation || isSubmitting
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
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
