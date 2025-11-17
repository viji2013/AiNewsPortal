'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/Toast'
import type { Collection } from '@/types/database'
import { createCollection, deleteCollection } from '@/app/actions/collections'
import { useRouter } from 'next/navigation'

interface CollectionsListProps {
  initialCollections: Collection[]
  userId: string
}

export function CollectionsList({ initialCollections, userId }: CollectionsListProps) {
  const [collections, setCollections] = useState(initialCollections)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const { showToast, ToastContainer } = useToast()
  const router = useRouter()

  const handleDelete = async (collectionId: number) => {
    if (!confirm('Are you sure you want to delete this collection?')) return

    setIsDeleting(collectionId)
    try {
      await deleteCollection(collectionId)
      setCollections((prev) => prev.filter((c) => c.id !== collectionId))
      showToast({ message: 'Collection deleted', type: 'success' })
      router.refresh()
    } catch (error) {
      showToast({ message: 'Failed to delete collection', type: 'error' })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <>
      <div className="mb-6">
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Collection
        </Button>
      </div>

      {collections.length === 0 ? (
        <div className="py-16">
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto text-slate-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-white mb-2">No collections yet</h2>
            <p className="text-slate-400 mb-6">
              Create collections to organize your saved articles
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Your First Collection
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Card key={collection.id} className="group">
              <CardHeader>
                <CardTitle>{collection.name}</CardTitle>
                {collection.description && (
                  <CardDescription>{collection.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/collections/${collection.id}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View Articles →
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(collection.id)}
                    disabled={isDeleting === collection.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newCollection) => {
          setCollections((prev) => [newCollection, ...prev])
          setIsCreateModalOpen(false)
          showToast({ message: 'Collection created', type: 'success' })
        }}
      />

      <ToastContainer />
    </>
  )
}

interface CreateCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (collection: Collection) => void
}

function CreateCollectionModal({ isOpen, onClose, onSuccess }: CreateCollectionModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const collection = await createCollection({ name, description: description || null })
      onSuccess(collection)
      setName('')
      setDescription('')
    } catch (err) {
      setError('Failed to create collection')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Collection"
      description="Organize your articles into a new collection"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Collection Name *
          </label>
          <Input
            id="name"
            type="text"
            placeholder="e.g., Machine Learning Papers"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Description (optional)
          </label>
          <textarea
            id="description"
            placeholder="Describe what this collection is about..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border bg-slate-900/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-slate-600"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !name.trim()} className="flex-1">
            {loading ? 'Creating...' : 'Create Collection'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
