export type Genero = 'hombre' | 'mujer' | 'destino'

export type Signo =
  | 'aries' | 'tauro' | 'geminis' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'escorpio'
  | 'sagitario' | 'capricornio' | 'acuario' | 'piscis'

export type Elemento = 'fuego' | 'tierra' | 'aire' | 'agua'

interface DatosSigno {
  nombre:           string
  emoji:            string
  elemento:         Elemento
  cualidades:       string[]
  soulmateDescribe: string[]    // características del alma gemela
  fraseMistica:     string      // mensaje principal de la lectura
  detalle:          string      // párrafo largo para la tarjeta de resultado
  imagenRasgos:     string[]    // hints físicos para el prompt de imagen
}

const SIGNOS: Record<Signo, DatosSigno> = {
  aries: {
    nombre: 'Aries',
    emoji: '♈',
    elemento: 'fuego',
    cualidades: ['apasionada', 'valiente', 'directa'],
    soulmateDescribe: ['tranquilo', 'misterioso', 'con mirada profunda'],
    fraseMistica: 'El fuego de tu espíritu pide alguien que lo contenga sin apagarlo.',
    detalle:
      'La Pitonisa ve a alguien sereno que sonríe con los ojos antes que con la boca. ' +
      'Es el tipo de persona que no necesita llenar el silencio, y precisamente eso te ' +
      'intriga. Su calma apacigua tu tormenta interior. Están destinados a encontrarse ' +
      'cuando menos lo esperes — quizás en un lugar que no planeabas visitar.',
    imagenRasgos: ['calm confident expression', 'warm brown eyes', 'gentle smile'],
  },
  tauro: {
    nombre: 'Tauro',
    emoji: '♉',
    elemento: 'tierra',
    cualidades: ['sensual', 'leal', 'paciente'],
    soulmateDescribe: ['artístico', 'romántico', 'de manos expresivas'],
    fraseMistica: 'Tu alma gemela viene a recordarte que la belleza existe en los pequeños momentos.',
    detalle:
      'Los astros muestran a alguien de espíritu creativo — que nota los detalles que ' +
      'otros ignoran. Te preparará algo con sus propias manos, solo para verte sonreír. ' +
      'Tiene una voz que te calma y una forma de mirar el mundo que te enseñará a ' +
      'apreciar lo que ya tienes. Es paciente como tú, y juntos construyen algo sólido.',
    imagenRasgos: ['expressive artistic face', 'warm gentle eyes', 'natural beauty'],
  },
  geminis: {
    nombre: 'Géminis',
    emoji: '♊',
    elemento: 'aire',
    cualidades: ['curiosa', 'ingeniosa', 'adaptable'],
    soulmateDescribe: ['inteligente', 'con humor sutil', 'imposible de aburrir'],
    fraseMistica: 'Necesitas a alguien que pueda seguir el ritmo de tu mente brillante.',
    detalle:
      'La Pitonisa ve a alguien que te hará reír en los momentos más inesperados. ' +
      'Tiene una mente ágil y siempre hay algo nuevo que descubrir en su forma de ver ' +
      'el mundo. No te aburrirá jamás — cada conversación abre una puerta nueva. ' +
      'Su humor es sutil, inteligente, y te entiende como pocas personas lo han hecho.',
    imagenRasgos: ['bright intelligent eyes', 'playful smile', 'expressive face'],
  },
  cancer: {
    nombre: 'Cáncer',
    emoji: '♋',
    elemento: 'agua',
    cualidades: ['intuitiva', 'protectora', 'profunda'],
    soulmateDescribe: ['seguro', 'gentil', 'con presencia cálida'],
    fraseMistica: 'Tu corazón busca a quien haga del hogar un sentimiento, no un lugar.',
    detalle:
      'Los astros revelan a alguien cuya presencia se siente como llegar a casa después ' +
      'de un largo viaje. No necesitas explicarle cómo te sientes — lo intuye. Te da ' +
      'el espacio que necesitas y también la seguridad que mereces. Su forma de cuidar ' +
      'es silenciosa pero consistente. Con esta persona, eres completamente tú.',
    imagenRasgos: ['soft caring eyes', 'warm welcoming smile', 'gentle presence'],
  },
  leo: {
    nombre: 'Leo',
    emoji: '♌',
    elemento: 'fuego',
    cualidades: ['generosa', 'carismática', 'leal'],
    soulmateDescribe: ['confiado', 'apasionado', 'con mirada intensa'],
    fraseMistica: 'Tu alma gemela no teme a tu brillo — al contrario, lo celebra.',
    detalle:
      'La Pitonisa ve a alguien que no se intimida por tu energía — la abraza. ' +
      'Es alguien de presencia magnética que llena los espacios sin esfuerzo, pero ' +
      'que elige quedarse cerca de ti. Te adora de verdad y no tiene miedo de decirlo. ' +
      'Juntos son una energía imparable. El universo los pone en el mismo camino por razón.',
    imagenRasgos: ['confident magnetic expression', 'strong jawline', 'intense eyes'],
  },
  virgo: {
    nombre: 'Virgo',
    emoji: '♍',
    elemento: 'tierra',
    cualidades: ['analítica', 'dedicada', 'detallista'],
    soulmateDescribe: ['espontáneo', 'aventurero', 'que te saca de tu zona de comfort'],
    fraseMistica: 'Alguien viene a mostrarte que no todo tiene que ser perfecto para ser hermoso.',
    detalle:
      'Los astros muestran a alguien que vive con pasión e impulsividad — todo lo que ' +
      'tú guardas ordenado en su cajón, esta persona lo lleva suelto al viento. Pero ' +
      'lejos de frustrarte, te libera. Te enseña a soltar el control y descubrir que ' +
      'la vida sin plan también puede ser extraordinaria. Se complementan perfectamente.',
    imagenRasgos: ['adventurous spark in eyes', 'natural smile', 'free-spirited look'],
  },
  libra: {
    nombre: 'Libra',
    emoji: '♎',
    elemento: 'aire',
    cualidades: ['romántica', 'equilibrada', 'elegante'],
    soulmateDescribe: ['apasionado', 'decidido', 'que toma la iniciativa'],
    fraseMistica: 'El universo te envía a alguien que rompe tu indecisión con certeza absoluta.',
    detalle:
      'La Pitonisa ve a una persona que sabe exactamente lo que quiere — y te quiere ' +
      'a ti. No te hace esperar, no juega. Su claridad es refrescante para tu mente ' +
      'que siempre pesa pros y contras. Te da la estabilidad que buscas sin pedirte ' +
      'que cambies tu esencia. Con esta persona, la balanza por fin encuentra su centro.',
    imagenRasgos: ['decisive confident face', 'beautiful symmetrical features', 'clear eyes'],
  },
  escorpio: {
    nombre: 'Escorpio',
    emoji: '♏',
    elemento: 'agua',
    cualidades: ['intensa', 'leal', 'transformadora'],
    soulmateDescribe: ['honesto', 'valiente', 'que no te teme'],
    fraseMistica: 'Tu alma gemela es una de las pocas almas capaces de mirarte de verdad.',
    detalle:
      'Los astros muestran a alguien raro: alguien que no se asusta por tu profundidad. ' +
      'La mayoría huye de tu intensidad; esta persona la busca. Te enfrenta cuando ' +
      'lo necesitas y te protege cuando lo mereces. No hay juegos ni máscaras entre ' +
      'ustedes — solo verdad. Esta es la clase de amor que transforma vidas para siempre.',
    imagenRasgos: ['piercing intense gaze', 'strong features', 'magnetic expression'],
  },
  sagitario: {
    nombre: 'Sagitario',
    emoji: '♐',
    elemento: 'fuego',
    cualidades: ['aventurera', 'optimista', 'libre'],
    soulmateDescribe: ['curioso', 'con historias que contar', 'mente abierta'],
    fraseMistica: 'El destino te prepara un compañero de aventura, no un ancla.',
    detalle:
      'La Pitonisa ve a alguien que ha vivido tanto como tú — que tiene su propio ' +
      'mapa de cicatrices y victorias. No intentará contenerte; quiere correr contigo. ' +
      'Tiene una filosofía de vida que te fascina y expande la tuya. Juntos planean ' +
      'el siguiente viaje antes de terminar el actual. Libertad y amor que no se ' +
      'contradicen — eso es lo que te espera.',
    imagenRasgos: ['adventurous open expression', 'warm smile', 'worldly look'],
  },
  capricornio: {
    nombre: 'Capricornio',
    emoji: '♑',
    elemento: 'tierra',
    cualidades: ['ambiciosa', 'disciplinada', 'elegante'],
    soulmateDescribe: ['creativo', 'espontáneo', 'que te hace reír'],
    fraseMistica: 'Tu alma gemela viene a enseñarte el arte de no tomarte tan en serio.',
    detalle:
      'Los astros muestran a alguien con un humor disarmante y una creatividad que ' +
      'desordena tu mundo perfectamente organizado — en el buen sentido. No compite ' +
      'con tus metas; las celebra. Pero también sabe cuándo detenerte y recordarte ' +
      'que el camino importa tanto como el destino. Con esta persona, el éxito sabe ' +
      'diferente: sabe mejor.',
    imagenRasgos: ['creative playful smile', 'bright expressive eyes', 'charming look'],
  },
  acuario: {
    nombre: 'Acuario',
    emoji: '♒',
    elemento: 'aire',
    cualidades: ['original', 'visionaria', 'independiente'],
    soulmateDescribe: ['profundo', 'con valores claros', 'que te entiende sin explicaciones'],
    fraseMistica: 'Alguien llega que ve el mundo tan diferente como tú — y por eso lo entiende.',
    detalle:
      'La Pitonisa ve a una persona que no intenta "arreglarte" ni normalizarte. ' +
      'Tu rareza le parece fascinante, no intimidante. Tienen conversaciones hasta ' +
      'las 3 de la mañana sobre ideas que a los demás aburren. Te da el espacio ' +
      'que necesitas y también la conexión genuina que en secreto deseas. ' +
      'Esta persona es tu tribu de uno.',
    imagenRasgos: ['unique interesting face', 'thoughtful expressive eyes', 'unconventional beauty'],
  },
  piscis: {
    nombre: 'Piscis',
    emoji: '♓',
    elemento: 'agua',
    cualidades: ['empática', 'artística', 'espiritual'],
    soulmateDescribe: ['protector', 'práctico', 'que ancla tus sueños a la tierra'],
    fraseMistica: 'Tu alma gemela viene a convertir tus sueños en algo que puedes tocar.',
    detalle:
      'Los astros muestran a alguien sólido — que te toma de la mano cuando flotas ' +
      'demasiado lejos. No opaca tu sensibilidad; la cuida. Tiene los pies en la ' +
      'tierra de una manera que no te limita sino que te da raíces. Admira tu ' +
      'mundo interior y quiere ser invitado a él. Con esta persona, tus sueños ' +
      'más hermosos se vuelven planes reales.',
    imagenRasgos: ['protective strong presence', 'kind grounded eyes', 'reliable expression'],
  },
}

