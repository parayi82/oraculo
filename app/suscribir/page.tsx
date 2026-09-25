'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SuscribirPage() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
      .then(r => r.json())
      .then(data => {
        if (data.url) window.location.href = data.url
        else if (data.redirect) window.location.href = data.redirect
        else setError(data.error ?? 'No se pudo abrir el pago')
      })
      .catch(() => setError('Error de conexión. Intenta de nuevo.'))
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: '#080614' }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,.08) 0%, transparent 55%)' }}
      />

      <div className="relative z-10 text-center max-w-sm w-full">
        {!error ? (
          <>
            <div className="text-5xl mb-6">🔮</div>
            <h1 className="font-serif text-2xl text-oracle-gold mb-3">
              Preparando tu suscripción…
            </h1>
            <p className="text-oracle-mid text-sm mb-8">
              Abriendo el portal seguro de pagos de Stripe
            </p>
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
        ) : (
          <>
            <div className="text-5xl mb-6">⚠️</div>
            <h1 className="font-serif text-2xl text-oracle-gold mb-3">Algo salió mal</h1>
            <p className="text-oracle-mid text-sm mb-6">{error}</p>
            <button
              onClick={() => { setError(null); window.location.reload() }}
              className="btn-oracle w-full mb-3"
            >
              Intentar de nuevo
            </button>
            <Link href="/" className="text-oracle-dim text-xs hover:text-oracle-gold transition-colors">
              Volver al inicio
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
