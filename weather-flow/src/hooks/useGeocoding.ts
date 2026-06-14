import { useQuery } from '@tanstack/react-query'
import { searchCities } from '../api/geocoding.api'
import type { GeocodingResult } from '../types/weather'

export function useCitySearch(query: string) {
  return useQuery<GeocodingResult[]>({
    queryKey: ['cities', query],
    queryFn: () => searchCities(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 60 * 24,
  })
}
