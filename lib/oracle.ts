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

export function getMockImageUrl(signo: Signo, genero: Genero): string {
  const elementos: Record<Signo, Elemento> = {
    aries: 'fuego', leo: 'fuego', sagitario: 'fuego',
    tauro: 'tierra', virgo: 'tierra', capricornio: 'tierra',
    geminis: 'aire', libra: 'aire', acuario: 'aire',
    cancer: 'agua', escorpio: 'agua', piscis: 'agua',
  }
  const elemento = elementos[signo]
  // Use a relative URL so it resolves correctly on any deployment
  return `/api/placeholder?signo=${signo}&genero=${genero}&elemento=${elemento}`
}
