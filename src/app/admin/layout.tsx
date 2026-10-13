import { Metadata } from 'next'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'Edit Suite Admin — Abhijeet',
  description: 'Manage cinematic portfolio projects, case studies, and inquiries.',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider>{children}</AuthProvider>
}
