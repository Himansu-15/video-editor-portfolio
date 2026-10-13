'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProjects, ProjectItem } from '@/hooks/useProjects'
import dynamic from 'next/dynamic'
import { ProjectCard } from '@/components/ProjectCard'
import { Modal } from '@/components/Modal'

const VideoPlayer = dynamic(
  () => import('@/components/VideoPlayer').then((m) => m.VideoPlayer),
  { ssr: false }
)

interface ProjectsShowcaseProps {
  /** If true, shows the dual category & craft filter tabs (default: true) */
  showFilters?: boolean
  /** Filter to featured projects only (useful for homepage section) */
  featuredOnly?: boolean
  /** Optional limit on displayed cards (useful for homepage preview) */
  limit?: number
  /** Heading title */
  title?: string
  /** Subtitle / category label */
  eyebrow?: string
  /** Header action link / button */
  headerAction?: React.ReactNode
}

const CRAFT_FILTERS = ['All', 'Cuts', 'Color', 'Motion'] as const

export function ProjectsShowcase({
  showFilters = true,
  featuredOnly,
  limit,
  title,
  eyebrow,
  headerAction,
}: ProjectsShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [activeCraft, setActiveCraft] = useState<string>('All')
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [simulateError, setSimulateError] = useState(false)

  // Fetch projects from the real API
  const { projects, loading, error, refetch } = useProjects({
    featured: featuredOnly,
    simulateError,
  })

  // Extract unique categories dynamically from the loaded project set
  const categories = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return ['All', ...Array.from(set)]
  }, [projects])

  // Filter projects based on active category and active craft
  const filteredProjects = useMemo(() => {
    let list = projects

    if (activeCategory !== 'All') {
      list = list.filter((p) => p.category === activeCategory)
    }

    if (activeCraft !== 'All') {
      list = list.filter((p) =>
        p.craft.some((c) => {
          const lower = c.toLowerCase()
          if (activeCraft === 'Cuts') return lower.includes('cut')
          if (activeCraft === 'Color') return lower.includes('color')
          if (activeCraft === 'Motion') return lower.includes('motion')
          return false
        })
      )
    }

    if (typeof limit === 'number' && limit > 0) {
      list = list.slice(0, limit)
    }

    return list
  }, [projects, activeCategory, activeCraft, limit])

  const handleResetFilters = () => {
    setActiveCategory('All')
    setActiveCraft('All')
  }

  return (
    <div className="w-full">
      {/* Header Bar */}
      {(title || eyebrow || headerAction) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            {eyebrow && (
              <p className="text-xs uppercase tracking-widest text-accent font-medium mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-heading text-3xl sm:text-5xl font-light text-text">
                {title}
              </h2>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      {/* Dual Filters: Category and Craft with Animated Gold Underlines */}
      {showFilters && !loading && !error && (
        <div className="flex flex-col gap-6 mb-12 pb-6 border-b border-surface/70">
          {/* Category Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-[11px] uppercase font-mono tracking-widest text-muted/60 shrink-0 w-24">
              Category
            </span>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {categories.map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative py-1.5 px-3 text-xs sm:text-sm font-heading tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                      isActive ? 'text-text font-medium' : 'text-muted hover:text-text'
                    }`}
                  >
                    <span>{cat}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryUnderline"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_rgba(214,174,112,0.4)]"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Craft Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-[11px] uppercase font-mono tracking-widest text-muted/60 shrink-0 w-24">
              Craft
            </span>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {CRAFT_FILTERS.map((craft) => {
                const isActive = activeCraft === craft
                return (
                  <button
                    key={craft}
                    onClick={() => setActiveCraft(craft)}
                    className={`relative py-1.5 px-3 text-xs sm:text-sm font-heading tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                      isActive ? 'text-accent font-medium' : 'text-muted hover:text-text'
                    }`}
                  >
                    <span>{craft}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeCraftUnderline"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_rgba(214,174,112,0.4)]"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* 1. Loading Skeleton State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-surface/50 border border-surface/80 p-4 animate-pulse flex flex-col gap-4"
            >
              <div className="aspect-video w-full rounded-lg bg-surface/90" />
              <div className="space-y-2.5 px-1">
                <div className="h-3 w-28 bg-surface/80 rounded" />
                <div className="h-5 w-4/5 bg-surface/80 rounded" />
                <div className="flex gap-2 pt-1">
                  <div className="h-4 w-14 bg-surface/80 rounded-full" />
                  <div className="h-4 w-14 bg-surface/80 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Error State */}
      {!loading && error && (
        <div className="p-12 rounded-2xl bg-surface/40 border border-surface/80 text-center flex flex-col items-center justify-center gap-4 my-8">
          <div className="w-12 h-12 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center text-red-400 font-mono text-xl">
            !
          </div>
          <h3 className="font-heading text-lg font-medium text-text">
            Failed to Load Projects
          </h3>
          <p className="text-xs sm:text-sm text-muted max-w-md">{error}</p>
          <button
            onClick={() => {
              setSimulateError(false)
              refetch()
            }}
            className="mt-2 px-6 py-2.5 rounded-full border border-accent bg-accent/10 text-accent hover:bg-accent hover:text-bg text-xs uppercase tracking-widest font-medium transition-all"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* 3. Empty State */}
      {!loading && !error && filteredProjects.length === 0 && (
        <div className="p-16 rounded-2xl bg-surface/30 border border-surface/70 text-center flex flex-col items-center justify-center gap-4 my-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            0 Projects Found
          </p>
          <h3 className="font-heading text-xl font-light text-text">
            No projects match the selected filters.
          </h3>
          <p className="text-xs text-muted max-w-sm">
            Try choosing another category or craft filter to view more work.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-3 px-6 py-2.5 rounded-full border border-accent text-accent hover:bg-accent hover:text-bg text-xs uppercase tracking-widest font-medium transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* 4. Responsive Grid of Project Cards with Animated Layout Transitions */}
      {!loading && !error && filteredProjects.length > 0 && (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project._id || project.slug || idx}
                project={project}
                index={idx}
                isPlayingPreview={activePreviewId === project._id}
                onHoverStart={() => setActivePreviewId(project._id)}
                onHoverEnd={() => {
                  if (activePreviewId === project._id) {
                    setActivePreviewId(null)
                  }
                }}
                onClick={(p) => setSelectedProject(p)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Shared Video Modal Player from Step 4 */}
      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject ? selectedProject.title : 'Project Video'}
        maxWidth="max-w-5xl"
      >
        {selectedProject && (
          <VideoPlayer
            youtubeId={selectedProject.youtubeId}
            title={selectedProject.title}
            autoPlay={true}
            muted={false}
          />
        )}
      </Modal>
    </div>
  )
}
