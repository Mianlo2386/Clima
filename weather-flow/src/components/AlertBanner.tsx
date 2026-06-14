import { useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import type { WeatherAlert } from '../types/weather'

interface Props {
  alerts: WeatherAlert[]
}

const severityColors: Record<string, string> = {
  extreme: 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200',
  severe: 'bg-orange-100 dark:bg-orange-900/30 border-orange-500 text-orange-800 dark:text-orange-200',
  moderate: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 text-yellow-800 dark:text-yellow-200',
  minor: 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-800 dark:text-blue-200',
}

export default function AlertBanner({ alerts }: Props) {
  const [expanded, setExpanded] = useState(false)

  if (alerts.length === 0) return null

  return (
    <div className="px-4 py-3">
      <div className={`rounded-xl border-l-4 p-3 ${severityColors[alerts[0].severity] ?? severityColors.moderate}`}>
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
              <div key={i} className="text-sm">
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
