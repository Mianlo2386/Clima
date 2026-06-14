import { getWeatherIcon } from '../utils/wmoConditions'
import { formatTemp } from '../utils/formatters'
import type { CurrentWeather as CurrentWeatherType } from '../types/weather'
import { useSettings } from '../hooks/useSettings'

interface Props {
  data: CurrentWeatherType
}

export default function CurrentWeather({ data }: Props) {
  const { tempUnit } = useSettings()
  const icon = getWeatherIcon(data.weatherCode, data.isDay)

  return (
    <div className="flex flex-col items-center py-6">
      <div className="text-6xl mb-2">{icon}</div>
      <div className="text-6xl font-light tracking-tight">
        {formatTemp(data.temperature, tempUnit)}
      </div>
      <div className="text-lg text-gray-600 dark:text-gray-400 mt-1">
        Sensación {formatTemp(data.feelsLike, tempUnit)}
      </div>
    </div>
  )
}
