'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const RITUALES = [
  {
    id: 'huevo',
    nombre: 'La Limpia del Huevo',
    icon: '🥚',
    dificultad: 1,
    tiempo: '15 min × 3 días',
    descripcion: 'El huevo crudo absorbe energías negativas como una esponja. Técnica básica del curanderismo mexicano — la primera que cualquier curandera te recetaría.',
    ingredientes: [
      'Un huevo fresco de rancho (o de libre pastoreo, nunca de refrigerador)',
      'Un vaso de vidrio transparente',
      'Agua fría del grifo',
      'Sal gruesa de grano',
    ],
    pasos: [
      'Deja el huevo a temperatura ambiente al menos 2 horas antes de comenzar.',
      'Párate descalza en el centro de tu cuarto. Toma el huevo con tu mano dominante.',
      'Empieza por la coronilla. Baja el huevo lentamente en movimientos circulares sin despegarlo del cuerpo.',
      'Detente en la nuca, hombros, pecho, vientre y planta de los pies — donde la energía se acumula.',
      'Mientras lo haces, repite en voz baja: "Lo que no es mío, te lo devuelvo. Lo que es mío, lo reclamo."',
      'Llena el vaso con agua fría y una cucharada generosa de sal gruesa.',
      'Rompe el huevo dentro sin revolver. Observa: hilos que suben indican trabajo de brujería; burbujas, envidia activa; yema opaca, mal de ojo intenso.',
      'Cierra los ojos. Vacía el vaso por el drenaje del baño sin volver a mirarlo. Di: "Listo está."',
    ],
    nota: 'Si al abrir el huevo huele a azufre o putrefacción, el trabajo en tu contra era poderoso. Repite el ritual exactamente tres noches seguidas, siempre antes de dormir.',
  },
  {
    id: 'cilantro',
    nombre: 'El Golpe del Cilantro',
    icon: '🌿',
    dificultad: 1,
    tiempo: '10 minutos',
    descripcion: 'El cilantro fresco corta el mal de ojo y las energías pegadas. Ritual rápido para noches en que sientes que algo no está bien.',
    ingredientes: [
      'Un ramo grande de cilantro fresco — que nadie más lo toque desde que lo compras',
      'Ropa cómoda o piyama',
    ],
    pasos: [
      'A medianoche o cerca de ella, párate en el centro de tu hogar.',
      'Sostén el ramo con ambas manos. Cierra los ojos y piensa en lo que quieres limpiar.',
      'Golpéate suavemente con el ramo desde los hombros hasta los pies, pasando por el centro del cuerpo.',
      'Golpea también la espalda con el ramo pasándolo por encima de los hombros.',
      'Recita tres veces: "Que se vaya lo ajeno. Que vuelva lo mío."',
      'Abre la puerta principal y sacude el ramo fuera de tu casa con fuerza, como si estuvieras sacudiendo polvo.',
      'Envuelve el cilantro en papel de periódico y tíralo en un bote de basura lejos de tu casa.',
      'No mires hacia atrás cuando salgas a tirar el ramo.',
    ],
    nota: 'Este ritual es especialmente potente si lo haces en martes o viernes, que son días de alta energía espiritual en la tradición.',
  },
  {
    id: 'bano-hierbas',
    nombre: 'El Baño de las Siete Hierbas',
    icon: '🛁',
    dificultad: 2,
    tiempo: '45 minutos',
    descripcion: 'Limpia profunda del campo áurico. Las hierbas combinadas cortan ataduras, limpian envidias y refuerzan la protección personal.',
    ingredientes: [
      'Ruda (la hierba protectora por excelencia)',
      'Romero fresco',
      'Albahaca',
      'Perejil',
      'Manzanilla',
      'Lavanda seca',
      'Canela en rama × 2',
      'Jugo de 7 limones',
      '3 cucharadas de sal de grano',
    ],
    pasos: [
      'Hierve 2 litros de agua. Agrega todas las hierbas y la canela.',
      'Deja hervir 10 minutos a fuego bajo. Luego apaga y deja reposar tapado hasta que enfríe.',
      'Agrega el jugo de los 7 limones y la sal de grano. Mezcla con una cuchara de madera.',
      'Báñate normalmente primero — el baño de hierbas va al final.',
      'De pie en la tina o regadera, vierte la preparación lentamente sobre tu cabeza.',
      'Déjala escurrir por todo tu cuerpo. No uses jabón después de esto.',
      'No te seques con toalla — deja que el cuerpo absorba las hierbas mientras te secas al aire.',
      'Viste ropa blanca o clara inmediatamente después.',
    ],
    nota: 'Realiza este baño tres viernes seguidos al atardecer. El viernes es el día de Venus — máxima potencia para rituales de amor y protección.',
  },
  {
    id: 'sal-rincones',
    nombre: 'La Sal de los Cuatro Rincones',
    icon: '🧂',
    dificultad: 1,
    tiempo: '5 minutos de preparación · 3 días de efecto',
    descripcion: 'La sal gruesa absorbe y neutraliza energías estancadas. Ritual de limpieza del hogar que la Pitonisa recomienda hacer al menos cada luna nueva.',
    ingredientes: [
      'Sal gruesa de grano (un kilo mínimo)',
      'Una escoba que uses solo para limpiezas espirituales',
      'Bolsa negra de plástico',
    ],
    pasos: [
      'Pon un puñado generoso de sal en cada uno de los cuatro rincones de tu habitación principal.',
      'Traza una línea de sal en el umbral de la puerta de entrada de tu hogar — de pared a pared.',
      'Si hay zonas donde sientes la energía más pesada, pon sal también ahí.',
      'Deja la sal en su lugar exactamente 3 días y 3 noches — no la toques.',
      'Al cuarto día, con la escoba, barre la sal siempre en dirección hacia la puerta: de adentro hacia afuera.',
      'Recoge la sal en la bolsa negra sin tocarla con las manos.',
      'Tira la bolsa fuera de tu propiedad, en un contenedor que no sea el tuyo.',
      'Lava la escoba con agua y gotas de limón antes de guardarla.',
    ],
    nota: 'Si al recoger la sal la notas mojada, pegajosa o de color diferente al original, era mucha la energía que absorbió. Repite el ritual esa misma semana.',
  },
  {
    id: 'muneco',
    nombre: 'El Muñeco de Retorno',
    icon: '🪡',
    dificultad: 3,
    tiempo: '1 hora de elaboración',
    descripcion: 'Para cuando identificas a quien te ha hecho daño. No es para causar mal — es para devolver la energía a su origen y protegerte de futuros ataques.',
    ingredientes: [
      'Tela oscura (negro o morado), aproximadamente 30×20 cm',
      'Aguja e hilo rojo',
      'Sal gruesa para rellenar',
      'Un papel con tu nombre escrito con tu letra',
      'Un papel con el nombre de quien te hizo daño (si lo sabes)',
      'Un espejo pequeño (de bolso)',
      'Hilo negro para coser los ojos',
    ],
    pasos: [
      'Corta la tela en forma de muñeco simple — no necesita ser elaborado, solo reconocible.',
      'Cose el cuerpo dejando la cabeza abierta.',
      'Rellena el cuerpo con sal gruesa. Esta sal protegerá tu energía.',
      'Mete adentro el papel con tu nombre (para que el muñeco te represente y te proteja).',
      'Opcionalmente, mete el papel con el nombre de quien te hizo daño con una nota: "Tu energía regresa a ti."',
      'Cose la cabeza. Luego cósele los ojos con hilo negro — esto ciega al trabajo en tu contra.',
      'Pega el espejo pequeño en el pecho del muñeco hacia afuera: todo lo negativo que llegue, el espejo lo devuelve.',
      'Guárdalo bajo tu cama, del lado donde duermes. Cuando ya no lo necesites, desármalo y entierra los materiales.',
    ],
    nota: 'Este ritual es de protección y retorno, no de daño. La intención lo es todo — si lo haces desde el miedo o el rencor, el efecto se debilita. Hazlo desde la calma y la certeza de tu protección.',
  },
  {
    id: 'limon',
    nombre: 'El Limón de las Cuatro Esquinas',
    icon: '🍋',
    dificultad: 1,
    tiempo: '5 minutos',
    descripcion: 'Los limones son absorbentes naturales de energías pesadas. Ritual sencillo y efectivo para cuando entras a un espacio nuevo o sientes que trajiste algo de afuera.',
    ingredientes: [
      '4 limones verdes frescos',
      '4 clavos de olor (los de la cocina)',
      'Sal fina',
    ],
    pasos: [
      'Parte cada limón a la mitad. Espolvorea sal fina en la parte expuesta.',
      'Clava un clavo de olor en el centro de cada mitad.',
      'Coloca un limón partido en cada esquina de tu habitación, con la parte expuesta hacia arriba.',
      'Deja que trabajen 48 horas. No los muevas.',
      'A las 48 horas, míralos: si están marchitos, secos o arrugados, absorbieron energía negativa.',
      'Recógelos con una hoja de periódico sin tocarlos directamente con las manos.',
      'Tíralos en un bote de basura que no sea el de tu casa.',
      'Repite cada vez que sientas el ambiente de tu cuarto pesado o después de recibir visitas.',
    ],
    nota: 'Si al ir a recogerlos los encuentras completamente negros o con moho inusual en 48 horas, la carga era mayor de lo esperado. Repite el ritual usando limones con chile en polvo la próxima vez.',
  },
  {
    id: 'copal',
    nombre: 'La Limpia de Copal',
    icon: '🌫️',
    dificultad: 2,
    tiempo: '30 minutos',
    descripcion: 'El copal se ha usado en Mesoamérica durante siglos para purificar espacios y personas. Su humo disuelve lo que no pertenece a un lugar.',
    ingredientes: [
      'Copal en resina (no el de palito — la resina pura)',
      'Un recipiente de barro o metal para quemar la resina',
      'Un carbón para sahumerio',
    ],
    pasos: [
      'Abre todas las ventanas de tu hogar antes de comenzar — lo negativo necesita salida.',
      'Enciende el carbón hasta que esté al rojo. Colócalo en el recipiente de barro.',
      'Pon un trozo de resina de copal sobre el carbón. Empezará a humear.',
      'Camina por cada cuarto llevando el sahumerio. Mueve el humo con la mano hacia los rincones.',
      'Pasa el humo debajo de camas y muebles — ahí se acumula lo que no queremos ver.',
      'Lleva el humo hacia el interior de los closets y cajones.',
      'Muévete siempre en sentido contrario a las manecillas del reloj para deshacer trabajos.',
      'Al terminar, sal al exterior de tu hogar y quema el último trozo frente a la puerta de entrada.',
      'Di: "Lo que no sirve, fuera. Lo que protege, adentro."',
    ],
    nota: 'El copal con mirra tiene el doble de potencia para trabajos de protección. El copal blanco es ideal para limpias de amor y reconciliación.',
  },
  {
    id: 'agua-florida',
    nombre: 'El Agua Florida con Siete Nudos',
    icon: '💧',
    dificultad: 2,
    tiempo: '20 minutos',
    descripcion: 'El Agua Florida peruana y el ritual de los nudos combinados crean una de las limpias más completas que existen. Usada por espiritistas y curanderas de toda Latinoamérica.',
    ingredientes: [
      'Un frasco de Agua Florida (la de la botella verde, tradicional peruana)',
      'Un listón rojo de 60 cm de largo',
      'Tijeras limpias',
      'Agua bendita (opcional pero potencia el ritual)',
    ],
    pasos: [
      'Toma el listón rojo entre ambas manos. Cierra los ojos.',
      'Piensa en cada persona que creas que te desea mal. Por cada una, ata un nudo en el listón.',
      'Ata 7 nudos en total — el siete es el número de la protección espiritual.',
      'Lleva el listón anudado fuera de tu casa. Entiérralo en tierra — no en una maceta, en tierra real.',
      'Regresa a casa sin mirar hacia atrás.',
      'Mezcla el Agua Florida con un chorro de agua bendita en un recipiente.',
      'Báñate normalmente. Al terminar, aplica la mezcla de Florida en: muñecas, nuca, frente y planta de los pies.',
      'No te enjuagues. Deja que se absorba sola.',
    ],
    nota: 'Si no tienes agua bendita, puedes hacer la tuya: llena un vaso con agua, ponle una cruz dibujada en papel debajo, y déjalo 3 horas al sol antes de usarla.',
  },
  {
    id: 'vela-negra',
    nombre: 'La Vela Negra del Retorno',
    icon: '🕯️',
    dificultad: 2,
    tiempo: '30 minutos',
    descripcion: 'La vela negra no es de daño — es de corte y retorno. Corta el hilo que une un trabajo en tu contra con quien lo envió, y devuelve la energía a su origen.',
    ingredientes: [
      'Una vela negra (sin fragancia, lisa)',
      'Un papel y pluma',
      'Un plato de barro o cerámica',
      'Sal gruesa',
      'Un vaso de agua',
    ],
    pasos: [
      'En el papel, escribe lo que quieres cortar: puede ser un nombre, una situación o simplemente "todo lo que no me pertenece."',
      'Pon el papel debajo del plato. Sobre el plato, forma un círculo pequeño de sal gruesa.',
      'Coloca la vela en el centro del círculo de sal.',
      'Enciende la vela. Observa la llama por 3 minutos sin hablar.',
      'Di en voz alta: "Lo que vino con intención de daño, regresa a quien lo envió. Yo me quedo limpia."',
      'Pasa el papel por el costado de la llama tres veces sin quemarlo completamente.',
      'Quema el papel en la llama de la vela. Deja que las cenizas caigan en el plato.',
      'Cuando la vela se consuma (o la apagues echando agua, nunca soplando), entierra las cenizas del papel en tierra.',
    ],
    nota: 'Nunca apagues una vela de ritual soplando — el aire de tu boca lleva tu energía y puede revertir el efecto. Usa siempre agua o un apagavelas.',
  },
  {
    id: 'escoba',
    nombre: 'La Escoba Guardiana',
    icon: '🧹',
    dificultad: 2,
    tiempo: '45 minutos',
    descripcion: 'Una escoba nueva, consagrada y colocada estratégicamente se convierte en guardiana del hogar. Este ritual protege la entrada de tu casa de energías y personas que traen malas intenciones.',
    ingredientes: [
      'Una escoba nueva que nadie haya usado — nunca compartas esta escoba para barrer el suelo',
      'Aceite de ruda o aceite de oliva puro',
      'Sal gruesa',
      'Un listón rojo de 30 cm',
    ],
    pasos: [
      'La escoba nueva nunca debe tocar el suelo para barrer ordinariamente — es solo para este ritual.',
      'Unta el mango de la escoba con aceite de ruda o aceite de oliva, frotando de abajo hacia arriba.',
      'Espolvorea sal gruesa entre las cerdas de la escoba.',
      'Barre toda tu casa empezando por el cuarto más alejado, avanzando siempre hacia la puerta principal.',
      'Barre siempre de adentro hacia afuera — nunca hacia adentro.',
      'Al llegar a la puerta principal, barre el umbral con especial cuidado.',
      'Ata el listón rojo al mango de la escoba — tres nudos bien apretados.',
      'Coloca la escoba detrás de la puerta principal, con las cerdas hacia arriba.',
      'Esta escoba ahora guarda tu entrada: las malas intenciones no pueden pasar donde ella vigila.',
    ],
    nota: 'Si en algún momento encuentras la escoba caída sin que nadie la haya tirado, significa que rechazó una energía intensa. Ponla de pie y agradécele.',
  },
  {
    id: 'espejo',
    nombre: 'El Espejo Absorbente',
    icon: '🪞',
    dificultad: 3,
    tiempo: '1 semana completa',
    descripcion: 'Los espejos tienen la capacidad de atrapar y neutralizar energías cuando se preparan correctamente. Este ritual de una semana es uno de los más poderosos para limpiezas profundas.',
    ingredientes: [
      'Un espejo mediano que no uses habitualmente',
      'Una vela blanca',
      'Una tela oscura para cubrir el espejo',
      'Sal gruesa',
      'Agua de rosas',
    ],
    pasos: [
      'Limpia el espejo con agua de rosas. Sécalo con un paño limpio.',
      'Pon la vela blanca encendida frente al espejo, a 30 cm de distancia.',
      'La noche del primer día, párate frente al espejo y mira tu reflejo a los ojos por 5 minutos.',
      'Visualiza una luz blanca que emana de tu pecho y se expande hacia el espejo.',
      'Todo lo oscuro, todo lo pesado, imagínalo entrando al espejo.',
      'Al terminar, cubre el espejo con la tela oscura. No lo descubras hasta el día siguiente.',
      'Cada mañana, descúbrelo al amanecer — la luz del día disuelve lo que absorbió.',
      'Repite cada noche durante 7 días.',
      'Al séptimo día, saca el espejo de tu hogar y ponlo en otro lugar — lo que absorbió, se queda ahí.',
    ],
    nota: 'Nunca dejes un espejo sin cubrir de noche en tu habitación si estás haciendo una limpia activa. Los espejos trabajan incluso mientras dormimos.',
  },
  {
    id: 'siete-velas',
    nombre: 'El Círculo de las Siete Velas',
    icon: '🕯️',
    dificultad: 3,
    tiempo: '2 horas',
    descripcion: 'Las siete velas de colores forman un escudo energético completo alrededor de quien se sienta en el centro. Ritual de protección activa usada en espiritismo y santería popular.',
    ingredientes: [
      '7 velas de distintos colores: blanca, morada, roja, verde, naranja, amarilla, azul',
      'Un espacio seguro en el suelo',
    ],
    pasos: [
      'Forma un círculo de aproximadamente un metro de diámetro en el suelo con las velas.',
      'Colócalas en este orden (en sentido de las manecillas del reloj): blanca (norte), azul, morada, roja, naranja, amarilla, verde.',
      'Enciéndelas en el mismo orden de las manecillas del reloj, empezando por la blanca.',
      'Siéntate en el centro del círculo de velas con las piernas cruzadas.',
      'Cierra los ojos. Imagina la luz de cada vela formando un muro de su color a tu alrededor.',
      'Respira profundo. Siente cómo los siete escudos se fusionan en uno solo.',
      'Permanece en silencio dentro del círculo entre 15 y 30 minutos.',
      'Sal del círculo sin apagar las velas — deja que se consuman solas o apágalas con agua en el mismo orden en que las encendiste.',
    ],
    nota: 'Este ritual no debe hacerse si estás en estado emocional muy alterado — la energía que proyectas amplifica lo que sientes. Hazlo cuando estés en calma, aunque sea relativa.',
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

function DificultadStars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3].map(i => (
        <span key={i} style={{ color: i <= n ? '#F2A800' : 'rgba(242,168,0,.2)', fontSize: 12 }}>★</span>
      ))}
    </span>
  )
}

