import Link from 'next/link'
import type { Metadata } from 'next'
import { Signo } from '@/lib/oracle'

export const metadata: Metadata = {
  title: 'Horóscopo de hoy 2026 — El Oráculo de la Pitonisa',
  description:
    'Descubre la predicción de hoy para tu signo zodiacal. ' +
    'Amor, dinero, salud y energía — revelado por la Pitonisa.',
  keywords: ['horóscopo', 'horoscopo hoy', 'predicción zodiacal', 'tarot', 'signo hoy'],
}

const SIGNOS_DATA: {
  signo: Signo
  nombre: string
  symbol: string
  elemento: string
  fechas: string
  color: string
}[] = [
  { signo: 'aries',       nombre: 'Aries',       symbol: '♈', elemento: 'Fuego', fechas: '21 mar – 19 abr', color: '#FF1744' },
  { signo: 'tauro',       nombre: 'Tauro',       symbol: '♉', elemento: 'Tierra', fechas: '20 abr – 20 may', color: '#69C16E' },
  { signo: 'geminis',     nombre: 'Géminis',     symbol: '♊', elemento: 'Aire',  fechas: '21 may – 20 jun', color: '#FFD740' },
  { signo: 'cancer',      nombre: 'Cáncer',      symbol: '♋', elemento: 'Agua',  fechas: '21 jun – 22 jul', color: '#40C4FF' },
  { signo: 'leo',         nombre: 'Leo',         symbol: '♌', elemento: 'Fuego', fechas: '23 jul – 22 ago', color: '#F2A800' },
  { signo: 'virgo',       nombre: 'Virgo',       symbol: '♍', elemento: 'Tierra', fechas: '23 ago – 22 sep', color: '#A5D6A7' },
  { signo: 'libra',       nombre: 'Libra',       symbol: '♎', elemento: 'Aire',  fechas: '23 sep – 22 oct', color: '#CE93D8' },
  { signo: 'escorpio',    nombre: 'Escorpio',    symbol: '♏', elemento: 'Agua',  fechas: '23 oct – 21 nov', color: '#8B1828' },
  { signo: 'sagitario',   nombre: 'Sagitario',   symbol: '♐', elemento: 'Fuego', fechas: '22 nov – 21 dic', color: '#FF7043' },
  { signo: 'capricornio', nombre: 'Capricornio', symbol: '♑', elemento: 'Tierra', fechas: '22 dic – 19 ene', color: '#90A4AE' },
  { signo: 'acuario',     nombre: 'Acuario',     symbol: '♒', elemento: 'Aire',  fechas: '20 ene – 18 feb', color: '#00BCD4' },
  { signo: 'piscis',      nombre: 'Piscis',      symbol: '♓', elemento: 'Agua',  fechas: '19 feb – 20 mar', color: '#7986CB' },
]

