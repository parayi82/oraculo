'use client'

import { useEffect, useRef, useState } from 'react'

export default function AmbientSound() {
  const [playing, setPlaying] = useState(false)
  const [ready,   setReady]   = useState(false)
  const ctxRef    = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)

  function buildGraph(ctx: AudioContext) {
    const master = ctx.createGain()
    master.gain.value = 0.00001
    master.connect(ctx.destination)
    masterRef.current = master

    // ── Hall reverb: two long, gentle feedback delays ──
    const delay1 = ctx.createDelay(6)
    const delay2 = ctx.createDelay(6)
    delay1.delayTime.value = 2.4
    delay2.delayTime.value = 3.3
    const fbGain1 = ctx.createGain(); fbGain1.gain.value = 0.32
    const fbGain2 = ctx.createGain(); fbGain2.gain.value = 0.28
    delay1.connect(fbGain1); fbGain1.connect(delay1)
    delay2.connect(fbGain2); fbGain2.connect(delay2)
    delay1.connect(master); delay2.connect(master)

    const revFilter = ctx.createBiquadFilter()
    revFilter.type = 'lowpass'
    revFilter.frequency.value = 1800
    revFilter.connect(delay1); revFilter.connect(delay2)

    // ── Very slow breath LFO (0.03 Hz) ──
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.03
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.10
    lfo.connect(lfoGain)
    lfo.start()

    // ── Warm pad: Am7 chord (A C E G) — mysterious yet pleasant ──
    // Each note uses 3 detuned oscillators for a lush chorus feel
    buildPadNote(ctx, 110,   0.28, revFilter, lfoGain)  // A2 — bass root
    buildPadNote(ctx, 165,   0.18, revFilter, lfoGain)  // E3 — perfect fifth
    buildPadNote(ctx, 220,   0.20, revFilter, lfoGain)  // A3 — octave
    buildPadNote(ctx, 261.6, 0.14, revFilter, lfoGain)  // C4 — minor third (warmth)
    buildPadNote(ctx, 329.6, 0.10, revFilter, lfoGain)  // E4 — fifth (open)
    buildPadNote(ctx, 392,   0.07, revFilter, lfoGain)  // G4 — minor 7th (mystery)

    // ── Crystal shimmer: A5 with very gentle vibrato ──
    const shimmer = ctx.createOscillator()
    shimmer.type = 'sine'
    shimmer.frequency.value = 880
    const shimVibLfo = ctx.createOscillator()
    shimVibLfo.frequency.value = 0.07
    const shimVibGain = ctx.createGain()
    shimVibGain.gain.value = 4
    shimVibLfo.connect(shimVibGain)
    shimVibGain.connect(shimmer.frequency)
    shimVibLfo.start()
    const shimGain = ctx.createGain()
    shimGain.gain.value = 0.016
    lfoGain.connect(shimGain.gain)
    shimmer.connect(shimGain)
    shimGain.connect(revFilter)
    shimmer.start()

    // ── High sparkle: E5 ──
    const sparkle = ctx.createOscillator()
    sparkle.type = 'sine'
    sparkle.frequency.value = 659.3
    const sparklGain = ctx.createGain()
    sparklGain.gain.value = 0.010
    lfoGain.connect(sparklGain.gain)
    sparkle.connect(sparklGain)
    sparklGain.connect(revFilter)
    sparkle.start()

    // ── Melodic arpeggios — slow, soft, pleasant ──
    scheduleArpeggio(ctx, master)
  }

  // Three slightly detuned sines per note → rich warm pad
  function buildPadNote(
    ctx: AudioContext,
    freq: number,
    amp: number,
    dest: AudioNode,
    lfoGain: GainNode,
  ) {
    const detunes = [-4, 0, 4] // cents
    detunes.forEach(cents => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      osc.detune.value = cents

      // Gentle micro-drift per voice
      const driftLfo = ctx.createOscillator()
      driftLfo.frequency.value = 0.02 + Math.random() * 0.025
      const driftGain = ctx.createGain()
      driftGain.gain.value = 2
      driftLfo.connect(driftGain)
      driftGain.connect(osc.detune)
      driftLfo.start()

      const g = ctx.createGain()
      g.gain.value = amp / detunes.length
      lfoGain.connect(g.gain)
      osc.connect(g)
      g.connect(dest)
      osc.start()
    })
  }

  // Soft melodic arpeggios through Am7 + pentatonic extensions
  function scheduleArpeggio(ctx: AudioContext, dest: AudioNode) {
    // Am7 notes in mid-high register, pleasant and dreamy
    const notes = [440, 523.3, 587.3, 659.3, 784, 880, 1046.5]
    // A4   C5     D5     E5     G5   A5    C6
    let cursor = ctx.currentTime + 2

    const playNote = (freq: number, when: number, dur: number) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq

      const env = ctx.createGain()
      env.gain.setValueAtTime(0, when)
      env.gain.linearRampToValueAtTime(0.038, when + 0.08)
      env.gain.exponentialRampToValueAtTime(0.0001, when + dur)

      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 2800

      osc.connect(lp)
      lp.connect(env)
      env.connect(dest)
      osc.start(when)
      osc.stop(when + dur + 0.1)
    }

    const scheduleNext = () => {
      if (!ctxRef.current) return
      // Play 1–3 notes as a soft cluster, then rest
      const count = Math.random() < 0.5 ? 1 : Math.random() < 0.5 ? 2 : 3
      const baseNote = notes[Math.floor(Math.random() * (notes.length - count))]
      const noteSet = Array.from({ length: count }, (_, i) =>
        notes[notes.indexOf(baseNote) + i] ?? baseNote
      )
      noteSet.forEach((freq, i) => {
        playNote(freq, cursor + i * 0.18, 3.5 + Math.random() * 2)
      })
      const gap = 4 + Math.random() * 9
      cursor += gap
      setTimeout(scheduleNext, (gap - 1) * 1000)
    }
    scheduleNext()
  }

  function toggle() {
    if (playing) {
      if (masterRef.current && ctxRef.current) {
        const now = ctxRef.current.currentTime
        masterRef.current.gain.cancelScheduledValues(now)
        masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, now)
        masterRef.current.gain.linearRampToValueAtTime(0.00001, now + 2)
      }
      setPlaying(false)
    } else {
      if (!ctxRef.current) {
        const ctx = new AudioContext()
        ctxRef.current = ctx
        buildGraph(ctx)
        setReady(true)
      }
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') ctx.resume()

      if (masterRef.current) {
        const now = ctx.currentTime
        masterRef.current.gain.cancelScheduledValues(now)
        masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, now)
        masterRef.current.gain.linearRampToValueAtTime(0.18, now + 5)
      }
      setPlaying(true)
    }
  }

  useEffect(() => {
    return () => { ctxRef.current?.close() }
  }, [])

  return (
    <button
      onClick={toggle}
      title={playing ? 'Silenciar música' : 'Activar música del oráculo'}
      aria-label={playing ? 'Silenciar' : 'Activar música ambiental'}
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
      style={{
        background: playing
          ? 'radial-gradient(circle, rgba(139,92,246,0.25), rgba(8,6,20,0.9))'
          : 'rgba(8,6,20,0.75)',
        border: `1px solid ${playing ? 'rgba(139,92,246,0.6)' : 'rgba(139,92,246,0.25)'}`,
        boxShadow: playing
          ? '0 0 24px rgba(139,92,246,0.35), 0 0 8px rgba(242,168,0,0.15)'
          : '0 2px 8px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {playing ? <SoundWave /> : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.7)" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      )}
    </button>
  )
}

function SoundWave() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
      {[
        { x: 1,  h: 6,  delay: '0s'    },
        { x: 5,  h: 12, delay: '0.15s' },
        { x: 9,  h: 14, delay: '0.3s'  },
        { x: 13, h: 10, delay: '0.15s' },
        { x: 17, h: 5,  delay: '0s'    },
      ].map(({ x, h, delay }) => (
        <rect
          key={x}
          x={x} y={(14 - h) / 2} width="2" height={h} rx="1"
          fill="rgba(139,92,246,0.9)"
          style={{ animation: `waveBar 0.9s ease-in-out ${delay} infinite alternate` }}
        />
      ))}
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.35); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </svg>
  )
}
