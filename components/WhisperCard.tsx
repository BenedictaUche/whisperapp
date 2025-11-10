'use client'

import { motion } from 'framer-motion'
import { Whisper } from '@/lib/supabase'
import { formatDistance } from '@/lib/geolocation'
import { MapPin, Clock, Trash2, MessageCircle, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WhisperReactions } from './WhisperReactions'
import { WhisperReplies } from './WhisperReplies'
import { Badge } from '@/components/ui/badge'
import { useWhisperCategories } from '@/hooks/useWhisperCategories'
import { useState } from 'react'

interface WhisperCardProps {
  whisper: Whisper & { distance: number }
  index: number
  canDelete?: boolean
  onDelete?: (id: string) => Promise<boolean>
  currentUserId?: string | null
  onReport?: (id: string) => void
}

export const WhisperCard = ({ whisper, index, canDelete, onDelete, currentUserId, onReport }: WhisperCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const { categories } = useWhisperCategories()

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = now.getTime() - time.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (hours > 0) return `${hours}h ago`
    return `${minutes}m ago`
  }

  const getOpacity = () => {
    const now = new Date()
    const expireTime = new Date(whisper.expire_at)
    const createdTime = new Date(whisper.timestamp)
    const totalLife = expireTime.getTime() - createdTime.getTime()
    const remainingLife = expireTime.getTime() - now.getTime()

    return Math.max(0.3, remainingLife / totalLife)
  }

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return

    setIsDeleting(true)
    try {
      const success = await onDelete(whisper.id)
      if (!success) {
        console.error('Failed to delete whisper')
      }
    } catch (error) {
      console.error('Error deleting whisper:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const category = categories.find(c => c.id === whisper.category_id)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: getOpacity(), x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-card border border-border rounded-xl p-4 hover:bg-card/80 transition-colors duration-200 space-y-4 shadow-sm"
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            {category && (
              <Badge variant="secondary" className="text-xs" style={{ backgroundColor: category.color + '20', color: category.color }}>
                {category.emoji} {category.name}
              </Badge>
            )}
            <p className="text-foreground leading-relaxed">{whisper.text}</p>
          </div>

          <div className="flex items-center gap-1">
            {canDelete && onDelete && (
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 p-1 h-auto min-w-0"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            )}

            {onReport && !canDelete && (
              <Button
                onClick={() => onReport(whisper.id)}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive p-1 h-auto min-w-0"
              >
                <Flag className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Voice whisper */}
        {whisper.voice_url && (
          <audio
            controls
            className="w-full"
            src={whisper.voice_url}
          />
        )}
      </div>

      {/* Reactions */}
      <WhisperReactions whisperId={whisper.id} currentUserId={currentUserId} />

      {/* Footer with metadata and actions */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{formatDistance(whisper.distance)} • ~{Math.round(whisper.distance * 1000 / 100) * 100}m area</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowReplies(!showReplies)}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground p-1 h-auto text-xs"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            {whisper.reply_count || 0}
          </Button>

          <Clock className="w-3 h-3" />
          <span>{formatTimeAgo(whisper.timestamp)}</span>
        </div>
      </div>

      {/* Replies */}
      {showReplies && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-border pt-4"
        >
          <WhisperReplies whisperId={whisper.id} currentUserId={currentUserId} />
        </motion.div>
      )}
    </motion.div>
  )
}
