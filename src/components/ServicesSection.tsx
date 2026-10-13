'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { site } from '@/data/site'
import { SectionHeader } from '@/components/SectionHeader'

interface ServicesSectionProps {
  showHeader?: boolean
  showAction?: boolean
  className?: string
}

export function ServicesSection({
  showHeader = true,
  showAction = true,
  className = '',
}: ServicesSectionProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section aria-label="Services and Craft" className={`w-full ${className}`}>
      {showHeader && (
        <SectionHeader
          eyebrow="Capabilities"
          title="Craft & Disciplines"
          description="Transforming raw place footage into immersive cinema through three core pillars of post-production."
          action={
            showAction ? (
              <Link
                href="/services"
                className="text-xs uppercase tracking-widest font-medium text-accent hover:underline flex items-center gap-2 group"
              >
                <span>All Capabilities</span>
                <span className="transform transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ) : undefined
          }
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {site.services.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.6,
                    delay: idx * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }
            }
            className="group relative rounded-2xl bg-surface/40 border border-surface/80 p-8 sm:p-10 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:bg-surface/65 hover:border-surface hover:-translate-y-1.5 shadow-lg"
          >
            {/* Top Gold Accent Line (animates on hover) */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left shadow-[0_0_12px_rgba(214,174,112,0.8)]" />

            {/* Header: Number and Subtitle */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-xs text-accent tracking-widest font-medium">
                  0{idx + 1}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent transition-colors" />
              </div>

              {/* Title */}
              <h3 className="font-heading text-2xl sm:text-3xl font-light text-text mb-4 group-hover:text-accent transition-colors duration-200">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted leading-relaxed font-body">
                {service.description}
              </p>
            </div>

            {/* Bottom Card Footer */}
            <div className="pt-8 mt-6 border-t border-surface/70 flex items-center justify-between text-xs font-mono text-muted/60 group-hover:text-muted transition-colors">
              <span className="uppercase tracking-wider">Discipline {idx + 1}</span>
              <span className="text-accent group-hover:translate-x-1 transition-transform">Explore ↗</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
