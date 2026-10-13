import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
        const passwordHash = process.env.ADMIN_PASSWORD_HASH

        // Validate email
        if (credentials.email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
          return null
        }

        if (!passwordHash) {
          console.error('[AUTH] ADMIN_PASSWORD_HASH is not set in environment.')
          return null
        }

        // Compare password with bcrypt hash
        const isValid = bcrypt.compareSync(credentials.password, passwordHash)
        if (!isValid) {
          return null
        }

        return {
          id: 'admin',
          email: adminEmail,
          name: 'Abhijeet Admin',
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
}
