import { useQuery } from '@tanstack/react-query'
import { reverseGeocode } from '../api/geocoding.api'

export function useLocationName(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ['locationName', lat, lon],
    queryFn: () => reverseGeocode(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
