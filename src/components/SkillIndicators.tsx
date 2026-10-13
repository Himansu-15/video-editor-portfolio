'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { site } from '@/data/site'

interface SkillItem {
  name: string
  level: string
  percent?: number
}

interface SkillIndicatorsProps {
  skills?: readonly SkillItem[]
  className?: string
}

export function SkillIndicators({
  skills = site.software,
  className = '',
}: SkillIndicatorsProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className={`flex flex-col gap-6 w-full ${className}`}>
      {skills.map((tool, idx) => {
        const percent = tool.percent || (tool.level === 'Expert' ? 95 : 85)

        return (
          <div key={tool.name} className="flex flex-col gap-2.5">
            {/* Header: Name and Level */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="font-heading font-medium text-text tracking-wide text-sm sm:text-base">
                  {tool.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted/70 tracking-wider">
                  {percent}%
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-surface border border-surface/90 text-accent font-medium">
                  {tool.level}
                </span>
              </div>
            </div>

            {/* Animated Meter Track */}
            <div className="w-full h-2 rounded-full bg-surface/70 border border-surface/90 overflow-hidden p-[1px]">
              <motion.div
                initial={shouldReduceMotion ? { width: `${percent}%` } : { width: 0 }}
                whileInView={{ width: `${percent}%` }}
                viewport={{ once: true, margin: '-20px' }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 1.1,
                        delay: idx * 0.15,
                        ease: [0.22, 1, 0.36, 1],
                      }
                }
                className="h-full rounded-full bg-gradient-to-r from-accent/60 via-accent to-accent shadow-[0_0_10px_rgba(214,174,112,0.4)]"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
