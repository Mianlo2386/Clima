import { useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import type { WeatherAlert } from '../types/weather'

interface Props {
  alerts: WeatherAlert[]
}

const severityColors: Record<string, string> = {
  extreme: 'bg-red-50 dark:bg-red-500/20 border-red-300 dark:border-red-400/40 text-red-700 dark:text-red-300',
  severe: 'bg-orange-50 dark:bg-orange-500/20 border-orange-300 dark:border-orange-400/40 text-orange-700 dark:text-orange-300',
  moderate: 'bg-yellow-50 dark:bg-yellow-500/20 border-yellow-300 dark:border-yellow-400/40 text-yellow-700 dark:text-yellow-300',
  minor: 'bg-blue-50 dark:bg-blue-500/20 border-blue-300 dark:border-blue-400/40 text-blue-700 dark:text-blue-300',
}

export default function AlertBanner({ alerts }: Props) {
  const [expanded, setExpanded] = useState(false)

  if (alerts.length === 0) return null

  const colors = severityColors[alerts[0].severity] ?? severityColors.moderate

  return (
    <div className="px-4 py-3">
      <div className={`rounded-2xl border-l-4 backdrop-blur-md p-3 ${colors}`}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} />
            <span className="text-sm font-semibold">{alerts.length} alerta{alerts.length > 1 ? 's' : ''} activa{alerts.length > 1 ? 's' : ''}</span>
          </div>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expanded && (
          <div className="mt-3 space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className="text-sm text-gray-800 dark:text-white/80">
                <p className="font-semibold">{a.event}</p>
                <p className="mt-1 opacity-80">{a.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
