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
  good: 'text-green-400',
  moderate: 'text-yellow-400',
  unhealthy_sensitive: 'text-orange-400',
  unhealthy: 'text-red-400',
  very_unhealthy: 'text-purple-400',
  hazardous: 'text-rose-400',
}

export default function AirQualityCard({ data }: Props) {
  return (
    <div className="px-4 py-3">
      <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-3">Calidad del Aire</h2>
      <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-3xl font-light text-white">{data.europeanAqi ?? '—'}</span>
          <span className={`text-sm font-medium ${levelColors[data.level]}`}>
            {levelLabels[data.level]}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          {data.pm25 !== null && (
            <div>
              <span className="text-white/50">PM2.5</span>
              <p className="font-medium text-white/80">{data.pm25.toFixed(1)} µg</p>
            </div>
          )}
          {data.pm10 !== null && (
            <div>
              <span className="text-white/50">PM10</span>
              <p className="font-medium text-white/80">{data.pm10.toFixed(1)} µg</p>
            </div>
          )}
          {data.ozone !== null && (
            <div>
              <span className="text-white/50">Ozono</span>
              <p className="font-medium text-white/80">{data.ozone.toFixed(1)} µg</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
