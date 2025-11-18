export function ArticleCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md animate-pulse">
      {/* InShorts-Style Image skeleton - Larger */}
      <div className="relative w-full h-56 sm:h-64 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700">
        {/* Category badge skeleton */}
        <div className="absolute top-4 left-4">
          <div className="h-7 w-16 bg-slate-300 dark:bg-slate-600 rounded-full" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-5 sm:p-6 space-y-3">
        {/* Meta */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
        
        {/* Headline - Larger (text-xl/2xl) */}
        <div className="space-y-2.5">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
        </div>
        
        {/* Summary - 3 lines */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
        </div>
        
        {/* Actions bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="flex items-center gap-1">
            <div className="h-9 w-9 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="h-9 w-9 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ArticleFeedSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {Array.from({ length: count }).map((_, i) => (
          <ArticleCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    </div>
  )
}
