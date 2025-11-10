'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

interface FloatingActionButtonProps {
  onClick: () => void
  icon?: React.ReactNode
  className?: string
  disabled?: boolean
}

export const FloatingActionButton = ({ 
  onClick, 
  icon = <Plus className="w-6 h-6" />, 
  className,
  disabled 
}: FloatingActionButtonProps) => {
  return (
    <motion.div
      className={cn(
        'fixed bottom-6 right-6 z-50',
        className
      )}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={onClick}
        disabled={disabled}
        size="lg"
        className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 bg-primary hover:bg-primary/90"
      >
        {icon}
      </Button>
    </motion.div>
  )
}