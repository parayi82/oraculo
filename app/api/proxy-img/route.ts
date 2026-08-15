import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOSTS = [
  'replicate.delivery',
  'pbxt.replicate.delivery',
  'images.unsplash.com',
  'oraculo-mauve-pi.vercel.app',
]

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return new NextResponse('Missing url', { status: 400 })

  // Allow relative /api/placeholder URLs (no host) or approved external hosts
  let parsed: URL | null = null
  try { parsed = new URL(url) } catch { /* relative URL */ }

  if (parsed && !ALLOWED_HOSTS.some(h => parsed!.hostname.endsWith(h))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'oraculo/1.0' } })
    if (!res.ok) return new NextResponse('Upstream error', { status: 502 })

    const contentType = res.headers.get('content-type') ?? 'image/png'
    const buf = await res.arrayBuffer()

    return new NextResponse(buf, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return new NextResponse('Fetch failed', { status: 502 })
  }
}
