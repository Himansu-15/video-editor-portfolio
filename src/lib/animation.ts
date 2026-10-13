export const EASINGS = {
  cinema: [0.22, 1, 0.36, 1] as const,
  smooth: [0.25, 0.46, 0.45, 0.94] as const,
  gentle: [0.16, 1, 0.3, 1] as const,
} as const

export const DURATIONS = {
  fast: 0.25,
  base: 0.5,
  slow: 0.85,
  cinema: 1.1,
} as const

export const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.base,
      ease: EASINGS.cinema,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: DURATIONS.fast,
      ease: EASINGS.smooth,
    },
  },
}

export const staggerContainer = (staggerChildren = 0.12, delayChildren = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
})

export const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.slow,
      ease: EASINGS.cinema,
    },
  },
}

export const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATIONS.base,
      ease: EASINGS.cinema,
    },
  },
}
