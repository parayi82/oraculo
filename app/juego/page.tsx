'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

// ── Categorías de la rueda ────────────────────────────────────────────────────

const CATEGORIAS = [
  { id: 'amor',        emoji: '❤️',  label: 'Amor',        color: '#EC4899' },
  { id: 'prosperidad', emoji: '💰',  label: 'Prosperidad', color: '#F2A800' },
  { id: 'salud',       emoji: '🏥',  label: 'Salud',       color: '#2DD4BF' },
  { id: 'carrera',     emoji: '💼',  label: 'Carrera',     color: '#8B5CF6' },
  { id: 'familia',     emoji: '👥',  label: 'Familia',     color: '#F97316' },
  { id: 'suerte',      emoji: '🌟',  label: 'Suerte',      color: '#FDE047' },
  { id: 'advertencia', emoji: '⚠️',  label: 'Advertencia', color: '#EF4444' },
  { id: 'misterio',    emoji: '🔮',  label: 'Misterio',    color: '#6366F1' },
]

const N = CATEGORIAS.length
const SEG = 360 / N   // 45° por segmento

type Phase = 'idle' | 'spinning' | 'revealing' | 'done'

// ── Canvas wheel ──────────────────────────────────────────────────────────────

function drawWheel(canvas: HTMLCanvasElement, rotation: number) {
  const ctx = canvas.getContext('2d')!
  const size = canvas.width
  const cx = size / 2
  const cy = size / 2
  const r  = size / 2 - 4

  ctx.clearRect(0, 0, size, size)

  CATEGORIAS.forEach((cat, i) => {
    const start = (i * SEG - 90 + rotation) * (Math.PI / 180)
    const end   = start + SEG * (Math.PI / 180)
    const mid   = start + (SEG / 2) * (Math.PI / 180)

    // Sector
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, start, end)
    ctx.closePath()
    ctx.fillStyle = cat.color
    ctx.fill()

    // Border between segments
    ctx.strokeStyle = 'rgba(8,6,20,0.5)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Emoji label
    const labelR = r * 0.68
    const lx = cx + Math.cos(mid) * labelR
    const ly = cy + Math.sin(mid) * labelR

    ctx.save()
    ctx.translate(lx, ly)
    ctx.rotate(mid + Math.PI / 2)
    ctx.font = `${size * 0.06}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(cat.emoji, 0, 0)

    ctx.font = `bold ${size * 0.038}px system-ui`
    ctx.fillStyle = '#fff'
    ctx.shadowColor = 'rgba(0,0,0,0.7)'
    ctx.shadowBlur = 4
    ctx.fillText(cat.label, 0, size * 0.07)
    ctx.restore()
  })

  // Center circle
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.14, 0, Math.PI * 2)
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.14)
  grad.addColorStop(0, '#F2A800')
  grad.addColorStop(1, '#8B5CF6')
  ctx.fillStyle = grad
  ctx.fill()

  // Outer ring
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(242,168,0,0.6)'
  ctx.lineWidth = 3
  ctx.stroke()
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
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const animRef     = useRef<number>(0)
  const rotRef      = useRef(0)          // current visual rotation
  const [phase, setPhase]       = useState<Phase>('idle')
  const [selected, setSelected] = useState<typeof CATEGORIAS[0] | null>(null)
  const [fortune, setFortune]   = useState('')
  const [shared, setShared]     = useState(false)

  // Signo from sessionStorage if available
  const [signo, setSigno] = useState<string | undefined>(undefined)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('oraculo_data')
      if (raw) setSigno(JSON.parse(raw).signo)
    } catch { /* */ }
  }, [])

  // Render wheel at rest
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

    // Pick random segment (weighted toward advertencia slightly for drama)
    const weights = CATEGORIAS.map((c) => c.id === 'advertencia' ? 1.5 : 1)
    const total = weights.reduce((a, b) => a + b, 0)
    let r = Math.random() * total
    let winIdx = 0
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i]
      if (r <= 0) { winIdx = i; break }
    }

    const winner = CATEGORIAS[winIdx]

    // Target rotation: the pointer (at top = 270°) should land center of winIdx segment
    // Segment centers: index i → i * SEG + SEG/2 (from 0°, starting at -90 visual)
    // We need: (rotRef.current + segCenter) % 360 === 270 at top pointer
    const segCenter = winIdx * SEG + SEG / 2
    const currentMod = ((rotRef.current % 360) + 360) % 360
    let delta = (270 - segCenter - currentMod + 360) % 360
    if (delta < 10) delta += 360
    const totalDelta = 1440 + delta + (Math.random() * 20 - 10) // 4 full spins + landing

    const targetRot = rotRef.current + totalDelta
    const duration  = 4000 // ms
    const startRot  = rotRef.current
    const startTime = performance.now()

    // Ease-out cubic
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

    const animate = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      rotRef.current = startRot + totalDelta * easeOut(t)
      drawWheel(canvasRef.current!, rotRef.current)

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        rotRef.current = targetRot
        drawWheel(canvasRef.current!, rotRef.current)
        setSelected(winner)
        setPhase('revealing')

        // Fetch fortune
        fetch('/api/fortuna', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoria: winner.id, signo }),
        })
          .then((r) => r.json())
          .then((d) => {
            setFortune(d.texto ?? '')
            setPhase('done')
          })
          .catch(() => {
            setFortune('Los astros guardan silencio por ahora. Intenta de nuevo.')
            setPhase('done')
          })
      }
    }

    animRef.current = requestAnimationFrame(animate)
  }

  const reset = () => {
    setPhase('idle')
    setSelected(null)
    setFortune('')
    setShared(false)
  }

  const typing = useTyping(fortune, phase === 'done')

  const handleShare = () => {
    const text = `🔮 La Pitonisa me reveló algo sobre ${selected?.label ?? 'mi destino'}... ¡Consulta la tuya!`
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
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse at 50% 10%, rgba(139,92,246,.14) 0%, transparent 60%)',
      }} />

      {/* Header */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between">
        <Link href="/" className="text-oracle-dim hover:text-oracle-gold transition-colors text-sm">
          ← Inicio
        </Link>
        <span className="text-oracle-teal text-xs tracking-[2px] uppercase">La Rueda del Destino</span>
        <div className="w-16" />
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 pb-16 pt-2">

        {/* Title */}
        <div className="text-center mb-6">
          <p className="text-oracle-teal text-xs tracking-[3px] uppercase mb-2">El Oráculo</p>
          <h1 className="font-serif text-3xl md:text-4xl text-oracle-gold text-glow-gold">
            Consulta a la Pitonisa
          </h1>
          <p className="text-oracle-mid text-sm mt-2">
            {phase === 'idle' ? 'Toca la rueda para revelar lo que el destino guarda para ti' :
             phase === 'spinning' ? 'La Pitonisa consulta los astros...' :
             phase === 'revealing' ? `El destino habla sobre ${selected?.label}...` :
             `El destino habla sobre ${selected?.label}`}
          </p>
        </div>

        {/* Wheel container */}
        <div className="relative flex items-center justify-center mb-6" style={{ width: 320, height: 320 }}>
          {/* Pointer triangle at top */}
          <div
            className="absolute z-20"
            style={{
              top: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '22px solid #F2A800',
              filter: 'drop-shadow(0 0 6px rgba(242,168,0,0.8))',
            }}
          />

          {/* Canvas wheel */}
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            onClick={phase === 'idle' ? spin : undefined}
            style={{
              borderRadius: '50%',
              boxShadow: phase === 'spinning'
                ? '0 0 60px rgba(139,92,246,.6), 0 0 120px rgba(242,168,0,.3)'
                : '0 0 30px rgba(242,168,0,.2), 0 0 60px rgba(139,92,246,.15)',
              cursor: phase === 'idle' ? 'pointer' : 'default',
              transition: 'box-shadow 0.4s',
            }}
          />

          {/* Idle overlay */}
          {phase === 'idle' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center animate-glow-pulse"
                style={{
                  background: 'rgba(8,6,20,0.75)',
                  border: '2px solid rgba(242,168,0,0.5)',
                }}
              >
                <span className="text-2xl">🔮</span>
              </div>
            </div>
          )}
        </div>

        {/* Spin button (only at idle) */}
        {phase === 'idle' && (
          <button onClick={spin} className="btn-oracle mb-8 px-10 py-3 text-lg animate-float">
            ✨ Girar la rueda
          </button>
        )}

        {/* Fortune card */}
        {(phase === 'revealing' || phase === 'done') && selected && (
          <div
            className="w-full max-w-md oracle-border p-6 animate-fade-up"
            style={{
              background: 'rgba(26,21,64,.7)',
              borderColor: selected.color + '55',
              boxShadow: `0 0 40px ${selected.color}22`,
            }}
          >
            {/* Category header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{selected.emoji}</span>
              <div>
                <p className="text-oracle-dim text-xs uppercase tracking-wider">La Pitonisa ve...</p>
                <h2 className="font-serif text-xl" style={{ color: selected.color }}>
                  {selected.label}
                </h2>
              </div>
            </div>

            {/* Fortune text */}
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

            {/* Actions (shown when typing done) */}
            {phase === 'done' && typing.length >= fortune.length && (
              <div className="flex flex-col sm:flex-row gap-3 mt-6 animate-fade-up">
                <button onClick={reset} className="btn-oracle flex-1 justify-center">
                  🔮 Consultar de nuevo
                </button>
                <button onClick={handleShare} className="btn-oracle-outline flex-1 justify-center">
                  {shared ? '✓ Copiado' : '🔗 Compartir'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Upsell */}
        {phase === 'idle' && (
          <div className="mt-6 text-center">
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
