import { useState, useEffect } from 'react'

const GoodKarmaTracker = () => {
  const [wins, setWins]   = useState(() => {
    const s = localStorage.getItem('goodKarmaWins')
    return s ? JSON.parse(s) : []
  })
  const [input,       setInput]       = useState('')
  const [celebration, setCelebration] = useState(false)

  useEffect(() => { localStorage.setItem('goodKarmaWins', JSON.stringify(wins)) }, [wins])

  const todayStr  = new Date().toISOString().split('T')[0]
  const todayWin  = wins.find(w => w.date === todayStr)

  const submit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    const win = { date: todayStr, text: input.trim(), ts: new Date().toISOString() }
    setWins(prev => [...prev.filter(w => w.date !== todayStr), win])
    setInput('')
    setCelebration(true)
    setTimeout(() => setCelebration(false), 3000)
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 shadow-sm border-2 border-amber-200 dark:border-amber-800/40">
      <div className="text-center">
        <h2 className="text-lg font-bold text-amber-700 dark:text-amber-300 mb-0.5">✨ Good Karma Tracker</h2>
        <p className="text-amber-500 dark:text-amber-500 text-xs mb-4">Log your small win for today!</p>

        {celebration ? (
          <div className="animate-bounce mb-4">
            <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-4">
              <p className="text-3xl mb-1">🎉</p>
              <p className="text-lg font-bold text-white">Nuvvu Thop Bujji! 🌟</p>
              <p className="text-white/80 text-sm">Super proud of you! 💪</p>
            </div>
          </div>
        ) : todayWin ? (
          <div className="bg-amber-200/50 dark:bg-amber-800/30 rounded-2xl p-4 mb-4">
            <p className="text-amber-700 dark:text-amber-400 font-medium text-xs mb-1">Today's Win</p>
            <p className="text-base font-bold text-amber-900 dark:text-amber-200">🎯 {todayWin.text}</p>
            <p className="text-xs text-amber-500 dark:text-amber-500 mt-1.5">Great job, Bujji! 🌟</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mb-4">
            <input
              type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="e.g., I drank all 8 glasses 💧"
              className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 dark:border-amber-700 focus:border-amber-400 dark:focus:border-amber-500 outline-none text-sm bg-white/80 dark:bg-amber-900/20 dark:text-amber-200 dark:placeholder-amber-700 mb-3"
              maxLength={80}
            />
            <button type="submit" disabled={!input.trim()}
              className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-7 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              Log My Win ✓
            </button>
          </form>
        )}

        {wins.length > 0 && (
          <div className="pt-3 border-t border-amber-200 dark:border-amber-800/40">
            <p className="text-[10px] text-amber-500 dark:text-amber-600 mb-2 uppercase tracking-widest">Recent wins</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {wins.slice(-5).reverse().map((w, i) => (
                <span key={i} className="text-xs bg-amber-100 dark:bg-amber-800/30 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full">
                  {w.text}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GoodKarmaTracker
