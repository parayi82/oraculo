'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

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
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

        <Link href="/juego" className="mt-3 text-oracle-gold/80 hover:text-oracle-gold transition-colors text-sm flex items-center gap-2 justify-center">
          🎡 Consulta la Rueda del Destino — gratis
        </Link>

        <p className="mt-4 text-oracle-dim text-sm flex items-center gap-2">
          <span className="text-oracle-teal">✨</span>
          23,847 personas ya la conocieron · Pago seguro · Cancela cuando quieras
        </p>
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
          {/* blurry */}
          <div className="oracle-border p-2 relative overflow-hidden">
            <div
              className="w-full aspect-[4/5] rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1A1540 0%, #231E55 100%)' }}
            >
              {/* silhouette */}
              <div className="w-full h-full relative overflow-hidden rounded-lg" style={{ filter: 'blur(12px)' }}>
                <div className="absolute inset-0" style={{
                  background: 'radial-gradient(circle at 50% 40%, rgba(139,92,246,.4) 0%, rgba(17,13,40,.9) 70%)',
                }} />
                <svg viewBox="0 0 200 250" className="w-full h-full opacity-40" aria-hidden>
                  <ellipse cx="100" cy="85" rx="38" ry="45" fill="rgba(242,168,0,.3)" />
                  <path d="M42 250 Q42 160 100 155 Q158 160 158 250Z" fill="rgba(242,168,0,.2)" />
                </svg>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">🔒</div>
                <p className="text-oracle-dim text-sm font-medium">Imagen bloqueada</p>
              </div>
            </div>
            <p className="text-center text-oracle-dim text-xs mt-3 pb-1">Sin suscripción</p>
          </div>

          {/* revealed */}
          <div className="oracle-border glow-gold p-2 relative">
            <div
              className="w-full aspect-[4/5] rounded-lg overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1A1540 0%, #231E55 100%)' }}
            >
              <div className="w-full h-full relative" style={{
                background: 'radial-gradient(circle at 50% 40%, rgba(242,168,0,.15) 0%, rgba(8,6,20,.9) 70%)',
              }}>
                {/* placeholder portrait */}
                <svg viewBox="0 0 200 250" className="w-full h-full" aria-hidden>
                  <defs>
                    <radialGradient id="pg" cx="50%" cy="40%" r="55%">
                      <stop offset="0%" stopColor="rgba(242,168,0,.35)" />
                      <stop offset="100%" stopColor="rgba(8,6,20,0)" />
                    </radialGradient>
                  </defs>
                  <rect width="200" height="250" fill="#110D28" />
                  <rect width="200" height="250" fill="url(#pg)" />
                  <ellipse cx="100" cy="85" rx="38" ry="45" fill="rgba(242,168,0,.2)" />
                  <path d="M42 250 Q42 160 100 155 Q158 160 158 250Z" fill="rgba(242,168,0,.12)" />
                  {/* face sparkles */}
                  {[{ x: 78, y: 75 }, { x: 122, y: 75 }, { x: 100, y: 105 }].map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="rgba(242,168,0,.6)" />
                  ))}
                </svg>
                <div className="absolute inset-0 flex items-end pb-4 justify-center">
                  <span className="text-oracle-gold text-xs font-semibold tracking-wider uppercase opacity-80">
                    Tu lectura revelada ✨
                  </span>
                </div>
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
          <a href="mailto:hola@oraculopitonisa.com" className="hover:text-oracle-gold transition-colors">
            Contacto
          </a>
        </p>
      </footer>
    </>
  )
}
