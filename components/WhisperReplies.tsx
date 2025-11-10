'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { useWhisperReplies } from '@/hooks/useWhisperReplies'
import { GifPicker } from './GifPicker'
import { VoiceRecorder } from './VoiceRecorder'
import { MessageCircle, Send, Trash2, Image, Mic } from 'lucide-react'
import { formatDistance } from 'date-fns'

interface WhisperRepliesProps {
  whisperId: string
  currentUserId?: string | null
}

export const WhisperReplies = ({ whisperId, currentUserId }: WhisperRepliesProps) => {
  const { replies, loading, createReply, deleteReply } = useWhisperReplies(whisperId)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [showGifPicker, setShowGifPicker] = useState(false)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitReply = async () => {
    if (!replyText.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      await createReply({ text: replyText })
      setReplyText('')
      setShowReplyForm(false)
    } catch (error) {
      console.error('Error submitting reply:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGifSelect = async (gifUrl: string) => {
    try {
      setIsSubmitting(true)
      await createReply({ gif_url: gifUrl })
      setShowGifPicker(false)
      setShowReplyForm(false)
    } catch (error) {
      console.error('Error submitting GIF reply:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVoiceSubmit = async (voiceUrl: string) => {
    try {
      setIsSubmitting(true)
      await createReply({ voice_url: voiceUrl })
      setShowVoiceRecorder(false)
      setShowReplyForm(false)
    } catch (error) {
      console.error('Error submitting voice reply:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    return formatDistance(new Date(timestamp), new Date(), { addSuffix: true })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Reply Button */}
      <Button
        onClick={() => setShowReplyForm(!showReplyForm)}
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Reply ({replies.length})
      </Button>

      {/* Reply Form */}
      <AnimatePresence>
        {showReplyForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <Card className="p-3">
              <div className="space-y-3">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="min-h-[80px] resize-none"
                  maxLength={280}
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setShowGifPicker(!showGifPicker)}
                      variant="ghost"
                      size="sm"
                      className="p-2"
                    >
                      <Image className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
                      variant="ghost"
                      size="sm"
                      className="p-2"
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {280 - replyText.length}
                    </span>
                    <Button
                      onClick={handleSubmitReply}
                      disabled={!replyText.trim() || isSubmitting}
                      size="sm"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* GIF Picker */}
                {showGifPicker && (
                  <GifPicker
                    onSelect={handleGifSelect}
                    onClose={() => setShowGifPicker(false)}
                  />
                )}

                {/* Voice Recorder */}
                {showVoiceRecorder && (
                  <VoiceRecorder
                    onSubmit={handleVoiceSubmit}
                    onClose={() => setShowVoiceRecorder(false)}
                  />
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replies List */}
      <AnimatePresence>
        {replies.map((reply, index) => (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-3 ml-4 border-l-2 border-primary/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-primary">
                      {reply.anonymous_label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(reply.created_at)}
                    </span>
                  </div>

                  {reply.text && (
                    <p className="text-sm text-foreground mb-2">{reply.text}</p>
                  )}

                  {reply.gif_url && (
                    <img
                      src={reply.gif_url}
                      alt="GIF reply"
                      className="max-w-xs rounded-lg mb-2"
                    />
                  )}

                  {reply.voice_url && (
                    <audio
                      controls
                      className="mb-2"
                      src={reply.voice_url}
                    />
                  )}
                </div>

                {reply.user_id === currentUserId && (
                  <Button
                    onClick={() => deleteReply(reply.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}