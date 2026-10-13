'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export interface ProjectItem {
  _id?: string
  title: string
  slug: string
  category: string
  location?: string
  craft: string[]
  client?: string
  year: number
  description?: string
  youtubeId: string
  thumbnail: string
  order?: number
}

interface ProjectGridProps {
  projects: ProjectItem[]
}

const CRAFT_FILTERS = ['All', 'Cuts', 'Color Grading', 'Motion Graphics'] as const

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [playingVideo, setPlayingVideo] = useState<ProjectItem | null>(null)

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'All') return true
    return project.craft.includes(activeFilter)
  })

  return (
    <>
      {/* Craft Filter Buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-12">
        {CRAFT_FILTERS.map((filter) => {
          const isActive = activeFilter === filter
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-accent text-bg shadow-[0_0_15px_rgba(214,174,112,0.25)]'
                  : 'bg-surface/50 border border-surface text-muted hover:text-text hover:border-accent/40'
              }`}
            >
              {filter}
            </button>
          )
        })}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {filteredProjects.map((project, idx) => (
          <article
            key={project.slug || idx}
            onClick={() => setPlayingVideo(project)}
            className="group relative flex flex-col gap-4 rounded-xl overflow-hidden bg-surface/40 border border-surface/80 p-4 transition-all duration-300 hover:border-accent/50 cursor-pointer"
          >
            {/* Thumbnail + Play Overlay */}
            <div
              data-cursor="play"
              className="relative aspect-video w-full rounded-lg overflow-hidden bg-surface flex items-center justify-center"
            >
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-bg/40 group-hover:bg-bg/20 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border border-accent/70 bg-surface/80 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:border-accent transition-all shadow-[0_0_25px_rgba(214,174,112,0.2)]">
                  <svg
                    className="w-5 h-5 text-accent fill-current translate-x-0.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Year Badge */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-bg/80 backdrop-blur-sm border border-surface text-[10px] font-mono text-muted">
                {project.year}
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-col gap-2 pt-1 px-1">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-heading text-lg font-medium text-text group-hover:text-accent transition-colors line-clamp-1">
                  {project.title}
                </h2>
                <span className="text-xs font-mono text-muted/60 shrink-0">
                  0{idx + 1}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {project.craft.map((c) => (
                  <span
                    key={c}
                    className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-surface border border-surface/80 text-muted"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Cinematic YouTube Video Modal */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-bg/95 backdrop-blur-xl"
            onClick={() => setPlayingVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl bg-surface border border-surface/80 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar with Title & Close Button */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface/60">
                <h3 className="font-heading text-sm sm:text-base font-medium text-text line-clamp-1">
                  {playingVideo.title}
                </h3>
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="w-8 h-8 rounded-full border border-surface flex items-center justify-center text-muted hover:text-text hover:border-accent transition-colors"
                  aria-label="Close video player"
                >
                  ✕
                </button>
              </div>

              {/* YouTube Player */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${playingVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={playingVideo.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Bottom Info */}
              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <span className="text-accent font-medium uppercase tracking-wider">
                    {playingVideo.category}
                  </span>
                  <span>•</span>
                  <span>{playingVideo.client || 'Client Project'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {playingVideo.craft.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded bg-bg text-muted border border-surface/60"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
