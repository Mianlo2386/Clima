import type { WmoCode } from '../types/weather'

interface OpenMeteoCurrent {
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  weather_code: WmoCode
  wind_speed_10m: number
  precipitation: number
  pressure_msl: number
  is_day: number
}

interface OpenMeteoHourly {
  time: string[]
  temperature_2m: number[]
  precipitation_probability: number[]
  weather_code: WmoCode[]
  relative_humidity_2m: number[]
  wind_speed_10m: number[]
  uv_index: number[]
}

interface OpenMeteoDaily {
  time: string[]
  weather_code: WmoCode[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  sunrise: string[]
  sunset: string[]
  uv_index_max: number[]
  precipitation_sum: number[]
  wind_speed_10m_max: number[]
}

interface ForecastResponse {
  current: OpenMeteoCurrent
  hourly: OpenMeteoHourly
  daily: OpenMeteoDaily
}

export async function fetchWeather(lat: number, lon: number): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation,pressure_msl,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_speed_10m_max',
    hourly: 'temperature_2m,precipitation_probability,weather_code,relative_humidity_2m,wind_speed_10m,uv_index',
    timezone: 'auto',
    forecast_days: '14',
    forecast_hours: '24',
  })

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
  return res.json()
}

export { type ForecastResponse }
