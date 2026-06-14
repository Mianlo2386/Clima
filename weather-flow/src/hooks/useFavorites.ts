import { useState, useCallback } from 'react'
import type { FavoriteCity, GeocodingResult } from '../types/weather'

function loadFavorites(): FavoriteCity[] {
  try {
    const raw = localStorage.getItem('weather-favorites')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveFavorites(favs: FavoriteCity[]) {
  localStorage.setItem('weather-favorites', JSON.stringify(favs))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCity[]>(loadFavorites)

  const addFavorite = useCallback((city: GeocodingResult) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.latitude === city.latitude && f.longitude === city.longitude)
      if (exists) return prev
      const next = [...prev, {
        name: city.name,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
        countryCode: city.countryCode,
      }]
      saveFavorites(next)
      return next
    })
  }, [])

  const removeFavorite = useCallback((lat: number, lon: number) => {
    setFavorites(prev => {
      const next = prev.filter(f => f.latitude !== lat || f.longitude !== lon)
      saveFavorites(next)
      return next
    })
  }, [])

  const isFavorite = useCallback((lat: number, lon: number) => {
    return favorites.some(f => f.latitude === lat && f.longitude === lon)
  }, [favorites])

  return { favorites, addFavorite, removeFavorite, isFavorite }
}
