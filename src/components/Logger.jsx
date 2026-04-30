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
  { key: 'cramps',   label: 'Cramps',           color: 'accent-pink-500' },
  { key: 'bloating', label: 'Bloating',          color: 'accent-purple-500' },
  { key: 'headache', label: 'Headache',          color: 'accent-rose-500' },
  { key: 'backPain', label: 'Back Pain',         color: 'accent-orange-400' },
  { key: 'nausea',   label: 'Nausea',            color: 'accent-indigo-400' },
]

const Slider = ({ label, value, onChange, color }) => (
  <div className="bg-pink-50 dark:bg-purple-900/20 p-3 rounded-xl border border-pink-100 dark:border-purple-800/40">
    <div className="flex justify-between items-center mb-1.5">
      <label className="text-xs font-bold text-gray-500 dark:text-gray-400">{label}</label>
      <span className="text-xs font-black text-pink-500 dark:text-purple-300 bg-white dark:bg-purple-900/50 px-2 py-0.5 rounded-full border border-pink-100 dark:border-purple-700">{value}</span>
    </div>
    <input type="range" min="1" max="5" value={value} onChange={e => onChange(Number(e.target.value))}
      className={`w-full h-2 bg-pink-200 dark:bg-purple-800 rounded-lg appearance-none cursor-pointer ${color}`} />
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
    onSaveLog({ timestamp: new Date().toISOString(), mood, cravings, energy, water, sleep, symptoms, notes })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="card p-5 space-y-5">
      <h3 className="text-lg font-bold text-pink-500 dark:text-pink-400 flex items-center gap-2">
        <span className="bg-pink-100 dark:bg-pink-900 p-2 rounded-xl text-xl">📝</span> Log Today
      </h3>

      {/* Water & Sleep */}
      <div className="bg-pink-50 dark:bg-purple-900/20 p-4 rounded-2xl border border-pink-100 dark:border-purple-800/30 space-y-4">
        <div>
          <div className="grid grid-cols-8 gap-1.5 mb-1.5">
            {Array.from({ length: 8 }, (_, i) => i + 1).map(i => (
              <button key={i} onClick={() => setWater(i === water ? i - 1 : i)}
                className={`h-9 rounded-lg text-sm font-bold transition-all active:scale-90
                  ${water >= i ? 'bg-blue-400 text-white shadow-sm' : 'bg-white dark:bg-blue-900/20 text-gray-300 dark:text-gray-600 border border-gray-100 dark:border-blue-900'}`}>
                {water >= i ? '💧' : ''}
              </button>
            ))}
          </div>
          <p className="text-xs font-bold text-blue-500 text-center">Water ({water}/8 cups)</p>
        </div>
        <div>
          <div className="grid grid-cols-8 gap-1.5 mb-1.5">
            {Array.from({ length: 8 }, (_, i) => i + 1).map(i => (
              <button key={i} onClick={() => setSleep(i === sleep ? i - 1 : i)}
                className={`h-9 rounded-lg text-sm font-bold transition-all active:scale-90
                  ${sleep >= i ? 'bg-indigo-400 text-white shadow-sm' : 'bg-white dark:bg-indigo-900/20 text-gray-300 dark:text-gray-600 border border-gray-100 dark:border-indigo-900'}`}>
                {sleep >= i ? '🌙' : ''}
              </button>
            ))}
          </div>
          <p className="text-xs font-bold text-indigo-500 text-center">Sleep ({sleep}/8 hrs)</p>
        </div>
      </div>

      {/* Mood */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Mood</h4>
        <div className="grid grid-cols-4 gap-2">
          {MOODS.map(m => (
            <button key={m.label} onClick={() => toggle(mood, setMood, m.label)}
              className={`p-2.5 rounded-2xl border transition-all active:scale-90 flex flex-col items-center gap-1
                ${mood.includes(m.label) ? 'bg-pink-500 text-white border-pink-600 shadow-md' : 'bg-gray-50 dark:bg-purple-900/10 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-purple-800/30 hover:bg-pink-50'}`}>
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[10px] font-bold">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Symptoms (1–5)</h4>
        <div className="space-y-2">
          {SYMPTOMS.map(s => (
            <Slider key={s.key} label={s.label} color={s.color}
              value={symptoms[s.key]}
              onChange={v => setSymptoms(p => ({ ...p, [s.key]: v }))} />
          ))}
        </div>
      </div>

      {/* Cravings */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Cravings</h4>
        <div className="grid grid-cols-3 gap-2">
          {CRAVINGS.map(c => (
            <button key={c.label} onClick={() => toggle(cravings, setCravings, c.label)}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all active:scale-90 flex items-center justify-center gap-1.5
                ${cravings.includes(c.label) ? 'bg-orange-400 text-white border-orange-500 shadow-sm' : 'bg-white dark:bg-orange-900/10 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-orange-900/30 hover:bg-orange-50'}`}>
              <span>{c.emoji}</span><span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Energy */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Energy Level</h4>
          <span className="text-xs font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-800">
            {energy === 1 ? 'Drained' : energy === 2 ? 'Low' : energy === 3 ? 'Okay' : energy === 4 ? 'Good' : 'High'} ⚡
          </span>
        </div>
        <input type="range" min="1" max="5" value={energy} onChange={e => setEnergy(Number(e.target.value))}
          className="w-full h-2 bg-yellow-200 dark:bg-yellow-900 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
      </div>

      {/* Notes */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Notes</h4>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          maxLength={200}
          placeholder="How are you feeling? Any extra details..."
          className="w-full p-3 text-sm rounded-xl bg-pink-50 dark:bg-purple-900/20 border border-pink-100 dark:border-purple-800/30 outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-500 resize-none text-gray-700 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-600"
        />
      </div>

      <button onClick={handleSave} disabled={saved}
        className={`w-full py-4 rounded-2xl text-white font-extrabold text-base shadow-lg transition-all active:scale-95
          ${saved ? 'bg-emerald-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-pink-200 dark:shadow-pink-900/30'}`}>
        {saved ? '✅ Saved!' : 'Save Log 💾'}
      </button>
    </div>
  )
}

export default Logger
