'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useUserProfile } from '@/hooks/useUserProfile'
import { MapPin, Eye, EyeOff } from 'lucide-react'

interface LocationRadiusControlProps {
  onRadiusChange: (radius: number) => void
  onIncognitoToggle: (enabled: boolean) => void
}

export const LocationRadiusControl = ({ onRadiusChange, onIncognitoToggle }: LocationRadiusControlProps) => {
  const { profile, updatePreferences } = useUserProfile()
  const [radius, setRadius] = useState(profile?.preferences.location_radius || 5)
  const [incognitoMode, setIncognitoMode] = useState(profile?.preferences.incognito_mode || false)

  const handleRadiusChange = (newRadius: number[]) => {
    const radiusValue = newRadius[0]
    setRadius(radiusValue)
    onRadiusChange(radiusValue)
    updatePreferences({ location_radius: radiusValue })
  }

  const handleIncognitoToggle = (enabled: boolean) => {
    setIncognitoMode(enabled)
    onIncognitoToggle(enabled)
    updatePreferences({ incognito_mode: enabled })
  }

  return (
    <Card className="p-4 bg-transparent border-none shadow-none">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Browse Radius: {radius}km</Label>
          </div>

          <Slider
            value={[radius]}
            onValueChange={handleRadiusChange}
            min={1}
            max={10}
            step={0.5}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1km</span>
            <span>10km</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {incognitoMode ? (
              <EyeOff className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Eye className="w-4 h-4 text-muted-foreground" />
            )}
            <Label htmlFor="incognito-mode" className="text-sm font-medium">
              Incognito Mode
            </Label>
          </div>

          <Switch
            id="incognito-mode"
            checked={incognitoMode}
            onCheckedChange={handleIncognitoToggle}
          />
        </div>

        {incognitoMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg"
          >
            <p>
              🕵️ Incognito mode enabled. Your location won&apos;t be shared when browsing whispers,
              but you can still post whispers with your location.
            </p>
          </motion.div>
        )}
      </div>
    </Card>
  )
}
