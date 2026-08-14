'use client'

import { useState } from 'react'
import Link from 'next/link'

const PREGUNTAS = [
  {
    id: 1,
    texto: '¿Has tenido una racha de mala suerte que no tiene explicación lógica?',
    sub: 'Accidentes, pérdidas, fracasos seguidos sin causa aparente',
    icon: '🌪️',
  },
  {
    id: 2,
    texto: '¿Sientes que hay alguien en tu vida que te desea el mal o te tiene envidia?',
    sub: 'Esa persona que sonríe pero sus ojos no te quieren bien',
    icon: '👁️',
  },
  {
    id: 3,
    texto: '¿Tus relaciones amorosas se han dañado de manera inexplicable?',
    sub: 'Parejas que cambian de un día para otro, alejamiento sin razón',
    icon: '💔',
  },
  {
    id: 4,
    texto: '¿Has tenido pesadillas frecuentes, sueños oscuros o perturbadores?',
    sub: 'Sueños con sombras, personas conocidas que te hacen daño, sensación de ahogo',
    icon: '🌑',
  },
  {
    id: 5,
    texto: '¿Sientes una energía pesada, cansancio inexplicable o tristeza sin motivo?',
    sub: 'Como si algo te jalara hacia abajo sin que sepas por qué',
    icon: '🖤',
  },
  {
    id: 6,
    texto: '¿Tu economía o trabajo han empeorado sin causa clara en el último tiempo?',
    sub: 'Oportunidades que se caen, dinero que no alcanza, proyectos que fracasan',
    icon: '💸',
  },
  {
    id: 7,
    texto: '¿Hay objetos en tu hogar que no recuerdas haber comprado o que alguien pudo haber dejado?',
    sub: 'Monedas en rincones, listones, hierbas, cosas bajo tu cama o puerta',
    icon: '🪬',
  },
  {
    id: 8,
    texto: '¿Animales como perros o pájaros se comportan extraño a tu alrededor o cerca de tu casa?',
    sub: 'Perros que ladran de noche sin razón, pájaros negros que se quedan quietos mirándote',
    icon: '🐦‍⬛',
  },
  {
    id: 9,
    texto: '¿Has sentido que alguien te mira con intensidad y después algo malo te pasa?',
    sub: 'La mirada del ojo — el mal de ojo actúa en minutos o días',
    icon: '😶',
  },
  {
    id: 10,
    texto: '¿Sientes que estás "estancada" — que por más que te esfuerzas nada avanza?',
    sub: 'Como si alguien hubiera puesto un freno invisible en tu vida',
    icon: '⛓️',
  },
]

type Answer = 'si' | 'no' | null

