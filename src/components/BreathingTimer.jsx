import { useState, useEffect, useRef } from 'react'

const PHASES = [
  { key: 'inhale',  label: 'Breathe In',  icon: '🌸', dur: 4, gradient: 'from-luna-blush to-luna-rose',   glow: 'rgba(196,121,141,0.45)' },
  { key: 'hold',    label: 'Hold',        icon: '✨', dur: 4, gradient: 'from-luna-sage to-luna-sage',     glow: 'rgba(143,168,149,0.45)' },
  { key: 'exhale',  label: 'Breathe Out', icon: '💨', dur: 6, gradient: 'from-luna-rose to-luna-rose-deep',glow: 'rgba(168,94,114,0.45)' },
]

const SOUNDS = [
  { id: 'tibetan', emoji: '🎵', name: 'Tibetan Bowl',  desc: '396Hz healing' },
  { id: 'ocean',   emoji: '🌊', name: 'Ocean Waves',   desc: 'Slow wave rhythm' },
  { id: 'rain',    emoji: '🌧️', name: 'Gentle Rain',   desc: 'Soft rainfall' },
  { id: 'crystal', emoji: '🔮', name: 'Crystal Bowl',  desc: '528Hz love freq' },
  { id: 'lunar',   emoji: '🌙', name: 'Lunar Om',      desc: '136Hz earth tone' },
  { id: 'chimes',  emoji: '🎐', name: 'Wind Chimes',   desc: 'Pentatonic scales' },
  { id: 'forest',  emoji: '🌿', name: 'Forest',        desc: 'Birds & nature' },
  { id: 'cosmos',  emoji: '✨', name: 'Cosmos',        desc: 'Ethereal space pad' },
]

const buildSoundscape = (type, ctx, volNode) => {
  const master = ctx.createGain()
  master.gain.setValueAtTime(0, ctx.currentTime)
  master.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 2.5)
  master.connect(volNode)
  const live = []

  const osc = (freq, oscType = 'sine', vol = 0.2) => {
    const o = ctx.createOscillator(), g = ctx.createGain()
    o.type = oscType; o.frequency.value = freq; g.gain.value = vol
    o.connect(g); g.connect(master); o.start(); live.push(o)
    return { osc: o, gain: g }
  }

  const noise = (cutoff = 800, filterType = 'lowpass', q = 1) => {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate)
    const d = buf.getChannelData(0)
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1
      b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759; b2=0.96900*b2+w*0.1538520
      b3=0.86650*b3+w*0.3104856; b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980
      d[i]=(b0+b1+b2+b3+b4+b5+w*0.5362)*0.11
    }
    const src = ctx.createBufferSource(), flt = ctx.createBiquadFilter()
    src.buffer = buf; src.loop = true
    flt.type = filterType; flt.frequency.value = cutoff; flt.Q.value = q
    src.connect(flt); flt.connect(master); src.start(); live.push(src)
    return { src, flt }
  }

  const lfo = (target, rate = 0.1, depth = 100) => {
    const l = ctx.createOscillator(), lg = ctx.createGain()
    l.frequency.value = rate; lg.gain.value = depth
    l.connect(lg); lg.connect(target); l.start(); live.push(l)
  }

  switch (type) {
    case 'tibetan':
      [[396,0.30],[528,0.18],[741,0.10],[792,0.08]].forEach(([f,v]) => osc(f,'sine',v))
      lfo(osc(396.5,'sine',0.08).gain.gain, 0.3, 0.06)
      break
    case 'ocean': {
      const { flt } = noise(320, 'lowpass', 2)
      lfo(flt.frequency, 0.09, 260)
      flt.frequency.setValueAtTime(320, ctx.currentTime)
      break
    }
    case 'rain':
      noise(3500,'bandpass',0.6); noise(1800,'bandpass',0.3); noise(800,'lowpass',1)
      break
    case 'crystal':
      [[528,0.28],[1056,0.10],[264,0.14]].forEach(([f,v]) => osc(f,'sine',v))
      lfo(osc(529.2,'sine',0.08).gain.gain, 0.5, 0.05)
      break
    case 'lunar':
      osc(136.1,'sine',0.30); osc(272.2,'sine',0.15)
      osc(408.3,'sine',0.07); osc(136.8,'sine',0.09)
      break
    case 'chimes': {
      const scale = [293.66,329.63,369.99,440,493.88,587.33,659.25,739.99]
      const ring = () => {
        if (ctx.state === 'closed') return
        const freq = scale[Math.floor(Math.random() * scale.length)]
        const o = ctx.createOscillator(), g = ctx.createGain()
        o.type = 'sine'; o.frequency.value = freq
        g.gain.setValueAtTime(0.18, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5)
        o.connect(g); g.connect(master); o.start(); o.stop(ctx.currentTime + 3.5)
        setTimeout(ring, 900 + Math.random() * 3000)
      }
      for (let i = 0; i < 3; i++) setTimeout(ring, i * 600 + Math.random() * 800)
      break
    }
    case 'forest': {
      noise(700,'lowpass',1.2)
      const chirp = () => {
        if (ctx.state === 'closed') return
        const f = 2200 + Math.random() * 2000
        const o = ctx.createOscillator(), g = ctx.createGain()
        o.frequency.setValueAtTime(f, ctx.currentTime)
        o.frequency.linearRampToValueAtTime(f * 1.25, ctx.currentTime + 0.12)
        g.gain.setValueAtTime(0.06, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35)
        o.connect(g); g.connect(master); o.start(); o.stop(ctx.currentTime + 0.35)
        setTimeout(chirp, 1800 + Math.random() * 5000)
      }
      for (let i = 0; i < 2; i++) setTimeout(chirp, Math.random() * 3000)
      break
    }
    case 'cosmos':
      [[55,-5],[55,0],[55,5],[110,-3],[110,3],[165,0]].forEach(([f,det]) => {
        const o = ctx.createOscillator(), g = ctx.createGain()
        o.type = 'sine'; o.frequency.value = f; o.detune.value = det; g.gain.value = 0.14
        o.connect(g); g.connect(master); o.start(); live.push(o)
      })
      noise(6000,'highpass',4)
      break
  }

  return {
    stop: () => {
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.8)
      setTimeout(() => {
        live.forEach(n => { try { n.stop() } catch (_) {} })
        try { ctx.close() } catch (_) {}
      }, 1900)
    }
  }
}

