import { useEffect, useRef, useState } from 'react'
import BreathingTimer from '../components/BreathingTimer'
import GoodKarmaTracker from '../components/GoodKarmaTracker'
import MissYou from '../components/MissYou'
import { LunaCard, LunaSectionHeader } from '../components/LunaPrimitives'

const PHASE_CARE = {
  menstruation: {
    title: 'Soothing period relief',
    desc: 'Gentle practices to ease discomfort and restore calm.',
    color: '#C4798D',
    bg: '#F5DDE0',
    tips: [
      { icon: '🫖', title: 'Warm ginger tea', desc: 'Eases cramps and nausea naturally' },
      { icon: '🛁', title: 'Warm bath soak', desc: 'Add Epsom salts to relax muscles' },
      { icon: '🔥', title: 'Heat therapy', desc: 'Hot water bottle on abdomen or lower back' },
      { icon: '🧘', title: 'Gentle yoga', desc: 'Child\'s pose, supine twists — avoid inversions' },
    ],
  },
  follicular: {
    title: 'Rise & bloom',
    desc: 'Channel your rising energy with these practices.',
    color: '#8FA895',
    bg: '#DFF0E4',
    tips: [
      { icon: '🏃', title: 'Light cardio', desc: 'Walking, cycling or dancing — energy is up!' },
      { icon: '✍️', title: 'Journaling', desc: 'Set intentions for the coming weeks' },
      { icon: '🌱', title: 'Try something new', desc: 'Great time to start a new habit or project' },
      { icon: '💧', title: 'Hydrate well', desc: 'Support your rising energy with water' },
    ],
  },
  ovulation: {
    title: 'Peak energy practices',
    desc: 'You\'re at your vibrant peak — make the most of it.',
    color: '#C4798D',
    bg: '#F5DDE0',
    tips: [
      { icon: '💃', title: 'Dance or HIIT', desc: 'High energy workouts suit this phase perfectly' },
      { icon: '🤝', title: 'Social connection', desc: 'You\'re most magnetic and communicative now' },
      { icon: '🎨', title: 'Creative projects', desc: 'Channel peak creativity into passion projects' },
      { icon: '🥗', title: 'Light, fresh foods', desc: 'Raw vegetables and antioxidant-rich foods' },
    ],
  },
  luteal: {
    title: 'Slow down & nourish',
    desc: 'Gentle self-care as your body prepares to rest.',
    color: '#9E8E8E',
    bg: '#EDE7E0',
    tips: [
      { icon: '🫶', title: 'Extra self-compassion', desc: 'Be gentle with your expectations' },
      { icon: '🌙', title: 'More sleep', desc: 'Aim for 8–9 hours as progesterone rises' },
      { icon: '🧘', title: 'Restorative yoga', desc: 'Yin yoga and slow stretching feel great' },
      { icon: '🍫', title: 'Healthy comfort', desc: 'Dark chocolate, magnesium-rich foods help' },
    ],
  },
}

const MEDITATIONS = [
  { id: 'm1', title: 'Body scan', duration: '5 min', icon: '🌸', desc: 'A gentle scan to release tension from head to toe.' },
  { id: 'm2', title: 'Loving kindness', duration: '10 min', icon: '💗', desc: 'Cultivate compassion for yourself and others.' },
  { id: 'm3', title: 'Moon breathwork', duration: '7 min', icon: '🌙', desc: 'Lunar-inspired breathing for deep calm.' },
  { id: 'm4', title: 'Grounding visualization', duration: '8 min', icon: '🌿', desc: 'Root into the earth and find your center.' },
]

const MEDITATION_SOUND_LABELS = {
  m1: 'Somatic bloom',
  m2: 'Heart bowl',
  m3: 'Lunar tide',
  m4: 'Forest ground',
}

const MEDITATION_STEPS = {
  m1: ['Soften your jaw and shoulders.', 'Notice your chest and belly breathing.', 'Release tension through your hips.', 'Let your legs feel heavy and supported.'],
  m2: ['Offer kindness to yourself first.', 'Picture someone who makes you feel safe.', 'Send warmth toward your body today.', 'Rest in the feeling without forcing it.'],
  m3: ['Imagine moonlight cooling your inhale.', 'Hold that calm at the center of your chest.', 'Exhale slowly like a tide going out.', 'Let the rhythm become softer than effort.'],
  m4: ['Feel the floor holding you.', 'Picture roots from your feet into the earth.', 'Name one steady thing in this moment.', 'Return to your center with each breath.'],
}

