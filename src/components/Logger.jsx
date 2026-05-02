import { useState } from 'react'

const MOODS = [
  { label: 'Happy',    emoji: '😊' }, { label: 'Sad',      emoji: '😢' },
  { label: 'Angry',   emoji: '😠' }, { label: 'Tired',    emoji: '😴' },
  { label: 'Energetic',emoji:'⚡' }, { label: 'Anxious',  emoji: '😰' },
  { label: 'Calm',    emoji: '😌' }, { label: 'Loved',    emoji: '🥰' },
]

const CRAVINGS = [
  { label: 'Chocolate', emoji: '🍫' }, { label: 'Salty', emoji: '🍟' },
  { label: 'Sweet',     emoji: '🍬' }, { label: 'Carbs', emoji: '🍞' },
  { label: 'Spicy',     emoji: '🌶️' }, { label: 'Healthy', emoji: '🥗' },
]

const SYMPTOMS = [
  { key: 'cramps',   label: 'Cramps'    },
  { key: 'bloating', label: 'Bloating'  },
  { key: 'headache', label: 'Headache'  },
  { key: 'backPain', label: 'Back pain' },
  { key: 'nausea',   label: 'Nausea'   },
]

const Section = ({ title, children }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9E8E8E' }}>{title}</p>
    {children}
  </div>
)

const Slider = ({ label, value, onChange }) => (
  <div className="py-2">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium" style={{ color: '#3D3035' }}>{label}</span>
      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
        style={{ background: '#F5DDE0', color: '#C4798D' }}>{value}/5</span>
    </div>
    <input type="range" min="1" max="5" value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
      style={{ background: `linear-gradient(to right, #C4798D ${(value-1)*25}%, #F5DDE0 ${(value-1)*25}%)` }}
    />
  </div>
)

