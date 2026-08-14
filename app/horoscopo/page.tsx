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
}[] = [
  { signo: 'aries',       nombre: 'Aries',       symbol: '♈', elemento: 'Fuego', fechas: '21 mar – 19 abr' },
  { signo: 'tauro',       nombre: 'Tauro',       symbol: '♉', elemento: 'Tierra', fechas: '20 abr – 20 may' },
  { signo: 'geminis',     nombre: 'Géminis',     symbol: '♊', elemento: 'Aire',  fechas: '21 may – 20 jun' },
  { signo: 'cancer',      nombre: 'Cáncer',      symbol: '♋', elemento: 'Agua',  fechas: '21 jun – 22 jul' },
  { signo: 'leo',         nombre: 'Leo',         symbol: '♌', elemento: 'Fuego', fechas: '23 jul – 22 ago' },
  { signo: 'virgo',       nombre: 'Virgo',       symbol: '♍', elemento: 'Tierra', fechas: '23 ago – 22 sep' },
  { signo: 'libra',       nombre: 'Libra',       symbol: '♎', elemento: 'Aire',  fechas: '23 sep – 22 oct' },
  { signo: 'escorpio',    nombre: 'Escorpio',    symbol: '♏', elemento: 'Agua',  fechas: '23 oct – 21 nov' },
  { signo: 'sagitario',   nombre: 'Sagitario',   symbol: '♐', elemento: 'Fuego', fechas: '22 nov – 21 dic' },
  { signo: 'capricornio', nombre: 'Capricornio', symbol: '♑', elemento: 'Tierra', fechas: '22 dic – 19 ene' },
  { signo: 'acuario',     nombre: 'Acuario',     symbol: '♒', elemento: 'Aire',  fechas: '20 ene – 18 feb' },
  { signo: 'piscis',      nombre: 'Piscis',      symbol: '♓', elemento: 'Agua',  fechas: '19 feb – 20 mar' },
]

// Deterministic "daily" prediction — seeded by signo + date so it changes each day
// but is the same for every visitor on the same day (good for caching / SEO)
function getDailyPrediction(signo: Signo, date: Date) {
  const day  = date.getDate()
  const mon  = date.getMonth()
  const idx  = SIGNOS_DATA.findIndex(s => s.signo === signo)

  const seed = (day * 37 + mon * 13 + idx * 7) % 100

  const AMOR = [
    'Una conexión inesperada llega a tu vida. Mantén el corazón abierto.',
    'El silencio entre tú y alguien especial habla más que mil palabras.',
    'Hoy es un día poderoso para expresar lo que sientes. No lo dejes pasar.',
    'Las estrellas favorecen los reencuentros. Alguien de tu pasado regresa.',
    'Una conversación sincera puede cambiar el rumbo de tu relación.',
    'Tu energía amorosa está en su punto más alto. Aprovéchala.',
    'Es momento de soltar expectativas y dejar que el amor fluya natural.',
    'Alguien te observa con más interés del que imaginas.',
    'Hoy la Pitonisa ve una sorpresa romántica muy cerca de ti.',
    'Tu intuición sobre esa persona especial es correcta. Confía en ella.',
    'Un pequeño gesto tuyo puede significar todo para quien te quiere.',
    'El amor que buscas fuera existe también dentro de ti. Encuéntralo primero.',
  ]

  const DINERO = [
    'Una oportunidad financiera aparece donde menos la esperabas.',
    'Evita gastos impulsivos hoy. La paciencia te traerá mayores recompensas.',
    'Un proyecto que dejaste a medias merece tu atención ahora.',
    'Las estrellas favorecen negociaciones y acuerdos económicos.',
    'Tu instinto financiero está afinado — confía en él para decidir.',
    'Hoy es buen día para revisar tus metas económicas del año.',
    'Una conversación de negocios puede abrirte puertas insospechadas.',
    'El dinero que das con generosidad regresa multiplicado.',
    'Cierra compromisos pendientes antes de abrir nuevos proyectos.',
    'Tu creatividad es tu mayor activo económico esta semana.',
    'Una inversión pequeña ahora puede generar grandes frutos pronto.',
    'La abundancia ya está en camino — solo sigue trabajando.',
  ]

  const SALUD = [
    'Tu cuerpo te pide descanso. Escúchalo antes de que lo exija con fuerza.',
    'Hoy es un día ideal para una caminata o actividad al aire libre.',
    'La meditación de cinco minutos puede transformar tu energía del día.',
    'Hidrátate y presta atención a lo que comes — tu cuerpo lo agradece.',
    'Una tensión en los hombros o cuello te avisa que cargues menos estrés.',
    'Tu energía física está en alza — aprovéchala para mover el cuerpo.',
    'El descanso de calidad esta noche es una inversión para mañana.',
    'Conectar con la naturaleza hoy te recarga de energía positiva.',
    'Tu sistema nervioso necesita menos estimulación digital hoy.',
    'Haz algo que te haga reír — es la medicina más poderosa del universo.',
    'Presta atención a las señales que tu cuerpo te manda. Son sabiduría.',
    'Un pequeño ritual de autocuidado esta noche eleva tu vibración.',
  ]

  const ENERGIA = ['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐⭐']

  const NUMERO = [7, 3, 11, 22, 5, 8, 17, 33, 1, 9, 44, 6]
  const COLOR  = ['Dorado', 'Rojo', 'Azul', 'Verde', 'Violeta', 'Blanco', 'Naranja', 'Rosa', 'Negro', 'Plateado', 'Turquesa', 'Índigo']

  return {
    amor:    AMOR[seed    % AMOR.length],
    dinero:  DINERO[(seed + idx * 3)  % DINERO.length],
    salud:   SALUD[(seed + idx * 5)   % SALUD.length],
    energia: ENERGIA[(seed + idx)     % ENERGIA.length],
    numero:  NUMERO[(seed + idx * 2)  % NUMERO.length],
    color:   COLOR[(seed + idx * 4)   % COLOR.length],
  }
}

