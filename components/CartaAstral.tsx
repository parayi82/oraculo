'use client'

import { useEffect, useRef } from 'react'
import type { Signo } from '@/lib/oracle'

const ZODIAC: { signo: Signo; symbol: string; glyph: string; angle: number }[] = [
  { signo: 'aries',       symbol: '♈', glyph: 'Ari', angle: 0   },
  { signo: 'tauro',       symbol: '♉', glyph: 'Tau', angle: 30  },
  { signo: 'geminis',     symbol: '♊', glyph: 'Gem', angle: 60  },
  { signo: 'cancer',      symbol: '♋', glyph: 'Can', angle: 90  },
  { signo: 'leo',         symbol: '♌', glyph: 'Leo', angle: 120 },
  { signo: 'virgo',       symbol: '♍', glyph: 'Vir', angle: 150 },
  { signo: 'libra',       symbol: '♎', glyph: 'Lib', angle: 180 },
  { signo: 'escorpio',    symbol: '♏', glyph: 'Sco', angle: 210 },
  { signo: 'sagitario',   symbol: '♐', glyph: 'Sag', angle: 240 },
  { signo: 'capricornio', symbol: '♑', glyph: 'Cap', angle: 270 },
  { signo: 'acuario',     symbol: '♒', glyph: 'Aqu', angle: 300 },
  { signo: 'piscis',      symbol: '♓', glyph: 'Pis', angle: 330 },
]

// Compatible signs by element grouping
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

interface Props {
  signo: Signo
  nombre: string
}

