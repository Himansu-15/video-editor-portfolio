import fs from 'node:fs'
import path from 'node:path'
import mongoose from 'mongoose'
import { Project, CraftType } from '../src/models/Project'

// Load .env variables if not already present in environment
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8')
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const match = trimmed.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const val = match[2].trim().replace(/^['"]|['"]$/g, '')
      if (!process.env[key]) {
        process.env[key] = val
      }
    }
  })
}

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/abhijeet'

const VIDEO_IDS = [
  'S14dA5Ybuvk',
  'LsQ_RyC1sLw',
  'FCfU-iuUDPE',
  'VL3aANLPGNA',
  'n3dAaPGhiuU',
]

const CRAFT_ALL: CraftType[] = ['Cuts', 'Color Grading', 'Motion Graphics']

function slugify(text: string, fallbackId: string): string {
  const clean = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return clean || `project-${fallbackId.toLowerCase()}`
}

const VIDEO_CONFIGS: Record<
  string,
  {
    location: string
    category: string
    craft: CraftType[]
    previewLoopUrl?: string
    beforeAfter?: { before?: string; after?: string }
  }
> = {
  S14dA5Ybuvk: {
    location: 'Goa, India',
    category: 'Narrative Film',
    craft: ['Cuts', 'Color Grading'],
  },
  LsQ_RyC1sLw: {
    location: 'Cuttack, India',
    category: 'Narrative Film',
    craft: ['Cuts', 'Motion Graphics'],
  },
  'FCfU-iuUDPE': {
    location: 'Ooty, Tamil Nadu',
    category: 'Travel Film',
    craft: ['Cuts', 'Color Grading', 'Motion Graphics'],
    previewLoopUrl: '/videos/motion-loop-ooty.mp4',
    beforeAfter: {
      before: '/images/raw-log-ooty.jpg',
      after: '/images/graded-ooty.jpg',
    },
  },
  VL3aANLPGNA: {
    location: '',
    category: 'Lifestyle',
    craft: ['Cuts'],
  },
  n3dAaPGhiuU: {
    location: 'Bhubaneswar, Odisha',
    category: 'Travel Film',
    craft: ['Color Grading', 'Motion Graphics'],
  },
}

async function resolveThumbnail(youtubeId: string): Promise<string> {
  const maxresUrl = `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
  const hqUrl = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`

  try {
    const res = await fetch(maxresUrl, { method: 'HEAD' })
    if (res.ok) {
      return maxresUrl
    }
  } catch {
    // fallback
  }

  return hqUrl
}

async function seed() {
  console.log('Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('Connected to database successfully.')

  const currentYear = new Date().getFullYear()
  const seededVideos: string[] = []
  const videosNeedingLocation: { id: string; title: string }[] = []

  for (let i = 0; i < VIDEO_IDS.length; i++) {
    const id = VIDEO_IDS[i]
    const oembedUrl = `https://www.youtube.com/oembed?url=https://youtu.be/${id}&format=json`

    try {
      console.log(`\nFetching oEmbed for video: ${id}...`)
      const res = await fetch(oembedUrl)

      if (!res.ok) {
        console.warn(
          `[SKIP] YouTube oEmbed failed for ID ${id} (status: ${res.status}). Skipping video.`
        )
        continue
      }

      const data = (await res.json()) as {
        title?: string
        author_name?: string
      }

      const title = data.title?.trim() || `Cinematic Project ${id}`
      const slug = slugify(title, id)
      const thumbnail = await resolveThumbnail(id)
      const config = VIDEO_CONFIGS[id] || {
        location: '',
        category: 'Cinematic Edit',
        craft: CRAFT_ALL,
      }

      const projectData = {
        title,
        slug,
        category: config.category,
        location: config.location,
        craft: config.craft,
        role: 'Editor, Colorist, Motion Designer',
        client: data.author_name || 'Independent Production',
        year: currentYear,
        description: `Cinematic travel and narrative edit focusing on rhythm, seamless cuts, and atmospheric color grading for ${title}.`,
        youtubeId: id,
        thumbnail,
        previewLoopUrl: config.previewLoopUrl,
        beforeAfter: config.beforeAfter,
        tools: ['DaVinci Resolve', 'Premiere Pro', 'After Effects'],
        featured: i < 3,
        order: i + 1,
      }

      await Project.findOneAndUpdate({ youtubeId: id }, projectData, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      })

      console.log(`[OK] Seeded project: "${title}" (slug: ${slug})`)
      seededVideos.push(id)
      videosNeedingLocation.push({ id, title })
    } catch (error) {
      console.warn(
        `[SKIP] Failed to fetch or seed video ${id}:`,
        error instanceof Error ? error.message : error
      )
    }
  }

  console.log('\n========================================')
  console.log(`Seeding complete: ${seededVideos.length}/${VIDEO_IDS.length} projects stored in database.`)

  if (videosNeedingLocation.length > 0) {
    console.log('\n[TODO] Location still needed for the following videos:')
    videosNeedingLocation.forEach((item, idx) => {
      console.log(`  ${idx + 1}. ID: ${item.id} — "${item.title}"`)
    })
  }
  console.log('========================================\n')

  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed script encountered a fatal error:', err)
  process.exit(1)
})
