import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import { ProjectItem } from '@/hooks/useProjects'
import { ProjectCaseStudy } from '@/components/ProjectCaseStudy'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    slug: string
  }
}

/**
 * Fetch a single project by slug from the API, falling back to direct DB access.
 */
async function getProject(slug: string): Promise<ProjectItem | null> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${siteUrl}/api/projects/${slug}`, {
      cache: 'no-store',
    })
    if (res.ok) {
      const json = await res.json()
      if (json.success && json.data) {
        return json.data as ProjectItem
      }
    }
  } catch (error) {
    // API self-fetch failed; fallback to DB
  }

  try {
    await connectDB()
    const doc = await Project.findOne({ slug }).lean()
    if (!doc) return null
    return JSON.parse(JSON.stringify(doc)) as ProjectItem
  } catch {
    return null
  }
}

/**
 * Fetch all projects to support next / previous case study navigation.
 */
async function getAllProjects(): Promise<ProjectItem[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${siteUrl}/api/projects`, {
      cache: 'no-store',
    })
    if (res.ok) {
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        return json.data as ProjectItem[]
      }
    }
  } catch (error) {
    // API self-fetch failed; fallback to DB
  }

  try {
    await connectDB()
    const list = await Project.find().sort({ order: 1, createdAt: 1 }).lean()
    return JSON.parse(JSON.stringify(list)) as ProjectItem[]
  } catch {
    return []
  }
}

/**
 * Dynamic SEO metadata per project
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProject(params.slug)

  if (!project) {
    return {
      title: 'Project Not Found — Abhijeet',
      description: 'The requested cinematic project could not be found.',
    }
  }

  const locationText = project.location ? ` in ${project.location}` : ''
  const description =
    project.description ||
    `${project.title} (${project.year}) — A cinematic place edit${locationText} by Abhijeet.`

  return {
    title: `${project.title} — Abhijeet`,
    description,
    openGraph: {
      title: `${project.title} — Abhijeet`,
      description,
      type: 'video.other',
      images: project.thumbnail ? [{ url: project.thumbnail }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} — Abhijeet`,
      description,
      images: project.thumbnail ? [project.thumbnail] : [],
    },
  }
}

export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const project = await getProject(params.slug)

  // 404 handling for unknown slugs
  if (!project) {
    notFound()
  }

  const allProjects = await getAllProjects()

  return <ProjectCaseStudy project={project} allProjects={allProjects} />
}
