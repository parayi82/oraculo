import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const status = req.nextUrl.searchParams.get('status') // active | cancelled | past_due | all

  let query = supabase
    .from('subscribers')
    .select('email, nombre, signo, genero, status, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  } else if (!status) {
    query = query.eq('status', 'active')
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ total: data?.length ?? 0, subscribers: data ?? [] })
}
