import { useState, useEffect } from 'react'

const GPS_TIMEOUT = 8000

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
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    async function getPosition() {
      try {
        const CapacitorGeo = await import('@capacitor/geolocation').catch(() => null)
        const Geolocation = CapacitorGeo?.Geolocation ?? null

        if (Geolocation) {
          const perm = await Geolocation.requestPermissions()
          if (perm.location !== 'granted') {
            if (!cancelled) {
              setError('Permiso de ubicación denegado')
              setLoading(false)
            }
            return
          }

          const pos = await Promise.race([
            Geolocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 5000,
            }),
            new Promise<never>((_, reject) => {
              timeoutId = setTimeout(() => reject(new Error('GPS timeout')), GPS_TIMEOUT)
            }),
          ])

          if (cancelled) return
          clearTimeout(timeoutId)

          setPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          })
          setError(null)
          setLoading(false)
          return
        }

        const browserPos = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('not supported'))
            return
          }

          const timer = setTimeout(() => reject(new Error('timeout')), GPS_TIMEOUT)

          navigator.geolocation.getCurrentPosition(
            (p) => { clearTimeout(timer); resolve(p) },
            (e) => { clearTimeout(timer); reject(e) },
            { enableHighAccuracy: false, timeout: 5000 },
          )
        })

        if (cancelled) return

        setPosition({
          latitude: browserPos.coords.latitude,
          longitude: browserPos.coords.longitude,
        })
        setError(null)
        setLoading(false)
      } catch {
        if (!cancelled) {
          setError('No se pudo obtener la ubicación')
          setLoading(false)
        }
      }
    }

    getPosition()

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  return { position, error, loading }
}
