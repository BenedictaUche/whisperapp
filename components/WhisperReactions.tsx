'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useWhisperReactions } from '@/hooks/useWhisperReactions'
import { Smile, Plus } from 'lucide-react'

interface WhisperReactionsProps {
  whisperId: string
  currentUserId?: string | null
}

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🤔', '👏', '🔥', '💯']

export const WhisperReactions = ({ whisperId, currentUserId }: WhisperReactionsProps) => {
  const { reactions, toggleReaction } = useWhisperReactions(whisperId)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Group reactions by emoji
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = {
        count: 0,
        userReacted: false
      }
    }
    acc[reaction.emoji].count++
    if (reaction.user_id === currentUserId) {
      acc[reaction.emoji].userReacted = true
    }
    return acc
  }, {} as Record<string, { count: number; userReacted: boolean }>)

  const handleEmojiClick = async (emoji: string) => {
    await toggleReaction(emoji)
    setShowEmojiPicker(false)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <AnimatePresence>
        {Object.entries(groupedReactions).map(([emoji, data]) => (
          <motion.div
            key={emoji}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => handleEmojiClick(emoji)}
              variant={data.userReacted ? "default" : "outline"}
              size="sm"
              className="h-8 px-2 text-xs gap-1"
            >
              <span className="text-sm">{emoji}</span>
              <span>{data.count}</span>
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="grid grid-cols-5 gap-1">
            {EMOJI_OPTIONS.map((emoji) => (
              <Button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-lg hover:bg-accent"
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}