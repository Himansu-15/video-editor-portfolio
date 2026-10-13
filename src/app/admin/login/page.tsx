'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
      })

      if (!res || res.error) {
        setErrorMessage('Invalid credentials. Check your email and password.')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setErrorMessage('An unexpected authentication error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-surface/50 border border-surface/90 shadow-2xl p-8 sm:p-10 backdrop-blur-md relative z-10 flex flex-col gap-8">
      {/* Header */}
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-accent font-medium block mb-2">
          Restricted Access
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-light text-text">
          Edit Suite Admin
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-2">
          Sign in to manage projects, case studies, and inquiries.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs flex items-center gap-2.5"
        >
          <span className="font-mono font-bold text-red-400">!</span>
          <span>{errorMessage}</span>
        </motion.div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Email Field */}
        <div className="relative flex flex-col gap-1.5">
          <label
            htmlFor="admin-email"
            className="text-xs font-mono uppercase tracking-widest text-muted/80"
          >
            Admin Email
          </label>
          <div className="relative">
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="admin@example.com"
              className="w-full bg-surface/60 border-b border-surface/90 py-3 px-1 text-sm text-text placeholder:text-muted/40 focus:outline-none transition-colors"
            />
            <motion.div
              initial={false}
              animate={{
                scaleX: focusedField === 'email' ? 1 : 0,
                opacity: focusedField === 'email' ? 1 : 0,
              }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_rgba(214,174,112,0.6)] origin-left"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="relative flex flex-col gap-1.5">
          <label
            htmlFor="admin-password"
            className="text-xs font-mono uppercase tracking-widest text-muted/80"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••••••"
              className="w-full bg-surface/60 border-b border-surface/90 py-3 px-1 text-sm text-text placeholder:text-muted/40 focus:outline-none transition-colors"
            />
            <motion.div
              initial={false}
              animate={{
                scaleX: focusedField === 'password' ? 1 : 0,
                opacity: focusedField === 'password' ? 1 : 0,
              }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_rgba(214,174,112,0.6)] origin-left"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 rounded-full bg-accent text-bg font-heading text-xs uppercase tracking-widest font-semibold hover:bg-accent/90 transition-all duration-300 shadow-[0_0_25px_rgba(214,174,112,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-bg/40 border-t-bg animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In to Dashboard →</span>
          )}
        </button>
      </form>

      {/* Back Link */}
      <div className="text-center pt-2 border-t border-surface/70">
        <Link
          href="/"
          className="text-xs font-mono text-muted/70 hover:text-accent transition-colors"
        >
          ← Return to Public Portfolio
        </Link>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative">
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-2xl bg-surface/50 border border-surface/90 p-8 flex items-center justify-center text-muted font-mono text-xs">
            Loading authentication interface...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  )
}
