import type { Article } from '@/types/database'

/**
 * Deduplicates articles based on their image URLs.
 * Ensures only one article per unique image is returned.
 * Articles with null/undefined image_url are treated as unique and kept.
 * 
 * @param articles - Array of articles to deduplicate
 * @returns Array of unique articles (first occurrence of each image URL)
 */
export function deduplicateArticles(articles: Article[]): Article[] {
  const seenImages = new Set<string>()
  
  return articles.filter(article => {
    // Treat null/undefined images as unique - keep them
    if (!article.image_url) {
      return true
    }
    
    // Check if we've seen this image URL before
    if (seenImages.has(article.image_url)) {
      return false
    }
    
    // First time seeing this image - add to set and keep article
    seenImages.add(article.image_url)
    return true
  })
}
