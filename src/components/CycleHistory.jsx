const CycleHistory = ({ periodHistory, logs, cycleLength }) => {
  if (periodHistory.length === 0 && logs.length === 0) {
    return (
      <div className="rounded-2xl p-8 text-center"
        style={{ background: '#FFF8F6', border: '1.5px dashed rgba(196,121,141,0.30)' }}>
        <div className="text-3xl mb-2">📊</div>
        <p className="font-semibold text-sm" style={{ color: '#C4798D' }}>No history yet</p>
        <p className="text-xs mt-1.5" style={{ color: '#9E8E8E' }}>Log period flow in the calendar to build your history</p>
      </div>
    )
  }

  const cycleLengths = []
  for (let i = 1; i < periodHistory.length; i++) {
    const diff = Math.round((new Date(periodHistory[i].startDate) - new Date(periodHistory[i-1].startDate)) / 86400000)
    if (diff > 15 && diff < 60) cycleLengths.push(diff)
  }

  const avgCycle  = cycleLengths.length ? Math.round(cycleLengths.reduce((a,b)=>a+b,0)/cycleLengths.length) : cycleLength
  const shortestC = cycleLengths.length ? Math.min(...cycleLengths) : null
  const longestC  = cycleLengths.length ? Math.max(...cycleLengths) : null

  const moodMap    = { Happy:5, Energetic:5, Calm:4, Loved:4, Tired:2, Sad:2, Angry:1, Anxious:1 }
  const moodScores = logs.flatMap(l => (l.mood||[]).map(m => moodMap[m]||3))
  const avgMood    = moodScores.length ? (moodScores.reduce((a,b)=>a+b,0)/moodScores.length).toFixed(1) : null
  const sympLogs   = logs.filter(l => l.symptoms)
  const avgCramps  = sympLogs.length ? (sympLogs.reduce((a,l)=>a+(l.symptoms.cramps||0),0)/sympLogs.length).toFixed(1) : null
  const sleepLogs  = logs.filter(l => l.sleep)
  const avgSleep   = sleepLogs.length ? (sleepLogs.reduce((a,l)=>a+l.sleep,0)/sleepLogs.length).toFixed(1) : null
  const waterLogs  = logs.filter(l => l.water)
  const avgWater   = waterLogs.length ? (waterLogs.reduce((a,l)=>a+l.water,0)/waterLogs.length).toFixed(1) : null

  const stats = [
    { label: 'Avg cycle',    value: `${avgCycle}d`,                        color: '#C4798D' },
    { label: 'Shortest',     value: shortestC ? `${shortestC}d` : '—',     color: '#8FA895' },
    { label: 'Longest',      value: longestC ? `${longestC}d` : '—',       color: '#9E8E8E' },
    { label: 'Cycles logged',value: String(periodHistory.length),           color: '#C4798D' },
    { label: 'Avg mood',     value: avgMood || '—',                        color: '#8FA895' },
    { label: 'Avg cramps',   value: avgCramps ? `${avgCramps}/5` : '—',    color: '#C4798D' },
    { label: 'Avg sleep',    value: avgSleep ? `${avgSleep}h` : '—',       color: '#9E8E8E' },
    { label: 'Avg water',    value: avgWater ? `${avgWater} cups` : '—',   color: '#8FA895' },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4"
        style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#9E8E8E' }}>Cycle statistics</p>
        <div className="grid grid-cols-2 gap-3">
          {stats.map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center"
              style={{ background: '#FAF5F2', border: '1px solid rgba(232,180,188,0.18)' }}>
              <p className="font-display text-2xl font-semibold mb-0.5" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9E8E8E' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {periodHistory.length > 0 && (
        <div className="rounded-2xl p-4"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9E8E8E' }}>Period records</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {[...periodHistory].reverse().map((p, i) => {
              const idx = periodHistory.length - 1 - i
              const len = cycleLengths[idx - 1]
              return (
                <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                  style={{ background: '#FAF5F2', border: '1px solid rgba(232,180,188,0.18)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#C4798D' }} />
                    <span className="text-sm font-medium" style={{ color: '#3D3035' }}>
                      {new Date(p.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  {len && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: '#F5DDE0', color: '#C4798D' }}>
                      {len}d cycle
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default CycleHistory
