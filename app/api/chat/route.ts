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

const FALLBACKS = [
  'Lo que buscas ya está en movimiento. La duda que cargas no es sobre el resultado — es sobre si mereces que resulte bien. Sí mereces. Actúa esta semana.',
  'Hay una conversación que evitas porque sabes que cambiará todo. Ya no puedes posponerla más. El miedo que sientes es señal de que importa.',
  'Algo que considerabas perdido puede regresar — pero en una forma diferente a lo que esperabas. Reconócelo cuando llegue, aunque no se parezca a lo que recuerdas.',
  'La persona en quien piensas ahora también piensa en ti. Hay un orgullo entre los dos que ninguno quiere soltar primero. Quien lo suelte ganará más de lo que imagina.',
  'Tu energía está dispersa en demasiadas direcciones. Los próximos 30 días piden enfoque absoluto en una sola cosa. Sabes exactamente cuál es.',
  'Hay alguien en tu vida que lleva meses esperando que tomes una decisión. Su paciencia tiene un límite que está más cerca de lo que crees.',
  'El camino que dudas en tomar es el correcto. La duda no es señal de que estés equivocada — es señal de que entiendes el peso de lo que está en juego.',
]

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as {
    messages: { role: 'user' | 'assistant'; content: string }[]
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700))
    return Response.json({ text: FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)] })
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
