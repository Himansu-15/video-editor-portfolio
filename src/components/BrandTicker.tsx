'use client'

import { site } from '@/data/site'

const CLIENT_DETAILS: Record<string, { discipline: string; tag: string }> = {
  'Wanderlust Co.': { discipline: 'Travel Documentary', tag: 'Commercial' },
  'Luma': { discipline: 'Brand Campaign', tag: 'Color Grading' },
  'Aperture Films': { discipline: 'Narrative Short', tag: 'Cinematic Edit' },
  'Nomad Collective': { discipline: 'Creator Series', tag: 'Motion Design' },
  'Horizon Studios': { discipline: 'Studio Production', tag: 'Post-Production' },
  'Terra Media': { discipline: 'Expedition Film', tag: 'Sound & Grade' },
}

export function BrandTicker() {
  const clients = site.clients

  const renderTrack = (ariaHidden = false) => (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-4 sm:gap-6 pr-4 sm:pr-6"
    >
      {clients.map((client, idx) => {
        const detail = CLIENT_DETAILS[client] || {
          discipline: 'Creative Video Edit',
          tag: 'Client Film',
        }

        return (
          <div
            key={`${client}-${idx}-${ariaHidden ? 'dup' : 'orig'}`}
            className="shrink-0 min-w-[210px] sm:min-w-[240px] px-6 py-4 rounded-xl bg-surface/40 border border-surface/80 hover:border-accent/50 hover:bg-surface/70 transition-all duration-300 flex flex-col gap-1.5 cursor-default select-none"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-heading text-sm sm:text-base font-medium text-text tracking-wide">
                {client}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-surface border border-surface text-accent/80 font-medium">
                {detail.tag}
              </span>
            </div>
            <p className="text-[11px] text-muted tracking-normal font-body">
              {detail.discipline}
            </p>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="relative w-full overflow-hidden py-3 select-none group">
      {/* Soft lateral gradient fades for seamless edge dissolution */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-r from-bg to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-l from-bg to-transparent"
        aria-hidden="true"
      />

      {/* Endless animated marquee with zero visible seam and hover pause */}
      <div className="animate-marquee flex items-center will-change-transform hover:[animation-play-state:paused]">
        {renderTrack(false)}
        {renderTrack(true)}
      </div>
    </div>
  )
}