export function getSigno(dia: number, mes: number): Signo {
  if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) return 'aries'
  if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) return 'tauro'
  if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) return 'geminis'
  if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) return 'cancer'
  if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) return 'leo'
  if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) return 'virgo'
  if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) return 'libra'
  if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) return 'escorpio'
  if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) return 'sagitario'
  if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return 'capricornio'
  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) return 'acuario'
  return 'piscis'
}

export function getDatosSigno(signo: Signo): DatosSigno {
  return SIGNOS[signo]
}

export function buildImagePrompt(signo: Signo, genero: Genero): string {
  const datos = SIGNOS[signo]
  const generoFinal = genero === 'destino'
    ? (Math.random() > 0.5 ? 'hombre' : 'mujer')
    : genero

  const subject = generoFinal === 'hombre'
    ? 'a handsome man in his late 20s to early 30s'
    : 'a beautiful woman in her late 20s to early 30s'

  const rasgos = datos.imagenRasgos.join(', ')

  return (
    `Portrait photograph of ${subject}, ${rasgos}, ` +
    `soft warm romantic lighting, shallow depth of field, bokeh background, ` +
    `intimate gaze toward camera, natural beauty, elegant, professional portrait photography, ` +
    `high quality, detailed face, warm color grading, cinematic`
  )
}

