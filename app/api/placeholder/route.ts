import { NextRequest, NextResponse } from 'next/server'

// Palette per zodiac element
const ELEMENT_COLORS: Record<string, { top: string; mid: string; acc: string }> = {
  fuego:  { top: '#7C1F1F', mid: '#3D0A0A', acc: '#F2A800' },
  tierra: { top: '#1A3A1A', mid: '#0A1F0A', acc: '#8BC34A' },
  aire:   { top: '#1A2A4A', mid: '#0A1230', acc: '#00D4B8' },
  agua:   { top: '#0A1F3A', mid: '#050F1F', acc: '#8B5CF6' },
}

export async function GET(req: NextRequest) {
  const signo   = req.nextUrl.searchParams.get('signo') ?? 'leo'
  const genero  = req.nextUrl.searchParams.get('genero') ?? 'mujer'
  const element = req.nextUrl.searchParams.get('elemento') ?? 'fuego'

  const colors = ELEMENT_COLORS[element] ?? ELEMENT_COLORS.fuego
  const isMan  = genero === 'hombre'

  // Simple stylized portrait SVG
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="600" viewBox="0 0 480 600">
  <defs>
    <radialGradient id="bg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="${colors.top}"/>
      <stop offset="100%" stop-color="#080614"/>
    </radialGradient>
    <radialGradient id="face" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="${colors.acc}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${colors.top}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${colors.acc}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${colors.acc}" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur3">
      <feGaussianBlur stdDeviation="3"/>
    </filter>
    <filter id="blur8">
      <feGaussianBlur stdDeviation="8"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="480" height="600" fill="#080614"/>
  <rect width="480" height="600" fill="url(#bg)"/>

  <!-- Glow halo behind figure -->
  <ellipse cx="240" cy="240" rx="130" ry="150" fill="url(#glow)" filter="url(#blur8)" opacity="0.6"/>

  <!-- Shoulders / body -->
  <path d="M ${isMan ? '70,600 Q70,400 240,370 Q410,400 410,600' : '90,600 Q90,420 240,390 Q390,420 390,600'}Z"
        fill="${colors.top}" opacity="0.7"/>
  <path d="M ${isMan ? '100,600 Q100,410 240,385 Q380,410 380,600' : '110,600 Q110,430 240,405 Q370,430 370,600'}Z"
        fill="${colors.mid}" opacity="0.9"/>

  <!-- Neck -->
  <rect x="${isMan ? '215' : '220'}" y="${isMan ? '290' : '295'}" width="${isMan ? '50' : '40'}" height="80"
        fill="${colors.top}" rx="8" opacity="0.8"/>

  <!-- Head shape -->
  <ellipse cx="240" cy="${isMan ? '215' : '210'}" rx="${isMan ? '90' : '80'}" ry="${isMan ? '100' : '95'}"
           fill="${colors.mid}" opacity="0.9"/>
  <ellipse cx="240" cy="${isMan ? '215' : '210'}" rx="${isMan ? '90' : '80'}" ry="${isMan ? '100' : '95'}"
           fill="url(#face)"/>

  <!-- Hair -->
  ${isMan
    ? `<ellipse cx="240" cy="140" rx="88" ry="30" fill="#1a1a2e" opacity="0.95"/>
       <rect x="152" y="140" width="22" height="60" rx="8" fill="#1a1a2e" opacity="0.95"/>
       <rect x="306" y="140" width="22" height="60" rx="8" fill="#1a1a2e" opacity="0.95"/>`
    : `<ellipse cx="240" cy="130" rx="82" ry="28" fill="#1a1a2e" opacity="0.95"/>
       <path d="M158,145 Q140,200 148,310 Q165,330 175,320 Q168,220 172,160Z" fill="#1a1a2e" opacity="0.95"/>
       <path d="M322,145 Q340,200 332,310 Q315,330 305,320 Q312,220 308,160Z" fill="#1a1a2e" opacity="0.95"/>
       <ellipse cx="240" cy="128" rx="83" ry="26" fill="#1a1a2e" opacity="0.95"/>`
  }

  <!-- Eyes -->
  <ellipse cx="210" cy="${isMan ? '220' : '218'}" rx="14" ry="10" fill="#080614" opacity="0.9"/>
  <ellipse cx="270" cy="${isMan ? '220' : '218'}" rx="14" ry="10" fill="#080614" opacity="0.9"/>
  <!-- Eye glow -->
  <circle cx="210" cy="${isMan ? '220' : '218'}" r="5" fill="${colors.acc}" opacity="0.7"/>
  <circle cx="270" cy="${isMan ? '220' : '218'}" r="5" fill="${colors.acc}" opacity="0.7"/>
  <!-- Eye highlight -->
  <circle cx="215" cy="${isMan ? '217' : '215'}" r="3" fill="white" opacity="0.6"/>
  <circle cx="275" cy="${isMan ? '217' : '215'}" r="3" fill="white" opacity="0.6"/>

  <!-- Nose -->
  <path d="M235,${isMan ? '238' : '235'} Q240,${isMan ? '258' : '255'} 245,${isMan ? '238' : '235'}"
        stroke="${colors.acc}" stroke-width="1.5" fill="none" opacity="0.4"/>

  <!-- Lips -->
  <path d="M220,${isMan ? '265' : '262'} Q240,${isMan ? '278' : '274'} 260,${isMan ? '265' : '262'}"
        stroke="${colors.acc}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>

  <!-- Mystical floating particles -->
  ${[
    { x: 80,  y: 80,  r: 2.5, o: 0.7 },
    { x: 400, y: 120, r: 2,   o: 0.5 },
    { x: 60,  y: 350, r: 1.5, o: 0.4 },
    { x: 420, y: 300, r: 2,   o: 0.6 },
    { x: 130, y: 500, r: 1.5, o: 0.3 },
    { x: 360, y: 480, r: 2.5, o: 0.5 },
    { x: 200, y: 60,  r: 1.5, o: 0.4 },
    { x: 320, y: 75,  r: 2,   o: 0.6 },
  ].map(p =>
    `<circle cx="${p.x}" cy="${p.y}" r="${p.r}" fill="${colors.acc}" opacity="${p.o}"/>`
  ).join('\n  ')}

  <!-- Star sparkles -->
  ${[{ x: 390, y: 170 }, { x: 95, y: 200 }, { x: 370, y: 400 }].map(p => `
  <line x1="${p.x-6}" y1="${p.y}" x2="${p.x+6}" y2="${p.y}" stroke="${colors.acc}" stroke-width="1" opacity="0.5"/>
  <line x1="${p.x}" y1="${p.y-6}" x2="${p.x}" y2="${p.y+6}" stroke="${colors.acc}" stroke-width="1" opacity="0.5"/>`
  ).join('')}

  <!-- Bottom gradient overlay -->
  <rect width="480" height="120" y="480" fill="url(#bg)" opacity="0.8"/>

  <!-- Zodiac symbol at bottom -->
  <text x="240" y="570" text-anchor="middle"
        font-family="Georgia, serif" font-size="13"
        fill="${colors.acc}" opacity="0.8" letter-spacing="3">
    ${signo.toUpperCase()} · ALMA GEMELA
  </text>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
