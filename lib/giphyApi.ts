// Giphy API integration for GIF support

const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY || 'demo_api_key'
const GIPHY_BASE_URL = 'https://api.giphy.com/v1/gifs'

export interface GiphyGif {
  id: string
  title: string
  images: {
    fixed_height_small: {
      url: string
      width: string
      height: string
    }
    original: {
      url: string
      width: string
      height: string
    }
  }
}

export const searchGifs = async (query: string, limit: number = 20): Promise<GiphyGif[]> => {
  try {
    const response = await fetch(
      `${GIPHY_BASE_URL}/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=${limit}&rating=pg`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch GIFs')
    }
    
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error searching GIFs:', error)
    return []
  }
}

export const getTrendingGifs = async (limit: number = 20): Promise<GiphyGif[]> => {
  try {
    const response = await fetch(
      `${GIPHY_BASE_URL}/trending?api_key=${GIPHY_API_KEY}&limit=${limit}&rating=pg`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending GIFs')
    }
    
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching trending GIFs:', error)
    return []
  }
}