export default function CartaAstral({ signo, nombre }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rawCtx = canvas.getContext('2d')
    if (!rawCtx) return
    const ctx: CanvasRenderingContext2D = rawCtx

    const DPR = window.devicePixelRatio || 1
    const SIZE = Math.min(window.innerWidth - 48, 360)
    canvas.width  = SIZE * DPR
    canvas.height = SIZE * DPR
    canvas.style.width  = SIZE + 'px'
    canvas.style.height = SIZE + 'px'
    ctx.scale(DPR, DPR)

    const cx = SIZE / 2
    const cy = SIZE / 2
    const compatible = COMPATIBLE[signo] ?? []

    let rotation = 0
    let raf: number

    function deg2rad(d: number) { return (d - 90) * Math.PI / 180 }

    function draw(rot: number) {
      ctx.clearRect(0, 0, SIZE, SIZE)

      // ── Outer glow halo ──
      const halo = ctx.createRadialGradient(cx, cy, SIZE * 0.38, cx, cy, SIZE * 0.5)
      halo.addColorStop(0, 'rgba(139,92,246,0.0)')
      halo.addColorStop(0.7, 'rgba(139,92,246,0.08)')
      halo.addColorStop(1, 'rgba(242,168,0,0.12)')
      ctx.beginPath()
      ctx.arc(cx, cy, SIZE * 0.495, 0, Math.PI * 2)
      ctx.fillStyle = halo
      ctx.fill()

      // ── Outer ring border ──
      ctx.beginPath()
      ctx.arc(cx, cy, SIZE * 0.47, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(242,168,0,0.35)'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(cx, cy, SIZE * 0.465, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(139,92,246,0.2)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      // ── 12 house divisions ──
      for (let i = 0; i < 12; i++) {
        const angle = deg2rad(i * 30 + rot)
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(angle) * SIZE * 0.3, cy + Math.sin(angle) * SIZE * 0.3)
        ctx.lineTo(cx + Math.cos(angle) * SIZE * 0.465, cy + Math.sin(angle) * SIZE * 0.465)
        ctx.strokeStyle = 'rgba(139,92,246,0.25)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // ── Inner circle ──
      ctx.beginPath()
      ctx.arc(cx, cy, SIZE * 0.3, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(242,168,0,0.2)'
      ctx.lineWidth = 0.8
      ctx.stroke()

      // ── Secondary circles ──
      for (const r of [0.15, 0.22]) {
        ctx.beginPath()
        ctx.arc(cx, cy, SIZE * r, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(139,92,246,0.15)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // ── Zodiac signs on outer ring ──
      ZODIAC.forEach(({ signo: s, symbol, angle }) => {
        const rad = deg2rad(angle + rot)
        const r   = SIZE * 0.41
        const x   = cx + Math.cos(rad) * r
        const y   = cy + Math.sin(rad) * r

        const isUser   = s === signo
        const isCompat = compatible.includes(s)

        // Glow dot behind symbol
        if (isUser || isCompat) {
          const glowR = ctx.createRadialGradient(x, y, 0, x, y, 16)
          if (isUser) {
            glowR.addColorStop(0, 'rgba(242,168,0,0.5)')
            glowR.addColorStop(1, 'rgba(242,168,0,0)')
          } else {
            glowR.addColorStop(0, 'rgba(139,92,246,0.4)')
            glowR.addColorStop(1, 'rgba(139,92,246,0)')
          }
          ctx.beginPath()
          ctx.arc(x, y, 16, 0, Math.PI * 2)
          ctx.fillStyle = glowR
          ctx.fill()
        }

        ctx.font = `${isUser ? 18 : 14}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = isUser
          ? '#F2A800'
          : isCompat
            ? 'rgba(139,92,246,0.9)'
            : 'rgba(150,140,180,0.45)'
        ctx.fillText(symbol, x, y)
      })

      // ── Compatibility lines ──
      const userZ = ZODIAC.find(z => z.signo === signo)
      if (userZ) {
        compatible.forEach(c => {
          const cZ = ZODIAC.find(z => z.signo === c)
          if (!cZ) return

          const r1 = SIZE * 0.28
          const r2 = SIZE * 0.28
          const a1 = deg2rad(userZ.angle + rot)
          const a2 = deg2rad(cZ.angle + rot)

          ctx.beginPath()
          ctx.moveTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1)
          ctx.lineTo(cx + Math.cos(a2) * r2, cy + Math.sin(a2) * r2)

          const lineGrad = ctx.createLinearGradient(
            cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1,
            cx + Math.cos(a2) * r2, cy + Math.sin(a2) * r2
          )
          lineGrad.addColorStop(0, 'rgba(242,168,0,0.5)')
          lineGrad.addColorStop(1, 'rgba(139,92,246,0.5)')
          ctx.strokeStyle = lineGrad
          ctx.lineWidth = 0.8
          ctx.stroke()
        })
      }

      // ── Orbiting particle ──
      const particleAngle = (Date.now() / 3000) % (Math.PI * 2)
      const pr = SIZE * 0.22
      const px = cx + Math.cos(particleAngle) * pr
      const py = cy + Math.sin(particleAngle) * pr
      const particleGlow = ctx.createRadialGradient(px, py, 0, px, py, 5)
      particleGlow.addColorStop(0, 'rgba(0,212,184,0.9)')
      particleGlow.addColorStop(1, 'rgba(0,212,184,0)')
      ctx.beginPath()
      ctx.arc(px, py, 5, 0, Math.PI * 2)
      ctx.fillStyle = particleGlow
      ctx.fill()

      // Second orbiting particle (opposite direction)
      const p2a = -(Date.now() / 4500) % (Math.PI * 2)
      const p2r = SIZE * 0.16
      const p2x = cx + Math.cos(p2a) * p2r
      const p2y = cy + Math.sin(p2a) * p2r
      const p2g = ctx.createRadialGradient(p2x, p2y, 0, p2x, p2y, 3.5)
      p2g.addColorStop(0, 'rgba(242,168,0,0.8)')
      p2g.addColorStop(1, 'rgba(242,168,0,0)')
      ctx.beginPath()
      ctx.arc(p2x, p2y, 3.5, 0, Math.PI * 2)
      ctx.fillStyle = p2g
      ctx.fill()

      // ── Center medallion ──
      const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, SIZE * 0.12)
      centerGrad.addColorStop(0, 'rgba(26,21,64,1)')
      centerGrad.addColorStop(0.6, 'rgba(18,12,48,1)')
      centerGrad.addColorStop(1, 'rgba(8,6,20,1)')
      ctx.beginPath()
      ctx.arc(cx, cy, SIZE * 0.12, 0, Math.PI * 2)
      ctx.fillStyle = centerGrad
      ctx.fill()
      ctx.strokeStyle = 'rgba(242,168,0,0.5)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Center sign glyph
      const userZod = ZODIAC.find(z => z.signo === signo)
      ctx.font = `${SIZE * 0.085}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#F2A800'
      ctx.fillText(userZod?.symbol ?? '★', cx, cy)
    }

    function animate() {
      rotation = (rotation + 0.015) % 360
      draw(rotation)
      raf = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(raf)
  }, [signo])

  const userZod = ZODIAC.find(z => z.signo === signo)
  const compatible = COMPATIBLE[signo] ?? []
  const compatNames = compatible.map(c => ZODIAC.find(z => z.signo === c)?.symbol ?? '').join('  ')

  return (
    <div
      className="oracle-border p-6"
      style={{ background: 'rgba(8,6,20,.8)' }}
    >
      <h2 className="font-serif text-xl text-oracle-gold mb-1 text-center">
        Tu carta astral
      </h2>
      <p className="text-oracle-dim text-xs text-center mb-5 tracking-wider uppercase">
        {userZod?.symbol} {signo.charAt(0).toUpperCase() + signo.slice(1)} — {nombre}
      </p>

      <div className="flex justify-center mb-5">
        <canvas ref={canvasRef} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div
          className="rounded-lg px-3 py-2"
          style={{ background: 'rgba(242,168,0,0.07)', border: '1px solid rgba(242,168,0,0.2)' }}
        >
          <p className="text-oracle-dim text-[10px] uppercase tracking-wider mb-1">Tu signo</p>
          <p className="text-oracle-gold text-lg">{userZod?.symbol}</p>
          <p className="text-oracle-dim text-[11px] capitalize">{signo}</p>
        </div>
        <div
          className="rounded-lg px-3 py-2"
          style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)' }}
        >
          <p className="text-oracle-dim text-[10px] uppercase tracking-wider mb-1">Alta afinidad</p>
          <p className="text-oracle-mid text-base tracking-widest">{compatNames}</p>
          <p className="text-oracle-dim text-[11px]">signos compatibles</p>
        </div>
      </div>

      <p className="text-oracle-dim text-[11px] text-center mt-4 italic">
        Las líneas doradas muestran tus conexiones astrales más poderosas
      </p>
    </div>
  )
}
