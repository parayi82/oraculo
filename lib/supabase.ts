import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key  = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-only client with service role — never import this in browser code
export const supabase = createClient(url, key, {
  auth: { persistSession: false },
})

export interface Subscriber {
  id: string
  stripe_customer_id: string
  stripe_subscription_id: string | null
  email: string | null
  nombre: string | null
  fecha_nacimiento: string | null
  genero: string | null
  signo: string | null
  status: 'active' | 'cancelled' | 'past_due'
  created_at: string
  updated_at: string
}
