'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

const MAJOR_ARCANA = [
  {
    id: 0, numeral: 'O', nombre: 'El Loco', symbol: '☀️', color: '#F59E0B',
    interpretacion: 'Un nuevo comienzo amoroso llega cuando menos lo esperas. El universo te invita a dar un salto de fe — confía, suéltate del miedo. Tu alma gemela aparecerá en el momento más inesperado. Mantén el corazón abierto y los ojos atentos.',
  },
  {
    id: 1, numeral: 'I', nombre: 'El Mago', symbol: '⚡', color: '#9333EA',
    interpretacion: 'Tienes todo lo que necesitas para atraer el amor que mereces. Tu energía es magnética ahora mismo. Usa tu intención, tu voluntad y tu confianza — el universo ya está conspirando a tu favor para unirte con quien te corresponde.',
  },
  {
    id: 2, numeral: 'II', nombre: 'La Sacerdotisa', symbol: '🌙', color: '#6366F1',
    interpretacion: 'Alguien especial ya piensa en ti más de lo que imaginas. Escucha tu intuición; ella sabe antes que tu mente consciente. Los sueños de estos días traen mensajes importantes. Guarda silencio y el amor se revelará solo.',
  },
  {
    id: 3, numeral: 'III', nombre: 'La Emperatriz', symbol: '🌹', color: '#EC4899',
    interpretacion: 'Una época de abundancia emocional y sensualidad. El amor florece a tu alrededor como un jardín en primavera. Date permiso de recibir cariño, no solo de darlo. Quien está por llegar ve en ti algo extraordinario.',
  },
  {
    id: 4, numeral: 'IV', nombre: 'El Emperador', symbol: '👑', color: '#D97706',
    interpretacion: 'Una figura protectora, segura y leal se acerca a tu vida. Esta persona te ofrecerá estabilidad y constancia. El amor que viene es maduro, real y duradero — del tipo que construye, no del que consume.',
  },
  {
    id: 5, numeral: 'V', nombre: 'El Hierofante', symbol: '🕊️', color: '#14B8A6',
    interpretacion: 'Una relación seria y comprometida se avecina. Si ya tienes pareja, es momento de profundizar. El universo bendice las uniones que se construyen con respeto, valores compartidos y promesas que se cumplen.',
  },
  {
    id: 6, numeral: 'VI', nombre: 'Los Amantes', symbol: '❤️', color: '#EF4444',
    interpretacion: 'La carta más poderosa del amor. Una elección importante está ante ti — sigue tu corazón, no el miedo. Una conexión profunda, recíproca y transformadora te espera. Esta unión será de las que cambian el rumbo de una vida.',
  },
  {
    id: 7, numeral: 'VII', nombre: 'El Carro', symbol: '🏆', color: '#8B5CF6',
    interpretacion: 'Victoria en el amor para quien avanza con determinación. No permitas que las dudas te detengan en este momento. Tu fuerza y tu confianza son exactamente lo que te llevará hacia la persona que buscas.',
  },
  {
    id: 8, numeral: 'VIII', nombre: 'La Fuerza', symbol: '🦁', color: '#F59E0B',
    interpretacion: 'Tu corazón es más poderoso de lo que crees. La verdadera fuerza en el amor viene de la paciencia y la ternura, no de la urgencia. Quien te merece reconocerá tu valía — no tienes que convencer a nadie de tu amor.',
  },
  {
    id: 9, numeral: 'IX', nombre: 'El Ermitaño', symbol: '🔮', color: '#6B7280',
    interpretacion: 'Un período de introspección antes de encontrar a tu alma gemela. La soledad de este momento no es vacío — es preparación. Quien viene a tu vida lo hace cuando tú ya eres completa en ti misma.',
  },
  {
    id: 10, numeral: 'X', nombre: 'La Rueda', symbol: '☯️', color: '#14B8A6',
    interpretacion: 'Los ciclos del destino giran a tu favor. Una etapa de suerte amorosa comienza ahora. Lo que estuvo estancado se mueve, y en la dirección correcta. El karma trabaja en silencio para acercarte a quien te corresponde.',
  },
  {
    id: 11, numeral: 'XI', nombre: 'La Justicia', symbol: '⚖️', color: '#D97706',
    interpretacion: 'El karma del amor actúa con precisión. Lo que das, recibes. Si has amado con honestidad y sin doblez, ese amor regresará multiplicado. Una situación amorosa que estuvo confusa se resolverá de forma justa.',
  },
  {
    id: 12, numeral: 'XII', nombre: 'El Colgado', symbol: '💭', color: '#6366F1',
    interpretacion: 'Un momento de pausa necesaria. El amor que esperas llegará cuando sueltes el control. Cambia tu perspectiva y descubrirás que ya lo tienes más cerca de lo que crees. La rendición también es sabiduría.',
  },
  {
    id: 13, numeral: 'XIII', nombre: 'La Muerte', symbol: '🌑', color: '#64748B',
    interpretacion: 'No temas esta carta — anuncia transformación, no final. Una fase amorosa termina para que nazca algo mucho más auténtico. Lo que muere ya no era para ti. Lo que viene es más verdadero que lo que se fue.',
  },
  {
    id: 14, numeral: 'XIV', nombre: 'La Templanza', symbol: '🌊', color: '#0EA5E9',
    interpretacion: 'Equilibrio, paciencia y fluir con el tiempo del amor. No fuerces ni apresures lo que está madurando. La persona correcta está siendo preparada para ti, así como tú te preparas para ella.',
  },
  {
    id: 15, numeral: 'XV', nombre: 'El Diablo', symbol: '🔥', color: '#EF4444',
    interpretacion: 'Una atracción intensa y magnética se avecina. Cuidado con las obsesiones — el amor verdadero libera, no encadena. Examina qué patrones del pasado sigues repitiendo; ahí está la llave de tu liberación.',
  },
  {
    id: 16, numeral: 'XVI', nombre: 'La Torre', symbol: '⚡', color: '#D97706',
    interpretacion: 'Una revelación repentina sacude tu vida amorosa. Algo que creías sólido se transforma de golpe. Aunque duele en el momento, este cambio te libera para recibir un amor más verdadero y más real.',
  },
  {
    id: 17, numeral: 'XVII', nombre: 'La Estrella', symbol: '⭐', color: '#818CF8',
    interpretacion: 'Esperanza renovada y amor que viene del universo mismo. Después de cualquier dificultad, esta carta es el amanecer. Confía — tu alma gemela está más cerca que nunca y el universo vela por tu historia.',
  },
  {
    id: 18, numeral: 'XVIII', nombre: 'La Luna', symbol: '🌕', color: '#8B5CF6',
    interpretacion: 'Misterio, sueños e intuición poderosa. Presta atención a lo que sientes en el silencio de la noche. Alguien cercano a ti guarda sentimientos que aún no ha expresado. La verdad del amor vivirá bajo la luz de la luna.',
  },
  {
    id: 19, numeral: 'XIX', nombre: 'El Sol', symbol: '☀️', color: '#F59E0B',
    interpretacion: 'La carta más luminosa del Arcano Mayor. Alegría, claridad y amor radiante se aproximan. Un romance lleno de luz genuina y felicidad real está por llegar. Este es el amor que siempre soñaste — y llegas a él siendo tú misma.',
  },
  {
    id: 20, numeral: 'XX', nombre: 'El Juicio', symbol: '🎺', color: '#EC4899',
    interpretacion: 'Un llamado del destino. Alguien del pasado reaparece transformado, o tú misma renaces en el amor. Es tiempo de dejar ir viejas heridas. El universo te convoca a una versión más plena de ti en el amor.',
  },
  {
    id: 21, numeral: 'XXI', nombre: 'El Mundo', symbol: '🌍', color: '#15803D',
    interpretacion: 'La carta de la completud y el triunfo total. Tu alma gemela está más cerca de lo que imaginas — puede que ya esté en tu vida sin que lo sepas. Una unión plena, satisfactoria y llena de significado está destinada para ti.',
  },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Phase = 'intro' | 'picking' | 'revealing' | 'done'

export default function TarotPage() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [deck, setDeck]     = useState(() => shuffle(MAJOR_ARCANA).slice(0, 7))
  const [selected, setSelected] = useState<number[]>([])
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  function startReading() {
    setDeck(shuffle(MAJOR_ARCANA).slice(0, 7))
    setSelected([])
    setRevealed(new Set())
    setPhase('picking')
  }

  function toggleCard(id: number) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  function beginReveal() {
    setPhase('revealing')
  }

  // Reveal cards one by one when entering 'revealing' phase
  useEffect(() => {
    if (phase !== 'revealing') return
    let cancelled = false

    async function doReveal() {
      for (let i = 0; i < selected.length; i++) {
        await new Promise(r => setTimeout(r, i === 0 ? 500 : 1000))
        if (cancelled) return
        setRevealed(prev => new Set([...prev, selected[i]]))
      }
      await new Promise(r => setTimeout(r, 700))
      if (!cancelled) setPhase('done')
    }

    doReveal()
    return () => { cancelled = true }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const selectedCards = selected.map(id => deck.find(c => c.id === id)!)

  return (
    <div className="min-h-screen" style={{ background: '#080614' }}>
      {/* amethyst ambient */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(147,51,234,.09) 0%, transparent 60%)',
      }} />

      <div className="relative z-10 px-4 py-10 max-w-2xl mx-auto">

        <Link href="/" className="text-oracle-dim hover:text-oracle-gold transition-colors text-sm mb-8 inline-block">
          ← Inicio
        </Link>

        {/* ── INTRO ── */}
        {phase === 'intro' && (
          <div className="text-center">

            {/* Pitonisa dealing cards */}
            <div className="relative mx-auto mb-10 rounded-2xl overflow-hidden" style={{
              maxWidth: 600,
              border: '1px solid rgba(147,51,234,.35)',
              boxShadow: '0 0 50px rgba(147,51,234,.22)',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1603721678666-dde81f00f00b?w=640&h=380&fit=crop&auto=format&q=80"
                alt=""
                style={{ display: 'block', width: '100%', filter: 'brightness(.7) saturate(1.3)' }}
              />
              {/* fanned card silhouettes overlay — CSS-only */}
              <div className="absolute inset-0 pointer-events-none" style={{ bottom: 0 }}>
                {[-30, -15, 0, 15, 30].map((deg, i) => (
                  <div key={i} className="absolute" style={{
                    bottom: '5%', left: '50%',
                    width: 46, height: 76,
                    marginLeft: -23,
                    borderRadius: 5,
                    border: '1px solid rgba(147,51,234,.55)',
                    background: 'linear-gradient(160deg, rgba(45,0,80,.85), rgba(20,0,50,.9))',
                    transformOrigin: '50% 120%',
                    transform: `rotate(${deg}deg) translateX(${(i - 2) * 10}px)`,
                    boxShadow: '0 2px 10px rgba(0,0,0,.5)',
                  }}>
                    <div style={{
                      position: 'absolute', inset: 5, borderRadius: 3,
                      border: '1px solid rgba(147,51,234,.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, color: 'rgba(147,51,234,.6)',
                    }}>✦</div>
                  </div>
                ))}
              </div>
              {/* gradient overlay + text */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to bottom, transparent 30%, rgba(8,6,20,.97) 100%)',
              }} />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                <p className="font-serif text-2xl text-oracle-gold mb-1">La Pitonisa está lista</p>
                <p className="text-oracle-mid text-sm">Las cartas del destino aguardan tu elección</p>
              </div>
            </div>

            {/* grimorio badge */}
            <div className="flex items-center gap-3 justify-center mb-4">
              <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(147,51,234,.5))' }} />
              <p style={{ color: '#9333EA', fontSize: 10, letterSpacing: '5px', textTransform: 'uppercase', fontWeight: 600 }}>
                El Grimorio Digital
              </p>
              <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, rgba(147,51,234,.5), transparent)' }} />
            </div>

            <h1 className="font-serif text-4xl md:text-5xl text-oracle-gold mb-4">
              El Tarot de la Pitonisa
            </h1>
            <p className="text-oracle-mid text-lg max-w-sm mx-auto mb-3 leading-relaxed">
              Las cartas del Arcano Mayor revelan lo que el universo guarda para ti
              en el amor, el destino y el camino que aún no has recorrido.
            </p>
            <p className="text-oracle-dim text-xs mb-8">22 cartas · Arcano Mayor · 3 cartas por lectura</p>

            <button
              onClick={startReading}
              className="btn-oracle btn-oracle-lg"
              style={{ background: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)', color: '#fff' }}
            >
              🃏 Comenzar mi lectura
            </button>
            <p className="text-oracle-dim text-xs mt-3">Gratis · Sin registro</p>
          </div>
        )}

        {/* ── PICKING ── */}
        {phase === 'picking' && (
          <div>
            <div className="text-center mb-8">
              <p style={{ color: '#9333EA', fontSize: 10, letterSpacing: '5px', textTransform: 'uppercase' }} className="mb-2">
                El Tarot de la Pitonisa
              </p>
              <h2 className="font-serif text-3xl text-oracle-gold mb-2">
                Elige 3 cartas
              </h2>
              <p className="text-oracle-mid text-sm leading-relaxed max-w-xs mx-auto">
                Cierra los ojos, respira profundo y deja que tu intuición guíe tu mano.
              </p>
              {selected.length > 0 && (
                <p className="text-oracle-dim text-xs mt-2">
                  <span className="text-oracle-gold font-semibold">{selected.length}</span> de 3 elegidas
                </p>
              )}
            </div>

            {/* fanned card spread */}
            <div className="flex justify-center items-end gap-3 mb-10" style={{ minHeight: 160 }}>
              {deck.map((card, idx) => {
                const isSelected = selected.includes(card.id)
                const isDisabled = !isSelected && selected.length >= 3
                // fan angle: spread 7 cards from -18° to +18°
                const angle = (idx - 3) * 6

                return (
                  <button
                    key={card.id}
                    onClick={() => !isDisabled && toggleCard(card.id)}
                    disabled={isDisabled}
                    title={isDisabled ? 'Ya elegiste 3 cartas' : 'Elegir esta carta'}
                    style={{
                      width: 72, height: 120,
                      borderRadius: 8,
                      border: isSelected
                        ? '2px solid rgba(147,51,234,.9)'
                        : '1px solid rgba(147,51,234,.3)',
                      background: isSelected
                        ? 'linear-gradient(160deg, rgba(65,0,110,.95), rgba(35,0,75,.98))'
                        : 'linear-gradient(160deg, rgba(30,0,60,.85), rgba(15,0,40,.9)',
                      boxShadow: isSelected
                        ? '0 0 22px rgba(147,51,234,.65), 0 6px 16px rgba(0,0,0,.6)'
                        : '0 4px 12px rgba(0,0,0,.45)',
                      transform: isSelected
                        ? `rotate(${angle}deg) translateY(-16px) scale(1.1)`
                        : `rotate(${angle}deg) translateY(${isDisabled ? 4 : 0}px)`,
                      transition: 'all .2s ease',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      opacity: isDisabled ? 0.35 : 1,
                      position: 'relative',
                      flexShrink: 0,
                    }}
                  >
                    {/* card back inner border */}
                    <div style={{
                      position: 'absolute', inset: 7, borderRadius: 4,
                      border: '1px solid rgba(147,51,234,.28)',
                      background: 'radial-gradient(circle at 50% 50%, rgba(147,51,234,.08) 0%, transparent 70%)',
                    }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <span style={{ fontSize: 8, color: 'rgba(147,51,234,.5)', letterSpacing: '3px' }}>✦</span>
                      <span style={{ fontSize: 20, opacity: isSelected ? 0.9 : 0.35, color: '#9333EA' }}>✦</span>
                      <span style={{ fontSize: 8, color: 'rgba(147,51,234,.5)', letterSpacing: '3px' }}>✦</span>
                    </div>
                    {/* selection number badge */}
                    {isSelected && (
                      <div style={{
                        position: 'absolute', top: -8, right: -8,
                        width: 22, height: 22, borderRadius: '50%',
                        background: '#9333EA', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700,
                        boxShadow: '0 2px 6px rgba(147,51,234,.5)',
                      }}>
                        {selected.indexOf(card.id) + 1}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {selected.length === 3 && (
              <div className="text-center">
                <button
                  onClick={beginReveal}
                  className="btn-oracle btn-oracle-lg"
                  style={{ background: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)', color: '#fff' }}
                >
                  ✦ Revelar mis cartas
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── REVEALING / DONE ── */}
        {(phase === 'revealing' || phase === 'done') && (
          <div>
            <div className="text-center mb-8">
              <p style={{ color: '#9333EA', fontSize: 10, letterSpacing: '5px', textTransform: 'uppercase' }} className="mb-2">
                El Tarot de la Pitonisa
              </p>
              {phase === 'revealing' && (
                <h2 className="font-serif text-3xl text-oracle-gold mb-2">Las cartas hablan...</h2>
              )}
              {phase === 'done' && (
                <>
                  <h2 className="font-serif text-3xl text-oracle-gold mb-2">Tu lectura está completa</h2>
                  <p className="text-oracle-mid text-sm">El universo ha hablado a través del Arcano Mayor</p>
                </>
              )}
            </div>

            <div className="space-y-5 mb-10">
              {selectedCards.map((card, i) => {
                const isVisible = revealed.has(card.id)
                const rgb = hexToRgb(card.color)
                return (
                  <div
                    key={card.id}
                    style={{
                      border: `1px solid rgba(${isVisible ? rgb : '147,51,234'},.${isVisible ? '4' : '15'})`,
                      borderRadius: 12,
                      background: isVisible
                        ? `linear-gradient(135deg, rgba(${rgb},.08), rgba(8,6,20,.95))`
                        : 'rgba(13,8,39,.6)',
                      boxShadow: isVisible ? `0 0 20px rgba(${rgb},.14)` : 'none',
                      opacity: isVisible ? 1 : 0.5,
                      transform: isVisible ? 'none' : 'translateY(12px)',
                      transition: 'all .7s ease',
                      padding: 24,
                    }}
                  >
                    {isVisible ? (
                      <div className="flex gap-5 items-start">
                        {/* mini tarot card visual */}
                        <div style={{
                          width: 64, height: 106, borderRadius: 6, flexShrink: 0,
                          border: `1px solid rgba(${rgb},.5)`,
                          background: `linear-gradient(160deg, rgba(${rgb},.18), rgba(${rgb},.05))`,
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', gap: 3,
                        }}>
                          <span style={{ fontSize: 9, color: card.color, letterSpacing: '1px', fontWeight: 700 }}>
                            {card.numeral}
                          </span>
                          <span style={{ fontSize: 28 }}>{card.symbol}</span>
                          <span style={{
                            fontSize: 7, color: card.color, textAlign: 'center',
                            lineHeight: 1.3, padding: '0 4px',
                          }}>
                            {card.nombre}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold mb-1" style={{ color: 'rgba(147,51,234,.55)', letterSpacing: '2px' }}>
                            CARTA {i + 1}
                          </p>
                          <h3 className="font-serif text-xl mb-2" style={{ color: card.color }}>
                            {card.numeral} · {card.nombre}
                          </h3>
                          <p className="text-oracle-mid text-sm leading-relaxed">{card.interpretacion}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center" style={{ height: 80 }}>
                        <div className="flex gap-2">
                          {[0, 1, 2].map(j => (
                            <div key={j} className="w-2 h-2 rounded-full animate-pulse" style={{
                              background: '#9333EA', animationDelay: `${j * 0.15}s`,
                            }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {phase === 'done' && (
              <div className="text-center space-y-3">
                <p className="text-oracle-mid text-sm mb-4">
                  Las estrellas han hablado. ¿Quieres conocer el rostro de tu alma gemela?
                </p>
                <Link
                  href="/consulta"
                  className="btn-oracle btn-oracle-lg block max-w-xs mx-auto text-center"
                >
                  Revelar mi alma gemela →
                </Link>
                <button
                  onClick={startReading}
                  className="btn-oracle-outline block max-w-xs mx-auto w-full text-center"
                  style={{ borderColor: 'rgba(147,51,234,.4)', color: '#9333EA' }}
                >
                  🃏 Nueva lectura
                </button>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-oracle-dim text-xs mt-12">
          © 2026 El Oráculo de la Pitonisa · Solo entretenimiento
        </p>
      </div>
    </div>
  )
}
