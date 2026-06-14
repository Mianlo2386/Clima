export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse px-4 py-6 space-y-6">
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="w-24 h-10 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="w-32 h-4 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
      <div className="flex gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-14 h-20 rounded-lg bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    </div>
  )
}
