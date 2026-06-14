import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface ActiveCity {
  latitude: number
  longitude: number
  name: string
  country: string
  source: 'gps' | 'manual' | 'favorite'
}

interface ActiveCityContextType {
  activeCity: ActiveCity | null
  setActiveCity: (city: ActiveCity) => void
  clearActiveCity: () => void
}

function loadActiveCity(): ActiveCity | null {
  try {
    const raw = localStorage.getItem('weather-active-city')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveActiveCity(city: ActiveCity | null) {
  if (city) {
    localStorage.setItem('weather-active-city', JSON.stringify(city))
  } else {
    localStorage.removeItem('weather-active-city')
  }
}

const ActiveCityContext = createContext<ActiveCityContextType | null>(null)

export function ActiveCityProvider({ children }: { children: ReactNode }) {
  const [activeCity, setActiveCityState] = useState<ActiveCity | null>(loadActiveCity)

  useEffect(() => {
    saveActiveCity(activeCity)
  }, [activeCity])

  const setActiveCity = (city: ActiveCity) => setActiveCityState(city)

  const clearActiveCity = () => setActiveCityState(null)

  return (
    <ActiveCityContext.Provider value={{ activeCity, setActiveCity, clearActiveCity }}>
      {children}
    </ActiveCityContext.Provider>
  )
}

export function useActiveCity(): ActiveCityContextType {
  const ctx = useContext(ActiveCityContext)
  if (!ctx) throw new Error('useActiveCity must be used within ActiveCityProvider')
  return ctx
}
