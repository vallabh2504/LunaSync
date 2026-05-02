import { useState } from 'react'

const FLOW_OPTIONS = [
  { key: 'none',     label: 'No Period', color: '#9E8E8E', bg: '#F5F5F5' },
  { key: 'spotting', label: 'Spotting',  color: '#C4798D', bg: '#F5DDE0' },
  { key: 'light',    label: 'Light',     color: '#FFFFFF', bg: '#E8B4BC' },
  { key: 'medium',   label: 'Medium',    color: '#FFFFFF', bg: '#C4798D' },
  { key: 'heavy',    label: 'Heavy',     color: '#FFFFFF', bg: '#A85E72' },
]

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const isSameDay  = (a, b) => a && b && a.toDateString() === b.toDateString()
const inRange    = (d, s, e) => d >= s && d <= e
const toStr      = (d) => d.toISOString().split('T')[0]

const CalendarView = ({ lastPeriod, cycleLength, flowLog = {}, onFlowLog }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selected, setSelected]         = useState(null)
  const [showPicker, setShowPicker]     = useState(false)

  const lastDate   = new Date(lastPeriod)
  const nextPeriod = new Date(lastDate.getTime() + cycleLength * 86400000)
  const ovulation  = new Date(nextPeriod.getTime() - 14 * 86400000)
  const fertStart  = new Date(ovulation.getTime() - 5 * 86400000)
  const fertEnd    = new Date(ovulation.getTime() + 86400000)
  const predEnd    = new Date(nextPeriod.getTime() + 5 * 86400000)

  const year  = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const first = new Date(year, month, 1)
  const last  = new Date(year, month + 1, 0)
  const today = new Date()

  const blanks = first.getDay()
  const days   = [
    ...Array(blanks).fill(null),
    ...Array.from({ length: last.getDate() }, (_, i) => new Date(year, month, i + 1)),
  ]

  const getDayStyle = (date) => {
    if (!date) return {}
    const ds   = toStr(date)
    const flow = flowLog[ds]

    if (flow && flow !== 'none') {
      const map = { spotting: '#F5DDE0', light: '#E8B4BC', medium: '#C4798D', heavy: '#A85E72' }
      const textMap = { spotting: '#C4798D', light: '#FFFFFF', medium: '#FFFFFF', heavy: '#FFFFFF' }
      return { background: map[flow] || '#F5DDE0', color: textMap[flow] || '#C4798D', fontWeight: 700 }
    }
    if (isSameDay(date, today))
      return { outline: '2px solid #C4798D', outlineOffset: '-2px', color: '#C4798D', fontWeight: 700 }
    if (isSameDay(date, ovulation))
      return { background: '#8FA895', color: '#FFFFFF', fontWeight: 700 }
    if (inRange(date, fertStart, fertEnd))
      return { background: '#DFF0E4', color: '#5E8068', fontWeight: 600 }
    if (inRange(date, nextPeriod, predEnd))
      return { background: '#FFF8F6', color: '#C4798D', border: '1.5px dashed rgba(196,121,141,0.40)' }
    return { color: '#3D3035' }
  }

  const handleDayClick = (date) => {
    if (!date) return
    setSelected(date)
    setShowPicker(true)
  }

  const handlePick = (key) => {
    if (selected) onFlowLog(toStr(selected), key)
    setShowPicker(false)
  }

  return (
    <div className="rounded-2xl p-4"
      style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
          style={{ background: '#F5DDE0', color: '#C4798D' }}>
          ‹
        </button>
        <h3 className="font-display font-semibold" style={{ color: '#3D3035' }}>
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
          style={{ background: '#F5DDE0', color: '#C4798D' }}>
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="text-center text-[10px] font-bold py-1"
            style={{ color: '#9E8E8E' }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, idx) => (
          <button
            key={idx}
            onClick={() => handleDayClick(date)}
            disabled={!date}
            className="aspect-square rounded-xl text-xs transition-all active:scale-90 flex items-center justify-center"
            style={date ? getDayStyle(date) : {}}
          >
            {date ? date.getDate() : ''}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 flex flex-wrap gap-x-3 gap-y-1.5"
        style={{ borderTop: '1px solid rgba(232,180,188,0.20)' }}>
        {[
          { color: '#C4798D', label: 'Period' },
          { color: '#8FA895', label: 'Ovulation' },
          { color: '#B8CBBF', label: 'Fertile' },
          { color: 'rgba(196,121,141,0.25)', label: 'Predicted', dashed: true },
        ].map(({ color, label, dashed }) => (
          <span key={label} className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: '#9E8E8E' }}>
            <span className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ background: color, border: dashed ? '1.5px dashed rgba(196,121,141,0.50)' : 'none' }} />
            {label}
          </span>
        ))}
      </div>

      {/* Flow picker modal */}
      {showPicker && selected && (
        <div className="fixed inset-0 flex items-end justify-center z-50 p-4"
          style={{ background: 'rgba(61,48,53,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowPicker(false)}>
          <div className="rounded-3xl p-6 w-full max-w-sm animate-slide-up"
            style={{ background: '#FFFFFF', boxShadow: '0 -4px 40px rgba(61,48,53,0.12)' }}
            onClick={e => e.stopPropagation()}>
            <h4 className="font-display font-semibold mb-0.5" style={{ color: '#3D3035' }}>Log Period Flow</h4>
            <p className="text-xs mb-4" style={{ color: '#9E8E8E' }}>
              {selected.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {FLOW_OPTIONS.map(opt => (
                <button key={opt.key} onClick={() => handlePick(opt.key)}
                  className="p-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95"
                  style={{ background: opt.bg, color: opt.color, border: `1px solid ${opt.bg}` }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarView
