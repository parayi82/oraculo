'use client'

import { useEffect, useRef, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getSigno, getDatosSigno } from '@/lib/oracle'
import type { Genero, Signo } from '@/lib/oracle'

type Phase = 'loading' | 'revealing' | 'done' | 'error'

interface OracleData {
  nombre: string
  fechaNacimiento: string
  genero: Genero
  signo: Signo
}

const LOADING_MSGS = [
  'La Pitonisa consulta las estrellas...',
  'El oráculo abre su visión...',
  'Tu destino está siendo revelado...',
  'La bola de cristal brilla...',
  'Los astros se alinean para ti...',
  'Casi listo, espera un momento...',
]

function getData(params: URLSearchParams): OracleData | null {
  // Dev mode: data comes in URL params
  const nombre = params.get('nombre')
  const fechaNacimiento = params.get('fechaNacimiento')
  const genero = params.get('genero') as Genero | null
  const signo = params.get('signo') as Signo | null

  if (nombre && fechaNacimiento && genero && signo) {
    return { nombre, fechaNacimiento, genero, signo }
  }

  // Production mode: data comes from sessionStorage
  try {
    const raw = sessionStorage.getItem('oraculo_data')
    if (raw) return JSON.parse(raw) as OracleData
  } catch { /* */ }

  return null
}

