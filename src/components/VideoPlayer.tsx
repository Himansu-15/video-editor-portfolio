'use client'

import { useState } from 'react'

interface VideoPlayerProps {
  youtubeId: string
  title?: string
  /** If true, video starts muted to prevent sudden audio. Defaults to true. */
  muted?: boolean
  autoPlay?: boolean
}

export function VideoPlayer({
  youtubeId,
  title = 'Video Player',
  muted = true,
  autoPlay = true,
}: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Construct YouTube URL with parameters:
  // autoplay=1 with mute=1 ensures "no autoplay with sound"
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${
    autoPlay ? '1' : '0'
  }&mute=${muted ? '1' : '0'}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`

  return (
    <div className="relative aspect-video w-full bg-black overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface animate-pulse" aria-hidden="true">
          <div className="w-10 h-10 rounded-full border-2 border-accent/40 border-t-accent animate-spin" />
        </div>
      )}
      <iframe
        src={embedUrl}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full border-0 transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
