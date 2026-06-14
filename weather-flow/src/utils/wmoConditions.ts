import type { WmoCode, WeatherCondition } from '../types/weather'

export interface WmoInfo {
  condition: WeatherCondition
  label: string
  icon: string
}

const wmoMap: Record<number, WmoInfo> = {
  0:  { condition: 'clear',           label: 'Cielo despejado',       icon: '☀️' },
  1:  { condition: 'mostly_clear',    label: 'Mayormente despejado',  icon: '🌤' },
  2:  { condition: 'partly_cloudy',   label: 'Parcialmente nublado',  icon: '⛅' },
  3:  { condition: 'cloudy',          label: 'Nublado',               icon: '☁️' },
  45: { condition: 'foggy',           label: 'Niebla / Neblina',      icon: '🌫' },
  48: { condition: 'foggy',           label: 'Niebla / Neblina',      icon: '🌫' },
  51: { condition: 'drizzle',         label: 'Llovizna',              icon: '🌦' },
  53: { condition: 'drizzle',         label: 'Llovizna',              icon: '🌦' },
  55: { condition: 'drizzle',         label: 'Llovizna',              icon: '🌦' },
  56: { condition: 'freezing_drizzle',label: 'Llovizna helada',       icon: '🌦❄️' },
  57: { condition: 'freezing_drizzle',label: 'Llovizna helada',       icon: '🌦❄️' },
  61: { condition: 'rain',            label: 'Lluvia',                icon: '🌧' },
  63: { condition: 'rain',            label: 'Lluvia',                icon: '🌧' },
  65: { condition: 'rain',            label: 'Lluvia',                icon: '🌧' },
  66: { condition: 'freezing_rain',   label: 'Lluvia helada',         icon: '🌧❄️' },
  67: { condition: 'freezing_rain',   label: 'Lluvia helada',         icon: '🌧❄️' },
  71: { condition: 'snow',            label: 'Nieve',                 icon: '❄️' },
  73: { condition: 'snow',            label: 'Nieve',                 icon: '❄️' },
  75: { condition: 'snow',            label: 'Nieve',                 icon: '❄️' },
  77: { condition: 'snow_grains',     label: 'Granizo',               icon: '🌨' },
  80: { condition: 'heavy_rain',      label: 'Lluvia intensa',        icon: '🌧' },
  81: { condition: 'heavy_rain',      label: 'Lluvia intensa',        icon: '🌧' },
  82: { condition: 'heavy_rain',      label: 'Lluvia intensa',        icon: '🌧' },
  85: { condition: 'heavy_snow',      label: 'Nevada intensa',        icon: '❄️' },
  86: { condition: 'heavy_snow',      label: 'Nevada intensa',        icon: '❄️' },
  95: { condition: 'thunderstorm',    label: 'Tormenta eléctrica',    icon: '⛈' },
  96: { condition: 'hail_thunderstorm',label: 'Tormenta con granizo', icon: '⛈🧊' },
  99: { condition: 'hail_thunderstorm',label: 'Tormenta con granizo', icon: '⛈🧊' },
}

export function getWmoInfo(code: WmoCode): WmoInfo {
  return wmoMap[code] ?? { condition: 'cloudy', label: 'Desconocido', icon: '☁️' }
}

export function getWeatherIcon(code: WmoCode, isDay: boolean): string {
  const info = getWmoInfo(code)
  if (code === 0 && !isDay) return '🌙'
  return info.icon
}
