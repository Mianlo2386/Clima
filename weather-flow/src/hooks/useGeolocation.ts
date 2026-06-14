import { useState, useEffect } from 'react'

export interface GeoPosition {
  latitude: number
  longitude: number
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function getPosition() {
      try {
        const CapacitorGeo = await import('@capacitor/geolocation').catch(() => null)
        const Geolocation = CapacitorGeo?.Geolocation ?? null

        if (Geolocation) {
          const perm = await Geolocation.requestPermissions()
          if (perm.location !== 'granted') {
            setError('Permiso de ubicación denegado')
            setLoading(false)
            return
          }

          const pos = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 5000,
          })

          if (cancelled) return

          setPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          })
          setError(null)
          setLoading(false)
          return
        }

        if (!navigator.geolocation) {
          setError('Geolocalización no soportada')
          setLoading(false)
          return
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (cancelled) return
            setPosition({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            })
            setError(null)
            setLoading(false)
          },
          () => {
            if (cancelled) return
            setError('No se pudo obtener la ubicación')
            setLoading(false)
          },
          { enableHighAccuracy: true, timeout: 5000 },
        )
      } catch {
        if (!cancelled) {
          setError('No se pudo obtener la ubicación')
          setLoading(false)
        }
      }
    }

    getPosition()

    return () => { cancelled = true }
  }, [])

  return { position, error, loading }
}
