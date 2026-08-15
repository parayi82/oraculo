const LS_KEY = 'oraculo_sub'
const CK_KEY = 'oraculo_sub'
const CK_AGE = 90 * 24 * 3600 // 90 days in seconds

export interface SubData {
  nombre: string
  fechaNacimiento: string
  genero: string
  signo: string
  session_id?: string
}

function isValid(d: unknown): d is SubData {
  if (!d || typeof d !== 'object') return false
  const o = d as Record<string, unknown>
  return !!(o.nombre && o.signo && o.genero && o.fechaNacimiento)
}

export function readSub(): SubData | null {
  if (typeof window === 'undefined') return null

  // 1. localStorage (fast path)
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const d = JSON.parse(raw)
      if (isValid(d)) return d
    }
  } catch {}

  // 2. Cookie fallback — auto-restores localStorage on success
  try {
    const match = document.cookie.match(/(?:^|;\s*)oraculo_sub=([^;]+)/)
    if (match) {
      const d = JSON.parse(decodeURIComponent(match[1]))
      if (isValid(d)) {
        try { localStorage.setItem(LS_KEY, JSON.stringify(d)) } catch {}
        return d
      }
    }
  } catch {}

  return null
}

export function saveSub(data: SubData): void {
  if (typeof window === 'undefined') return
  const json = JSON.stringify(data)
  try { localStorage.setItem(LS_KEY, json) } catch {}
  try {
    document.cookie =
      `${CK_KEY}=${encodeURIComponent(json)}; max-age=${CK_AGE}; SameSite=Lax; path=/`
  } catch {}
}
