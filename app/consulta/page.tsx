'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { getSigno, getDatosSigno } from '@/lib/oracle'
import type { Genero } from '@/lib/oracle'
import { readSub, saveSub } from '@/lib/sub'

type Step = 1 | 2 | 3 | 4 | 5

interface FormData {
  nombre: string
  dia: string
  mes: string
  anio: string
  genero: Genero | ''
  fotoDataUrl: string   // base64 JPEG comprimida, vacío si omitió
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

async function compressImage(file: File, maxDim = 600): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(maxDim / img.width, maxDim / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width  = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.src = url
  })
}

export default function ConsultaPage() {
  const [step, setStep]     = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<FormData>({
    nombre: '', dia: '', mes: '', anio: '', genero: '', fotoDataUrl: '',
  })
  const [returning, setReturning] = useState<string | null>(null)

  useEffect(() => {
    const sub = readSub()
    if (sub?.nombre) setReturning(sub.nombre.split(' ')[0])
  }, [])

  const signo      = form.dia && form.mes ? getSigno(parseInt(form.dia), parseInt(form.mes)) : null
  const datosSigno = signo ? getDatosSigno(signo) : null

  const TOTAL_STEPS = 5
  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100

  const nextStep = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS) as Step), [])
  const prevStep = useCallback(() => setStep((s) => Math.max(s - 1, 1) as Step), [])

  async function handleFotoFile(file: File) {
    if (!file.type.startsWith('image/')) return
    const dataUrl = await compressImage(file, 600)
    setForm((f) => ({ ...f, fotoDataUrl: dataUrl }))
  }

  async function handlePagar() {
    setLoading(true)
    try {
      const payload = {
        nombre:          form.nombre,
        fechaNacimiento: `${form.anio}-${form.mes.padStart(2,'0')}-${form.dia.padStart(2,'0')}`,
        genero:          form.genero,
        signo,
      }

      sessionStorage.setItem('oraculo_data', JSON.stringify(payload))
      if (form.fotoDataUrl) {
        sessionStorage.setItem('oraculo_foto', form.fotoDataUrl)
      } else {
        sessionStorage.removeItem('oraculo_foto')
      }

      // Returning subscriber: update stored data (localStorage + cookie) and go directly to resultado
      if (returning) {
        const existingSub = readSub()
        saveSub({
          nombre:          payload.nombre,
          fechaNacimiento: payload.fechaNacimiento,
          genero:          String(payload.genero),
          signo:           String(payload.signo || existingSub?.signo || ''),
          session_id:      existingSub?.session_id,
        })
        window.location.href = '/resultado'
        return
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.url)      window.location.href = data.url
      else if (data.redirect) window.location.href = data.redirect
    } catch {
      setLoading(false)
    }
  }

  const nombreOk = form.nombre.trim().length >= 2
  const fechaOk  = form.dia && form.mes && form.anio &&
                   parseInt(form.anio) >= 1930 && parseInt(form.anio) <= 2008
  const generoOk = form.genero !== ''

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080614' }}>
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
        <span className="text-oracle-dim text-xs tabular-nums">{step}/{TOTAL_STEPS}</span>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-10">
        {/* Returning subscriber banner */}
        {returning && (
          <div
            className="fixed top-[72px] inset-x-0 z-20 mx-auto max-w-md px-4"
          >
            <div
              className="oracle-border px-5 py-3 flex items-center justify-between gap-3"
              style={{ background: 'rgba(26,21,64,.95)', backdropFilter: 'blur(12px)' }}
            >
              <div>
                <p className="text-oracle-gold text-sm font-semibold">¡Bienvenida de nuevo, {returning}!</p>
                <p className="text-oracle-dim text-xs">Tu suscripción sigue activa</p>
              </div>
              <Link href="/resultado" className="btn-oracle px-4 py-2 text-xs whitespace-nowrap">
                Ver mi lectura →
              </Link>
            </div>
          </div>
        )}

        <div className="w-full max-w-md">

          {/* ── PASO 1 — Nombre ── */}
          {step === 1 && (
            <div className="animate-fade-up">
              <p className="text-oracle-teal text-xs tracking-[3px] uppercase mb-4">Paso 1 de {TOTAL_STEPS}</p>
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
                style={{ background: 'rgba(26,21,64,.8)', border: '1px solid rgba(242,168,0,.3)' }}
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

          {/* ── PASO 2 — Fecha ── */}
          {step === 2 && (
            <div className="animate-fade-up">
              <p className="text-oracle-teal text-xs tracking-[3px] uppercase mb-4">Paso 2 de {TOTAL_STEPS}</p>
              <h1 className="font-serif text-4xl text-oracle-gold text-glow-gold mb-3">
                ¿Cuándo naciste,<br/>{form.nombre.split(' ')[0]}?
              </h1>
              <p className="text-oracle-mid mb-8 leading-relaxed">
                Las estrellas en el momento de tu nacimiento revelan la vibración
                de tu alma gemela.
              </p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Día',  key: 'dia'  as const, placeholder: 'DD',   type: 'number', min: 1,    max: 31   },
                  { label: 'Año',  key: 'anio' as const, placeholder: 'AAAA', type: 'number', min: 1930, max: 2008 },
                ].map(({ label, key, placeholder, type, min, max }) => (
                  <div key={key} className={key === 'dia' ? '' : 'col-span-2'}>
                    <label className="text-oracle-dim text-xs uppercase tracking-wider mb-1.5 block">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      min={min} max={max}
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg text-oracle-text text-lg placeholder:text-oracle-dim focus:outline-none"
                      style={{ background: 'rgba(26,21,64,.8)', border: '1px solid rgba(242,168,0,.3)' }}
                    />
                  </div>
                ))}
              </div>

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
                    <option key={m} value={String(i + 1)} style={{ background: '#110D28' }}>{m}</option>
                  ))}
                </select>
              </div>

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
                <button onClick={prevStep} className="btn-oracle-outline flex-shrink-0">←</button>
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

          {/* ── PASO 3 — Género ── */}
          {step === 3 && (
            <div className="animate-fade-up">
              <p className="text-oracle-teal text-xs tracking-[3px] uppercase mb-4">Paso 3 de {TOTAL_STEPS}</p>
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
                    onClick={() => setForm((f) => ({ ...f, genero: opt.value }))}
                    className="oracle-border p-5 flex items-center gap-4 text-left transition-all duration-200 w-full"
                    style={{
                      background:   form.genero === opt.value ? 'rgba(242,168,0,.12)' : 'rgba(26,21,64,.6)',
                      borderColor:  form.genero === opt.value ? 'rgba(242,168,0,.7)'  : 'rgba(242,168,0,.2)',
                    }}
                  >
                    <span className="text-3xl" aria-hidden>{opt.emoji}</span>
                    <div>
                      <p className="text-oracle-text font-semibold">{opt.label}</p>
                      <p className="text-oracle-dim text-sm">{opt.desc}</p>
                    </div>
                    {form.genero === opt.value && <span className="ml-auto text-oracle-gold text-lg">✓</span>}
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

          {/* ── PASO 4 — Foto (nuevo) ── */}
          {step === 4 && (
            <div className="animate-fade-up">
              <p className="text-oracle-teal text-xs tracking-[3px] uppercase mb-4">Paso 4 de {TOTAL_STEPS}</p>
              <h1 className="font-serif text-4xl text-oracle-gold text-glow-gold mb-2">
                Sube tu foto
              </h1>
              <p className="text-oracle-mid mb-2 leading-relaxed">
                La ciencia confirma que las mejores parejas se parecen en el rostro.
                La Pitonisa usará tu foto para revelarte a quien el destino diseñó para ti.
              </p>
              <p className="text-oracle-dim text-xs mb-6 italic">
                Tu foto es privada — solo se usa para generar tu lectura.
              </p>

              {/* Upload zone */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFotoFile(file)
                }}
              />

              {form.fotoDataUrl ? (
                /* Preview */
                <div className="relative mx-auto mb-6" style={{ maxWidth: 260 }}>
                  <div
                    className="oracle-border overflow-hidden rounded-xl glow-gold"
                    style={{ aspectRatio: '3/4' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.fotoDataUrl}
                      alt="Tu foto"
                      className="w-full h-full object-cover"
                    />
                    {/* Mystical overlay */}
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(8,6,20,.6) 100%)' }}
                    />
                    <div className="absolute bottom-3 left-0 right-0 text-center">
                      <span className="text-oracle-gold text-xs tracking-widest uppercase">
                        ✨ La Pitonisa te ve
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setForm((f) => ({ ...f, fotoDataUrl: '' }))
                      if (fileRef.current) fileRef.current.value = ''
                    }}
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs"
                    style={{ background: 'rgba(26,21,64,1)', border: '1px solid rgba(242,168,0,.4)', color: '#A290C4' }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                /* Drop zone */
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragging(false)
                    const file = e.dataTransfer.files[0]
                    if (file) handleFotoFile(file)
                  }}
                  className="oracle-border rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 py-12 mb-6"
                  style={{
                    background:   dragging ? 'rgba(242,168,0,.08)' : 'rgba(26,21,64,.5)',
                    borderColor:  dragging ? 'rgba(242,168,0,.6)'  : 'rgba(242,168,0,.25)',
                    borderStyle:  'dashed',
                  }}
                >
                  <span className="text-4xl animate-float">📷</span>
                  <p className="text-oracle-mid text-sm text-center leading-snug px-4">
                    Toca aquí para subir tu selfie<br/>
                    <span className="text-oracle-dim text-xs">o arrastra la imagen</span>
                  </p>
                  <span
                    className="px-4 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(242,168,0,.12)', color: '#F2A800', border: '1px solid rgba(242,168,0,.3)' }}
                  >
                    Elegir foto
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={prevStep} className="btn-oracle-outline flex-shrink-0">←</button>
                <button
                  onClick={nextStep}
                  className="btn-oracle flex-1 justify-center"
                >
                  {form.fotoDataUrl ? 'Continuar →' : 'Continuar sin foto →'}
                </button>
              </div>

              {!form.fotoDataUrl && (
                <p className="text-center text-oracle-dim text-xs mt-3">
                  Sin foto la Pitonisa generará una imagen aleatoria
                </p>
              )}
            </div>
          )}

          {/* ── PASO 5 — Paywall ── */}
          {step === 5 && datosSigno && (
            <div className="animate-fade-up text-center">
              <p className="text-oracle-teal text-xs tracking-[3px] uppercase mb-6">Tu lectura está lista</p>

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

              {form.fotoDataUrl && (
                <div
                  className="flex items-center gap-2 justify-center mb-4 px-4 py-2 rounded-full mx-auto w-fit"
                  style={{ background: 'rgba(0,212,184,.1)', border: '1px solid rgba(0,212,184,.3)' }}
                >
                  <span className="text-sm">✓</span>
                  <span className="text-oracle-teal text-xs">Tu foto está lista para la revelación</span>
                </div>
              )}

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

              {returning ? (
                <div
                  className="oracle-border p-5 mb-6 text-center"
                  style={{ background: 'rgba(0,212,184,.06)', borderColor: 'rgba(0,212,184,.3)' }}
                >
                  <p className="text-oracle-teal text-sm font-semibold mb-1">✓ Suscripción activa</p>
                  <p className="text-oracle-mid text-sm">No se realizará ningún cargo adicional.</p>
                </div>
              ) : (
                <div className="oracle-border p-6 mb-6 text-center" style={{ background: 'rgba(26,21,64,.6)' }}>
                  <p className="text-oracle-dim text-xs uppercase tracking-wider mb-1">Suscripción mensual</p>
                  <p className="font-serif text-5xl text-oracle-gold text-glow-gold mb-1">$49</p>
                  <p className="text-oracle-dim text-sm mb-4">pesos mexicanos / mes · Cancela cuando quieras</p>
                  <ul className="text-left text-oracle-mid text-sm space-y-1.5 mb-2">
                    {[
                      form.fotoDataUrl ? '💞 Tu alma gemela generada con tu foto' : '💞 Imagen de tu alma gemela en HD',
                      '🃏 Lecturas de tarot ilimitadas',
                      '💑 Compatibilidad con tu crush',
                      '🌟 Lectura del día, todos los días',
                      '🖼️ Tarjetas para compartir en redes',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2"><span>{item}</span></li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={handlePagar}
                disabled={loading}
                className="btn-oracle btn-oracle-lg w-full justify-center disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⟳</span> Preparando tu lectura...
                  </span>
                ) : returning ? 'Ver mi lectura →' : 'Revelar a mi alma gemela →'}
              </button>

              {!returning && (
                <p className="mt-4 text-oracle-dim text-xs flex items-center justify-center gap-2">
                  🔒 Pago seguro vía Stripe · Sin compromisos
                </p>
              )}

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
