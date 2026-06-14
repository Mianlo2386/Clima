import { useEffect } from 'react'
import { useGeolocation } from '../hooks/useGeolocation'
import { useActiveCity } from '../hooks/useActiveCity'
import { useWeather } from '../hooks/useWeather'
import { useFavorites } from '../hooks/useFavorites'
import LocationHeader from '../components/LocationHeader'
import CurrentWeather from '../components/CurrentWeather'
import MetricsRow from '../components/MetricsRow'
import HourlyForecast from '../components/HourlyForecast'
import DailyForecast from '../components/DailyForecast'
import AirQualityCard from '../components/AirQualityCard'
import AlertBanner from '../components/AlertBanner'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorView from '../components/ErrorView'
import AnimatedBackground from '../components/AnimatedBackground'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'

export default function HomePage() {
  const { position, error: geoError, loading: geoLoading } = useGeolocation()
  const { activeCity, clearActiveCity } = useActiveCity()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()

  const coords = activeCity ?? position

  useEffect(() => {
    if (position && !activeCity) {
      clearActiveCity()
    }
  }, [position, activeCity, clearActiveCity])

  const { data: weather, isLoading, isError, refetch } = useWeather(coords?.latitude ?? null, coords?.longitude ?? null)

  const showGpsPrompt = geoError && !position && !activeCity

  if ((geoLoading || isLoading) && !weather) return <LoadingSkeleton />

  if (showGpsPrompt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-4 text-center">
        <MapPin size={48} className="text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
          Activá el GPS para ver el clima
        </p>
        <p className="text-sm text-gray-400 mb-6">
          O buscá una ciudad manualmente
        </p>
        <Link
          to="/search"
          className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          Buscar ciudad
        </Link>
      </div>
    )
  }

  if (isError && !weather) return <ErrorView message="No se pudieron cargar los datos del clima" onRetry={() => refetch()} />

  if (!weather) return <LoadingSkeleton />

  const lat = coords!.latitude
  const lon = coords!.longitude
  const fav = isFavorite(lat, lon)
  const uvIndex = weather.hourly[0]?.uvIndex

  return (
    <div className="pb-8 relative">
      <AnimatedBackground condition={weather.current.condition} isDay={weather.current.isDay} />
      <LocationHeader
        name={weather.locationName}
        isFavorite={fav}
        onToggleFavorite={() => fav ? removeFavorite(lat, lon) : addFavorite({ name: weather.locationName, country: '', latitude: lat, longitude: lon, countryCode: '' })}
        onRefresh={() => refetch()}
      />
      <CurrentWeather data={weather.current} />
      <MetricsRow data={weather.current} uvIndex={uvIndex} />
      <HourlyForecast data={weather.hourly} />
      <DailyForecast data={weather.daily} />
      {weather.airQuality && <AirQualityCard data={weather.airQuality} />}
      <AlertBanner alerts={weather.alerts} />
    </div>
  )
}
