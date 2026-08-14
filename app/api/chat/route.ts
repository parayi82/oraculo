import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM = `Eres la Pitonisa, una vidente mística con poderes genuinos. Tienes décadas de experiencia leyendo el futuro y el pasado de quienes te consultan. Eres directa, profunda y algo oscura — como alguien que conoce verdades que otros prefieren ignorar.

Reglas absolutas:
- Habla SIEMPRE en segunda persona ("tienes", "estás", "tu", "te")
- 2 a 4 oraciones por respuesta — nunca más
- Sé específica y directa; evita la vaguedad
- Puedes hacer UNA sola pregunta de seguimiento cuando necesitas más contexto
- Usa metáforas oscuras y poéticas (sombras, cristal, llamas, agua turbia) con moderación
- Nunca reveles que eres IA — eres la Pitonisa, siempre
- Tono: sereno, poderoso, un poco inquietante, genuinamente empático
- Varía el inicio de tus respuestas — no siempre con "Veo" o "Siento"`

// Keyword-aware fallbacks for when ANTHROPIC_API_KEY is not configured
const FALLBACKS: Record<string, string[]> = {
  amor: [
    'Lo que sientes por esa persona no es solo atracción — es un eco de algo que sus almas ya vivieron. El encuentro que temes ya está escrito.',
    'Hay una distancia entre tú y quien amas que ninguno de los dos ha querido cruzar todavía. La próxima semana trae una señal. No la ignores.',
    'La persona en quien piensas ahora también piensa en ti. Hay un orgullo entre los dos que ninguno quiere soltar primero. Quien lo suelte ganará más de lo que imagina.',
    'Tu corazón ya tomó la decisión que tu mente sigue debatiendo. El miedo no es señal de que estés equivocada — es señal de que sabes lo que está en juego.',
    'Una conexión que creías cerrada se reabrirá pronto. Pero llegará diferente, transformada. Reconócela aunque no se parezca a lo que recuerdas.',
    'Alguien está a punto de decirte lo que llevas tiempo esperando escuchar. El cristal me muestra que la espera termina este mes.',
  ],
  ex: [
    'Lo que viviste con esa persona dejó una marca que todavía gobierna tus decisiones sin que lo notes. Es momento de limpiar esa energía.',
    'El regreso que imaginas no será como lo recuerdas — ambos han cambiado. La pregunta real es si quieres lo que son ahora, no lo que fueron.',
    'Hay algo sin resolver entre tú y esa persona, una palabra no dicha que sigue flotando entre los dos. Pero el tiempo para decirla se acorta.',
    'Esa puerta puede volver a abrirse, pero solo si tú decides dejar de mirarla. La paradoja del amor es que regresa cuando dejas de esperarlo.',
  ],
  trabajo: [
    'Hay una oportunidad profesional que se acerca disfrazada de problema. No la rechaces por instinto — examínala con calma antes de decidir.',
    'El esfuerzo que nadie ha reconocido está a punto de ser visto. La energía que has invertido en silencio regresa multiplicada en los próximos 40 días.',
    'Sientes que tu talento no está siendo aprovechado donde estás. Ese sentimiento es una brújula, no una queja. Escúchalo.',
    'Una conversación incómoda con alguien en tu trabajo es inevitable. Cuanto antes la tengas, más poder tendrás en el resultado.',
    'El camino que dudas en tomar en tu carrera es el correcto. La duda no es debilidad — es señal de que entiendes el peso de lo que cambiaría.',
  ],
  dinero: [
    'Una entrada de dinero inesperada llega en las próximas semanas, pero viene con una decisión adjunta. Piensa bien antes de comprometerte.',
    'El dinero que buscas está más cerca de lo que crees, pero llega a través de una persona o camino que todavía no has considerado.',
    'Hay un gasto que debes hacer ahora aunque duela — es una inversión que el universo recompensará en los próximos tres meses.',
    'Tu relación con el dinero lleva la huella de alguien de tu pasado. Liberar esa energía es el primer paso para que fluya con más libertad hacia ti.',
    'La abundancia que pides está bloqueada por una creencia que no es tuya — te la heredaron. Es momento de cuestionarla.',
  ],
  salud: [
    'Tu cuerpo lleva tiempo enviando señales que tu mente ha elegido ignorar. Presta atención antes de que el mensaje llegue más fuerte.',
    'La fatiga que sientes no es solo física — hay una carga emocional que la alimenta. Abordar ambas a la vez acelerará tu recuperación.',
    'Un cambio pequeño en tu rutina diaria tendrá un impacto mucho mayor del que imaginas. El cristal me muestra que el cuerpo responde rápido cuando lo escuchas.',
    'La respuesta que buscas sobre tu salud llegará pronto — pero necesitas hacer la pregunta en el lugar correcto.',
  ],
  familia: [
    'Hay una tensión en tu familia que nadie quiere nombrar pero que todos sienten. Tú eres quien puede romper ese silencio sin romper el vínculo.',
    'Una figura de autoridad en tu historia familiar sigue influyendo en tus decisiones más de lo que admites. Es momento de separar su voz de la tuya.',
    'Una reconciliación que creías imposible puede suceder — pero requiere que alguien dé el primer paso. Ese alguien puedes ser tú.',
    'La situación familiar que te preocupa tiene una resolución que ninguno ha visto aún porque todos están demasiado adentro del problema para verla.',
  ],
  futuro: [
    'Lo que buscas ya está en movimiento. La duda que cargas no es sobre el resultado — es sobre si mereces que resulte bien. Sí mereces. Actúa esta semana.',
    'El futuro que temes y el futuro que deseas están más cerca de lo que la distancia hace parecer. Un solo paso en la dirección correcta lo cambia todo.',
    'Los próximos tres meses traen un cambio que ahora se siente como pérdida pero que en seis meses reconocerás como el giro que necesitabas.',
    'Algo que considerabas perdido puede regresar — pero en una forma diferente a lo que esperabas. Reconócelo cuando llegue, aunque no se parezca a lo que recuerdas.',
    'Tu energía está dispersa en demasiadas direcciones. Los próximos 30 días piden enfoque absoluto en una sola cosa. Sabes exactamente cuál es.',
  ],
  general: [
    'Lo que traes hoy tiene más peso del que muestras. Antes de que pueda ver con claridad, dime: ¿de qué o de quién no puedes dejar de pensar?',
    'Hay una conversación que evitas porque sabes que cambiará todo. Ya no puedes posponerla más. El miedo que sientes es señal de que importa.',
    'El momento que esperas no llega porque hay algo que todavía debes soltar. No me preguntes qué es — tú ya lo sabes.',
    'Hay alguien en tu vida que lleva meses esperando que tomes una decisión. Su paciencia tiene un límite que está más cerca de lo que crees.',
    'Las señales que el universo te ha enviado esta semana no son coincidencia. ¿Cuántas has notado y cuántas has descartado como casualidad?',
    'La respuesta que buscas no está afuera. El cristal me la refleja, pero solo tú puedes leerla — ¿qué es lo que ya sabes y te niegas a aceptar?',
  ],
}

