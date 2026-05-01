import { useState, useEffect, useRef } from 'react'

const PHASES = [
  { key: 'inhale',  label: 'Breathe In',  icon: '🌸', dur: 4, gradient: 'from-cyan-400 to-sky-500',     glow: 'rgba(34,211,238,0.6)' },
  { key: 'hold',    label: 'Hold',        icon: '✨', dur: 4, gradient: 'from-violet-400 to-purple-600', glow: 'rgba(139,92,246,0.6)' },
  { key: 'exhale',  label: 'Breathe Out', icon: '💨', dur: 6, gradient: 'from-pink-400 to-rose-500',    glow: 'rgba(244,114,182,0.6)' },
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
    <div className="card p-5 card-in">
      <div className="text-center">
        <h2 className="text-base font-black text-gradient mb-0.5">🌙 Breathing Relief</h2>
        <p className="text-[11px] text-purple-400 dark:text-purple-500 mb-4 font-medium">
          Inhale 4s · Hold 4s · Exhale 6s
        </p>

        {/* Breathing circle */}
        <div className="flex justify-center mb-5 relative" style={{ height: '160px' }}>
          {active && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-44 h-44 rounded-full border-2 border-purple-300/30 ring-pulse absolute" />
            </div>
          )}

          {/* SVG progress ring */}
          {active && (
            <svg className="absolute inset-0 m-auto w-40 h-40" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <circle
                cx="50" cy="50" r="46" fill="none"
                stroke={phaseIdx === 0 ? '#22d3ee' : phaseIdx === 1 ? '#a78bfa' : '#f472b6'}
                strokeWidth="3.5" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 46}`}
                strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress / 100)}`}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
          )}

          <div
            className={`w-36 h-36 rounded-full flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10
              ${active
                ? `bg-gradient-to-br ${phase.gradient} shadow-2xl`
                : 'bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50'
              } ${phase.key === 'inhale' ? 'breathe-in' : phase.key === 'hold' ? '' : active ? 'breathe-out' : ''}`}
            style={{ transition: 'background 0.8s ease', ...circleStyle }}
          >
            {active ? (
              <div className="text-center text-white select-none">
                <p className="text-3xl mb-0.5 drop-shadow">{phase.icon}</p>
                <p className="text-[11px] font-bold opacity-90 tracking-wide uppercase">{phase.label}</p>
                <p className="text-4xl font-black tabular-nums leading-none mt-0.5">{countdown}</p>
              </div>
            ) : (
              <span className="text-5xl float select-none">🧘‍♀️</span>
            )}
          </div>
        </div>

        {active && cycles > 0 && (
          <p className="text-xs text-purple-400 mb-2 font-semibold card-in">Round {cycles + 1} 🌀</p>
        )}

        {/* Start / Stop */}
        <div className="flex gap-3 justify-center mb-4">
          {!active ? (
            <button onClick={start}
              className="btn-shimmer bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-3 rounded-full font-black text-sm shadow-lg shadow-purple-400/40 hover:scale-105 transition-all active:scale-95">
              ▶ Start
            </button>
          ) : (
            <button onClick={stop}
              className="bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/30 text-gray-600 dark:text-gray-300 px-10 py-3 rounded-full font-bold text-sm hover:bg-white/30 transition-all active:scale-95">
              ⏹ Stop
            </button>
          )}
        </div>

        {/* Volume slider */}
        {active && (
          <div className="flex items-center gap-2 mb-4 px-4 card-in">
            <span className="text-sm select-none">🔈</span>
            <input type="range" min="0" max="100" value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="flex-1 h-1.5 appearance-none bg-purple-200 dark:bg-purple-900/50 rounded-full outline-none cursor-pointer" />
            <span className="text-sm select-none">🔊</span>
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
                className={`flex flex-col items-center px-3 py-2 rounded-xl text-center transition-all duration-200 min-w-[68px] active:scale-95
                  ${soundId === s.id
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/50 dark:border-purple-500/40 scale-105 shadow-md'
                    : 'bg-white/40 dark:bg-white/5 border border-transparent hover:border-purple-200 dark:hover:border-purple-700/50'
                  }`}>
                <span className="text-xl mb-0.5">{s.emoji}</span>
                <span className={`text-[10px] font-bold leading-tight ${soundId === s.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-500'}`}>
                  {s.name}
                </span>
                <span className="text-[9px] text-gray-400 dark:text-gray-600 mt-0.5">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-purple-400/50 mt-3">🎧 Headphones recommended</p>
      </div>
    </div>
  )
}

export default BreathingTimer
