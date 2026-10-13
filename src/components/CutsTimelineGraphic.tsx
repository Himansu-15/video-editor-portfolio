'use client'

import { motion } from 'framer-motion'

interface CutSegment {
  id: string
  name: string
  width: string // percentage or flex
  type: 'establishing' | 'action' | 'montage' | 'climax' | 'resolve'
  time: string
}

const CUTS: CutSegment[] = [
  { id: '1', name: 'Intro / Establish', width: '22%', type: 'establishing', time: '00:00 - 00:13' },
  { id: '2', name: 'Rhythm Hook', width: '16%', type: 'action', time: '00:13 - 00:23' },
  { id: '3', name: 'Atmospheric Flow', width: '26%', type: 'montage', time: '00:23 - 00:39' },
  { id: '4', name: 'Visual Climax', width: '18%', type: 'climax', time: '00:39 - 00:50' },
  { id: '5', name: 'Resolve / Outro', width: '18%', type: 'resolve', time: '00:50 - 01:00' },
]

const MARKERS = [
  { label: 'Narrative Hook', time: '00:13', left: '22%' },
  { label: 'Beat Drop / Cut', time: '00:23', left: '38%' },
  { label: 'Mood Shift', time: '00:39', left: '64%' },
  { label: 'Climax Cut', time: '00:50', left: '82%' },
]

export function CutsTimelineGraphic() {
  return (
    <div className="w-full rounded-xl bg-surface/40 border border-surface/80 p-5 sm:p-7 flex flex-col gap-6 overflow-hidden">
      {/* Top Header & Timecode Ruler */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-muted/70 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>Editorial Timeline — 24.00 fps</span>
          </div>
          <span>Total Run: 01:00:00</span>
        </div>

        {/* Ruler ticks & timecode stamps */}
        <div className="relative w-full h-6 border-b border-surface/80 flex items-end justify-between font-mono text-[9px] sm:text-[10px] text-muted/50 select-none pb-1">
          <span>00:00:00</span>
          <span>00:00:15</span>
          <span>00:00:30</span>
          <span>00:00:45</span>
          <span>00:01:00</span>
        </div>
      </div>

      {/* Timeline Graphic Area with Animated Playhead */}
      <div className="relative w-full flex flex-col gap-2">
        {/* Animated Playhead sweeping smoothly across */}
        <motion.div
          animate={{
            left: ['0%', '100%'],
          }}
          transition={{
            duration: 8,
            ease: 'linear',
            repeat: Infinity,
          }}
          className="absolute top-0 bottom-0 z-20 w-[1.5px] bg-accent pointer-events-none shadow-[0_0_8px_rgba(214,174,112,0.8)]"
        >
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-accent" />
        </motion.div>

        {/* Video Track 2: Overlays / Text */}
        <div className="flex items-center gap-2">
          <span className="w-8 shrink-0 text-[10px] font-mono text-muted/60 text-right">V2</span>
          <div className="relative w-full h-5 rounded bg-surface/60 flex items-center overflow-hidden border border-surface/60">
            <div className="absolute left-[20%] w-[18%] h-3.5 rounded bg-accent/20 border border-accent/40 text-[9px] font-mono text-accent flex items-center px-1.5 truncate">
              Lower Third
            </div>
            <div className="absolute left-[62%] w-[20%] h-3.5 rounded bg-accent/20 border border-accent/40 text-[9px] font-mono text-accent flex items-center px-1.5 truncate">
              Location Stamp
            </div>
          </div>
        </div>

        {/* Video Track 1: Narrative Cuts */}
        <div className="flex items-center gap-2">
          <span className="w-8 shrink-0 text-[10px] font-mono text-muted/60 text-right">V1</span>
          <div className="w-full h-11 sm:h-12 rounded bg-surface/70 flex items-stretch overflow-hidden border border-surface/80 p-0.5 gap-0.5">
            {CUTS.map((cut) => {
              const isHighlight = cut.type === 'action' || cut.type === 'climax'
              return (
                <div
                  key={cut.id}
                  style={{ width: cut.width }}
                  className={`relative h-full rounded px-2 py-1 flex flex-col justify-between transition-colors overflow-hidden ${
                    isHighlight
                      ? 'bg-accent/15 border border-accent/40 text-accent'
                      : 'bg-surface/90 border border-surface/70 text-text/80'
                  }`}
                >
                  <span className="text-[10px] sm:text-[11px] font-heading font-medium tracking-wide truncate">
                    {cut.name}
                  </span>
                  <span className="text-[9px] font-mono text-muted/80 truncate">
                    {cut.time}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Audio Track 1: Master Score / Ambience */}
        <div className="flex items-center gap-2">
          <span className="w-8 shrink-0 text-[10px] font-mono text-muted/60 text-right">A1</span>
          <div className="w-full h-6 rounded bg-surface/50 border border-surface/60 flex items-center px-2 relative overflow-hidden">
            {/* Audio Waveform Simulator */}
            <div className="w-full flex items-center justify-between gap-[2px] opacity-40">
              {Array.from({ length: 48 }).map((_, i) => {
                const height = 20 + ((i * 13) % 70)
                return (
                  <span
                    key={i}
                    style={{ height: `${height}%` }}
                    className="w-[1.5px] bg-accent/70 rounded-full"
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Markers Legend */}
      <div className="pt-2 border-t border-surface/60 flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] font-mono text-muted">
        <span className="uppercase text-muted/50 tracking-wider">Markers:</span>
        {MARKERS.map((m, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-text/90 font-medium">{m.time}</span>
            <span className="text-muted/70">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
