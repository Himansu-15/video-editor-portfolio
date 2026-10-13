'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { site } from '@/data/site'
import { SectionHeader } from '@/components/SectionHeader'

const TRACKS = [
  { id: 'v3', name: 'V3', label: 'GFX / TITLES', height: 'h-6' },
  { id: 'v2', name: 'V2', label: 'B-ROLL & CUTS', height: 'h-7' },
  { id: 'v1', name: 'V1', label: 'NARRATIVE ARC', height: 'h-10' },
  { id: 'a1', name: 'A1', label: 'SFX & FOLEY', height: 'h-6' },
  { id: 'a2', name: 'A2', label: 'CINEMA SCORE', height: 'h-7' },
]

export function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)

  // Track scroll progress through the pinned container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Calculate playhead position from 2% to 98%
  const playheadX = useTransform(scrollYProgress, [0, 1], ['2%', '98%'])

  useEffect(() => {
    if (shouldReduceMotion) return

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Map scroll progress (0..1) to step index (0..4)
      const count = site.process.length
      const index = Math.min(count - 1, Math.floor(latest * count))
      setActiveStepIndex(index)
    })

    return () => unsubscribe()
  }, [scrollYProgress, shouldReduceMotion])

  const activeStep = site.process[activeStepIndex] || site.process[0]

  return (
    <section
      ref={containerRef}
      id="process-timeline"
      aria-label="Editorial Process Timeline"
      className={
        shouldReduceMotion
          ? 'w-full py-16'
          : 'relative w-full h-[280vh]' // Scroll runway for timeline scrub
      }
    >
      <div
        className={
          shouldReduceMotion
            ? 'w-full'
            : 'sticky top-20 sm:top-24 w-full flex flex-col justify-between py-6'
        }
      >
        <SectionHeader
          eyebrow="Workflow & Methodology"
          title="The Edit Suite Process"
          description="A precision timeline where every stage of post-production locks into the narrative heartbeat."
        />

        {/* --- 1. SIGNATURE VIDEO EDITOR TIMELINE GRAPHIC --- */}
        <div className="w-full rounded-2xl bg-surface/50 border border-surface/90 shadow-2xl p-4 sm:p-7 flex flex-col gap-5 overflow-hidden backdrop-blur-md">
          {/* Timeline Header Bar: Timecode & Transport status */}
          <div className="flex items-center justify-between border-b border-surface/80 pb-3 font-mono text-[11px] sm:text-xs">
            <div className="flex items-center gap-2 text-text">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
              <span className="tracking-widest uppercase font-semibold text-accent">
                PLAYHEAD: {activeStep.timecode || '00:00:24:00'}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-6 text-muted/70">
              <span>PROJECT: {site.name.toUpperCase()}_TIMELINE.PRPROJ</span>
              <span>24.00 FPS • PRORES 4444</span>
            </div>

            <div className="text-muted/80 text-[10px] sm:text-xs font-mono uppercase">
              STEP {activeStepIndex + 1} OF {site.process.length}
            </div>
          </div>

          {/* Timecode Ruler */}
          <div className="relative w-full h-7 border-b border-surface/80 flex items-end justify-between font-mono text-[9px] sm:text-[11px] text-muted/60 select-none pb-1">
            <span>00:00:00</span>
            <span>00:00:15</span>
            <span>00:00:30</span>
            <span>00:00:45</span>
            <span>00:01:00</span>
          </div>

          {/* Multi-Track Visual Timeline Canvas with Scrubbing Playhead */}
          <div className="relative w-full flex flex-col gap-1.5 select-none overflow-hidden">
            {/* The Gold Playhead Needle */}
            {!shouldReduceMotion && (
              <motion.div
                style={{ left: playheadX }}
                className="absolute top-0 bottom-0 z-30 w-[2px] bg-accent pointer-events-none shadow-[0_0_14px_rgba(214,174,112,0.9)] transform -translate-x-1/2"
              >
                {/* Playhead Marker Head */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-accent border border-bg shadow-[0_0_10px_rgba(214,174,112,0.8)]" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent" />
              </motion.div>
            )}

            {/* TRACK V3: Titles & Overlays */}
            <div className="flex items-center gap-2">
              <span className="w-7 sm:w-10 shrink-0 font-mono text-[9px] sm:text-[10px] text-muted/50 text-right">
                V3
              </span>
              <div className="relative w-full h-6 rounded bg-surface/60 border border-surface/70 flex items-center px-1 overflow-hidden">
                <div
                  className={`absolute left-[60%] w-[35%] h-4 rounded px-2 text-[9px] font-mono flex items-center transition-all duration-300 ${
                    activeStepIndex >= 3
                      ? 'bg-accent/25 border border-accent/50 text-accent font-medium shadow-[0_0_10px_rgba(214,174,112,0.2)]'
                      : 'bg-surface/90 border border-surface/80 text-muted/60'
                  }`}
                >
                  Motion Overlays
                </div>
              </div>
            </div>

            {/* TRACK V2: B-Roll & Visual Transitions */}
            <div className="flex items-center gap-2">
              <span className="w-7 sm:w-10 shrink-0 font-mono text-[9px] sm:text-[10px] text-muted/50 text-right">
                V2
              </span>
              <div className="relative w-full h-7 rounded bg-surface/60 border border-surface/70 flex items-center px-1 overflow-hidden gap-1">
                <div
                  className={`w-[28%] h-5 rounded px-2 text-[9px] font-mono flex items-center transition-all duration-300 ${
                    activeStepIndex >= 0
                      ? 'bg-surface/90 border border-surface text-text/80'
                      : 'bg-surface/50 text-muted/40'
                  }`}
                >
                  A-Roll Selects
                </div>
                <div
                  className={`w-[45%] h-5 rounded px-2 text-[9px] font-mono flex items-center transition-all duration-300 ${
                    activeStepIndex >= 1
                      ? 'bg-accent/20 border border-accent/40 text-accent font-medium'
                      : 'bg-surface/50 text-muted/40'
                  }`}
                >
                  Rhythm Cutaways
                </div>
              </div>
            </div>

            {/* TRACK V1: Master Narrative Track (Divided into the 5 Process Steps) */}
            <div className="flex items-center gap-2">
              <span className="w-7 sm:w-10 shrink-0 font-mono text-[9px] sm:text-[10px] text-accent/80 font-bold text-right">
                V1
              </span>
              <div className="w-full h-12 sm:h-14 rounded-lg bg-surface/80 border border-surface flex items-stretch p-0.5 gap-1 overflow-hidden">
                {site.process.map((step, idx) => {
                  const isActive = activeStepIndex === idx
                  const isPassed = activeStepIndex > idx

                  return (
                    <button
                      key={step.step}
                      type="button"
                      onClick={() => setActiveStepIndex(idx)}
                      className={`relative flex-1 rounded px-2 py-1.5 flex flex-col justify-between transition-all duration-300 text-left overflow-hidden cursor-pointer ${
                        isActive
                          ? 'bg-accent/25 border-2 border-accent text-accent shadow-[0_0_15px_rgba(214,174,112,0.3)]'
                          : isPassed
                          ? 'bg-surface/90 border border-accent/30 text-text/90'
                          : 'bg-surface/40 border border-surface/60 text-muted/50 hover:bg-surface/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-[10px] sm:text-xs font-medium tracking-wide truncate">
                          {step.title}
                        </span>
                        <span className="font-mono text-[9px] text-accent/70 hidden sm:inline">
                          0{step.step}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-muted/70 truncate hidden sm:block">
                        {step.timecode}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* TRACK A1: Sound & Foley Waveform */}
            <div className="flex items-center gap-2">
              <span className="w-7 sm:w-10 shrink-0 font-mono text-[9px] sm:text-[10px] text-muted/50 text-right">
                A1
              </span>
              <div className="w-full h-6 rounded bg-surface/50 border border-surface/70 flex items-center px-2 relative overflow-hidden">
                <div className="w-full flex items-center justify-between gap-[2px] opacity-40">
                  {Array.from({ length: 44 }).map((_, i) => (
                    <span
                      key={i}
                      style={{ height: `${20 + ((i * 19) % 65)}%` }}
                      className={`w-[1.5px] rounded-full transition-colors ${
                        activeStepIndex >= 4 ? 'bg-accent' : 'bg-muted/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* TRACK A2: Cinema Master Score */}
            <div className="flex items-center gap-2">
              <span className="w-7 sm:w-10 shrink-0 font-mono text-[9px] sm:text-[10px] text-muted/50 text-right">
                A2
              </span>
              <div className="w-full h-7 rounded bg-surface/50 border border-surface/70 flex items-center px-2 relative overflow-hidden">
                <div className="w-full flex items-center justify-between gap-[2px] opacity-45">
                  {Array.from({ length: 44 }).map((_, i) => (
                    <span
                      key={i}
                      style={{ height: `${30 + ((i * 11) % 55)}%` }}
                      className="w-[1.5px] bg-accent/60 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 2. DYNAMIC HIGHLIGHTED PROCESS STEP CARD --- */}
        <div className="mt-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4">
            {site.process.map((item, idx) => {
              const isActive = activeStepIndex === idx

              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-3 ${
                    isActive
                      ? 'bg-surface/80 border-accent shadow-[0_0_20px_rgba(214,174,112,0.25)] -translate-y-1'
                      : 'bg-surface/30 border-surface/80 hover:border-surface hover:bg-surface/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-accent">
                        0{item.step}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                      )}
                    </div>
                    <h3
                      className={`font-heading text-sm sm:text-base font-medium mb-1.5 transition-colors ${
                        isActive ? 'text-text' : 'text-text/75'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <span className="font-mono text-[10px] text-muted/60 tracking-wider">
                    {item.timecode}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
