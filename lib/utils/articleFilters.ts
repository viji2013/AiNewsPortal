import type { Article } from '@/types/database'

/**
 * Filter articles by categories
 * @param articles - Array of articles to filter
 * @param categories - Array of category values to filter by
 * @returns Filtered articles matching any of the specified categories
 */
export function filterByCategories(articles: Article[], categories: string[]): Article[] {
  if (!categories || categories.length === 0) {
    return articles
  }
  
  return articles.filter(article => 
    categories.includes(article.category)
  )
}

/**
 * Filter articles by search query
 * Searches across title, summary, source fields (case-insensitive, word boundary matching)
 * @param articles - Array of articles to filter
 * @param query - Search query string
 * @returns Filtered articles matching the search query
 */
export function filterBySearch(articles: Article[], query: string): Article[] {
  if (!query || query.trim() === '') {
    return articles
  }
  
  const searchTerm = query.toLowerCase().trim()
  
  // Create a regex for word boundary matching (more relevant results)
  // \b ensures we match whole words, but still allows partial matches at word boundaries
  const searchRegex = new RegExp(`\\b${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i')
  
  return articles.filter(article => {
    // Search in title (word boundary matching for better relevance)
    if (searchRegex.test(article.title || '')) {
      return true
    }
    
    // Search in summary/description
    if (searchRegex.test(article.summary || '')) {
      return true
    }
    
    // Search in source
    if (searchRegex.test(article.source || '')) {
      return true
    }
    
    // Also do a simple includes check as fallback for partial matches
    const lowerTitle = article.title?.toLowerCase() || ''
    const lowerSummary = article.summary?.toLowerCase() || ''
    const lowerSource = article.source?.toLowerCase() || ''
    
    if (lowerTitle.includes(searchTerm) || 
        lowerSummary.includes(searchTerm) || 
        lowerSource.includes(searchTerm)) {
      return true
    }
    
    return false
  })
}

/**
 * Apply combined filters: category first, then search
 * This is the main filtering pipeline
 * @param articles - Array of articles to filter
 * @param categories - Array of category values to filter by
 * @param searchQuery - Search query string
 * @returns Filtered articles
 */
export function applyFilters(
  articles: Article[],
  categories: string[],
  searchQuery: string
): Article[] {
  // Step 1: Apply category filter
  let filtered = filterByCategories(articles, categories)
  
  // Step 2: Apply search filter on category-filtered results
  filtered = filterBySearch(filtered, searchQuery)
  
  return filtered
}

/**
 * Check if there are any active filters
 * @param categories - Array of category values
 * @param searchQuery - Search query string
 * @returns True if any filters are active
 */
export function hasActiveFilters(categories: string[], searchQuery: string): boolean {
  return (categories && categories.length > 0) || (searchQuery && searchQuery.trim() !== '')
}
