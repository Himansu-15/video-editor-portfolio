import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

function extractYouTubeId(input: string): string | null {
  const clean = input.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean
  }

  const match = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

function slugify(text: string, fallbackId: string): string {
  const clean = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return clean || `project-${fallbackId.toLowerCase()}`
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const input = searchParams.get('url') || searchParams.get('id')

  if (!input) {
    return errorResponse('YouTube URL or video ID parameter is required', 400)
  }

  const youtubeId = extractYouTubeId(input)
  if (!youtubeId) {
    return errorResponse('Could not detect a valid 11-character YouTube video ID', 400)
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://youtu.be/${youtubeId}&format=json`
    const res = await fetch(oembedUrl)

    if (!res.ok) {
      // Fallback if oEmbed fails (private / unlisted video or network)
      return successResponse({
        youtubeId,
        title: `Cinematic Project ${youtubeId}`,
        client: 'Independent Production',
        thumbnail: `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`,
        suggestedSlug: `project-${youtubeId.toLowerCase()}`,
      })
    }

    const data = (await res.json()) as { title?: string; author_name?: string }
    const title = data.title?.trim() || `Cinematic Project ${youtubeId}`
    const client = data.author_name?.trim() || 'Independent Production'
    const suggestedSlug = slugify(title, youtubeId)

    // Check thumbnail availability
    const maxresUrl = `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
    const hqUrl = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
    let thumbnail = maxresUrl

    try {
      const thumbRes = await fetch(maxresUrl, { method: 'HEAD' })
      if (!thumbRes.ok) {
        thumbnail = hqUrl
      }
    } catch {
      thumbnail = hqUrl
    }

    return successResponse({
      youtubeId,
      title,
      client,
      thumbnail,
      suggestedSlug,
    })
  } catch (error) {
    console.error('YouTube oEmbed lookup error:', error)
    return successResponse({
      youtubeId,
      title: `Cinematic Project ${youtubeId}`,
      client: 'Independent Production',
      thumbnail: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      suggestedSlug: `project-${youtubeId.toLowerCase()}`,
    })
  }
}
