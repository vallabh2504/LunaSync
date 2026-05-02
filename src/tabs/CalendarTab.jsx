import CalendarView from '../components/CalendarView'

const CalendarTab = ({ lastPeriod, smartCycleLength, flowLog, onFlowLog }) => {
  const last          = new Date(lastPeriod)
  const nextPeriod    = new Date(last.getTime() + smartCycleLength * 86400000)
  const ovulation     = new Date(nextPeriod.getTime() - 14 * 86400000)
  const fertStart     = new Date(ovulation.getTime() - 5 * 86400000)
  const fertEnd       = new Date(ovulation.getTime() + 86400000)
  const today         = new Date()
  const daysUntilNext = Math.ceil((nextPeriod - today) / 86400000)
  const daysUntilOv   = Math.ceil((ovulation - today) / 86400000)
  const inFertile     = today >= fertStart && today <= fertEnd
  const isOvDay       = today.toDateString() === ovulation.toDateString()
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div className="px-5 pt-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-semibold" style={{ color: '#3D3035' }}>Your Cycle</h1>
        <p className="text-sm mt-1" style={{ color: '#9E8E8E' }}>Track and understand your cycle calendar.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 text-center"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9E8E8E' }}>Next Period</p>
          <p className="font-display text-3xl font-bold leading-none mb-1"
            style={{ color: daysUntilNext <= 0 ? '#C4798D' : '#3D3035' }}>
            {daysUntilNext <= 0 ? '🩸' : daysUntilNext}
          </p>
          <p className="text-xs font-medium" style={{ color: '#9E8E8E' }}>
            {daysUntilNext <= 0 ? 'May have started' : 'days away'}
          </p>
        </div>
        <div className="rounded-2xl p-4 text-center transition-colors"
          style={{
            background: isOvDay || inFertile ? '#DFF0E4' : '#FFFFFF',
            boxShadow: '0 2px 14px rgba(61,48,53,0.06)',
            border: `1px solid ${isOvDay || inFertile ? 'rgba(143,168,149,0.35)' : 'rgba(232,180,188,0.22)'}`,
          }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9E8E8E' }}>
            {isOvDay ? 'Ovulation' : 'Ovulation in'}
          </p>
          <p className="font-display text-3xl font-bold leading-none mb-1"
            style={{ color: isOvDay || inFertile ? '#5E8068' : '#3D3035' }}>
            {isOvDay ? '✨' : daysUntilOv > 0 ? daysUntilOv : '~'}
          </p>
          <p className="text-xs font-medium" style={{ color: '#9E8E8E' }}>
            {isOvDay ? 'Today!' : inFertile ? '🌿 Fertile window' : daysUntilOv > 0 ? 'days away' : 'passed'}
          </p>
        </div>
      </div>

      {/* Calendar */}
      <CalendarView
        lastPeriod={lastPeriod}
        cycleLength={smartCycleLength}
        flowLog={flowLog}
        onFlowLog={onFlowLog}
      />

      {/* Cycle info */}
      <div className="rounded-2xl p-4"
        style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#9E8E8E' }}>
          <span>🌿</span> This cycle
        </h3>
        <div className="space-y-2.5">
          {[
            { icon: '🩸', label: 'Next period', value: fmt(nextPeriod), color: '#C4798D' },
            { icon: '🌸', label: 'Ovulation',   value: fmt(ovulation),  color: '#8FA895' },
            { icon: '🌿', label: 'Fertile window', value: `${fmt(fertStart)} – ${fmt(fertEnd)}`, color: '#5E8068' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">{item.icon}</span>
                <span className="text-sm" style={{ color: '#9E8E8E' }}>{item.label}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(232,180,188,0.25)' }}>
          <p className="text-[10px] italic" style={{ color: '#C4798D', opacity: 0.7 }}>
            Tap any calendar day to log period flow
          </p>
        </div>
      </div>

      <div className="h-2" />
    </div>
  )
}

export default CalendarTab
