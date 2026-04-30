const PatternAnalysis = ({ logs, lastPeriod, cycleLength }) => {
  if (logs.length < 5) {
    return (
      <div className="card p-5">
        <h3 className="text-base font-bold text-purple-600 dark:text-purple-300 mb-2 flex items-center gap-2">
          <span className="bg-purple-100 dark:bg-purple-900 p-1.5 rounded-lg text-lg">🔬</span> Pattern Analysis
        </h3>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Log at least 5 days to unlock pattern analysis ✨</p>
          <div className="mt-2 h-2 bg-purple-100 dark:bg-purple-900 rounded-full overflow-hidden">
            <div className="h-full bg-purple-400 rounded-full transition-all" style={{ width: `${(logs.length / 5) * 100}%` }} />
          </div>
          <p className="text-xs text-purple-400 mt-1">{logs.length}/5 logs</p>
        </div>
      </div>
    )
  }

  const getCycleDay = (timestamp) => {
    const logDate   = new Date(timestamp)
    const start     = new Date(lastPeriod)
    const diff      = Math.floor((logDate - start) / 86400000)
    return ((diff % cycleLength) + cycleLength) % cycleLength + 1
  }

  // Build symptom averages per cycle day
  const dayData = {}
  logs.forEach(log => {
    const day = getCycleDay(log.timestamp)
    if (!dayData[day]) dayData[day] = { cramps: [], bloating: [], headache: [], energy: [], backPain: [], nausea: [] }
    if (log.symptoms?.cramps)   dayData[day].cramps.push(log.symptoms.cramps)
    if (log.symptoms?.bloating) dayData[day].bloating.push(log.symptoms.bloating)
    if (log.symptoms?.headache) dayData[day].headache.push(log.symptoms.headache)
    if (log.symptoms?.backPain) dayData[day].backPain.push(log.symptoms.backPain)
    if (log.symptoms?.nausea)   dayData[day].nausea.push(log.symptoms.nausea)
    if (log.energy)             dayData[day].energy.push(log.energy)
  })

  const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : null

  // Find peak symptom days
  const peakDays = {}
  Object.entries(dayData).forEach(([day, data]) => {
    const crampsAvg = avg(data.cramps)
    if (crampsAvg && crampsAvg >= 3) {
      if (!peakDays.cramps || crampsAvg > peakDays.cramps.avg) peakDays.cramps = { day: Number(day), avg: crampsAvg }
    }
    const energyAvg = avg(data.energy)
    if (energyAvg) {
      if (!peakDays.energy || energyAvg > peakDays.energy.avg) peakDays.energy = { day: Number(day), avg: energyAvg }
    }
  })

  // Mood frequency
  const moodCount = {}
  logs.forEach(log => {
    log.mood?.forEach(m => { moodCount[m] = (moodCount[m] || 0) + 1 })
  })
  const topMoods = Object.entries(moodCount).sort((a, b) => b[1] - a[1]).slice(0, 3)

  const moodEmoji = { Happy: '😊', Sad: '😢', Angry: '😠', Tired: '😴', Energetic: '⚡', Anxious: '😰', Calm: '😌', Loved: '🥰' }

  const insights = []
  if (peakDays.cramps) insights.push(`🩸 Cramps tend to peak around day ${peakDays.cramps.day} of your cycle (avg ${peakDays.cramps.avg}/5)`)
  if (peakDays.energy) insights.push(`⚡ Your energy is highest around cycle day ${peakDays.energy.day} (avg ${peakDays.energy.avg}/5)`)
  if (topMoods.length) insights.push(`💜 Your most frequent mood: ${topMoods[0][0]} ${moodEmoji[topMoods[0][0]] || ''} (${topMoods[0][1]}x logged)`)
  if (insights.length < 3) insights.push(`📊 Based on ${logs.length} log entries across your cycle`)

  return (
    <div className="card p-5">
      <h3 className="text-base font-bold text-purple-600 dark:text-purple-300 mb-4 flex items-center gap-2">
        <span className="bg-purple-100 dark:bg-purple-900 p-1.5 rounded-lg text-lg">🔬</span> Your Patterns
      </h3>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
      {topMoods.length >= 2 && (
        <div className="mt-4">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Mood Frequency</p>
          <div className="flex gap-2 flex-wrap">
            {topMoods.map(([mood, count]) => (
              <span key={mood} className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs px-3 py-1 rounded-full font-medium">
                {moodEmoji[mood]} {mood} ×{count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PatternAnalysis
