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
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Pronóstico 14 días</h2>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {data.map((d) => (
          <div key={d.date} className="flex items-center gap-3 py-3">
            <div className="w-20">
              <span className="text-sm font-medium">{formatDay(d.date)}</span>
              <span className="text-xs text-gray-400 ml-1">{formatDate(d.date)}</span>
            </div>
            <span className="text-xl">{getWmoInfo(d.weatherCode).icon}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex-1">{getWmoInfo(d.weatherCode).label}</span>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{formatTemp(d.tempMax, tempUnit)}</span>
              <span className="text-gray-400">{formatTemp(d.tempMin, tempUnit)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
