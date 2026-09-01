'use client'

import { useState, useEffect } from 'react'
import { SCHEDULE, MONTHS, CATEGORY_LABELS, type ScheduledVideo, type VideoCategory } from '@/lib/youtube-content'

const CAT_STYLE: Record<VideoCategory, string> = {
  e: 'bg-sky-100 text-sky-700',
  h: 'bg-purple-100 text-purple-700',
  c: 'bg-red-100 text-red-700',
  a: 'bg-green-100 text-green-700',
  s: 'bg-yellow-100 text-yellow-700',
}

const TODAY = '2026-09-01'

function getStatus(v: ScheduledVideo, uploaded: Set<number>) {
  if (uploaded.has(v.id)) return 'uploaded'
  if (v.date === TODAY) return 'today'
  return 'scheduled'
}

function StatusDot({ status }: { status: string }) {
  const base = 'w-2.5 h-2.5 rounded-full flex-shrink-0'
  if (status === 'today')     return <span className={`${base} bg-red-400 animate-pulse`} />
  if (status === 'uploaded')  return <span className={`${base} bg-green-500`} />
  return <span className={`${base} bg-sky-400`} />
}

function StatusBar({ status }: { status: string }) {
  if (status === 'today')    return <div className="h-1 w-full bg-red-400" />
  if (status === 'uploaded') return <div className="h-1 w-full bg-green-500" />
  return <div className="h-1 w-full bg-sky-400" />
}

