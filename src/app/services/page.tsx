import { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Services & Process — Abhijeet',
  description: 'Precision editing, cinematic color grading, and motion design workflow.',
}

export default function ServicesPage() {
  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Header */}
      <header className="mb-20 md:mb-28">
        <p className="text-xs uppercase tracking-widest text-accent font-medium mb-3">
          Capabilities
        </p>
        <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-text mb-6">
          Services & Craft
        </h1>
        <p className="text-muted text-base md:text-lg max-w-2xl leading-relaxed">
          {site.subline} Every cut has a rhythm. Every grade sets an atmosphere.
        </p>
      </header>

      {/* Services Grid */}
      <section aria-label="Services List" className="mb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {site.services.map((service, idx) => (
            <div
              key={service.id}
              id={service.id}
              className="p-8 rounded-xl bg-surface/40 border border-surface/80 flex flex-col justify-between transition-all duration-300 hover:border-accent/40"
            >
              <div>
                <span className="font-mono text-xs text-accent block mb-6">
                  0{idx + 1}
                </span>
                <h2 className="font-heading text-2xl font-medium text-text mb-4">
                  {service.title}
                </h2>
                <p className="text-sm text-muted leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div className="pt-8 mt-8 border-t border-surface/60">
                <Link
                  href="/contact"
                  className="text-xs uppercase tracking-widest font-medium text-accent hover:underline flex items-center gap-1.5"
                >
                  Inquire
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Software & Tools */}
      <section aria-label="Software Expertise" className="mb-28 pt-12 border-t border-surface/60">
        <p className="text-xs uppercase tracking-widest text-accent font-medium mb-8">
          Tools & Post-Production Suite
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {site.software.map((tool) => (
            <div
              key={tool.name}
              className="p-6 rounded-lg bg-surface/20 border border-surface/60 flex items-center justify-between"
            >
              <span className="font-heading text-lg font-medium text-text">
                {tool.name}
              </span>
              <span className="text-xs uppercase tracking-wider font-mono text-accent/80 border border-accent/20 px-2.5 py-1 rounded">
                {tool.level}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5-Step Process */}
      <section aria-label="Workflow Process" className="pt-12 border-t border-surface/60">
        <p className="text-xs uppercase tracking-widest text-accent font-medium mb-12">
          The 5-Step Workflow
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {site.process.map((step) => (
            <div
              key={step.step}
              className="p-6 rounded-lg bg-surface/30 border border-surface/60 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs text-accent block mb-4">
                  Step 0{step.step}
                </span>
                <h3 className="font-heading text-lg font-medium text-text mb-3">
                  {step.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
