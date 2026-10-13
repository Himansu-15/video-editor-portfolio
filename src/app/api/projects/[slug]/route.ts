import { NextRequest } from 'next/server'
import { ZodError } from 'zod'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import { updateProjectSchema } from '@/lib/validations/project'
import {
  successResponse,
  errorResponse,
  handleZodError,
} from '@/lib/api-response'
import { verifyAdminAuth } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: {
    slug: string
  }
}

export async function GET(
  _req: NextRequest,
  { params }: RouteContext
) {
  try {
    await connectDB()

    const { slug } = params
    const project = await Project.findOne({ slug }).lean()

    if (!project) {
      return errorResponse(`Project with slug '${slug}' not found`, 404)
    }

    return successResponse(project, 200)
  } catch (error) {
    console.error(`Failed to retrieve project ${params.slug}:`, error)
    return errorResponse('Failed to retrieve project', 500)
  }
}

export async function PUT(
  req: NextRequest,
  { params }: RouteContext
) {
  const authError = await verifyAdminAuth(req)
  if (authError) return authError

  try {
    await connectDB()

    const { slug } = params
    const body = await req.json()

    const parsed = updateProjectSchema.safeParse(body)
    if (!parsed.success) {
      return handleZodError(parsed.error)
    }

    const project = await Project.findOne({ slug })
    if (!project) {
      return errorResponse(`Project with slug '${slug}' not found`, 404)
    }

    // If new slug is provided and different, ensure uniqueness
    if (parsed.data.slug && parsed.data.slug !== slug) {
      const slugConflict = await Project.findOne({ slug: parsed.data.slug })
      if (slugConflict) {
        return errorResponse(
          `A project with slug '${parsed.data.slug}' already exists`,
          409
        )
      }
    }

    Object.assign(project, parsed.data)
    await project.save()

    return successResponse(project, 200)
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodError(error)
    }
    console.error(`Failed to update project ${params.slug}:`, error)
    return errorResponse('Failed to update project', 500)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  const authError = await verifyAdminAuth(req)
  if (authError) return authError

  try {
    await connectDB()

    const { slug } = params
    const deletedProject = await Project.findOneAndDelete({ slug })

    if (!deletedProject) {
      return errorResponse(`Project with slug '${slug}' not found`, 404)
    }

    return successResponse(
      { message: `Project '${slug}' deleted successfully`, slug },
      200
    )
  } catch (error) {
    console.error(`Failed to delete project ${params.slug}:`, error)
    return errorResponse('Failed to delete project', 500)
  }
}
