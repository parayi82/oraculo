'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

// ── Categorías — dark jewel-tone palette ──────────────────────────────────────

const CATEGORIAS = [
  { id: 'amor',        symbol: '♥',  label: 'Amor',        dark: '#1E0008', base: '#5C0A14', mid: '#8B1828', glow: '#FF1744' },
  { id: 'prosperidad', symbol: '◆',  label: 'Prosperidad', dark: '#1A1100', base: '#3D2C00', mid: '#7A5800', glow: '#FFD700' },
  { id: 'salud',       symbol: '✚',  label: 'Salud',       dark: '#001510', base: '#003828', mid: '#005A42', glow: '#00BFA5' },
  { id: 'carrera',     symbol: '⚔',  label: 'Carrera',     dark: '#0E0020', base: '#2D0050', mid: '#520090', glow: '#AA00FF' },
  { id: 'familia',     symbol: '☽',  label: 'Familia',     dark: '#1A0600', base: '#4A1200', mid: '#7A2800', glow: '#FF6D00' },
  { id: 'suerte',      symbol: '★',  label: 'Suerte',      dark: '#141000', base: '#352000', mid: '#5E3800', glow: '#FFEA00' },
  { id: 'advertencia', symbol: '☠',  label: 'Advertencia', dark: '#140000', base: '#420000', mid: '#720000', glow: '#FF1744' },
  { id: 'misterio',    symbol: '✶',  label: 'Misterio',    dark: '#030018', base: '#0A0035', mid: '#1A0065', glow: '#651FFF' },
]

const N   = CATEGORIAS.length
const SEG = 360 / N

type Phase = 'idle' | 'spinning' | 'revealing' | 'done'
type Cat   = typeof CATEGORIAS[0]

// ── Epic canvas wheel ─────────────────────────────────────────────────────────

