import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { buildImagePrompt, buildNegativePrompt, getMockImageUrl } from '@/lib/oracle'
import type { Genero, Signo } from '@/lib/oracle'

function genderSwapPrompt(genero: Genero): string {
  const generoFinal: 'hombre' | 'mujer' =
    genero === 'destino' ? (Math.random() > 0.5 ? 'hombre' : 'mujer') : genero

  return generoFinal === 'hombre'
    ? 'portrait of a handsome man, masculine features, subtle beard, strong jawline, warm confident smile, ' +
      'same face structure as subject, professional portrait photography, photorealistic, soft warm lighting, high quality'
    : 'portrait of a beautiful woman, feminine features, soft skin, natural beauty, warm smile, ' +
      'same face structure as subject, professional portrait photography, photorealistic, soft warm lighting, high quality'
}

export async function POST(req: NextRequest) {
  const { signo, genero, fotoDataUrl } = await req.json() as {
    signo: Signo
    genero: Genero
    fotoDataUrl?: string
  }

  // Dev mode — no Replicate token
  if (!process.env.REPLICATE_API_TOKEN) {
    const url = getMockImageUrl(signo, genero)
    return NextResponse.json({ status: 'succeeded', output: url })
  }

  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

  if (fotoDataUrl) {
    // img2img: gender-swap the user's own face to reveal their soulmate
    const prediction = await replicate.predictions.create({
      model: 'black-forest-labs/flux-dev',
      input: {
        image:            fotoDataUrl,
        prompt:           genderSwapPrompt(genero),
        prompt_strength:  0.62,   // 0 = keep original face, 1 = full redraw
        num_inference_steps: 28,
        guidance:         3.5,
        output_format:    'webp',
        output_quality:   90,
      },
    })
    return NextResponse.json({ predictionId: prediction.id, status: 'starting' })
  }

  // No photo: classic text-to-image portrait
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
