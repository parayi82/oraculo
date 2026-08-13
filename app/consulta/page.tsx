'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { getSigno, getDatosSigno } from '@/lib/oracle'
import type { Genero } from '@/lib/oracle'

type Step = 1 | 2 | 3 | 4

interface FormData {
  nombre: string
  dia: string
  mes: string
  anio: string
  genero: Genero | ''
}

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

const GENERO_OPTS: { value: Genero; label: string; emoji: string; desc: string }[] = [
  { value: 'hombre',  label: 'Un hombre',       emoji: '👨', desc: 'Ver el rostro de él' },
  { value: 'mujer',   label: 'Una mujer',        emoji: '👩', desc: 'Ver el rostro de ella' },
  { value: 'destino', label: 'El destino decide', emoji: '🌟', desc: 'Sorpréndeme' },
]

export default function ConsultaPage() {
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormData>({
    nombre: '', dia: '', mes: '', anio: '', genero: '',
  })

  const signo = form.dia && form.mes
    ? getSigno(parseInt(form.dia), parseInt(form.mes))
    : null
  const datosSigno = signo ? getDatosSigno(signo) : null

  const progress = ((step - 1) / 3) * 100

  const nextStep = useCallback(() => {
    setStep((s) => Math.min(s + 1, 4) as Step)
  }, [])

  const prevStep = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1) as Step)
  }, [])

  async function handlePagar() {
    setLoading(true)
    try {
      // Save to sessionStorage before Stripe redirect
      sessionStorage.setItem('oraculo_data', JSON.stringify({
        nombre: form.nombre,
        fechaNacimiento: `${form.anio}-${form.mes.padStart(2,'0')}-${form.dia.padStart(2,'0')}`,
        genero: form.genero,
        signo,
      }))

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          fechaNacimiento: `${form.anio}-${form.mes.padStart(2,'0')}-${form.dia.padStart(2,'0')}`,
          genero: form.genero,
          signo,
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.redirect) {
        // Dev mode: no Stripe configured, go straight to resultado
        window.location.href = data.redirect
      }
    } catch {
      setLoading(false)
    }
  }

  const nombreOk = form.nombre.trim().length >= 2
  const fechaOk  = form.dia && form.mes && form.anio && parseInt(form.anio) >= 1930 && parseInt(form.anio) <= 2008
  const generoOk = form.genero !== ''

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080614' }}>
      {/* Canvas bg (lightweight inline) */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,.12) 0%, transparent 60%)',
      }} />

      {/* Header */}
      <header className="relative z-10 px-6 py-5 flex items-center gap-4">
        <Link href="/" className="text-oracle-dim hover:text-oracle-gold transition-colors text-sm">
          ← Inicio
        </Link>
        <div className="flex-1 progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-oracle-dim text-xs tabular-nums">{step}/4</span>
      </header>

      {/* Step content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">

          {/* STEP 1 — Nombre */}
          {step === 1 && (
            <div className="animate-fade-up">
              <p className="text-oracle-teal text-xs tracking-[3px] uppercase mb-4">Paso 1 de 4</p>
              <h1 className="font-serif text-4xl text-oracle-gold text-glow-gold mb-3">
                ¿Cómo te llamas?
              </h1>
              <p className="text-oracle-mid mb-8 leading-relaxed">
                Tu nombre vibra en el universo. La Pitonisa lo necesita para leer
                la energía que te rodea.
              </p>

              <input
                type="text"
                placeholder="Tu nombre completo"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                autoFocus
                className="w-full px-5 py-4 text-lg rounded-lg text-oracle-text placeholder:text-oracle-dim focus:outline-none"
                style={{
                  background: 'rgba(26,21,64,.8)',
                  border: '1px solid rgba(242,168,0,.3)',
                  transition: 'border-color .2s',
                }}
                onKeyDown={(e) => e.key === 'Enter' && nombreOk && nextStep()}
              />

              <button
                onClick={nextStep}
                disabled={!nombreOk}
                className="btn-oracle w-full mt-6 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuar →
              </button>
            </div>
          )}

          {/* STEP 2 — Fecha */}
          {step === 2 && (
            <div className="animate-fade-up">
              <p className="text-oracle-teal text-xs tracking-[3px] uppercase mb-4">Paso 2 de 4</p>
              <h1 className="font-serif text-4xl text-oracle-gold text-glow-gold mb-3">
                ¿Cuándo naciste,<br/>{form.nombre.split(' ')[0]}?
              </h1>
              <p className="text-oracle-mid mb-8 leading-relaxed">
                Las estrellas en el momento de tu nacimiento revelan la vibración
                de tu alma gemela.
              </p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: 'Día',
                    key: 'dia' as const,
                    placeholder: 'DD',
                    type: 'number',
                    min: 1, max: 31,
                  },
                  {
                    label: 'Año',
                    key: 'anio' as const,
                    placeholder: 'AAAA',
                    type: 'number',
                    min: 1930, max: 2008,
                  },
                ].map(({ label, key, placeholder, type, min, max }) => (
                  <div key={key} className={key === 'dia' ? '' : 'col-span-2'}>
                    <label className="text-oracle-dim text-xs uppercase tracking-wider mb-1.5 block">
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      min={min}
                      max={max}
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg text-oracle-text text-lg placeholder:text-oracle-dim focus:outline-none"
                      style={{ background: 'rgba(26,21,64,.8)', border: '1px solid rgba(242,168,0,.3)' }}
                    />
                  </div>
                ))}
              </div>

              {/* Mes select */}
              <div className="mt-3">
                <label className="text-oracle-dim text-xs uppercase tracking-wider mb-1.5 block">Mes</label>
                <select
                  value={form.mes}
                  onChange={(e) => setForm((f) => ({ ...f, mes: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg text-oracle-text text-base focus:outline-none"
                  style={{
                    background: 'rgba(26,21,64,.8)',
                    border: '1px solid rgba(242,168,0,.3)',
                    color: form.mes ? '#EDE5FA' : '#6B5E8A',
                  }}
                >
                  <option value="" style={{ background: '#110D28' }}>Selecciona el mes</option>
                  {MESES.map((m, i) => (
                    <option key={m} value={String(i + 1)} style={{ background: '#110D28' }}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Signo reveal */}
              {datosSigno && (
                <div
                  className="mt-5 px-5 py-4 rounded-lg flex items-center gap-4"
                  style={{ background: 'rgba(242,168,0,.07)', border: '1px solid rgba(242,168,0,.2)' }}
                >
                  <span className="text-3xl" aria-hidden>{datosSigno.emoji}</span>
                  <div>
                    <p className="text-oracle-gold font-semibold">{datosSigno.nombre}</p>
                    <p className="text-oracle-mid text-sm">{datosSigno.fraseMistica}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={prevStep} className="btn-oracle-outline flex-shrink-0">
                  ←
                </button>
                <button
                  onClick={nextStep}
                  disabled={!fechaOk}
                  className="btn-oracle flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Género */}
          {step === 3 && (
            <div className="animate-fade-up">
              <p className="text-oracle-teal text-xs tracking-[3px] uppercase mb-4">Paso 3 de 4</p>
              <h1 className="font-serif text-4xl text-oracle-gold text-glow-gold mb-3">
                ¿Cómo es tu<br/>alma gemela?
              </h1>
              <p className="text-oracle-mid mb-8 leading-relaxed">
                El oráculo necesita saber hacia dónde enfocar su visión.
              </p>

              <div className="flex flex-col gap-3">
                {GENERO_OPTS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setForm((f) => ({ ...f, genero: opt.value }))
                    }}
                    className="oracle-border p-5 flex items-center gap-4 text-left transition-all duration-200 w-full"
                    style={{
                      background: form.genero === opt.value
                        ? 'rgba(242,168,0,.12)'
                        : 'rgba(26,21,64,.6)',
                      borderColor: form.genero === opt.value
                        ? 'rgba(242,168,0,.7)'
                        : 'rgba(242,168,0,.2)',
                    }}
                  >
                    <span className="text-3xl" aria-hidden>{opt.emoji}</span>
                    <div>
                      <p className="text-oracle-text font-semibold">{opt.label}</p>
                      <p className="text-oracle-dim text-sm">{opt.desc}</p>
                    </div>
                    {form.genero === opt.value && (
                      <span className="ml-auto text-oracle-gold text-lg">✓</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={prevStep} className="btn-oracle-outline flex-shrink-0">←</button>
                <button
                  onClick={nextStep}
                  disabled={!generoOk}
                  className="btn-oracle flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — Paywall */}
          {step === 4 && datosSigno && (
            <div className="animate-fade-up text-center">
              <p className="text-oracle-teal text-xs tracking-[3px] uppercase mb-6">Tu lectura está lista</p>

              {/* Blurry preview orb */}
              <div className="relative mx-auto mb-8" style={{ width: 160, height: 160 }}>
                <div
                  className="w-full h-full rounded-full animate-glow-pulse"
                  style={{
                    background: 'radial-gradient(circle at 40% 38%, rgba(242,168,0,.4) 0%, rgba(139,92,246,.3) 50%, transparent 80%)',
                    border: '1px solid rgba(242,168,0,.35)',
                    filter: 'blur(2px)',
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl" aria-hidden>🔮</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl text-oracle-gold text-glow-gold mb-3">
                La Pitonisa te ve,<br/>{form.nombre.split(' ')[0]}
              </h1>

              <div
                className="text-left px-5 py-4 rounded-lg mb-6 mx-auto max-w-sm"
                style={{ background: 'rgba(242,168,0,.07)', border: '1px solid rgba(242,168,0,.18)' }}
              >
                <p className="text-oracle-mid text-sm leading-relaxed italic">
                  &ldquo;{datosSigno.fraseMistica}&rdquo;
                </p>
                <p className="text-oracle-dim text-xs mt-3">
                  Signo {datosSigno.nombre} {datosSigno.emoji} · Elemento {datosSigno.elemento}
                </p>
              </div>

              <p className="text-oracle-mid text-sm mb-6 leading-relaxed max-w-xs mx-auto">
                Para revelar la imagen de tu alma gemela y el mensaje completo
                que las estrellas tienen para ti:
              </p>

              <div className="oracle-border p-6 mb-6 text-center" style={{ background: 'rgba(26,21,64,.6)' }}>
                <p className="text-oracle-dim text-xs uppercase tracking-wider mb-1">Suscripción mensual</p>
                <p className="font-serif text-5xl text-oracle-gold text-glow-gold mb-1">$49</p>
                <p className="text-oracle-dim text-sm mb-4">pesos mexicanos / mes · Cancela cuando quieras</p>
                <ul className="text-left text-oracle-mid text-sm space-y-1.5 mb-2">
                  {[
                    '💞 Imagen de tu alma gemela en HD',
                    '🃏 Lecturas de tarot ilimitadas',
                    '💑 Compatibilidad con tu crush',
                    '🌟 Lectura del día, todos los días',
                    '🖼️ Tarjetas para compartir en redes',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handlePagar}
                disabled={loading}
                className="btn-oracle btn-oracle-lg w-full justify-center disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⟳</span> Preparando tu lectura...
                  </span>
                ) : (
                  'Revelar a mi alma gemela →'
                )}
              </button>

              <p className="mt-4 text-oracle-dim text-xs flex items-center justify-center gap-2">
                🔒 Pago seguro vía Stripe · Sin compromisos
              </p>

              <button onClick={prevStep} className="mt-4 text-oracle-dim text-sm hover:text-oracle-mid transition-colors underline underline-offset-2">
                Cambiar mis datos
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