function VideoCard({
  video, status, onClick,
}: {
  video: ScheduledVideo; status: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="relative bg-white border border-gray-100 rounded-xl overflow-hidden text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 w-full"
    >
      <StatusBar status={status} />
      <div
        className="aspect-video flex items-center justify-center text-5xl relative overflow-hidden"
        style={{ background: video.thumbGradient }}
      >
        <span className="relative z-10">{video.emoji}</span>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
        <span className="absolute bottom-1.5 left-2 text-white text-[10px] font-bold bg-black/60 rounded-full px-2 py-0.5 z-10">
          {video.dayLabel}
        </span>
        <span className="absolute bottom-1.5 right-2 text-white text-[10px] font-bold bg-black/60 rounded-full px-2 py-0.5 z-10">
          {video.duration}
        </span>
        {status === 'uploaded' && (
          <span className="absolute top-2 right-2 z-10 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow">✓</span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${CAT_STYLE[video.category]}`}>
            {video.categoryLabel}
          </span>
          <StatusDot status={status} />
        </div>
        <p className="font-bold text-[13px] leading-snug text-gray-800 mb-2">{video.title}</p>
        <div className="flex flex-wrap gap-1">
          {video.tags.slice(0,3).map(t => (
            <span key={t} className="text-[10px] text-gray-400 bg-gray-50 rounded-full px-2 py-0.5">#{t}</span>
          ))}
        </div>
      </div>
    </button>
  )
}

function Modal({
  video, status, onClose, onMarkUploaded,
}: {
  video: ScheduledVideo | null; status: string; onClose: () => void; onMarkUploaded: () => void
}) {
  if (!video) return null
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[88vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors z-10"
        >✕</button>
        <div
          className="aspect-video rounded-t-2xl flex items-center justify-center text-7xl relative overflow-hidden"
          style={{ background: video.thumbGradient }}
        >
          <span className="relative z-10">{video.emoji}</span>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/25" />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${CAT_STYLE[video.category]}`}>
              {video.categoryLabel}
            </span>
          </div>
          <h2 className="font-bold text-xl text-center text-gray-900 mb-1 leading-snug">{video.title}</h2>
          <p className="text-center text-gray-500 text-sm mb-4">{video.dayLabel} · {video.duration} min</p>
          <p className="text-sm text-gray-600 leading-relaxed bg-amber-50 rounded-xl p-4 mb-4">{video.description}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {video.tags.map(t => (
              <span key={t} className="text-xs bg-gray-100 text-gray-500 rounded-full px-3 py-1">#{t}</span>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onMarkUploaded}
              disabled={status === 'uploaded'}
              className="flex-1 py-3 rounded-xl font-semibold text-sm bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-default transition-colors"
            >
              {status === 'uploaded' ? '✓ Ya publicado' : '✓ Marcar como publicado'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function YouTubePage() {
  const [uploaded, setUploaded] = useState<Set<number>>(new Set())
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [tab, setTab] = useState<'calendar' | 'setup'>('calendar')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('joy_uploaded')
      if (raw) setUploaded(new Set(JSON.parse(raw) as number[]))
    } catch { /* ignore */ }
  }, [])

  function markUploaded(id: number) {
    const next = new Set([...uploaded, id])
    setUploaded(next)
    try { localStorage.setItem('joy_uploaded', JSON.stringify([...next])) } catch { /* ignore */ }
  }

  const selectedVideo = selectedId ? SCHEDULE.find(v => v.id === selectedId) ?? null : null
  const selectedStatus = selectedVideo ? getStatus(selectedVideo, uploaded) : 'scheduled'
  const uploadedCount = uploaded.size
  const nextVideo = SCHEDULE.filter(v => !uploaded.has(v.id) && v.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date))[0]

  return (
    <div className="min-h-screen" style={{ background: '#FFF9EE' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(110deg,#FFD340,#FFAA18)' }} className="sticky top-0 z-40 shadow-md border-b border-yellow-300/40">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-xl shadow-sm flex-shrink-0">❤️</div>
          <div>
            <div className="font-black text-[15px] text-yellow-950 leading-none">JoyMannersKids</div>
            <div className="text-[10px] text-yellow-800/60 font-medium">@JoyMannersKids · Canal para niños 2–5 años</div>
          </div>
          <div className="ml-auto flex gap-1">
            {(['calendar', 'setup'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  tab === t ? 'bg-yellow-950 text-white' : 'bg-black/10 text-yellow-950/70 hover:bg-black/15'
                }`}
              >
                {t === 'calendar' ? '📅 Calendario' : '⚙️ Configurar'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-6">
        {tab === 'calendar' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Videos programados', value: '24', sub: 'Sep – Nov 2026' },
                { label: 'Publicados', value: String(uploadedCount), sub: `de 24 videos` },
                { label: 'Frecuencia', value: '2×', sub: 'Martes y Viernes' },
                { label: 'Próxima subida', value: nextVideo ? (nextVideo.date === TODAY ? 'Hoy' : nextVideo.dayLabel.split(',')[0]) : '✓', sub: nextVideo ? nextVideo.title.substring(0, 28) + (nextVideo.title.length > 28 ? '…' : '') : '¡Todo publicado!' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-yellow-100 rounded-xl p-4 shadow-sm">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 mb-1">{s.label}</div>
                  <div className="font-black text-2xl text-gray-900 leading-none mb-1">{s.value}</div>
                  <div className="text-xs text-gray-400">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex gap-4 flex-wrap mb-5 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Hoy</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />Programado</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Publicado ✓</span>
            </div>

            {/* Months */}
            {MONTHS.map(month => {
              const videos = month.videoIds.map(id => SCHEDULE.find(v => v.id === id)!)
              return (
                <div key={month.label} className="mb-9">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="font-black text-lg text-gray-800">{month.label}</h2>
                    <span className="text-xs text-amber-600 bg-amber-50 rounded-full px-2.5 py-0.5 font-semibold">{videos.length} videos</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {videos.map(v => (
                      <VideoCard
                        key={v.id}
                        video={v}
                        status={getStatus(v, uploaded)}
                        onClick={() => setSelectedId(v.id)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        )}

        {tab === 'setup' && (
          <div className="max-w-2xl space-y-4">
            {[
              {
                n: 1, title: 'Horario de publicaciones',
                body: (
                  <>
                    <p>Tu canal publica <strong>2 videos por semana</strong>: cada <strong>Martes</strong> y cada <strong>Viernes</strong> a las <strong>10:00 AM (México)</strong>. Esta cadencia mantiene el algoritmo de YouTube Kids activo.</p>
                    <div className="mt-3 bg-amber-50 rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="font-semibold">📅 Martes</span><span className="text-gray-500">Subida #1 — 10:00 AM MX</span></div>
                      <div className="flex justify-between"><span className="font-semibold">📅 Viernes</span><span className="text-gray-500">Subida #2 — 10:00 AM MX</span></div>
                      <div className="flex justify-between"><span className="font-semibold">📊 Meta</span><span className="text-gray-500">8–10 min · Español · 2–5 años</span></div>
                    </div>
                  </>
                )
              },
              {
                n: 2, title: 'YouTube Data API v3',
                body: (
                  <>
                    <p>Para subidas automáticas, activa la API en Google Cloud Console:</p>
                    <pre className="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs leading-6 overflow-x-auto">{`1. console.cloud.google.com → Proyecto "JoyMannersKids"
2. APIs y servicios → Habilitar → YouTube Data API v3
3. Credenciales → OAuth 2.0 → Tipo: Aplicación web
4. Descarga credentials.json`}</pre>
                  </>
                )
              },
              {
                n: 3, title: 'Variables de entorno (.env)',
                body: (
                  <>
                    <p>Agrega en tu <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-800 text-xs">.env</code>:</p>
                    <pre className="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs leading-6 overflow-x-auto">{`YOUTUBE_CLIENT_ID=tu_client_id
YOUTUBE_CLIENT_SECRET=tu_client_secret
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxx`}</pre>
                  </>
                )
              },
              {
                n: 4, title: 'Thumbnail recomendado',
                body: (
                  <>
                    <p>YouTube Kids prioriza imágenes claras y atractivas:</p>
                    <pre className="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs leading-6 overflow-x-auto">{`Resolución: 1280 × 720 px (mín. 640px)
Formato:    JPG o PNG · máx 2 MB
Estilo:     Fondo de color brillante
Personajes: 1–2 grandes y centrados
Texto:      Nunito Bold, letras muy grandes`}</pre>
                  </>
                )
              },
            ].map(step => (
              <div key={step.n} className="bg-white border border-yellow-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-black text-yellow-950">{step.n}</div>
                  <h3 className="font-bold text-base text-gray-900">{step.title}</h3>
                </div>
                <div className="text-sm text-gray-600 leading-relaxed">{step.body}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedVideo && (
        <Modal
          video={selectedVideo}
          status={selectedStatus}
          onClose={() => setSelectedId(null)}
          onMarkUploaded={() => { markUploaded(selectedVideo.id); setSelectedId(null) }}
        />
      )}
    </div>
  )
}
