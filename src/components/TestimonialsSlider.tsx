'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { site } from '@/data/site'
import { SectionHeader } from '@/components/SectionHeader'

interface TestimonialsSliderProps {
  showHeader?: boolean
  className?: string
}

export function TestimonialsSlider({
  showHeader = true,
  className = '',
}: TestimonialsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [direction, setDirection] = useState<number>(1)

  const items = site.testimonials
  const total = items.length

  const handleNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % total)
  }, [total])

  const handlePrev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  // Touch / Drag swipe handler
  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 40
    if (info.offset.x < -threshold) {
      handleNext()
    } else if (info.offset.x > threshold) {
      handlePrev()
    }
  }

  const currentItem = items[currentIndex] || items[0]

  return (
    <section aria-label="Client Testimonials" className={`w-full ${className}`}>
      {showHeader && (
        <SectionHeader
          eyebrow="Endorsements"
          title="Client Words"
          description="Reflections from directors, creators, and brands who trusted the cut."
        />
      )}

      <div className="relative w-full max-w-4xl mx-auto rounded-2xl bg-surface/40 border border-surface/80 p-8 sm:p-14 overflow-hidden backdrop-blur-sm shadow-xl">
        {/* Subtle background decorative quote mark */}
        <div
          className="absolute -top-6 -right-4 font-heading text-[160px] sm:text-[220px] font-bold text-surface/50 pointer-events-none select-none leading-none z-0"
          aria-hidden="true"
        >
          “
        </div>

        {/* Swipeable Testimonial Card */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="relative z-10 cursor-grab active:cursor-grabbing"
          aria-roledescription="carousel"
          aria-label={`Testimonial ${currentIndex + 1} of ${total}`}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.blockquote
              key={currentItem.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-8"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>Verified Client Feedback</span>
              </div>

              <p className="font-heading text-xl sm:text-3xl font-light text-text/95 leading-relaxed italic">
                "{currentItem.quote}"
              </p>

              <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-surface/70 pt-6">
                <div>
                  <cite className="not-italic font-heading text-base sm:text-lg font-medium text-text block">
                    {currentItem.author}
                  </cite>
                  <span className="text-xs sm:text-sm font-mono text-muted">
                    {currentItem.role}
                  </span>
                </div>

                <div className="text-xs font-mono text-muted/60 tracking-wider">
                  0{currentIndex + 1} / 0{total}
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </motion.div>

        {/* Carousel Navigation Controls */}
        <div className="relative z-10 flex items-center justify-between mt-8 pt-4 border-t border-surface/60">
          {/* Progress Indicators */}
          <div className="flex items-center gap-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1)
                  setCurrentIndex(idx)
                }}
                aria-label={`Go to testimonial ${idx + 1}`}
                className="p-3 flex items-center justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-full"
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 block ${
                    currentIndex === idx
                      ? 'w-8 bg-accent'
                      : 'w-2.5 bg-surface/90 hover:bg-muted'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Testimonial"
              className="w-10 h-10 rounded-full border border-surface/90 bg-surface/60 hover:border-accent hover:text-accent text-text flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Testimonial"
              className="w-10 h-10 rounded-full border border-surface/90 bg-surface/60 hover:border-accent hover:text-accent text-text flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