function getDailyPrediction(signo: Signo, date: Date) {
  const day  = date.getDate()
  const mon  = date.getMonth()
  const idx  = SIGNOS_DATA.findIndex(s => s.signo === signo)
  const seed = (day * 37 + mon * 13 + idx * 7) % 100

  const AMOR = [
    'Una conexión inesperada llega a tu vida. Mantén el corazón abierto y deja fluir.',
    'El silencio entre tú y alguien especial habla más que mil palabras hoy.',
    'Hoy es un día poderoso para expresar lo que sientes. No lo dejes pasar.',
    'Las estrellas favorecen los reencuentros. Alguien de tu pasado regresa.',
    'Una conversación sincera puede cambiar el rumbo de tu relación para siempre.',
    'Tu energía amorosa está en su punto más alto. Aprovéchala hoy.',
    'Es momento de soltar expectativas y dejar que el amor fluya de manera natural.',
    'Alguien te observa con más interés del que tú imaginas. Presta atención.',
    'Hoy la Pitonisa ve una sorpresa romántica muy cerca de ti. Espérala.',
    'Tu intuición sobre esa persona especial es correcta. Confía plenamente en ella.',
    'Un pequeño gesto tuyo puede significar todo para quien te quiere de verdad.',
    'El amor que buscas fuera existe también dentro de ti. Encuéntralo primero.',
  ]
  const DINERO = [
    'Una oportunidad financiera aparece donde menos la esperabas hoy.',
    'Evita gastos impulsivos hoy. La paciencia te traerá mayores recompensas.',
    'Un proyecto que dejaste a medias merece toda tu atención ahora mismo.',
    'Las estrellas favorecen negociaciones y acuerdos económicos importantes.',
    'Tu instinto financiero está muy afinado — confía en él para decidir hoy.',
    'Hoy es buen día para revisar tus metas económicas del año.',
    'Una conversación de negocios puede abrirte puertas insospechadas hoy.',
    'El dinero que das con generosidad regresa multiplicado a tu vida.',
    'Cierra compromisos pendientes antes de abrir nuevos proyectos.',
    'Tu creatividad es tu mayor activo económico esta semana.',
    'Una inversión pequeña ahora puede generar grandes frutos muy pronto.',
    'La abundancia ya está en camino — solo sigue trabajando con fe.',
  ]
  const SALUD = [
    'Tu cuerpo te pide descanso. Escúchalo antes de que lo exija con fuerza.',
    'Hoy es un día ideal para una caminata o actividad al aire libre.',
    'La meditación de cinco minutos puede transformar por completo tu energía del día.',
    'Hidrátate bien y presta atención a lo que comes — tu cuerpo lo agradece.',
    'Una tensión en los hombros o cuello te avisa que cargues menos estrés.',
    'Tu energía física está en alza — aprovéchala para mover el cuerpo.',
    'El descanso de calidad esta noche es una inversión valiosa para mañana.',
    'Conectar con la naturaleza hoy te recarga de energía positiva.',
    'Tu sistema nervioso necesita menos estimulación digital hoy.',
    'Haz algo que te haga reír — es la medicina más poderosa del universo.',
    'Presta atención a las señales que tu cuerpo te manda. Son sabiduría pura.',
    'Un pequeño ritual de autocuidado esta noche eleva tu vibración.',
  ]
  const ENERGIA_NIVEL = [5, 4, 5, 3, 4, 5, 3, 4, 5, 4, 3, 5]
  const NUMERO = [7, 3, 11, 22, 5, 8, 17, 33, 1, 9, 44, 6]
  const COLOR  = ['Dorado', 'Rojo', 'Azul', 'Verde', 'Violeta', 'Blanco', 'Naranja', 'Rosa', 'Negro', 'Plateado', 'Turquesa', 'Índigo']

  return {
    amor:    AMOR[seed    % AMOR.length],
    dinero:  DINERO[(seed + idx * 3)  % DINERO.length],
    salud:   SALUD[(seed + idx * 5)   % SALUD.length],
    energiaNivel: ENERGIA_NIVEL[(seed + idx) % ENERGIA_NIVEL.length],
    numero:  NUMERO[(seed + idx * 2)  % NUMERO.length],
    color:   COLOR[(seed + idx * 4)   % COLOR.length],
  }
}

function formatDate(d: Date) {
  return d.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function EnergyBar({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <div
            key={i}
            className="w-4 h-4 rounded-sm"
            style={{
              background: i <= level
                ? 'linear-gradient(135deg, #F2A800, #FF6B00)'
                : 'rgba(255,255,255,0.1)',
              boxShadow: i <= level ? '0 0 6px rgba(242,168,0,0.6)' : 'none',
            }}
          />
        ))}
      </div>
      <span className="text-oracle-dim text-sm">{level}/5</span>
    </div>
  )
}

