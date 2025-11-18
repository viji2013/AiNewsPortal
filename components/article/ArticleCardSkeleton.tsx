export function ArticleCardSkeleton() {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6 last:border-b-0 animate-pulse">
      {/* Standard Image skeleton - Reuters style - 16:9 with fixed height */}
      <div className="relative w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 mb-4" />
      
      {/* Content skeleton */}
      <div className="space-y-3">
        {/* Category & Meta */}
        <div className="flex items-center gap-3">
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
        
        {/* Headline - Standard size (text-lg/xl) */}
        <div className="space-y-2">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
        </div>
        
        {/* Summary - 2 lines (text-sm) */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
        </div>
        
        {/* Actions bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="flex items-center gap-2">
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
