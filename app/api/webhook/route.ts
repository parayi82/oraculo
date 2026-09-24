import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

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
      const { nombre, fechaNacimiento, genero, signo } = session.metadata ?? {}

      if (session.customer) {
        const { error } = await supabase.from('subscribers').upsert({
          stripe_customer_id:     String(session.customer),
          stripe_subscription_id: session.subscription ? String(session.subscription) : null,
          email:          session.customer_email ?? null,
          nombre:         nombre ?? null,
          fecha_nacimiento: fechaNacimiento ?? null,
          genero:         genero ?? null,
          signo:          signo ?? null,
          status:         'active',
          updated_at:     new Date().toISOString(),
        }, { onConflict: 'stripe_customer_id' })
        if (error) console.error('[webhook] supabase upsert error:', error.message)
      }
      console.log('[webhook] new subscriber:', session.customer_email, session.metadata)
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.customer) {
        await supabase.from('subscribers')
          .update({ status: 'active', updated_at: new Date().toISOString() })
          .eq('stripe_customer_id', String(invoice.customer))
      }
      console.log('[webhook] renewal paid:', invoice.customer_email)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.customer) {
        await supabase.from('subscribers')
          .update({ status: 'past_due', updated_at: new Date().toISOString() })
          .eq('stripe_customer_id', String(invoice.customer))
      }
      console.log('[webhook] payment failed:', invoice.customer_email)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabase.from('subscribers')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('stripe_customer_id', String(sub.customer))
      console.log('[webhook] subscription cancelled:', sub.customer)
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
