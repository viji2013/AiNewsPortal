import { z } from 'zod'

export const articleSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title must be less than 200 characters'),
  summary: z.string().min(50, 'Summary must be at least 50 characters').max(500, 'Summary must be less than 500 characters'),
  category: z.enum(['llms', 'cv', 'ml', 'agi', 'robotics', 'agents', 'nlp']),
  source: z.string().optional(),
  url: z.string().url('Must be a valid URL').optional(),
  image_url: z.string().url('Must be a valid URL').optional().nullable(),
})

export const collectionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().nullable(),
})

export const sourceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(['api', 'rss', 'custom']),
  api_url: z.string().url('Must be a valid URL').optional().nullable(),
  is_active: z.boolean().default(true),
})

export const categoryPreferencesSchema = z.object({
  categories: z.array(z.enum(['llms', 'cv', 'ml', 'agi', 'robotics', 'agents', 'nlp'])),
})
