import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow access to login page and NextAuth internal API endpoints
  if (
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next()
  }

  // Protect /admin and any sub-routes
  if (pathname.startsWith('/admin')) {
    const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
    const token = await getToken({
      req,
      secret,
    })

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'

    if (!token || token.email?.toLowerCase() !== adminEmail.toLowerCase()) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
