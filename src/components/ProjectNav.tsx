'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface NavProjectInfo {
  slug: string
  title: string
  thumbnail?: string
  location?: string
}

interface ProjectNavProps {
  prevProject: NavProjectInfo | null
  nextProject: NavProjectInfo | null
}

export function ProjectNav({ prevProject, nextProject }: ProjectNavProps) {
  return (
    <nav
      aria-label="Project Navigation"
      className="w-full border-t border-surface/80 pt-12 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-6"
    >
      {/* Previous Project Link */}
      {prevProject ? (
        <Link
          href={`/work/${prevProject.slug}`}
          className="group relative flex flex-col p-6 rounded-xl bg-surface/30 border border-surface/70 hover:border-accent/60 transition-all duration-300 overflow-hidden"
        >
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted/70 group-hover:text-accent transition-colors mb-2">
            <svg
              className="w-3.5 h-3.5 transform transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous Project</span>
          </div>

          <h4 className="font-heading text-lg sm:text-xl font-light text-text group-hover:text-accent transition-colors line-clamp-1">
            {prevProject.title}
          </h4>

          {prevProject.location && (
            <p className="text-[11px] font-mono text-muted/60 mt-1 uppercase tracking-wider">
              {prevProject.location}
            </p>
          )}

          {/* Subtle gold glow line on bottom hover */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </Link>
      ) : (
        <div className="p-6 rounded-xl bg-surface/10 border border-surface/40 flex items-center text-xs font-mono text-muted/40 uppercase tracking-wider">
          Beginning of Archive
        </div>
      )}

      {/* Next Project Link */}
      {nextProject ? (
        <Link
          href={`/work/${nextProject.slug}`}
          className="group relative flex flex-col items-start sm:items-end text-left sm:text-right p-6 rounded-xl bg-surface/30 border border-surface/70 hover:border-accent/60 transition-all duration-300 overflow-hidden"
        >
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted/70 group-hover:text-accent transition-colors mb-2">
            <span>Next Project</span>
            <svg
              className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <h4 className="font-heading text-lg sm:text-xl font-light text-text group-hover:text-accent transition-colors line-clamp-1">
            {nextProject.title}
          </h4>

          {nextProject.location && (
            <p className="text-[11px] font-mono text-muted/60 mt-1 uppercase tracking-wider">
              {nextProject.location}
            </p>
          )}

          {/* Subtle gold glow line on bottom hover */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
        </Link>
      ) : (
        <div className="p-6 rounded-xl bg-surface/10 border border-surface/40 flex items-center justify-end text-xs font-mono text-muted/40 uppercase tracking-wider">
          End of Archive
        </div>
      )}
    </nav>
  )
}