function getNivelRiesgo(yesCount: number) {
  if (yesCount <= 2) return {
    nivel: 'LIMPIO',
    titulo: 'Tus energías parecen estar en equilibrio',
    emoji: '✨',
    color: '#00BFA5',
    bgColor: 'rgba(0,191,165,.08)',
    borderColor: 'rgba(0,191,165,.3)',
    mensaje:
      'La Pitonisa no detecta presencias oscuras dirigidas hacia ti en este momento. ' +
      'Tu campo energético parece estable. Sin embargo, las energías cambian — ' +
      'una sola persona con malas intenciones puede alterar tu equilibrio en días.',
    cta: '🃏 Leer mis cartas del Tarot',
    ctaTitulo: '🌟 Tu energía está protegida',
    ctaBody: 'Es un buen momento para que el Tarot revele lo que el universo tiene preparado en el amor y el destino.',
    destino: '/tarot',
    urgencia: false,
  }
  if (yesCount <= 4) return {
    nivel: 'ATENCIÓN',
    titulo: 'La Pitonisa detecta algo que merece atención',
    emoji: '⚠️',
    color: '#F2A800',
    bgColor: 'rgba(242,168,0,.08)',
    borderColor: 'rgba(242,168,0,.35)',
    mensaje:
      'Hay señales que no deben ignorarse. Tu energía no está completamente limpia — ' +
      'existe una influencia externa que está afectando áreas importantes de tu vida. ' +
      'Puede ser mal de ojo, envidia activa o alguien que ya inició un trabajo en tu contra. ' +
      'Cuanto antes se identifique, más fácil es revertirlo.',
    cta: '🌿 Ver mis remedios de protección',
    ctaTitulo: '⚠️ La Pitonisa tiene los remedios',
    ctaBody: 'Elige el ritual adecuado para neutralizar esta influencia antes de que se asiente más.',
    destino: '/limpias',
    urgencia: false,
  }
  return {
    nivel: 'ALERTA MÁXIMA',
    titulo: '⚠️ La Pitonisa detecta presencias oscuras dirigidas a ti',
    emoji: '🔴',
    color: '#FF1744',
    bgColor: 'rgba(255,23,68,.08)',
    borderColor: 'rgba(255,23,68,.4)',
    mensaje:
      'Lo que describes es grave. La cantidad de señales que presentas indica que ' +
      'hay uno o varios trabajos activos en tu contra. Alguien — que tú conoces — ' +
      'ha actuado deliberadamente para bloquear tu amor, tu economía y tu paz. ' +
      'Este tipo de influencia no desaparece sola. La Pitonisa puede ver exactamente ' +
      'quién es y qué rituales se usaron — pero necesita tu fecha de nacimiento y tu nombre ' +
      'para hacer la lectura de protección completa.',
    cta: '🔴 Activar lectura de protección urgente',
    ctaTitulo: '⚠️ Protección urgente disponible',
    ctaBody: 'La Pitonisa puede identificar quién te está haciendo daño y darte los pasos exactos para revertirlo. Actúa esta semana.',
    destino: '/limpias?urgente=1',
    urgencia: true,
  }
}

