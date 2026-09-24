'use client'

import { useEffect, useRef } from 'react'
import type { Signo } from '@/lib/oracle'
import { getSignoExtra } from '@/lib/oracle'

const ZODIAC: { signo: Signo; symbol: string; angle: number }[] = [
  { signo: 'aries',       symbol: '♈', angle: 0   },
  { signo: 'tauro',       symbol: '♉', angle: 30  },
  { signo: 'geminis',     symbol: '♊', angle: 60  },
  { signo: 'cancer',      symbol: '♋', angle: 90  },
  { signo: 'leo',         symbol: '♌', angle: 120 },
  { signo: 'virgo',       symbol: '♍', angle: 150 },
  { signo: 'libra',       symbol: '♎', angle: 180 },
  { signo: 'escorpio',    symbol: '♏', angle: 210 },
  { signo: 'sagitario',   symbol: '♐', angle: 240 },
  { signo: 'capricornio', symbol: '♑', angle: 270 },
  { signo: 'acuario',     symbol: '♒', angle: 300 },
  { signo: 'piscis',      symbol: '♓', angle: 330 },
]

const COMPATIBLE: Record<Signo, Signo[]> = {
  aries:       ['leo', 'sagitario', 'libra'],
  tauro:       ['virgo', 'capricornio', 'escorpio'],
  geminis:     ['libra', 'acuario', 'sagitario'],
  cancer:      ['escorpio', 'piscis', 'capricornio'],
  leo:         ['aries', 'sagitario', 'acuario'],
  virgo:       ['tauro', 'capricornio', 'piscis'],
  libra:       ['geminis', 'acuario', 'aries'],
  escorpio:    ['cancer', 'piscis', 'tauro'],
  sagitario:   ['aries', 'leo', 'geminis'],
  capricornio: ['tauro', 'virgo', 'cancer'],
  acuario:     ['geminis', 'libra', 'leo'],
  piscis:      ['cancer', 'escorpio', 'virgo'],
}

// Pseudo-planet positions per sign (deterministic, visually interesting)
const PLANETS: { name: string; symbol: string; color: string; orbitRatio: number; speedFactor: number }[] = [
  { name: 'Sol',    symbol: '☉', color: '#F2A800', orbitRatio: 0.35, speedFactor: 1    },
  { name: 'Luna',   symbol: '☽', color: '#C8D8E8', orbitRatio: 0.27, speedFactor: 2.4  },
  { name: 'Venus',  symbol: '♀', color: '#FF8FAB', orbitRatio: 0.42, speedFactor: 0.62 },
  { name: 'Marte',  symbol: '♂', color: '#FF5252', orbitRatio: 0.20, speedFactor: 0.53 },
  { name: 'Mercurio', symbol: '☿', color: '#B0BEC5', orbitRatio: 0.31, speedFactor: 3.7 },
  { name: 'Júpiter', symbol: '♃', color: '#FFB74D', orbitRatio: 0.38, speedFactor: 0.08 },
]

const CUALIDADES: Record<Signo, string[]> = {
  aries:       ['Apasionado', 'Valiente', 'Directo', 'Pionero'],
  tauro:       ['Sensual', 'Leal', 'Paciente', 'Perseverante'],
  geminis:     ['Curioso', 'Ingenioso', 'Adaptable', 'Comunicativo'],
  cancer:      ['Intuitivo', 'Protector', 'Empático', 'Profundo'],
  leo:         ['Generoso', 'Carismático', 'Creativo', 'Leal'],
  virgo:       ['Analítico', 'Dedicado', 'Detallista', 'Práctico'],
  libra:       ['Romántico', 'Equilibrado', 'Elegante', 'Diplomático'],
  escorpio:    ['Intenso', 'Leal', 'Transformador', 'Perspicaz'],
  sagitario:   ['Aventurero', 'Optimista', 'Filosófico', 'Libre'],
  capricornio: ['Ambicioso', 'Disciplinado', 'Estratégico', 'Confiable'],
  acuario:     ['Original', 'Visionario', 'Independiente', 'Humanista'],
  piscis:      ['Empático', 'Artístico', 'Espiritual', 'Compasivo'],
}

interface Props {
  signo: Signo
  nombre: string
}

