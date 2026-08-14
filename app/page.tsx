'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const BASE_COUNT  = 23_847
const BASE_TIME   = new Date('2026-08-14').getTime()
const RATE_PER_MS = 1 / 40_000

function getLiveCount(): number {
  const elapsed = Date.now() - BASE_TIME
  return Math.floor(BASE_COUNT + elapsed * RATE_PER_MS)
}

function useAnimatedCount(target: number, duration = 1400) {
  const [display, setDisplay] = useState(target - 300)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const start    = performance.now()
    const startVal = target - 300
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(startVal + (target - startVal) * eased))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return display
}

const PARTICLES_RV: [number, number, number, number][] = [
  [36, 58, 2.4, 0.58], [246, 78, 2, 0.5], [22, 152, 1.5, 0.42],
  [258, 164, 2.2, 0.54], [50, 262, 1.8, 0.44], [230, 282, 2, 0.5],
  [84, 28, 1.6, 0.52], [202, 24, 2, 0.56], [260, 100, 1.4, 0.4],
]

const TESTIMONIOS = [
  {
    texto:
      '¡Me quedé sin palabras! La imagen era exactamente como yo la imaginaba — ' +
      'esos ojos oscuros, esa sonrisa... Compartí mi tarjeta y mis amigas me escribieron toda la semana.',
    nombre: 'María L.',
    ciudad: 'Guadalajara',
    signo: '♎',
  },
  {
    texto:
      'Nunca creí en esto pero el mensaje me llegó al corazón. Decía exactamente ' +
      'lo que necesitaba escuchar sobre el amor. Ya llevo 3 meses de suscripción.',
    nombre: 'Sandra M.',
    ciudad: 'Monterrey',
    signo: '♋',
  },
  {
    texto:
      'La lectura de compatibilidad con mi novio fue increíble. Dos días después ' +
      'me pidió matrimonio. ¡La Pitonisa lo vio venir antes que yo!',
    nombre: 'Ana P.',
    ciudad: 'Ciudad de México',
    signo: '♏',
  },
]

function GrimorioDivider() {
  return <div className="grimorio-divider mb-16" aria-hidden>✦</div>
}

