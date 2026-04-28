const CycleHistory = ({ periodHistory, logs, cycleLength }) => {
  if (periodHistory.length === 0 && logs.length === 0) {
    return (
      <div className="card p-5">
        <h3 className="text-base font-bold text-indigo-600 dark:text-indigo-300 mb-3 flex items-center gap-2">
          <span className="bg-indigo-100 dark:bg-indigo-900 p-1.5 rounded-lg text-lg">📊</span> Cycle History
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
          Log your period flow on the Calendar to build cycle history
        </p>
      </div>
    )
  }

  // Compute cycle lengths from period history
  const cycleLengths = []
  for (let i = 1; i < periodHistory.length; i++) {
    const prev = new Date(periodHistory[i - 1].startDate)
    const curr = new Date(periodHistory[i].startDate)
    const diff = Math.round((curr - prev) / 86400000)
    if (diff > 15 && diff < 60) cycleLengths.push(diff)
  }

  const avgCycle  = cycleLengths.length ? Math.round(cycleLengths.reduce((a,b) => a+b,0) / cycleLengths.length) : cycleLength
  const shortestC = cycleLengths.length ? Math.min(...cycleLengths) : null
  const longestC  = cycleLengths.length ? Math.max(...cycleLengths) : null

  // Average mood per log
  const moodMap = { Happy: 5, Energetic: 5, Calm: 4, Loved: 4, Tired: 2, Sad: 2, Angry: 1, Anxious: 1 }
  const moodScores = logs.flatMap(l => (l.mood || []).map(m => moodMap[m] || 3))
  const avgMood = moodScores.length ? (moodScores.reduce((a,b) => a+b,0) / moodScores.length).toFixed(1) : null

  // Symptom averages
  const allSymptoms = logs.filter(l => l.symptoms)
  const avgCramps   = allSymptoms.length ? (allSymptoms.reduce((a, l) => a + (l.symptoms.cramps || 0), 0) / allSymptoms.length).toFixed(1) : null
  const avgSleep    = logs.filter(l => l.sleep).length ? (logs.filter(l=>l.sleep).reduce((a,l)=>a+l.sleep,0)/logs.filter(l=>l.sleep).length).toFixed(1) : null
  const avgWater    = logs.filter(l => l.water).length ? (logs.filter(l=>l.water).reduce((a,l)=>a+l.water,0)/logs.filter(l=>l.water).length).toFixed(1) : null

  const stats = [
    { label: 'Avg Cycle',    value: `${avgCycle}d`,       icon: '🔄', color: 'text-pink-500' },
    { label: 'Shortest',     value: shortestC ? `${shortestC}d` : '—', icon: '⬇️', color: 'text-purple-500' },
    { label: 'Longest',      value: longestC ? `${longestC}d` : '—',  icon: '⬆️', color: 'text-indigo-500' },
    { label: 'Cycles logged',value: periodHistory.length,              icon: '📅', color: 'text-teal-500' },
    { label: 'Avg mood',     value: avgMood || '—',                    icon: '😊', color: 'text-yellow-500' },
    { label: 'Avg cramps',   value: avgCramps ? `${avgCramps}/5` : '—', icon: '🩸', color: 'text-rose-500' },
    { label: 'Avg sleep',    value: avgSleep ? `${avgSleep}h` : '—',  icon: '🌙', color: 'text-indigo-400' },
    { label: 'Avg water',    value: avgWater ? `${avgWater} cups` : '—', icon: '💧', color: 'text-blue-500' },
  ]

  return (
    <div className="card p-5">
      <h3 className="text-base font-bold text-indigo-600 dark:text-indigo-300 mb-4 flex items-center gap-2">
        <span className="bg-indigo-100 dark:bg-indigo-900 p-1.5 rounded-lg text-lg">📊</span> Cycle History
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {stats.map(s => (
          <div key={s.label} className="bg-gray-50 dark:bg-[#0f0a1e]/60 rounded-xl p-3 text-center">
            <p className="text-lg mb-0.5">{s.icon}</p>
            <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {periodHistory.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Period Records</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {[...periodHistory].reverse().map((p, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-pink-50 dark:bg-pink-900/10 rounded-lg px-3 py-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  🩸 {new Date(p.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                {i > 0 && cycleLengths[periodHistory.length - 2 - i] && (
                  <span className="text-pink-500 dark:text-pink-400 font-bold">
                    {cycleLengths[periodHistory.length - 2 - i]}d cycle
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CycleHistory
