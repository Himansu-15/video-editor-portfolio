import { getToken } from 'next-auth/jwt'
import { errorResponse } from './api-response'

/**
 * Verifies that the incoming request is authenticated by either:
 * 1. An active NextAuth admin session cookie / JWT token, OR
 * 2. A valid secret header (x-admin-secret or Bearer token matching AUTH_SECRET)
 */
export async function verifyAdminAuth(req: Request) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET

  // 1. Check for NextAuth JWT session token
  try {
    const token = await getToken({
      // eslint-disable-next-line
      req: req as any,
      secret,
    })

    if (token && token.email) {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
      if (token.email.toLowerCase() === adminEmail.toLowerCase()) {
        return null // Authenticated via NextAuth!
      }
    }
  } catch (error) {
    // Token extraction failure
  }

  // 2. Check for programmatic secret header fallback (for CLI / seed scripts)
  const expectedSecret = process.env.AUTH_SECRET
  if (expectedSecret && expectedSecret !== 'dummy-secret-for-build') {
    const customSecret = req.headers.get('x-admin-secret')
    const authHeader = req.headers.get('authorization')
    const bearerSecret = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null

    const providedSecret = customSecret || bearerSecret
    if (providedSecret && providedSecret === expectedSecret) {
      return null // Authenticated via secret!
    }
  }

  return errorResponse(
    'Unauthorized: Active admin authentication session required.',
    401
  )
}