const buildMeditationSoundscape = (type, ctx, outNode) => {
  const master = ctx.createGain()
  master.gain.setValueAtTime(0, ctx.currentTime)
  master.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 2.8)
  master.connect(outNode)
  const live = []
  const timers = []

  const remember = node => {
    live.push(node)
    return node
  }

  const osc = (freq, kind = 'sine', gain = 0.12, detune = 0) => {
    const o = remember(ctx.createOscillator())
    const g = ctx.createGain()
    o.type = kind
    o.frequency.value = freq
    o.detune.value = detune
    g.gain.value = gain
    o.connect(g)
    g.connect(master)
    o.start()
    return { osc: o, gain: g }
  }

  const noise = (seconds = 5, cutoff = 900, filterType = 'lowpass', gain = 0.08) => {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < data.length; i += 1) {
      last = (last * 0.985) + ((Math.random() * 2 - 1) * 0.015)
      data[i] = last
    }
    const source = remember(ctx.createBufferSource())
    const filter = ctx.createBiquadFilter()
    const g = ctx.createGain()
    source.buffer = buffer
    source.loop = true
    filter.type = filterType
    filter.frequency.value = cutoff
    g.gain.value = gain
    source.connect(filter)
    filter.connect(g)
    g.connect(master)
    source.start()
    return { source, filter, gain: g }
  }

  const lfo = (target, rate = 0.05, depth = 80) => {
    const wave = remember(ctx.createOscillator())
    const gain = ctx.createGain()
    wave.frequency.value = rate
    gain.gain.value = depth
    wave.connect(gain)
    gain.connect(target)
    wave.start()
  }

  const bell = (freq, delay = 0, gain = 0.1) => {
    const timer = setTimeout(() => {
      if (ctx.state === 'closed') return
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = freq
      g.gain.setValueAtTime(gain, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4)
      o.connect(g)
      g.connect(master)
      o.start()
      o.stop(ctx.currentTime + 4.1)
    }, delay)
    timers.push(timer)
  }

  switch (type) {
    case 'm1':
      osc(174, 'sine', 0.12)
      osc(261.63, 'sine', 0.08, -4)
      osc(329.63, 'sine', 0.045, 3)
      lfo(noise(6, 520, 'lowpass', 0.055).filter.frequency, 0.045, 180)
      bell(523.25, 1400, 0.055)
      bell(659.25, 5200, 0.04)
      break
    case 'm2':
      osc(220, 'sine', 0.10)
      osc(440, 'sine', 0.07, -3)
      osc(528, 'sine', 0.09, 2)
      lfo(osc(528.6, 'sine', 0.045).gain.gain, 0.22, 0.035)
      bell(660, 900, 0.07)
      bell(792, 4300, 0.045)
      break
    case 'm3': {
      const tide = noise(7, 360, 'lowpass', 0.10)
      lfo(tide.filter.frequency, 0.075, 250)
      osc(136.1, 'sine', 0.13)
      osc(272.2, 'sine', 0.075)
      osc(408.3, 'sine', 0.04)
      break
    }
    case 'm4': {
      const ground = noise(7, 760, 'lowpass', 0.085)
      lfo(ground.filter.frequency, 0.035, 130)
      osc(110, 'sine', 0.12)
      osc(220, 'sine', 0.07, -5)
      const chirpLoop = () => {
        if (ctx.state === 'closed') return
        bell(1800 + Math.random() * 1200, 0, 0.028)
        timers.push(setTimeout(chirpLoop, 2600 + Math.random() * 4200))
      }
      timers.push(setTimeout(chirpLoop, 1800))
      break
    }
  }

  return {
    stop: () => {
      timers.forEach(clearTimeout)
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)
      setTimeout(() => {
        live.forEach(node => { try { node.stop() } catch { /* noop */ } })
        try { ctx.close() } catch { /* noop */ }
      }, 1600)
    },
  }
}

const JOURNAL_PROMPTS = [
  "What does your body need most right now?",
  "What are three things you're grateful for today?",
  "How would your future self advise you in this moment?",
  "What emotion is most present for you today? Where do you feel it in your body?",
  "What would it mean to truly rest today?",
  "Write a love letter to your body, honoring what it does for you.",
]

const MeditationCard = ({ item, active, onSelect }) => (
  <button onClick={onSelect} className={`meditation-card ${active ? 'active' : ''}`}>
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
      style={{ background: 'var(--luna-blush-soft)' }}>
      {item.icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-0.5">
        <p className="font-semibold text-sm" style={{ color: '#3D3035' }}>{item.title}</p>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--luna-blush-soft)', color: 'var(--luna-theme-rose)' }}>
          {item.duration}
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: '#9E8E8E' }}>{item.desc}</p>
    </div>
  </button>
)

