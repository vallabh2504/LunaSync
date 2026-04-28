import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const MOOD_SCORES = { Happy: 5, Energetic: 5, Calm: 4, Loved: 4, Sad: 2, Tired: 2, Angry: 1, Anxious: 1 }

const MoodChart = ({ logs }) => {
  const data = Array.from({ length: 7 }, (_, i) => {
    const date    = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split('T')[0]
    const day     = date.toLocaleDateString('en-US', { weekday: 'short' })
    const dayLogs = logs.filter(l => l.timestamp.startsWith(dateStr))
    if (!dayLogs.length) return { day, mood: null }
    const scores  = dayLogs.flatMap(l => (l.mood || []).map(m => MOOD_SCORES[m] || 3))
    const mood    = scores.length ? scores.reduce((a,b) => a+b,0) / scores.length : null
    return { day, mood }
  })

  const hasMood = data.some(d => d.mood)

  if (!hasMood) return (
    <div className="card p-4">
      <h3 className="text-sm font-bold text-purple-500 dark:text-purple-400 mb-2 uppercase tracking-widest">Mood Trend 📈</h3>
      <div className="h-28 flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-900/20 rounded-xl border-2 border-dashed border-purple-200 dark:border-purple-800">
        <span className="text-3xl mb-1">🌸</span>
        <p className="text-xs text-purple-400 dark:text-purple-500 font-medium text-center px-4">Start logging mood to see your trends</p>
      </div>
    </div>
  )

  return (
    <div className="card p-4">
      <h3 className="text-sm font-bold text-purple-500 dark:text-purple-400 mb-3 uppercase tracking-widest">Mood Trend 📈</h3>
      <div className="h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9333ea' }} stroke="#c084fc" tickLine={false}
              axisLine={{ stroke: '#e9d5ff', strokeWidth: 2 }} />
            <YAxis domain={[0,5]} ticks={[1,2,3,4,5]} tick={{ fontSize: 10, fill: '#9333ea' }}
              tickLine={false} axisLine={false}
              tickFormatter={v => ({ 1:'😢',2:'😴',3:'😐',4:'😊',5:'⚡' }[v] || '')} />
            <Tooltip contentStyle={{ borderRadius:'12px', border:'none', boxShadow:'0 4px 20px rgba(147,51,234,0.15)', backgroundColor:'#faf5ff', fontSize:'12px' }}
              itemStyle={{ color:'#9333ea', fontWeight:600 }}
              labelStyle={{ color:'#7e22ce', fontWeight:700 }}
              formatter={v => [v ? v.toFixed(1) : '-', 'Mood']} />
            <Line type="monotone" dataKey="mood" stroke="#9333ea" strokeWidth={3}
              dot={{ fill:'#a855f7', r:4, stroke:'#fff', strokeWidth:2 }}
              activeDot={{ r:6, fill:'#7e22ce', stroke:'#fff', strokeWidth:2 }}
              connectNulls animationDuration={800} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default MoodChart
