import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Inquiry } from '@/models/Inquiry'
import { successResponse, errorResponse } from '@/lib/api-response'
import { verifyAdminAuth } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const authError = await verifyAdminAuth(req)
  if (authError) return authError

  try {
    await connectDB()
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean()

    return successResponse(inquiries, 200, {
      total: inquiries.length,
    })
  } catch (error) {
    console.error('Failed to retrieve inquiries:', error)
    return errorResponse('Failed to retrieve inquiries', 500)
  }
}
