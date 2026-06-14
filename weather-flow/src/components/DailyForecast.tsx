import { formatDay, formatDate, formatTemp } from '../utils/formatters'
import { getWmoInfo } from '../utils/wmoConditions'
import { useSettings } from '../hooks/useSettings'
import type { DailyForecast as DailyType } from '../types/weather'

interface Props {
  data: DailyType[]
}

export default function DailyForecast({ data }: Props) {
  const { tempUnit } = useSettings()

  return (
    <div className="px-4 py-3">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-white/70 uppercase tracking-wide mb-3">Pronóstico 14 días</h2>
      <div className="rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border border-gray-200/60 dark:border-white/10 overflow-hidden">
        {data.map((d, i) => (
          <div
            key={d.date}
            className={`flex items-center gap-3 px-4 py-3.5 ${
              i < data.length - 1 ? 'border-b border-gray-200/30 dark:border-white/5' : ''
            }`}
          >
            <div className="w-24">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDay(d.date)}</span>
              <span className="text-xs text-gray-500 dark:text-white/50 ml-1">{formatDate(d.date)}</span>
            </div>
            <span className="text-xl">{getWmoInfo(d.weatherCode).icon}</span>
            <span className="text-xs text-gray-600 dark:text-white/60 flex-1 truncate">{getWmoInfo(d.weatherCode).label}</span>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-900 dark:text-white">{formatTemp(d.tempMax, tempUnit)}</span>
              <span className="text-gray-400 dark:text-white/40">{formatTemp(d.tempMin, tempUnit)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
