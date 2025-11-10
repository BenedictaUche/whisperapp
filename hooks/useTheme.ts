'use client'

import { useState, useEffect } from 'react'

export type Theme = 'velvet' | 'midnight'

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('velvet')

  useEffect(() => {
    const savedTheme = localStorage.getItem('whispermap_theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('whispermap_theme', theme)
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'velvet' ? 'midnight' : 'velvet')
  }

  return { theme, setTheme, toggleTheme }
}