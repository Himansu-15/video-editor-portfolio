import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 py-24 max-w-2xl mx-auto">
      <span className="font-mono text-xs uppercase tracking-widest text-accent mb-4">
        404 — Error
      </span>

      <h1 className="font-heading text-4xl sm:text-6xl font-light text-text mb-4">
        Story Not Found
      </h1>

      <p className="text-muted text-sm sm:text-base leading-relaxed mb-8 max-w-md">
        The cinematic project or page you are looking for does not exist or may have been moved.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/work"
          className="px-6 py-3 rounded-full bg-accent text-bg font-heading text-xs uppercase tracking-widest font-medium hover:bg-accent/90 transition-colors shadow-[0_0_20px_rgba(214,174,112,0.3)]"
        >
          View Selected Work
        </Link>
        <Link
          href="/"
          className="px-6 py-3 rounded-full border border-surface/80 bg-surface/30 text-text/80 font-heading text-xs uppercase tracking-widest hover:border-accent hover:text-accent transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