export default function HoroscopoPage() {
  const today = new Date()
  const dateStr = formatDate(today)

  return (
    <div className="min-h-screen" style={{ background: '#080614' }}>
      <div className="fixed inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,.12) 0%, transparent 55%)',
      }} />

      {/* Header */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="text-oracle-dim hover:text-oracle-gold transition-colors">
          ← Inicio
        </Link>
        <Link href="/consulta" className="btn-oracle px-5 py-2.5">
          Mi alma gemela →
        </Link>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-5 pb-24 pt-2">

        {/* Hero */}
        <div className="text-center mb-12">
          <p className="text-oracle-teal text-xs tracking-[4px] uppercase mb-4">Predicción diaria</p>
          <h1 className="font-serif text-5xl md:text-7xl text-oracle-gold text-glow-gold mb-4">
            Horóscopo de hoy
          </h1>
          <p className="text-oracle-mid capitalize text-xl mb-2">{dateStr}</p>
          <p className="text-oracle-dim max-w-lg mx-auto leading-relaxed">
            La Pitonisa ha consultado los astros. Elige tu signo y descubre
            lo que las estrellas tienen para ti hoy.
          </p>
        </div>

        {/* Sign list — one column, large cards */}
        <div className="flex flex-col gap-6 mb-16">
          {SIGNOS_DATA.map(({ signo, nombre, symbol, elemento, fechas, color }) => {
            const pred = getDailyPrediction(signo, today)

            return (
              <div
                key={signo}
                className="oracle-border overflow-hidden"
                style={{ background: 'rgba(10,6,30,.8)' }}
              >
                {/* Sign header strip */}
                <div
                  className="px-6 py-5 flex items-center gap-4"
                  style={{
                    background: `linear-gradient(135deg, rgba(${hexToRgb(color)},.12) 0%, transparent 60%)`,
                    borderBottom: `1px solid rgba(${hexToRgb(color)},.2)`,
                  }}
                >
                  {/* Big symbol */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, rgba(${hexToRgb(color)},.25), rgba(8,6,20,.95))`,
                      border: `1px solid rgba(${hexToRgb(color)},.4)`,
                      boxShadow: `0 0 20px rgba(${hexToRgb(color)},.15)`,
                    }}
                  >
                    {symbol}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-serif text-3xl text-oracle-gold leading-none mb-1">{nombre}</h2>
                    <p className="text-oracle-dim">{elemento} · {fechas}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-oracle-dim text-xs uppercase tracking-wider mb-2">Energía del día</p>
                    <EnergyBar level={pred.energiaNivel} />
                  </div>
                </div>

                {/* Predictions */}
                <div className="p-6 grid md:grid-cols-3 gap-5">
                  <PredCard icon="💞" label="Amor" text={pred.amor} accent={color} />
                  <PredCard icon="💰" label="Dinero" text={pred.dinero} accent={color} />
                  <PredCard icon="🌿" label="Salud" text={pred.salud} accent={color} />
                </div>

                {/* Lucky row */}
                <div
                  className="px-6 py-4 flex items-center gap-6 flex-wrap"
                  style={{ borderTop: '1px solid rgba(139,92,246,.15)', background: 'rgba(0,0,0,.2)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-oracle-dim text-sm">🔢 Número de la suerte:</span>
                    <span className="text-oracle-gold font-serif font-bold text-xl">{pred.numero}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-oracle-dim text-sm">🎨 Color del día:</span>
                    <span className="text-oracle-mid font-semibold">{pred.color}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div
          className="oracle-border p-10 text-center"
          style={{ background: 'rgba(26,21,64,.7)' }}
        >
          <div className="text-5xl mb-4">🔮</div>
          <h2 className="font-serif text-3xl text-oracle-gold mb-4">
            ¿Quieres saber más?
          </h2>
          <p className="text-oracle-mid mb-8 text-lg max-w-md mx-auto leading-relaxed">
            El horóscopo diario es solo el inicio. La Pitonisa puede revelar
            el rostro de tu alma gemela — la persona escrita en tus estrellas.
          </p>
          <Link href="/consulta" className="btn-oracle btn-oracle-lg">
            Descubrir mi alma gemela →
          </Link>
          <p className="text-oracle-dim text-sm mt-4">
            Por solo $49 MXN/mes · Lectura personalizada completa
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-oracle-gold/10 py-8 text-center text-oracle-dim max-w-4xl mx-auto px-6">
        <p className="mb-2">
          <Link href="/" className="hover:text-oracle-gold transition-colors">Inicio</Link>
          {' · '}
          <Link href="/energias" className="hover:text-oracle-gold transition-colors">¿Tienes una maldición?</Link>
          {' · '}
          <Link href="/juego" className="hover:text-oracle-gold transition-colors">Rueda del Destino</Link>
          {' · '}
          <Link href="/chat" className="hover:text-oracle-gold transition-colors">Chat con la Pitonisa</Link>
        </p>
        <p>© 2026 El Oráculo de la Pitonisa · Solo entretenimiento</p>
      </footer>
    </div>
  )
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

function PredCard({ icon, label, text, accent }: { icon: string; label: string; text: string; accent: string }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: `rgba(${hexToRgb(accent)},.06)`, border: `1px solid rgba(${hexToRgb(accent)},.15)` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-oracle-gold font-semibold text-sm uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-oracle-mid leading-relaxed">{text}</p>
    </div>
  )
}
