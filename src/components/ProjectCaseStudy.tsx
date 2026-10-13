'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { site } from '@/data/site'
import { ProjectItem } from '@/hooks/useProjects'
import dynamic from 'next/dynamic'
import { Modal } from '@/components/Modal'

const VideoPlayer = dynamic(
  () => import('@/components/VideoPlayer').then((m) => m.VideoPlayer),
  { ssr: false }
)
import { ColorGradingSlider } from '@/components/ColorGradingSlider'
import { CutsTimelineGraphic } from '@/components/CutsTimelineGraphic'
import { ProjectNav } from '@/components/ProjectNav'
import { fadeUpVariant } from '@/lib/animation'

interface ProjectCaseStudyProps {
  project: ProjectItem
  allProjects: ProjectItem[]
}

export function ProjectCaseStudy({ project, allProjects }: ProjectCaseStudyProps) {
  const [isPlayingHero, setIsPlayingHero] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // Find index for Next / Previous project navigation
  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug)
  const total = allProjects.length

  const prevProject =
    total > 1
      ? currentIndex > 0
        ? allProjects[currentIndex - 1]
        : allProjects[total - 1]
      : null

  const nextProject =
    total > 1
      ? currentIndex < total - 1
        ? allProjects[currentIndex + 1]
        : allProjects[0]
      : null

  // Craft Descriptions from src/data/site.ts (DUMMY values)
  const cutsDescription =
    site.services.find((s) => s.id === 'cinematic-cuts')?.description ||
    'Precision editing that finds the story in every frame. Rhythmic pacing, seamless transitions, and narrative structure that turns footage into cinema.'

  const colorDescription =
    site.services.find((s) => s.id === 'color-grading')?.description ||
    'Cinematic color science that defines mood and atmosphere. From naturalistic enhancement to stylized looks — each grade serves the story.'

  const motionDescription =
    site.services.find((s) => s.id === 'motion-graphics')?.description ||
    'Custom motion design that integrates seamlessly with footage. Titles, overlays, and visual elements that elevate without distracting.'

  // Conditional flags for optional sections
  const hasBeforeAfter = Boolean(
    project.beforeAfter &&
      project.beforeAfter.before &&
      project.beforeAfter.after &&
      project.beforeAfter.before.trim().length > 0 &&
      project.beforeAfter.after.trim().length > 0
  )

  const hasMotionSection = Boolean(
    project.previewLoopUrl && project.previewLoopUrl.trim().length > 0
  )

  const toolsList =
    project.tools && project.tools.length > 0
      ? project.tools
      : site.software.map((s) => s.name)

  return (
    <article className="pt-28 pb-20 px-6 md:px-12 max-w-6xl mx-auto w-full flex flex-col gap-20">
      {/* Breadcrumb / Back Link */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted hover:text-accent transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Selected Work</span>
        </Link>
      </nav>

      {/* 1. HERO SECTION */}
      <header className="flex flex-col gap-8">
        {/* Location & Year Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface/80 pb-4">
          <div className="flex items-center gap-3">
            {project.location && project.location.trim().length > 0 && (
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-medium">
                {project.location}
              </span>
            )}
            {project.location && <span className="text-muted/40">•</span>}
            <span className="text-xs font-mono uppercase tracking-wider text-muted">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-muted">
            <span>Year: {project.year}</span>
            <span className="text-muted/40">•</span>
            <span>Client: {project.client || 'Independent'}</span>
          </div>
        </div>

        {/* Title & Role */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-light text-text leading-[1.15]">
              {project.title}
            </h1>
          </div>

          <div className="shrink-0 flex flex-col items-start md:items-end">
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted/60">
              Role
            </span>
            <p className="text-xs sm:text-sm font-medium text-text mt-0.5">
              {project.role || 'Editor, Colorist, Motion Designer'}
            </p>
          </div>
        </div>

        {/* Video Player / Poster Container with click-to-load */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-surface/90 shadow-2xl group">
          {isPlayingHero ? (
            <VideoPlayer
              youtubeId={project.youtubeId}
              title={project.title}
              autoPlay={true}
              muted={false}
            />
          ) : (
            <div
              onClick={() => setIsPlayingHero(true)}
              data-cursor="play"
              className="relative w-full h-full cursor-pointer"
              aria-label={`Play ${project.title}`}
            >
              {/* Poster Thumbnail */}
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1152px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Ambient Dark Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />

              {/* Play Overlay Button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-accent/80 bg-surface/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_35px_rgba(214,174,112,0.4)] transform group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-accent fill-current translate-x-0.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="font-heading text-xs sm:text-sm tracking-widest uppercase text-text/90 group-hover:text-accent transition-colors font-medium">
                  Watch Full Film
                </span>
              </div>

              {/* Cinema Modal Alternative Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsModalOpen(true)
                }}
                className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-full bg-surface/80 backdrop-blur-md border border-surface/80 hover:border-accent text-[11px] font-mono text-muted hover:text-accent transition-colors"
              >
                Open in Cinema Modal ↗
              </button>
            </div>
          )}
        </div>

        {/* Project Description */}
        {project.description && (
          <p className="text-sm sm:text-base text-muted/90 max-w-3xl leading-relaxed pt-2">
            {project.description}
          </p>
        )}
      </header>

      {/* 2. THREE ANIMATED CRAFT SECTIONS (Scroll-revealed in order) */}
      <div className="flex flex-col gap-24">
        {/* CRAFT 1: CUTS (Always shown as core editorial craft) */}
        <motion.section
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col gap-6"
          aria-label="Editorial Cuts & Pacing"
        >
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-accent font-medium">
              Craft 01 — Editorial
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-light text-text">
              Pacing, Rhythm & Seamless Cuts
            </h2>
          </div>

          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
            {cutsDescription}
          </p>

          {/* Thin animated timeline graphic with clip markers */}
          <CutsTimelineGraphic />
        </motion.section>

        {/* CRAFT 2: COLOR GRADING (Hidden if no before/after assets exist) */}
        {hasBeforeAfter && (
          <motion.section
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col gap-6"
            aria-label="Color Grading Comparison"
          >
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-accent font-medium">
                Craft 02 — Color Science
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-light text-text">
                Color Grading: RAW / LOG vs. Final Grade
              </h2>
            </div>

            <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
              {colorDescription}
            </p>

            {/* Before/After Interactive Comparison Slider */}
            <ColorGradingSlider
              beforeSrc={project.beforeAfter!.before!}
              afterSrc={project.beforeAfter!.after!}
              beforeLabel="RAW / LOG (S-LOG3)"
              afterLabel="FINAL GRADE"
            />
          </motion.section>
        )}

        {/* CRAFT 3: MOTION GRAPHICS (Hidden when empty) */}
        {hasMotionSection && (
          <motion.section
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col gap-6"
            aria-label="Motion Graphics"
          >
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-accent font-medium">
                Craft 03 — Motion Design
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-light text-text">
                Motion Graphics & Visual Rhythm
              </h2>
            </div>

            <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
              {motionDescription}
            </p>

            {/* Optional Second Video or Looping GIF Slot */}
            {project.previewLoopUrl && (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-surface/50 border border-surface/80">
                <video
                  src={project.previewLoopUrl}
                  poster={project.thumbnail}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-bg/85 backdrop-blur-md border border-surface/80 text-[10px] font-mono text-accent uppercase tracking-wider flex items-center gap-1.5 pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                  <span>Motion Pass • 24 FPS</span>
                </div>
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-bg/85 backdrop-blur-md border border-surface/80 text-[10px] font-mono text-muted uppercase tracking-wider pointer-events-none">
                  Looping Title & Kinetic Motion Sequence
                </div>
              </div>
            )}
          </motion.section>
        )}
      </div>

      {/* 3. TOOLS USED */}
      <section
        aria-label="Software & Tools"
        className="pt-12 border-t border-surface/80 flex flex-col gap-6"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-muted/70">
          Tools Used
        </span>
        <div className="flex flex-wrap items-center gap-3">
          {toolsList.map((tool) => (
            <div
              key={tool}
              className="px-4 py-2 rounded-lg bg-surface/50 border border-surface/80 hover:border-accent/40 text-xs sm:text-sm font-heading tracking-wide text-text transition-colors flex items-center gap-2.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>{tool}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. NEXT / PREVIOUS PROJECT NAVIGATION */}
      <ProjectNav prevProject={prevProject} nextProject={nextProject} />

      {/* Shared Cinema Modal Player */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={project.title}
        maxWidth="max-w-5xl"
      >
        <VideoPlayer
          youtubeId={project.youtubeId}
          title={project.title}
          autoPlay={true}
          muted={false}
        />
      </Modal>
    </article>
  )
}
