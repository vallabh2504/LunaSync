import { useState } from 'react'

const FLOW_OPTIONS = [
  { key: 'none',     label: 'No Period', emoji: '⚪', cls: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300' },
  { key: 'spotting', label: 'Spotting',  emoji: '🩸',  cls: 'bg-pink-100 text-pink-700' },
  { key: 'light',    label: 'Light',     emoji: '🩸🩸', cls: 'bg-pink-400 text-white' },
  { key: 'medium',   label: 'Medium',    emoji: '🩸🩸🩸',cls: 'bg-rose-500 text-white' },
  { key: 'heavy',    label: 'Heavy',     emoji: '🩸🩸🩸🩸',cls:'bg-red-600 text-white' },
]

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const isSameDay = (a, b) => a && b && a.toDateString() === b.toDateString()
const inRange   = (d, s, e) => d >= s && d <= e
const toStr     = (d) => d.toISOString().split('T')[0]

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

  const getDayCls = (date) => {
    if (!date) return ''
    const ds   = toStr(date)
    const flow = flowLog[ds]

    if (flow && flow !== 'none') {
      const map = { spotting: 'bg-pink-200 text-pink-800', light: 'bg-pink-400 text-white', medium: 'bg-rose-500 text-white', heavy: 'bg-red-600 text-white' }
      return map[flow] || 'bg-pink-300 text-white'
    }
    if (isSameDay(date, today))       return 'ring-2 ring-pink-500 font-bold text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-900/30'
    if (isSameDay(date, ovulation))   return 'bg-teal-400 text-white font-bold'
    if (inRange(date, fertStart, fertEnd)) return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
    if (inRange(date, nextPeriod, predEnd)) return 'bg-pink-100 dark:bg-pink-900/20 text-pink-500 border border-dashed border-pink-300 dark:border-pink-700'
    return 'text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-purple-900/30'
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
    <div className="card p-4">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-pink-100 dark:hover:bg-purple-800 text-pink-500 text-xl font-bold transition-colors">
          ‹
        </button>
        <h3 className="font-bold text-gray-800 dark:text-gray-100">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-pink-100 dark:hover:bg-purple-800 text-pink-500 text-xl font-bold transition-colors">
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 py-1">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, idx) => (
          <button
            key={idx}
            onClick={() => handleDayClick(date)}
            disabled={!date}
            className={`aspect-square rounded-xl text-xs transition-all active:scale-90 flex items-center justify-center
              ${date ? 'cursor-pointer' : 'cursor-default'}
              ${getDayCls(date)}`}
          >
            {date ? date.getDate() : ''}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>Period</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block"></span>Ovulation</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-200 inline-block"></span>Fertile</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-pink-100 border border-dashed border-pink-300 inline-block"></span>Predicted</span>
      </div>

      {/* Flow picker */}
      {showPicker && selected && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 p-4"
          onClick={() => setShowPicker(false)}>
          <div className="bg-white dark:bg-[#1a1033] rounded-2xl p-6 w-full max-w-sm animate-slide-up"
            onClick={e => e.stopPropagation()}>
            <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-0.5">Log Period Flow</h4>
            <p className="text-xs text-gray-400 dark:text-purple-400 mb-4">
              {selected.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {FLOW_OPTIONS.map(opt => (
                <button key={opt.key} onClick={() => handlePick(opt.key)}
                  className={`p-3 rounded-xl font-medium text-sm transition-all active:scale-95 ${opt.cls}`}>
                  <div className="text-base mb-0.5">{opt.emoji}</div>
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
