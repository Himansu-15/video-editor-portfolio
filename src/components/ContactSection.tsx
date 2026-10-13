import { site } from '@/data/site'
import { SectionHeader } from '@/components/SectionHeader'
import { ContactForm } from '@/components/ContactForm'

interface ContactSectionProps {
  showHeader?: boolean
  className?: string
}

export function ContactSection({
  showHeader = true,
  className = '',
}: ContactSectionProps) {
  return (
    <section id="contact-section" aria-label="Contact and Inquiries" className={`w-full ${className}`}>
      {showHeader && (
        <SectionHeader
          eyebrow="Initiate Project"
          title="Let’s Create Cinema"
          description="Have raw footage waiting to be shaped into an immersive visual story? Tell me about your project, timeline, and vision."
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Interactive Form */}
        <div className="lg:col-span-7 w-full">
          <ContactForm />
        </div>

        {/* Right Column: Direct Channels & Information */}
        <aside className="lg:col-span-5 flex flex-col gap-8 w-full">
          {/* Direct Email Card */}
          <div className="p-8 rounded-2xl bg-surface/40 border border-surface/80 flex flex-col gap-5">
            <span className="text-xs uppercase font-mono tracking-widest text-accent font-medium">
              Direct Contact
            </span>
            <a
              href={`mailto:${site.contact.email}`}
              className="font-heading text-xl sm:text-2xl text-text hover:text-accent transition-colors break-all"
            >
              {site.contact.email}
            </a>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Accepting inquiries for narrative films, commercial travel campaigns, and bespoke color grading commissions.
            </p>
            <div className="pt-2 text-xs font-mono text-muted/70 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Standard response window: 24–48 hours</span>
            </div>
          </div>

          {/* Social Channels */}
          <div className="p-8 rounded-2xl bg-surface/40 border border-surface/80 flex flex-col gap-5">
            <span className="text-xs uppercase font-mono tracking-widest text-muted/80">
              Channels & Follow
            </span>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href={site.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-2 border-b border-surface/60 text-muted hover:text-accent transition-colors"
                >
                  <span className="font-medium">YouTube</span>
                  <span className="text-xs font-mono">@abhijeet ↗</span>
                </a>
              </li>
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-2 border-b border-surface/60 text-muted hover:text-accent transition-colors"
                >
                  <span className="font-medium">Instagram</span>
                  <span className="text-xs font-mono">@abhijeet ↗</span>
                </a>
              </li>
              <li>
                <a
                  href={site.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-2 border-b border-surface/60 text-muted hover:text-accent transition-colors"
                >
                  <span className="font-medium">Twitter / X</span>
                  <span className="text-xs font-mono">@abhijeet ↗</span>
                </a>
              </li>
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-2 border-b border-surface/60 text-muted hover:text-accent transition-colors"
                >
                  <span className="font-medium">LinkedIn</span>
                  <span className="text-xs font-mono">in/abhijeet ↗</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}