const BreathingTimer = () => {
  const [active,    setActive]    = useState(false)
  const [phaseIdx,  setPhaseIdx]  = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [cycles,    setCycles]    = useState(0)
  const [soundId,   setSoundId]   = useState('tibetan')
  const [volume,    setVolume]    = useState(60)

  const ctxRef       = useRef(null)
  const soundRef     = useRef(null)
  const volNodeRef   = useRef(null)

  const phase = PHASES[phaseIdx]

  useEffect(() => {
    if (!active) return
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
    const next = (phaseIdx + 1) % PHASES.length
    if (next === 0) setCycles(c => c + 1)
    setPhaseIdx(next)
    setCountdown(PHASES[next].dur)
  }, [active, countdown, phaseIdx])

  useEffect(() => {
    if (volNodeRef.current && ctxRef.current) {
      volNodeRef.current.gain.linearRampToValueAtTime(
        volume / 100,
        ctxRef.current.currentTime + 0.2
      )
    }
  }, [volume])

  const start = () => {
    setActive(true); setPhaseIdx(0); setCountdown(PHASES[0].dur); setCycles(0)
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ctxRef.current = ctx
    const vol = ctx.createGain()
    vol.gain.value = volume / 100
    vol.connect(ctx.destination)
    volNodeRef.current = vol
    soundRef.current = buildSoundscape(soundId, ctx, vol)
  }

  const stop = () => {
    setActive(false); setPhaseIdx(0); setCountdown(0)
    soundRef.current?.stop()
    soundRef.current = null
  }

  const progress = active && phase.dur > 0 ? ((phase.dur - countdown) / phase.dur) * 100 : 0
  const circleStyle = active ? {
    boxShadow: `0 0 40px ${phase.glow}, 0 0 80px ${phase.glow.replace('0.6','0.2')}`,
    transform: phase.key === 'exhale' ? 'scale(1)' : phase.key === 'hold' ? 'scale(1.28)' : undefined,
  } : {}

  return (
    <div className="rounded-2xl p-5"
      style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#9E8E8E' }}>
          Breathing exercise
        </p>

        {/* Breathing circle */}
        <div className="flex justify-center mb-5 relative" style={{ height: '160px' }}>
          {active && (
            <svg className="absolute inset-0 m-auto w-40 h-40" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(232,180,188,0.20)" strokeWidth="3" />
              <circle
                cx="50" cy="50" r="46" fill="none"
                stroke={phaseIdx === 0 ? '#C4798D' : phaseIdx === 1 ? '#8FA895' : '#A85E72'}
                strokeWidth="3.5" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 46}`}
                strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress / 100)}`}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
          )}

          <div
            className={`w-36 h-36 rounded-full flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10
              ${phase.key === 'inhale' ? 'breathe-in' : phase.key === 'hold' ? '' : active ? 'breathe-out' : ''}`}
            style={{
              background: active
                ? phaseIdx === 0 ? 'linear-gradient(135deg, #E8B4BC, #C4798D)'
                  : phaseIdx === 1 ? 'linear-gradient(135deg, #B8CBBF, #8FA895)'
                  : 'linear-gradient(135deg, #C4798D, #A85E72)'
                : '#F5DDE0',
              boxShadow: active ? `0 0 40px ${phase.glow}` : 'none',
              transition: 'background 0.8s ease',
            }}
          >
            {active ? (
              <div className="text-center text-white select-none">
                <p className="text-3xl mb-0.5">{phase.icon}</p>
                <p className="text-[11px] font-bold opacity-90 tracking-wide uppercase">{phase.label}</p>
                <p className="font-display text-4xl font-semibold tabular-nums leading-none mt-0.5">{countdown}</p>
              </div>
            ) : (
              <span className="text-5xl select-none">🧘‍♀️</span>
            )}
          </div>
        </div>

        {active && cycles > 0 && (
          <p className="text-xs mb-2 font-semibold" style={{ color: '#C4798D' }}>Round {cycles + 1} 🌀</p>
        )}

        {/* Start / Stop */}
        <div className="flex gap-3 justify-center mb-4">
          {!active ? (
            <button onClick={start}
              className="px-10 py-3 rounded-full font-bold text-sm transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #C4798D, #A85E72)', color: '#FFFFFF', boxShadow: '0 4px 16px rgba(196,121,141,0.30)', fontFamily: 'Nunito, sans-serif' }}>
              ▶ Start
            </button>
          ) : (
            <button onClick={stop}
              className="px-10 py-3 rounded-full font-bold text-sm transition-all active:scale-95"
              style={{ background: '#F5DDE0', color: '#C4798D', fontFamily: 'Nunito, sans-serif' }}>
              ⏹ Stop
            </button>
          )}
        </div>

        {/* Volume slider */}
        {active && (
          <div className="flex items-center gap-2 mb-4 px-4">
            <span className="text-sm">🔈</span>
            <input type="range" min="0" max="100" value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="flex-1 appearance-none rounded-full outline-none cursor-pointer" style={{ height: '4px' }} />
            <span className="text-sm">🔊</span>
          </div>
        )}

        {/* Sound picker */}
        <div className="overflow-x-auto pb-1.5 -mx-2 px-2">
          <div className="flex gap-2 w-max">
            {SOUNDS.map(s => (
              <button key={s.id}
                onClick={() => {
                  setSoundId(s.id)
                  if (active) { stop(); setTimeout(() => { setSoundId(s.id) }, 50) }
                }}
                className="flex flex-col items-center px-3 py-2 rounded-xl text-center transition-all duration-200 min-w-[68px] active:scale-95"
                style={{
                  background: soundId === s.id ? '#F5DDE0' : '#FAF5F2',
                  border: `1.5px solid ${soundId === s.id ? '#E8B4BC' : 'rgba(232,180,188,0.20)'}`,
                  transform: soundId === s.id ? 'scale(1.05)' : 'scale(1)',
                }}>
                <span className="text-xl mb-0.5">{s.emoji}</span>
                <span className="text-[10px] font-bold leading-tight" style={{ color: soundId === s.id ? '#C4798D' : '#9E8E8E' }}>
                  {s.name}
                </span>
                <span className="text-[9px] mt-0.5" style={{ color: '#9E8E8E', opacity: 0.7 }}>{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-[10px] mt-3" style={{ color: '#9E8E8E', opacity: 0.6 }}>🎧 Headphones recommended</p>
      </div>
    </div>
  )
}

export default BreathingTimer