function ResultadoInner() {
  const params = useSearchParams()
  const [phase, setPhase] = useState<Phase>('loading')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MSGS[0])
  const [oracleData, setOracleData] = useState<OracleData | null>(null)
  const [shared, setShared] = useState(false)
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const msgRef  = useRef(0)

  // Cycle loading messages
  useEffect(() => {
    if (phase !== 'loading') return
    const iv = setInterval(() => {
      msgRef.current = (msgRef.current + 1) % LOADING_MSGS.length
      setLoadingMsg(LOADING_MSGS[msgRef.current])
    }, 3000)
    return () => clearInterval(iv)
  }, [phase])

  const pollStatus = useCallback(async (predictionId: string) => {
    const res = await fetch(`/api/status?id=${predictionId}`)
    const data = await res.json()

    if (data.status === 'succeeded') {
      setImageUrl(data.output)
      setPhase('revealing')
      setTimeout(() => setPhase('done'), 900)
      return
    }

    if (data.status === 'failed' || data.status === 'canceled') {
      setPhase('error')
      return
    }

    // Still processing — poll again in 2.5s
    pollRef.current = setTimeout(() => pollStatus(predictionId), 2500)
  }, [])

  useEffect(() => {
    const data = getData(params)
    if (!data) {
      setPhase('error')
      return
    }
    setOracleData(data)

    // Kick off generation
    fetch('/api/generar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signo: data.signo, genero: data.genero }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.status === 'succeeded' && res.output) {
          // Dev mode: immediate result
          setImageUrl(res.output)
          setPhase('revealing')
          setTimeout(() => setPhase('done'), 900)
        } else if (res.predictionId) {
          pollStatus(res.predictionId)
        } else {
          setPhase('error')
        }
      })
      .catch(() => setPhase('error'))

    return () => { if (pollRef.current) clearTimeout(pollRef.current) }
  }, [params, pollStatus])

  const datosSigno = oracleData ? getDatosSigno(oracleData.signo) : null
  const nombre = oracleData?.nombre?.split(' ')[0] ?? ''

  function handleShare() {
    const text =
      `✨ La Pitonisa reveló cómo es mi alma gemela — ¡no me lo esperaba! ` +
      `Descubre la tuya en El Oráculo de la Pitonisa 🔮`
    const url = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
    if (navigator.share) {
      navigator.share({ title: 'Mi Alma Gemela', text, url })
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`)
      setShared(true)
      setTimeout(() => setShared(false), 3000)
    }
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(
      `✨ La Pitonisa reveló cómo es mi alma gemela — ¡descubre la tuya! ` +
      `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  function handleFacebook() {
    const url = encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL || window.location.origin)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
  }

  // ── LOADING ──
  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="fixed inset-0" aria-hidden style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(139,92,246,.15) 0%, transparent 60%)',
        }} />

        {/* Animated orb */}
        <div className="relative mb-10 animate-float">
          <div
            className="w-40 h-40 rounded-full animate-glow-pulse"
            style={{
              background: 'radial-gradient(circle at 38% 36%, rgba(242,168,0,.45) 0%, rgba(139,92,246,.3) 45%, transparent 75%)',
              border: '1px solid rgba(242,168,0,.4)',
              boxShadow: '0 0 60px rgba(242,168,0,.3), 0 0 120px rgba(139,92,246,.2)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl animate-glow-pulse">🔮</span>
          </div>
          {/* Orbiting dots */}
          {[0, 120, 240].map((deg) => (
            <div
              key={deg}
              className="absolute w-2.5 h-2.5 rounded-full bg-oracle-gold"
              style={{
                top: '50%', left: '50%',
                transform: `rotate(${deg}deg) translateX(68px) translateY(-50%)`,
                opacity: 0.6,
                animation: `glowPulse ${2 + deg / 240}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        <p className="text-oracle-teal text-xs tracking-[3px] uppercase mb-4">
          Generando tu lectura
        </p>
        <h1 className="font-serif text-3xl text-oracle-gold text-glow-gold mb-4">
          {loadingMsg}
        </h1>
        {nombre && (
          <p className="text-oracle-mid">
            La Pitonisa está buscando a quien comparte tu destino, {nombre}...
          </p>
        )}

        {/* Progress dots */}
        <div className="flex gap-2 mt-10">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-oracle-gold opacity-60"
              style={{
                animation: `glowPulse 1.4s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  // ── ERROR ──
  if (phase === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-4xl mb-4">😔</p>
        <h1 className="font-serif text-3xl text-oracle-gold mb-4">Algo salió mal</h1>
        <p className="text-oracle-mid mb-8 max-w-xs">
          La Pitonisa tuvo un mal día. Intenta de nuevo — el destino siempre encuentra la manera.
        </p>
        <Link href="/consulta" className="btn-oracle">
          Intentar de nuevo
        </Link>
      </div>
    )
  }

  // ── REVEALING / DONE ──
  return (
    <div className="min-h-screen" style={{ background: '#080614' }}>
      <div className="fixed inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse at 50% 20%, rgba(242,168,0,.08) 0%, transparent 60%)',
      }} />

      {/* Header */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between">
        <Link href="/" className="text-oracle-dim hover:text-oracle-gold transition-colors text-sm">
          ← Inicio
        </Link>
        <span className="text-oracle-teal text-xs tracking-[2px] uppercase">
          El Oráculo de la Pitonisa
        </span>
        <div className="w-16" /> {/* spacer */}
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-6 pb-20 pt-4">
        {/* Greeting */}
        <div className="text-center mb-10">
          <p className="text-oracle-teal text-xs tracking-[3px] uppercase mb-3">Tu lectura</p>
          <h1
            className="font-serif text-4xl md:text-5xl text-oracle-gold text-glow-gold"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            {nombre}, conoce a tu<br/>alma gemela
          </h1>
          {datosSigno && (
            <p className="text-oracle-mid mt-3 italic font-serif text-lg">
              &ldquo;{datosSigno.fraseMistica}&rdquo;
            </p>
          )}
        </div>

        {/* Image reveal */}
        <div
          className="oracle-border glow-gold mx-auto mb-8 overflow-hidden"
          style={{ maxWidth: 380, borderRadius: 16 }}
        >
          <div className={`relative aspect-[3/4] w-full ${phase === 'revealing' || phase === 'done' ? 'image-reveal' : ''}`}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Tu alma gemela revelada por el oráculo"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div
                className="w-full h-full shimmer"
                style={{ background: 'rgba(26,21,64,.8)' }}
              />
            )}

            {/* Ornamental overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, transparent 60%, rgba(8,6,20,.7) 100%)',
              }}
            />

            {/* Bottom badge */}
            {phase === 'done' && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <span
                  className="text-oracle-gold text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full"
                  style={{ background: 'rgba(8,6,20,.7)', border: '1px solid rgba(242,168,0,.3)' }}
                >
                  {datosSigno?.nombre} {datosSigno?.emoji} · Tu alma gemela
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        {phase === 'done' && datosSigno && (
          <div className="animate-fade-up space-y-6">

            {/* Soulmate description */}
            <div
              className="oracle-border p-6"
              style={{ background: 'rgba(26,21,64,.6)' }}
            >
              <h2 className="font-serif text-xl text-oracle-gold mb-3">
                Lo que la Pitonisa ve
              </h2>
              <p className="text-oracle-mid leading-relaxed">
                {datosSigno.detalle}
              </p>
            </div>

            {/* Zodiac insights */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="oracle-border p-4 text-center"
                style={{ background: 'rgba(26,21,64,.5)' }}
              >
                <p className="text-oracle-dim text-xs uppercase tracking-wider mb-1">Tu signo</p>
                <p className="font-serif text-oracle-gold text-lg">{datosSigno.nombre} {datosSigno.emoji}</p>
                <p className="text-oracle-dim text-xs capitalize mt-1">Elemento {datosSigno.elemento}</p>
              </div>
              <div
                className="oracle-border p-4 text-center"
                style={{ background: 'rgba(26,21,64,.5)' }}
              >
                <p className="text-oracle-dim text-xs uppercase tracking-wider mb-1">Tu alma gemela es</p>
                <p className="text-oracle-mid text-sm">
                  {datosSigno.soulmateDescribe.join(', ')}
                </p>
              </div>
            </div>

            {/* Sharing */}
            <div
              className="oracle-border p-6 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(212,24,128,.08) 0%, rgba(139,92,246,.08) 100%)',
                borderColor: 'rgba(212,24,128,.25)',
              }}
            >
              <p className="text-oracle-text font-semibold mb-1">¿Tus amigas ya conocen al suyo?</p>
              <p className="text-oracle-mid text-sm mb-5">
                Comparte tu resultado y deja que ellas también descubran su alma gemela.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={handleWhatsApp} className="btn-oracle-outline flex items-center gap-2 justify-center">
                  💬 WhatsApp
                </button>
                <button onClick={handleFacebook} className="btn-oracle-outline flex items-center gap-2 justify-center">
                  📘 Facebook
                </button>
                <button
                  onClick={handleShare}
                  className="btn-oracle-outline flex items-center gap-2 justify-center"
                >
                  {shared ? '✓ Copiado' : '🔗 Copiar link'}
                </button>
              </div>
            </div>

            {/* Upsell to next feature */}
            <div
              className="oracle-border p-6"
              style={{ background: 'rgba(26,21,64,.5)' }}
            >
              <p className="text-oracle-gold font-semibold mb-2">🃏 ¿Quieres saber más?</p>
              <p className="text-oracle-mid text-sm mb-4">
                Tu suscripción incluye lecturas de tarot ilimitadas, compatibilidad con tu crush
                y tu lectura del día cada mañana.
              </p>
              <Link href="/" className="btn-oracle w-full justify-center block text-center">
                Explorar el oráculo completo
              </Link>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}

export default function ResultadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-20 h-20 rounded-full animate-glow-pulse" style={{
          background: 'radial-gradient(circle at 38% 36%, rgba(242,168,0,.4) 0%, rgba(139,92,246,.3) 50%, transparent 80%)',
          border: '1px solid rgba(242,168,0,.4)',
        }} />
      </div>
    }>
      <ResultadoInner />
    </Suspense>
  )
}
