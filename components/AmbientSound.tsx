'use client'

import { useEffect, useRef, useState } from 'react'

export default function AmbientSound() {
  const [playing, setPlaying]   = useState(false)
  const [ready,   setReady]     = useState(false)
  const ctxRef    = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)

  function buildGraph(ctx: AudioContext) {
    const master = ctx.createGain()
    master.gain.value = 0.00001
    master.connect(ctx.destination)
    masterRef.current = master

    // ── Cathedral reverb: two gentle feedback delays ──
    const delay1 = ctx.createDelay(5)
    const delay2 = ctx.createDelay(5)
    delay1.delayTime.value = 2.1
    delay2.delayTime.value = 2.9
    const fbGain1 = ctx.createGain(); fbGain1.gain.value = 0.38
    const fbGain2 = ctx.createGain(); fbGain2.gain.value = 0.34
    delay1.connect(fbGain1); fbGain1.connect(delay1)
    delay2.connect(fbGain2); fbGain2.connect(delay2)
    delay1.connect(master); delay2.connect(master)

    // Silky low-pass on reverb tail
    const revFilter = ctx.createBiquadFilter()
    revFilter.type = 'lowpass'
    revFilter.frequency.value = 900
    revFilter.Q.value = 0.5
    revFilter.connect(delay1); revFilter.connect(delay2)

    // ── Slow breath LFO (0.04 Hz) ──
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.04
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.12
    lfo.connect(lfoGain)
    lfo.start()

    // ── Mystical drone stack: A minor — no tritone, no harsh dissonance ──
    // Root A1 55 Hz — warm foundation
    addDrone(ctx, 55,   0.30, 'sine',     revFilter, lfoGain)
    // Perfect fifth E2 82.4 Hz — open, mysterious
    addDrone(ctx, 82.4, 0.18, 'sine',     revFilter, lfoGain)
    // Octave A2 110 Hz — body
    addDrone(ctx, 110,  0.14, 'sine',     revFilter, lfoGain)
    // Minor third C3 130.8 Hz — melancholic, not scary
    addDrone(ctx, 130.8, 0.08, 'triangle', revFilter, lfoGain)

    // ── Celestial shimmer: pure A4 with very slow vibrato ──
    const shimmer = ctx.createOscillator()
    shimmer.type = 'sine'
    shimmer.frequency.value = 440
    const shimVibLfo = ctx.createOscillator()
    shimVibLfo.frequency.value = 0.06
    const shimVibGain = ctx.createGain()
    shimVibGain.gain.value = 5
    shimVibLfo.connect(shimVibGain)
    shimVibGain.connect(shimmer.frequency)
    shimVibLfo.start()
    const shimGain = ctx.createGain()
    shimGain.gain.value = 0.022
    lfoGain.connect(shimGain.gain)
    shimmer.connect(shimGain)
    shimGain.connect(revFilter)
    shimmer.start()

    // ── Upper shimmer: E5 659 Hz — adds crystal sparkle ──
    const shimmer2 = ctx.createOscillator()
    shimmer2.type = 'sine'
    shimmer2.frequency.value = 659
    const shim2Vib = ctx.createOscillator()
    shim2Vib.frequency.value = 0.05
    const shim2VibGain = ctx.createGain()
    shim2VibGain.gain.value = 3
    shim2Vib.connect(shim2VibGain)
    shim2VibGain.connect(shimmer2.frequency)
    shim2Vib.start()
    const shim2Gain = ctx.createGain()
    shim2Gain.gain.value = 0.014
    lfoGain.connect(shim2Gain.gain)
    shimmer2.connect(shim2Gain)
    shim2Gain.connect(revFilter)
    shimmer2.start()

    // ── Slowly arpeggiated bell tones (A minor pentatonic: A C D E G) ──
    scheduleBells(ctx, master, lfoGain)

    // ── Soft ethereal air: narrow bandpass on high frequencies ──
    const bufferSize = ctx.sampleRate * 2
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    noise.loop = true
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 2400
    noiseFilter.Q.value = 1.8
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.008
    lfoGain.connect(noiseGain.gain)
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(revFilter)
    noise.start()
  }

  // Bell tones that drift in quietly — A minor pentatonic scale
  function scheduleBells(ctx: AudioContext, dest: AudioNode, lfoGain: GainNode) {
    const notes = [220, 261.6, 293.7, 329.6, 392] // A3 C4 D4 E4 G4

    function ringBell(freq: number, when: number) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq

      // Bell harmonics — add a soft 2nd partial
      const osc2 = ctx.createOscillator()
      osc2.type = 'sine'
      osc2.frequency.value = freq * 2.76

      const env = ctx.createGain()
      env.gain.setValueAtTime(0, when)
      env.gain.linearRampToValueAtTime(0.055, when + 0.04)
      env.gain.exponentialRampToValueAtTime(0.0001, when + 5.5)

      const env2 = ctx.createGain()
      env2.gain.setValueAtTime(0, when)
      env2.gain.linearRampToValueAtTime(0.018, when + 0.04)
      env2.gain.exponentialRampToValueAtTime(0.0001, when + 2.5)

      osc.connect(env);  env.connect(dest)
      osc2.connect(env2); env2.connect(dest)
      osc.start(when);   osc.stop(when + 6)
      osc2.start(when);  osc2.stop(when + 3)
    }

    // Schedule a soft bell every 6–14 seconds into the future
    let cursor = ctx.currentTime + 3
    const scheduleNext = () => {
      if (!ctxRef.current) return
      const freq  = notes[Math.floor(Math.random() * notes.length)]
      const gap   = 6 + Math.random() * 8
      ringBell(freq, cursor)
      cursor += gap
      // Keep scheduling while audio context is open
      const delay = (gap - 1) * 1000
      setTimeout(scheduleNext, delay)
    }
    scheduleNext()
  }

  function addDrone(
    ctx: AudioContext,
    freq: number,
    amp: number,
    type: OscillatorType,
    dest: AudioNode,
    lfoGain: GainNode,
  ) {
    const osc = ctx.createOscillator()
    osc.type = type
    osc.frequency.value = freq

    const detuneLfo = ctx.createOscillator()
    detuneLfo.frequency.value = 0.02 + Math.random() * 0.03
    const detuneGain = ctx.createGain()
    detuneGain.gain.value = 3
    detuneLfo.connect(detuneGain)
    detuneGain.connect(osc.detune)
    detuneLfo.start()

    const g = ctx.createGain()
    g.gain.value = amp
    lfoGain.connect(g.gain)
    osc.connect(g)
    g.connect(dest)
    osc.start()
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
        masterRef.current.gain.linearRampToValueAtTime(0.18, now + 4)
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
      {playing ? (
        <SoundWave />
      ) : (
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
          style={{
            animation: `waveBar 0.9s ease-in-out ${delay} infinite alternate`,
          }}
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
