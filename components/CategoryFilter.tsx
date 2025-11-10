'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useWhisperCategories } from '@/hooks/useWhisperCategories'
import { Filter } from 'lucide-react'

interface CategoryFilterProps {
  selectedCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const { categories, loading } = useWhisperCategories()

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Loading categories...</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filter by category</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => onCategoryChange(null)}
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          className="h-8"
        >
          All
        </Button>

        {categories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => onCategoryChange(category.id)}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className="h-8 gap-1"
              style={{
                backgroundColor: selectedCategory === category.id ? category.color : undefined,
                borderColor: category.color
              }}
            >
              <span>{category.emoji}</span>
              <span>{category.name}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}