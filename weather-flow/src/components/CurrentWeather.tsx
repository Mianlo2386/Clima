import { getWeatherIcon, getWmoInfo } from '../utils/wmoConditions'
import { formatTemp } from '../utils/formatters'
import type { CurrentWeather as CurrentWeatherType, WeatherCondition } from '../types/weather'
import { useSettings } from '../hooks/useSettings'

interface Props {
  data: CurrentWeatherType
  locationName: string
  conditionLabel?: string
}

export default function CurrentWeather({ data, locationName, conditionLabel }: Props) {
  const { tempUnit } = useSettings()
  const icon = getWeatherIcon(data.weatherCode, data.isDay)
  const label = conditionLabel ?? getWmoInfo(data.weatherCode).label

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <span className="text-sm font-medium text-white/80 tracking-wide uppercase">{locationName}</span>
      <div className="text-7xl my-2 drop-shadow-lg">{icon}</div>
      <div className="text-7xl font-thin tracking-tight text-white">
        {formatTemp(data.temperature, tempUnit)}
      </div>
      <div className="text-base text-white/70 mt-2">
        {label} — Sensación {formatTemp(data.feelsLike, tempUnit)}
      </div>
    </div>
  )
}
