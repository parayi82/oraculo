'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'

// Base user count — grows by ~1 every 40 seconds across all visitors
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
    const start     = performance.now()
    const startVal  = target - 300
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
    } catch { /* */ }
  }, [])

  // Increment counter every 40 seconds to stay live
  useEffect(() => {
    const iv = setInterval(() => setLiveCount(getLiveCount()), 40_000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const rawCtx = el.getContext('2d')
    if (!rawCtx) return
    // Capture as non-nullable for use inside closures
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
      'rgba(242,168,0,', 'rgba(0,212,184,',
      'rgba(139,92,246,', 'rgba(255,255,255,',
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
      <canvas
        ref={canvasRef}
        id="stars-canvas"
        aria-hidden="true"
      />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pb-16 pt-24">
        {/* crystal orb */}
        <div className="relative mb-10 animate-float" aria-hidden="true">
          <div
            className="w-32 h-32 md:w-44 md:h-44 rounded-full glow-gold-strong animate-glow-pulse"
            style={{
              background:
                'radial-gradient(circle at 38% 38%, rgba(242,168,0,.35) 0%, rgba(139,92,246,.25) 40%, rgba(0,212,184,.12) 70%, transparent 100%)',
              border: '1px solid rgba(242,168,0,.4)',
            }}
          />
          <div
            className="absolute inset-4 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 35% 35%, rgba(255,255,255,.18) 0%, transparent 60%)',
            }}
          />
        </div>

        <p className="text-oracle-teal text-xs tracking-[4px] uppercase mb-5">
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
        <div className="mt-2 flex gap-4 justify-center flex-wrap">
          <Link href="/horoscopo" className="text-oracle-dim text-xs hover:text-oracle-teal transition-colors underline underline-offset-4">
            Ver horóscopo de hoy →
          </Link>
          <Link href="/energias" className="text-xs hover:underline underline-offset-4 transition-colors" style={{ color: 'rgba(255,100,100,.65)' }}>
            🕯️ ¿Tienes una maldición?
          </Link>
        </div>

        {returning ? (
          <div
            className="mt-4 oracle-border px-5 py-3 flex items-center gap-4 rounded-xl"
            style={{ background: 'rgba(26,21,64,.8)' }}
          >
            <span className="text-oracle-teal text-xl">🔮</span>
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
            <span className="text-oracle-teal">✨</span>
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
        <div className="divider-gold mb-16" />

        <p className="text-center text-oracle-dim text-xs tracking-[3px] uppercase mb-4">
          Lo que recibes
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-oracle-text text-center mb-14" style={{ textWrap: 'balance' } as React.CSSProperties}>
          La imagen de tu alma gemela,<br/>generada para ti
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* blurry — locked portrait */}
          <div className="oracle-border p-2 relative overflow-hidden">
            <div
              className="w-full aspect-[4/5] rounded-lg relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1A1540 0%, #231E55 100%)' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, filter: 'blur(14px)', transform: 'scale(1.08)' }}>
                <svg viewBox="0 0 280 350" style={{ width: '100%', height: '100%' }} aria-hidden>
                  <defs>
                    <radialGradient id="bl-bg" cx="50%" cy="40%" r="65%">
                      <stop offset="0%" stopColor="#28144A" />
                      <stop offset="100%" stopColor="#070512" />
                    </radialGradient>
                    <radialGradient id="bl-face" cx="44%" cy="36%" r="58%">
                      <stop offset="0%" stopColor="#C8945E" />
                      <stop offset="65%" stopColor="#A87248" />
                      <stop offset="100%" stopColor="#7A5035" />
                    </radialGradient>
                    <radialGradient id="bl-vgn" cx="50%" cy="50%" r="72%">
                      <stop offset="50%" stopColor="transparent" />
                      <stop offset="100%" stopColor="rgba(4,2,12,.9)" />
                    </radialGradient>
                  </defs>
                  <rect width="280" height="350" fill="url(#bl-bg)" />
                  <path d="M0 350 L28 278 Q54 250 86 242 L140 238 L194 242 Q226 250 252 278 L280 350Z" fill="#1C0A28" />
                  <rect x="122" y="200" width="36" height="52" rx="9" fill="#A87248" />
                  <ellipse cx="140" cy="148" rx="68" ry="83" fill="url(#bl-face)" />
                  <ellipse cx="74" cy="156" rx="11" ry="16" fill="#9A6840" />
                  <ellipse cx="206" cy="156" rx="11" ry="16" fill="#9A6840" />
                  <path d="M72 128 Q74 66 106 44 Q140 26 174 44 Q206 66 208 128 Q193 84 140 80 Q87 84 72 128Z" fill="#1C0A06" />
                  <path d="M72 128 Q62 162 65 200 Q75 210 84 204 Q77 170 82 140Z" fill="#130706" />
                  <path d="M208 128 Q218 162 215 200 Q205 210 196 204 Q203 170 198 140Z" fill="#130706" />
                  <ellipse cx="84" cy="155" rx="22" ry="42" fill="rgba(55,20,8,.22)" />
                  <ellipse cx="196" cy="155" rx="22" ry="42" fill="rgba(55,20,8,.22)" />
                  <ellipse cx="112" cy="150" rx="20" ry="13" fill="rgba(70,28,10,.3)" />
                  <ellipse cx="168" cy="150" rx="20" ry="13" fill="rgba(70,28,10,.3)" />
                  <path d="M94 136 Q112 128 130 135" stroke="#200C04" strokeWidth="3.2" fill="none" strokeLinecap="round" />
                  <path d="M150 135 Q168 128 186 136" stroke="#200C04" strokeWidth="3.2" fill="none" strokeLinecap="round" />
                  <ellipse cx="112" cy="152" rx="15" ry="9.5" fill="#EAE4D8" />
                  <ellipse cx="168" cy="152" rx="15" ry="9.5" fill="#EAE4D8" />
                  <circle cx="112" cy="153" r={8} fill="#3E2008" />
                  <circle cx="168" cy="153" r={8} fill="#3E2008" />
                  <circle cx="112" cy="153" r={5} fill="#080404" />
                  <circle cx="168" cy="153" r={5} fill="#080404" />
                  <circle cx="109" cy="150" r={2.2} fill="rgba(255,255,255,.7)" />
                  <circle cx="165" cy="150" r={2.2} fill="rgba(255,255,255,.7)" />
                  <path d="M97 147 Q112 139 127 147" stroke="#100504" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                  <path d="M153 147 Q168 139 183 147" stroke="#100504" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                  <path d="M140 144 L135 173 Q128 179 131 182" stroke="rgba(80,38,14,.45)" strokeWidth="1.6" fill="none" />
                  <path d="M140 144 L145 173 Q152 179 149 182" stroke="rgba(80,38,14,.45)" strokeWidth="1.6" fill="none" />
                  <ellipse cx="131" cy="179" rx="8" ry="5.5" fill="rgba(88,38,16,.38)" />
                  <ellipse cx="149" cy="179" rx="8" ry="5.5" fill="rgba(88,38,16,.38)" />
                  <path d="M117 197 Q129 190 140 191 Q151 190 163 197 Q152 209 140 210 Q128 209 117 197Z" fill="#B05840" />
                  <path d="M117 197 Q129 191 140 191 Q151 191 163 197" fill="none" stroke="rgba(145,60,42,.9)" strokeWidth="1.5" />
                  <path d="M207 108 Q220 152 212 200" stroke="rgba(139,92,246,.28)" strokeWidth="9" fill="none" strokeLinecap="round" />
                  <rect width="280" height="350" fill="url(#bl-vgn)" />
                </svg>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(8,4,20,.5)' }}>
                <div className="text-4xl mb-3">🔒</div>
                <p className="text-oracle-dim text-sm font-medium">Imagen bloqueada</p>
              </div>
            </div>
            <p className="text-center text-oracle-dim text-xs mt-3 pb-1">Sin suscripción</p>
          </div>

          {/* revealed — portrait with golden light */}
          <div className="oracle-border glow-gold p-2 relative">
            <div
              className="w-full aspect-[4/5] rounded-lg relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1A1540 0%, #231E55 100%)' }}
            >
              <svg
                viewBox="0 0 280 350"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                aria-hidden
              >
                <defs>
                  <radialGradient id="rv-bg" cx="50%" cy="38%" r="68%">
                    <stop offset="0%" stopColor="#2A1A32" />
                    <stop offset="100%" stopColor="#080618" />
                  </radialGradient>
                  <radialGradient id="rv-face" cx="46%" cy="34%" r="56%">
                    <stop offset="0%" stopColor="#DFB887" />
                    <stop offset="60%" stopColor="#C4986A" />
                    <stop offset="100%" stopColor="#9A7050" />
                  </radialGradient>
                  <linearGradient id="rv-hair" x1="20%" y1="0%" x2="80%" y2="100%">
                    <stop offset="0%" stopColor="#6A3818" />
                    <stop offset="55%" stopColor="#471E0A" />
                    <stop offset="100%" stopColor="#280E04" />
                  </linearGradient>
                  <radialGradient id="rv-vgn" cx="50%" cy="50%" r="72%">
                    <stop offset="48%" stopColor="transparent" />
                    <stop offset="100%" stopColor="rgba(5,3,14,.9)" />
                  </radialGradient>
                </defs>
                <rect width="280" height="350" fill="url(#rv-bg)" />
                <ellipse cx="140" cy="140" rx="82" ry="98" fill="rgba(242,168,0,.05)" />
                <path d="M-10 350 L22 272 Q46 248 80 240 L140 236 L200 240 Q234 248 258 272 L290 350Z" fill="#16103A" />
                <rect x="122" y="198" width="36" height="50" rx="9" fill="#C4986A" />
                <ellipse cx="140" cy="146" rx="70" ry="84" fill="url(#rv-face)" />
                <ellipse cx="72" cy="154" rx="11" ry="16" fill="#B88C5E" />
                <ellipse cx="208" cy="154" rx="11" ry="16" fill="#B88C5E" />
                <path d="M70 124 Q72 60 106 38 Q140 20 174 38 Q208 60 210 124 Q196 78 140 74 Q84 78 70 124Z" fill="url(#rv-hair)" />
                <path d="M70 124 Q58 160 56 222 Q60 255 68 275 L80 285 Q74 250 76 210 Q76 164 84 138Z" fill="#3A1608" />
                <path d="M210 124 Q222 160 224 222 Q220 255 212 275 L200 285 Q206 250 204 210 Q204 164 196 138Z" fill="#2A1006" />
                <ellipse cx="82" cy="156" rx="22" ry="40" fill="rgba(52,20,8,.2)" />
                <ellipse cx="198" cy="156" rx="22" ry="40" fill="rgba(52,20,8,.2)" />
                <ellipse cx="112" cy="148" rx="21" ry="13.5" fill="rgba(62,26,10,.27)" />
                <ellipse cx="168" cy="148" rx="21" ry="13.5" fill="rgba(62,26,10,.27)" />
                <path d="M92 133 Q112 124 132 131" stroke="#2A0E06" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M148 131 Q168 124 188 133" stroke="#2A0E06" strokeWidth="3" fill="none" strokeLinecap="round" />
                <ellipse cx="112" cy="149" rx="16" ry="10" fill="#F0EAE0" />
                <ellipse cx="168" cy="149" rx="16" ry="10" fill="#F0EAE0" />
                <circle cx="112" cy="150" r={8.5} fill="#6B3C10" />
                <circle cx="168" cy="150" r={8.5} fill="#6B3C10" />
                <circle cx="112" cy="150" r={6} fill="#4A2808" />
                <circle cx="168" cy="150" r={6} fill="#4A2808" />
                <circle cx="112" cy="150" r={3.8} fill="#080402" />
                <circle cx="168" cy="150" r={3.8} fill="#080402" />
                <circle cx="112" cy="150" r={8.5} fill="none" stroke="rgba(185,120,40,.38)" strokeWidth="1" />
                <circle cx="168" cy="150" r={8.5} fill="none" stroke="rgba(185,120,40,.38)" strokeWidth="1" />
                <circle cx="109" cy="147" r={2.5} fill="rgba(255,255,255,.78)" />
                <circle cx="165" cy="147" r={2.5} fill="rgba(255,255,255,.78)" />
                <circle cx="114" cy="153" r={1.2} fill="rgba(255,255,255,.35)" />
                <circle cx="170" cy="153" r={1.2} fill="rgba(255,255,255,.35)" />
                <path d="M96 144 Q112 136 128 144" stroke="#160804" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <path d="M152 144 Q168 136 184 144" stroke="#160804" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <path d="M97 154 Q112 159 127 154" stroke="rgba(100,58,24,.28)" strokeWidth="1" fill="none" />
                <path d="M153 154 Q168 159 183 154" stroke="rgba(100,58,24,.28)" strokeWidth="1" fill="none" />
                <path d="M140 141 L135 170 Q128 176 130 180" stroke="rgba(78,36,13,.42)" strokeWidth="1.6" fill="none" />
                <path d="M140 141 L145 170 Q152 176 150 180" stroke="rgba(78,36,13,.42)" strokeWidth="1.6" fill="none" />
                <ellipse cx="130" cy="177" rx="8.5" ry="5.5" fill="rgba(86,36,15,.36)" />
                <ellipse cx="150" cy="177" rx="8.5" ry="5.5" fill="rgba(86,36,15,.36)" />
                <ellipse cx="140" cy="173" rx="10" ry="6" fill="rgba(205,158,100,.13)" />
                <path d="M116 196 Q128 188 140 189 Q152 188 164 196 Q155 207 140 209 Q125 207 116 196Z" fill="#C06050" />
                <path d="M116 196 Q128 189 140 189 Q152 189 164 196" fill="none" stroke="rgba(158,68,52,.85)" strokeWidth="1.6" />
                <ellipse cx="140" cy="202" rx="12" ry="4" fill="rgba(220,140,110,.18)" />
                <ellipse cx="140" cy="228" rx="20" ry="8" fill="rgba(180,130,82,.12)" />
                <path d="M208 105 Q224 148 216 198" stroke="rgba(242,168,0,.3)" strokeWidth="12" fill="none" strokeLinecap="round" />
                <path d="M72 112 Q62 154 68 194" stroke="rgba(0,212,184,.11)" strokeWidth="6" fill="none" strokeLinecap="round" />
                {PARTICLES_RV.map(([x, y, r, o], i) => (
                  <circle key={i} cx={x} cy={y} r={r} fill={`rgba(242,168,0,${o})`} />
                ))}
                <rect width="280" height="350" fill="url(#rv-vgn)" />
                <rect width="280" height="350" fill="rgba(242,168,0,.025)" />
              </svg>
              <div className="absolute inset-0 flex items-end pb-4 justify-center">
                <span className="text-oracle-gold text-xs font-semibold tracking-wider uppercase opacity-80">
                  Tu lectura revelada ✨
                </span>
              </div>
            </div>
            <p className="text-center text-oracle-gold text-xs mt-3 pb-1 font-semibold">
              Con suscripción — $49 MXN/mes
            </p>
            <div className="absolute top-4 right-4 bg-oracle-gold text-oracle-bg text-xs font-bold px-2 py-1 rounded">
              HD
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <div className="divider-gold mb-16" />

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
            },
            {
              num: '02',
              title: 'El oráculo te ve',
              desc: 'La inteligencia del oráculo consulta tu carta astral y genera una imagen única de tu alma gemela — nadie recibirá la misma imagen que tú.',
              icon: '🔮',
            },
            {
              num: '03',
              title: 'Conoce a tu alma gemela',
              desc: 'Recibes su imagen en alta definición y el mensaje que las estrellas tienen para ti. Una tarjeta lista para compartir con tus amigas.',
              icon: '💞',
            },
          ].map((paso) => (
            <div key={paso.num} className="oracle-border p-6 flex gap-5 items-start bg-oracle-surface">
              <div
                className="text-oracle-gold font-serif text-2xl min-w-[48px] text-center pt-1"
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

      {/* ── SERVICIOS ── */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="divider-gold mb-16" />

        <p className="text-center text-oracle-dim text-xs tracking-[3px] uppercase mb-4">
          Todo lo que puedes descubrir
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-oracle-text text-center mb-14" style={{ textWrap: 'balance' } as React.CSSProperties}>
          La Pitonisa ve más que el amor
        </h2>

        <div className="grid sm:grid-cols-2 gap-5 mb-5">

          {/* Alma gemela */}
          <Link href="/consulta" className="oracle-border p-6 group hover:border-oracle-gold/50 transition-all" style={{ background: 'rgba(26,21,64,.5)' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">💞</span>
              <div>
                <h3 className="text-oracle-gold font-semibold text-lg">Imagen de tu alma gemela</h3>
                <span className="text-oracle-teal text-xs">⭐ El más popular</span>
              </div>
            </div>
            <p className="text-oracle-mid text-sm leading-relaxed mb-4">
              La IA genera el rostro exacto de tu alma gemela basado en tu signo zodiacal.
              Una imagen en HD, única para ti.
            </p>
            <span className="text-oracle-gold text-sm group-hover:underline">Ver mi alma gemela →</span>
          </Link>

          {/* Trabajito — GANCHO OSCURO */}
          <Link
            href="/energias"
            className="group overflow-hidden relative"
            style={{
              borderRadius: 12,
              border: '1px solid rgba(200,0,0,.35)',
              background: 'linear-gradient(135deg, rgba(60,0,0,.7), rgba(30,0,40,.8))',
            }}
          >
            {/* Glow pulse */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(200,0,0,.15) 0%, transparent 70%)',
            }} />
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🕯️</span>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: '#FF6B6B' }}>
                    ¿Te están haciendo un trabajito?
                  </h3>
                  <span className="text-red-400/70 text-xs tracking-wider uppercase">Diagnóstico de maldiciones</span>
                </div>
              </div>
              <p className="text-oracle-mid text-sm leading-relaxed mb-4">
                La Pitonisa detecta si hay energías oscuras, mal de ojo o brujería
                dirigida hacia ti. Responde 10 preguntas y descúbrelo.
              </p>
              <span className="text-sm group-hover:underline" style={{ color: '#FF6B6B' }}>Hacer el diagnóstico — gratis →</span>
            </div>
          </Link>

          {/* Carta astral */}
          <Link href="/consulta" className="oracle-border p-6 group hover:border-oracle-gold/50 transition-all" style={{ background: 'rgba(13,8,39,.6)' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🌐</span>
              <div>
                <h3 className="text-oracle-gold font-semibold text-lg">Tu carta astral animada</h3>
                <span className="text-oracle-dim text-xs">Incluida con la suscripción</span>
              </div>
            </div>
            <p className="text-oracle-mid text-sm leading-relaxed mb-4">
              Visualiza en tiempo real tus signos compatibles, las líneas de
              energía zodiacal y los planetas que rigen tu destino amoroso.
            </p>
            <span className="text-oracle-gold text-sm group-hover:underline">Desbloquear mi carta →</span>
          </Link>

          {/* Chat */}
          <Link href="/chat" className="oracle-border p-6 group hover:border-oracle-gold/50 transition-all" style={{ background: 'rgba(13,8,39,.6)' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🔮</span>
              <div>
                <h3 className="text-oracle-gold font-semibold text-lg">Chat con la Pitonisa</h3>
                <span className="text-oracle-teal text-xs">5 preguntas gratis</span>
              </div>
            </div>
            <p className="text-oracle-mid text-sm leading-relaxed mb-4">
              Hazle cualquier pregunta sobre amor, trabajo, salud o lo que
              te preocupa. Responde en segundos con claridad mística.
            </p>
            <span className="text-oracle-gold text-sm group-hover:underline">Hablar ahora — gratis →</span>
          </Link>
        </div>

        {/* Horoscopo y Rueda */}
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

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="divider-gold mb-16" />

        <p className="text-center text-oracle-dim text-xs tracking-[3px] uppercase mb-4">
          Lo que dicen
        </p>
        <h2 className="font-serif text-3xl text-oracle-text text-center mb-12" style={{ textWrap: 'balance' } as React.CSSProperties}>
          Almas que ya encontraron al suyo
        </h2>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIOS.map((t) => (
            <div key={t.nombre} className="oracle-border p-6 bg-oracle-surface flex flex-col gap-4">
              <p className="text-oracle-mid text-sm leading-relaxed italic">&ldquo;{t.texto}&rdquo;</p>
              <div className="mt-auto flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                  style={{ background: 'rgba(242,168,0,.12)', border: '1px solid rgba(242,168,0,.2)' }}
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
          <div className="divider-gold mb-16" />

          <div
            className="oracle-border p-8 grid grid-cols-2 md:grid-cols-4 gap-6"
            style={{ background: 'rgba(13,8,39,.7)' }}
          >
            {[
              { value: countDisplay.toLocaleString('es-MX'), label: 'lecturas reveladas', icon: '🔮' },
              { value: '4.9★',  label: 'calificación promedio',  icon: '⭐' },
              { value: '98%',   label: 'quedan satisfechas',      icon: '💞' },
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
          <div className="divider-gold mb-16" />

          <p className="text-oracle-teal text-xs tracking-[3px] uppercase mb-5">¿Lista para conocerle?</p>
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
      <footer className="border-t border-oracle-gold/10 py-10 text-center text-oracle-dim text-xs">
        <p className="font-serif italic text-oracle-mid mb-2">
          "El destino no se adivina. Se diseña."
        </p>
        <p>© 2026 El Oráculo de la Pitonisa · Solo entretenimiento</p>
        <p className="mt-1">
          <Link href="/consulta" className="text-oracle-gold/70 hover:text-oracle-gold transition-colors">
            Comenzar
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
