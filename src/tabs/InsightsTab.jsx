import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import CycleHistory from '../components/CycleHistory'
import { LunaSectionHeader } from '../components/LunaPrimitives'

const MOOD_SCORES   = { Happy: 5, Energetic: 5, Calm: 4, Loved: 4, Sad: 2, Tired: 2, Angry: 1, Anxious: 1 }
const MOOD_EMOJI    = { Happy: '😊', Sad: '😢', Angry: '😠', Tired: '😴', Energetic: '⚡', Anxious: '😰', Calm: '😌', Loved: '🥰' }
const PHASE_COLORS  = { menstruation: '#C4798D', follicular: '#8FA895', ovulation: '#C4798D', luteal: '#9E8E8E' }

/* ── stat card ── */
const StatCard = ({ label, value, sub, color, icon }) => (
  <div className="rounded-2xl p-4 flex-1"
    style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9E8E8E' }}>{label}</p>
    <div className="flex items-end gap-1.5">
      {icon && <span className="text-base">{icon}</span>}
      <span className="font-display text-3xl font-semibold leading-none" style={{ color: color || '#3D3035' }}>{value}</span>
      {sub && <span className="text-xs mb-0.5" style={{ color: '#9E8E8E' }}>{sub}</span>}
    </div>
  </div>
)

