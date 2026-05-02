import { useState, useEffect } from 'react'

const GoodKarmaTracker = () => {
  const [wins, setWins]         = useState(() => {
    const s = localStorage.getItem('goodKarmaWins')
    return s ? JSON.parse(s) : []
  })
  const [input, setInput]       = useState('')
  const [celebration, setCelebration] = useState(false)

  useEffect(() => { localStorage.setItem('goodKarmaWins', JSON.stringify(wins)) }, [wins])

  const todayStr = new Date().toISOString().split('T')[0]
  const todayWin = wins.find(w => w.date === todayStr)

  const submit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setWins(prev => [...prev.filter(w => w.date !== todayStr), { date: todayStr, text: input.trim(), ts: new Date().toISOString() }])
    setInput('')
    setCelebration(true)
    setTimeout(() => setCelebration(false), 3000)
  }

  return (
    <div className="rounded-2xl p-4"
      style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9E8E8E' }}>
        Daily win ✨
      </p>

      {celebration ? (
        <div className="text-center py-3">
          <div className="text-3xl mb-1">🎉</div>
          <p className="font-semibold text-sm" style={{ color: '#C4798D' }}>Nuvvu Thop Bujji!</p>
          <p className="text-xs mt-0.5" style={{ color: '#9E8E8E' }}>Super proud of you!</p>
        </div>
      ) : todayWin ? (
        <div className="rounded-xl p-3" style={{ background: '#F5DDE0' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: '#9E8E8E' }}>Today's win</p>
          <p className="text-sm font-semibold" style={{ color: '#C4798D' }}>🎯 {todayWin.text}</p>
        </div>
      ) : (
        <form onSubmit={submit} className="flex gap-2">
          <input
            type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="e.g., I drank all 8 glasses 💧"
            className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: '#FAF5F2',
              border: '1.5px solid rgba(232,180,188,0.35)',
              color: '#3D3035',
              fontFamily: 'Nunito, sans-serif',
            }}
            maxLength={80}
          />
          <button type="submit" disabled={!input.trim()}
            className="px-4 rounded-xl font-bold text-sm transition-all active:scale-95 flex-shrink-0"
            style={{
              background: input.trim() ? 'linear-gradient(135deg, #C4798D, #A85E72)' : '#F5DDE0',
              color: input.trim() ? '#FFFFFF' : '#C4798D',
            }}>
            Log ✓
          </button>
        </form>
      )}

      {wins.length > 0 && !celebration && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(232,180,188,0.20)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9E8E8E' }}>Recent wins</p>
          <div className="flex flex-wrap gap-1.5">
            {wins.slice(-4).reverse().map((w, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: '#F5DDE0', color: '#C4798D' }}>
                {w.text.length > 25 ? w.text.substring(0, 25) + '…' : w.text}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GoodKarmaTracker
