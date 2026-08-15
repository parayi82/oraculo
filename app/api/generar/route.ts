import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { buildImagePrompt, buildNegativePrompt, getMockImageUrl } from '@/lib/oracle'
import type { Genero, Signo } from '@/lib/oracle'
import { isRateLimited, clientIp } from '@/lib/rate-limit'

// ── Input validation ──────────────────────────────────────────────────────────

const VALID_SIGNOS: ReadonlySet<string> = new Set([
  'aries','tauro','geminis','cancer','leo','virgo',
  'libra','escorpio','sagitario','capricornio','acuario','piscis',
])
const VALID_GENEROS: ReadonlySet<string> = new Set(['hombre','mujer','destino'])

// 4 MB actual → ~5.5 MB base64; we allow 6 MB string length to be safe
const MAX_PHOTO_B64_CHARS = 6 * 1024 * 1024

function validateBody(body: unknown): string | null {
  if (!body || typeof body !== 'object') return 'body inválido'
  const b = body as Record<string, unknown>
  if (!VALID_SIGNOS.has(String(b.signo ?? '').toLowerCase())) return 'signo inválido'
  if (!VALID_GENEROS.has(String(b.genero ?? '').toLowerCase())) return 'género inválido'
  if (b.edad !== undefined) {
    const e = Number(b.edad)
    if (!Number.isFinite(e) || e < 1 || e > 100) return 'edad inválida'
  }
  if (b.fotoDataUrl !== undefined) {
    if (typeof b.fotoDataUrl !== 'string') return 'foto inválida'
    if (!b.fotoDataUrl.startsWith('data:image/')) return 'formato de foto inválido'
    if (b.fotoDataUrl.length > MAX_PHOTO_B64_CHARS) return 'foto demasiado grande (máx. 4 MB)'
  }
  return null
}

// ── Tablas de variación aleatoria ─────────────────────────────────────────────

const FONDOS = [
  'soft bokeh city lights background at evening',
  'golden hour outdoor park, blurred green nature background',
  'cozy warm cafe interior, shallow depth of field background',
  'modern photography studio, clean neutral gradient background',
  'sunset warm light, golden orange bokeh background',
  'elegant dark moody studio, dramatic dark background with rim light',
  'urban rooftop, city skyline blurred background at dusk',
  'spring garden, blurred colorful flowers background',
  'bright airy home interior, warm window light background',
  'dramatic cloudy outdoor landscape background',
]

const CABELLO_HOMBRE = [
  'short dark brown hair',
  'short black hair',
  'medium length brown hair, slightly wavy',
  'close-cropped dark hair',
  'dark auburn hair',
  'short light brown hair',
  'dark hair with subtle highlights',
  'short curly dark hair',
]

const CABELLO_MUJER = [
  'long dark brown straight hair',
  'black wavy shoulder-length hair',
  'warm blonde layered hair',
  'rich auburn medium hair',
  'chestnut brown hair with layers',
  'honey blonde wavy hair',
  'dark brunette hair with caramel highlights',
  'long black silky hair',
  'warm medium brown curly hair',
  'deep red-brown hair',
]

const ILUMINACION = [
  'soft natural window light, even and flattering',
  'warm golden hour sunlight, glowing',
  'professional soft-box studio lighting, flattering',
  'gentle rim lighting with soft fill',
  'soft romantic ambient lighting',
  'clear bright natural daylight, crisp',
  'cinematic side lighting, dramatic but warm',
]

const RASGOS_HOMBRE = [
  'strong jawline, well-groomed beard',
  'clean-shaven, defined cheekbones',
  'light stubble, strong brow',
  'short beard, warm smile',
  'sharp jawline, bright eyes',
  'clean-shaven, friendly confident face',
]

