import { useQuery } from '@tanstack/react-query'
import { fetchWeather } from '../api/weather.api'
import { fetchAirQuality } from '../api/airQuality.api'
import { fetchAlerts } from '../api/alerts.api'
import { reverseGeocode } from '../api/geocoding.api'
import { getWmoInfo } from '../utils/wmoConditions'
import type { CurrentWeather, HourlyForecast, DailyForecast, AirQuality, WeatherAlert, WeatherData } from '../types/weather'

function computeAqiLevel(europeanAqi: number | null): AirQuality['level'] {
  if (europeanAqi === null) return 'moderate'
  if (europeanAqi <= 20) return 'good'
  if (europeanAqi <= 40) return 'moderate'
  if (europeanAqi <= 60) return 'unhealthy_sensitive'
  if (europeanAqi <= 80) return 'unhealthy'
  if (europeanAqi <= 100) return 'very_unhealthy'
  return 'hazardous'
}

export function useWeather(lat: number | null, lon: number | null) {
  return useQuery<WeatherData>({
    queryKey: ['weather', lat, lon],
    enabled: lat !== null && lon !== null,
    staleTime: 1000 * 60 * 15,
    queryFn: async () => {
      const [forecast, airQuality, alerts, geo] = await Promise.all([
        fetchWeather(lat!, lon!),
        fetchAirQuality(lat!, lon!).catch(() => null),
        fetchAlerts(lat!, lon!).catch(() => null),
        reverseGeocode(lat!, lon!).catch(() => null),
      ])

      const current: CurrentWeather = {
        temperature: forecast.current.temperature_2m,
        feelsLike: forecast.current.apparent_temperature,
        humidity: forecast.current.relative_humidity_2m,
        windSpeed: forecast.current.wind_speed_10m,
        precipitation: forecast.current.precipitation,
        pressure: forecast.current.pressure_msl,
        weatherCode: forecast.current.weather_code,
        condition: getWmoInfo(forecast.current.weather_code).condition,
        isDay: forecast.current.is_day === 1,
      }

      const hourly: HourlyForecast[] = forecast.hourly.time.map((t, i) => ({
        time: t,
        temperature: forecast.hourly.temperature_2m[i],
        precipitationProbability: forecast.hourly.precipitation_probability[i],
        weatherCode: forecast.hourly.weather_code[i],
        condition: getWmoInfo(forecast.hourly.weather_code[i]).condition,
        humidity: forecast.hourly.relative_humidity_2m[i],
        windSpeed: forecast.hourly.wind_speed_10m[i],
        uvIndex: forecast.hourly.uv_index[i],
      }))

      const daily: DailyForecast[] = forecast.daily.time.map((t, i) => ({
        date: t,
        weatherCode: forecast.daily.weather_code[i],
        condition: getWmoInfo(forecast.daily.weather_code[i]).condition,
        tempMax: forecast.daily.temperature_2m_max[i],
        tempMin: forecast.daily.temperature_2m_min[i],
        sunrise: forecast.daily.sunrise[i],
        sunset: forecast.daily.sunset[i],
        uvIndex: forecast.daily.uv_index_max[i],
        precipitationSum: forecast.daily.precipitation_sum[i],
        windSpeedMax: forecast.daily.wind_speed_10m_max[i],
      }))

      const aq: AirQuality | null = airQuality ? {
        europeanAqi: airQuality.current.european_aqi,
        usAqi: airQuality.current.us_aqi,
        pm25: airQuality.current.pm2_5,
        pm10: airQuality.current.pm10,
        ozone: airQuality.current.ozone,
        level: computeAqiLevel(airQuality.current.european_aqi),
      } : null

      const weatherAlerts: WeatherAlert[] = (alerts?.features ?? []).map(f => ({
        event: f.properties.event,
        headline: f.properties.headline,
        description: f.properties.description,
        severity: f.properties.severity,
        start: f.properties.effective,
        end: f.properties.expires,
      }))

      return {
        current,
        hourly,
        daily,
        airQuality: aq,
        alerts: weatherAlerts,
        locationName: geo?.name ?? `${lat?.toFixed(2)}, ${lon?.toFixed(2)}`,
      }
    },
  })
}