export function buildNegativePrompt(): string {
  return (
    'cartoon, anime, illustration, painting, drawing, watermark, text, logo, ' +
    'nude, explicit, nsfw, ugly, deformed, low quality, blurry face, multiple people'
  )
}

// Curated portrait photos — one per zodiac sign, indexed by sign order.
// Each sign always gets the same face so the reading feels personalised.
// Order: aries tauro geminis cancer leo virgo libra escorpio sagitario capricornio acuario piscis
const FOTOS_MUJER = [
  'photo-1531746020798-e6953c6e8e04', // aries     — morena, cabello negro largo
  'photo-1544005313-94ddf0286df2',    // tauro     — castaña, natural
  'photo-1529626455594-4ff0802cfb7e', // geminis   — cabello castaño, sonrisa
  'photo-1534528741775-53994a69daeb', // cancer    — rubia, ojos claros
  'photo-1488426862026-3ee34a7d66df', // leo       — cabello rojo intenso
  'photo-1502764613149-7f1d229e230f', // virgo     — latina, cabello liso
  'photo-1517841905240-472988babdf9', // libra     — cabello oscuro, elegante
  'photo-1494790108377-be9c29b29330', // escorpio  — morena intensa
  'photo-1524504388940-b1c1722653e1', // sagitario — piel oscura, sonrisa
  'photo-1438761681033-6461ffad8d80', // capricornio — cabello negro, seria
  'photo-1573497019940-1c28c88b4f3e', // acuario   — profesional, traje
  'photo-1520813792240-56fc4a3765a7', // piscis    — ojos verdes, cabello claro
]

