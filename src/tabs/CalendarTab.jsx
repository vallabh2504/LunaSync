import CalendarView from '../components/CalendarView'
import { LunaCard, LunaPill, LunaSectionHeader } from '../components/LunaPrimitives'

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
      <LunaSectionHeader
        eyebrow="Moon map"
        title="Your Cycle"
        subtitle="Track flow, fertile windows, and the days Bujji may need extra tenderness."
      />

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <LunaCard className="p-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9E8E8E' }}>Next Period</p>
          <p className="font-display text-3xl font-bold leading-none mb-1"
            style={{ color: daysUntilNext <= 0 ? '#C4798D' : '#3D3035' }}>
            {daysUntilNext <= 0 ? '🩸' : daysUntilNext}
          </p>
          <p className="text-xs font-medium" style={{ color: '#9E8E8E' }}>
            {daysUntilNext <= 0 ? 'May have started' : 'days away'}
          </p>
        </LunaCard>
        <LunaCard className="p-4 text-center transition-colors"
          style={{
            background: isOvDay || inFertile ? '#DFF0E4' : '#FFFFFF',
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
        </LunaCard>
      </div>

      {/* Calendar */}
      <CalendarView
        lastPeriod={lastPeriod}
        cycleLength={smartCycleLength}
        flowLog={flowLog}
        onFlowLog={onFlowLog}
      />

      {/* Cycle info */}
      <LunaCard className="p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-luna-muted">This cycle</h3>
          <LunaPill tone="sage">{smartCycleLength} day rhythm</LunaPill>
        </div>
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
      </LunaCard>

      <div className="h-2" />
    </div>
  )
}

export default CalendarTab
