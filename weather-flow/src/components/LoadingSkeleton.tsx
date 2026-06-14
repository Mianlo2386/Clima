export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse px-4 py-6 space-y-6">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-white/10" />
        <div className="w-24 h-10 rounded bg-gray-200 dark:bg-white/10" />
        <div className="w-40 h-4 rounded bg-gray-200 dark:bg-white/10" />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-gray-200 dark:bg-white/10" />
        ))}
      </div>
      <div className="flex gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-16 h-24 rounded-2xl bg-gray-200 dark:bg-white/10" />
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 rounded-2xl bg-gray-200 dark:bg-white/10" />
        ))}
      </div>
    </div>
  )
}
