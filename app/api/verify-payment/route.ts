import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  if (!sessionId) {
    return NextResponse.json({ valid: false, error: 'missing session_id' }, { status: 400 })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ valid: false, error: 'stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    const paid =
      session.status === 'complete' &&
      (session.payment_status === 'paid' || session.mode === 'subscription')

    if (!paid) {
      return NextResponse.json({ valid: false, error: 'not paid' }, { status: 402 })
    }

    const { nombre, fechaNacimiento, genero, signo } = session.metadata ?? {}

    if (!nombre || !fechaNacimiento || !genero || !signo) {
      return NextResponse.json({ valid: false, error: 'missing metadata' }, { status: 500 })
    }

    return NextResponse.json({ valid: true, nombre, fechaNacimiento, genero, signo })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'stripe error'
    return NextResponse.json({ valid: false, error: msg }, { status: 500 })
  }
}