const MeditationStudio = () => {
  const [selectedId, setSelectedId] = useState(MEDITATIONS[0].id)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [volume, setVolume] = useState(55)
  const ctxRef = useRef(null)
  const soundRef = useRef(null)
  const volNodeRef = useRef(null)
  const selected = MEDITATIONS.find(item => item.id === selectedId) || MEDITATIONS[0]
  const totalSeconds = Number.parseInt(selected.duration, 10) * 60
  const progress = Math.min(100, (elapsed / totalSeconds) * 100)
  const steps = MEDITATION_STEPS[selected.id] || MEDITATION_STEPS.m1
  const currentStep = steps[Math.min(steps.length - 1, Math.floor((progress / 100) * steps.length))]

  const stopSoundscape = () => {
    soundRef.current?.stop()
    soundRef.current = null
    ctxRef.current = null
    volNodeRef.current = null
  }

  const startSoundscape = () => {
    stopSoundscape()
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const volumeNode = ctx.createGain()
    volumeNode.gain.value = volume / 100
    volumeNode.connect(ctx.destination)
    ctxRef.current = ctx
    volNodeRef.current = volumeNode
    soundRef.current = buildMeditationSoundscape(selected.id, ctx, volumeNode)
  }

  useEffect(() => {
    if (!playing) return undefined
    const timer = setInterval(() => {
      setElapsed(value => {
        if (value >= totalSeconds) {
          setPlaying(false)
          stopSoundscape()
          return totalSeconds
        }
        return value + 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [playing, totalSeconds])

  useEffect(() => {
    if (volNodeRef.current && ctxRef.current) {
      volNodeRef.current.gain.linearRampToValueAtTime(
        volume / 100,
        ctxRef.current.currentTime + 0.25
      )
    }
  }, [volume])

  useEffect(() => () => {
    soundRef.current?.stop()
  }, [])

  const selectMeditation = id => {
    setSelectedId(id)
    setPlaying(false)
    setElapsed(0)
    stopSoundscape()
  }

  const reset = () => {
    setPlaying(false)
    setElapsed(0)
    stopSoundscape()
  }

  const togglePlaying = () => {
    if (playing) {
      setPlaying(false)
      stopSoundscape()
      return
    }
    setPlaying(true)
    startSoundscape()
  }

  const minutes = Math.floor(elapsed / 60)
  const seconds = String(elapsed % 60).padStart(2, '0')

  return (
    <div className="space-y-4">
      <div className="meditation-player">
        <div className="meditation-orbit">
          <div className="meditation-ring" />
          <div className={`meditation-orb ${playing ? 'playing' : ''}`}>
            <span>{selected.icon}</span>
          </div>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--luna-muted)' }}>
          {selected.duration} ritual
        </p>
        <h3 className="font-display text-xl font-semibold mt-1" style={{ color: 'var(--luna-text)' }}>{selected.title}</h3>
        <p className="text-sm leading-relaxed mt-2 max-w-[17rem] mx-auto" style={{ color: 'var(--luna-muted)' }}>
          {playing ? currentStep : selected.desc}
        </p>
        <div className="meditation-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={togglePlaying}
            className="luna-action luna-action-primary !w-auto px-8 py-3"
          >
            {playing ? 'Pause' : elapsed > 0 ? 'Resume' : 'Start'}
          </button>
          <button onClick={reset} className="luna-action luna-action-secondary">
            {minutes}:{seconds}
          </button>
        </div>
        <div className="meditation-sound-panel">
          <span className="meditation-sound-label">
            {playing ? 'Now playing' : 'Soundscape'} · {MEDITATION_SOUND_LABELS[selected.id]}
          </span>
          <div className="meditation-volume-row">
            <span>Quiet</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={event => setVolume(Number(event.target.value))}
              aria-label="Meditation volume"
            />
            <span>Full</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {MEDITATIONS.map(item => (
          <MeditationCard
            key={item.id}
            item={item}
            active={selected.id === item.id}
            onSelect={() => selectMeditation(item.id)}
          />
        ))}
      </div>
    </div>
  )
}

const JournalSection = () => {
  const [prompt] = useState(() => JOURNAL_PROMPTS[Math.floor(Date.now() / 86400000) % JOURNAL_PROMPTS.length])
  const [entry, setEntry] = useState('')
  const [saved, setSaved] = useState(false)

  const save = () => {
    if (!entry.trim()) return
    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]')
    entries.push({ date: new Date().toISOString(), prompt, text: entry })
    localStorage.setItem('journalEntries', JSON.stringify(entries))
    setSaved(true)
    setTimeout(() => { setSaved(false); setEntry('') }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5"
        style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9E8E8E' }}>Today's prompt</p>
        <p className="font-display text-base font-medium italic leading-relaxed mb-4" style={{ color: '#3D3035' }}>
          "{prompt}"
        </p>
        <textarea
          value={entry}
          onChange={e => setEntry(e.target.value)}
          placeholder="Write freely, without judgment..."
          rows={5}
          className="w-full rounded-xl p-3 text-sm resize-none outline-none transition-all"
          style={{
            background: '#FAF5F2',
            border: '1.5px solid rgba(232,180,188,0.35)',
            color: '#3D3035',
            fontFamily: 'Nunito, sans-serif',
            lineHeight: '1.6',
          }}
        />
        <button
          onClick={save}
          disabled={!entry.trim()}
          className="mt-3 w-full py-3 rounded-full text-sm font-bold transition-all active:scale-95"
          style={{
            background: entry.trim() ? 'linear-gradient(135deg, var(--luna-theme-rose), var(--luna-theme-deep))' : 'var(--luna-blush-soft)',
            color: entry.trim() ? '#FFFFFF' : 'var(--luna-theme-rose)',
            boxShadow: entry.trim() ? '0 4px 16px color-mix(in srgb, var(--luna-theme-rose), transparent 70%)' : 'none',
          }}
        >
          {saved ? '✓ Saved!' : 'Save entry'}
        </button>
      </div>

      {/* Past entries teaser */}
      {(() => {
        const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]')
        if (!entries.length) return null
        const last = entries[entries.length - 1]
        return (
          <div className="rounded-2xl p-4"
            style={{ background: '#FFF8F6', border: '1px solid rgba(232,180,188,0.22)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9E8E8E' }}>
              Last entry · {new Date(last.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            <p className="text-sm italic leading-relaxed line-clamp-3" style={{ color: '#9E8E8E' }}>
              "{last.text.substring(0, 120)}{last.text.length > 120 ? '…' : ''}"
            </p>
          </div>
        )
      })()}
    </div>
  )
}

const SelfCareTab = ({ currentPhaseKey }) => {
  const [activeTab, setActiveTab] = useState('all')
  const care = PHASE_CARE[currentPhaseKey] || PHASE_CARE.follicular

  const TABS = [
    { id: 'all',        label: 'All' },
    { id: 'meditation', label: 'Meditation' },
    { id: 'journal',    label: 'Journal' },
    { id: 'breath',     label: 'Breath' },
  ]

  return (
    <div className="px-5 pt-6 space-y-5">
      <LunaSectionHeader
        eyebrow="Care ritual"
        title="Self care"
        subtitle="Practices for every phase of Bujji's cycle."
      />

      {/* Tabs */}
      <div className="luna-tab-bar">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`luna-tab-item ${activeTab === tab.id ? 'active' : ''}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="tab-content space-y-4" key={activeTab}>

        {/* ALL tab */}
        {activeTab === 'all' && (
          <>
            {/* Recommended card */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9E8E8E' }}>
                Recommended for you
              </p>
              <div className="rounded-3xl p-5 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${care.bg} 0%, #FAF5F2 100%)`, border: `1px solid ${care.bg}` }}>
                <div className="absolute top-4 right-4 opacity-30 pointer-events-none">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="30" r="22" fill={care.color} />
                    <circle cx="50" cy="23" r="19" fill="#FAF5F2" />
                    <ellipse cx="25" cy="60" rx="12" ry="6" transform="rotate(-30 25 60)" fill="#8FA895" opacity="0.8" />
                    <ellipse cx="58" cy="58" rx="10" ry="5" transform="rotate(25 58 58)" fill="#8FA895" opacity="0.8" />
                  </svg>
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                  style={{ background: 'rgba(255,255,255,0.7)', color: care.color }}>
                  Phase care
                </span>
                <h3 className="font-display text-xl font-medium mb-1" style={{ color: '#3D3035' }}>
                  {care.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9E8E8E' }}>{care.desc}</p>
              </div>
            </div>

            {/* Phase tips */}
            <div className="space-y-3">
              {care.tips.map((tip, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: care.bg }}>
                    {tip.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#3D3035' }}>{tip.title}</p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#9E8E8E' }}>{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Good karma */}
            <GoodKarmaTracker />

            {/* Partner love */}
            <MissYou />
          </>
        )}

        {/* MEDITATION tab */}
        {activeTab === 'meditation' && (
          <>
            <LunaCard className="p-4" tone="soft">
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#9E8E8E' }}>
                Guided practices
              </p>
              <p className="text-sm" style={{ color: '#3D3035' }}>
                Choose a meditation for your mood and available time.
              </p>
            </LunaCard>
            <MeditationStudio />
          </>
        )}

        {/* JOURNAL tab */}
        {activeTab === 'journal' && <JournalSection />}

        {/* BREATH tab */}
        {activeTab === 'breath' && (
          <>
            <LunaCard className="p-4" tone="soft">
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#9E8E8E' }}>
                4-4-6 Breathing
              </p>
              <p className="text-sm" style={{ color: '#3D3035' }}>
                Inhale 4s · Hold 4s · Exhale 6s. Activates your parasympathetic nervous system.
              </p>
            </LunaCard>
            <BreathingTimer />
          </>
        )}
      </div>

      <div className="h-2" />
    </div>
  )
}

export default SelfCareTab
