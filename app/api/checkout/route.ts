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

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${base}/resultado?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/consulta`,
    locale: 'es-419',
    currency: 'mxn',
    metadata: { nombre, fechaNacimiento, genero, signo },
    subscription_data: {
      metadata: { nombre, fechaNacimiento, genero, signo },
    },
  })

  return NextResponse.json({ url: session.url })
}
