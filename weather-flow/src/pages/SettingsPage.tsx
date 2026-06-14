import { useSettings } from '../hooks/useSettings'
import LocationHeader from '../components/LocationHeader'
import { Sun, Moon, Monitor, Thermometer } from 'lucide-react'

export default function SettingsPage() {
  const { theme, tempUnit, setTheme, setTempUnit } = useSettings()

  return (
    <div className="pb-8">
      <LocationHeader name="Configuración" isFavorite={false} onToggleFavorite={() => {}} showBack />

      <div className="px-4 space-y-6">
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Tema</h2>
          <div className="space-y-2">
            <ThemeOption
              icon={<Monitor size={18} />}
              label="Sistema"
              active={theme === 'system'}
              onClick={() => setTheme('system')}
            />
            <ThemeOption
              icon={<Sun size={18} />}
              label="Claro"
              active={theme === 'light'}
              onClick={() => setTheme('light')}
            />
            <ThemeOption
              icon={<Moon size={18} />}
              label="Oscuro"
              active={theme === 'dark'}
              onClick={() => setTheme('dark')}
            />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Unidad de temperatura</h2>
          <div className="space-y-2">
            <ThemeOption
              icon={<Thermometer size={18} />}
              label="Celsius (°C)"
              active={tempUnit === 'C'}
              onClick={() => setTempUnit('C')}
            />
            <ThemeOption
              icon={<Thermometer size={18} />}
              label="Fahrenheit (°F)"
              active={tempUnit === 'F'}
              onClick={() => setTempUnit('F')}
            />
          </div>
        </section>

        <section className="pt-4">
          <p className="text-xs text-gray-400 text-center">
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
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors text-left ${
        active
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      <span className={active ? 'text-blue-500' : 'text-gray-400'}>{icon}</span>
      <span className="text-sm font-medium">{label}</span>
      {active && <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Activo</span>}
    </button>
  )
}
