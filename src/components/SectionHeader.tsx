interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const isCentered = align === 'center'

  return (
    <div
      className={`flex flex-col ${
        isCentered ? 'items-center text-center' : 'sm:flex-row sm:items-end justify-between'
      } gap-6 mb-12 sm:mb-16 ${className}`}
    >
      <div className={isCentered ? 'max-w-2xl' : 'max-w-3xl'}>
        {eyebrow && (
          <p className="text-xs uppercase tracking-widest text-accent font-medium mb-3">
            {eyebrow}
          </p>
        )}
        <h2 className="font-heading text-3xl sm:text-5xl font-light text-text tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-muted text-sm sm:text-base leading-relaxed mt-4">
            {description}
          </p>
        )}
      </div>

      {action && !isCentered && <div className="shrink-0">{action}</div>}
      {action && isCentered && <div className="mt-4">{action}</div>}
    </div>
  )
}
