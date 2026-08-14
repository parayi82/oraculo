import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { buildImagePrompt, buildNegativePrompt, getMockImageUrl } from '@/lib/oracle'
import type { Genero, Signo } from '@/lib/oracle'

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
    return clamp(randInt(edadUsuario - 10, edadUsuario), 18, 70)
  } else {
    return clamp(randInt(edadUsuario, edadUsuario + 10), 18, 70)
  }
}

// ── Constructor de prompt con variación ────────────────────────────────────────

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

// ── Route handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { signo, genero, fotoDataUrl, edad = 30 } = await req.json() as {
    signo: Signo
    genero: Genero
    fotoDataUrl?: string
    edad?: number
  }

  // Dev mode — sin token de Replicate
  if (!process.env.REPLICATE_API_TOKEN) {
    const url = getMockImageUrl(signo, genero)
    return NextResponse.json({ status: 'succeeded', output: url })
  }

  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

  if (fotoDataUrl) {
    // img2img: toma la foto del usuario, genera el alma gemela del sexo opuesto
    // prompt_strength 0.75 → suficiente para cambiar fondo + cabello, mantener estructura facial
    const prediction = await replicate.predictions.create({
      model: 'black-forest-labs/flux-dev',
      input: {
        image:               fotoDataUrl,
        prompt:              genderSwapPrompt(genero, edad),
        prompt_strength:     0.75,
        num_inference_steps: 30,
        guidance:            4.5,
        output_format:       'webp',
        output_quality:      92,
      },
    })
    return NextResponse.json({ predictionId: prediction.id, status: 'starting' })
  }

  // Sin foto: generación de texto a imagen con los datos del signo zodiacal
  const prediction = await replicate.predictions.create({
    model: 'black-forest-labs/flux-schnell',
    input: {
      prompt:              buildImagePrompt(signo, genero),
      negative_prompt:     buildNegativePrompt(),
      num_outputs:         1,
      aspect_ratio:        '3:4',
      output_format:       'webp',
      output_quality:      90,
      num_inference_steps: 4,
    },
  })

  return NextResponse.json({ predictionId: prediction.id, status: 'starting' })
}
