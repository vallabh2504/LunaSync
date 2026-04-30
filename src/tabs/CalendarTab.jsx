import CalendarView from '../components/CalendarView'

const CalendarTab = ({ lastPeriod, smartCycleLength, flowLog, onFlowLog }) => {
  const last       = new Date(lastPeriod)
  const nextPeriod = new Date(last.getTime() + smartCycleLength * 86400000)
  const ovulation  = new Date(nextPeriod.getTime() - 14 * 86400000)
  const fertStart  = new Date(ovulation.getTime() - 5 * 86400000)
  const fertEnd    = new Date(ovulation.getTime() + 86400000)
  const today      = new Date()

  const daysUntilNext = Math.ceil((nextPeriod - today) / 86400000)
  const daysUntilOv   = Math.ceil((ovulation - today) / 86400000)
  const inFertile     = today >= fertStart && today <= fertEnd
  const isOvDay       = today.toDateString() === ovulation.toDateString()

  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div className="space-y-4 pt-2">
      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4 text-center">
          <p className="text-[10px] font-bold text-gray-400 dark:text-purple-400 uppercase tracking-widest mb-1">Next Period</p>
          <p className="text-4xl font-black text-pink-500">{daysUntilNext > 0 ? daysUntilNext : '🩸'}</p>
          <p className="text-xs text-gray-400 dark:text-purple-400 mt-0.5">{daysUntilNext > 0 ? 'days away' : 'Today'}</p>
        </div>
        <div className={`rounded-2xl p-4 text-center border shadow-sm transition-colors
          ${isOvDay || inFertile
            ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800'
            : 'bg-white dark:bg-[#1a1033] border-pink-100 dark:border-[#2d1b4e]'}`}>
          <p className="text-[10px] font-bold text-gray-400 dark:text-purple-400 uppercase tracking-widest mb-1">
            {isOvDay ? 'Ovulation' : 'Ovulation In'}
          </p>
          <p className={`text-4xl font-black ${isOvDay ? 'text-teal-500' : inFertile ? 'text-emerald-500' : 'text-teal-500'}`}>
            {isOvDay ? '✨' : daysUntilOv > 0 ? daysUntilOv : '~'}
          </p>
          <p className="text-xs text-gray-400 dark:text-purple-400 mt-0.5">
            {isOvDay ? 'Today!' : inFertile ? '🌿 Fertile' : daysUntilOv > 0 ? 'days away' : 'passed'}
          </p>
        </div>
      </div>

      <CalendarView
        lastPeriod={lastPeriod}
        cycleLength={smartCycleLength}
        flowLog={flowLog}
        onFlowLog={onFlowLog}
      />

      {/* Cycle info */}
      <div className="card p-4">
        <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3 text-sm flex items-center gap-2">🌿 This Cycle</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between"><span>📅 Next period</span><span className="font-bold text-pink-500">{fmt(nextPeriod)}</span></div>
          <div className="flex justify-between"><span>🌸 Ovulation</span><span className="font-bold text-teal-500">{fmt(ovulation)}</span></div>
          <div className="flex justify-between"><span>🌿 Fertile window</span><span className="font-bold text-emerald-500">{fmt(fertStart)} – {fmt(fertEnd)}</span></div>
        </div>
        <p className="text-[10px] text-purple-400 dark:text-purple-500 italic mt-3">Tap any calendar day to log period flow</p>
      </div>
    </div>
  )
}

export default CalendarTab
