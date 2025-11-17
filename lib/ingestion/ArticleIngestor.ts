import { createClient } from '@supabase/supabase-js'
import type { Source } from '@/types/database'
import Parser from 'rss-parser'

interface RawArticle {
  title: string
  content: string
  url: string
  publishedAt: Date
  imageUrl?: string
}

export class ArticleIngestor {
  private supabase
  private rssParser: Parser

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    this.rssParser = new Parser()
  }

  /**
   * Fetch articles from a source based on its type
   */
  async fetchArticles(source: Source): Promise<RawArticle[]> {
    try {
      if (source.type === 'rss') {
        return await this.fetchFromRSS(source)
      } else if (source.type === 'api') {
        return await this.fetchFromAPI(source)
      }
      return []
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error)
      return []
    }
  }

  /**
   * Fetch articles from RSS feed
   */
  private async fetchFromRSS(source: Source): Promise<RawArticle[]> {
    if (!source.api_url) return []

    const feed = await this.rssParser.parseURL(source.api_url)
    const articles: RawArticle[] = []

    for (const item of feed.items.slice(0, 10)) {
      if (!item.title || !item.link) continue

      articles.push({
        title: item.title,
        content: item.contentSnippet || item.content || item.summary || '',
        url: item.link,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        imageUrl: item.enclosure?.url || undefined,
      })
    }

    return articles
  }

  /**
   * Fetch articles from API endpoint
   */
  private async fetchFromAPI(source: Source): Promise<RawArticle[]> {
    if (!source.api_url) return []

    const response = await fetch(source.api_url)
    if (!response.ok) return []

    const data = await response.json()
    
    // Adapt based on API structure - this is a generic example
    return data.articles?.map((article: any) => ({
      title: article.title,
      content: article.description || article.content || '',
      url: article.url,
      publishedAt: new Date(article.publishedAt || article.date),
      imageUrl: article.image || article.urlToImage,
    })) || []
  }

  /**
   * Check if article already exists by URL
   */
  async checkDuplicate(url: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('news_articles')
      .select('id')
      .eq('url', url)
      .single()

    return !error && !!data
  }

  /**
   * Categorize article based on content
   */
  categorize(article: RawArticle): string {
    const text = `${article.title} ${article.content}`.toLowerCase()

    // Simple keyword-based categorization
    if (text.match(/\b(gpt|llm|language model|chatgpt|claude|gemini|transformer)\b/i)) {
      return 'llms'
    }
    if (text.match(/\b(computer vision|cv|image recognition|object detection|yolo|segmentation)\b/i)) {
      return 'cv'
    }
    if (text.match(/\b(agi|artificial general intelligence|superintelligence)\b/i)) {
      return 'agi'
    }
    if (text.match(/\b(robot|robotics|autonomous|drone)\b/i)) {
      return 'robotics'
    }
    if (text.match(/\b(agent|autonomous agent|multi-agent|agentic)\b/i)) {
      return 'agents'
    }
    if (text.match(/\b(nlp|natural language processing|sentiment analysis|text classification)\b/i)) {
      return 'nlp'
    }

    // Default to machine learning
    return 'ml'
  }

  /**
   * Insert article into database
   */
  async insertArticle(article: {
    title: string
    summary: string
    category: string
    source: string
    url: string
    image_url?: string
    published_at: Date
  }): Promise<number | null> {
    const { data, error } = await this.supabase
      .from('news_articles')
      .insert({
        title: article.title,
        summary: article.summary,
        category: article.category,
        source: article.source,
        url: article.url,
        image_url: article.image_url || null,
        published_at: article.published_at.toISOString(),
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error inserting article:', error)
      return null
    }

    return data.id
  }
}
