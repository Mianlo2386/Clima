import type { WeatherCondition } from '../../../types/weather'

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  rotation: number
  rotationSpeed: number
  swayOffset: number
  swaySpeed: number
}

export type ParticleMode = 'drizzle' | 'rain' | 'heavy_rain' | 'freezing_drizzle' | 'freezing_rain' | 'snow' | 'heavy_snow' | 'snow_grains' | 'hail'

export interface ParticleConfig {
  count: number
  speed: [number, number]
  size: [number, number]
  opacity: [number, number]
  color: string
  windInfluence: number
  sway: boolean
  isRound: boolean
}

const DRIZZLE: ParticleConfig = { count: 40, speed: [80, 120], size: [1, 2], opacity: [0.3, 0.6], color: '180, 200, 220', windInfluence: 0.3, sway: false, isRound: false }
const RAIN: ParticleConfig = { count: 150, speed: [200, 350], size: [1, 3], opacity: [0.4, 0.7], color: '180, 200, 220', windInfluence: 0.5, sway: false, isRound: false }
const HEAVY_RAIN: ParticleConfig = { count: 300, speed: [300, 500], size: [2, 4], opacity: [0.5, 0.8], color: '180, 200, 220', windInfluence: 0.6, sway: false, isRound: false }
const FREEZING_DRIZZLE: ParticleConfig = { count: 40, speed: [80, 120], size: [1, 2], opacity: [0.4, 0.7], color: '200, 220, 255', windInfluence: 0.2, sway: false, isRound: false }
const FREEZING_RAIN: ParticleConfig = { count: 150, speed: [200, 350], size: [1, 3], opacity: [0.5, 0.8], color: '200, 220, 255', windInfluence: 0.4, sway: false, isRound: false }
const SNOW: ParticleConfig = { count: 100, speed: [40, 80], size: [3, 6], opacity: [0.4, 0.8], color: '255, 255, 255', windInfluence: 0.7, sway: true, isRound: true }
const HEAVY_SNOW: ParticleConfig = { count: 200, speed: [60, 120], size: [3, 6], opacity: [0.5, 0.9], color: '255, 255, 255', windInfluence: 1.0, sway: true, isRound: true }
const SNOW_GRAINS: ParticleConfig = { count: 80, speed: [60, 100], size: [1, 2], opacity: [0.3, 0.6], color: '220, 230, 240', windInfluence: 0.4, sway: false, isRound: true }
const HAIL: ParticleConfig = { count: 50, speed: [350, 550], size: [4, 8], opacity: [0.6, 0.9], color: '200, 210, 230', windInfluence: 0.1, sway: false, isRound: true }

export const PARTICLE_CONFIGS: Record<ParticleMode, ParticleConfig> = {
  drizzle: DRIZZLE,
  rain: RAIN,
  heavy_rain: HEAVY_RAIN,
  freezing_drizzle: FREEZING_DRIZZLE,
  freezing_rain: FREEZING_RAIN,
  snow: SNOW,
  heavy_snow: HEAVY_SNOW,
  snow_grains: SNOW_GRAINS,
  hail: HAIL,
}

export function getParticleMode(condition: WeatherCondition): ParticleMode | null {
  switch (condition) {
    case 'drizzle': return 'drizzle'
    case 'rain': return 'rain'
    case 'heavy_rain': return 'heavy_rain'
    case 'freezing_drizzle': return 'freezing_drizzle'
    case 'freezing_rain': return 'freezing_rain'
    case 'snow': return 'snow'
    case 'heavy_snow': return 'heavy_snow'
    case 'snow_grains': return 'snow_grains'
    case 'hail_thunderstorm': return 'hail'
    default: return null
  }
}
