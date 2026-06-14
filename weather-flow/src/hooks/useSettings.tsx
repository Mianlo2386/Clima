import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Theme = 'system' | 'light' | 'dark'
type TempUnit = 'C' | 'F'

interface Settings {
  theme: Theme
  tempUnit: TempUnit
}

interface SettingsContextType extends Settings {
  setTheme: (t: Theme) => void
  setTempUnit: (u: TempUnit) => void
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem('weather-settings')
    return raw ? JSON.parse(raw) : { theme: 'system', tempUnit: 'C' }
  } catch {
    return { theme: 'system', tempUnit: 'C' }
  }
}

function saveSettings(s: Settings) {
  localStorage.setItem('weather-settings', JSON.stringify(s))
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    const resolved = resolveTheme(settings.theme)
    document.documentElement.classList.toggle('dark', resolved === 'dark')
  }, [settings.theme])

  useEffect(() => {
    if (settings.theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      document.documentElement.classList.toggle('dark', mq.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [settings.theme])

  return (
    <SettingsContext.Provider
      value={{
        theme: settings.theme,
        tempUnit: settings.tempUnit,
        setTheme: (t) => setSettings(prev => ({ ...prev, theme: t })),
        setTempUnit: (u) => setSettings(prev => ({ ...prev, tempUnit: u })),
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextType {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within ThemeProvider')
  return ctx
}
