import { formatHour, formatTemp } from '../utils/formatters'
import { getWmoInfo } from '../utils/wmoConditions'
import { useSettings } from '../hooks/useSettings'
import type { HourlyForecast as HourlyType } from '../types/weather'

interface Props {
  data: HourlyType[]
}

export default function HourlyForecast({ data }: Props) {
  const { tempUnit } = useSettings()

  return (
    <div className="px-4 py-3">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Próximas horas</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {data.slice(0, 24).map((h) => (
          <div key={h.time} className="flex flex-col items-center gap-1 min-w-[56px]">
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatHour(h.time)}</span>
            <span className="text-lg">{getWmoInfo(h.weatherCode).icon}</span>
            <span className="text-sm font-medium">{formatTemp(h.temperature, tempUnit)}</span>
            {h.precipitationProbability > 0 && (
              <span className="text-xs text-blue-500">{h.precipitationProbability}%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
