interface RateLimitWindow {
  count: number
  start: number
}

const store = new Map<string, RateLimitWindow>()

/**
 * Returns true if the request should be blocked.
 * key     — unique string identifying the bucket (e.g. `"generar:1.2.3.4"`)
 * max     — maximum requests allowed in the window
 * windowMs — window length in milliseconds
 */
export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const w = store.get(key)

  if (!w || now - w.start >= windowMs) {
    store.set(key, { count: 1, start: now })
    // Opportunistic cleanup — keeps the map lean in long-running processes
    if (store.size > 8000) {
      for (const [k, v] of store) {
        if (now - v.start > windowMs * 2) store.delete(k)
      }
    }
    return false
  }

  if (w.count >= max) return true
  w.count++
  return false
}

/** Extract the real client IP from the request headers */
export function clientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    'unknown'
  )
}
