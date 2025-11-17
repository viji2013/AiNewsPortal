'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/Loading'
import type { Article, Collection } from '@/types/database'
import { getCollections, addArticleToCollection } from '@/app/actions/collections'
import { useToast } from '@/components/ui/Toast'

interface AddToCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  article: Article | null
  userId: string
}

export function AddToCollectionModal({
  isOpen,
  onClose,
  article,
  userId,
}: AddToCollectionModalProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState<number | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    if (isOpen && userId) {
      loadCollections()
    }
  }, [isOpen, userId])

  const loadCollections = async () => {
    setLoading(true)
    try {
      const data = await getCollections()
      setCollections(data)
    } catch (error) {
      showToast({ message: 'Failed to load collections', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCollection = async (collectionId: number) => {
    if (!article) return

    setAdding(collectionId)
    try {
      await addArticleToCollection(collectionId, article.id)
      showToast({ message: 'Article added to collection', type: 'success' })
      onClose()
    } catch (error) {
      showToast({ message: 'Failed to add article', type: 'error' })
    } finally {
      setAdding(null)
    }
  }

  if (!article) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add to Collection"
      description={`Add "${article.title}" to a collection`}
    >
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-400 mb-4">You don't have any collections yet</p>
          <Button onClick={() => (window.location.href = '/collections')}>
            Create Collection
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => handleAddToCollection(collection.id)}
              disabled={adding === collection.id}
              className="w-full text-left px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{collection.name}</p>
                  {collection.description && (
                    <p className="text-sm text-slate-400 mt-1">{collection.description}</p>
                  )}
                </div>
                {adding === collection.id && <LoadingSpinner size="sm" />}
              </div>
            </button>
          ))}
        </div>
      )}
    </Modal>
  )
}
