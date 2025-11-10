'use client'

import { useState, useEffect } from 'react'
import { getCurrentLocation, type LocationData } from '@/lib/geolocation'

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshLocation = async () => {
    try {
      setLoading(true)
      setError(null)
      const position = await getCurrentLocation()
      setLocation(position)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshLocation()
  }, [])

  return { location, error, loading, refreshLocation }
}