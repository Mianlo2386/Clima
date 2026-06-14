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
      <h2 className="text-sm font-semibold text-gray-700 dark:text-white/70 uppercase tracking-wide mb-3">Próximas horas</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {data.slice(0, 24).map((h) => {
          const precip = h.precipitationProbability
          return (
            <div
              key={h.time}
              className="flex flex-col items-center gap-1.5 min-w-[64px] p-3 rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border border-gray-200/60 dark:border-white/10 snap-start"
            >
              <span className="text-xs text-gray-500 dark:text-white/60">{formatHour(h.time)}</span>
              <span className="text-2xl">{getWmoInfo(h.weatherCode).icon}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatTemp(h.temperature, tempUnit)}</span>
              {precip > 0 && (
                <span className="text-[10px] text-blue-300 font-medium">{precip}%</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
