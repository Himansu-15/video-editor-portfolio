'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  contactFormSchema,
  PROJECT_TYPES,
  BUDGET_RANGES,
  type ContactFormData,
} from '@/lib/validations/contact'

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    projectType: 'Commercial / Travel',
    budgetRange: '$1,000 - $3,000',
    message: '',
    honeypot: '',
  })

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for field on edit
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
    if (serverError) setServerError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    // 1. Client-Side Validation using shared Zod schema
    const validation = contactFormSchema.safeParse(formData)
    if (!validation.success) {
      const errors: Record<string, string> = {}
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[String(err.path[0])] = err.message
        }
      })
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry')
      }

      setSubmitSuccess(true)
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : 'An unexpected connection error occurred. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      projectType: 'Commercial / Travel',
      budgetRange: '$1,000 - $3,000',
      message: '',
      honeypot: '',
    })
    setFieldErrors({})
    setSubmitSuccess(false)
    setServerError(null)
  }

  return (
    <div className="w-full rounded-2xl bg-surface/50 border border-surface/90 shadow-2xl p-6 sm:p-10 backdrop-blur-md">
      <AnimatePresence mode="wait">
        {submitSuccess ? (
          /* --- SUCCESS STATE CONFIRMATION --- */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center py-10 px-4 gap-6"
          >
            {/* Animated Gold Checkmark */}
            <div className="w-16 h-16 rounded-full border-2 border-accent bg-accent/15 flex items-center justify-center text-accent shadow-[0_0_30px_rgba(214,174,112,0.3)]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div className="max-w-md space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-accent font-medium">
                Inquiry Logged
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-light text-text">
                Thank You, {formData.name}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Your vision has been saved to the edit suite database. I review incoming footage and project notes daily and will reach back out within 24–48 hours.
              </p>
            </div>

            {/* Recap Box */}
            <div className="w-full max-w-sm rounded-xl bg-surface/60 border border-surface/80 p-4 text-left font-mono text-xs text-muted/80 space-y-1.5">
              <div className="flex justify-between">
                <span>Project:</span>
                <span className="text-text font-medium">{formData.projectType}</span>
              </div>
              <div className="flex justify-between">
                <span>Budget:</span>
                <span className="text-text font-medium">{formData.budgetRange}</span>
              </div>
              <div className="flex justify-between">
                <span>Contact:</span>
                <span className="text-accent truncate max-w-[200px]">{formData.email}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="mt-2 px-6 py-2.5 rounded-full border border-surface/90 hover:border-accent text-xs font-heading uppercase tracking-widest text-text hover:text-accent transition-colors"
            >
              Send Another Inquiry
            </button>
          </motion.div>
        ) : (
          /* --- ACTIVE FORM STATE --- */
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-8"
          >
            {/* Top Error Alert Banner */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs sm:text-sm flex items-start gap-3"
              >
                <span className="font-mono font-bold text-red-400">!</span>
                <div className="flex-1">
                  <p className="font-medium">Submission Failed</p>
                  <p className="text-xs text-red-400/90 mt-0.5">{serverError}</p>
                </div>
              </motion.div>
            )}

            {/* Hidden Honeypot Field against spam bots */}
            <div
              className="absolute opacity-0 pointer-events-none -z-50 h-0 w-0 overflow-hidden"
              aria-hidden="true"
            >
              <label htmlFor="hp_website">Website URL (leave blank)</label>
              <input
                id="hp_website"
                type="text"
                name="honeypot"
                value={formData.honeypot || ''}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="relative flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-mono uppercase tracking-widest text-muted/80 flex justify-between"
                >
                  <span>Your Name *</span>
                  {fieldErrors.name && (
                    <span className="text-red-400 normal-case tracking-normal">
                      {fieldErrors.name}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    disabled={isSubmitting}
                    className="w-full bg-surface/60 border-b border-surface/90 py-3 px-1 text-sm sm:text-base text-text placeholder:text-muted/40 focus:outline-none transition-colors"
                  />
                  {/* Animated Gold Focus Line */}
                  <motion.div
                    initial={false}
                    animate={{
                      scaleX: focusedField === 'name' ? 1 : 0,
                      opacity: focusedField === 'name' ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_rgba(214,174,112,0.6)] origin-left"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="relative flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-mono uppercase tracking-widest text-muted/80 flex justify-between"
                >
                  <span>Email Address *</span>
                  {fieldErrors.email && (
                    <span className="text-red-400 normal-case tracking-normal">
                      {fieldErrors.email}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="elena@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    disabled={isSubmitting}
                    className="w-full bg-surface/60 border-b border-surface/90 py-3 px-1 text-sm sm:text-base text-text placeholder:text-muted/40 focus:outline-none transition-colors"
                  />
                  {/* Animated Gold Focus Line */}
                  <motion.div
                    initial={false}
                    animate={{
                      scaleX: focusedField === 'email' ? 1 : 0,
                      opacity: focusedField === 'email' ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_rgba(214,174,112,0.6)] origin-left"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Project Type Chips */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-mono uppercase tracking-widest text-muted/80 flex justify-between">
                <span>Project Scope / Category *</span>
                {fieldErrors.projectType && (
                  <span className="text-red-400 normal-case tracking-normal">
                    {fieldErrors.projectType}
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {PROJECT_TYPES.map((type) => {
                  const isSelected = formData.projectType === type
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, projectType: type }))
                      }
                      disabled={isSubmitting}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-200 border ${
                        isSelected
                          ? 'border-accent bg-accent/15 text-accent shadow-[0_0_12px_rgba(214,174,112,0.25)]'
                          : 'border-surface/80 bg-surface/40 text-muted hover:border-surface hover:text-text'
                      }`}
                    >
                      {type}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Row 3: Budget Range Chips */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-mono uppercase tracking-widest text-muted/80 flex justify-between">
                <span>Target Budget Range *</span>
                {fieldErrors.budgetRange && (
                  <span className="text-red-400 normal-case tracking-normal">
                    {fieldErrors.budgetRange}
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {BUDGET_RANGES.map((range) => {
                  const isSelected = formData.budgetRange === range
                  return (
                    <button
                      key={range}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, budgetRange: range }))
                      }
                      disabled={isSubmitting}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 border ${
                        isSelected
                          ? 'border-accent bg-accent/15 text-accent shadow-[0_0_12px_rgba(214,174,112,0.25)]'
                          : 'border-surface/80 bg-surface/40 text-muted hover:border-surface hover:text-text'
                      }`}
                    >
                      {range}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Row 4: Message / Project Notes */}
            <div className="relative flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted/80">
                <span>Vision, Footage & Timeline *</span>
                <span>{formData.message.length} / 2000</span>
              </div>
              {fieldErrors.message && (
                <span className="text-xs text-red-400 normal-case tracking-normal">
                  {fieldErrors.message}
                </span>
              )}
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell me about the location, the raw footage volume, reference films, and desired delivery date..."
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  disabled={isSubmitting}
                  className="w-full bg-surface/60 border-b border-surface/90 py-3 px-1 text-sm sm:text-base text-text placeholder:text-muted/40 focus:outline-none transition-colors resize-y min-h-[100px]"
                />
                {/* Animated Gold Focus Line */}
                <motion.div
                  initial={false}
                  animate={{
                    scaleX: focusedField === 'message' ? 1 : 0,
                    opacity: focusedField === 'message' ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute bottom-1 left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_rgba(214,174,112,0.6)] origin-left"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-surface/80">
              <p className="text-[11px] font-mono text-muted/60">
                🔒 Inquiries securely stored • Response within 24–48h
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-accent text-bg font-heading text-xs uppercase tracking-widest font-semibold hover:bg-accent/90 transition-all duration-300 shadow-[0_0_25px_rgba(214,174,112,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-bg/40 border-t-bg animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <span>Send Project Inquiry</span>
                    <span className="transform transition-transform group-hover:translate-x-1">→</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
