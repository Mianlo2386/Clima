import type { GeocodingResult } from '../types/weather'

interface GeocodingMatch {
  name: string
  country: string
  latitude: number
  longitude: number
  country_code: string
  admin1?: string
}

interface SearchResponse {
  results?: GeocodingMatch[]
}

interface ReverseResponse {
  results?: GeocodingMatch[]
}

export async function searchCities(query: string, count = 5): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    name: query,
    count: count.toString(),
    language: 'es',
    format: 'json',
  })

  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`)
  if (!res.ok) throw new Error(`Geocoding API error: ${res.status}`)
  const data: SearchResponse = await res.json()

  return (data.results ?? []).map(m => ({
    name: m.name,
    country: m.country,
    latitude: m.latitude,
    longitude: m.longitude,
    countryCode: m.country_code,
    admin1: m.admin1,
  }))
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeocodingResult | null> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    language: 'es',
    format: 'json',
  })

  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?${params}`)
  if (!res.ok) throw new Error(`Reverse geocoding error: ${res.status}`)
  const data: ReverseResponse = await res.json()

  const match = data.results?.[0]
  if (!match) return null

  return {
    name: match.name,
    country: match.country,
    latitude: match.latitude,
    longitude: match.longitude,
    countryCode: match.country_code,
    admin1: match.admin1,
  }
}
