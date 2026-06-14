import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { useActiveCity } from '../hooks/useActiveCity'
import { useWeather } from '../hooks/useWeather'
import { useSettings } from '../hooks/useSettings'
import LocationHeader from '../components/LocationHeader'
import CurrentWeather from '../components/CurrentWeather'
import MetricsRow from '../components/MetricsRow'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { Star, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { favorites, removeFavorite } = useFavorites()
  const { setActiveCity } = useActiveCity()
  const { tempUnit } = useSettings()
  const [activeIndex, setActiveIndex] = useState(0)

  function showOnHome(lat: number, lon: number, name: string, country: string) {
    setActiveCity({ latitude: lat, longitude: lon, name, country, source: 'favorite' })
    navigate('/')
  }

  const active = favorites[activeIndex]
  const { data: weather, isLoading } = useWeather(active?.latitude ?? null, active?.longitude ?? null)

  return (
    <div className="pb-8">
      <LocationHeader name="Favoritos" isFavorite={false} onToggleFavorite={() => {}} showBack />

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60dvh] px-4 text-center">
          <Star size={48} className="text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            Sin favoritos todavía
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Agregá ciudades desde la pantalla principal
          </p>
          <Link
            to="/search"
            className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Buscar ciudades
          </Link>
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
                className={`shrink-0 px-3 py-1.5 rounded-full text-sm transition-colors ${
                  i === activeIndex
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
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
              <CurrentWeather data={weather.current} />
              <MetricsRow data={weather.current} />
            </div>
          ) : null}

          <div className="px-4 mt-4">
            <button
              onClick={() => removeFavorite(active.latitude, active.longitude)}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"
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
