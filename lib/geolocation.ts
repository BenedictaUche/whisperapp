export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away`
  }
  return `${distance.toFixed(1)}km away`
}

export const obfuscateLocation = (lat: number, lon: number, radiusKm: number = 0.1): { latitude: number, longitude: number } => {
  // Add random offset within specified radius to protect privacy
  const earthRadius = 6371 // km
  const maxOffset = radiusKm / earthRadius // in radians
  
  // Generate random angle and distance
  const angle = Math.random() * 2 * Math.PI
  const distance = Math.random() * maxOffset
  
  // Calculate offset in lat/lon
  const latOffset = distance * Math.cos(angle) * (180 / Math.PI)
  const lonOffset = distance * Math.sin(angle) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180)
  
  return {
    latitude: lat + latOffset,
    longitude: lon + lonOffset
  }
}

export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

export const watchPosition = (
  onSuccess: (position: GeolocationPosition) => void,
  onError: (error: GeolocationPositionError) => void
): number => {
  if (!navigator.geolocation) {
    onError({
      code: 2,
      message: 'Geolocation is not supported by this browser.',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    } as GeolocationPositionError)
    return -1
  }

  return navigator.geolocation.watchPosition(
    onSuccess,
    onError,
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    }
  )
}

export interface LocationData {
  latitude: number
  longitude: number
}

export const getCurrentLocation = async (): Promise<LocationData> => {
  const position = await getCurrentPosition()
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  }
}