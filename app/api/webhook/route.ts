import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Stripe requires the raw body to verify signatures — disable Next.js body parsing
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const body = await req.text()
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'signature error'
    console.error('[webhook] signature verification failed:', msg)
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  console.log(`[webhook] ${event.type}`)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      // Payment confirmed — subscription is active
      // Here you could write to a DB to track active subscribers
      console.log('[webhook] new subscriber:', session.customer_email, session.metadata)
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      // Subscription renewed — user keeps access
      console.log('[webhook] renewal paid:', invoice.customer_email)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      // Payment failed — optionally notify user or restrict access
      console.log('[webhook] payment failed:', invoice.customer_email)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      // Subscription cancelled — revoke access if you have a DB
      console.log('[webhook] subscription cancelled:', sub.customer)
      break
    }

    default:
      // Ignore other events
      break
  }

  return NextResponse.json({ received: true })
}
