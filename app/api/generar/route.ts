import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { buildImagePrompt, buildNegativePrompt, getMockImageUrl } from '@/lib/oracle'
import type { Genero, Signo } from '@/lib/oracle'

export async function POST(req: NextRequest) {
  const { signo, genero } = await req.json() as { signo: Signo; genero: Genero }

  // Dev mode: no Replicate configured → return a placeholder immediately
  if (!process.env.REPLICATE_API_TOKEN) {
    const url = getMockImageUrl(signo, genero)
    return NextResponse.json({ status: 'succeeded', output: url })
  }

  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

  // Create an async prediction so the client can poll
  const prediction = await replicate.predictions.create({
    model: 'black-forest-labs/flux-schnell',
    input: {
      prompt: buildImagePrompt(signo, genero),
      negative_prompt: buildNegativePrompt(),
      num_outputs: 1,
      aspect_ratio: '3:4',
      output_format: 'webp',
      output_quality: 90,
      num_inference_steps: 4,
    },
  })

  return NextResponse.json({ predictionId: prediction.id, status: 'starting' })
}
