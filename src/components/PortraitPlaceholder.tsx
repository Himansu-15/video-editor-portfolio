'use client'

import { motion } from 'framer-motion'

interface PortraitPlaceholderProps {
  className?: string
  alt?: string
}

export function PortraitPlaceholder({
  className = '',
  alt = 'Abhijeet — Cinematic Video Editor',
}: PortraitPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative aspect-[4/5] w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-surface/50 border border-surface/90 shadow-2xl flex flex-col justify-between p-6 sm:p-8 select-none group ${className}`}
    >
      {/* Background ambient lighting & film vignette */}
      <div className="absolute inset-0 bg-gradient-to-tr from-bg via-surface/40 to-surface/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(214,174,112,0.12),transparent_65%)]" />

      {/* Stylized Silhouette / Monogram Core */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0.8, scale: 0.98 }}
          animate={{ opacity: [0.8, 1, 0.8], scale: [0.98, 1.01, 0.98] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex flex-col items-center justify-center"
        >
          {/* Subtle Silhouette Hex / Crest */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-accent/30 bg-surface/80 backdrop-blur-md flex items-center justify-center shadow-[0_0_35px_rgba(214,174,112,0.15)] group-hover:border-accent/60 group-hover:shadow-[0_0_45px_rgba(214,174,112,0.25)] transition-all duration-500">
            <span className="font-heading text-5xl sm:text-6xl font-extralight text-text tracking-tighter">
              A
            </span>
          </div>

          {/* Subtext */}
          <span className="mt-4 font-mono text-[10px] sm:text-xs tracking-widest text-muted/70 uppercase">
            Frame Placeholder
          </span>
        </motion.div>
      </div>

      {/* Viewfinder Reticles — Top Corners */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono tracking-wider text-muted/70">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-text/90 font-medium">REC [24.00 FPS]</span>
        </div>
        <div className="text-accent/90">
          LOG-C / 10-BIT
        </div>
      </div>

      {/* Viewfinder Reticles — Bottom Corners */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono tracking-wider text-muted/60 border-t border-surface/70 pt-4">
        <div>35mm T1.5 • ISO 800</div>
        <div>EDIT SUITE • 01</div>
      </div>

      {/* Gold Corner Frame Brackets */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-accent/60 pointer-events-none" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-accent/60 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-accent/60 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-accent/60 pointer-events-none" />
    </div>
  )
}
