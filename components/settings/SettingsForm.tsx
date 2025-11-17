'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/Toast'
import { AI_CATEGORIES } from '@/types/database'
import type { Profile } from '@/types/database'
import { updatePreferences } from '@/app/actions/preferences'
import { useRouter } from 'next/navigation'

interface SettingsFormProps {
  profile: Profile | null
  userId: string
}

export function SettingsForm({ profile, userId }: SettingsFormProps) {
  const currentPreferences = profile?.preferences as { categories?: string[] } | null
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentPreferences?.categories || []
  )
  const [saving, setSaving] = useState(false)
  const { showToast, ToastContainer } = useToast()
  const router = useRouter()

  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const handleSelectAll = () => {
    setSelectedCategories(AI_CATEGORIES.map((cat) => cat.value))
  }

  const handleClearAll = () => {
    setSelectedCategories([])
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updatePreferences({ categories: selectedCategories })
      showToast({ message: 'Preferences saved successfully!', type: 'success' })
      router.refresh()
    } catch (error) {
      showToast({ message: 'Failed to save preferences', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Feed Preferences</CardTitle>
          <CardDescription>
            Select the AI categories you're interested in. Your feed will show articles from these categories.
            {selectedCategories.length === 0 && ' Leave empty to see all categories.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={selectedCategories.length === AI_CATEGORIES.length}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={selectedCategories.length === 0}
              >
                Clear All
              </Button>
            </div>

            {/* Category Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AI_CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category.value)
                return (
                  <label
                    key={category.value}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleCategory(category.value)}
                      className="w-5 h-5 rounded border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                    />
                    <div>
                      <div className="font-medium text-white">{category.label}</div>
                      <div className="text-sm text-slate-400">{category.value.toUpperCase()}</div>
                    </div>
                  </label>
                )
              })}
            </div>

            {/* Selected Count */}
            <div className="text-sm text-slate-400">
              {selectedCategories.length === 0
                ? 'All categories will be shown'
                : `${selectedCategories.length} ${
                    selectedCategories.length === 1 ? 'category' : 'categories'
                  } selected`}
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ToastContainer />
    </>
  )
}
