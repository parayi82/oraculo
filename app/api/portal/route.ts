import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'stripe not configured' }, { status: 503 })
  }

  const body = await req.json()
  const { session_id, email } = body as { session_id?: string; email?: string }

  if (!session_id && !email) {
    return NextResponse.json({ error: 'missing session_id or email' }, { status: 400 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const base = process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  try {
    let customerId: string | null = null

    if (session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      customerId = session.customer as string ?? null
    } else if (email) {
      const customers = await stripe.customers.list({ email: email.toLowerCase(), limit: 1 })
      customerId = customers.data[0]?.id ?? null
    }

    if (!customerId) {
      return NextResponse.json({ error: 'No se encontró una suscripción para este correo' }, { status: 404 })
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
