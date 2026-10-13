'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface ColorGradingSliderProps {
  beforeSrc: string
  afterSrc: string
  beforeLabel?: string
  afterLabel?: string
}

export function ColorGradingSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = 'RAW / LOG',
  afterLabel = 'FINAL GRADE',
}: ColorGradingSliderProps) {
  // Slider position in percentage (0 to 100)
  const [sliderPos, setSliderPos] = useState<number>(50)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(percent)
  }, [])

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    updatePosition(e.clientX)
  }

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    if (e.touches[0]) {
      updatePosition(e.touches[0].clientX)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      updatePosition(e.touches[0].clientX)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Global mousemove/mouseup listener while dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      updatePosition(e.clientX)
    }

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, updatePosition])

  // Keyboard accessibility (ArrowLeft, ArrowRight, Home, End)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = 5
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setSliderPos((prev) => Math.max(0, prev - step))
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setSliderPos((prev) => Math.min(100, prev + step))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setSliderPos(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setSliderPos(100)
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label="Color grading before and after comparison slider"
        aria-valuenow={Math.round(sliderPos)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${Math.round(sliderPos)}% raw log, ${Math.round(100 - sliderPos)}% final grade`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-surface/90 cursor-ew-resize select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {/* Layer 1: After Image (Graded / Final look) */}
        <img
          src={afterSrc}
          alt={afterLabel}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Layer 2: Before Image (Raw / Log look), clipped by sliderPos */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={beforeSrc}
            alt={beforeLabel}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{
              // Counteract container clipping so the image maintains its full width
              width: containerRef.current
                ? `${containerRef.current.clientWidth}px`
                : '100vw',
              maxWidth: 'none',
            }}
          />
        </div>

        {/* Left Badge: RAW / LOG */}
        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded bg-bg/80 backdrop-blur-md border border-surface/80 text-[10px] sm:text-xs font-mono tracking-wider text-muted pointer-events-none select-none">
          {beforeLabel}
        </div>

        {/* Right Badge: FINAL GRADE */}
        <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded bg-bg/80 backdrop-blur-md border border-accent/40 text-[10px] sm:text-xs font-mono tracking-wider text-accent pointer-events-none select-none">
          {afterLabel}
        </div>

        {/* Vertical Gold Divider Line */}
        <div
          className="absolute top-0 bottom-0 z-30 w-[2px] bg-accent shadow-[0_0_12px_rgba(214,174,112,0.6)] pointer-events-none transform -translate-x-1/2"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Gold Divider Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-accent bg-surface/95 backdrop-blur-md shadow-[0_0_20px_rgba(214,174,112,0.5)] flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
            <svg
              className="w-4 h-4 text-accent fill-none stroke-current stroke-2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Accessibility / Instructions hint */}
      <div className="flex items-center justify-between text-[11px] font-mono text-muted/70 px-1">
        <span>← Drag or use Left/Right arrow keys →</span>
        <span>{Math.round(sliderPos)}% Log / {Math.round(100 - sliderPos)}% Graded</span>
      </div>
    </div>
  )
}
