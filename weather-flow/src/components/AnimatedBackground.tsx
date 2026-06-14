import { useMemo, useState, useEffect } from 'react'
import type { WeatherCondition } from '../types/weather'

interface Props {
  condition?: WeatherCondition
  isDay: boolean
}

const gradients: Record<WeatherCondition, { day: [string, string, string]; night: [string, string, string] }> = {
  clear: {
    day: ['#1565C0', '#1E88E5', '#64B5F6'],
    night: ['#0D1B2A', '#1B2838', '#1A237E'],
  },
  mostly_clear: {
    day: ['#1E88E5', '#42A5F5', '#90CAF9'],
    night: ['#0D1B2A', '#1B2838', '#1A237E'],
  },
  partly_cloudy: {
    day: ['#546E7A', '#78909C', '#B0BEC5'],
    night: ['#1A1A2E', '#263238', '#37474F'],
  },
  cloudy: {
    day: ['#455A64', '#607D8B', '#90A4AE'],
    night: ['#1A1A2E', '#263238', '#37474F'],
  },
  foggy: {
    day: ['#607D8B', '#78909C', '#B0BEC5'],
    night: ['#263238', '#37474F', '#455A64'],
  },
  drizzle: {
    day: ['#37474F', '#455A64', '#607D8B'],
    night: ['#1A237E', '#283593', '#3949AB'],
  },
  freezing_drizzle: {
    day: ['#37474F', '#455A64', '#607D8B'],
    night: ['#1A237E', '#283593', '#3949AB'],
  },
  rain: {
    day: ['#263238', '#37474F', '#546E7A'],
    night: ['#0D1B2A', '#1A237E', '#283593'],
  },
  freezing_rain: {
    day: ['#263238', '#37474F', '#546E7A'],
    night: ['#0D1B2A', '#1A237E', '#283593'],
  },
  snow: {
    day: ['#B0BEC5', '#CFD8DC', '#ECEFF1'],
    night: ['#1B2838', '#263238', '#37474F'],
  },
  snow_grains: {
    day: ['#B0BEC5', '#CFD8DC', '#ECEFF1'],
    night: ['#1B2838', '#263238', '#37474F'],
  },
  heavy_rain: {
    day: ['#1A1A2E', '#263238', '#37474F'],
    night: ['#0D1B2A', '#1A237E', '#283593'],
  },
  heavy_snow: {
    day: ['#90A4AE', '#B0BEC5', '#CFD8DC'],
    night: ['#1B2838', '#263238', '#37474F'],
  },
  thunderstorm: {
    day: ['#1A1A2E', '#311B92', '#4527A0'],
    night: ['#0D0D1A', '#1A237E', '#283593'],
  },
  hail_thunderstorm: {
    day: ['#1A1A2E', '#311B92', '#4527A0'],
    night: ['#0D0D1A', '#1A237E', '#283593'],
  },
}

function RainDrops() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => {
        const duration = 0.5 + Math.random() * 0.8
        const delay = Math.random() * 2
        return (
          <div
            key={i}
            className="absolute w-[2px] bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              height: `${10 + Math.random() * 20}px`,
              animation: `rain-fall ${duration}s linear ${delay}s infinite`,
            }}
          />
        )
      })}
    </div>
  )
}

function SnowFlakes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => {
        const duration = 3 + Math.random() * 4
        const delay = Math.random() * 5
        return (
          <div
            key={i}
            className="absolute w-[4px] h-[4px] bg-white/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 10}%`,
              opacity: 0.4 + Math.random() * 0.6,
              animation: `snow-fall ${duration}s linear ${delay}s infinite`,
            }}
          />
        )
      })}
    </div>
  )
}

const POSITIONS = [
  { x: 0, y: 50 },
  { x: 100, y: 0 },
  { x: 50, y: 100 },
  { x: 100, y: 50 },
]

export default function AnimatedBackground({ condition, isDay }: Props) {
  const palette = condition ? gradients[condition] : gradients.clear
  const colors = isDay ? palette.day : palette.night

  const { mainGradient, depthGradient } = useMemo(() => {
    const [c1, c2, c3] = colors
    return {
      mainGradient: `linear-gradient(135deg, ${c1} 0%, ${c2} 30%, ${c3} 50%, ${c2} 70%, ${c1} 100%)`,
      depthGradient: `linear-gradient(225deg, ${c3} 0%, ${c2} 30%, ${c1} 50%, ${c2} 70%, ${c3} 100%)`,
    }
  }, [colors])

  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % POSITIONS.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  const pos = POSITIONS[phase]

  const isRainy = condition === 'rain' || condition === 'heavy_rain' || condition === 'drizzle' || condition === 'freezing_drizzle' || condition === 'freezing_rain'
  const isSnowy = condition === 'snow' || condition === 'heavy_snow' || condition === 'snow_grains'

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: mainGradient,
          backgroundSize: '400% 400%',
          backgroundPosition: `${pos.x}% ${pos.y}%`,
          transition: 'background-position 7s ease-in-out',
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: depthGradient,
          backgroundSize: '400% 400%',
          backgroundPosition: `${100 - pos.x}% ${100 - pos.y}%`,
          transition: 'background-position 7s ease-in-out',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.15)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.08)_0%,_transparent_60%)] pointer-events-none" />
      {isRainy && <RainDrops />}
      {isSnowy && <SnowFlakes />}
    </div>
  )
}
