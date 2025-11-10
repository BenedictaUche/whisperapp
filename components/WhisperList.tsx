'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Whisper } from '@/lib/supabase'
import { WhisperCard } from './WhisperCard'
import { CategoryFilter } from './CategoryFilter'
import { RefreshCw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface WhisperListProps {
  whispers: (Whisper & { distance: number })[]
  loading: boolean
  onRefresh: () => void
  currentUserId?: string | null
  onDeleteWhisper?: (id: string) => Promise<boolean>
  onReportWhisper?: (id: string) => void
}

export const WhisperList = ({
  whispers,
  loading,
  onRefresh,
  currentUserId,
  onDeleteWhisper,
  onReportWhisper
}: WhisperListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter whispers by category
  const filteredWhispers = whispers
    .filter(whisper => {
      const matchesCategory = selectedCategory ? whisper.category_id === selectedCategory : true
      const matchesSearch = searchQuery ? whisper.text?.toLowerCase().includes(searchQuery.toLowerCase()) : true
      return matchesCategory && matchesSearch
    })

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner text="Listening for whispers..." />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Category Filter */}
      <div className="space-y-4">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search whispers..."
            className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>
      </div>

      {filteredWhispers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 space-y-4"
        >
          <div className="text-6xl mb-4">👂</div>
          <h3 className="text-lg font-medium text-foreground">
            {searchQuery
              ? 'No whispers match your search'
              : selectedCategory
                ? 'No whispers in this category'
                : 'No whispers nearby'
            }
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {searchQuery
              ? 'Try adjusting your search terms or clear the search to see all whispers.'
              : selectedCategory
                ? 'Try selecting a different category or be the first to share in this one.'
                : 'Be the first to drop a whisper in this area, or wait for others to share their thoughts.'
            }
          </p>

          <Button
            onClick={onRefresh}
            variant="outline"
            className="mt-6"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </motion.div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {searchQuery || selectedCategory ? 'Filtered' : 'Nearby'} Whispers ({filteredWhispers.length})
            </h2>

            <Button
              onClick={onRefresh}
              variant="ghost"
              size="sm"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {filteredWhispers.map((whisper, index) => (
              <WhisperCard
                key={whisper.id}
                whisper={whisper}
                index={index}
                canDelete={currentUserId === whisper.user_id}
                onDelete={onDeleteWhisper}
                currentUserId={currentUserId}
                onReport={onReportWhisper}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}
