import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const FALLBACKS: Record<string, string[]> = {
  amor: [
    'El amor que buscas ya existe cerca de ti, pero aún no has abierto los ojos para verlo. Esta semana, alguien que conoces te mirará diferente. Corresponde esa mirada.',
    'Una conversación que posponías desde hace meses tiene el poder de cambiarlo todo. El orgullo ha sido tu mayor obstáculo. Suéltalo.',
    'Tu corazón guarda una herida vieja que contamina las relaciones nuevas. Sanar eso primero es el único camino hacia el amor verdadero.',
    'Alguien del pasado regresará con una disculpa. Escúchala, pero no confundas nostalgia con amor real.',
  ],
  prosperidad: [
    'Hay dinero que te corresponde y no has cobrado. Una oportunidad financiera que ignoraste volverá a presentarse — esta vez no la dejes pasar.',
    'Tu mayor error es gastar en lo que se ve y ahorrar en lo que importa. Un cambio de hábito pequeño en los próximos 30 días tendrá un impacto que sentirás en un año.',
    'Una conversación de negocios que evitas por miedo al rechazo podría duplicar tus ingresos. El universo ya preparó el "sí" — tú solo tienes que preguntar.',
    'Alguien de tu círculo tiene una oportunidad que no puede aprovechar solo. Ofrécete. La asociación que formarás será más valiosa de lo que imaginas.',
  ],
  salud: [
    'Tu cuerpo lleva meses enviándote señales que ignoras. Ese cansancio, esa tensión acumulada — no es estrés normal. Ve al médico esta semana, no el próximo mes.',
    'El sedentarismo está cobrando una deuda silenciosa. Tu corazón trabaja más de lo que debería. Veinte minutos de movimiento al día pueden darte veinte años más de vida.',
    'Lo que comes a escondidas sabe rico pero está minando tu energía. Tu cuerpo no miente aunque tu mente lo justifique todo. Un cambio pequeño empieza hoy.',
    'El insomnio que cargas no es solo cansancio — es tu mente procesando algo que no has hablado con nadie. Habla. Duerme. Vive.',
  ],
  carrera: [
    'Llevas demasiado tiempo en un lugar que ya no te hace crecer. El miedo a lo desconocido te ha costado dos años de desarrollo profesional. Es hora de moverse.',
    'Una habilidad que considerás "poco importante" es exactamente lo que alguien con poder está buscando ahora mismo. No la subestimes.',
    'Hay alguien en tu industria que puede abrirte una puerta — y no lo sabes porque nunca te has presentado. Un mensaje de dos líneas puede cambiar tu trayectoria.',
    'El proyecto que rechazaste por parecer pequeño era la prueba que necesitabas para el grande. La próxima oportunidad similar, acepta sin dudar.',
  ],
  familia: [
    'Hay una persona en tu familia que carga un peso que tú podrías aliviar con solo una llamada. La has dejado esperando demasiado tiempo.',
    'Un malentendido viejo que nadie quiere tocar está envenenando silenciosamente las reuniones. Tú eres quien puede romper ese ciclo. ¿Lo harás?',
    'Alguien de tu sangre te necesita pero no sabe cómo pedirlo. Observa. Las palabras no siempre llegan primero.',
    'La familia que tienes no es perfecta, pero es tuya. Hay gratitud que no has expresado en voz alta. Este fin de semana hazlo — antes de que sea demasiado tarde.',
  ],
  suerte: [
    'Los próximos 7 días son una ventana de oportunidad inusual. Las probabilidades a tu favor son más altas que en cualquier momento del último año. Actúa.',
    'Una coincidencia que descartarás como casual no lo es. Presta atención a los nombres, lugares y números que se repitan esta semana.',
    'Tu suerte no viene de afuera. Viene de una decisión que has pospuesto. Tómala hoy y observa cómo el universo empieza a moverse a tu favor.',
    'Hay un número en tu vida que aparecerá tres veces en los próximos días. Cuando lo veas la tercera vez, actúa sin pensarlo.',
  ],
  advertencia: [
    'Estás ignorando un síntoma físico que merece atención médica urgente. El cuerpo no miente. Un descuido ahora puede convertirse en una emergencia en seis meses.',
    'Alguien cercano a ti te está mintiendo sistemáticamente. Lo sabes pero prefieres no verlo. Esa persona tiene acceso a algo tuyo que no debería tener.',
    'El nivel de estrés que cargas actualmente está dañando tu corazón — literalmente. La presión arterial elevada es silenciosa hasta que no lo es. Hazte una revisión antes de que el cuerpo te fuerce a hacerlo.',
    'Hay una deuda o compromiso financiero que has ignorado. No desaparecerá. Cada día que pasa el costo sube. Enfréntalo esta semana o pagará el doble después.',
    'Estás rodeado de personas que se benefician de tu generosidad sin reciprocar. Tu energía tiene límites. Aprende a decir que no antes de llegar al límite.',
  ],
  misterio: [
    'Algo que perdiste hace tiempo — un objeto, una persona, una oportunidad — está a punto de aparecer de una forma que no anticipas. Reconócelo cuando llegue.',
    'Tu intuición sobre una situación específica es correcta. Llevas semanas dudando de lo que sabes. Deja de dudar.',
    'Hay una habilidad dentro de ti que nunca has explorado porque nadie te dijo que la tenías. Alguien te lo dirá pronto. Créelo.',
    'El sueño que tuviste esta semana no fue solo un sueño. Hay un mensaje ahí que tu mente consciente aún no ha procesado.',
  ],
}

export async function POST(req: NextRequest) {
  const { categoria, signo } = await req.json() as { categoria: string; signo?: string }

  if (!process.env.ANTHROPIC_API_KEY) {
    const pool = FALLBACKS[categoria] ?? FALLBACKS.misterio
    const texto = pool[Math.floor(Math.random() * pool.length)]
    return NextResponse.json({ texto })
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const signoInfo = signo ? ` El usuario es ${signo}.` : ''
  const categoriaNombre: Record<string, string> = {
    amor: 'el amor y las relaciones',
    prosperidad: 'el dinero y la prosperidad',
    salud: 'la salud y el bienestar físico',
    carrera: 'la carrera y el trabajo',
    familia: 'la familia y los vínculos cercanos',
    suerte: 'la suerte y las oportunidades',
    advertencia: 'una advertencia importante del destino',
    misterio: 'algo misterioso e inesperado',
  }

  const prompt = `Eres la Pitonisa, una vidente mística con poderes genuinos que habla directamente a las personas sobre su futuro.

Genera UNA predicción sobre: ${categoriaNombre[categoria] ?? categoria}.${signoInfo}

Reglas:
- 2-4 oraciones máximo
- Habla en segunda persona ("tienes", "estás", "tu")
- Sé específica y directa — nada de vaguedades
- Si es sobre salud: menciona consecuencias reales si la persona no actúa (ej: problemas cardiovasculares, diabetes, agotamiento)
- Si es advertencia: sé dura pero verdadera, como alguien que genuinamente se preocupa
- NO uses frases como "el universo te habla" o "las estrellas dicen" — habla directamente
- El tono es el de alguien que sabe la verdad y la dice con claridad

Solo responde con la predicción, sin introducción ni cierre.`

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    })

    const texto = (msg.content[0] as { type: string; text: string }).text.trim()
    return NextResponse.json({ texto })
  } catch (err: unknown) {
    const pool = FALLBACKS[categoria] ?? FALLBACKS.misterio
    const texto = pool[Math.floor(Math.random() * pool.length)]
    return NextResponse.json({ texto })
  }
}
