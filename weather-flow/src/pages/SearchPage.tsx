import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin } from 'lucide-react'
import { useCitySearch } from '../hooks/useGeocoding'
import { useActiveCity } from '../hooks/useActiveCity'
import { useFavorites } from '../hooks/useFavorites'
import LocationHeader from '../components/LocationHeader'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { data: results, isLoading } = useCitySearch(query)
  const { setActiveCity } = useActiveCity()
  const { favorites } = useFavorites()

  function selectCity(name: string, country: string, latitude: number, longitude: number) {
    setActiveCity({ latitude, longitude, name, country, source: 'manual' })
    navigate('/')
  }

  return (
    <div className="pb-8">
      <LocationHeader
        name="Buscar ciudad"
        isFavorite={false}
        onToggleFavorite={() => {}}
        showBack
      />

      <div className="px-4 py-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: Buenos Aires, London..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            autoFocus
          />
        </div>
      </div>

      {query.length === 0 && favorites.length > 0 && (
        <div className="px-4">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Favoritos</h2>
          <div className="space-y-2">
            {favorites.map((f) => (
              <button
                key={`${f.latitude}-${f.longitude}`}
                onClick={() => selectCity(f.name, f.country, f.latitude, f.longitude)}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <MapPin size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium">{f.name}</p>
                  <p className="text-xs text-gray-400">{f.country}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="px-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      )}

      {results && results.length > 0 && (
        <div className="px-4 space-y-2">
          {results.map((r) => (
            <button
              key={`${r.latitude}-${r.longitude}`}
              onClick={() => selectCity(r.name, r.country, r.latitude, r.longitude)}
              className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <MapPin size={18} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-gray-400">{r.admin1 ? `${r.admin1}, ` : ''}{r.country}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {results && results.length === 0 && query.length >= 2 && (
        <p className="text-center text-sm text-gray-400 mt-8">No se encontraron ciudades</p>
      )}
    </div>
  )
}