function formatDate(d: Date) {
  return d.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export default function HoroscopoPage() {
  const today = new Date()
  const dateStr = formatDate(today)

  return (
    <div className="min-h-screen" style={{ background: '#080614' }}>
      <div className="fixed inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,.1) 0%, transparent 55%)',
      }} />

      {/* Header */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="text-oracle-dim hover:text-oracle-gold transition-colors text-sm">
          ← Inicio
        </Link>
        <span className="text-oracle-teal text-xs tracking-[2px] uppercase hidden sm:block">
          El Oráculo de la Pitonisa
        </span>
        <Link href="/consulta" className="btn-oracle text-xs px-4 py-2">
          Mi alma gemela →
        </Link>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-20 pt-4">

        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-oracle-teal text-xs tracking-[4px] uppercase mb-4">
            Predicción diaria
          </p>
          <h1
            className="font-serif text-4xl md:text-6xl text-oracle-gold text-glow-gold mb-4"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Horóscopo de hoy
          </h1>
          <p className="text-oracle-mid capitalize text-lg mb-2">
            {dateStr}
          </p>
          <p className="text-oracle-dim text-sm max-w-xl mx-auto">
            La Pitonisa ha consultado los astros. Descubre lo que las estrellas
            revelan para tu signo este día.
          </p>
        </div>

        {/* Sign grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {SIGNOS_DATA.map(({ signo, nombre, symbol, elemento, fechas }) => {
            const pred = getDailyPrediction(signo, today)

            return (
              <div
                key={signo}
                className="oracle-border p-6 flex flex-col gap-4"
                style={{ background: 'rgba(13,8,39,.6)' }}
              >
                {/* Sign header */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      background: 'radial-gradient(circle at 35% 35%, rgba(242,168,0,.2), rgba(8,6,20,.9))',
                      border: '1px solid rgba(242,168,0,.35)',
                    }}
                  >
                    {symbol}
                  </div>
                  <div>
                    <h2 className="text-oracle-gold font-serif text-xl leading-tight">{nombre}</h2>
                    <p className="text-oracle-dim text-xs">{elemento} · {fechas}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-oracle-dim mb-0.5">Energía</p>
                    <p className="text-sm leading-none">{pred.energia}</p>
                  </div>
                </div>

                {/* Predictions */}
                <div className="space-y-3">
                  <PredBlock icon="💞" label="Amor" text={pred.amor} />
                  <PredBlock icon="💰" label="Dinero" text={pred.dinero} />
                  <PredBlock icon="🌿" label="Salud" text={pred.salud} />
                </div>

                {/* Lucky items */}
                <div className="flex gap-3 mt-auto pt-2 border-t" style={{ borderColor: 'rgba(139,92,246,.2)' }}>
                  <div className="text-center flex-1">
                    <p className="text-oracle-dim text-[10px] uppercase tracking-wider mb-0.5">Número</p>
                    <p className="text-oracle-gold font-serif text-lg font-bold">{pred.numero}</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-oracle-dim text-[10px] uppercase tracking-wider mb-0.5">Color</p>
                    <p className="text-oracle-mid text-sm">{pred.color}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div
          className="oracle-border p-8 text-center max-w-xl mx-auto"
          style={{ background: 'rgba(26,21,64,.6)' }}
        >
          <div className="text-4xl mb-3">🔮</div>
          <h2 className="font-serif text-2xl text-oracle-gold mb-3">
            ¿Quieres saber más?
          </h2>
          <p className="text-oracle-mid text-sm mb-6">
            El horóscopo diario es solo el inicio. La Pitonisa puede revelarte
            el rostro de tu alma gemela — la persona que ya está escrita en tus estrellas.
          </p>
          <Link href="/consulta" className="btn-oracle btn-oracle-lg">
            Descubrir mi alma gemela →
          </Link>
          <p className="text-oracle-dim text-xs mt-4">
            Por solo $49 MXN/mes · Lectura personalizada completa
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-oracle-gold/10 py-8 text-center text-oracle-dim text-xs max-w-6xl mx-auto px-6">
        <p>
          <Link href="/" className="hover:text-oracle-gold transition-colors">Inicio</Link>
          {' · '}
          <Link href="/juego" className="hover:text-oracle-gold transition-colors">Rueda del Destino</Link>
          {' · '}
          <Link href="/chat" className="hover:text-oracle-gold transition-colors">Chat con la Pitonisa</Link>
        </p>
        <p className="mt-2">© 2026 El Oráculo de la Pitonisa · Solo entretenimiento</p>
      </footer>
    </div>
  )
}

function PredBlock({ icon, label, text }: { icon: string; label: string; text: string }) {
  return (
    <div className="flex gap-2.5 items-start">
      <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
      <div>
        <span className="text-oracle-dim text-[10px] uppercase tracking-wider mr-1">{label}:</span>
        <span className="text-oracle-mid text-sm leading-relaxed">{text}</span>
      </div>
    </div>
  )
}