export default function LandingPage() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const [returning, setReturning] = useState<string | null>(null)
  const [liveCount, setLiveCount] = useState(getLiveCount)
  const countDisplay = useAnimatedCount(liveCount)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('oraculo_sub')
      if (raw) {
        const sub = JSON.parse(raw)
        if (sub.nombre) setReturning(sub.nombre.split(' ')[0])
      }
    } catch { /**/ }
  }, [])

  useEffect(() => {
    const iv = setInterval(() => setLiveCount(getLiveCount()), 40_000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const rawCtx = el.getContext('2d')
    if (!rawCtx) return
    const c: HTMLCanvasElement = el
    const ctx: CanvasRenderingContext2D = rawCtx
    let W = 0, H = 0
    let raf: number

    type Particle = {
      x: number; y: number; r: number; a: number
      vy: number; t: number; ts: number; color: string
    }
    let pts: Particle[] = []

    const COLORS = [
      'rgba(242,168,0,',
      'rgba(147,51,234,',
      'rgba(21,128,61,',
      'rgba(255,255,255,',
    ]

    function setup() {
      W = c.width  = window.innerWidth
      H = c.height = window.innerHeight
      const n = Math.min(Math.floor(W * H / 6500), 220)
      pts = Array.from({ length: n }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 1.5 + 0.3,
        a:  Math.random() * 0.45 + 0.08,
        vy: Math.random() * 0.1 + 0.03,
        t:  Math.random() * Math.PI * 2,
        ts: (Math.random() - 0.5) * 0.022,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }))
    }

    function frame() {
      ctx.clearRect(0, 0, W, H)
      for (const p of pts) {
        p.t += p.ts
        const alpha = p.a * (0.45 + 0.55 * Math.sin(p.t))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, 6.2832)
        ctx.fillStyle = p.color + alpha + ')'
        ctx.fill()
        p.y -= p.vy
        if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W }
      }
      raf = requestAnimationFrame(frame)
    }

    setup()
    frame()
    window.addEventListener('resize', setup)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', setup) }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} id="stars-canvas" aria-hidden="true" />

      {/* amethyst ambient */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(147,51,234,.07) 0%, transparent 60%)' }}
      />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pb-16 pt-24">

        {/* crystal orb — amethyst/forest */}
        <div className="relative mb-10 animate-float" aria-hidden>
          <div
            className="w-32 h-32 md:w-44 md:h-44 rounded-full animate-glow-pulse"
            style={{
              background: 'radial-gradient(circle at 38% 38%, rgba(147,51,234,.45) 0%, rgba(21,128,61,.2) 45%, rgba(242,168,0,.12) 75%, transparent 100%)',
              border: '1px solid rgba(147,51,234,.45)',
              boxShadow: '0 0 30px rgba(147,51,234,.35), 0 0 70px rgba(147,51,234,.15)',
            }}
          />
          <div
            className="absolute inset-4 rounded-full"
            style={{ background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,.15) 0%, transparent 60%)' }}
          />
        </div>

        {/* grimorio badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(147,51,234,.5))' }} />
          <p style={{ color: '#9333EA', fontSize: 10, letterSpacing: '5px', textTransform: 'uppercase', fontWeight: 600 }}>
            El Grimorio Digital
          </p>
          <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, rgba(147,51,234,.5), transparent)' }} />
        </div>

        <p className="text-oracle-dim text-xs tracking-[3px] uppercase mb-3">
          El Oráculo de la Pitonisa
        </p>

        <h1
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-oracle-gold text-glow-gold leading-[1.05] mb-6 max-w-3xl"
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          Descubre quién es<br/>tu alma gemela
        </h1>

        <p className="text-oracle-mid text-lg md:text-xl max-w-xl mb-10 leading-relaxed" style={{ textWrap: 'balance' } as React.CSSProperties}>
          La Pitonisa ha visto su rostro en la bola de cristal. Tu destino amoroso
          ya fue escrito — solo falta que lo leas.
        </p>

        <Link href="/consulta" className="btn-oracle btn-oracle-lg">
          Revelar mi alma gemela
          <span aria-hidden>→</span>
        </Link>

        <div className="flex flex-col sm:flex-row gap-3 mt-3 w-full max-w-sm justify-center">
          <Link href="/juego" className="btn-oracle-outline btn-oracle-lg flex-1 justify-center">
            🐉 Rueda del Destino
          </Link>
          <Link href="/chat" className="btn-oracle-outline btn-oracle-lg flex-1 justify-center">
            🔮 Chat con la Pitonisa
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-3 w-full max-w-sm justify-center">
          <Link
            href="/horoscopo"
            className="btn-oracle-outline btn-oracle-lg flex-1 justify-center"
            style={{ borderColor: 'rgba(147,51,234,.4)', color: '#9333EA' }}
          >
            ⭐ Horóscopo de hoy
          </Link>
          <Link
            href="/energias"
            className="btn-oracle-outline btn-oracle-lg flex-1 justify-center"
            style={{ borderColor: 'rgba(200,0,0,.4)', color: 'rgba(255,120,120,.9)' }}
          >
            🕯️ ¿Maldición?
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-3 w-full max-w-sm justify-center">
          <Link
            href="/tarot"
            className="btn-oracle-outline btn-oracle-lg flex-1 justify-center"
            style={{ borderColor: 'rgba(239,68,68,.4)', color: 'rgba(255,180,180,.9)' }}
          >
            🃏 El Tarot
          </Link>
          <Link
            href="/horoscopo"
            className="btn-oracle-outline btn-oracle-lg flex-1 justify-center"
            style={{ borderColor: 'rgba(21,128,61,.4)', color: '#4ADE80' }}
          >
            📜 Grimorio Personal
          </Link>
        </div>

        {returning ? (
          <div
            className="mt-4 oracle-border px-5 py-3 flex items-center gap-4 rounded-xl"
            style={{ background: 'rgba(26,21,64,.8)' }}
          >
            <span className="text-2xl">🔮</span>
            <div className="text-left flex-1">
              <p className="text-oracle-gold text-sm font-semibold">¡Bienvenida de nuevo, {returning}!</p>
              <p className="text-oracle-dim text-xs">Tu suscripción sigue activa</p>
            </div>
            <Link href="/resultado" className="btn-oracle px-4 py-2 text-xs whitespace-nowrap">
              Ver mi lectura →
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-oracle-dim text-sm flex items-center gap-2">
            <span style={{ color: '#9333EA' }}>✨</span>
            <span>
              <span className="text-oracle-gold font-semibold tabular-nums">
                {countDisplay.toLocaleString('es-MX')}
              </span>
              {' personas ya la conocieron · Pago seguro · Cancela cuando quieras'}
            </span>
          </p>
        )}
      </section>

      {/* ── PREVIEW ── */}
      <section className="relative py-20 px-6 max-w-4xl mx-auto">
        <GrimorioDivider />

        <p className="text-center text-oracle-dim text-xs tracking-[3px] uppercase mb-4">
          Lo que recibes
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-oracle-text text-center mb-14" style={{ textWrap: 'balance' } as React.CSSProperties}>
          La imagen de tu alma gemela,<br/>generada para ti
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* blurred — locked portrait */}
          <div className="oracle-border p-2 relative overflow-hidden">
            <div
              className="w-full aspect-[4/5] rounded-lg relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1A1540 0%, #231E55 100%)' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, filter: 'blur(14px)', transform: 'scale(1.08)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop&crop=faces&auto=format&q=70"
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(8,4,20,.5)' }}>
                <div className="text-4xl mb-3">🔒</div>
                <p className="text-oracle-dim text-sm font-medium">Imagen bloqueada</p>
              </div>
            </div>
            <p className="text-center text-oracle-dim text-xs mt-3 pb-1">Sin suscripción</p>
          </div>

          {/* revealed — portrait with amethyst mystical overlays */}
          <div className="p-2 relative" style={{
            border: '1px solid rgba(147,51,234,.4)',
            borderRadius: 12,
            boxShadow: '0 0 25px rgba(147,51,234,.3), 0 0 60px rgba(147,51,234,.12)',
          }}>
            <div
              className="w-full aspect-[4/5] rounded-lg relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1A1540 0%, #231E55 100%)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&crop=faces&auto=format&q=85"
                alt="Tu alma gemela"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
              />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to bottom, rgba(10,6,28,0) 45%, rgba(10,6,28,.9) 100%)',
              }} />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to right, rgba(21,128,61,.06) 0%, transparent 30%, rgba(147,51,234,.12) 100%)',
              }} />
              {PARTICLES_RV.map(([x, y, r, o], i) => (
                <div key={i} className="absolute rounded-full pointer-events-none" style={{
                  left: `${(x / 280) * 100}%`,
                  top:  `${(y / 350) * 100}%`,
                  width: r * 2,
                  height: r * 2,
                  background: `rgba(147,51,234,${o})`,
                }} />
              ))}
              <div className="absolute inset-0 flex items-end pb-4 justify-center">
                <span className="text-xs font-semibold tracking-wider uppercase opacity-90" style={{ color: '#B47FFF' }}>
                  Tu lectura revelada ✦
                </span>
              </div>
            </div>
            <p className="text-center text-xs mt-3 pb-1 font-semibold" style={{ color: '#9333EA' }}>
              Con suscripción — $49 MXN/mes
            </p>
            <div className="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded" style={{
              background: 'linear-gradient(135deg, #9333EA, #7C3AED)',
              color: '#fff',
            }}>
              HD
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <GrimorioDivider />

        <p className="text-center text-oracle-dim text-xs tracking-[3px] uppercase mb-4">
          Cómo funciona
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-oracle-text text-center mb-14" style={{ textWrap: 'balance' } as React.CSSProperties}>
          En tres pasos, el destino habla
        </h2>

        <div className="flex flex-col gap-8">
          {[
            {
              num: '01',
              title: 'Cuéntanos sobre ti',
              desc: 'Tu nombre y fecha de nacimiento le permiten a la Pitonisa leer la energía única de tu signo y calcular la vibración de tu destino amoroso.',
              icon: '✍️',
              color: 'rgba(242,168,0,.9)',
            },
            {
              num: '02',
              title: 'El oráculo te ve',
              desc: 'La inteligencia del oráculo consulta tu carta astral y genera una imagen única de tu alma gemela — nadie recibirá la misma imagen que tú.',
              icon: '🔮',
              color: 'rgba(147,51,234,.9)',
            },
            {
              num: '03',
              title: 'Conoce a tu alma gemela',
              desc: 'Recibes su imagen en alta definición y el mensaje que las estrellas tienen para ti. Una tarjeta lista para compartir con tus amigas.',
              icon: '💞',
              color: 'rgba(21,163,74,.9)',
            },
          ].map((paso) => (
            <div key={paso.num} className="oracle-border p-6 flex gap-5 items-start" style={{ background: 'rgba(26,21,64,.4)' }}>
              <div
                className="font-serif text-2xl min-w-[48px] text-center pt-1 tabular-nums"
                style={{ color: paso.color }}
                aria-hidden
              >
                {paso.num}
              </div>
              <div>
                <h3 className="text-oracle-text font-semibold text-lg mb-2">
                  {paso.icon} {paso.title}
                </h3>
                <p className="text-oracle-mid text-sm leading-relaxed">{paso.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EL GRIMORIO DIGITAL — 4 feature cards ── */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <GrimorioDivider />

        <p className="text-center text-oracle-dim text-xs tracking-[3px] uppercase mb-4">
          El Grimorio Digital
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-oracle-text text-center mb-14" style={{ textWrap: 'balance' } as React.CSSProperties}>
          La Pitonisa ve más que el amor
        </h2>

        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          {/* El Tarot — crimson */}
          <Link
            href="/tarot"
            className="group relative overflow-hidden"
            style={{ borderRadius: 12, border: '1px solid rgba(180,40,40,.35)', background: 'linear-gradient(135deg, rgba(70,0,15,.7), rgba(40,0,25,.8))' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(200,40,40,.12) 0%, transparent 70%)',
            }} />
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🃏</span>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: '#FF6B6B' }}>El Tarot</h3>
                  <span className="text-xs" style={{ color: 'rgba(255,107,107,.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>Lecturas personalizadas</span>
                </div>
              </div>
              <p className="text-oracle-mid text-sm leading-relaxed mb-4">
                La Pitonisa consulta las cartas y revela lo que el universo tiene preparado para ti en amor, dinero y salud.
              </p>
              <span className="text-sm group-hover:underline" style={{ color: '#FF6B6B' }}>Ver mi lectura →</span>
            </div>
          </Link>

          {/* Los Oráculos — amethyst */}
          <Link
            href="/chat"
            className="group relative overflow-hidden"
            style={{ borderRadius: 12, border: '1px solid rgba(147,51,234,.35)', background: 'linear-gradient(135deg, rgba(45,0,80,.7), rgba(25,0,55,.8))' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(147,51,234,.15) 0%, transparent 70%)',
            }} />
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔮</span>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: '#B47FFF' }}>Los Oráculos</h3>
                  <span className="text-xs" style={{ color: 'rgba(180,127,255,.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>5 preguntas gratis</span>
                </div>
              </div>
              <p className="text-oracle-mid text-sm leading-relaxed mb-4">
                Hazle cualquier pregunta sobre amor, trabajo o salud. La Pitonisa responde en segundos con claridad mística.
              </p>
              <span className="text-sm group-hover:underline" style={{ color: '#B47FFF' }}>Consultar gratis →</span>
            </div>
          </Link>

          {/* Revelación de Amor — rose */}
          <Link
            href="/consulta"
            className="group relative overflow-hidden"
            style={{ borderRadius: 12, border: '1px solid rgba(236,72,153,.35)', background: 'linear-gradient(135deg, rgba(70,0,50,.7), rgba(45,0,60,.8))' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(236,72,153,.12) 0%, transparent 70%)',
            }} />
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">💜</span>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: '#F472B6' }}>Revelación de Amor</h3>
                  <span className="text-xs" style={{ color: 'rgba(244,114,182,.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>⭐ El más popular</span>
                </div>
              </div>
              <p className="text-oracle-mid text-sm leading-relaxed mb-4">
                La IA genera el rostro exacto de tu alma gemela basado en tu energía zodiacal. Una imagen HD, única para ti.
              </p>
              <span className="text-sm group-hover:underline" style={{ color: '#F472B6' }}>Ver mi alma gemela →</span>
            </div>
          </Link>

          {/* Grimorio Personal — forest green */}
          <Link
            href="/horoscopo"
            className="group relative overflow-hidden"
            style={{ borderRadius: 12, border: '1px solid rgba(22,163,74,.35)', background: 'linear-gradient(135deg, rgba(0,45,20,.7), rgba(0,30,15,.8))' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(22,163,74,.12) 0%, transparent 70%)',
            }} />
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">📜</span>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: '#4ADE80' }}>Grimorio Personal</h3>
                  <span className="text-xs" style={{ color: 'rgba(74,222,128,.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>Tu perfil místico</span>
                </div>
              </div>
              <p className="text-oracle-mid text-sm leading-relaxed mb-4">
                Horóscopo diario, carta astral animada y diagnóstico de energías oscuras — todo en tu perfil personal.
              </p>
              <span className="text-sm group-hover:underline" style={{ color: '#4ADE80' }}>Abrir mi grimorio →</span>
            </div>
          </Link>
        </div>

        {/* quick access row */}
        <div className="grid sm:grid-cols-2 gap-5">
          <Link href="/horoscopo" className="oracle-border p-5 flex items-center gap-4 group hover:border-oracle-gold/50 transition-all" style={{ background: 'rgba(13,8,39,.5)' }}>
            <span className="text-4xl">⭐</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-oracle-gold font-semibold mb-0.5">Horóscopo de hoy</h3>
              <p className="text-oracle-dim text-xs">Amor · Dinero · Salud para tu signo</p>
            </div>
            <span className="text-oracle-dim text-sm group-hover:text-oracle-gold transition-colors">Ver →</span>
          </Link>
          <Link href="/juego" className="oracle-border p-5 flex items-center gap-4 group hover:border-oracle-gold/50 transition-all" style={{ background: 'rgba(13,8,39,.5)' }}>
            <span className="text-4xl">🐉</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-oracle-gold font-semibold mb-0.5">Rueda del Destino</h3>
              <p className="text-oracle-dim text-xs">Gira y recibe tu mensaje del día</p>
            </div>
            <span className="text-oracle-dim text-sm group-hover:text-oracle-gold transition-colors">Girar →</span>
          </Link>
        </div>
      </section>

      {/* ── FREEMIUM ── */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <GrimorioDivider />

        <p className="text-center text-oracle-dim text-xs tracking-[3px] uppercase mb-4">
          Planes
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-oracle-text text-center mb-14" style={{ textWrap: 'balance' } as React.CSSProperties}>
          Empieza gratis, descubre todo
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Gratis */}
          <div className="oracle-border p-8" style={{ background: 'rgba(13,8,39,.5)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{
                background: 'rgba(242,168,0,.08)',
                border: '1px solid rgba(242,168,0,.2)',
              }}>
                🌙
              </div>
              <div>
                <h3 className="text-oracle-text font-semibold text-xl">Gratis</h3>
                <p className="text-oracle-dim text-xs">Sin tarjeta de crédito</p>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                '🔮 Chat con la Pitonisa (5 preguntas)',
                '🕯️ Diagnóstico de energías oscuras',
                '🐉 Rueda del Destino (1 giro/día)',
                '⭐ Horóscopo diario',
              ].map(item => (
                <li key={item} className="text-oracle-mid text-sm flex items-start gap-2">
                  <span className="text-oracle-gold/60 mt-0.5 shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/chat" className="btn-oracle-outline block w-full text-center">
              Comenzar gratis →
            </Link>
          </div>

          {/* Premium */}
          <div className="relative p-8 overflow-hidden" style={{
            borderRadius: 12,
            border: '1px solid rgba(147,51,234,.5)',
            background: 'linear-gradient(135deg, rgba(35,5,70,.8), rgba(20,0,45,.9))',
            boxShadow: '0 0 30px rgba(147,51,234,.2)',
          }}>
            <div className="absolute top-0 right-0 text-xs font-bold px-3 py-1.5 rounded-bl-lg" style={{
              background: 'linear-gradient(135deg, #9333EA, #7C3AED)',
              color: '#fff',
              letterSpacing: '1px',
            }}>
              PREMIUM
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{
                background: 'rgba(147,51,234,.15)',
                border: '1px solid rgba(147,51,234,.3)',
              }}>
                💜
              </div>
              <div>
                <h3 className="font-semibold text-xl" style={{ color: '#B47FFF' }}>Premium</h3>
                <p className="text-oracle-dim text-xs">$49 MXN / mes · Cancela cuando quieras</p>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                '💞 Imagen de tu alma gemela en HD',
                '🌐 Carta astral animada personalizada',
                '🔮 Chat ilimitado con la Pitonisa',
                '📖 Lecturas ilimitadas del Tarot',
                '✨ Tarjeta compartible con tus amigas',
                '🔔 Horóscopo personalizado diario',
              ].map(item => (
                <li key={item} className="text-sm flex items-start gap-2" style={{ color: '#D4B8FF' }}>
                  <span style={{ color: '#9333EA' }} className="mt-0.5 shrink-0">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/consulta" className="btn-oracle block w-full text-center" style={{
              background: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)',
              color: '#fff',
            }}>
              Comenzar mi lectura →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <GrimorioDivider />

        <p className="text-center text-oracle-dim text-xs tracking-[3px] uppercase mb-4">
          Lo que dicen
        </p>
        <h2 className="font-serif text-3xl text-oracle-text text-center mb-12" style={{ textWrap: 'balance' } as React.CSSProperties}>
          Almas que ya encontraron al suyo
        </h2>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIOS.map((t) => (
            <div key={t.nombre} className="oracle-border p-6 flex flex-col gap-4" style={{ background: 'rgba(26,21,64,.4)' }}>
              <p className="text-oracle-mid text-sm leading-relaxed italic">&ldquo;{t.texto}&rdquo;</p>
              <div className="mt-auto flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                  style={{ background: 'rgba(147,51,234,.12)', border: '1px solid rgba(147,51,234,.2)' }}
                >
                  {t.signo}
                </div>
                <div>
                  <p className="text-oracle-text text-sm font-semibold">{t.nombre}</p>
                  <p className="text-oracle-dim text-xs">{t.ciudad}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE STATS ── */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <GrimorioDivider />

          <div
            className="oracle-border p-8 grid grid-cols-2 md:grid-cols-4 gap-6"
            style={{ background: 'rgba(13,8,39,.7)' }}
          >
            {[
              { value: countDisplay.toLocaleString('es-MX'), label: 'lecturas reveladas', icon: '🔮' },
              { value: '4.9★',   label: 'calificación promedio', icon: '⭐' },
              { value: '98%',    label: 'quedan satisfechas',     icon: '💞' },
              { value: '<2 min', label: 'para ver tu resultado',  icon: '⚡' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="font-serif text-oracle-gold text-2xl font-bold tabular-nums leading-none mb-1">
                  {stat.value}
                </p>
                <p className="text-oracle-dim text-xs leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-lg mx-auto text-center">
          <GrimorioDivider />

          <p className="text-xs tracking-[3px] uppercase mb-5" style={{ color: '#9333EA' }}>
            ¿Lista para conocerle?
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-oracle-gold text-glow-gold mb-4" style={{ textWrap: 'balance' } as React.CSSProperties}>
            Tu destino te espera
          </h2>
          <p className="text-oracle-mid mb-10 text-lg">
            Por solo <strong className="text-oracle-gold">$49 MXN al mes</strong> — menos que un café —
            descubre a tu alma gemela y recibe lecturas ilimitadas.
          </p>

          <Link href="/consulta" className="btn-oracle btn-oracle-lg">
            Comenzar mi lectura ahora
          </Link>

          <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
            {['🔒 Pago seguro', '✨ Cancela cuando quieras', '📱 Android e iOS'].map((item) => (
              <span key={item} className="text-oracle-dim text-xs">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t py-10 text-center text-oracle-dim text-xs" style={{ borderColor: 'rgba(147,51,234,.1)' }}>
        <p className="font-serif italic text-oracle-mid mb-2">
          "El destino no se adivina. Se diseña."
        </p>
        <p>© 2026 El Oráculo de la Pitonisa · Solo entretenimiento</p>
        <p className="mt-1">
          <Link href="/consulta" className="text-oracle-gold/70 hover:text-oracle-gold transition-colors">
            Comenzar
          </Link>
          {' · '}
          <Link href="/tarot" className="hover:text-oracle-gold transition-colors">
            Tarot
          </Link>
          {' · '}
          <Link href="/horoscopo" className="hover:text-oracle-gold transition-colors">
            Horóscopo
          </Link>
          {' · '}
          <Link href="/energias" className="hover:text-oracle-gold transition-colors">
            ¿Maldición?
          </Link>
          {' · '}
          <Link href="/chat" className="hover:text-oracle-gold transition-colors">
            Chat
          </Link>
          {' · '}
          <Link href="/cancelar" className="hover:text-oracle-gold transition-colors">
            Cancelar suscripción
          </Link>
        </p>
      </footer>
    </>
  )
}
