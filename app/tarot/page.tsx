'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { readSub } from '@/lib/sub'

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

// Named positions for the 7-card premium spread
const SPREAD_POSITIONS = [
  { nombre: 'La Raíz',    desc: 'El origen de tu camino' },
  { nombre: 'El Presente', desc: 'Tu momento actual' },
  { nombre: 'El Velo',    desc: 'Lo que aún no ves de ti misma' },
  { nombre: 'El Puente',  desc: 'Lo que debes cruzar' },
  { nombre: 'El Deseo',   desc: 'Lo que el corazón guarda' },
  { nombre: 'La Senda',   desc: 'El consejo del universo' },
  { nombre: 'El Destino', desc: 'Lo que el Arcano te revela' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Phase = 'intro' | 'picking' | 'revealing' | 'done' | 'paywall'
type Mode = 'free' | 'premium'

export default function TarotPage() {
  const [phase, setPhase]       = useState<Phase>('intro')
  const [mode, setMode]         = useState<Mode>('free')
  const [isPremium, setIsPremium] = useState(false)
  const [deck, setDeck]         = useState<typeof MAJOR_ARCANA>([])
  const [selected, setSelected] = useState<number[]>([])
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  useEffect(() => {
    const sub = readSub()
    setIsPremium(!!(sub?.nombre && sub?.signo))
  }, [])

  const maxCards = mode === 'premium' ? 7 : 3

  function launchReading(m: Mode) {
    const newDeck = m === 'premium'
      ? shuffle(MAJOR_ARCANA)           // all 22 for premium
      : shuffle(MAJOR_ARCANA).slice(0, 7) // 7-card fan for free
    setMode(m)
    setDeck(newDeck)
    setSelected([])
    setRevealed(new Set())
    setPhase('picking')
  }

  function handleModeSelect(m: Mode) {
    if (m === 'premium' && !isPremium) {
      setMode('premium')
      setPhase('paywall')
      return
    }
    launchReading(m)
  }

  function toggleCard(id: number) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= maxCards) return prev
      return [...prev, id]
    })
  }

  useEffect(() => {
    if (phase !== 'revealing') return
    let cancelled = false
    async function doReveal() {
      for (let i = 0; i < selected.length; i++) {
        await new Promise(r => setTimeout(r, i === 0 ? 500 : 900))
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
            {/* Pitonisa hero */}
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
              <div className="absolute inset-0 pointer-events-none">
                {[-30, -15, 0, 15, 30].map((deg, i) => (
                  <div key={i} className="absolute" style={{
                    bottom: '5%', left: '50%',
                    width: 46, height: 76, marginLeft: -23,
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
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to bottom, transparent 30%, rgba(8,6,20,.97) 100%)',
              }} />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                <p className="font-serif text-2xl text-oracle-gold mb-1">La Pitonisa está lista</p>
                <p className="text-oracle-mid text-sm">Las cartas del destino aguardan tu elección</p>
              </div>
            </div>

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
            <p className="text-oracle-mid text-lg max-w-sm mx-auto mb-10 leading-relaxed">
              Las cartas del Arcano Mayor revelan lo que el universo guarda para ti
              en el amor, el destino y el camino que aún no has recorrido.
            </p>

            {/* Mode selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              {/* Free */}
              <button
                onClick={() => handleModeSelect('free')}
                className="rounded-2xl p-6 text-left transition-all"
                style={{
                  border: '1px solid rgba(147,51,234,.35)',
                  background: 'rgba(13,8,39,.7)',
                }}
              >
                <div className="text-3xl mb-3">🃏</div>
                <p className="font-serif text-lg text-oracle-gold mb-1">Lectura Básica</p>
                <p className="text-oracle-mid text-sm leading-relaxed mb-4">
                  3 cartas · Pasado, presente y futuro en el amor
                </p>
                <div className="w-full py-2 px-4 rounded-lg text-center text-sm font-semibold"
                  style={{ border: '1px solid rgba(147,51,234,.5)', color: '#9333EA' }}>
                  Gratis · Sin registro
                </div>
              </button>

              {/* Premium */}
              <button
                onClick={() => handleModeSelect('premium')}
                className="rounded-2xl p-6 text-left transition-all relative overflow-hidden"
                style={{
                  border: '1px solid rgba(242,168,0,.4)',
                  background: 'linear-gradient(135deg, rgba(30,20,8,.9), rgba(13,8,39,.9))',
                  boxShadow: '0 0 30px rgba(242,168,0,.1)',
                }}
              >
                {/* glow top-right */}
                <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none" style={{
                  background: 'radial-gradient(circle at top right, rgba(242,168,0,.15), transparent 70%)',
                }} />
                <div className="text-3xl mb-3">👑</div>
                <p className="font-serif text-lg text-oracle-gold mb-1">Lectura Completa</p>
                <p className="text-oracle-mid text-sm leading-relaxed mb-4">
                  7 cartas · Tirada del Destino con posiciones nombradas y los 22 Arcanos Mayores
                </p>
                <div className="w-full py-2 px-4 rounded-lg text-center text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #F2A800, #D4880A)', color: '#08060F' }}>
                  {isPremium ? '✦ Iniciar lectura' : '🔒 Solo suscriptores'}
                </div>
              </button>
            </div>

            <p className="text-oracle-dim text-xs mt-6">22 cartas · Arcano Mayor · Interpretación de amor y destino</p>
          </div>
        )}

        {/* ── PAYWALL ── */}
        {phase === 'paywall' && (
          <div className="text-center max-w-md mx-auto">
            <div className="text-5xl mb-5">👑</div>

            <div className="flex items-center gap-3 justify-center mb-4">
              <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(242,168,0,.5))' }} />
              <p style={{ color: '#F2A800', fontSize: 10, letterSpacing: '5px', textTransform: 'uppercase', fontWeight: 600 }}>
                Suscripción Premium
              </p>
              <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, rgba(242,168,0,.5), transparent)' }} />
            </div>

            <h2 className="font-serif text-3xl text-oracle-gold mb-3">
              Tirada del Destino
            </h2>
            <p className="text-oracle-mid leading-relaxed mb-8">
              La lectura completa de 7 cartas con los 22 Arcanos Mayores y posiciones nombradas del destino.
            </p>

            {/* Feature list */}
            <div className="rounded-2xl p-6 mb-6 text-left space-y-3" style={{
              border: '1px solid rgba(242,168,0,.25)',
              background: 'rgba(13,8,39,.8)',
            }}>
              {[
                ['✦', 'Los 22 Arcanos Mayores disponibles para ti'],
                ['✦', '7 cartas con posiciones nombradas: La Raíz, El Velo, El Destino...'],
                ['✦', 'Interpretación profunda del camino amoroso'],
                ['✦', 'Acceso ilimitado al chat con la Pitonisa'],
                ['✦', 'Imagen de tu alma gemela revelada'],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0" style={{ color: '#F2A800', fontSize: 12 }}>{icon}</span>
                  <p className="text-oracle-mid text-sm leading-snug">{text}</p>
                </div>
              ))}
            </div>

            {/* Preview of spread positions — blurred/locked */}
            <div className="rounded-xl p-4 mb-6 relative overflow-hidden" style={{
              border: '1px solid rgba(147,51,234,.2)',
              background: 'rgba(8,6,20,.8)',
            }}>
              <div className="flex justify-center gap-2 mb-3" style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none' }}>
                {SPREAD_POSITIONS.map((pos) => (
                  <div key={pos.nombre} style={{
                    width: 44, height: 72, borderRadius: 5,
                    border: '1px solid rgba(242,168,0,.4)',
                    background: 'linear-gradient(160deg, rgba(30,20,8,.9), rgba(13,8,39,.9))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, color: 'rgba(242,168,0,.7)',
                  }}>✦</div>
                ))}
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ background: 'rgba(8,6,20,.65)' }}>
                <span style={{ fontSize: 22 }}>🔒</span>
                <p className="text-oracle-mid text-xs mt-1">Tirada del Destino · 7 posiciones</p>
              </div>
            </div>

            <Link
              href="/consulta"
              className="btn-oracle btn-oracle-lg block max-w-xs mx-auto text-center mb-3"
            >
              👑 Activar suscripción · $49 MXN/mes
            </Link>
            <button
              onClick={() => launchReading('free')}
              className="text-oracle-dim text-sm hover:text-oracle-mid transition-colors"
            >
              Continuar con lectura básica (3 cartas)
            </button>
          </div>
        )}

        {/* ── PICKING ── */}
        {phase === 'picking' && (
          <div>
            <div className="text-center mb-8">
              <p style={{ color: '#9333EA', fontSize: 10, letterSpacing: '5px', textTransform: 'uppercase' }} className="mb-2">
                {mode === 'premium' ? '👑 Tirada del Destino' : 'El Tarot de la Pitonisa'}
              </p>
              <h2 className="font-serif text-3xl text-oracle-gold mb-2">
                Elige {maxCards} cartas
              </h2>
              <p className="text-oracle-mid text-sm leading-relaxed max-w-xs mx-auto">
                Cierra los ojos, respira profundo y deja que tu intuición guíe tu mano.
              </p>
              {selected.length > 0 && (
                <p className="text-oracle-dim text-xs mt-2">
                  <span className="text-oracle-gold font-semibold">{selected.length}</span> de {maxCards} elegidas
                </p>
              )}
            </div>

            {/* FREE: 7-card fan */}
            {mode === 'free' && (
              <div className="flex justify-center items-end gap-3 mb-10" style={{ minHeight: 160 }}>
                {deck.map((card, idx) => {
                  const isSelected = selected.includes(card.id)
                  const isDisabled = !isSelected && selected.length >= maxCards
                  const angle = (idx - 3) * 6
                  return (
                    <button
                      key={card.id}
                      onClick={() => !isDisabled && toggleCard(card.id)}
                      disabled={isDisabled}
                      title={isDisabled ? `Ya elegiste ${maxCards} cartas` : 'Elegir esta carta'}
                      style={{
                        width: 72, height: 120, borderRadius: 8, flexShrink: 0,
                        border: isSelected ? '2px solid rgba(147,51,234,.9)' : '1px solid rgba(147,51,234,.3)',
                        background: isSelected
                          ? 'linear-gradient(160deg, rgba(65,0,110,.95), rgba(35,0,75,.98))'
                          : 'linear-gradient(160deg, rgba(30,0,60,.85), rgba(15,0,40,.9))',
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
                      }}
                    >
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
            )}

            {/* PREMIUM: same fan style as free mode, face-down cards, 22 arcana */}
            {mode === 'premium' && (
              <>
                <p className="text-center text-oracle-dim text-xs mb-6">
                  Cierra los ojos · Respira · Elige 7 con el corazón
                </p>
                {/* Overlapping fan — cards boca abajo, mismo estilo que la lectura de 3 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  minHeight: 170,
                  marginBottom: 40,
                  overflowX: 'hidden',
                }}>
                  {deck.map((card, idx) => {
                    const n = deck.length                     // 22
                    const center = (n - 1) / 2
                    const angle = (idx - center) * 3.2        // spread: -33.6° to +33.6°
                    const isSelected = selected.includes(card.id)
                    const isDisabled = !isSelected && selected.length >= maxCards
                    const selIdx = selected.indexOf(card.id)
                    const OVERLAP = 36                         // px each card hides behind the next
                    return (
                      <button
                        key={card.id}
                        onClick={() => !isDisabled && toggleCard(card.id)}
                        disabled={isDisabled}
                        title={isDisabled ? 'Ya elegiste 7 cartas' : 'Elegir esta carta'}
                        style={{
                          width: 52, height: 86,
                          marginLeft: idx === 0 ? 0 : -OVERLAP,
                          flexShrink: 0,
                          borderRadius: 7,
                          border: isSelected
                            ? '2px solid rgba(147,51,234,.95)'
                            : '1px solid rgba(147,51,234,.28)',
                          background: isSelected
                            ? 'linear-gradient(160deg, rgba(65,0,110,.97), rgba(35,0,75,.98))'
                            : 'linear-gradient(160deg, rgba(30,0,60,.85), rgba(15,0,40,.9))',
                          boxShadow: isSelected
                            ? '0 0 22px rgba(147,51,234,.7), 0 8px 18px rgba(0,0,0,.65)'
                            : '0 3px 10px rgba(0,0,0,.5)',
                          transform: isSelected
                            ? `rotate(${angle}deg) translateY(-22px) scale(1.1)`
                            : `rotate(${angle}deg) translateY(${isDisabled ? 4 : 0}px)`,
                          transition: 'all .2s ease',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          opacity: isDisabled ? 0.28 : 1,
                          position: 'relative',
                          zIndex: isSelected ? 50 : idx,
                        }}
                      >
                        {/* Patrón decorativo cara posterior — sin identidad de carta */}
                        <div style={{
                          position: 'absolute', inset: 6, borderRadius: 3,
                          border: '1px solid rgba(147,51,234,.22)',
                          background: 'radial-gradient(circle at 50% 50%, rgba(147,51,234,.09) 0%, transparent 70%)',
                        }} />
                        <div style={{
                          position: 'absolute', inset: 0,
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', gap: 5,
                        }}>
                          <span style={{ fontSize: 7, color: 'rgba(147,51,234,.4)', letterSpacing: '2px' }}>✦</span>
                          <span style={{ fontSize: 18, opacity: isSelected ? 1 : 0.28, color: '#9333EA' }}>✦</span>
                          <span style={{ fontSize: 7, color: 'rgba(147,51,234,.4)', letterSpacing: '2px' }}>✦</span>
                        </div>
                        {isSelected && (
                          <div style={{
                            position: 'absolute', top: -9, right: -9,
                            width: 22, height: 22, borderRadius: '50%',
                            background: '#9333EA', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 700,
                            boxShadow: '0 2px 7px rgba(147,51,234,.65)',
                            zIndex: 51,
                          }}>
                            {selIdx + 1}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {selected.length === maxCards && (
              <div className="text-center">
                <button
                  onClick={() => setPhase('revealing')}
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
                {mode === 'premium' ? '👑 Tirada del Destino' : 'El Tarot de la Pitonisa'}
              </p>
              {phase === 'revealing' ? (
                <h2 className="font-serif text-3xl text-oracle-gold mb-2">Las cartas hablan...</h2>
              ) : (
                <>
                  <h2 className="font-serif text-3xl text-oracle-gold mb-2">
                    {mode === 'premium' ? 'Tu destino ha sido revelado' : 'Tu lectura está completa'}
                  </h2>
                  <p className="text-oracle-mid text-sm">El universo ha hablado a través del Arcano Mayor</p>
                </>
              )}
            </div>

            <div className="space-y-4 mb-10">
              {selectedCards.map((card, i) => {
                const isVisible = revealed.has(card.id)
                const rgb = hexToRgb(card.color)
                const position = mode === 'premium' ? SPREAD_POSITIONS[i] : null
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
                      padding: 20,
                    }}
                  >
                    {isVisible ? (
                      <div className="flex gap-4 items-start">
                        {/* mini card */}
                        <div style={{
                          width: 58, height: 96, borderRadius: 6, flexShrink: 0,
                          border: `1px solid rgba(${rgb},.5)`,
                          background: `linear-gradient(160deg, rgba(${rgb},.18), rgba(${rgb},.05))`,
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', gap: 3,
                        }}>
                          <span style={{ fontSize: 8, color: card.color, letterSpacing: '1px', fontWeight: 700 }}>
                            {card.numeral}
                          </span>
                          <span style={{ fontSize: 26 }}>{card.symbol}</span>
                          <span style={{ fontSize: 6, color: card.color, textAlign: 'center', lineHeight: 1.3, padding: '0 4px' }}>
                            {card.nombre}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          {position ? (
                            <>
                              <p className="text-xs font-bold mb-0.5" style={{ color: 'rgba(242,168,0,.5)', letterSpacing: '2px' }}>
                                {position.nombre.toUpperCase()}
                              </p>
                              <p className="text-oracle-dim text-xs mb-1.5">{position.desc}</p>
                            </>
                          ) : (
                            <p className="text-xs font-bold mb-1" style={{ color: 'rgba(147,51,234,.55)', letterSpacing: '2px' }}>
                              CARTA {i + 1}
                            </p>
                          )}
                          <h3 className="font-serif text-lg mb-2" style={{ color: card.color }}>
                            {card.numeral} · {card.nombre}
                          </h3>
                          <p className="text-oracle-mid text-sm leading-relaxed">{card.interpretacion}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center" style={{ height: 72 }}>
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
                  {mode === 'premium'
                    ? 'La Tirada del Destino ha hablado. El universo tiene un rostro reservado para ti.'
                    : 'Las estrellas han hablado. ¿Quieres conocer el rostro de tu alma gemela?'}
                </p>
                <Link
                  href="/consulta"
                  className="btn-oracle btn-oracle-lg block max-w-xs mx-auto text-center"
                >
                  Revelar mi alma gemela →
                </Link>
                <button
                  onClick={() => setPhase('intro')}
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