function pickFallback(userText: string): string {
  const lower = userText.toLowerCase()

  const match = (words: string[]) => words.some(w => lower.includes(w))

  let category = 'general'

  if (match(['ex ', 'exnovia', 'exnovio', 'ex pareja', 'ex-', 'volvimos', 'volver con', 'regresó', 'regreso'])) {
    category = 'ex'
  } else if (match(['amor', 'amo', 'quiero', 'novia', 'novio', 'pareja', 'relación', 'casarme', 'matrimonio', 'enamorad', 'cita', 'corazón', 'me gusta', 'le gusta', 'alguien especial'])) {
    category = 'amor'
  } else if (match(['trabajo', 'empleo', 'jefe', 'jefa', 'empresa', 'renuncia', 'despedir', 'ascenso', 'sueldo', 'contrato', 'negocio', 'proyecto', 'carrera', 'oferta'])) {
    category = 'trabajo'
  } else if (match(['dinero', 'deuda', 'préstamo', 'ahorro', 'inversión', 'plata', 'lana', 'pesos', 'económic', 'finanza', 'pagar', 'cobra', 'ganancia'])) {
    category = 'dinero'
  } else if (match(['salud', 'enferm', 'dolor', 'médico', 'doctora', 'hospital', 'diagnóstico', 'cansad', 'ansiedad', 'depresión', 'cuerpo', 'síntoma'])) {
    category = 'salud'
  } else if (match(['familia', 'mamá', 'papá', 'hermano', 'hermana', 'hijo', 'hija', 'madre', 'padre', 'abuela', 'abuelo', 'familiar', 'pelea en casa'])) {
    category = 'familia'
  } else if (match(['futuro', 'qué pasará', 'qué va a pasar', 'predice', 'destino', 'cuándo', 'pronto', 'este año', 'próximo año', 'mis planes', 'mi camino'])) {
    category = 'futuro'
  }

  const pool = FALLBACKS[category]
  return pool[Math.floor(Math.random() * pool.length)]
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as {
    messages: { role: 'user' | 'assistant'; content: string }[]
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    await new Promise(r => setTimeout(r, 900 + Math.random() * 800))
    const lastUser = [...messages].reverse().find(m => m.role === 'user')?.content ?? ''
    return Response.json({ text: pickFallback(lastUser) })
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 280,
    system: SYSTEM,
    messages,
  })

  const readable = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder()
      try {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(enc.encode(chunk.delta.text))
          }
        }
      } finally {
        controller.close()
      }
    },
    cancel() { stream.abort() },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
