import { useState, useEffect } from 'react'

function GoodKarmaTracker() {
  const [todayWin, setTodayWin] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)
  const [wins, setWins] = useState(() => {
    const saved = localStorage.getItem('goodKarmaWins')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('goodKarmaWins', JSON.stringify(wins))
  }, [wins])

  useEffect(() => {
    // Check if already logged today
    const todayStr = new Date().toISOString().split('T')[0]
    const todayWinData = wins.find(w => w.date === todayStr)
    
    if (todayWinData) {
      setTodayWin(todayWinData)
      setShowCelebration(false)
    } else {
      setTodayWin(null)
    }
  }, [wins])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const todayStr = new Date().toISOString().split('T')[0]
    const newWin = {
      date: todayStr,
      text: inputValue.trim(),
      timestamp: new Date().toISOString()
    }

    setWins(prev => [...prev, newWin])
    setTodayWin(newWin)
    setInputValue('')
    setShowCelebration(true)

    // Hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false)
    }, 3000)
  }

  return (
    <div className="bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 rounded-2xl p-6 shadow-lg border-2 border-amber-200">
      <div className="text-center">
        <h2 className="text-xl font-bold text-amber-700 mb-1">
          ✨ Good Karma Tracker
        </h2>
        <p className="text-amber-600 text-sm mb-4">Log your small win for today!</p>

        {/* Today's win display */}
        {todayWin && !showCelebration ? (
          <div className="bg-amber-200/50 rounded-xl p-4 mb-4">
            <p className="text-amber-800 font-medium">Today's Win:</p>
            <p className="text-lg font-bold text-amber-900">🎯 {todayWin.text}</p>
            <p className="text-xs text-amber-600 mt-2">Great job, Bujji! 🌟</p>
          </div>
        ) : !todayWin ? (
          /* Input form */
          <form onSubmit={handleSubmit} className="mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., I took a nap 💤"
              className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-sm bg-white/80"
              maxLength={50}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="mt-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log My Win ✓
            </button>
          </form>
        ) : null}

        {/* Celebration */}
        {showCelebration && (
          <div className="animate-bounce mb-4">
            <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl p-4">
              <p className="text-3xl mb-2">🎉</p>
              <p className="text-xl font-bold text-white">
                Nuvvu Thop Bujji! 🌟
              </p>
              <p className="text-white/80 text-sm">
                You did it! Super proud of you! 💪✨
              </p>
            </div>
          </div>
        )}

        {/* Recent wins */}
        {wins.length > 0 && (
          <div className="mt-4 pt-4 border-t border-amber-200">
            <p className="text-xs text-amber-600 mb-2">Recent wins:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {wins.slice(-5).reverse().map((win, idx) => (
                <span 
                  key={idx}
                  className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full"
                >
                  {win.text}
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
