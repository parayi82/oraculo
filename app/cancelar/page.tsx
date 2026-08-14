'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Phase = 'loading' | 'noSub' | 'ready' | 'redirecting' | 'error'

export default function CancelarPage() {
  const [phase, setPhase]       = useState<Phase>('loading')
  const [nombre, setNombre]     = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('oraculo_sub')
      if (!raw) { setPhase('noSub'); return }
      const sub = JSON.parse(raw)
      if (!sub.session_id) { setPhase('noSub'); return }
      setNombre(sub.nombre?.split(' ')[0] ?? null)
      setSessionId(sub.session_id)
      setPhase('ready')
    } catch {
      setPhase('noSub')
    }
  }, [])

  async function handleCancel() {
    if (!sessionId) return
    setPhase('redirecting')
    try {
      const res = await fetch('/api/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'No se pudo abrir el portal de pagos')
        setPhase('error')
      }
    } catch {
      setError('Error de conexión. Por favor intenta de nuevo.')
      setPhase('error')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ background: '#080614' }}>
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,.08) 0%, transparent 55%)' }}
      />

      <div className="relative z-10 max-w-md w-full">
        <Link href="/" className="text-oracle-dim hover:text-oracle-gold transition-colors text-sm mb-8 inline-block">
          ← Inicio
        </Link>

        <div className="oracle-border p-8 text-center" style={{ background: 'rgba(10,6,30,.9)' }}>
          <div className="text-5xl mb-5">🔮</div>

          {phase === 'loading' && (
            <>
              <h1 className="font-serif text-2xl text-oracle-gold mb-4">Un momento...</h1>
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-oracle-gold animate-pulse"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </>
          )}

          {phase === 'noSub' && (
            <>
              <h1 className="font-serif text-2xl text-oracle-gold mb-3">Sin suscripción activa</h1>
              <p className="text-oracle-mid mb-6 leading-relaxed text-sm">
                No encontramos una suscripción activa en este dispositivo.
                Si crees que esto es un error, intenta desde el dispositivo
                con el que te suscribiste.
              </p>
              <Link href="/consulta" className="btn-oracle btn-oracle-lg block">
                Ver planes →
              </Link>
            </>
          )}

          {phase === 'ready' && (
            <>
              <h1 className="font-serif text-3xl text-oracle-gold mb-2">
                Gestionar suscripción
              </h1>
              {nombre && (
                <p className="text-oracle-teal text-sm mb-5">Hola, {nombre}</p>
              )}

              <div
                className="oracle-border p-4 mb-6 text-left rounded-xl"
                style={{ background: 'rgba(139,92,246,.06)' }}
              >
                <p className="text-oracle-dim text-sm mb-3">Al cancelar perderás acceso a:</p>
                <ul className="space-y-1.5">
                  {[
                    'Imagen de tu alma gemela',
                    'Carta astral animada',
                    'Lecturas ilimitadas de la Pitonisa',
                    'Chat con la Pitonisa',
                  ].map(item => (
                    <li key={item} className="text-oracle-mid text-sm flex items-center gap-2">
                      <span className="text-red-400/60 font-bold">×</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/resultado" className="btn-oracle block w-full text-center mb-3">
                Volver a mi lectura
              </Link>

              <button
                onClick={handleCancel}
                className="w-full py-3 px-6 rounded-xl border transition-all text-sm font-medium"
                style={{
                  borderColor: 'rgba(239,68,68,.3)',
                  color: 'rgba(252,165,165,.8)',
                  background: 'transparent',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,.08)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                Continuar con la cancelación →
              </button>

              <p className="text-oracle-dim text-xs mt-4">
                Te redirigiremos al portal seguro de pagos de Stripe
              </p>
            </>
          )}

          {phase === 'redirecting' && (
            <>
              <h1 className="font-serif text-2xl text-oracle-gold mb-3">Abriendo portal...</h1>
              <p className="text-oracle-mid text-sm mb-5">Preparando el portal seguro de suscripción</p>
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: '#00D4B8', animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </>
          )}

          {phase === 'error' && (
            <>
              <h1 className="font-serif text-2xl text-oracle-gold mb-3">Algo salió mal</h1>
              <p className="text-oracle-mid text-sm mb-6 leading-relaxed">{error}</p>
              <button
                onClick={() => { setPhase('ready'); setError(null) }}
                className="btn-oracle block w-full text-center mb-3"
              >
                Intentar de nuevo
              </button>
              <p className="text-oracle-dim text-xs mt-2">
                Si el problema persiste, la suscripción puede gestionarse
                directamente desde el correo de confirmación de Stripe.
              </p>
            </>
          )}
        </div>

        <p className="text-center text-oracle-dim text-xs mt-6">
          © 2026 El Oráculo de la Pitonisa · Solo entretenimiento
        </p>
      </div>
    </div>
  )
}
