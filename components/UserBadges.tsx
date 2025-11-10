'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useUserProfile } from '@/hooks/useUserProfile'
import { Trophy, Flame, MessageCircle, Heart, Zap } from 'lucide-react'

const BADGE_DEFINITIONS = {
  'first_whisper': { icon: MessageCircle, label: 'First Whisper', color: 'bg-blue-500' },
  'streak_7': { icon: Flame, label: '7-Day Streak', color: 'bg-orange-500' },
  'streak_30': { icon: Flame, label: '30-Day Streak', color: 'bg-red-500' },
  'popular': { icon: Heart, label: 'Popular', color: 'bg-pink-500' },
  'active': { icon: Zap, label: 'Active User', color: 'bg-yellow-500' },
  'veteran': { icon: Trophy, label: 'Veteran', color: 'bg-purple-500' }
}

export const UserBadges = () => {
  const { profile, loading } = useUserProfile()

  if (loading || !profile) {
    return null
  }

  const badges = profile.badges || []

  if (badges.length === 0) {
    return null
  }

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          Your Badges
        </h3>

        <div className="flex flex-wrap gap-2">
          {badges.map((badgeKey, index) => {
            const badge = BADGE_DEFINITIONS[badgeKey as keyof typeof BADGE_DEFINITIONS]
            if (!badge) return null

            const Icon = badge.icon

            return (
              <motion.div
                key={badgeKey}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge
                  variant="secondary"
                  className={`${badge.color} text-white flex items-center gap-1`}
                >
                  <Icon className="w-3 h-3" />
                  {badge.label}
                </Badge>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{profile.current_streak}</div>
            <div className="text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{profile.whisper_count}</div>
            <div className="text-muted-foreground">Whispers Shared</div>
          </div>
        </div>
      </div>
    </Card>
  )
}