import { Metadata } from 'next'
import { site } from '@/data/site'
import { ProjectsShowcase } from '@/components/ProjectsShowcase'
import { BrandTicker } from '@/components/BrandTicker'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Selected Work — Abhijeet',
  description: 'Cinematic video edits, color grading, and motion graphics for places around the globe.',
}

export default function WorkPage() {
  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Header */}
      <header className="mb-14 md:mb-20">
        <p className="text-xs uppercase tracking-widest text-accent font-medium mb-3">
          Portfolio
        </p>
        <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-text mb-6">
          Selected Work
        </h1>
        <p className="text-muted text-base md:text-lg max-w-2xl leading-relaxed">
          {site.bio}
        </p>
      </header>

      {/* Video Showcase fed by real API with Dual Filters */}
      <section aria-label="Video Showcase" className="mb-24">
        <ProjectsShowcase showFilters={true} />
      </section>

      {/* Clients Continuous Marquee */}
      <section aria-label="Clients" className="mb-24 pt-12 border-t border-surface/60 overflow-hidden">
        <p className="text-xs uppercase tracking-widest text-muted font-medium mb-8">
          Trusted By Brands & Creators
        </p>
        <BrandTicker />
      </section>

      {/* Testimonials */}
      <section aria-label="Testimonials" className="pt-12 border-t border-surface/60">
        <p className="text-xs uppercase tracking-widest text-accent font-medium mb-10">
          Client Words
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {site.testimonials.map((item) => (
            <blockquote
              key={item.id}
              className="p-8 rounded-xl bg-surface/30 border border-surface/80 flex flex-col justify-between gap-6"
            >
              <p className="text-sm text-text/90 italic leading-relaxed">
                "{item.quote}"
              </p>
              <footer className="text-xs">
                <cite className="not-italic font-medium text-accent block">
                  {item.author}
                </cite>
                <span className="text-muted">{item.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  )
}
