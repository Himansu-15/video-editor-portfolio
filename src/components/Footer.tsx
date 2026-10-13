import Link from 'next/link'
import { site } from '@/data/site'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-bg border-t border-surface/80 pt-20 pb-12 px-6 md:px-12 text-muted">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-surface/60">
          {/* Brand info */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <span className="font-heading text-2xl font-light tracking-[0.2em] text-text uppercase">
              {site.name}
            </span>
            <p className="font-heading text-accent text-sm tracking-wider uppercase">
              {site.tagline}
            </p>
            <p className="text-xs text-muted max-w-sm leading-relaxed">
              {site.subline}
            </p>
            <p className="text-xs text-muted/70 max-w-md pt-2">
              Transforming raw footage of places into immersive cinematic narratives with rhythmic cuts, precision grading, and subtle motion graphics.
            </p>
          </div>

          {/* Services */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-semibold tracking-widest text-text uppercase mb-1">
              Capabilities
            </span>
            <ul className="flex flex-col gap-2.5 text-xs">
              {site.services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services#${service.id}`}
                    className="hover:text-accent transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation & Contact */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-semibold tracking-widest text-text uppercase mb-1">
              Index
            </span>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <Link href="/work" className="hover:text-accent transition-colors">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-accent transition-colors">
                  Services & Flow
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials & Connect */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-semibold tracking-widest text-text uppercase mb-1">
              Connect
            </span>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="hover:text-accent transition-colors break-all"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={site.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={site.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted/60">
          <p>© {currentYear} {site.name}. All rights reserved.</p>
          <p className="tracking-wide">
            Minimal. Premium. Cinematic.
          </p>
        </div>
      </div>
    </footer>
  )
}
