'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { searchGifs, getTrendingGifs, type GiphyGif } from '@/lib/giphyApi'
import { Search, X } from 'lucide-react'

interface GifPickerProps {
  onSelect: (gifUrl: string) => void
  onClose: () => void
}

export const GifPicker = ({ onSelect, onClose }: GifPickerProps) => {
  const [gifs, setGifs] = useState<GiphyGif[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const loadTrendingGifs = async () => {
    setLoading(true)
    try {
      const trendingGifs = await getTrendingGifs(12)
      setGifs(trendingGifs)
    } catch (error) {
      console.error('Error loading trending GIFs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadTrendingGifs()
      return
    }

    setLoading(true)
    try {
      const searchResults = await searchGifs(searchQuery, 12)
      setGifs(searchResults)
    } catch (error) {
      console.error('Error searching GIFs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTrendingGifs()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(handleSearch, 500)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  return (
    <Card className="p-4 max-h-96 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Choose a GIF</h3>
        <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search GIFs..."
          className="pl-10"
        />
      </div>

      <div className="overflow-y-auto max-h-64">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {gifs.map((gif) => (
              <motion.button
                key={gif.id}
                onClick={() => onSelect(gif.images.original.url)}
                className="relative overflow-hidden rounded-lg hover:opacity-80 transition-opacity"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src={gif.images.fixed_height_small.url}
                  alt={gif.title}
                  className="w-full h-24 object-cover"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}