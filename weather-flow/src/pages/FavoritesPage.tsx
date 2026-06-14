import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { useActiveCity } from '../hooks/useActiveCity'
import { useWeather } from '../hooks/useWeather'
import LocationHeader from '../components/LocationHeader'
import CurrentWeather from '../components/CurrentWeather'
import MetricsRow from '../components/MetricsRow'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { Star, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { favorites, removeFavorite } = useFavorites()
  const { setActiveCity } = useActiveCity()
  const [activeIndex, setActiveIndex] = useState(0)

  function showOnHome(lat: number, lon: number, name: string, country: string) {
    setActiveCity({ latitude: lat, longitude: lon, name, country, source: 'favorite' })
    navigate('/')
  }

  const active = favorites[activeIndex]
  const { data: weather, isLoading } = useWeather(active?.latitude ?? null, active?.longitude ?? null)

  return (
    <div className="min-h-dvh pb-8">
      <LocationHeader name="Favoritos" isFavorite={false} onToggleFavorite={() => {}} showBack />

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60dvh] px-4 text-center">
          <Star size={48} className="text-white/50 mb-4" />
          <p className="text-lg font-medium text-white/80 mb-2">
            Sin favoritos todavía
          </p>
          <p className="text-sm text-white/50 mb-6">
            Agregá ciudades desde la pantalla principal
          </p>
          <button
            onClick={() => navigate('/search')}
            className="px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition-all text-sm font-medium"
          >
            Buscar ciudades
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-none">
            {favorites.map((f, i) => (
              <button
                key={`${f.latitude}-${f.longitude}`}
                onClick={() => {
                  setActiveIndex(i)
                  showOnHome(f.latitude, f.longitude, f.name, f.country)
                }}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm transition-all ${
                  i === activeIndex
                    ? 'bg-white/30 text-white font-medium'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {isLoading ? (
            <LoadingSkeleton />
          ) : weather ? (
            <div>
              <CurrentWeather
                data={weather.current}
                locationName={weather.locationName}
              />
              <MetricsRow
                data={weather.current}
                uvIndex={weather.hourly[0]?.uvIndex}
                precipitation={weather.current.precipitation}
                precipProbability={weather.hourly[0]?.precipitationProbability}
              />
            </div>
          ) : null}

          <div className="px-4 mt-4">
            <button
              onClick={() => removeFavorite(active.latitude, active.longitude)}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 size={16} />
              Eliminar {active.name} de favoritos
            </button>
          </div>
        </>
      )}
    </div>
  )
}
