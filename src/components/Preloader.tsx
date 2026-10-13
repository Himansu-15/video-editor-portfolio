'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PRELOADER_KEY = 'abhijeet-preloader-shown'

export function Preloader() {
  const [isVisible, setIsVisible] = useState(true)
  const [logoFound, setLogoFound] = useState(false)

  useEffect(() => {
    try {
      const isForced = window.location.search.includes('preloader=1')
      if (!isForced && sessionStorage.getItem(PRELOADER_KEY) === 'true') {
        setIsVisible(false)
        window.dispatchEvent(new CustomEvent('site-reveal'))
        return
      }
    } catch {
      // sessionStorage unavailable
    }

    // Cinematic hold before smooth fade out
    const timer = setTimeout(() => {
      // Notify hero to start transition into view right as preloader begins dissolving
      window.dispatchEvent(new CustomEvent('site-reveal'))
      setIsVisible(false)
    }, 1100)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const handleExitComplete = () => {
    try {
      sessionStorage.setItem(PRELOADER_KEY, 'true')
      document.documentElement.classList.add('preloader-done')
    } catch {
      // sessionStorage unavailable
    }
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && (
        <motion.div
          id="preloader-root"
          aria-label="Loading Abhijeet Portfolio"
          aria-live="polite"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg pointer-events-none select-none"
        >
          <motion.div
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center"
          >
            {logoFound ? (
              <motion.img
                src="/logo.png"
                alt="Abhijeet"
                width={120}
                height={120}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="drop-shadow-[0_0_35px_rgba(214,174,112,0.3)]"
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <motion.span
                  initial={{ opacity: 0, letterSpacing: '0.25em' }}
                  animate={{ opacity: 1, letterSpacing: '0.45em' }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium tracking-[0.45em] text-text pl-[0.45em] uppercase"
                >
                  ABHIJEET
                </motion.span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="h-[1px] w-14 bg-accent/60 origin-center"
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}