import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 })

  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json({ status: 'succeeded', output: null })
  }

  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  const prediction = await replicate.predictions.get(id)

  let output: string | null = null
  if (prediction.status === 'succeeded' && Array.isArray(prediction.output)) {
    output = prediction.output[0] as string
  }

  return NextResponse.json({ status: prediction.status, output })
}
