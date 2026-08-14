import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nombre, fechaNacimiento, genero, signo } = body

  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // Development mode: no Stripe configured → skip to resultado directly
  if (!process.env.STRIPE_SECRET_KEY) {
    const params = new URLSearchParams({ dev: '1', nombre, fechaNacimiento, genero, signo })
    return NextResponse.json({ redirect: `/resultado?${params}` })
  }

  if (!process.env.STRIPE_PRICE_ID) {
    console.error('[checkout] STRIPE_PRICE_ID not set')
    return NextResponse.json({ error: 'payment not configured' }, { status: 503 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${base}/resultado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${base}/consulta`,
      locale: 'es-419',
      metadata: { nombre, fechaNacimiento, genero, signo },
      subscription_data: { metadata: { nombre, fechaNacimiento, genero, signo } },
    })
    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'stripe error'
    console.error('[checkout]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
