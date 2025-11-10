'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Icon, DivIcon } from 'leaflet'
import { motion } from 'framer-motion'
import { Whisper } from '@/lib/supabase'
import { formatDistance } from '@/lib/geolocation'
import 'leaflet/dist/leaflet.css'

interface MapViewProps {
  userLat: number
  userLon: number
  whispers: Whisper[]
  className?: string
  currentUserId?: string | null
  onDeleteWhisper?: (id: string) => Promise<boolean>
}

const createWhisperIcon = (opacity: number) => {
  return new DivIcon({
    html: `<div class="whisper-pin" style="opacity: ${opacity}">👂</div>`,
    className: 'custom-whisper-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  })
}

const MapUpdater = ({ lat, lon }: { lat: number, lon: number }) => {
  const map = useMap()
  
  useEffect(() => {
    map.setView([lat, lon], 14)
  }, [lat, lon, map])
  
  return null
}

export const MapView = ({ userLat, userLon, whispers, className, currentUserId, onDeleteWhisper }: MapViewProps) => {
  useEffect(() => {
    // Fix for default markers in react-leaflet - only run on client side
    delete (Icon.Default.prototype as any)._getIconUrl
    Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
  }, [])

  const getWhisperOpacity = (whisper: Whisper) => {
    const now = new Date()
    const expireTime = new Date(whisper.expire_at)
    const createdTime = new Date(whisper.timestamp)
    const totalLife = expireTime.getTime() - createdTime.getTime()
    const remainingLife = expireTime.getTime() - now.getTime()
    
    return Math.max(0.2, remainingLife / totalLife)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = now.getTime() - time.getTime()
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (hours > 0) return `${hours}h ago`
    return `${minutes}m ago`
  }

  const handleDeleteFromMap = async (whisperId: string) => {
    if (onDeleteWhisper) {
      return await onDeleteWhisper(whisperId)
    }
    return false
  }

  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MapContainer
        center={[userLat, userLon]}
        zoom={14}
        style={{ height: '100%', width: '100%', borderRadius: '16px' }}
        className="z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapUpdater lat={userLat} lon={userLon} />
        
        {/* User location marker */}
        <Marker position={[userLat, userLon]}>
          <Popup>
            <div className="text-center">
              <span className="font-medium">You are here</span>
            </div>
          </Popup>
        </Marker>

        {/* Whisper markers */}
        {whispers.map((whisper) => (
          <Marker
            key={whisper.id}
            position={[whisper.latitude, whisper.longitude]}
            icon={createWhisperIcon(getWhisperOpacity(whisper))}
          >
            <Popup>
              <div className="max-w-xs p-2">
                <p className="text-sm mb-2">{whisper.text}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatDistance((whisper as any).distance)}</span>
                  <span>{formatTimeAgo(whisper.timestamp)}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style jsx global>{`
        .whisper-pin {
          font-size: 20px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          transition: all 0.3s ease;
        }
        .custom-whisper-icon {
          background: none !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
      `}</style>
    </motion.div>
  )
}