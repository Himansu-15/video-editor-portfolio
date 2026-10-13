import { NextRequest } from 'next/server'
import { ZodError } from 'zod'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import {
  createProjectSchema,
  projectQuerySchema,
} from '@/lib/validations/project'
import {
  successResponse,
  errorResponse,
  handleZodError,
} from '@/lib/api-response'
import { verifyAdminAuth } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const rawQuery = {
      category: searchParams.get('category') || undefined,
      craft: searchParams.get('craft') || undefined,
      featured: searchParams.get('featured') || undefined,
    }

    const parsedQuery = projectQuerySchema.safeParse(rawQuery)
    if (!parsedQuery.success) {
      return handleZodError(parsedQuery.error)
    }

    const filter: Record<string, unknown> = {}

    if (parsedQuery.data.category) {
      filter.category = parsedQuery.data.category
    }

    if (parsedQuery.data.craft) {
      filter.craft = parsedQuery.data.craft
    }

    if (typeof parsedQuery.data.featured === 'boolean') {
      filter.featured = parsedQuery.data.featured
    }

    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .lean()

    return successResponse(projects, 200, {
      total: projects.length,
      filter: rawQuery,
    })
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return errorResponse('Failed to retrieve projects', 500)
  }
}

export async function POST(req: NextRequest) {
  const authError = await verifyAdminAuth(req)
  if (authError) return authError

  try {
    await connectDB()

    const body = await req.json()
    const parsed = createProjectSchema.safeParse(body)

    if (!parsed.success) {
      return handleZodError(parsed.error)
    }

    const existingProject = await Project.findOne({ slug: parsed.data.slug })
    if (existingProject) {
      return errorResponse(
        `A project with slug '${parsed.data.slug}' already exists`,
        409
      )
    }

    const project = await Project.create(parsed.data)

    return successResponse(project, 201)
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodError(error)
    }
    console.error('Failed to create project:', error)
    return errorResponse('Failed to create project', 500)
  }
}