const RASGOS_MUJER = [
  'high cheekbones, natural lips, minimal makeup',
  'expressive eyes, natural glowing skin, warm smile',
  'defined brows, clear bright skin, soft features',
  'warm smile, bright eyes, natural blush',
  'elegant features, luminous skin, natural look',
  'soft eyes, full lips, healthy radiant skin',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ── Rango de edad del alma gemela según el usuario ─────────────────────────────
// Hombre: misma edad hasta 10 años menor que el usuario
// Mujer:  misma edad hasta 10 años mayor que el usuario

function edadAlmaGemela(generoFinal: 'hombre' | 'mujer', edadUsuario: number): number {
  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
  if (generoFinal === 'hombre') {
    // Hombre: misma edad o hasta 10 años mayor que el usuario
    return clamp(randInt(edadUsuario, edadUsuario + 10), 18, 70)
  } else {
    // Mujer: misma edad o hasta 10 años menor que el usuario
    return clamp(randInt(edadUsuario - 10, edadUsuario), 18, 70)
  }
}

// ── Constructor de prompt (sin foto) ──────────────────────────────────────────

function genderSwapPrompt(genero: Genero, edadUsuario: number): string {
  const generoFinal: 'hombre' | 'mujer' =
    genero === 'destino' ? (Math.random() > 0.5 ? 'hombre' : 'mujer') : genero

  const fondo  = pick(FONDOS)
  const luz    = pick(ILUMINACION)
  const edad   = edadAlmaGemela(generoFinal, edadUsuario)

  if (generoFinal === 'hombre') {
    const cabello = pick(CABELLO_HOMBRE)
    const rasgos  = pick(RASGOS_HOMBRE)
    return (
      `Close-up portrait photograph of an attractive man, approximately ${edad} years old. ` +
      `${cabello}. ${rasgos}. Naturally handsome but not a male model — real, believable, photogenic. ` +
      `Healthy clear skin, bright eyes, naturally attractive appearance. ` +
      `${luz}. ${fondo}. ` +
      `Photorealistic portrait photography, 50mm lens, sharp focus on face, high quality, masculine male man.`
    )
  } else {
    const cabello = pick(CABELLO_MUJER)
    const rasgos  = pick(RASGOS_MUJER)
    return (
      `Close-up portrait photograph of an attractive woman, approximately ${edad} years old. ` +
      `${cabello}. ${rasgos}. Naturally beautiful but not a fashion model — real, believable, photogenic. ` +
      `Healthy glowing skin, expressive bright eyes, naturally attractive appearance. ` +
      `${luz}. ${fondo}. ` +
      `Photorealistic portrait photography, 50mm lens, sharp focus on face, high quality, feminine female woman.`
    )
  }
}

// ── Constructor de prompt para img2img (con foto del usuario) ─────────────────
// prompt_strength bajo → el modelo conserva la geometría facial del original.
// El prompt guía el género y la atmósfera, no reemplaza la identidad del rostro.

function imgToImgPrompt(genero: Genero, edadUsuario: number): string {
  const generoFinal: 'hombre' | 'mujer' =
    genero === 'destino' ? (Math.random() > 0.5 ? 'hombre' : 'mujer') : genero

  const fondo = pick(FONDOS)
  const luz   = pick(ILUMINACION)
  const edad  = edadAlmaGemela(generoFinal, edadUsuario)

  const faceBase =
    `Preserve the facial bone structure, eye spacing, nose bridge, jaw shape, and ` +
    `overall facial proportions of the person in the reference image — ` +
    `same distinctive facial geometry but as the opposite gender. `

  if (generoFinal === 'hombre') {
    const cabello = pick(CABELLO_HOMBRE)
    const rasgos  = pick(RASGOS_HOMBRE)
    return (
      `Close-up portrait of an attractive man, approximately ${edad} years old. ` +
      faceBase +
      `${cabello}. ${rasgos}. Healthy clear skin, bright eyes. ` +
      `${luz}. ${fondo}. ` +
      `Photorealistic portrait photography, 50mm lens, sharp focus on face, high quality, masculine male.`
    )
  } else {
    const cabello = pick(CABELLO_MUJER)
    const rasgos  = pick(RASGOS_MUJER)
    return (
      `Close-up portrait of an attractive woman, approximately ${edad} years old. ` +
      faceBase +
      `${cabello}. ${rasgos}. Healthy glowing skin, expressive bright eyes. ` +
      `${luz}. ${fondo}. ` +
      `Photorealistic portrait photography, 50mm lens, sharp focus on face, high quality, feminine female.`
    )
  }
}

// ── Route handler ──────────────────────────────────────────────────────────────

// ── Límite: 3 generaciones por IP por hora ────────────────────────────────────
// Costo máximo por IP/hora: 3 × $0.05 = $0.15 USD (flux-dev, peor caso)
// Con suscripción de $49 MXN ≈ $2.75 USD: ese límite equivale al ~5% mensual de un suscriptor

export async function POST(req: NextRequest) {
  // 1. Validar body antes de parsear para evitar payloads maliciosos
  let rawBody: unknown
  try {
    rawBody = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const validationError = validateBody(rawBody)
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  const { signo, genero, fotoDataUrl, edad = 30 } = rawBody as {
    signo: Signo
    genero: Genero
    fotoDataUrl?: string
    edad?: number
  }

  // 2. Rate limit: 3 imágenes por IP por hora
  const ip = clientIp(req.headers)
  if (isRateLimited(`generar:${ip}`, 3, 60 * 60 * 1000)) {
    console.warn('[generar] rate limited:', ip)
    // Devolver imagen placeholder para no romper la UX — sin costo de API
    const url = getMockImageUrl(signo, genero)
    return NextResponse.json({ status: 'succeeded', output: url })
  }

  // Dev mode — sin token de Replicate
  if (!process.env.REPLICATE_API_TOKEN) {
    const url = getMockImageUrl(signo, genero)
    return NextResponse.json({ status: 'succeeded', output: url })
  }

  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

  try {
    if (fotoDataUrl) {
      const prediction = await replicate.predictions.create({
        model: 'black-forest-labs/flux-dev',
        input: {
          image:               fotoDataUrl,
          prompt:              imgToImgPrompt(genero, edad),
          // Lower strength keeps more of the user's facial geometry (identity preservation)
          prompt_strength:     0.58,
          num_inference_steps: 35,
          guidance:            3.5,
          output_format:       'webp',
          output_quality:      92,
        },
      })
      return NextResponse.json({ predictionId: prediction.id, status: 'starting' })
    }

    // Sin foto: flux-schnell no acepta negative_prompt
    const prediction = await replicate.predictions.create({
      model: 'black-forest-labs/flux-schnell',
      input: {
        prompt:              buildImagePrompt(signo, genero),
        num_outputs:         1,
        aspect_ratio:        '3:4',
        output_format:       'webp',
        output_quality:      90,
        num_inference_steps: 4,
      },
    })
    return NextResponse.json({ predictionId: prediction.id, status: 'starting' })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'replicate error'
    console.error('[generar]', msg)
    // Fall back to placeholder so the result page always shows something
    const url = getMockImageUrl(signo, genero)
    return NextResponse.json({ status: 'succeeded', output: url })
  }
}