/* ── OVERVIEW TAB ── */
const OverviewTab = ({ logs, periodHistory, cycleLength, lastPeriod, smartCycleLength }) => {
  const allCycles    = periodHistory.length
  const cycleLen     = smartCycleLength || cycleLength || 28

  // avg period length from history
  const avgPeriodLen = periodHistory.length >= 2
    ? Math.round(periodHistory.reduce((acc, p, i) => {
        if (i === 0) return acc
        const prev = periodHistory[i - 1]
        const days = Math.round((new Date(p.startDate) - new Date(prev.startDate)) / 86400000)
        return days > 15 && days < 60 ? acc + days : acc
      }, 0) / Math.max(1, periodHistory.length - 1))
    : cycleLen

  // most common mood
  const moodCount = {}
  logs.forEach(log => log.mood?.forEach(m => { moodCount[m] = (moodCount[m] || 0) + 1 }))
  const topMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0]

  // avg cramps
  const crampLogs = logs.filter(l => l.symptoms?.cramps)
  const avgCramps = crampLogs.length
    ? (crampLogs.reduce((a, l) => a + l.symptoms.cramps, 0) / crampLogs.length).toFixed(1)
    : null

  // mood frequency (top 3)
  const topMoods = Object.entries(moodCount).sort((a, b) => b[1] - a[1]).slice(0, 4)

  // Pattern insights
  const insights = []
  if (logs.length >= 5) {
    const getCycleDay = ts => {
      const diff = Math.floor((new Date(ts) - new Date(lastPeriod)) / 86400000)
      return ((diff % cycleLen) + cycleLen) % cycleLen + 1
    }
    const dayData = {}
    logs.forEach(log => {
      const day = getCycleDay(log.timestamp)
      if (!dayData[day]) dayData[day] = { cramps: [], energy: [] }
      if (log.symptoms?.cramps) dayData[day].cramps.push(log.symptoms.cramps)
      if (log.energy)           dayData[day].energy.push(log.energy)
    })
    const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null
    let peakCrampDay = null, peakEnergyDay = null
    Object.entries(dayData).forEach(([day, data]) => {
      const ca = avg(data.cramps)
      if (ca && ca >= 3 && (!peakCrampDay || ca > peakCrampDay.avg)) peakCrampDay = { day: Number(day), avg: ca }
      const ea = avg(data.energy)
      if (ea && (!peakEnergyDay || ea > peakEnergyDay.avg)) peakEnergyDay = { day: Number(day), avg: ea }
    })
    if (peakCrampDay)  insights.push(`Cramps tend to peak around cycle day ${peakCrampDay.day}`)
    if (peakEnergyDay) insights.push(`Your energy is highest around cycle day ${peakEnergyDay.day}`)
    if (topMood)       insights.push(`Your most frequent mood is ${topMood[0]} ${MOOD_EMOJI[topMood[0]] || ''}`)
    insights.push(`Based on ${logs.length} log entries`)
  }

  return (
    <div className="space-y-4">
      {/* Key stats row */}
      <div className="flex gap-3">
        <StatCard label="Avg cycle" value={avgPeriodLen} sub="days" icon="📅" />
        <StatCard label="Cycles logged" value={allCycles || '—'} icon="🔄" color="#8FA895" />
      </div>

      <div className="flex gap-3">
        <div className="rounded-2xl p-4 flex-1"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9E8E8E' }}>Most common mood</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{topMood ? MOOD_EMOJI[topMood[0]] : '🌸'}</span>
            <span className="font-semibold text-base" style={{ color: '#3D3035' }}>{topMood ? topMood[0] : '—'}</span>
          </div>
          {topMood && (
            <div className="flex gap-1 mt-2">
              {[1,2,3,4,5].map(s => (
                <div key={s} className="w-5 h-1.5 rounded-full"
                  style={{ background: s <= Math.round(topMood[1] / 3) ? '#C4798D' : '#F5DDE0' }} />
              ))}
            </div>
          )}
        </div>
        <div className="rounded-2xl p-4 flex-1"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9E8E8E' }}>Avg cramps</p>
          <div className="flex items-end gap-1.5">
            <span className="font-display text-3xl font-semibold leading-none" style={{ color: '#C4798D' }}>
              {avgCramps || '—'}
            </span>
            {avgCramps && <span className="text-xs mb-0.5" style={{ color: '#9E8E8E' }}>/5</span>}
          </div>
        </div>
      </div>

      {/* Mood frequency pills */}
      {topMoods.length > 0 && (
        <div className="rounded-2xl p-4"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9E8E8E' }}>Mood frequency</p>
          <div className="flex flex-wrap gap-2">
            {topMoods.map(([mood, count]) => (
              <span key={mood}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: '#F5DDE0', color: '#C4798D' }}>
                {MOOD_EMOJI[mood]} {mood}
                <span className="opacity-70">×{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pattern insights */}
      {insights.length > 0 && (
        <div className="rounded-2xl p-4"
          style={{ background: '#FFF8F6', boxShadow: '0 2px 14px rgba(61,48,53,0.05)', border: '1px solid rgba(232,180,188,0.22)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#9E8E8E' }}>
            <span>🔍</span> Pattern recognized
          </p>
          <div className="space-y-2.5">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#C4798D' }} />
                <p className="text-sm leading-relaxed" style={{ color: '#3D3035' }}>{insight}</p>
              </div>
            ))}
          </div>
          {logs.length >= 5 && (
            <button className="mt-4 w-full py-2.5 rounded-full text-xs font-bold transition-all active:scale-95"
              style={{ background: '#F5DDE0', color: '#C4798D' }}>
              Acknowledge ✓
            </button>
          )}
        </div>
      )}

      {logs.length < 5 && (
        <div className="rounded-2xl p-5 text-center"
          style={{ background: '#FFF8F6', border: '1.5px dashed rgba(196,121,141,0.30)' }}>
          <div className="text-3xl mb-2">🌱</div>
          <p className="text-sm font-semibold" style={{ color: '#C4798D' }}>Keep logging to unlock insights</p>
          <p className="text-xs mt-1.5" style={{ color: '#9E8E8E' }}>Log at least 5 days to see your patterns</p>
          <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: '#F5DDE0' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${(logs.length / 5) * 100}%`, background: 'linear-gradient(to right, #C4798D, #A85E72)' }} />
          </div>
          <p className="text-xs mt-1.5 font-semibold" style={{ color: '#C4798D' }}>{logs.length}/5 logs</p>
        </div>
      )}
    </div>
  )
}

/* ── TRENDS TAB (mood chart) ── */
const TrendsTab = ({ logs }) => {
  const data = Array.from({ length: 7 }, (_, i) => {
    const date    = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split('T')[0]
    const day     = date.toLocaleDateString('en-US', { weekday: 'short' })
    const dayLogs = logs.filter(l => l.timestamp?.startsWith(dateStr))
    if (!dayLogs.length) return { day, mood: null, cramps: null, energy: null }
    const moodScores = dayLogs.flatMap(l => (l.mood || []).map(m => MOOD_SCORES[m] || 3))
    const mood   = moodScores.length ? moodScores.reduce((a,b) => a+b,0) / moodScores.length : null
    const cramps = dayLogs.filter(l => l.symptoms?.cramps).reduce((a, l) => a + l.symptoms.cramps, 0) / Math.max(1, dayLogs.filter(l => l.symptoms?.cramps).length) || null
    const energy = dayLogs.filter(l => l.energy).reduce((a, l) => a + l.energy, 0) / Math.max(1, dayLogs.filter(l => l.energy).length) || null
    return { day, mood: mood || null, cramps: cramps || null, energy: energy || null }
  })

  const hasMood = data.some(d => d.mood)

  if (!hasMood) return (
    <div className="rounded-2xl p-8 text-center"
      style={{ background: '#FFF8F6', border: '1.5px dashed rgba(196,121,141,0.30)' }}>
      <div className="text-4xl mb-3">📈</div>
      <p className="font-semibold text-sm" style={{ color: '#C4798D' }}>No trends yet</p>
      <p className="text-xs mt-1.5" style={{ color: '#9E8E8E' }}>Start logging your mood to see your 7-day trend</p>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4"
        style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#9E8E8E' }}>7-Day mood trend</p>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -28, bottom: 5 }}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9E8E8E', fontFamily: 'Nunito' }}
                stroke="transparent" tickLine={false} />
              <YAxis domain={[0,5]} ticks={[1,2,3,4,5]} tick={{ fontSize: 10, fill: '#9E8E8E' }}
                tickLine={false} axisLine={false}
                tickFormatter={v => (['','😢','😴','😐','😊','⚡'][v] || '')} />
              <Tooltip
                contentStyle={{ borderRadius:'14px', border:'1px solid rgba(232,180,188,0.40)', boxShadow:'0 4px 20px rgba(196,121,141,0.15)', backgroundColor:'#FFFFFF', fontSize:'12px', fontFamily:'Nunito' }}
                itemStyle={{ color:'#C4798D', fontWeight:600 }}
                labelStyle={{ color:'#3D3035', fontWeight:700 }}
                formatter={v => [v ? v.toFixed(1) : '-', 'Mood']}
              />
              <Line type="monotone" dataKey="mood" stroke="#C4798D" strokeWidth={2.5}
                dot={{ fill:'#C4798D', r:3.5, stroke:'#fff', strokeWidth:2 }}
                activeDot={{ r:5.5, fill:'#A85E72', stroke:'#fff', strokeWidth:2 }}
                connectNulls animationDuration={600} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl p-4"
        style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#9E8E8E' }}>Symptom intensity (7 days)</p>
        <div className="space-y-3">
          {data.filter(d => d.cramps).length > 0 && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-semibold" style={{ color: '#3D3035' }}>🩸 Cramps</span>
                <span className="text-xs font-bold" style={{ color: '#C4798D' }}>
                  {(data.filter(d => d.cramps).reduce((a, d) => a + d.cramps, 0) / data.filter(d => d.cramps).length).toFixed(1)}/5
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F5DDE0' }}>
                <div className="h-full rounded-full"
                  style={{ width: `${(data.filter(d => d.cramps).reduce((a, d) => a + d.cramps, 0) / data.filter(d => d.cramps).length / 5) * 100}%`, background: 'linear-gradient(to right, #C4798D, #A85E72)' }} />
              </div>
            </div>
          )}
          {data.filter(d => d.energy).length > 0 && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-semibold" style={{ color: '#3D3035' }}>⚡ Energy</span>
                <span className="text-xs font-bold" style={{ color: '#8FA895' }}>
                  {(data.filter(d => d.energy).reduce((a, d) => a + d.energy, 0) / data.filter(d => d.energy).length).toFixed(1)}/5
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#DFF0E4' }}>
                <div className="h-full rounded-full"
                  style={{ width: `${(data.filter(d => d.energy).reduce((a, d) => a + d.energy, 0) / data.filter(d => d.energy).length / 5) * 100}%`, background: 'linear-gradient(to right, #8FA895, #5E8068)' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── HISTORY TAB ── */
const HistoryTab = ({ logs, periodHistory, cycleLength }) => (
  <div className="space-y-4">
    <CycleHistory periodHistory={periodHistory} logs={logs} cycleLength={cycleLength} />
  </div>
)

/* ── MAIN INSIGHTS TAB ── */
const InsightsTab = ({ logs, lastPeriod, cycleLength, smartCycleLength, periodHistory }) => {
  const [activeTab, setActiveTab] = useState('overview')

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'trends',   label: 'Trends' },
    { id: 'history',  label: 'History' },
  ]

  return (
    <div className="px-5 pt-6 space-y-5">
      <LunaSectionHeader
        eyebrow="Pattern lantern"
        title="Cycle Insights"
        subtitle="Understand Bujji's patterns and make choices that support her."
      />

      {/* Tabs */}
      <div className="luna-tab-bar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`luna-tab-item ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="tab-content" key={activeTab}>
        {activeTab === 'overview' && (
          <OverviewTab
            logs={logs} periodHistory={periodHistory}
            cycleLength={cycleLength} lastPeriod={lastPeriod}
            smartCycleLength={smartCycleLength}
          />
        )}
        {activeTab === 'trends' && <TrendsTab logs={logs} />}
        {activeTab === 'history' && (
          <HistoryTab logs={logs} periodHistory={periodHistory} cycleLength={cycleLength} />
        )}
      </div>

      <div className="h-2" />
    </div>
  )
}

export default InsightsTab