function RitualCard({ r, idx, isPremium }: { r: typeof RITUALES[0]; idx: number; isPremium: boolean }) {
  const [open, setOpen] = useState(false)
  const colors: Record<number, string> = {
    1: '#4ADE80',
    2: '#F59E0B',
    3: '#EF4444',
  }
  const levelLabel: Record<number, string> = {
    1: 'Fácil',
    2: 'Intermedio',
    3: 'Avanzado',
  }

  return (
    <div style={{
      border: '1px solid rgba(180,40,40,.3)',
      borderRadius: 12,
      background: 'linear-gradient(135deg, rgba(50,0,10,.7), rgba(20,0,20,.85))',
      overflow: 'hidden',
    }}>
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left p-5"
        style={{ cursor: 'pointer' }}
      >
        <div className="flex items-start gap-4">
          <span className="text-4xl shrink-0">{r.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-oracle-dim text-xs tracking-widest">RITUAL {idx + 1}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{
                background: `rgba(${r.dificultad === 1 ? '74,222,128' : r.dificultad === 2 ? '245,158,11' : '239,68,68'},.1)`,
                color: colors[r.dificultad],
                border: `1px solid rgba(${r.dificultad === 1 ? '74,222,128' : r.dificultad === 2 ? '245,158,11' : '239,68,68'},.25)`,
              }}>
                {levelLabel[r.dificultad]}
              </span>
              {!isPremium && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{
                  background: 'rgba(242,168,0,.1)',
                  color: '#F2A800',
                  border: '1px solid rgba(242,168,0,.25)',
                }}>
                  🔒 Premium
                </span>
              )}
            </div>
            <h3 className="font-serif text-xl mb-1" style={{ color: '#FFB3B3' }}>{r.nombre}</h3>
            <p className="text-oracle-mid text-sm leading-relaxed">{r.descripcion}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <span className="text-oracle-dim text-xs">Potencia:</span>
                <DificultadStars n={r.dificultad} />
              </div>
              <span className="text-oracle-dim text-xs">⏱ {r.tiempo}</span>
            </div>
          </div>
          <span className="text-oracle-dim text-lg shrink-0 mt-1">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Expanded: paywall for free users */}
      {open && !isPremium && (
        <div className="px-5 pb-6 border-t" style={{ borderColor: 'rgba(180,40,40,.2)' }}>
          {/* Blurred preview */}
          <div className="mt-5 mb-4 relative rounded-xl overflow-hidden">
            <div style={{ filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(255,177,177,.5)' }}>
                Necesitas
              </p>
              <ul className="space-y-1.5 mb-4">
                {r.ingredientes.slice(0, 3).map((item, i) => (
                  <li key={i} className="text-oracle-mid text-sm flex items-start gap-2">
                    <span style={{ color: '#F2A800', marginTop: 2, flexShrink: 0 }}>·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(255,177,177,.5)' }}>
                Pasos del ritual
              </p>
              {r.pasos.slice(0, 2).map((paso, i) => (
                <div key={i} className="flex gap-3 items-start mb-2">
                  <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(180,40,40,.3)', color: '#FFB3B3' }}>
                    {i + 1}
                  </span>
                  <span className="text-oracle-mid text-sm">{paso}</span>
                </div>
              ))}
            </div>
            {/* lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl" style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(30,0,15,.92) 35%)',
            }}>
              <span className="text-3xl mb-2">🔒</span>
              <p className="font-serif text-base mb-1" style={{ color: '#FFB3B3' }}>Ritual completo</p>
              <p className="text-oracle-dim text-xs text-center max-w-[220px] leading-relaxed">
                {r.ingredientes.length} ingredientes · {r.pasos.length} pasos · Nota de la Pitonisa
              </p>
            </div>
          </div>

          {/* Subscription CTA */}
          <div className="rounded-xl p-4 text-center" style={{
            background: 'linear-gradient(135deg, rgba(30,20,8,.9), rgba(13,8,39,.95))',
            border: '1px solid rgba(242,168,0,.3)',
          }}>
            <p className="text-oracle-gold font-semibold text-sm mb-1">
              Desbloquea el ritual completo
            </p>
            <p className="text-oracle-dim text-xs mb-3 leading-relaxed">
              Accede a los {RITUALES.length} rituales del grimorio con todos los ingredientes, pasos e instrucciones exactas de la Pitonisa.
            </p>
            <Link
              href="/consulta"
              className="btn-oracle block w-full text-center text-sm"
              style={{ padding: '12px 20px' }}
            >
              👑 Activar suscripción · $49 MXN/mes
            </Link>
          </div>
        </div>
      )}

      {/* Expanded: full content for subscribers */}
      {open && isPremium && (
        <div className="px-5 pb-6 border-t" style={{ borderColor: 'rgba(180,40,40,.2)' }}>
          {/* Ingredientes */}
          <div className="mt-5 mb-4">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(255,177,177,.5)' }}>
              Necesitas
            </p>
            <ul className="space-y-1.5">
              {r.ingredientes.map((item, i) => (
                <li key={i} className="text-oracle-mid text-sm flex items-start gap-2">
                  <span style={{ color: '#F2A800', marginTop: 2, flexShrink: 0 }}>·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pasos */}
          <div className="mb-4">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(255,177,177,.5)' }}>
              Pasos del ritual
            </p>
            <ol className="space-y-3">
              {r.pasos.map((paso, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(180,40,40,.3)', color: '#FFB3B3', marginTop: 1 }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-oracle-mid text-sm leading-relaxed">{paso}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Nota de la Pitonisa */}
          <div className="rounded-xl p-4" style={{
            background: 'rgba(147,51,234,.07)',
            border: '1px solid rgba(147,51,234,.2)',
          }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'rgba(147,51,234,.7)' }}>
              🔮 Nota de la Pitonisa
            </p>
            <p className="text-oracle-dim text-sm leading-relaxed italic">{r.nota}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function LimpiasContent() {
  const searchParams = useSearchParams()
  const urgente = searchParams.get('urgente') === '1'
  const [rituales, setRituales] = useState(() => shuffle(RITUALES).slice(0, 4))
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('oraculo_sub')
      if (raw) {
        const parsed = JSON.parse(raw)
        // localStorage data only exists after a successful payment + resultado visit
        setIsPremium(!!(parsed.nombre && parsed.signo))
      }
    } catch {}
  }, [])

  function nuevosRituales() {
    setRituales(shuffle(RITUALES).slice(0, 4))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen" style={{ background: '#080614' }}>
      <div className="fixed inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(120,0,0,.18) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(60,0,80,.12) 0%, transparent 50%)',
      }} />

      <div className="relative z-10 max-w-2xl mx-auto px-5 py-10">

        <Link href="/energias" className="text-oracle-dim hover:text-oracle-gold transition-colors text-sm mb-8 inline-block">
          ← Diagnóstico
        </Link>

        {/* urgente banner */}
        {urgente && (
          <div className="rounded-xl p-4 mb-6 flex items-center gap-3" style={{
            background: 'rgba(180,0,0,.15)',
            border: '1px solid rgba(255,23,68,.35)',
          }}>
            <span className="text-2xl shrink-0">🔴</span>
            <p className="text-sm leading-relaxed" style={{ color: '#FFB3B3' }}>
              La Pitonisa detectó presencias oscuras activas. Estos remedios deben realizarse a la brevedad.
            </p>
          </div>
        )}

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-5">🕯️</div>

          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(180,40,40,.5))' }} />
            <p style={{ color: 'rgba(255,107,107,.7)', fontSize: 10, letterSpacing: '5px', textTransform: 'uppercase', fontWeight: 600 }}>
              Remedios de la Pitonisa
            </p>
            <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, rgba(180,40,40,.5), transparent)' }} />
          </div>

          <h1 className="font-serif text-4xl md:text-5xl mb-4 leading-tight" style={{
            color: '#FF6B6B',
            textShadow: '0 0 30px rgba(255,23,68,.25)',
          }}>
            {urgente ? 'Tu limpia urgente está lista' : 'La Pitonisa preparó tus remedios'}
          </h1>
          <p className="text-oracle-mid text-lg leading-relaxed max-w-md mx-auto">
            {urgente
              ? 'Las presencias detectadas requieren acción esta semana. La Pitonisa seleccionó los rituales de mayor potencia para tu situación.'
              : 'Estos rituales de limpia y protección fueron seleccionados para equilibrar tu campo energético y blindarte de influencias externas.'}
          </p>
        </div>

        {/* La Pitonisa habla */}
        <div className="rounded-2xl p-6 mb-8" style={{
          background: 'rgba(14,6,20,.85)',
          border: '1px solid rgba(139,92,246,.2)',
        }}>
          <p className="text-oracle-dim text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
            <span>🔮</span> Lo que la Pitonisa dice
          </p>
          <p className="font-serif text-oracle-mid text-lg leading-relaxed italic">
            {urgente
              ? '"Lo que está activo en tu contra no esperará. Cada día que pasa, la energía se asienta más. Empieza con la Limpia del Huevo esta misma noche y continúa con los rituales en el orden que más resuene contigo. La protección viene de la acción, no de la espera."'
              : '"Tus energías piden atención. No es urgente, pero ignorarlo tiene un precio. Elige el ritual que más conecte con lo que sientes y realízalo con calma y fe — la intención es la mitad del trabajo."'}
          </p>
        </div>

        {/* Subscription banner — non-subscribers only */}
        {!isPremium && (
          <div className="rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center gap-4" style={{
            background: 'linear-gradient(135deg, rgba(30,20,8,.95), rgba(13,8,39,.95))',
            border: '1px solid rgba(242,168,0,.35)',
            boxShadow: '0 0 30px rgba(242,168,0,.08)',
          }}>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-oracle-gold mb-1">🔒 Rituales completos · Solo suscriptores</p>
              <p className="text-oracle-dim text-sm leading-relaxed">
                Ingredientes exactos, pasos del ritual y la nota secreta de la Pitonisa — los {RITUALES.length} remedios del grimorio desbloqueados.
              </p>
            </div>
            <Link
              href="/consulta"
              className="btn-oracle shrink-0 whitespace-nowrap"
              style={{ padding: '12px 22px', fontSize: 14 }}
            >
              👑 $49 MXN/mes
            </Link>
          </div>
        )}

        {/* Ritual cards */}
        <div className="mb-6">
          <p className="text-oracle-dim text-xs tracking-[3px] uppercase mb-5">
            Rituales seleccionados para ti — {rituales.length} de {RITUALES.length}
          </p>
          <div className="space-y-4">
            {rituales.map((r, i) => (
              <RitualCard key={r.id} r={r} idx={i} isPremium={isPremium} />
            ))}
          </div>
        </div>

        {/* Shuffle */}
        <div className="text-center mb-10">
          <button
            onClick={nuevosRituales}
            className="btn-oracle-outline"
            style={{ borderColor: 'rgba(180,40,40,.4)', color: '#FF6B6B' }}
          >
            🔀 Ver otros remedios
          </button>
          <p className="text-oracle-dim text-xs mt-2">
            La Pitonisa tiene {RITUALES.length} rituales en su grimorio
          </p>
        </div>

        <p className="text-center text-oracle-dim text-xs mt-4">
          © 2026 El Oráculo de la Pitonisa · Solo entretenimiento
        </p>
      </div>
    </div>
  )
}

export default function LimpiasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080614' }}>
        <div className="flex gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#9333EA', animationDelay: `${i*0.15}s` }} />
          ))}
        </div>
      </div>
    }>
      <LimpiasContent />
    </Suspense>
  )
}
