'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface IngestionTriggerProps {
  hasOpenAIKey: boolean
  activeSourcesCount: number
}

export function IngestionTrigger({ hasOpenAIKey, activeSourcesCount }: IngestionTriggerProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTrigger = async () => {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch('/api/ingestion/run?manual=true', {
        method: 'GET',
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || data.message || 'Ingestion failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = !hasOpenAIKey || activeSourcesCount === 0 || loading

  return (
    <div>
      <p className="text-slate-400 mb-4">
        Trigger article ingestion manually. This will fetch articles from all active sources and use OpenAI to summarize them.
      </p>
      
      <Button 
        onClick={handleTrigger}
        disabled={isDisabled}
      >
        {loading ? 'Processing...' : 'Trigger Ingestion'}
      </Button>
      
      <p className="text-xs text-slate-500 mt-2">
        {!hasOpenAIKey && '⚠ OpenAI API key required. '}
        {activeSourcesCount === 0 && '⚠ No active sources configured. '}
        {hasOpenAIKey && activeSourcesCount > 0 && !loading && 'Note: This may take several minutes to complete'}
      </p>

      {/* Success Result */}
      {result && result.success && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-green-400 font-medium mb-2">✓ Ingestion Completed Successfully</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p>Total Ingested: <span className="font-bold">{result.totalIngested}</span></p>
            <p>Total Skipped: <span className="font-bold">{result.totalSkipped}</span></p>
            <p>Timestamp: {new Date(result.timestamp).toLocaleString()}</p>
          </div>
          {result.sources && result.sources.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-medium text-slate-300">Sources:</p>
              {result.sources.map((source: any, idx: number) => (
                <div key={idx} className="text-xs text-slate-400 pl-4">
                  • {source.source}: {source.ingested || 0} ingested, {source.skipped || 0} skipped
                  {source.error && <span className="text-red-400"> (Error: {source.error})</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error Result */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 font-medium mb-1">✗ Ingestion Failed</p>
          <p className="text-sm text-slate-300">{error}</p>
        </div>
      )}
    </div>
  )
}
