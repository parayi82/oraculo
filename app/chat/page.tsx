'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const MAX_FREE = 5

const SUGGESTIONS = [
  '¿Encontraré el amor pronto?',
  '¿Mi negocio prosperará?',
  '¿Qué me espera este año?',
  '¿Hay algo que deba temer?',
]

const WELCOME = 'Bienvenida... veo que algo te trajo aquí. Las preguntas sin respuesta tienen su propio peso. ¿Qué quieres saber?'

type Msg = { role: 'user' | 'assistant'; content: string }

export default function ChatPage() {
  const [messages, setMessages]   = useState<Msg[]>([{ role: 'assistant', content: WELCOME }])
  const [input, setInput]         = useState('')
  const [streaming, setStreaming]  = useState(false)
  const [userCount, setUserCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)
  const abortRef  = useRef<AbortController | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || streaming) return

    const next: Msg[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(next)
    setInput('')
    setStreaming(true)

    // Placeholder for assistant reply
    setMessages(m => [...m, { role: 'assistant', content: '' }])

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) throw new Error()

      const ct = res.headers.get('content-type') ?? ''

      if (ct.includes('text/plain') && res.body) {
        const reader  = res.body.getReader()
        const decoder = new TextDecoder()
        let full = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          full += decoder.decode(value, { stream: true })
          setMessages(m => {
            const copy = [...m]
            copy[copy.length - 1] = { role: 'assistant', content: full }
            return copy
          })
        }
      } else {
        const data = await res.json()
        setMessages(m => {
          const copy = [...m]
          copy[copy.length - 1] = { role: 'assistant', content: data.text ?? '' }
          return copy
        })
      }

      setUserCount(c => c + 1)
    } catch (e: unknown) {
      if ((e as Error)?.name !== 'AbortError') {
        setMessages(m => {
          const copy = [...m]
          copy[copy.length - 1] = { role: 'assistant', content: 'Los astros guardan silencio por ahora. Intenta de nuevo.' }
          return copy
        })
      }
    } finally {
      setStreaming(false)
      inputRef.current?.focus()
    }
  }

  const exhausted = userCount >= MAX_FREE

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080614' }}>

      {/* Fixed background glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,.12) 0%, transparent 55%)',
      }} />

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-20 px-4 py-3 flex items-center gap-3"
        style={{
          background: 'rgba(8,6,20,0.96)',
          borderBottom: '1px solid rgba(139,92,246,.2)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <Link href="/" className="text-oracle-dim hover:text-oracle-gold transition-colors text-lg mr-1">←</Link>

        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(139,92,246,.45), rgba(8,6,20,.95))',
            border: '1px solid rgba(139,92,246,.45)',
            boxShadow: '0 0 16px rgba(139,92,246,.25)',
          }}
        >
          🔮
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-oracle-gold font-serif text-base leading-tight">La Pitonisa</p>
          <p className="text-oracle-teal text-[10px] tracking-widest uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-oracle-teal inline-block" style={{ boxShadow: '0 0 4px #2DD4BF' }} />
            En línea
          </p>
        </div>

        {!exhausted && (
          <span className="text-oracle-dim text-xs whitespace-nowrap">
            {MAX_FREE - userCount} {MAX_FREE - userCount === 1 ? 'consulta' : 'consultas'} gratis
          </span>
        )}
      </header>

      {/* ── Messages ── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4"
        style={{ paddingBottom: 8 }}
      >
        {messages.map((m, i) => {
          const isLast       = i === messages.length - 1
          const isTyping     = streaming && isLast && m.role === 'assistant' && m.content === ''
          const isStreaming  = streaming && isLast && m.role === 'assistant' && m.content !== ''

          return (
            <div key={i} className={`flex gap-2 items-end ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>

              {m.role === 'assistant' && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 mb-0.5"
                  style={{
                    background: 'radial-gradient(circle, rgba(139,92,246,.3), rgba(8,6,20,.9))',
                    border: '1px solid rgba(139,92,246,.35)',
                  }}
                >
                  🔮
                </div>
              )}

              <div
                className="max-w-[78%] px-4 py-3 font-serif text-[15px] leading-relaxed"
                style={m.role === 'assistant' ? {
                  background: 'rgba(22,16,54,.85)',
                  border: '1px solid rgba(139,92,246,.28)',
                  color: 'rgba(215,205,255,.95)',
                  borderRadius: '4px 18px 18px 18px',
                  boxShadow: '0 2px 20px rgba(0,0,0,.4)',
                } : {
                  background: 'rgba(38,26,0,.9)',
                  border: '1px solid rgba(242,168,0,.3)',
                  color: 'rgba(255,235,160,.95)',
                  borderRadius: '18px 4px 18px 18px',
                  boxShadow: '0 2px 16px rgba(0,0,0,.35)',
                }}
              >
                {isTyping ? (
                  <span className="flex gap-1.5 items-center py-0.5">
                    {[0, 1, 2].map(j => (
                      <span
                        key={j}
                        className="w-2 h-2 rounded-full inline-block"
                        style={{
                          background: '#8B5CF6',
                          opacity: 0.7,
                          animation: `glowPulse 1.3s ease-in-out ${j * 0.22}s infinite`,
                        }}
                      />
                    ))}
                  </span>
                ) : (
                  <>
                    {m.content}
                    {isStreaming && (
                      <span
                        className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                        style={{ background: '#F2A800', animation: 'glowPulse 0.8s ease-in-out infinite' }}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}

        {/* Suggestion chips — only on first message */}
        {messages.length === 1 && !streaming && (
          <div className="flex flex-wrap gap-2 mt-1 ml-10">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs px-3 py-2 rounded-full transition-all"
                style={{
                  border: '1px solid rgba(139,92,246,.4)',
                  background: 'rgba(26,16,54,.6)',
                  color: 'rgba(195,180,255,.9)',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar / Upsell ── */}
      <div
        className="sticky bottom-0 px-4 py-3 z-10"
        style={{
          background: 'rgba(8,6,20,0.97)',
          borderTop: '1px solid rgba(139,92,246,.18)',
          backdropFilter: 'blur(14px)',
        }}
      >
        {exhausted ? (
          <div className="text-center py-2">
            <p className="text-oracle-dim text-sm mb-3">
              Has agotado tus consultas gratuitas
            </p>
            <Link href="/consulta" className="btn-oracle px-8 py-3 text-sm">
              🔮 Suscribirse — $49 MXN/mes
            </Link>
            <p className="text-oracle-dim text-xs mt-2">
              Acceso ilimitado al chat + imagen de tu alma gemela
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); send(input) }}
            className="flex gap-2 items-center"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Pregunta a la Pitonisa..."
              disabled={streaming}
              autoComplete="off"
              className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none transition-all"
              style={{
                background: 'rgba(22,16,54,.7)',
                border: '1px solid rgba(139,92,246,.3)',
                color: 'rgba(215,205,255,.95)',
                caretColor: '#F2A800',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,.7)')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(139,92,246,.3)')}
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all disabled:opacity-35"
              style={{
                background: 'linear-gradient(135deg, #F2A800, #D4880A)',
                color: '#08060F',
                fontWeight: 700,
              }}
            >
              ✦
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
