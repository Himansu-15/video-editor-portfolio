'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProjectItem } from '@/hooks/useProjects'

interface ProjectCardProps {
  project: ProjectItem
  onClick: (project: ProjectItem) => void
  isPlayingPreview?: boolean
  onHoverStart?: () => void
  onHoverEnd?: () => void
  index?: number
}

function formatCraftLabel(craft: string): string {
  const lower = craft.toLowerCase()
  if (lower.includes('color')) return 'Color'
  if (lower.includes('motion')) return 'Motion'
  return 'Cuts'
}

export function ProjectCard({
  project,
  onClick,
  isPlayingPreview = false,
  onHoverStart,
  onHoverEnd,
  index = 0,
}: ProjectCardProps) {
  const [thumbSrc, setThumbSrc] = useState(
    project.thumbnail || `https://i.ytimg.com/vi/${project.youtubeId}/maxresdefault.jpg`
  )

  const handleThumbError = () => {
    // Fallback to hqdefault if maxresdefault is not available on YouTube
    if (!thumbSrc.includes('hqdefault')) {
      setThumbSrc(`https://i.ytimg.com/vi/${project.youtubeId}/hqdefault.jpg`)
    }
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.65,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={() => onClick(project)}
      data-cursor="play"
      aria-label={`Watch ${project.title}`}
      className="group relative rounded-xl bg-surface border border-surface/80 hover:border-accent/60 transition-colors duration-300 overflow-hidden flex flex-col p-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* 1. Thumbnail Container */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
        {/* Static YouTube Thumbnail with next/image */}
        <Image
          src={thumbSrc}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={index < 2}
          onError={handleThumbError}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Dynamic Hover Loop Video Preview (plays muted on hover if previewLoopUrl exists) */}
        {isPlayingPreview && project.previewLoopUrl && (
          <video
            src={project.previewLoopUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300"
          />
        )}

        {/* Hover Darken & Play Icon Overlay */}
        <div
          className="absolute inset-0 bg-bg/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 pointer-events-none"
          aria-hidden="true"
        >
          <div className="w-12 h-12 rounded-full border border-accent/80 bg-surface/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_25px_rgba(214,174,112,0.3)] transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <svg
              className="w-4 h-4 text-accent fill-current translate-x-0.5"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Year Badge */}
        <div className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 rounded bg-bg/85 backdrop-blur-sm border border-surface/80 text-[10px] font-mono text-muted select-none">
          {project.year}
        </div>
      </div>

      {/* 2. Project Metadata */}
      <div className="flex flex-col gap-2 pt-3 px-1">
        {/* Location (when set) above the title in muted text */}
        {project.location && project.location.trim().length > 0 && (
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted/75 line-clamp-1">
            {project.location}
          </p>
        )}

        {/* Project Title */}
        <h3 className="font-heading text-base sm:text-lg font-medium text-text group-hover:text-accent transition-colors duration-200 line-clamp-1">
          {project.title}
        </h3>

        {/* Small craft tags (Cuts / Color / Motion) as thin outlined chips, gold only on hover */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {project.craft.map((c) => (
              <span
                key={c}
                className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider border border-surface/80 text-muted/80 hover:!border-accent hover:!text-accent transition-colors cursor-default"
              >
                {formatCraftLabel(c)}
              </span>
            ))}
          </div>

          <Link
            href={`/work/${project.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] font-mono text-muted/70 hover:text-accent transition-colors flex items-center gap-1 group/link"
          >
            <span>Case Study</span>
            <span className="transform transition-transform group-hover/link:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
