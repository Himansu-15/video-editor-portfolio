import { Metadata } from 'next'
import { site } from '@/data/site'
import { ContactSection } from '@/components/ContactSection'

export const metadata: Metadata = {
  title: 'Contact — Abhijeet',
  description: 'Inquire about video editing, color grading, or motion graphics projects.',
}

export default function ContactPage() {
  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <ContactSection />
    </div>
  )
}
