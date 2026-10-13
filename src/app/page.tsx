import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { ProjectsShowcase } from '@/components/ProjectsShowcase'
import { ServicesSection } from '@/components/ServicesSection'
import { ProcessTimeline } from '@/components/ProcessTimeline'
import { TestimonialsSlider } from '@/components/TestimonialsSlider'
import { BrandTicker } from '@/components/BrandTicker'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Real API Projects Showcase Section */}
      <section
        id="home-content"
        className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full border-t border-surface/80"
      >
        <ProjectsShowcase
          eyebrow="Selected Projects"
          title="Featured Work"
          limit={4}
          showFilters={false}
          headerAction={
            <Link
              href="/work"
              data-cursor="view"
              className="text-xs uppercase tracking-widest font-medium text-accent hover:underline flex items-center gap-2"
            >
              Explore All Work
              <span aria-hidden="true">→</span>
            </Link>
          }
        />
      </section>

      {/* 3. Craft & Disciplines (Services) Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full border-t border-surface/80">
        <ServicesSection />
      </section>

      {/* 4. Signature Editing Timeline (Process) Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full border-t border-surface/80">
        <ProcessTimeline />
      </section>

      {/* 5. Client Testimonials Slider */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full border-t border-surface/80">
        <TestimonialsSlider />
      </section>

      {/* 6. Trusted Brands & Creators Infinite Marquee */}
      <section
        aria-label="Trusted Clients"
        className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full border-t border-surface/80 overflow-hidden"
      >
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted font-medium">
            Trusted By Brands & Creators Worldwide
          </p>
        </div>
        <BrandTicker />
      </section>
    </main>
  )
}