export default function CartaAstral({ signo, nombre }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const extra     = getSignoExtra(signo)
  const userZod   = ZODIAC.find(z => z.signo === signo)!
  const compatible = COMPATIBLE[signo] ?? []

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rawCtx = canvas.getContext('2d')
    if (!rawCtx) return
    const ctx = rawCtx

    const DPR  = window.devicePixelRatio || 1
    const SIZE = Math.min(window.innerWidth - 48, 400)
    canvas.width  = SIZE * DPR
    canvas.height = SIZE * DPR
    canvas.style.width  = SIZE + 'px'
    canvas.style.height = SIZE + 'px'
    ctx.scale(DPR, DPR)

    const cx = SIZE / 2
    const cy = SIZE / 2
    let rotation = 0
    let raf: number

    // Fixed star positions
    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * SIZE,
      y: Math.random() * SIZE,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.5 + 0.15,
      twinkle: Math.random() * Math.PI * 2,
    }))

    function deg2rad(d: number) { return (d - 90) * Math.PI / 180 }

    function draw(rot: number, t: number) {
      ctx.clearRect(0, 0, SIZE, SIZE)

      // ── Background gradient ──
      const bg = ctx.createRadialGradient(cx, cy * 0.7, 0, cx, cy, SIZE * 0.6)
      bg.addColorStop(0, 'rgba(28,16,60,1)')
      bg.addColorStop(1, 'rgba(8,6,20,1)')
      ctx.beginPath()
      ctx.arc(cx, cy, SIZE * 0.495, 0, Math.PI * 2)
      ctx.fillStyle = bg
      ctx.fill()

      // ── Stars ──
      stars.forEach(s => {
        const tw = Math.sin(t * 0.0015 + s.twinkle) * 0.25
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.alpha + tw})`
        ctx.fill()
      })

      // ── Outer glow halo ──
      const halo = ctx.createRadialGradient(cx, cy, SIZE * 0.36, cx, cy, SIZE * 0.5)
      halo.addColorStop(0, 'rgba(139,92,246,0)')
      halo.addColorStop(0.65, 'rgba(139,92,246,0.1)')
      halo.addColorStop(1, 'rgba(242,168,0,0.18)')
      ctx.beginPath()
      ctx.arc(cx, cy, SIZE * 0.495, 0, Math.PI * 2)
      ctx.fillStyle = halo
      ctx.fill()

      // ── Outer border rings ──
      ;[0.47, 0.462].forEach((r, i) => {
        ctx.beginPath()
        ctx.arc(cx, cy, SIZE * r, 0, Math.PI * 2)
        ctx.strokeStyle = i === 0 ? 'rgba(242,168,0,0.45)' : 'rgba(139,92,246,0.2)'
        ctx.lineWidth = i === 0 ? 1.2 : 0.6
        ctx.stroke()
      })

      // ── 12 house division lines ──
      for (let i = 0; i < 12; i++) {
        const angle = deg2rad(i * 30 + rot)
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(angle) * SIZE * 0.295, cy + Math.sin(angle) * SIZE * 0.295)
        ctx.lineTo(cx + Math.cos(angle) * SIZE * 0.461, cy + Math.sin(angle) * SIZE * 0.461)
        ctx.strokeStyle = 'rgba(139,92,246,0.22)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // ── Inner circles ──
      ;[0.30, 0.22, 0.14].forEach((r, i) => {
        ctx.beginPath()
        ctx.arc(cx, cy, SIZE * r, 0, Math.PI * 2)
        ctx.strokeStyle = i === 0
          ? 'rgba(242,168,0,0.25)'
          : i === 1
            ? 'rgba(139,92,246,0.2)'
            : 'rgba(0,212,184,0.2)'
        ctx.lineWidth = 0.6
        ctx.stroke()
      })

      // ── Compatibility aspect lines ──
      compatible.forEach(c => {
        const cZ = ZODIAC.find(z => z.signo === c)
        if (!cZ) return
        const a1 = deg2rad(userZod.angle + rot)
        const a2 = deg2rad(cZ.angle + rot)
        const r  = SIZE * 0.28

        const lg = ctx.createLinearGradient(
          cx + Math.cos(a1) * r, cy + Math.sin(a1) * r,
          cx + Math.cos(a2) * r, cy + Math.sin(a2) * r
        )
        lg.addColorStop(0, 'rgba(242,168,0,0.55)')
        lg.addColorStop(1, 'rgba(139,92,246,0.55)')
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r)
        ctx.lineTo(cx + Math.cos(a2) * r, cy + Math.sin(a2) * r)
        ctx.strokeStyle = lg
        ctx.lineWidth = 0.9
        ctx.stroke()
      })

      // ── Zodiac symbols on outer ring ──
      ZODIAC.forEach(({ signo: s, symbol, angle }) => {
        const rad   = deg2rad(angle + rot)
        const r     = SIZE * 0.405
        const x     = cx + Math.cos(rad) * r
        const y     = cy + Math.sin(rad) * r
        const isUser   = s === signo
        const isCompat = compatible.includes(s)

        if (isUser || isCompat) {
          const glowR = ctx.createRadialGradient(x, y, 0, x, y, 18)
          glowR.addColorStop(0, isUser ? 'rgba(242,168,0,0.6)' : 'rgba(139,92,246,0.45)')
          glowR.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.beginPath()
          ctx.arc(x, y, 18, 0, Math.PI * 2)
          ctx.fillStyle = glowR
          ctx.fill()
        }

        ctx.font       = `${isUser ? 20 : 13}px serif`
        ctx.textAlign  = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle  = isUser ? '#F2A800' : isCompat ? 'rgba(139,92,246,0.95)' : 'rgba(130,120,170,0.4)'
        ctx.fillText(symbol, x, y)
      })

      // ── Orbiting planets ──
      PLANETS.forEach((planet, i) => {
        const baseAngle = (i / PLANETS.length) * Math.PI * 2
        const pAngle    = baseAngle + (t * 0.0004 * planet.speedFactor)
        const pr        = SIZE * planet.orbitRatio
        const px        = cx + Math.cos(pAngle) * pr
        const py        = cy + Math.sin(pAngle) * pr
        const pr2       = Math.max(3.5, SIZE * 0.015)

        const r = parseInt(planet.color.slice(1, 3), 16)
        const g = parseInt(planet.color.slice(3, 5), 16)
        const b = parseInt(planet.color.slice(5, 7), 16)

        const glow = ctx.createRadialGradient(px, py, 0, px, py, pr2 * 2.5)
        glow.addColorStop(0, `rgba(${r},${g},${b},0.85)`)
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`)

        ctx.beginPath()
        ctx.arc(px, py, pr2 * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        ctx.beginPath()
        ctx.arc(px, py, pr2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},1)`
        ctx.fill()

        ctx.font      = `${SIZE * 0.028}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = `rgba(${r},${g},${b},0.9)`
        ctx.fillText(planet.symbol, px, py - pr2 - SIZE * 0.022)
      })

      // ── Center medallion ──
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, SIZE * 0.13)
      cg.addColorStop(0, 'rgba(42,28,80,1)')
      cg.addColorStop(0.7, 'rgba(20,14,50,1)')
      cg.addColorStop(1, 'rgba(8,6,20,1)')
      ctx.beginPath()
      ctx.arc(cx, cy, SIZE * 0.13, 0, Math.PI * 2)
      ctx.fillStyle = cg
      ctx.fill()
      ctx.strokeStyle = 'rgba(242,168,0,0.6)'
      ctx.lineWidth = 1.2
      ctx.stroke()

      ctx.font      = `${SIZE * 0.092}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#F2A800'
      ctx.shadowColor = 'rgba(242,168,0,0.8)'
      ctx.shadowBlur  = 12
      ctx.fillText(userZod.symbol, cx, cy)
      ctx.shadowBlur = 0
    }

    function animate() {
      rotation = (rotation + 0.012) % 360
      draw(rotation, Date.now())
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [signo, compatible, userZod])

  const el = extra.elementoPct
  const ELEM_BARS = [
    { label: 'Fuego', pct: el.fuego,  color: '#FF5252' },
    { label: 'Tierra', pct: el.tierra, color: '#69C16E' },
    { label: 'Aire',  pct: el.aire,   color: '#40C4FF' },
    { label: 'Agua',  pct: el.agua,   color: '#7986CB' },
  ]

  return (
    <div className="oracle-border overflow-hidden" style={{ background: 'rgba(8,6,20,.92)' }}>

      {/* Header */}
      <div
        className="px-6 pt-5 pb-3 text-center"
        style={{ borderBottom: '1px solid rgba(242,168,0,0.12)' }}
      >
        <p className="text-oracle-teal text-[10px] tracking-[4px] uppercase mb-1">Carta Astral Personal</p>
        <h2 className="font-serif text-2xl text-oracle-gold">
          {userZod.symbol} {signo.charAt(0).toUpperCase() + signo.slice(1)} — {nombre}
        </h2>
        <p className="text-oracle-dim text-xs mt-1">
          Planeta regente: <span className="text-oracle-mid">{extra.planeta}</span>
          {'  ·  '}
          Día de poder: <span className="text-oracle-mid">{extra.diaLucky}</span>
        </p>
      </div>

      {/* Canvas */}
      <div className="flex justify-center py-5 px-4">
        <canvas ref={canvasRef} />
      </div>

      {/* Planet legend */}
      <div
        className="px-5 pb-4 grid grid-cols-3 gap-2"
        style={{ borderTop: '1px solid rgba(139,92,246,0.12)' }}
      >
        {PLANETS.map(p => (
          <div
            key={p.name}
            className="flex items-center gap-1.5 py-1.5 px-2 rounded-lg"
            style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}
          >
            <span className="text-base" style={{ color: p.color }}>{p.symbol}</span>
            <span className="text-oracle-dim text-[11px]">{p.name}</span>
          </div>
        ))}
      </div>

      {/* Elemental affinity bars */}
      <div
        className="px-5 py-4"
        style={{ borderTop: '1px solid rgba(139,92,246,0.12)' }}
      >
        <p className="text-oracle-dim text-[10px] uppercase tracking-[3px] mb-3">Afinidad elemental</p>
        <div className="space-y-2.5">
          {ELEM_BARS.map(({ label, pct, color }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-oracle-dim text-xs w-12">{label}</span>
              <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${color}99, ${color})`,
                    boxShadow: `0 0 8px ${color}66`,
                  }}
                />
              </div>
              <span className="text-[11px] w-7 text-right" style={{ color }}>{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rasgos principales */}
      <div
        className="px-5 py-4"
        style={{ borderTop: '1px solid rgba(139,92,246,0.12)' }}
      >
        <p className="text-oracle-dim text-[10px] uppercase tracking-[3px] mb-3">Rasgos principales</p>
        <div className="flex flex-wrap gap-2">
          {CUALIDADES[signo].map(q => (
            <span
              key={q}
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background: 'rgba(242,168,0,0.08)',
                border: '1px solid rgba(242,168,0,0.25)',
                color: '#F2A800',
              }}
            >
              {q}
            </span>
          ))}
        </div>
      </div>

      {/* Lucky grid + compatibility */}
      <div
        className="px-5 py-4 grid grid-cols-2 gap-3"
        style={{ borderTop: '1px solid rgba(139,92,246,0.12)' }}
      >
        {/* Lucky properties */}
        <div
          className="rounded-xl p-3 space-y-2"
          style={{ background: 'rgba(242,168,0,0.05)', border: '1px solid rgba(242,168,0,0.15)' }}
        >
          <p className="text-oracle-dim text-[10px] uppercase tracking-[2px] mb-2">Propiedades de suerte</p>
          <Row icon="💎" label="Piedra" value={extra.piedra} />
          <Row icon="🎨" label="Color" value=" " dot={extra.colorLucky} />
          <Row icon="🔢" label="Número" value={String(extra.numero)} />
          <Row icon="🌟" label="Día" value={extra.diaLucky} />
        </div>

        {/* Compatible signs */}
        <div
          className="rounded-xl p-3"
          style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)' }}
        >
          <p className="text-oracle-dim text-[10px] uppercase tracking-[2px] mb-2">Alta compatibilidad</p>
          {compatible.map(c => {
            const cZ = ZODIAC.find(z => z.signo === c)!
            return (
              <div key={c} className="flex items-center gap-2 mb-2">
                <span className="text-lg">{cZ.symbol}</span>
                <div>
                  <p className="text-oracle-mid text-xs capitalize">{c}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map(i => (
                      <div
                        key={i}
                        className="w-2 h-1 rounded-full"
                        style={{
                          background: i <= 4 ? 'rgba(139,92,246,0.8)' : 'rgba(255,255,255,0.1)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer note */}
      <div
        className="px-5 py-3 text-center"
        style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}
      >
        <p className="text-oracle-dim text-[10px] italic">
          Las líneas doradas representan tus conexiones astrales más poderosas · Los planetas orbitan en tiempo real
        </p>
      </div>
    </div>
  )
}

function Row({ icon, label, value, dot }: { icon: string; label: string; value: string; dot?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{icon}</span>
      <span className="text-oracle-dim text-[11px]">{label}:</span>
      {dot ? (
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: dot }} />
      ) : (
        <span className="text-oracle-mid text-[11px] font-medium">{value}</span>
      )}
    </div>
  )
}
