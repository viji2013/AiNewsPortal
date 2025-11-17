import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface SummaryResult {
  text: string
  tokens: number
  cost: number
}

export class ArticleSummarizer {
  private readonly MODEL = 'gpt-4o-mini'
  private readonly MAX_RETRIES = 3
  private readonly COST_PER_1K_INPUT = 0.00015 // $0.15 per 1M tokens
  private readonly COST_PER_1K_OUTPUT = 0.0006 // $0.60 per 1M tokens

  /**
   * Summarize article content using OpenAI
   */
  async summarizeArticle(content: string): Promise<SummaryResult> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const response = await openai.chat.completions.create({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content:
                'You are an AI news summarizer. Create concise, informative summaries of AI-related articles. ' +
                'Focus on key facts, developments, and implications. Keep summaries between 150-200 words. ' +
                'Use clear, professional language suitable for a tech-savvy audience.',
            },
            {
              role: 'user',
              content: `Summarize this article:\n\n${content.slice(0, 4000)}`,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        })

        const summary = response.choices[0]?.message?.content || ''
        const usage = response.usage

        if (!summary) {
          throw new Error('Empty summary received from OpenAI')
        }

        return {
          text: summary,
          tokens: usage?.total_tokens || 0,
          cost: this.calculateCost(
            usage?.prompt_tokens || 0,
            usage?.completion_tokens || 0
          ),
        }
      } catch (error) {
        lastError = error as Error
        console.error(`Summarization attempt ${attempt} failed:`, error)

        if (attempt < this.MAX_RETRIES) {
          // Exponential backoff
          await this.sleep(Math.pow(2, attempt) * 1000)
        }
      }
    }

    throw new Error(
      `Failed to summarize after ${this.MAX_RETRIES} attempts: ${lastError?.message}`
    )
  }

  /**
   * Calculate cost based on token usage
   */
  private calculateCost(inputTokens: number, outputTokens: number): number {
    const inputCost = (inputTokens / 1000) * this.COST_PER_1K_INPUT
    const outputCost = (outputTokens / 1000) * this.COST_PER_1K_OUTPUT
    return inputCost + outputCost
  }

  /**
   * Sleep utility for retry backoff
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
