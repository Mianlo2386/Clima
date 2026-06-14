import type { AirQuality } from '../types/weather'

interface Props {
  data: AirQuality
}

const levelLabels: Record<AirQuality['level'], string> = {
  good: 'Buena',
  moderate: 'Moderada',
  unhealthy_sensitive: 'Dañina para grupos sensibles',
  unhealthy: 'Dañina',
  very_unhealthy: 'Muy dañina',
  hazardous: 'Peligrosa',
}

const levelColors: Record<AirQuality['level'], string> = {
  good: 'text-green-500',
  moderate: 'text-yellow-500',
  unhealthy_sensitive: 'text-orange-500',
  unhealthy: 'text-red-500',
  very_unhealthy: 'text-purple-500',
  hazardous: 'text-rose-700',
}

export default function AirQualityCard({ data }: Props) {
  return (
    <div className="px-4 py-3">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Calidad del Aire</h2>
      <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-3xl font-light">{data.europeanAqi ?? '—'}</span>
          <span className={`text-sm font-medium ${levelColors[data.level]}`}>
            {levelLabels[data.level]}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          {data.pm25 !== null && (
            <div>
              <span className="text-gray-500">PM2.5</span>
              <p className="font-medium">{data.pm25.toFixed(1)} µg</p>
            </div>
          )}
          {data.pm10 !== null && (
            <div>
              <span className="text-gray-500">PM10</span>
              <p className="font-medium">{data.pm10.toFixed(1)} µg</p>
            </div>
          )}
          {data.ozone !== null && (
            <div>
              <span className="text-gray-500">Ozono</span>
              <p className="font-medium">{data.ozone.toFixed(1)} µg</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
