import { NextRequest } from 'next/server'
import { ZodError } from 'zod'
import { connectDB } from '@/lib/mongodb'
import { Inquiry } from '@/models/Inquiry'
import { contactFormSchema } from '@/lib/validations/contact'
import { checkRateLimit } from '@/lib/rate-limit'
import {
  successResponse,
  errorResponse,
  handleZodError,
} from '@/lib/api-response'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // 1. Identify Client & Check Rate Limiting
  const forwarded = req.headers.get('x-forwarded-for')
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || '127.0.0.1'

  const rateLimit = checkRateLimit(clientIp, {
    maxRequests: 5, // 5 requests allowed per minute
    windowMs: 60 * 1000,
  })

  if (!rateLimit.success) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((rateLimit.reset - Date.now()) / 1000)
    )
    return errorResponse(
      'Too many inquiries submitted from this connection. Please wait before trying again.',
      429,
      { retryAfter: retryAfterSeconds }
    )
  }

  // 2. Parse & Validate Payload
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorResponse('Invalid JSON payload in request body', 400)
  }

  const parsed = contactFormSchema.safeParse(body)
  if (!parsed.success) {
    return handleZodError(parsed.error)
  }

  const {
    name,
    email,
    projectType,
    budgetRange,
    message,
    honeypot,
    simulateEmailFailure,
  } = parsed.data

  // 3. Honeypot Anti-Spam Check
  if (honeypot && honeypot.trim().length > 0) {
    console.warn(`[CONTACT API] Bot detected via honeypot field from IP ${clientIp}. Rejection triggered.`)
    return errorResponse('Spam submission detected via honeypot.', 400)
  }

  // 4. Persist Inquiry to MongoDB
  try {
    await connectDB()

    const inquiry = await Inquiry.create({
      name,
      email,
      projectType,
      budgetRange,
      message,
      emailStatus: 'skipped',
      ip: clientIp,
    })

    // 5. Email Dispatch via Resend
    const shouldSimulateFailure =
      simulateEmailFailure === true ||
      req.headers.get('x-simulate-email-failure') === 'true'

    if (shouldSimulateFailure) {
      console.warn(
        `[CONTACT API] Simulated email failure triggered for verification (Inquiry ID: ${inquiry._id}).`
      )
      inquiry.emailStatus = 'failed'
      inquiry.emailError = 'Simulated email delivery failure triggered for testing.'
      await inquiry.save()
    } else {
      const resendApiKey = process.env.RESEND_API_KEY
      const isMissingOrDummy =
        !resendApiKey ||
        resendApiKey.trim() === '' ||
        resendApiKey.trim().toLowerCase() === 'dummy'

      if (isMissingOrDummy) {
        console.warn(
          `[CONTACT API] RESEND_API_KEY is not configured or set to 'dummy'. Skipping email dispatch. Inquiry was safely persisted to MongoDB (ID: ${inquiry._id}).`
        )
        inquiry.emailStatus = 'skipped'
        await inquiry.save()
      } else {
        try {
          const { Resend } = await import('resend')
          const resend = new Resend(resendApiKey)
          const toEmail = process.env.CONTACT_TO_EMAIL || 'hello@abhijeet.example'

          const { error: sendError } = await resend.emails.send({
            from: 'Abhijeet Portfolio <onboarding@resend.dev>',
            to: [toEmail],
            replyTo: email,
            subject: `New Project Inquiry: ${name} — ${projectType}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #171719; line-height: 1.6;">
                <h2 style="color: #D6AE70; border-bottom: 2px solid #D6AE70; padding-bottom: 8px;">New Project Inquiry</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Project Type:</strong> ${projectType}</p>
                <p><strong>Budget Range:</strong> ${budgetRange}</p>
                <h3 style="margin-top: 24px;">Project Vision & Message:</h3>
                <div style="background: #f7f7f8; padding: 16px; border-radius: 8px; border-left: 4px solid #D6AE70;">
                  ${message.replace(/\n/g, '<br/>')}
                </div>
                <p style="font-size: 12px; color: #888; margin-top: 24px;">Submitted via Abhijeet Portfolio • IP: ${clientIp}</p>
              </div>
            `,
          })

          if (sendError) {
            console.error('[CONTACT API] Resend email dispatch failed:', sendError)
            inquiry.emailStatus = 'failed'
            inquiry.emailError = sendError.message
            await inquiry.save()
          } else {
            console.log(`[CONTACT API] Email dispatched successfully to ${toEmail} for inquiry ${inquiry._id}.`)
            inquiry.emailStatus = 'sent'
            await inquiry.save()
          }
        } catch (emailErr) {
          console.error('[CONTACT API] Unexpected email dispatch exception:', emailErr)
          inquiry.emailStatus = 'failed'
          inquiry.emailError =
            emailErr instanceof Error ? emailErr.message : 'Unknown email error'
          await inquiry.save()
        }
      }
    }

    return successResponse(
      {
        inquiryId: inquiry._id,
        name: inquiry.name,
        emailStatus: inquiry.emailStatus,
        createdAt: inquiry.createdAt,
      },
      201
    )
  } catch (dbError) {
    console.error('[CONTACT API] Database error persisting inquiry:', dbError)
    return errorResponse(
      'An error occurred while saving your inquiry. Please try again.',
      500
    )
  }
}
