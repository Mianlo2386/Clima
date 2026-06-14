export function formatTemp(temp: number, unit: 'C' | 'F' = 'C'): string {
  const value = unit === 'F' ? temp * 9 / 5 + 32 : temp
  return `${Math.round(value)}°${unit}`
}

export function formatTempRange(min: number, max: number, unit: 'C' | 'F' = 'C'): string {
  return `${formatTemp(min, unit)} / ${formatTemp(max, unit)}`
}

export function formatWind(kmh: number): string {
  return `${Math.round(kmh)} km/h`
}

export function formatHumidity(h: number): string {
  return `${Math.round(h)}%`
}

export function formatUv(uv: number): string {
  return uv.toFixed(1)
}

export function formatPressure(hpa: number): string {
  return `${Math.round(hpa)} hPa`
}

export function formatTime(isoString: string): string {
  const d = new Date(isoString)
  return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

export function formatHour(isoString: string): string {
  const d = new Date(isoString)
  return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function formatDay(isoString: string): string {
  const d = new Date(isoString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (d.toDateString() === today.toDateString()) return 'Hoy'
  if (d.toDateString() === tomorrow.toDateString()) return 'Mañana'

  return d.toLocaleDateString('es-AR', { weekday: 'long' })
}

export function formatDate(isoString: string): string {
  const d = new Date(isoString)
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}
