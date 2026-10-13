import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Preloader } from '@/components/Preloader'
import { LenisProvider } from '@/components/LenisProvider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CustomCursor } from '@/components/CustomCursor'
import { FilmGrain } from '@/components/FilmGrain'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const isNoIndex = process.env.NEXT_PUBLIC_NOINDEX === 'true'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Abhijeet — Places, cut into cinema.',
    template: '%s — Abhijeet',
  },
  description:
    'Cinematic video editor specializing in rhythm-driven cuts, atmospheric color grading, and bespoke motion graphics.',
  keywords: [
    'video editor',
    'cinematic video editor',
    'color grading',
    'DaVinci Resolve',
    'motion graphics',
    'travel films',
    'narrative editor',
    'commercial video editor',
  ],
  authors: [{ name: 'Abhijeet' }],
  creator: 'Abhijeet',
  robots: isNoIndex
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
        },
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
  openGraph: {
    title: 'Abhijeet — Places, cut into cinema.',
    description: 'Cinematic video editor: Cuts. Colour. Motion.',
    url: siteUrl,
    siteName: 'Abhijeet Editorial Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Abhijeet — Places, cut into cinema.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abhijeet — Places, cut into cinema.',
    description: 'Cinematic video editor: Cuts. Colour. Motion.',
    images: [`${siteUrl}/og-image.jpg`],
  },
}

export const viewport: Viewport = {
  themeColor: '#0B0B0D',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(!window.location.search.includes('preloader=1') && sessionStorage.getItem('abhijeet-preloader-shown')==='true'){document.documentElement.classList.add('preloader-done');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-bg text-text antialiased min-h-screen flex flex-col selection:bg-accent/20 selection:text-text">
        <FilmGrain />
        <CustomCursor />
        <LenisProvider>
          <Preloader />
          <Navbar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  )
}