function drawWheel(canvas: HTMLCanvasElement, rotation: number) {
  const ctx  = canvas.getContext('2d')!
  const size = canvas.width
  const cx   = size / 2
  const cy   = size / 2
  const r    = size / 2 - 10

  ctx.clearRect(0, 0, size, size)

  // Outer glow halo
  const halo = ctx.createRadialGradient(cx, cy, r - 6, cx, cy, r + 14)
  halo.addColorStop(0, 'rgba(180,120,0,0.55)')
  halo.addColorStop(0.5, 'rgba(220,160,0,0.2)')
  halo.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.beginPath()
  ctx.arc(cx, cy, r + 14, 0, Math.PI * 2)
  ctx.fillStyle = halo
  ctx.fill()

  // ── Segments ──
  CATEGORIAS.forEach((cat, i) => {
    const sa  = (i * SEG - 90 + rotation) * (Math.PI / 180)
    const ea  = sa + SEG * (Math.PI / 180)
    const mid = sa + (SEG / 2) * (Math.PI / 180)

    // Depth gradient: bright near segment midpoint, dark at rim
    const gx = cx + Math.cos(mid) * r * 0.46
    const gy = cy + Math.sin(mid) * r * 0.46
    const seg = ctx.createRadialGradient(gx, gy, 0, gx, gy, r * 0.75)
    seg.addColorStop(0,    cat.mid)
    seg.addColorStop(0.55, cat.base)
    seg.addColorStop(1,    cat.dark)

    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, sa, ea)
    ctx.closePath()
    ctx.fillStyle = seg
    ctx.fill()

    // Scale texture — clipped concentric arcs + radial lines
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, sa, ea)
    ctx.closePath()
    ctx.clip()

    const rings = 7
    for (let k = 1; k <= rings; k++) {
      ctx.beginPath()
      ctx.arc(cx, cy, (k / rings) * r, sa, ea)
      ctx.strokeStyle = 'rgba(0,0,0,0.22)'
      ctx.lineWidth = 0.8
      ctx.stroke()
    }
    const spokes = 5
    for (let k = 1; k < spokes; k++) {
      const a = sa + (k / spokes) * SEG * (Math.PI / 180)
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
      ctx.strokeStyle = 'rgba(0,0,0,0.18)'
      ctx.lineWidth = 0.6
      ctx.stroke()
    }
    ctx.restore()

    // Segment border — three layers
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, sa, ea)
    ctx.closePath()
    ctx.strokeStyle = 'rgba(0,0,0,0.85)'
    ctx.lineWidth = 3.5
    ctx.stroke()
    ctx.strokeStyle = 'rgba(160,110,0,0.9)'
    ctx.lineWidth = 1.8
    ctx.stroke()
    ctx.strokeStyle = 'rgba(255,210,60,0.35)'
    ctx.lineWidth = 0.7
    ctx.stroke()

    // Symbol
    const symR = r * 0.56
    const sx = cx + Math.cos(mid) * symR
    const sy = cy + Math.sin(mid) * symR
    ctx.save()
    ctx.translate(sx, sy)
    ctx.rotate(mid + Math.PI / 2)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = cat.glow
    ctx.shadowBlur = 16
    ctx.fillStyle = '#FFD060'
    ctx.font = `${size * 0.062}px Georgia, serif`
    ctx.fillText(cat.symbol, 0, 0)
    ctx.restore()

    // Label text
    const txtR = r * 0.79
    const tx = cx + Math.cos(mid) * txtR
    const ty = cy + Math.sin(mid) * txtR
    ctx.save()
    ctx.translate(tx, ty)
    ctx.rotate(mid + Math.PI / 2)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(0,0,0,1)'
    ctx.shadowBlur = 8
    ctx.fillStyle = 'rgba(255,225,140,0.95)'
    ctx.font = `bold ${size * 0.034}px Georgia, 'Times New Roman', serif`
    ctx.fillText(cat.label.toUpperCase(), 0, 0)
    ctx.restore()
  })

  // ── Outer decorative ring ──
  // Shadow stroke
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(0,0,0,0.9)'
  ctx.lineWidth = 7
  ctx.stroke()
  // Gold main ring
  ctx.strokeStyle = 'rgba(160,110,0,0.95)'
  ctx.lineWidth = 4
  ctx.stroke()
  // Bright highlight
  ctx.strokeStyle = 'rgba(255,215,50,0.55)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Tick marks around rim
  const ticks = 64
  for (let t = 0; t < ticks; t++) {
    const a      = (t / ticks) * Math.PI * 2
    const isMain = t % 8 === 0
    const isMid  = t % 4 === 0
    const inner  = r + 3 - (isMain ? 11 : isMid ? 7 : 4)
    const outer  = r + 5
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner)
    ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer)
    ctx.strokeStyle = isMain
      ? 'rgba(255,210,50,0.9)'
      : isMid
      ? 'rgba(200,150,20,0.65)'
      : 'rgba(120,80,0,0.4)'
    ctx.lineWidth = isMain ? 2.5 : 1.2
    ctx.stroke()
  }

  // ── Inner filigree ring near center ──
  const fR = r * 0.22
  ctx.beginPath()
  ctx.arc(cx, cy, fR, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(0,0,0,0.7)'
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.strokeStyle = 'rgba(140,100,0,0.8)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.strokeStyle = 'rgba(255,200,40,0.3)'
  ctx.lineWidth = 0.6
  ctx.stroke()

  // ── Center medallion ──
  const cR = r * 0.155

  // Outer shadow halo
  const cHalo = ctx.createRadialGradient(cx, cy, cR, cx, cy, cR + 10)
  cHalo.addColorStop(0, 'rgba(160,100,0,0.5)')
  cHalo.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.beginPath()
  ctx.arc(cx, cy, cR + 10, 0, Math.PI * 2)
  ctx.fillStyle = cHalo
  ctx.fill()

  // Dark backing
  ctx.beginPath()
  ctx.arc(cx, cy, cR + 4, 0, Math.PI * 2)
  ctx.fillStyle = '#04030C'
  ctx.fill()

  // Gold ring
  ctx.beginPath()
  ctx.arc(cx, cy, cR + 4, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(160,110,0,0.95)'
  ctx.lineWidth = 2.5
  ctx.stroke()
  ctx.strokeStyle = 'rgba(255,210,50,0.5)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Deep radial gradient fill
  const cGrad = ctx.createRadialGradient(cx - cR * 0.2, cy - cR * 0.2, 0, cx, cy, cR)
  cGrad.addColorStop(0, '#2A1040')
  cGrad.addColorStop(0.6, '#12082A')
  cGrad.addColorStop(1, '#060318')
  ctx.beginPath()
  ctx.arc(cx, cy, cR, 0, Math.PI * 2)
  ctx.fillStyle = cGrad
  ctx.fill()

  // Dragon
  ctx.save()
  ctx.shadowColor = 'rgba(180,80,0,0.9)'
  ctx.shadowBlur = 14
  ctx.font = `${cR * 1.25}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('🐉', cx, cy)
  ctx.restore()
}

// ── Typing effect hook ────────────────────────────────────────────────────────

function useTyping(text: string, active: boolean, speed = 28) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    setDisplayed('')
    if (!active || !text) return
    let i = 0
    const iv = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(iv)
    }, speed)
    return () => clearInterval(iv)
  }, [text, active, speed])
  return displayed
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function JuegoPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)
  const rotRef    = useRef(0)
  const [phase, setPhase]       = useState<Phase>('idle')
  const [selected, setSelected] = useState<Cat | null>(null)
  const [fortune, setFortune]   = useState('')
  const [shared, setShared]     = useState(false)

  const [signo, setSigno] = useState<string | undefined>(undefined)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('oraculo_data')
      if (raw) setSigno(JSON.parse(raw).signo)
    } catch { /* */ }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawWheel(canvas, rotRef.current)
  }, [])

  const spin = async () => {
    if (phase !== 'idle') return
    setPhase('spinning')
    setFortune('')
    setSelected(null)

    const weights = CATEGORIAS.map((c) => c.id === 'advertencia' ? 1.5 : 1)
    const total   = weights.reduce((a, b) => a + b, 0)
    let r = Math.random() * total
    let winIdx = 0
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i]
      if (r <= 0) { winIdx = i; break }
    }

    const winner     = CATEGORIAS[winIdx]
    const segCenter  = winIdx * SEG + SEG / 2
    const currentMod = ((rotRef.current % 360) + 360) % 360
    let delta = (270 - segCenter - currentMod + 360) % 360
    if (delta < 10) delta += 360
    const totalDelta = 1440 + delta + (Math.random() * 20 - 10)
    const targetRot  = rotRef.current + totalDelta
    const duration   = 4200
    const startRot   = rotRef.current
    const startTime  = performance.now()

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3.2)

    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      rotRef.current = startRot + totalDelta * easeOut(t)
      drawWheel(canvasRef.current!, rotRef.current)

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        rotRef.current = targetRot
        drawWheel(canvasRef.current!, rotRef.current)
        setSelected(winner)
        setPhase('revealing')

        fetch('/api/fortuna', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoria: winner.id, signo }),
        })
          .then((r) => r.json())
          .then((d) => { setFortune(d.texto ?? ''); setPhase('done') })
          .catch(() => { setFortune('Los astros guardan silencio por ahora. Intenta de nuevo.'); setPhase('done') })
      }
    }

    animRef.current = requestAnimationFrame(animate)
  }

  const reset = () => { setPhase('idle'); setSelected(null); setFortune(''); setShared(false) }

  const typing = useTyping(fortune, phase === 'done')

  const handleShare = () => {
    const text = `🐉 La Pitonisa me reveló algo sobre ${selected?.label ?? 'mi destino'}... ¡Consulta la tuya!`
    const url  = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
    if (navigator.share) {
      navigator.share({ title: 'El Oráculo de la Pitonisa', text, url })
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`)
      setShared(true)
      setTimeout(() => setShared(false), 3000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080614' }}>
      <div className="fixed inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse at 50% 10%, rgba(139,92,246,.14) 0%, transparent 60%)',
      }} />

      <header className="relative z-10 px-6 py-5 flex items-center justify-between">
        <Link href="/" className="text-oracle-dim hover:text-oracle-gold transition-colors text-sm">
          ← Inicio
        </Link>
        <span className="text-oracle-teal text-xs tracking-[2px] uppercase">La Rueda del Destino</span>
        <div className="w-16" />
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 pb-16 pt-2">

        {/* Pitonisa arcade backglass */}
        <div
          className="w-full max-w-md mx-auto mb-4 overflow-hidden"
          style={{
            borderRadius: '12px 12px 0 0',
            border: '3px solid rgba(242,168,0,0.6)',
            borderBottom: 'none',
            boxShadow: '0 0 40px rgba(242,168,0,.25), 0 0 80px rgba(139,92,246,.15)',
            maxHeight: 320,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pitonisa-arcade.jpg"
            alt="El Oráculo de la Pitonisa"
            style={{ width: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
          />
        </div>

        <div className="text-center mb-5">
          <p className="text-oracle-mid text-sm tracking-wide">
            {phase === 'idle'      ? 'Gira la rueda — el destino ya fue escrito' :
             phase === 'spinning'  ? 'La Pitonisa consulta los astros...' :
             phase === 'revealing' ? `El destino habla sobre ${selected?.label}...` :
                                     `El destino habla sobre ${selected?.label}`}
          </p>
        </div>

        {/* Wheel container */}
        <div className="relative flex items-center justify-center mb-6" style={{ width: 340, height: 340 }}>

          {/* Pointer — ornate gold blade */}
          <div className="absolute z-20" style={{ top: -4, left: '50%', transform: 'translateX(-50%)' }}>
            <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
              <polygon points="14,34 2,2 14,10 26,2" fill="#B8860B" />
              <polygon points="14,34 2,2 14,10 26,2" fill="url(#pg)" />
              <polygon points="14,10 2,2 14,34 26,2" stroke="#FFD700" strokeWidth="0.8" fill="none" opacity="0.6" />
              <defs>
                <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#B8860B" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            onClick={phase === 'idle' ? spin : undefined}
            style={{
              borderRadius: '50%',
              boxShadow: phase === 'spinning'
                ? '0 0 80px rgba(139,92,246,.7), 0 0 160px rgba(242,168,0,.35), 0 0 40px rgba(200,100,0,.5)'
                : '0 0 40px rgba(160,110,0,.4), 0 0 80px rgba(139,92,246,.2)',
              cursor: phase === 'idle' ? 'pointer' : 'default',
              transition: 'box-shadow 0.5s ease',
            }}
          />
        </div>

        {phase === 'idle' && (
          <button onClick={spin} className="btn-oracle mb-8 px-10 py-3 text-lg animate-float">
            🐉 Girar la rueda
          </button>
        )}

        {/* Fortune card */}
        {(phase === 'revealing' || phase === 'done') && selected && (
          <div
            className="w-full max-w-md oracle-border p-6 animate-fade-up"
            style={{
              background: 'rgba(12,8,30,.85)',
              borderColor: selected.glow + '44',
              boxShadow: `0 0 60px ${selected.glow}18, 0 0 20px rgba(0,0,0,.6)`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl" style={{ textShadow: `0 0 12px ${selected.glow}` }}>
                {selected.symbol}
              </span>
              <div>
                <p className="text-oracle-dim text-xs uppercase tracking-wider">La Pitonisa ve...</p>
                <h2 className="font-serif text-xl" style={{ color: selected.glow, textShadow: `0 0 10px ${selected.glow}66` }}>
                  {selected.label}
                </h2>
              </div>
            </div>

            <div className="min-h-[80px]">
              {phase === 'revealing' && !fortune && (
                <div className="flex gap-2 items-center">
                  {[0,1,2].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-oracle-gold opacity-60"
                      style={{ animation: `glowPulse 1.2s ease-in-out ${i*0.2}s infinite` }} />
                  ))}
                </div>
              )}
              {(phase === 'done' || (phase === 'revealing' && fortune)) && (
                <p className="text-oracle-text leading-relaxed font-serif text-lg">
                  {typing}
                  {typing.length < fortune.length && (
                    <span className="animate-pulse text-oracle-gold">|</span>
                  )}
                </p>
              )}
            </div>

            {phase === 'done' && typing.length >= fortune.length && (
              <div className="flex flex-col sm:flex-row gap-3 mt-6 animate-fade-up">
                <button onClick={reset} className="btn-oracle flex-1 justify-center">
                  🐉 Consultar de nuevo
                </button>
                <button onClick={handleShare} className="btn-oracle-outline flex-1 justify-center">
                  {shared ? '✓ Copiado' : '🔗 Compartir'}
                </button>
              </div>
            )}
          </div>
        )}

        {phase === 'idle' && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link href="/chat" className="btn-oracle-outline px-6 py-2 text-sm justify-center">
              🔮 Habla con la Pitonisa
            </Link>
            <p className="text-oracle-dim text-xs">
              ¿Quieres conocer a tu alma gemela?{' '}
              <Link href="/consulta" className="text-oracle-gold hover:underline">
                Empieza aquí →
              </Link>
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
