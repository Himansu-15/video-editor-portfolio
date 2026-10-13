'use client'

import { useState, useEffect, useCallback } from 'react'

export interface ProjectItem {
  _id: string
  title: string
  slug: string
  category: string
  location?: string
  craft: string[]
  role?: string
  client?: string
  year: number
  description?: string
  youtubeId: string
  thumbnail: string
  previewLoopUrl?: string
  beforeAfter?: {
    before?: string
    after?: string
  }
  tools?: string[]
  featured?: boolean
  order?: number
}

interface UseProjectsOptions {
  category?: string
  craft?: string
  featured?: boolean
  /** When true, simulates a failed request for testing error UI states */
  simulateError?: boolean
}

interface UseProjectsResult {
  projects: ProjectItem[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useProjects(options: UseProjectsOptions = {}): UseProjectsResult {
  const { category, craft, featured, simulateError } = options
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (simulateError) {
      setTimeout(() => {
        setError('Simulated network error: Failed to retrieve projects.')
        setLoading(false)
      }, 500)
      return
    }

    try {
      const params = new URLSearchParams()
      if (category && category !== 'All') params.set('category', category)
      if (craft && craft !== 'All') {
        // Map short craft names back to backend values if needed
        let backendCraft = craft
        if (craft === 'Color') backendCraft = 'Color Grading'
        if (craft === 'Motion') backendCraft = 'Motion Graphics'
        params.set('craft', backendCraft)
      }
      if (typeof featured === 'boolean') params.set('featured', String(featured))

      const url = `/api/projects${params.toString() ? `?${params.toString()}` : ''}`
      const res = await fetch(url)

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`)
      }

      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setProjects(json.data)
      } else {
        throw new Error(json.error?.message || 'Invalid projects payload')
      }
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to database. Please check your connection and try again.'
      )
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [category, craft, featured, simulateError])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
  }
}
