import { z } from 'zod'

export const PROJECT_TYPES = [
  'Narrative Film',
  'Commercial / Travel',
  'Music Video',
  'Color Grading',
  'Motion Graphics',
  'Documentary',
  'Other',
] as const

export const BUDGET_RANGES = [
  '< $1,000',
  '$1,000 - $3,000',
  '$3,000 - $5,000',
  '$5,000+',
  'Flexible',
] as const

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(150, 'Email cannot exceed 150 characters'),
  projectType: z
    .string()
    .trim()
    .min(1, 'Please select a project type'),
  budgetRange: z
    .string()
    .trim()
    .min(1, 'Please select a budget range'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message cannot exceed 2000 characters'),
  /** Honeypot anti-spam field: Must remain empty for legitimate human submissions */
  honeypot: z.string().optional(),
  /** Test hook for simulated email failure */
  simulateEmailFailure: z.boolean().optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
