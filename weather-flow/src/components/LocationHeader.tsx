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
    <div className="flex items-center justify-between px-4 py-4">
      <div className="flex items-center gap-2">
        {showBack && (
          <Link to="/" className="text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
        )}
        <h1 className="text-base font-medium text-white/80 truncate">{name}</h1>
      </div>
      <div className="flex items-center gap-2.5">
        <button onClick={onToggleFavorite} className="text-white/60 hover:text-yellow-400 transition-colors">
          <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'text-yellow-400' : ''} />
        </button>
        <Link to="/search" className="text-white/60 hover:text-white transition-colors">
          <Search size={18} />
        </Link>
        <Link to="/settings" className="text-white/60 hover:text-white transition-colors">
          <Settings size={18} />
        </Link>
        {onRefresh && (
          <button onClick={onRefresh} className="text-white/60 hover:text-blue-400 transition-colors">
            <RefreshCw size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