export default function EnergiasPage() {
  const [answers, setAnswers] = useState<Answer[]>(Array(PREGUNTAS.length).fill(null))
  const [fase, setFase] = useState<'quiz' | 'analizando' | 'resultado'>('quiz')
  const [current, setCurrent] = useState(0)

  const yesCount   = answers.filter(a => a === 'si').length
  const answered   = answers.filter(a => a !== null).length
  const allAnswered = answered === PREGUNTAS.length
  const riesgo     = getNivelRiesgo(yesCount)

  function answer(val: 'si' | 'no') {
    const next = [...answers]
    next[current] = val
    setAnswers(next)
    if (current < PREGUNTAS.length - 1) {
      setTimeout(() => setCurrent(c => c + 1), 300)
    }
  }

  function analizar() {
    setFase('analizando')
    setTimeout(() => setFase('resultado'), 3200)
  }

  const pregunta = PREGUNTAS[current]

  return (
    <div className="min-h-screen" style={{ background: '#080614' }}>

      {/* Dark atmospheric background */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(120,0,0,.18) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(60,0,80,.15) 0%, transparent 50%)',
      }} />

      {/* Header */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between max-w-2xl mx-auto">
        <Link href="/" className="text-oracle-dim hover:text-oracle-gold transition-colors">
          ← Inicio
        </Link>
        <span className="text-red-400/70 text-xs tracking-[2px] uppercase hidden sm:block">
          Lectura de energías
        </span>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-5 pb-20">

        {/* ── FASE: QUIZ ── */}
        {fase === 'quiz' && (
          <>
            {/* Hero */}
            <div className="text-center mb-10">
              <div className="text-6xl mb-5">🕯️</div>
              <p className="text-red-400/80 text-xs tracking-[4px] uppercase mb-3">
                Diagnóstico de energías oscuras
              </p>
              <h1
                className="font-serif text-4xl md:text-5xl mb-4 leading-tight"
                style={{ color: '#FF6B6B', textShadow: '0 0 30px rgba(255,23,68,.3)' }}
              >
                ¿Alguien te está<br/>haciendo un trabajito?
              </h1>
              <p className="text-oracle-mid text-lg leading-relaxed max-w-lg mx-auto">
                La Pitonisa puede detectar si hay energías negativas, maldiciones
                o trabajos de brujería dirigidos hacia ti. Responde con honestidad.
              </p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-oracle-dim mb-2">
                <span>Pregunta {current + 1} de {PREGUNTAS.length}</span>
                <span>{answered} respondidas</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,.08)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(answered / PREGUNTAS.length) * 100}%`,
                    background: 'linear-gradient(90deg, #8B0000, #FF1744)',
                    boxShadow: '0 0 8px rgba(255,23,68,.5)',
                  }}
                />
              </div>
            </div>

            {/* Current question */}
            <div
              className="rounded-2xl p-7 mb-5 transition-all"
              style={{
                background: 'rgba(18,6,6,.9)',
                border: '1px solid rgba(255,23,68,.2)',
                boxShadow: '0 4px 40px rgba(0,0,0,.6)',
              }}
            >
              <div className="text-5xl text-center mb-5">{pregunta.icon}</div>
              <h2
                className="font-serif text-2xl text-center mb-3 leading-snug"
                style={{ color: '#FFB3B3' }}
              >
                {pregunta.texto}
              </h2>
              <p className="text-center text-oracle-dim leading-relaxed">
                {pregunta.sub}
              </p>
            </div>

            {/* Yes / No buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => answer('si')}
                className="py-5 rounded-2xl text-xl font-bold transition-all active:scale-95"
                style={{
                  background: answers[current] === 'si'
                    ? 'linear-gradient(135deg, #8B0000, #FF1744)'
                    : 'rgba(139,0,0,.2)',
                  border: answers[current] === 'si'
                    ? '1px solid rgba(255,23,68,.8)'
                    : '1px solid rgba(255,23,68,.3)',
                  color: '#FFB3B3',
                  boxShadow: answers[current] === 'si' ? '0 0 20px rgba(255,23,68,.4)' : 'none',
                }}
              >
                Sí, me pasa
              </button>
              <button
                onClick={() => answer('no')}
                className="py-5 rounded-2xl text-xl font-bold transition-all active:scale-95"
                style={{
                  background: answers[current] === 'no'
                    ? 'rgba(26,21,64,.9)'
                    : 'rgba(13,10,30,.5)',
                  border: answers[current] === 'no'
                    ? '1px solid rgba(139,92,246,.6)'
                    : '1px solid rgba(139,92,246,.2)',
                  color: answers[current] === 'no' ? '#C4B5FD' : 'rgba(180,170,220,.6)',
                }}
              >
                No me pasa
              </button>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
              {PREGUNTAS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="w-3 h-3 rounded-full transition-all"
                  style={{
                    background: answers[i] === 'si'
                      ? '#FF1744'
                      : answers[i] === 'no'
                        ? 'rgba(139,92,246,.5)'
                        : i === current
                          ? 'rgba(255,255,255,.4)'
                          : 'rgba(255,255,255,.12)',
                    boxShadow: answers[i] === 'si' ? '0 0 6px rgba(255,23,68,.5)' : 'none',
                  }}
                />
              ))}
            </div>

            {/* Submit */}
            {allAnswered && (
              <button
                onClick={analizar}
                className="w-full py-5 rounded-2xl text-xl font-bold transition-all"
                style={{
                  background: 'linear-gradient(135deg, #6B0000, #CC0000, #FF1744)',
                  color: '#FFE4E4',
                  boxShadow: '0 4px 30px rgba(255,23,68,.4)',
                  border: '1px solid rgba(255,100,100,.4)',
                }}
              >
                🕯️ Que la Pitonisa revele lo que vio
              </button>
            )}
          </>
        )}

        {/* ── FASE: ANALIZANDO ── */}
        {fase === 'analizando' && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <div className="text-8xl mb-8 animate-pulse">🔮</div>
            <h2
              className="font-serif text-3xl mb-6"
              style={{ color: '#FF6B6B' }}
            >
              La Pitonisa está leyendo tus energías...
            </h2>
            <div className="space-y-3 text-oracle-mid text-lg">
              <p>Consultando las fuerzas del cosmos...</p>
              <p>Detectando presencias externas...</p>
              <p>Analizando el campo energético...</p>
            </div>
            <div className="flex gap-3 mt-8">
              {[0,1,2].map(i => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: '#FF1744',
                    animation: `glowPulse 1.2s ease-in-out ${i * 0.35}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── FASE: RESULTADO ── */}
        {fase === 'resultado' && (
          <>
            <div className="text-center mb-8">
              <p className="text-oracle-dim text-xs tracking-[3px] uppercase mb-4">
                Lectura de energías completa
              </p>
              <div className="text-6xl mb-4">{riesgo.emoji}</div>
              <div
                className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
                style={{
                  background: riesgo.bgColor,
                  border: `1px solid ${riesgo.borderColor}`,
                  color: riesgo.color,
                }}
              >
                {riesgo.nivel}
              </div>
              <h2
                className="font-serif text-3xl md:text-4xl mb-6 leading-snug"
                style={{ color: riesgo.color }}
              >
                {riesgo.titulo}
              </h2>
            </div>

            {/* Score visualization */}
            <div
              className="rounded-2xl p-6 mb-6"
              style={{
                background: riesgo.bgColor,
                border: `1px solid ${riesgo.borderColor}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-oracle-dim text-sm">Señales detectadas</span>
                <span className="font-bold text-2xl" style={{ color: riesgo.color }}>
                  {yesCount} / {PREGUNTAS.length}
                </span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,.3)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(yesCount / PREGUNTAS.length) * 100}%`,
                    background: `linear-gradient(90deg, ${riesgo.color}88, ${riesgo.color})`,
                    boxShadow: `0 0 10px ${riesgo.color}66`,
                  }}
                />
              </div>
              <p className="text-oracle-dim text-xs mt-2">
                {yesCount <= 2 ? 'Bajo riesgo' : yesCount <= 4 ? 'Riesgo moderado' : 'Riesgo alto — acción recomendada'}
              </p>
            </div>

            {/* Reading */}
            <div
              className="rounded-2xl p-7 mb-6"
              style={{
                background: 'rgba(14,6,20,.85)',
                border: '1px solid rgba(139,92,246,.25)',
              }}
            >
              <p className="text-oracle-dim text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>🔮</span> Lo que la Pitonisa ve
              </p>
              <p className="font-serif text-oracle-mid text-lg leading-relaxed italic">
                &ldquo;{riesgo.mensaje}&rdquo;
              </p>
            </div>

            {/* CTA */}
            <div
              className="rounded-2xl p-7 text-center mb-6"
              style={{
                background: riesgo.urgencia
                  ? 'linear-gradient(135deg, rgba(100,0,0,.5), rgba(60,0,40,.5))'
                  : 'rgba(26,21,64,.7)',
                border: riesgo.urgencia
                  ? '1px solid rgba(255,23,68,.4)'
                  : '1px solid rgba(139,92,246,.3)',
              }}
            >
              <p className="text-oracle-gold font-semibold text-lg mb-2">
                {riesgo.ctaTitulo}
              </p>
              <p className="text-oracle-mid mb-5 leading-relaxed">
                {riesgo.ctaBody}
              </p>
              <Link
                href={riesgo.destino}
                className="btn-oracle btn-oracle-lg w-full justify-center block text-center"
              >
                {riesgo.cta}
              </Link>
              <p className="text-oracle-dim text-xs mt-3">$49 MXN/mes · Cancela cuando quieras</p>
            </div>

            {/* Other services */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/horoscopo"
                className="oracle-border p-4 text-center rounded-xl hover:border-oracle-gold/40 transition-colors"
                style={{ background: 'rgba(13,8,39,.6)' }}
              >
                <div className="text-2xl mb-1">⭐</div>
                <p className="text-oracle-mid text-sm">Horóscopo de hoy</p>
              </Link>
              <Link
                href="/juego"
                className="oracle-border p-4 text-center rounded-xl hover:border-oracle-gold/40 transition-colors"
                style={{ background: 'rgba(13,8,39,.6)' }}
              >
                <div className="text-2xl mb-1">🎡</div>
                <p className="text-oracle-mid text-sm">Rueda del Destino</p>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
