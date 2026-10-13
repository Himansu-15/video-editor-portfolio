import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import { successResponse, errorResponse } from '@/lib/api-response'
import { verifyAdminAuth } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

interface ReorderItem {
  id: string
  order: number
}

export async function PATCH(req: NextRequest) {
  const authError = await verifyAdminAuth(req)
  if (authError) return authError

  try {
    await connectDB()

    const body = await req.json()
    const items = body?.items as ReorderItem[]

    if (!Array.isArray(items) || items.length === 0) {
      return errorResponse('Invalid reorder items array', 400)
    }

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }))

    await Project.bulkWrite(bulkOps)

    const updatedProjects = await Project.find()
      .sort({ order: 1, createdAt: -1 })
      .lean()

    return successResponse(updatedProjects, 200, {
      message: 'Projects reordered successfully',
    })
  } catch (error) {
    console.error('Failed to reorder projects:', error)
    return errorResponse('Failed to reorder projects', 500)
  }
}
