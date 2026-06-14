import { CloudOff, RefreshCw } from 'lucide-react'

interface Props {
  message?: string
  onRetry?: () => void
}

export default function ErrorView({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60dvh] px-4 text-center">
      <CloudOff size={48} className="text-gray-400 mb-4" />
      <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-1">
        {message ?? 'No se pudieron cargar los datos'}
      </p>
      <p className="text-sm text-gray-400 mb-4">
        Revisá tu conexión e intentá de nuevo
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm"
        >
          <RefreshCw size={16} />
          Reintentar
        </button>
      )}
    </div>
  )
}
