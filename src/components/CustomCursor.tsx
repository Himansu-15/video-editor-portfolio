'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

type CursorState = 'default' | 'hover' | 'play' | 'view'

export function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(true)
  const [cursorVisible, setCursorVisible] = useState(false)
  const [cursorState, setCursorState] = useState<CursorState>('default')

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Lagging physics spring for the outer ring
  const springConfig = { damping: 28, stiffness: 220, mass: 0.5 }
  const ringX = useSpring(mouseX, springConfig)
  const ringY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Disable on touch devices, coarse pointers, or if reduced-motion is preferred
    const isTouchOrReduced =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0

    if (isTouchOrReduced) {
      setIsTouchDevice(true)
      return
    }

    setIsTouchDevice(false)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!cursorVisible) setCursorVisible(true)

      // Detect cursor state from target or closest ancestor
      const target = (e.target as HTMLElement | null)?.closest(
        '[data-cursor], a, button, input, textarea, [role="button"]'
      ) as HTMLElement | null

      if (!target) {
        setCursorState('default')
        return
      }

      const customAttr = target.getAttribute('data-cursor')?.toLowerCase()
      if (customAttr === 'play') {
        setCursorState('play')
      } else if (customAttr === 'view') {
        setCursorState('view')
      } else {
        setCursorState('hover')
      }
    }

    const handleMouseLeave = () => {
      setCursorVisible(false)
    }

    const handleMouseEnter = () => {
      setCursorVisible(true)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    document.documentElement.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [cursorVisible, mouseX, mouseY])

  if (isTouchDevice) return null

  // Ring dimensions and styles based on state
  const isExpanded = cursorState === 'play' || cursorState === 'view'
  const isHovered = cursorState === 'hover'

  const ringSize = isExpanded ? 76 : isHovered ? 44 : 32
  const ringOffset = ringSize / 2

  return (
    <>
      {/* 1. Small Ivory Dot (follows mouse directly, hides when showing text) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-text shadow-[0_0_8px_rgba(244,241,235,0.4)]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: -3,
          translateY: -3,
          width: 6,
          height: 6,
          opacity: cursorVisible && !isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* 2. Lagging Champagne Gold Ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9998] flex items-center justify-center rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: -ringOffset,
          translateY: -ringOffset,
          width: ringSize,
          height: ringSize,
          opacity: cursorVisible ? 1 : 0,
          borderColor: isExpanded
            ? 'var(--color-accent)'
            : isHovered
            ? 'rgba(214, 174, 112, 0.9)'
            : 'rgba(214, 174, 112, 0.55)',
          backgroundColor: isExpanded
            ? 'rgba(23, 23, 25, 0.92)'
            : 'transparent',
          backdropFilter: isExpanded ? 'blur(4px)' : 'none',
        }}
        animate={{
          scale: 1,
        }}
        transition={{
          width: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
          height: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="font-heading text-[10px] font-bold tracking-widest text-accent uppercase select-none"
          >
            {cursorState === 'play' ? 'PLAY' : 'VIEW'}
          </motion.span>
        )}
      </motion.div>
    </>
  )
}
