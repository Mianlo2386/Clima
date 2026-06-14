import { useSettings } from '../hooks/useSettings'
import LocationHeader from '../components/LocationHeader'
import { Sun, Moon, Monitor, Thermometer } from 'lucide-react'

export default function SettingsPage() {
  const { theme, tempUnit, setTheme, setTempUnit } = useSettings()

  return (
    <div className="min-h-dvh pb-8">
      <LocationHeader name="Configuración" isFavorite={false} onToggleFavorite={() => {}} showBack />

      <div className="px-4 space-y-6">
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wide mb-3">Tema</h2>
          <div className="rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border border-gray-200/60 dark:border-white/10 overflow-hidden">
            <ThemeOption
              icon={<Monitor size={18} />}
              label="Sistema"
              active={theme === 'system'}
              onClick={() => setTheme('system')}
            />
            <div className="border-b border-gray-200/30 dark:border-white/5" />
            <ThemeOption
              icon={<Sun size={18} />}
              label="Claro"
              active={theme === 'light'}
              onClick={() => setTheme('light')}
            />
            <div className="border-b border-gray-200/30 dark:border-white/5" />
            <ThemeOption
              icon={<Moon size={18} />}
              label="Oscuro"
              active={theme === 'dark'}
              onClick={() => setTheme('dark')}
            />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wide mb-3">Unidad de temperatura</h2>
          <div className="rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border border-gray-200/60 dark:border-white/10 overflow-hidden">
            <UnitOption
              icon={<Thermometer size={18} />}
              label="Celsius (°C)"
              active={tempUnit === 'C'}
              onClick={() => setTempUnit('C')}
            />
            <div className="border-b border-gray-200/30 dark:border-white/5" />
            <UnitOption
              icon={<Thermometer size={18} />}
              label="Fahrenheit (°F)"
              active={tempUnit === 'F'}
              onClick={() => setTempUnit('F')}
            />
          </div>
        </section>

        <section className="pt-4">
          <p className="text-xs text-gray-400 dark:text-white/40 text-center">
            Weather Flow — Datos de Open-Meteo
          </p>
        </section>
      </div>
    </div>
  )
}

function ThemeOption({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3.5 transition-colors ${
        active ? 'bg-gray-100 dark:bg-white/10' : 'hover:bg-gray-100/50 dark:hover:bg-white/5'
      }`}
    >
      <span className={active ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-white/50'}>{icon}</span>
      <span className={`text-sm font-medium ${active ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-white/70'}`}>{label}</span>
      {active && <span className="ml-auto text-xs bg-gray-200 dark:bg-white/20 text-gray-700 dark:text-white px-2 py-0.5 rounded-full">Activo</span>}
    </button>
  )
}

function UnitOption({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3.5 transition-colors ${
        active ? 'bg-gray-100 dark:bg-white/10' : 'hover:bg-gray-100/50 dark:hover:bg-white/5'
      }`}
    >
      <span className={active ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-white/50'}>{icon}</span>
      <span className={`text-sm font-medium ${active ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-white/70'}`}>{label}</span>
      {active && <span className="ml-auto text-xs bg-gray-200 dark:bg-white/20 text-gray-700 dark:text-white px-2 py-0.5 rounded-full">Activo</span>}
    </button>
  )
}
