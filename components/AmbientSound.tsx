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

    // ── Long reverb via feedback delay ──
    const delay1 = ctx.createDelay(4)
    const delay2 = ctx.createDelay(4)
    delay1.delayTime.value = 1.3
    delay2.delayTime.value = 1.9
    const fbGain1 = ctx.createGain(); fbGain1.gain.value = 0.52
    const fbGain2 = ctx.createGain(); fbGain2.gain.value = 0.48
    delay1.connect(fbGain1); fbGain1.connect(delay1)
    delay2.connect(fbGain2); fbGain2.connect(delay2)
    delay1.connect(master); delay2.connect(master)

    // Warm low-pass on reverb
    const revFilter = ctx.createBiquadFilter()
    revFilter.type = 'lowpass'
    revFilter.frequency.value = 600
    revFilter.connect(delay1); revFilter.connect(delay2)

    // ── Slow tremolo LFO (0.05 Hz) ──
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.05
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.18
    lfo.connect(lfoGain)
    lfo.start()

    // ── Sub-bass anchor: 40 Hz ──
    addDrone(ctx, 40,   0.40, 'sine',     master, lfoGain)
    // ── Root A1: 55 Hz ──
    addDrone(ctx, 55,   0.32, 'sine',     revFilter, lfoGain)
    // ── Tritono (diabolus in musica): Eb2 = 77.8 Hz ──
    addDrone(ctx, 77.8, 0.20, 'triangle', revFilter, lfoGain)
    // ── A2: 110 Hz ──
    addDrone(ctx, 110,  0.14, 'sine',     revFilter, lfoGain)
    // ── Minor 9th dissonance: B2 = 123.5 Hz ──
    addDrone(ctx, 123.5,0.09, 'triangle', revFilter, lfoGain)

    // ── Eerie high shimmer (slow vibrato) ──
    const shimmer = ctx.createOscillator()
    shimmer.type = 'sine'
    shimmer.frequency.value = 880
    const shimmerVibLfo = ctx.createOscillator()
    shimmerVibLfo.frequency.value = 0.08
    const shimmerVibGain = ctx.createGain()
    shimmerVibGain.gain.value = 15
    shimmerVibLfo.connect(shimmerVibGain)
    shimmerVibGain.connect(shimmer.frequency)
    shimmerVibLfo.start()
    const shimmerGain = ctx.createGain()
    shimmerGain.gain.value = 0.018
    lfoGain.connect(shimmerGain.gain)
    shimmer.connect(shimmerGain)
    shimmerGain.connect(revFilter)
    shimmer.start()

    // ── Filtered wind noise ──
    const bufferSize = ctx.sampleRate * 2
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    noise.loop = true
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 180
    noiseFilter.Q.value = 0.4
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.025
    lfoGain.connect(noiseGain.gain)
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(revFilter)
    noise.start()
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

    // Micro-detune LFO per drone for organic movement
    const detuneLfo = ctx.createOscillator()
    detuneLfo.frequency.value = 0.03 + Math.random() * 0.04
    const detuneGain = ctx.createGain()
    detuneGain.gain.value = 4
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
      // Fade out
      if (masterRef.current && ctxRef.current) {
        const now = ctxRef.current.currentTime
        masterRef.current.gain.cancelScheduledValues(now)
        masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, now)
        masterRef.current.gain.linearRampToValueAtTime(0.00001, now + 2)
      }
      setPlaying(false)
    } else {
      // First time: build graph
      if (!ctxRef.current) {
        const ctx = new AudioContext()
        ctxRef.current = ctx
        buildGraph(ctx)
        setReady(true)
      }
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') ctx.resume()

      // Fade in slowly
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
