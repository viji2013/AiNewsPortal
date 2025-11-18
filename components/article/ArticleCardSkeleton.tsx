export function ArticleCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md animate-pulse">
      {/* Large Image skeleton - InShorts style */}
      <div className="relative w-full aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700">
        {/* Category badge skeleton */}
        <div className="absolute top-4 left-4">
          <div className="h-6 w-20 bg-slate-300 dark:bg-slate-600 rounded-full" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Meta */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
        
        {/* Title - Large */}
        <div className="space-y-3">
          <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
        </div>
        
        {/* Summary */}
        <div className="space-y-2.5">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
        </div>
        
        {/* Read more link */}
        <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  )
}

export function ArticleFeedSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  )
}
