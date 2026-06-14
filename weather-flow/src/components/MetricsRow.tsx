import { Droplets, Wind, Gauge, Sun } from 'lucide-react'
import { formatHumidity, formatWind, formatUv, formatPressure } from '../utils/formatters'
import type { CurrentWeather } from '../types/weather'

interface Props {
  data: CurrentWeather
  uvIndex?: number
}

export default function MetricsRow({ data, uvIndex }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2 px-4 py-3">
      <Metric icon={<Droplets size={16} />} label="Humedad" value={formatHumidity(data.humidity)} />
      <Metric icon={<Wind size={16} />} label="Viento" value={formatWind(data.windSpeed)} />
      <Metric icon={<Sun size={16} />} label="UV" value={formatUv(uvIndex ?? 0)} />
      <Metric icon={<Gauge size={16} />} label="Presión" value={formatPressure(data.pressure)} />
    </div>
  )
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
      <span className="text-gray-500 dark:text-gray-400">{icon}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
