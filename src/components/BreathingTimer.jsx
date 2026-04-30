import { useState, useEffect } from 'react'

const PHASES = [
  { key: 'inhale', label: 'Breathe In',  icon: '🌸', dur: 4, color: 'bg-cyan-200 dark:bg-cyan-900 shadow-cyan-300' },
  { key: 'hold',   label: 'Hold',        icon: '✨', dur: 4, color: 'bg-purple-200 dark:bg-purple-900 shadow-purple-300' },
  { key: 'exhale', label: 'Breathe Out', icon: '💨', dur: 4, color: 'bg-blue-200 dark:bg-blue-900 shadow-blue-300' },
]

const BreathingTimer = () => {
  const [active,    setActive]    = useState(false)
  const [phaseIdx,  setPhaseIdx]  = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [cycles,    setCycles]    = useState(0)

  const phase = PHASES[phaseIdx]

  useEffect(() => {
    if (!active) return
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
    const nextIdx = (phaseIdx + 1) % PHASES.length
    if (nextIdx === 0) setCycles(c => c + 1)
    setPhaseIdx(nextIdx)
    setCountdown(PHASES[nextIdx].dur)
  }, [active, countdown, phaseIdx])

  const start = () => { setActive(true); setPhaseIdx(0); setCountdown(PHASES[0].dur); setCycles(0) }
  const stop  = () => { setActive(false); setPhaseIdx(0); setCountdown(0) }

  const scale = active && phase.key === 'inhale' ? 'scale-125' : active && phase.key === 'hold' ? 'scale-125' : 'scale-100'

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 shadow-sm border-2 border-purple-100 dark:border-purple-800/50">
      <div className="text-center">
        <h2 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-0.5">🌙 Breathing Relief</h2>
        <p className="text-purple-400 dark:text-purple-500 text-xs mb-5">4-4-4 box breathing technique</p>

        {/* Circle */}
        <div className="flex justify-center mb-5">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-lg transition-all duration-1000 ease-in-out ${active ? phase.color : 'bg-purple-100 dark:bg-purple-900'} ${scale}`}>
            <div className="text-center">
              {active ? (
                <>
                  <p className="text-3xl mb-0.5">{phase.icon}</p>
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">{phase.label}</p>
                  <p className="text-3xl font-black text-purple-800 dark:text-purple-200">{countdown}</p>
                </>
              ) : (
                <p className="text-5xl">🧘‍♀️</p>
              )}
            </div>
          </div>
        </div>

        {active && cycles > 0 && (
          <p className="text-xs text-purple-400 dark:text-purple-500 mb-3">Round {cycles + 1}</p>
        )}

        <div className="flex gap-3 justify-center">
          {!active ? (
            <button onClick={start}
              className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-8 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
              ▶ Start
            </button>
          ) : (
            <button onClick={stop}
              className="bg-gray-400 dark:bg-gray-600 text-white px-8 py-2.5 rounded-full font-bold shadow-md hover:bg-gray-500 transition-all active:scale-95">
              ⏹ Stop
            </button>
          )}
        </div>

        <p className="text-xs text-purple-400 dark:text-purple-600 mt-4">🎧 Close your eyes and breathe slowly</p>
      </div>
    </div>
  )
}

export default BreathingTimer
