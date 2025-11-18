export function ArticleCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-video bg-slate-200 dark:bg-slate-700" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Meta */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-3 w-3 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
        </div>
        
        {/* Summary */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="flex gap-1">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  )
}
