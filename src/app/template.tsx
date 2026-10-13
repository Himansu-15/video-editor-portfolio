'use client'

import { motion } from 'framer-motion'
import { pageTransitionVariants } from '@/lib/animation'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  )
}
