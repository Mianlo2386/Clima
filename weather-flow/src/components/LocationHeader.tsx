import { Link } from 'react-router-dom'
import { Star, Settings, Search, ArrowLeft, RefreshCw } from 'lucide-react'

interface Props {
  name: string
  isFavorite: boolean
  onToggleFavorite: () => void
  showBack?: boolean
  onRefresh?: () => void
}

export default function LocationHeader({ name, isFavorite, onToggleFavorite, showBack, onRefresh }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        {showBack && (
          <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeft size={20} />
          </Link>
        )}
        <h1 className="text-lg font-semibold truncate">{name}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onToggleFavorite} className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors">
          <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'text-yellow-500' : ''} />
        </button>
        <Link to="/search" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <Search size={20} />
        </Link>
        <Link to="/settings" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <Settings size={20} />
        </Link>
        {onRefresh && (
          <button onClick={onRefresh} className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
            <RefreshCw size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
