import { z } from 'zod'
export const CRAFT_ENUM = ['Cuts', 'Color Grading', 'Motion Graphics'] as const
export type CraftType = (typeof CRAFT_ENUM)[number]

export const craftSchema = z.enum(CRAFT_ENUM)

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric and hyphens only')
    .trim(),
  category: z.string().min(1, 'Category is required').trim(),
  location: z.string().optional().default(''),
  craft: z.array(craftSchema).min(1, 'At least one craft must be selected'),
  role: z.string().optional().default('Editor, Colorist, Motion Designer'),
  client: z.string().optional().default(''),
  year: z.coerce.number().int().min(2000).max(2100).default(() => new Date().getFullYear()),
  description: z.string().optional().default(''),
  youtubeId: z.string().min(1, 'YouTube ID is required').trim(),
  thumbnail: z.string().url('Thumbnail must be a valid URL'),
  previewLoopUrl: z.string().optional().or(z.literal('')),
  beforeAfter: z
    .object({
      before: z.string().optional().or(z.literal('')),
      after: z.string().optional().or(z.literal('')),
    })
    .optional(),
  tools: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  order: z.coerce.number().int().optional().default(0),
})

export const updateProjectSchema = createProjectSchema.partial()

export const projectQuerySchema = z.object({
  category: z.string().optional(),
  craft: craftSchema.optional(),
  featured: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
