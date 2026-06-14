import { Droplets, Wind, Gauge, Sun, CloudRain } from 'lucide-react'
import { formatHumidity, formatWind, formatUv, formatPressure } from '../utils/formatters'
import type { CurrentWeather } from '../types/weather'

interface Props {
  data: CurrentWeather
  uvIndex?: number
  precipProbability?: number
}

export default function MetricsRow({ data, uvIndex, precipProbability }: Props) {
  const precipLabel = precipProbability != null
    ? `${precipProbability}%`
    : data.precipitation != null
      ? `${data.precipitation.toFixed(1)} mm`
      : '—'

  return (
    <div className="grid grid-cols-5 gap-2 px-4 py-3">
      <Metric icon={<Droplets size={16} />} label="Humedad" value={formatHumidity(data.humidity)} />
      <Metric icon={<CloudRain size={16} />} label="Lluvia" value={precipLabel} />
      <Metric icon={<Wind size={16} />} label="Viento" value={formatWind(data.windSpeed)} />
      <Metric icon={<Sun size={16} />} label="UV" value={formatUv(uvIndex ?? 0)} />
      <Metric icon={<Gauge size={16} />} label="Presión" value={formatPressure(data.pressure)} />
    </div>
  )
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-md border border-gray-200/60 dark:border-white/10">
      <span className="text-gray-500 dark:text-white/60">{icon}</span>
      <span className="text-[10px] text-gray-400 dark:text-white/50 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  )
}
