import { CloudOff, RefreshCw } from 'lucide-react'

interface Props {
  message?: string
  onRetry?: () => void
}

export default function ErrorView({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60dvh] px-4 text-center">
      <CloudOff size={48} className="text-gray-400 dark:text-white/50 mb-4" />
      <p className="text-lg font-medium text-gray-800 dark:text-white/80 mb-1">
        {message ?? 'No se pudieron cargar los datos'}
      </p>
      <p className="text-sm text-gray-500 dark:text-white/50 mb-4">
        Revisá tu conexión e intentá de nuevo
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 dark:bg-white/20 backdrop-blur-md border border-gray-300/60 dark:border-white/20 text-gray-900 dark:text-white hover:bg-white/90 dark:hover:bg-white/30 transition-all text-sm font-medium"
        >
          <RefreshCw size={16} />
          Reintentar
        </button>
      )}
    </div>
  )
}
