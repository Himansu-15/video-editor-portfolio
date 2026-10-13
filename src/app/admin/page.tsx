'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Modal } from '@/components/Modal'
import {
  createProjectSchema,
  CreateProjectInput,
  CRAFT_ENUM,
  CraftType,
} from '@/lib/validations/project'

interface ProjectItem {
  _id: string
  title: string
  slug: string
  category: string
  location?: string
  craft: CraftType[]
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
  featured: boolean
  order: number
  createdAt?: string
  updatedAt?: string
}

interface InquiryItem {
  _id: string
  name: string
  email: string
  projectType: string
  budgetRange: string
  message: string
  emailStatus: 'sent' | 'skipped' | 'failed'
  emailError?: string
  createdAt: string
}

interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  text: string
}

interface FormDataState {
  title: string
  slug: string
  category: string
  location: string
  craft: CraftType[]
  role: string
  client: string
  year: number
  description: string
  youtubeId: string
  thumbnail: string
  previewLoopUrl: string
  beforeAfterBefore: string
  beforeAfterAfter: string
  tools: string
  featured: boolean
  order: number
}

const INITIAL_FORM_DATA: FormDataState = {
  title: '',
  slug: '',
  category: 'Cinematic Edit',
  location: '',
  craft: ['Cuts'],
  role: 'Editor, Colorist, Motion Designer',
  client: '',
  year: new Date().getFullYear(),
  description: '',
  youtubeId: '',
  thumbnail: '',
  previewLoopUrl: '',
  beforeAfterBefore: '',
  beforeAfterAfter: '',
  tools: 'DaVinci Resolve, Premiere Pro, After Effects',
  featured: false,
  order: 0,
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'projects' | 'inquiries'>('projects')

  // Projects data
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)

  // Inquiries data
  const [inquiries, setInquiries] = useState<InquiryItem[]>([])
  const [loadingInquiries, setLoadingInquiries] = useState(false)

  // Project Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null)
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM_DATA)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  // YouTube oEmbed State
  const [youtubeInput, setYoutubeInput] = useState('')
  const [isFetchingOembed, setIsFetchingOembed] = useState(false)

  // Delete Confirmation Dialog State
  const [deleteTarget, setDeleteTarget] = useState<ProjectItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Reorder State
  const [isReordering, setIsReordering] = useState(false)

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, type, text }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Load Projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoadingProjects(true)
      const res = await fetch('/api/projects', { cache: 'no-store' })
      const json = await res.json()
      if (res.ok && json.success) {
        setProjects(json.data || [])
      } else {
        addToast(json.error || 'Failed to load projects', 'error')
      }
    } catch {
      addToast('Network error while loading projects', 'error')
    } finally {
      setLoadingProjects(false)
    }
  }, [addToast])

  // Load Inquiries
  const fetchInquiries = useCallback(async () => {
    try {
      setLoadingInquiries(true)
      const res = await fetch('/api/inquiries', { cache: 'no-store' })
      const json = await res.json()
      if (res.ok && json.success) {
        setInquiries(json.data || [])
      } else {
        addToast(json.error || 'Failed to load inquiries', 'error')
      }
    } catch {
      addToast('Network error while loading inquiries', 'error')
    } finally {
      setLoadingInquiries(false)
    }
  }, [addToast])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProjects()
      fetchInquiries()
    }
  }, [status, fetchProjects, fetchInquiries])

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingProject(null)
    setFormData({
      ...INITIAL_FORM_DATA,
      order: projects.length + 1,
    })
    setYoutubeInput('')
    setFieldErrors({})
    setIsFormModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEditModal = (project: ProjectItem) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      slug: project.slug,
      category: project.category,
      location: project.location || '',
      craft: project.craft || ['Cuts'],
      role: project.role || 'Editor, Colorist, Motion Designer',
      client: project.client || '',
      year: project.year || new Date().getFullYear(),
      description: project.description || '',
      youtubeId: project.youtubeId,
      thumbnail: project.thumbnail,
      previewLoopUrl: project.previewLoopUrl || '',
      beforeAfterBefore: project.beforeAfter?.before || '',
      beforeAfterAfter: project.beforeAfter?.after || '',
      tools: Array.isArray(project.tools) ? project.tools.join(', ') : '',
      featured: !!project.featured,
      order: project.order ?? 0,
    })
    setYoutubeInput(project.youtubeId)
    setFieldErrors({})
    setIsFormModalOpen(true)
  }

  // Auto-fill from YouTube oEmbed
  const handleFetchOEmbed = async () => {
    if (!youtubeInput.trim()) {
      addToast('Enter a YouTube URL or 11-char Video ID first', 'error')
      return
    }

    try {
      setIsFetchingOembed(true)
      const res = await fetch(`/api/youtube-oembed?url=${encodeURIComponent(youtubeInput.trim())}`)
      const json = await res.json()

      if (res.ok && json.success && json.data) {
        const { youtubeId, title, client, thumbnail, suggestedSlug } = json.data

        setFormData((prev) => ({
          ...prev,
          youtubeId: youtubeId || prev.youtubeId,
          title: prev.title ? prev.title : (title || prev.title),
          client: prev.client ? prev.client : (client || prev.client),
          thumbnail: thumbnail || prev.thumbnail,
          slug: prev.slug ? prev.slug : (suggestedSlug || prev.slug),
        }))

        addToast(`Auto-filled metadata for: ${title}`, 'success')
      } else {
        addToast(json.error || 'Could not fetch YouTube info', 'error')
      }
    } catch {
      addToast('Failed to connect to YouTube oEmbed API', 'error')
    } finally {
      setIsFetchingOembed(false)
    }
  }

  // Toggle Craft selection
  const handleCraftToggle = (craftName: CraftType) => {
    setFormData((prev) => {
      const exists = prev.craft.includes(craftName)
      const newCrafts = exists
        ? prev.craft.filter((c) => c !== craftName)
        : [...prev.craft, craftName]
      return { ...prev, craft: newCrafts }
    })
  }

  // Handle Form Submit (Add / Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})

    // Parse tools into array
    const toolsArray = formData.tools
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const payload: CreateProjectInput = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      category: formData.category.trim(),
      location: formData.location.trim(),
      craft: formData.craft,
      role: formData.role.trim(),
      client: formData.client.trim(),
      year: Number(formData.year),
      description: formData.description.trim(),
      youtubeId: formData.youtubeId.trim(),
      thumbnail: formData.thumbnail.trim(),
      previewLoopUrl: formData.previewLoopUrl.trim(),
      beforeAfter: {
        before: formData.beforeAfterBefore.trim(),
        after: formData.beforeAfterAfter.trim(),
      },
      tools: toolsArray,
      featured: formData.featured,
      order: Number(formData.order),
    }

    // Validate using Zod schema
    const validation = createProjectSchema.safeParse(payload)
    if (!validation.success) {
      const errors: Record<string, string> = {}
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[String(err.path[0])] = err.message
        }
      })
      setFieldErrors(errors)
      addToast('Please correct form validation errors', 'error')
      return
    }

    setIsSubmittingForm(true)

    try {
      const isEdit = !!editingProject
      const url = isEdit
        ? `/api/projects/${editingProject.slug}`
        : '/api/projects'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      })

      const json = await res.json()

      if (res.ok && json.success) {
        addToast(
          isEdit ? 'Project updated successfully' : 'Project added to portfolio',
          'success'
        )
        setIsFormModalOpen(false)
        await fetchProjects()
      } else {
        addToast(json.error || 'Failed to save project', 'error')
      }
    } catch {
      addToast('Network error while saving project', 'error')
    } finally {
      setIsSubmittingForm(false)
    }
  }

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/projects/${deleteTarget.slug}`, {
        method: 'DELETE',
      })
      const json = await res.json()

      if (res.ok && json.success) {
        addToast(`Project "${deleteTarget.title}" deleted`, 'success')
        setDeleteTarget(null)
        await fetchProjects()
      } else {
        addToast(json.error || 'Failed to delete project', 'error')
      }
    } catch {
      addToast('Network error while deleting project', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  // Reorder Item Up or Down
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= projects.length) return

    const newProjects = [...projects]
    const temp = newProjects[index]
    newProjects[index] = newProjects[targetIndex]
    newProjects[targetIndex] = temp

    // Re-assign 1-based order numbers
    const reorderedItems = newProjects.map((p, idx) => ({
      ...p,
      order: idx + 1,
    }))

    // Optimistically update UI
    setProjects(reorderedItems)
    setIsReordering(true)

    try {
      const payload = {
        items: reorderedItems.map((p) => ({
          id: p._id,
          order: p.order,
        })),
      }

      const res = await fetch('/api/projects/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (res.ok && json.success) {
        addToast('Projects reordered successfully', 'success')
      } else {
        addToast(json.error || 'Reorder failed on server', 'error')
        await fetchProjects() // Revert
      }
    } catch {
      addToast('Network error while reordering', 'error')
      await fetchProjects() // Revert
    } finally {
      setIsReordering(false)
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Toast Notifications Overlay */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-xs sm:text-sm ${
                t.type === 'success'
                  ? 'bg-surface/95 border-accent text-accent shadow-[0_0_20px_rgba(214,174,112,0.25)]'
                  : t.type === 'error'
                  ? 'bg-surface/95 border-red-500/80 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                  : 'bg-surface/95 border-surface text-text'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold">
                  {t.type === 'success' ? '✓' : t.type === 'error' ? '!' : 'ℹ'}
                </span>
                <span>{t.text}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-muted hover:text-text font-mono text-xs px-1"
                aria-label="Close notification"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Admin Dashboard Header */}
      <header className="rounded-2xl bg-surface/40 border border-surface/80 p-6 sm:p-8 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 font-mono text-[10px] uppercase tracking-widest text-accent font-medium">
              Suite Control Room
            </span>
            <span className="font-mono text-xs text-muted/70">
              {session?.user?.email || 'admin@example.com'}
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-light text-text">
            Editorial Portfolio Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Manage public films, craft tags, before/after color grading, and contact inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-surface hover:border-accent text-xs font-heading uppercase tracking-widest text-muted hover:text-accent transition-colors flex items-center gap-1.5"
          >
            <span>Live Portfolio</span>
            <span>↗</span>
          </Link>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="px-4 py-2 rounded-full border border-red-500/30 hover:border-red-500 bg-red-500/10 text-red-300 hover:text-red-200 text-xs font-heading uppercase tracking-widest transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex border-b border-surface/80 gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`pb-3 text-sm font-heading uppercase tracking-widest font-medium transition-colors relative flex items-center gap-2 ${
            activeTab === 'projects' ? 'text-accent' : 'text-muted hover:text-text'
          }`}
        >
          <span>Films & Projects</span>
          <span className="px-2 py-0.5 rounded-full bg-surface border border-surface text-[10px] font-mono">
            {projects.length}
          </span>
          {activeTab === 'projects' && (
            <motion.div
              layoutId="adminTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_rgba(214,174,112,0.6)]"
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 text-sm font-heading uppercase tracking-widest font-medium transition-colors relative flex items-center gap-2 ${
            activeTab === 'inquiries' ? 'text-accent' : 'text-muted hover:text-text'
          }`}
        >
          <span>Client Inquiries</span>
          <span className="px-2 py-0.5 rounded-full bg-surface border border-surface text-[10px] font-mono">
            {inquiries.length}
          </span>
          {activeTab === 'inquiries' && (
            <motion.div
              layoutId="adminTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_rgba(214,174,112,0.6)]"
            />
          )}
        </button>
      </div>

      {/* TAB 1: PROJECTS MANAGEMENT */}
      {activeTab === 'projects' && (
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl text-text font-light">
                Project Catalog
              </h2>
              <p className="text-xs text-muted font-mono mt-0.5">
                Reorder using arrows. Top projects appear first across the showcase.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-full bg-accent text-bg font-heading text-xs uppercase tracking-widest font-semibold hover:bg-accent/90 transition-all duration-300 shadow-[0_0_20px_rgba(214,174,112,0.3)] flex items-center gap-2"
            >
              <span>+ Add New Project</span>
            </button>
          </div>

          {loadingProjects ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted">
              <span className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
              <span className="text-xs font-mono">Loading projects from MongoDB...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-surface/80 bg-surface/30 p-12 text-center flex flex-col items-center gap-4">
              <p className="text-muted text-sm">No projects currently found in the catalog.</p>
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="px-4 py-2 rounded-full border border-accent text-accent hover:bg-accent hover:text-bg text-xs font-heading uppercase tracking-widest transition-colors"
              >
                Create First Project
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-surface/80 bg-surface/30 overflow-hidden shadow-xl">
              <div className="divide-y divide-surface/70">
                {projects.map((project, idx) => (
                  <div
                    key={project._id}
                    className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface/40 transition-colors"
                  >
                    {/* Left: Reorder controls + Thumbnail + Info */}
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Reorder Up/Down */}
                      <div className="flex flex-col items-center gap-1 text-muted">
                        <button
                          type="button"
                          disabled={idx === 0 || isReordering}
                          onClick={() => handleMoveOrder(idx, 'up')}
                          className="w-7 h-7 rounded bg-surface/60 border border-surface/80 hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-surface/80 disabled:hover:text-muted flex items-center justify-center transition-colors text-xs"
                          aria-label="Move project up"
                          title="Move project up"
                        >
                          ▲
                        </button>
                        <span className="font-mono text-[10px] text-accent/80 font-semibold">
                          #{project.order ?? idx + 1}
                        </span>
                        <button
                          type="button"
                          disabled={idx === projects.length - 1 || isReordering}
                          onClick={() => handleMoveOrder(idx, 'down')}
                          className="w-7 h-7 rounded bg-surface/60 border border-surface/80 hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-surface/80 disabled:hover:text-muted flex items-center justify-center transition-colors text-xs"
                          aria-label="Move project down"
                          title="Move project down"
                        >
                          ▼
                        </button>
                      </div>

                      {/* Video Thumbnail */}
                      <div className="w-24 sm:w-32 aspect-video rounded-lg overflow-hidden bg-surface relative flex-shrink-0 border border-surface/80">
                        {project.thumbnail ? (
                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted font-mono">
                            No Thumb
                          </div>
                        )}
                        {project.featured && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-accent text-bg text-[9px] font-heading font-bold uppercase tracking-wider">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-surface border border-surface/80 text-[10px] font-mono text-accent">
                            {project.category}
                          </span>
                          {project.location && (
                            <span className="text-[11px] font-mono text-muted/80">
                              📍 {project.location}
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-muted/60">
                            {project.year}
                          </span>
                        </div>

                        <h3 className="font-heading text-base sm:text-lg text-text font-medium truncate max-w-lg">
                          {project.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          {project.craft?.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 rounded-full bg-surface/80 border border-surface text-[10px] font-mono text-muted"
                            >
                              {c}
                            </span>
                          ))}
                          {project.client && (
                            <span className="text-xs text-muted/70 italic">
                              Client: {project.client}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-muted/50 truncate max-w-sm">
                          slug: /work/{project.slug} • youtube: {project.youtubeId}
                        </span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <Link
                        href={`/work/${project.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-full border border-surface/90 hover:border-accent text-xs font-mono text-muted hover:text-accent transition-colors"
                        title="View public case study"
                      >
                        Public View ↗
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(project)}
                        className="px-3.5 py-1.5 rounded-full border border-accent/40 bg-accent/10 text-accent hover:bg-accent hover:text-bg text-xs font-mono transition-colors"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(project)}
                        className="px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white text-xs font-mono transition-colors"
                        title="Delete project"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: INQUIRIES VIEW */}
      {activeTab === 'inquiries' && (
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl text-text font-light">
                Direct Inquiries & Briefs
              </h2>
              <p className="text-xs text-muted font-mono mt-0.5">
                Incoming communications from prospective directors, brands, and agencies.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchInquiries}
              disabled={loadingInquiries}
              className="px-4 py-2 rounded-full border border-surface hover:border-accent text-xs font-mono text-muted hover:text-accent transition-colors flex items-center gap-1.5"
            >
              <span>{loadingInquiries ? 'Refreshing...' : '↻ Refresh Inquiries'}</span>
            </button>
          </div>

          {loadingInquiries ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted">
              <span className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
              <span className="text-xs font-mono">Fetching inquiries...</span>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="rounded-2xl border border-surface/80 bg-surface/30 p-12 text-center text-muted">
              <p className="text-sm">No client inquiries received yet.</p>
              <p className="text-xs font-mono text-muted/60 mt-1">
                Submissions from the public /contact form will be stored and listed here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry._id}
                  className="rounded-2xl border border-surface/80 bg-surface/40 p-5 sm:p-6 backdrop-blur-sm flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-heading text-lg font-medium text-text">
                          {inquiry.name}
                        </h3>
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="font-mono text-xs text-accent hover:underline"
                        >
                          {inquiry.email}
                        </a>
                      </div>
                      <span className="font-mono text-[10px] text-muted/60">
                        {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface border border-surface/90 text-xs font-mono text-text">
                        Scope: {inquiry.projectType}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-xs font-mono text-accent">
                        Budget: {inquiry.budgetRange}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-surface/60 border border-surface/70 text-xs text-text/90 leading-relaxed font-sans whitespace-pre-wrap">
                      {inquiry.message}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-surface/60 flex items-center justify-between text-[11px] font-mono text-muted/60">
                    <span>
                      Delivery Status:{' '}
                      <span
                        className={
                          inquiry.emailStatus === 'sent'
                            ? 'text-green-400 font-semibold'
                            : inquiry.emailStatus === 'failed'
                            ? 'text-red-400 font-semibold'
                            : 'text-amber-400 font-semibold'
                        }
                      >
                        {inquiry.emailStatus}
                      </span>
                    </span>
                    <a
                      href={`mailto:${inquiry.email}?subject=${encodeURIComponent(
                        `Regarding your ${inquiry.projectType} project inquiry`
                      )}`}
                      className="text-accent hover:underline"
                    >
                      Reply to Client →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* PROJECT ADD / EDIT MODAL (Reusing Modal component) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingProject ? `Edit Project: ${editingProject.title}` : 'Add New Portfolio Project'}
        maxWidth="max-w-4xl"
      >
        <form
          onSubmit={handleSubmitForm}
          noValidate
          className="p-6 max-h-[80vh] overflow-y-auto flex flex-col gap-6 text-sm"
        >
          {/* Section: YouTube oEmbed Auto-Fill */}
          <div className="p-4 rounded-xl bg-surface/80 border border-accent/30 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-medium">
                ⚡ YouTube Auto-Fill
              </span>
              <span className="text-[11px] text-muted">Auto-populates Title, Client & HD Thumbnail</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Paste YouTube Video URL or 11-char ID (e.g. S14dA5Ybuvk)"
                value={youtubeInput}
                onChange={(e) => setYoutubeInput(e.target.value)}
                className="flex-1 bg-surface border border-surface/90 rounded-lg px-3 py-2 text-xs text-text placeholder:text-muted/50 focus:outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={handleFetchOEmbed}
                disabled={isFetchingOembed}
                className="px-4 py-2 rounded-lg bg-accent text-bg font-heading text-xs uppercase tracking-wider font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isFetchingOembed ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-bg border-t-transparent animate-spin" />
                    <span>Fetching...</span>
                  </>
                ) : (
                  <span>Auto-Fill Info</span>
                )}
              </button>
            </div>
          </div>

          {/* Row 1: Title and Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-muted/80 uppercase tracking-wider flex justify-between">
                <span>Title *</span>
                {fieldErrors.title && <span className="text-red-400">{fieldErrors.title}</span>}
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Drishyam 3 Cinematic Review"
                className="bg-surface/60 border border-surface/80 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-muted/80 uppercase tracking-wider flex justify-between">
                <span>Slug (URL identifier) *</span>
                {fieldErrors.slug && <span className="text-red-400">{fieldErrors.slug}</span>}
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="drishyam-3-cinematic-review"
                className="bg-surface/60 border border-surface/80 rounded-lg px-3 py-2 text-text font-mono text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Row 2: Category, Location, Client, Year */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-muted/80 uppercase tracking-wider">
                Category *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Narrative Film, Travel..."
                className="bg-surface/60 border border-surface/80 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-muted/80 uppercase tracking-wider">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Goa, India"
                className="bg-surface/60 border border-surface/80 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-muted/80 uppercase tracking-wider">
                Client / Brand
              </label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="Production House"
                className="bg-surface/60 border border-surface/80 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-muted/80 uppercase tracking-wider">
                Release Year *
              </label>
              <input
                type="number"
                required
                min={2000}
                max={2100}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                className="bg-surface/60 border border-surface/80 rounded-lg px-3 py-2 text-text font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Row 3: Craft Selection (Checkboxes) & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-muted/80 uppercase tracking-wider flex justify-between">
                <span>Crafts Involved *</span>
                {fieldErrors.craft && <span className="text-red-400">{fieldErrors.craft}</span>}
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {CRAFT_ENUM.map((craft) => {
                  const isChecked = formData.craft.includes(craft)
                  return (
                    <button
                      key={craft}
                      type="button"
                      onClick={() => handleCraftToggle(craft)}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                        isChecked
                          ? 'bg-accent/15 border-accent text-accent shadow-[0_0_12px_rgba(214,174,112,0.2)]'
                          : 'bg-surface/60 border-surface text-muted hover:border-surface/90'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {craft}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-muted/80 uppercase tracking-wider">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Lead Editor, Colorist"
                className="bg-surface/60 border border-surface/80 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Row 4: YouTube ID and Thumbnail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-muted/80 uppercase tracking-wider flex justify-between">
                <span>YouTube Video ID *</span>
                {fieldErrors.youtubeId && <span className="text-red-400">{fieldErrors.youtubeId}</span>}
              </label>
              <input
                type="text"
                required
                value={formData.youtubeId}
                onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                placeholder="S14dA5Ybuvk"
                className="bg-surface/60 border border-surface/80 rounded-lg px-3 py-2 text-text font-mono text-xs focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-muted/80 uppercase tracking-wider flex justify-between">
                <span>Thumbnail URL *</span>
                {fieldErrors.thumbnail && <span className="text-red-400">{fieldErrors.thumbnail}</span>}
              </label>
              <input
                type="url"
                required
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://i.ytimg.com/vi/S14dA5Ybuvk/maxresdefault.jpg"
                className="bg-surface/60 border border-surface/80 rounded-lg px-3 py-2 text-text font-mono text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Optional Video Loop & Before/After Comparison Fields */}
          <div className="p-4 rounded-xl bg-surface/40 border border-surface/70 flex flex-col gap-4">
            <span className="font-mono text-xs text-accent uppercase tracking-wider">
              Optional Media Enhancements
            </span>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-muted/80 uppercase tracking-wider">
                Preview Loop URL (Hover video loop)
              </label>
              <input
                type="text"
                value={formData.previewLoopUrl}
                onChange={(e) => setFormData({ ...formData, previewLoopUrl: e.target.value })}
                placeholder="/videos/motion-loop-ooty.mp4 or CDN video URL"
                className="bg-surface/60 border border-surface/80 rounded-lg px-3 py-2 text-text font-mono text-xs focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-muted/80 uppercase tracking-wider">
                  Before/After: Raw LOG File URL
                </label>
                <input
                  type="text"
                  value={formData.beforeAfterBefore}
                  onChange={(e) => setFormData({ ...formData, beforeAfterBefore: e.target.value })}
                  placeholder="/images/raw-log-ooty.jpg"
                  className="bg-surface/60 border border-surface/80 rounded-lg px-3 py-2 text-text font-mono text-xs focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-muted/80 uppercase tracking-wider">
                  Before/After: Graded Master File URL
                </label>
                <input
                  type="text"
                  value={formData.beforeAfterAfter}
                  onChange={(e) => setFormData({ ...formData, beforeAfterAfter: e.target.value })}
                  placeholder="/images/graded-ooty.jpg"
                  className="bg-surface/60 border border-surface/80 rounded-lg px-3 py-2 text-text font-mono text-xs focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Tools & Description */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-muted/80 uppercase tracking-wider">
              Tools Used (comma separated)
            </label>
            <input
              type="text"
              value={formData.tools}
              onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
              placeholder="DaVinci Resolve, Premiere Pro, After Effects"
              className="bg-surface/60 border border-surface/80 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-muted/80 uppercase tracking-wider">
              Project Description / Editorial Case Notes
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the editorial pacing, storytelling choices, color palette, or key revisions..."
              className="bg-surface/60 border border-surface/80 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent resize-y"
            />
          </div>

          {/* Featured Toggle & Order */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-surface/80">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded border-surface accent-accent cursor-pointer"
              />
              <span className="font-heading text-xs uppercase tracking-wider text-text">
                Feature on Public Homepage
              </span>
            </label>

            <div className="flex items-center gap-2">
              <label className="font-mono text-xs text-muted uppercase">Display Order:</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-16 bg-surface/60 border border-surface/80 rounded-lg px-2 py-1 text-text font-mono text-xs text-center focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface/80">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-5 py-2.5 rounded-full border border-surface hover:border-surface/90 text-xs font-mono text-muted hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingForm}
              className="px-6 py-2.5 rounded-full bg-accent text-bg font-heading text-xs uppercase tracking-widest font-semibold hover:bg-accent/90 transition-all shadow-[0_0_20px_rgba(214,174,112,0.3)] disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmittingForm ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-bg border-t-transparent animate-spin" />
                  <span>Saving Project...</span>
                </>
              ) : (
                <span>{editingProject ? 'Save Changes' : 'Publish Project'}</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRMATION DIALOG (Destructive Action Confirmation) */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Project Deletion"
        maxWidth="max-w-md"
      >
        <div className="p-6 flex flex-col gap-6">
          <div className="space-y-2">
            <p className="text-sm text-text leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-accent">
                &ldquo;{deleteTarget?.title}&rdquo;
              </span>
              ?
            </p>
            <p className="text-xs font-mono text-red-400/90">
              ⚠️ This will remove the case study (/work/{deleteTarget?.slug}) from the public portfolio immediately.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface/80">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-full border border-surface hover:border-surface/90 text-xs font-mono text-muted hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-heading text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Permanently</span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
