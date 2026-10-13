interface RateLimitRecord {
  count: number
  resetTime: number
}

// In-memory sliding window rate limiter
const store = new Map<string, RateLimitRecord>()

interface RateLimitConfig {
  /** Maximum allowed requests within the window */
  maxRequests?: number
  /** Window duration in milliseconds (default: 60,000ms = 1 minute) */
  windowMs?: number
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = {}
): {
  success: boolean
  limit: number
  remaining: number
  reset: number
} {
  const { maxRequests = 5, windowMs = 60 * 1000 } = config
  const now = Date.now()

  // Clean up any stale records periodically
  if (store.size > 1000) {
    store.forEach((record, key) => {
      if (now > record.resetTime) {
        store.delete(key)
      }
    })
  }

  const record = store.get(identifier)

  if (!record || now > record.resetTime) {
    // New window
    store.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: now + windowMs,
    }
  }

  if (record.count >= maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: record.resetTime,
    }
  }

  record.count += 1
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - record.count,
    reset: record.resetTime,
  }
}

/** Utility to reset rate limiter during testing */
export function resetRateLimit(identifier?: string) {
  if (identifier) {
    store.delete(identifier)
  } else {
    store.clear()
  }
}
