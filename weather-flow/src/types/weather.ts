export type WmoCode = 0 | 1 | 2 | 3 | 45 | 48 | 51 | 53 | 55 | 56 | 57 | 61 | 63 | 65 | 66 | 67 | 71 | 73 | 75 | 77 | 80 | 81 | 82 | 85 | 86 | 95 | 96 | 99

export type WeatherCondition = 'clear' | 'mostly_clear' | 'partly_cloudy' | 'cloudy' | 'foggy' | 'drizzle' | 'freezing_drizzle' | 'rain' | 'freezing_rain' | 'snow' | 'snow_grains' | 'heavy_rain' | 'heavy_snow' | 'thunderstorm' | 'hail_thunderstorm'

export interface CurrentWeather {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  precipitation: number
  pressure: number
  weatherCode: WmoCode
  condition: WeatherCondition
  isDay: boolean
}

export interface HourlyForecast {
  time: string
  temperature: number
  precipitationProbability: number
  weatherCode: WmoCode
  condition: WeatherCondition
  humidity: number
  windSpeed: number
  uvIndex: number
}

export interface DailyForecast {
  date: string
  weatherCode: WmoCode
  condition: WeatherCondition
  tempMax: number
  tempMin: number
  sunrise: string
  sunset: string
  uvIndex: number
  precipitationSum: number
  windSpeedMax: number
}

export interface AirQuality {
  europeanAqi: number | null
  usAqi: number | null
  pm25: number | null
  pm10: number | null
  ozone: number | null
  level: 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous'
}

export interface WeatherAlert {
  event: string
  headline: string
  description: string
  severity: 'minor' | 'moderate' | 'severe' | 'extreme'
  start: string
  end: string
}

export interface WeatherData {
  current: CurrentWeather
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  airQuality: AirQuality | null
  alerts: WeatherAlert[]
  locationName: string
}

export interface FavoriteCity {
  name: string
  country: string
  latitude: number
  longitude: number
  countryCode: string
}

export interface GeocodingResult {
  name: string
  country: string
  latitude: number
  longitude: number
  countryCode: string
  admin1?: string
}