const Logger = ({ onSaveLog }) => {
  const [mood,     setMood]     = useState([])
  const [cravings, setCravings] = useState([])
  const [energy,   setEnergy]   = useState(3)
  const [water,    setWater]    = useState(0)
  const [sleep,    setSleep]    = useState(0)
  const [notes,    setNotes]    = useState('')
  const [saved,    setSaved]    = useState(false)
  const [symptoms, setSymptoms] = useState({ cramps: 1, bloating: 1, headache: 1, backPain: 1, nausea: 1 })

  const toggle = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])

  const handleSave = () => {
    onSaveLog({ timestamp: new Date().toISOString(), date: new Date().toISOString().split('T')[0], mood, cravings, energy, water, sleep, symptoms, notes })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-5">
      {/* Water & Sleep */}
      <div className="rounded-2xl p-4 space-y-4"
        style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
        <Section title="Water intake">
          <div className="grid grid-cols-8 gap-1.5 mb-1.5">
            {Array.from({ length: 8 }, (_, i) => i + 1).map(i => (
              <button key={i} onClick={() => setWater(i === water ? i - 1 : i)}
                className="h-9 rounded-xl text-sm font-bold transition-all active:scale-90"
                style={{
                  background: water >= i ? '#2196F3' : '#F5DDE0',
                  color: water >= i ? '#FFFFFF' : '#C4798D',
                }}>
                {water >= i ? '💧' : ''}
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold text-center" style={{ color: '#9E8E8E' }}>{water}/8 glasses</p>
        </Section>
        <Section title="Sleep hours">
          <div className="grid grid-cols-8 gap-1.5 mb-1.5">
            {Array.from({ length: 8 }, (_, i) => i + 1).map(i => (
              <button key={i} onClick={() => setSleep(i === sleep ? i - 1 : i)}
                className="h-9 rounded-xl text-sm font-bold transition-all active:scale-90"
                style={{
                  background: sleep >= i ? '#7C6EBD' : '#F5DDE0',
                  color: sleep >= i ? '#FFFFFF' : '#C4798D',
                }}>
                {sleep >= i ? '🌙' : ''}
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold text-center" style={{ color: '#9E8E8E' }}>{sleep}/8 hours</p>
        </Section>
      </div>

      {/* Mood */}
      <div className="rounded-2xl p-4"
        style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
        <Section title="How are you feeling?">
          <div className="grid grid-cols-4 gap-2">
            {MOODS.map(m => (
              <button key={m.label} onClick={() => toggle(mood, setMood, m.label)}
                className="py-3 rounded-2xl flex flex-col items-center gap-1 transition-all active:scale-90"
                style={{
                  background: mood.includes(m.label) ? '#C4798D' : '#FAF5F2',
                  border: `1.5px solid ${mood.includes(m.label) ? '#C4798D' : 'rgba(232,180,188,0.30)'}`,
                }}>
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[10px] font-bold" style={{ color: mood.includes(m.label) ? '#FFFFFF' : '#9E8E8E' }}>
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </Section>
      </div>

      {/* Symptoms */}
      <div className="rounded-2xl p-4"
        style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
        <Section title="Symptoms (1–5)">
          <div className="divide-y" style={{ borderColor: 'rgba(232,180,188,0.18)' }}>
            {SYMPTOMS.map(s => (
              <Slider key={s.key} label={s.label}
                value={symptoms[s.key]}
                onChange={v => setSymptoms(p => ({ ...p, [s.key]: v }))} />
            ))}
          </div>
        </Section>
      </div>

      {/* Cravings */}
      <div className="rounded-2xl p-4"
        style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
        <Section title="Cravings">
          <div className="grid grid-cols-3 gap-2">
            {CRAVINGS.map(c => (
              <button key={c.label} onClick={() => toggle(cravings, setCravings, c.label)}
                className="py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-all active:scale-90"
                style={{
                  background: cravings.includes(c.label) ? '#F5DDE0' : '#FAF5F2',
                  color: cravings.includes(c.label) ? '#C4798D' : '#9E8E8E',
                  border: `1.5px solid ${cravings.includes(c.label) ? '#E8B4BC' : 'rgba(232,180,188,0.25)'}`,
                }}>
                <span>{c.emoji}</span><span>{c.label}</span>
              </button>
            ))}
          </div>
        </Section>
      </div>

      {/* Energy */}
      <div className="rounded-2xl p-4"
        style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
        <Section title="Energy level">
          <div className="flex justify-between items-center mb-3">
            {[
              { v: 1, label: 'Drained', icon: '😩' },
              { v: 2, label: 'Low',     icon: '😔' },
              { v: 3, label: 'Okay',    icon: '😐' },
              { v: 4, label: 'Good',    icon: '🙂' },
              { v: 5, label: 'High',    icon: '⚡' },
            ].map(({ v, label, icon }) => (
              <button key={v} onClick={() => setEnergy(v)}
                className="flex flex-col items-center gap-1 transition-all active:scale-90"
                style={{ opacity: energy === v ? 1 : 0.4 }}>
                <span className="text-xl">{icon}</span>
                <span className="text-[10px] font-semibold" style={{ color: energy === v ? '#C4798D' : '#9E8E8E' }}>{label}</span>
              </button>
            ))}
          </div>
        </Section>
      </div>

      {/* Notes */}
      <div className="rounded-2xl p-4"
        style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
        <Section title="Notes">
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            maxLength={200}
            placeholder="How are you feeling? Any extra details..."
            className="w-full p-3 text-sm rounded-xl resize-none outline-none"
            style={{
              background: '#FAF5F2',
              border: '1.5px solid rgba(232,180,188,0.30)',
              color: '#3D3035',
              fontFamily: 'Nunito, sans-serif',
              lineHeight: '1.6',
            }}
          />
        </Section>
      </div>

      {/* Save */}
      <button onClick={handleSave} disabled={saved}
        className="w-full py-4 rounded-full font-bold text-sm transition-all active:scale-95"
        style={{
          background: saved ? '#8FA895' : 'linear-gradient(135deg, #C4798D, #A85E72)',
          color: '#FFFFFF',
          boxShadow: saved ? 'none' : '0 6px 24px rgba(196,121,141,0.35)',
          fontFamily: 'Nunito, sans-serif',
        }}>
        {saved ? '✓ Saved!' : 'Save today\'s log'}
      </button>
    </div>
  )
}

export default Logger
