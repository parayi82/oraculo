import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'El Oráculo de la Pitonisa — Descubre tu Alma Gemela',
  description:
    'La Pitonisa ha visto el rostro de tu alma gemela en la bola de cristal. ' +
    'Lectura personalizada con inteligencia artificial. $49 MXN/mes.',
  keywords: ['alma gemela', 'tarot', 'oráculo', 'pitonisa', 'horóscopo', 'amor', 'destino'],
  openGraph: {
    title: 'El Oráculo de la Pitonisa',
    description: '¿Cómo se ve tu alma gemela? Descúbrelo ahora.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#F2A800',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>{children}</body>
    </html>
  )
}
