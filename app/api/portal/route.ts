import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'stripe not configured' }, { status: 503 })
  }

  const body = await req.json()
  const { session_id } = body

  if (!session_id) {
    return NextResponse.json({ error: 'missing session_id' }, { status: 400 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const base = process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)
    const customerId = session.customer as string

    if (!customerId) {
      return NextResponse.json({ error: 'no customer found for this session' }, { status: 404 })
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${base}/resultado`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'stripe error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
