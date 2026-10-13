'use client'

import { motion } from 'framer-motion'

interface HeroBackdropProps {
  /** Optional video source for hero loop reel. When provided, replaces the animated gradient with the video loop. */
  videoSrc?: string
}

export function HeroBackdrop({ videoSrc }: HeroBackdropProps) {
  if (videoSrc) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40 scale-105"
        />
        {/* Cinematic dark vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/80" />
        <div className="absolute inset-0 bg-radial-vignette" />
      </div>
    )
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-bg"
      aria-hidden="true"
    >
      {/* 1. Base dark atmospheric gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#161619_0%,_#0B0B0D_70%)]" />

      {/* 2. Drifting soft champagne gold ambient sweep */}
      <motion.div
        animate={{
          x: ['-15%', '15%', '-15%'],
          y: ['-10%', '12%', '-10%'],
          scale: [1, 1.15, 1],
          opacity: [0.18, 0.28, 0.18],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] md:w-[950px] md:h-[950px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(214, 174, 112, 0.35) 0%, rgba(214, 174, 112, 0.08) 45%, transparent 70%)',
        }}
      />

      {/* 3. Secondary subtle drifting gold highlight */}
      <motion.div
        animate={{
          x: ['20%', '-20%', '20%'],
          y: ['15%', '-15%', '15%'],
          opacity: [0.08, 0.18, 0.08],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(214, 174, 112, 0.25) 0%, rgba(23, 23, 25, 0.1) 50%, transparent 70%)',
        }}
      />

      {/* 4. Film edge vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_#0B0B0D_95%)]" />

      {/* 5. Bottom seamless fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-bg via-bg/80 to-transparent" />
    </div>
  )
}