const FOTOS_HOMBRE = [
  'photo-1507003211169-0a1dd7228f2d', // aries     — barba corta, mirada fuerte
  'photo-1500648767791-00dcc994a43e', // tauro     — cara de ángel, joven
  'photo-1506794778202-cad84cf45f1d', // geminis   — sonrisa amplia
  'photo-1472099645785-5658abf4ff4e', // cancer    — cabello oscuro, amigable
  'photo-1463453091185-61582044d556', // leo       — actitud segura, lentes
  'photo-1519085360753-af0119f7cbe7', // virgo     — traje, profesional
  'photo-1540569014015-19a7be504e3a', // libra     — sonrisa suave, ojos miel
  'photo-1542583701-20d3be307eba',    // escorpio  — barba completa, intenso
  'photo-1480455624313-e29b44bbfde1', // sagitario — aspecto atlético
  'photo-1548372290-8d01b6c8e78c',    // capricornio — serio, maduro
  'photo-1557862921-37829c790f19',    // acuario   — aspecto artístico
  'photo-1529068755536-a5ade0dcb4e8', // piscis    — sensible, cabello rizado
]

const ORDEN_SIGNOS: Signo[] = [
  'aries','tauro','geminis','cancer','leo','virgo',
  'libra','escorpio','sagitario','capricornio','acuario','piscis',
]

export function getMockImageUrl(signo: Signo, genero: Genero): string {
  const idx = ORDEN_SIGNOS.indexOf(signo)
  const generoFinal = genero === 'destino' ? (idx % 2 === 0 ? 'mujer' : 'hombre') : genero
  const fotos = generoFinal === 'hombre' ? FOTOS_HOMBRE : FOTOS_MUJER
  const fotoId = fotos[idx % fotos.length]
  return `https://images.unsplash.com/${fotoId}?w=480&h=640&fit=crop&q=85&auto=format`
}
