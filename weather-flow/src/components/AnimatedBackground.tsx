import type { WeatherCondition } from '../types/weather'

interface Props {
  condition?: WeatherCondition
  isDay: boolean
}

const gradients: Record<WeatherCondition, { day: [string, string]; night: [string, string] }> = {
  clear: {
    day: ['#1565C0', '#64B5F6'],
    night: ['#0D1B2A', '#1B2838'],
  },
  mostly_clear: {
    day: ['#1E88E5', '#90CAF9'],
    night: ['#0D1B2A', '#1B2838'],
  },
  partly_cloudy: {
    day: ['#546E7A', '#90A4AE'],
    night: ['#263238', '#37474F'],
  },
  cloudy: {
    day: ['#455A64', '#90A4AE'],
    night: ['#263238', '#37474F'],
  },
  foggy: {
    day: ['#78909C', '#B0BEC5'],
    night: ['#37474F', '#546E7A'],
  },
  drizzle: {
    day: ['#37474F', '#546E7A'],
    night: ['#1A237E', '#283593'],
  },
  freezing_drizzle: {
    day: ['#37474F', '#546E7A'],
    night: ['#1A237E', '#283593'],
  },
  rain: {
    day: ['#37474F', '#546E7A'],
    night: ['#1A237E', '#283593'],
  },
  freezing_rain: {
    day: ['#37474F', '#546E7A'],
    night: ['#1A237E', '#283593'],
  },
  snow: {
    day: ['#ECEFF1', '#B0BEC5'],
    night: ['#263238', '#37474F'],
  },
  snow_grains: {
    day: ['#ECEFF1', '#B0BEC5'],
    night: ['#263238', '#37474F'],
  },
  heavy_rain: {
    day: ['#37474F', '#546E7A'],
    night: ['#1A237E', '#283593'],
  },
  heavy_snow: {
    day: ['#ECEFF1', '#B0BEC5'],
    night: ['#263238', '#37474F'],
  },
  thunderstorm: {
    day: ['#311B92', '#4527A0'],
    night: ['#1A237E', '#283593'],
  },
  hail_thunderstorm: {
    day: ['#311B92', '#4527A0'],
    night: ['#1A237E', '#283593'],
  },
}

export default function AnimatedBackground({ condition, isDay }: Props) {
  const palette = condition ? gradients[condition] : gradients.clear
  const colors = isDay ? palette.day : palette.night
  const gradient = `linear-gradient(180deg, ${colors[0]} 0%, ${colors[1]} 100%)`

  return (
    <div
      className="fixed inset-0 -z-10 transition-all duration-1000 ease-in-out"
      style={{ background: gradient }}
    />
  )
}
