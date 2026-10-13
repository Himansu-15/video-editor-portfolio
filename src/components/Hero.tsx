'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { site } from '@/data/site'
import { SHOWREEL_YOUTUBE_ID } from '@/lib/constants'
import dynamic from 'next/dynamic'
import { HeroBackdrop } from '@/components/HeroBackdrop'
import { Modal } from '@/components/Modal'

const VideoPlayer = dynamic(
  () => import('@/components/VideoPlayer').then((m) => m.VideoPlayer),
  { ssr: false }
)

const PRELOADER_KEY = 'abhijeet-preloader-shown'

export function Hero() {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [showreelOpen, setShowreelOpen] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  // Subtle scroll parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const yContent = useTransform(scrollYProgress, [0, 1], ['0%', '24%'])
  const opacityContent = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const scaleBackdrop = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  // Coordinate animation with preloader
  useEffect(() => {
    try {
      const isForced = window.location.search.includes('preloader=1')
      if (
        !isForced &&
        (sessionStorage.getItem(PRELOADER_KEY) === 'true' ||
          document.documentElement.classList.contains('preloader-done'))
      ) {
        setShouldAnimate(true)
        return
      }
    } catch {
      setShouldAnimate(true)
      return
    }

    const handleReveal = () => setShouldAnimate(true)
    window.addEventListener('site-reveal', handleReveal)

    // Fallback safety timeout so hero headline is never stuck invisible
    const safetyTimer = setTimeout(() => {
      setShouldAnimate(true)
    }, 1400)

    return () => {
      window.removeEventListener('site-reveal', handleReveal)
      clearTimeout(safetyTimer)
    }
  }, [])

  const handleScrollDown = () => {
    const nextSection = document.getElementById('home-content')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })
    }
  }

  // Split tagline into words: "Places, cut into cinema."
  // Highlight "cinema." in champagne gold
  const taglineWords = site.tagline.split(' ')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.05,
      },
    },
  }

  const headlineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.1,
      },
    },
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <>
      <section
        ref={heroRef}
        aria-label="Hero Showcase"
        className="relative min-h-[95vh] lg:min-h-screen flex items-center justify-center px-6 overflow-hidden pt-24 pb-16"
      >
        {/* Animated Cinematic Backdrop with Parallax Scale */}
        <motion.div
          style={{ scale: scaleBackdrop }}
          className="absolute inset-0 w-full h-full"
        >
          <HeroBackdrop />
        </motion.div>

        {/* Content with Scroll Parallax */}
        <motion.div
          style={{ y: yContent, opacity: opacityContent }}
          className="relative max-w-5xl mx-auto text-center flex flex-col items-center z-10"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={shouldAnimate ? 'visible' : 'hidden'}
            className="flex flex-col items-center"
          >
            {/* Editor Name / Over-title */}
            <motion.p
              variants={itemVariants}
              className="text-xs sm:text-sm font-heading font-medium tracking-[0.35em] text-muted/90 uppercase mb-6"
            >
              {site.name} — Cinematic Video Editor
            </motion.p>

            {/* Split Text Staggered Headline */}
            <motion.h1
              variants={headlineVariants}
              className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.08] mb-8"
            >
              {taglineWords.map((word, idx) => {
                const isGold = word.toLowerCase().includes('cinema')
                return (
                  <motion.span
                    key={`${word}-${idx}`}
                    variants={wordVariants}
                    className={`inline-block mr-2.5 sm:mr-4 lg:mr-6 last:mr-0 ${
                      isGold
                        ? 'text-accent font-normal drop-shadow-[0_0_35px_rgba(214,174,112,0.45)]'
                        : 'text-text'
                    }`}
                  >
                    {word}
                  </motion.span>
                )
              })}
            </motion.h1>

            {/* Subline */}
            <motion.p
              variants={itemVariants}
              className="text-muted text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-12 tracking-wide font-body leading-relaxed"
            >
              {site.subline}
            </motion.p>

            {/* Interactive CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-5"
            >
              {/* Primary Gold CTA: Watch Showreel */}
              <button
                type="button"
                onClick={() => setShowreelOpen(true)}
                className="group px-8 py-4 rounded-full bg-accent text-bg hover:bg-accent/90 transition-all duration-300 font-heading text-xs sm:text-sm uppercase tracking-widest font-semibold flex items-center gap-3 shadow-[0_0_25px_rgba(214,174,112,0.25)] hover:shadow-[0_0_35px_rgba(214,174,112,0.4)] hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="w-5 h-5 rounded-full bg-bg/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-2.5 h-2.5 fill-current translate-x-0.5 text-bg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                Watch Showreel
              </button>

              {/* Secondary CTA: View Work */}
              <Link
                href="/work"
                data-cursor="view"
                className="px-8 py-4 rounded-full border border-surface bg-surface/50 text-muted hover:text-text hover:border-accent/40 transition-all duration-300 font-heading text-xs sm:text-sm uppercase tracking-widest font-medium backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                View Work
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Animated Scroll Cue */}
        <motion.button
          type="button"
          onClick={handleScrollDown}
          initial={{ opacity: 0 }}
          animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted/60 hover:text-accent transition-colors group cursor-pointer focus:outline-none z-10"
          aria-label="Scroll down to featured work"
        >
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-muted/70 group-hover:text-accent transition-colors">
            Scroll
          </span>
          <div className="w-4 h-7 rounded-full border border-muted/30 group-hover:border-accent/60 flex items-start justify-center p-1 transition-colors">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-1 h-1.5 rounded-full bg-accent"
            />
          </div>
        </motion.button>
      </section>

      {/* Showreel Fullscreen / Cinematic Modal */}
      <Modal
        isOpen={showreelOpen}
        onClose={() => setShowreelOpen(false)}
        title={`${site.name} — Cinematic Showreel`}
        maxWidth="max-w-5xl"
      >
        {/* Iframe is rendered ONLY when modal is open */}
        {showreelOpen && (
          <VideoPlayer
            youtubeId={SHOWREEL_YOUTUBE_ID}
            title={`${site.name} Showreel`}
            muted={true}
            autoPlay={true}
          />
        )}
      </Modal>
    </>
  )
}
