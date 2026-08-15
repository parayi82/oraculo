'use client'

import { useRef, useState, useCallback } from 'react'
import type { Signo } from '@/lib/oracle'

interface Props {
  nombre: string
  signo: Signo
  signoSymbol: string
  signoNombre: string
  imageUrl: string | null
}

const STORY_W = 1080
const STORY_H = 1920

export default function TarjetaCompartir({ nombre, signo, signoSymbol, signoNombre, imageUrl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [generating, setGenerating] = useState(false)
  const [ready, setReady] = useState(false)
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  const generate = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas || generating) return
    setGenerating(true)
    setReady(false)

    const rawCtx = canvas.getContext('2d')
    if (!rawCtx) { setGenerating(false); return }
    const ctx: CanvasRenderingContext2D = rawCtx

    canvas.width  = STORY_W
    canvas.height = STORY_H

    // ── Background ──
    const bg = ctx.createLinearGradient(0, 0, 0, STORY_H)
    bg.addColorStop(0,    '#050310')
    bg.addColorStop(0.35, '#0D0827')
    bg.addColorStop(0.65, '#130A2E')
    bg.addColorStop(1,    '#070512')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, STORY_W, STORY_H)

    // ── Star field ──
    const rng = (n: number) => Math.abs(Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1
    for (let i = 0; i < 280; i++) {
      const sx = rng(i) * STORY_W
      const sy = rng(i + 100) * STORY_H
      const sr = rng(i + 200) * 1.8 + 0.3
      const sa = rng(i + 300) * 0.6 + 0.15
      ctx.beginPath()
      ctx.arc(sx, sy, sr, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${sa})`
      ctx.fill()
    }

    // ── Purple glow at top ──
    const topGlow = ctx.createRadialGradient(STORY_W / 2, 0, 0, STORY_W / 2, 0, STORY_W * 0.9)
    topGlow.addColorStop(0, 'rgba(139,92,246,0.28)')
    topGlow.addColorStop(1, 'rgba(139,92,246,0)')
    ctx.fillStyle = topGlow
    ctx.fillRect(0, 0, STORY_W, STORY_H * 0.5)

    // ── Gold glow at bottom ──
    const botGlow = ctx.createRadialGradient(STORY_W / 2, STORY_H, 0, STORY_W / 2, STORY_H, STORY_W * 0.8)
    botGlow.addColorStop(0, 'rgba(242,168,0,0.18)')
    botGlow.addColorStop(1, 'rgba(242,168,0,0)')
    ctx.fillStyle = botGlow
    ctx.fillRect(0, STORY_H * 0.5, STORY_W, STORY_H * 0.5)

    // ── Top eyebrow ──
    ctx.font = '600 52px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.letterSpacing = '8px'
    ctx.fillStyle = 'rgba(0,212,184,0.85)'
    ctx.fillText('EL ORÁCULO DE LA PITONISA', STORY_W / 2, 130)

    // ── Decorative rule ──
    const ruleGrad = ctx.createLinearGradient(80, 0, STORY_W - 80, 0)
    ruleGrad.addColorStop(0, 'rgba(242,168,0,0)')
    ruleGrad.addColorStop(0.2, 'rgba(242,168,0,0.7)')
    ruleGrad.addColorStop(0.5, 'rgba(242,168,0,1)')
    ruleGrad.addColorStop(0.8, 'rgba(242,168,0,0.7)')
    ruleGrad.addColorStop(1, 'rgba(242,168,0,0)')
    ctx.beginPath()
    ctx.moveTo(80, 165)
    ctx.lineTo(STORY_W - 80, 165)
    ctx.strokeStyle = ruleGrad
    ctx.lineWidth = 2
    ctx.stroke()

    // ── Orb decoration ──
    const orbGrad = ctx.createRadialGradient(STORY_W / 2, 290, 0, STORY_W / 2, 290, 90)
    orbGrad.addColorStop(0, 'rgba(242,168,0,0.22)')
    orbGrad.addColorStop(0.5, 'rgba(139,92,246,0.15)')
    orbGrad.addColorStop(1, 'rgba(139,92,246,0)')
    ctx.beginPath()
    ctx.arc(STORY_W / 2, 290, 90, 0, Math.PI * 2)
    ctx.fillStyle = orbGrad
    ctx.fill()
    ctx.beginPath()
    ctx.arc(STORY_W / 2, 290, 88, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(242,168,0,0.3)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Orb emoji
    ctx.font = '120px serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText('🔮', STORY_W / 2, 345)

    // ── "Conoce a tu alma gemela" headline ──
    ctx.font = `bold 100px Georgia, serif`
    ctx.textAlign = 'center'
    ctx.fillStyle = '#F2A800'
    // Shadow for depth
    ctx.shadowColor = 'rgba(242,168,0,0.5)'
    ctx.shadowBlur  = 40
    drawWrappedText(ctx, 'Conoce a tu', STORY_W / 2, 490, STORY_W - 120, 110)
    ctx.fillStyle = '#FFFFFF'
    ctx.shadowColor = 'rgba(255,255,255,0.3)'
    drawWrappedText(ctx, 'alma gemela', STORY_W / 2, 610, STORY_W - 120, 110)
    ctx.shadowBlur = 0

    // ── Soulmate image ──
    const IMG_Y   = 740
    const IMG_H   = 760
    const IMG_W   = 680
    const IMG_X   = (STORY_W - IMG_W) / 2
    const RADIUS  = 24

    // Frame glow
    const frameGlow = ctx.createRadialGradient(STORY_W / 2, IMG_Y + IMG_H / 2, IMG_W * 0.2, STORY_W / 2, IMG_Y + IMG_H / 2, IMG_W * 0.7)
    frameGlow.addColorStop(0, 'rgba(242,168,0,0)')
    frameGlow.addColorStop(1, 'rgba(242,168,0,0.15)')
    ctx.fillStyle = frameGlow
    ctx.fillRect(IMG_X - 20, IMG_Y - 20, IMG_W + 40, IMG_H + 40)

    // Gold border
    ctx.beginPath()
    roundRect(ctx, IMG_X - 3, IMG_Y - 3, IMG_W + 6, IMG_H + 6, RADIUS + 3)
    ctx.strokeStyle = 'rgba(242,168,0,0.7)'
    ctx.lineWidth = 3
    ctx.stroke()

    // Inner purple border
    ctx.beginPath()
    roundRect(ctx, IMG_X - 1, IMG_Y - 1, IMG_W + 2, IMG_H + 2, RADIUS + 1)
    ctx.strokeStyle = 'rgba(139,92,246,0.4)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Image or placeholder — load via same-origin proxy to avoid canvas CORS taint
    if (imageUrl) {
      const proxyUrl = `/api/proxy-img?url=${encodeURIComponent(imageUrl)}`
      try {
        const img = await loadImage(proxyUrl)
        ctx.save()
        ctx.beginPath()
        roundRect(ctx, IMG_X, IMG_Y, IMG_W, IMG_H, RADIUS)
        ctx.clip()
        // Cover-fit: fill the frame
        const scale = Math.max(IMG_W / img.width, IMG_H / img.height)
        const sw = img.width  * scale
        const sh = img.height * scale
        ctx.drawImage(img, IMG_X + (IMG_W - sw) / 2, IMG_Y + (IMG_H - sh) / 2, sw, sh)
        ctx.restore()

        // Gradient overlay (bottom fade)
        ctx.save()
        ctx.beginPath()
        roundRect(ctx, IMG_X, IMG_Y, IMG_W, IMG_H, RADIUS)
        ctx.clip()
        const fadeGrad = ctx.createLinearGradient(0, IMG_Y + IMG_H * 0.55, 0, IMG_Y + IMG_H)
        fadeGrad.addColorStop(0, 'rgba(8,6,20,0)')
        fadeGrad.addColorStop(1, 'rgba(8,6,20,0.75)')
        ctx.fillStyle = fadeGrad
        ctx.fillRect(IMG_X, IMG_Y, IMG_W, IMG_H)
        ctx.restore()
      } catch {
        drawPlaceholder(ctx, IMG_X, IMG_Y, IMG_W, IMG_H, RADIUS)
      }
    } else {
      drawPlaceholder(ctx, IMG_X, IMG_Y, IMG_W, IMG_H, RADIUS)
    }

    // Sign badge on image
    const badgeY = IMG_Y + IMG_H - 60
    ctx.beginPath()
    ctx.roundRect(STORY_W / 2 - 160, badgeY - 28, 320, 56, 28)
    ctx.fillStyle = 'rgba(8,6,20,0.75)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(242,168,0,0.5)'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.font = 'bold 38px serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#F2A800'
    ctx.fillText(`${signoSymbol} Tu alma gemela`, STORY_W / 2, badgeY + 14)

    // ── Bottom personal info ──
    const CARD_Y = IMG_Y + IMG_H + 60
    const CARD_H = 280

    // Card background
    ctx.beginPath()
    ctx.roundRect(80, CARD_Y, STORY_W - 160, CARD_H, 20)
    ctx.fillStyle = 'rgba(22,16,54,0.75)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(139,92,246,0.4)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Name
    ctx.font = `bold 80px Georgia, serif`
    ctx.textAlign = 'center'
    ctx.fillStyle = '#FFFFFF'
    ctx.shadowColor = 'rgba(139,92,246,0.4)'
    ctx.shadowBlur = 20
    ctx.fillText(nombre.split(' ')[0], STORY_W / 2, CARD_Y + 95)
    ctx.shadowBlur = 0

    // Sign info
    ctx.font = '50px serif'
    ctx.fillStyle = 'rgba(0,212,184,0.9)'
    ctx.fillText(`${signoSymbol} ${signoNombre}`, STORY_W / 2, CARD_Y + 170)

    ctx.font = '400 42px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(200,190,255,0.75)'
    ctx.fillText('ya conoce a su alma gemela', STORY_W / 2, CARD_Y + 225)

    // ── Bottom CTA ──
    const CTA_Y = CARD_Y + CARD_H + 70

    ctx.font = '600 46px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(242,168,0,0.9)'
    ctx.fillText('¿Y tú?', STORY_W / 2, CTA_Y)

    ctx.font = '400 40px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(200,190,255,0.7)'
    ctx.fillText('oraculo.pitonisa.mx', STORY_W / 2, CTA_Y + 60)

    // Bottom rule
    const rule2 = ctx.createLinearGradient(80, 0, STORY_W - 80, 0)
    rule2.addColorStop(0, 'rgba(139,92,246,0)')
    rule2.addColorStop(0.5, 'rgba(139,92,246,0.6)')
    rule2.addColorStop(1, 'rgba(139,92,246,0)')
    ctx.beginPath()
    ctx.moveTo(80, STORY_H - 80)
    ctx.lineTo(STORY_W - 80, STORY_H - 80)
    ctx.strokeStyle = rule2
    ctx.lineWidth = 1.5
    ctx.stroke()

    const url = canvas.toDataURL('image/png')
    setDataUrl(url)
    setReady(true)
    setGenerating(false)
  }, [generating, nombre, signo, signoSymbol, signoNombre, imageUrl])

  return (
    <div
      className="oracle-border p-6 text-center"
      style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,.08) 0%, rgba(242,168,0,.05) 100%)',
        borderColor: 'rgba(139,92,246,.25)',
      }}
    >
      <p className="text-oracle-gold font-semibold mb-1">📲 Tarjeta para Stories</p>
      <p className="text-oracle-mid text-sm mb-4">
        Genera tu tarjeta para compartir en Instagram, WhatsApp o TikTok.
        Tus amigas verán a tu alma gemela.
      </p>

      {/* Hidden canvas for generation */}
      <canvas ref={canvasRef} className="hidden" />

      {!ready ? (
        <button
          onClick={generate}
          disabled={generating}
          className="btn-oracle w-full justify-center disabled:opacity-50"
        >
          {generating ? (
            <span className="flex items-center gap-2 justify-center">
              <span className="w-4 h-4 rounded-full border-2 border-oracle-gold border-t-transparent animate-spin" />
              Generando tu tarjeta...
            </span>
          ) : '✨ Crear mi tarjeta'}
        </button>
      ) : (
        <div className="space-y-3">
          {/* Preview */}
          {dataUrl && (
            <div className="mx-auto overflow-hidden rounded-xl" style={{ maxWidth: 180 }}>
              <img
                src={dataUrl}
                alt="Tu tarjeta para compartir"
                className="w-full"
              />
            </div>
          )}

          {/* Download */}
          {dataUrl && (
            <div className="flex flex-col gap-2">
              <p className="text-oracle-dim text-xs">
                Toca y mantén presionado la imagen para guardarla,<br/>o usa el botón de descarga.
              </p>
              <a
                href={dataUrl}
                download={`alma-gemela-${nombre.toLowerCase().replace(/\s+/g, '-')}.png`}
                className="btn-oracle w-full justify-center"
              >
                ⬇ Descargar imagen
              </a>
              <button
                onClick={() => { setReady(false); setDataUrl(null) }}
                className="btn-oracle-outline w-full justify-center text-sm"
              >
                Regenerar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload  = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawPlaceholder(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.save()
  ctx.beginPath()
  roundRect(ctx, x, y, w, h, r)
  ctx.clip()
  const ph = ctx.createLinearGradient(x, y, x, y + h)
  ph.addColorStop(0, 'rgba(26,21,64,1)')
  ph.addColorStop(1, 'rgba(12,8,32,1)')
  ctx.fillStyle = ph
  ctx.fillRect(x, y, w, h)
  ctx.font = '220px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'rgba(139,92,246,0.3)'
  ctx.fillText('🔮', x + w / 2, y + h / 2)
  ctx.restore()
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ')
  let line = ''
  let currentY = y
  for (const word of words) {
    const test = line ? line + ' ' + word : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, currentY)
      line = word
      currentY += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, currentY)
}
