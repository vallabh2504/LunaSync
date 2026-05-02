import { useState } from 'react'
import BreathingTimer from '../components/BreathingTimer'
import GoodKarmaTracker from '../components/GoodKarmaTracker'
import MissYou from '../components/MissYou'

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

const JOURNAL_PROMPTS = [
  "What does your body need most right now?",
  "What are three things you're grateful for today?",
  "How would your future self advise you in this moment?",
  "What emotion is most present for you today? Where do you feel it in your body?",
  "What would it mean to truly rest today?",
  "Write a love letter to your body, honoring what it does for you.",
]

const MeditationCard = ({ item }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-98"
    style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
      style={{ background: '#F5DDE0' }}>
      {item.icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-0.5">
        <p className="font-semibold text-sm" style={{ color: '#3D3035' }}>{item.title}</p>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#F5DDE0', color: '#C4798D' }}>
          {item.duration}
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: '#9E8E8E' }}>{item.desc}</p>
    </div>
  </div>
)

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
            background: entry.trim() ? 'linear-gradient(135deg, #C4798D, #A85E72)' : '#F5DDE0',
            color: entry.trim() ? '#FFFFFF' : '#C4798D',
            boxShadow: entry.trim() ? '0 4px 16px rgba(196,121,141,0.30)' : 'none',
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

const SelfCareTab = ({ currentPhaseKey, lastPeriod, smartCycleLength }) => {
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
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-semibold" style={{ color: '#3D3035' }}>Self care</h1>
        <p className="text-sm mt-1" style={{ color: '#9E8E8E' }}>Practices for every phase of your cycle.</p>
      </div>

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
            <div className="rounded-2xl p-4"
              style={{ background: '#FFF8F6', border: '1px solid rgba(232,180,188,0.25)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#9E8E8E' }}>
                Guided practices
              </p>
              <p className="text-sm" style={{ color: '#3D3035' }}>
                Choose a meditation for your mood and available time.
              </p>
            </div>
            <div className="space-y-3">
              {MEDITATIONS.map(item => <MeditationCard key={item.id} item={item} />)}
            </div>
          </>
        )}

        {/* JOURNAL tab */}
        {activeTab === 'journal' && <JournalSection />}

        {/* BREATH tab */}
        {activeTab === 'breath' && (
          <>
            <div className="rounded-2xl p-4"
              style={{ background: '#FFF8F6', border: '1px solid rgba(232,180,188,0.25)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#9E8E8E' }}>
                4-4-6 Breathing
              </p>
              <p className="text-sm" style={{ color: '#3D3035' }}>
                Inhale 4s · Hold 4s · Exhale 6s. Activates your parasympathetic nervous system.
              </p>
            </div>
            <BreathingTimer />
          </>
        )}
      </div>

      <div className="h-2" />
    </div>
  )
}

export default SelfCareTab
