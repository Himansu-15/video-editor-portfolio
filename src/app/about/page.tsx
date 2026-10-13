import { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/data/site'
import { SectionHeader } from '@/components/SectionHeader'
import { PortraitPlaceholder } from '@/components/PortraitPlaceholder'
import { SkillIndicators } from '@/components/SkillIndicators'
import { BrandTicker } from '@/components/BrandTicker'

export const metadata: Metadata = {
  title: `About — ${site.name}`,
  description: site.bio,
}

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col gap-24">
      {/* 1. Header */}
      <header>
        <SectionHeader
          eyebrow="Behind The Cut"
          title={`About ${site.name}`}
          description={site.tagline}
        />
      </header>

      {/* 2. Narrative & Portrait Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Styled Portrait Frame Placeholder */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <PortraitPlaceholder alt={`${site.name} — Cinematic Video Editor`} />
          <div className="text-center font-mono text-[11px] text-muted/60 uppercase tracking-wider">
            {site.subline}
          </div>
        </div>

        {/* Right Column: Bio Narrative & Software Skills */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          {/* Bio text directly from site.ts */}
          <div className="flex flex-col gap-5 text-muted text-base sm:text-lg leading-relaxed">
            <p className="text-text font-normal text-lg sm:text-xl leading-relaxed">
              {site.bio}
            </p>
            {site.aboutNarrative &&
              site.aboutNarrative.map((paragraph, idx) => (
                <p key={idx} className="font-light">
                  {paragraph}
                </p>
              ))}
          </div>

          {/* Software Skills with Animated Skill Indicators */}
          <div className="pt-8 border-t border-surface/80 flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-accent font-medium mb-1.5">
                Toolkit & Software
              </p>
              <h3 className="font-heading text-xl sm:text-2xl font-light text-text">
                Post-Production Suite
              </h3>
            </div>

            <SkillIndicators />
          </div>

          {/* Direct Collaboration CTA */}
          <div className="p-8 rounded-2xl bg-surface/30 border border-surface/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h4 className="font-heading text-lg font-medium text-text mb-1">
                Have a place to cut into cinema?
              </h4>
              <p className="text-xs text-muted">
                Available for commercial travel films, documentaries, and narrative projects.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 px-6 py-3 rounded-full bg-accent text-bg font-heading text-xs uppercase tracking-widest font-medium hover:bg-accent/90 transition-all text-center shadow-[0_0_20px_rgba(214,174,112,0.3)]"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Trusted By Brands & Creators Marquee */}
      <section aria-label="Clients" className="pt-12 border-t border-surface/60 overflow-hidden">
        <p className="text-xs uppercase tracking-widest text-muted font-medium mb-8">
          Trusted By Brands & Creators Worldwide
        </p>
        <BrandTicker />
      </section>
    </div>
  )
}
