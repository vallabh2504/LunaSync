import { useState, useEffect } from 'react'

function BreathingTimer() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState('idle') // idle, inhale, hold, exhale
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    let interval
    if (isActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (isActive && countdown === 0) {
      // Cycle through phases
      if (phase === 'inhale') {
        setPhase('hold')
        setCountdown(4)
      } else if (phase === 'hold') {
        setPhase('exhale')
        setCountdown(4)
      } else if (phase === 'exhale') {
        setPhase('inhale')
        setCountdown(4)
      }
    }
    return () => clearInterval(interval)
  }, [isActive, countdown, phase])

  const startBreathing = () => {
    setIsActive(true)
    setPhase('inhale')
    setCountdown(4)
  }

  const stopBreathing = () => {
    setIsActive(false)
    setPhase('idle')
    setCountdown(0)
  }

  const getAnimationClass = () => {
    if (!isActive) return 'scale-100'
    if (phase === 'inhale') return 'scale-110'
    if (phase === 'hold') return 'scale-110'
    if (phase === 'exhale') return 'scale-100'
    return 'scale-100'
  }

  const getGlowClass = () => {
    if (!isActive) return 'bg-purple-200'
    if (phase === 'inhale') return 'bg-cyan-200 shadow-cyan-300'
    if (phase === 'hold') return 'bg-purple-200 shadow-purple-300'
    if (phase === 'exhale') return 'bg-blue-200 shadow-blue-300'
    return 'bg-purple-200'
  }

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-2xl p-6 shadow-lg border-2 border-purple-200">
      <div className="text-center">
        <h2 className="text-xl font-bold text-purple-700 mb-1">
          🌙 Quick Relief Timer
        </h2>
        <p className="text-purple-500 text-sm mb-4">Take a deep breath, Bujji 💜</p>
        
        {/* Breathing Circle */}
        <div className="flex justify-center mb-4">
          <div 
            className={`
              w-32 h-32 rounded-full flex items-center justify-center 
              transition-all duration-1000 ease-in-out
              ${getGlowClass()} shadow-lg
              ${getAnimationClass()}
            `}
          >
            <div className="text-center">
              {isActive ? (
                <>
                  <p className="text-2xl font-bold text-purple-700">
                    {phase === 'inhale' ? '🌸' : phase === 'hold' ? '✨' : '💨'}
                  </p>
                  <p className="text-sm font-medium text-purple-600 capitalize">
                    {phase}
                  </p>
                  <p className="text-3xl font-bold text-purple-800">
                    {countdown}
                  </p>
                </>
              ) : (
                <p className="text-4xl">🧘‍♀️</p>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        {isActive && (
          <div className="bg-white/50 rounded-lg p-3 mb-4">
            <p className="text-purple-700 text-sm">
              {phase === 'inhale' && 'Breathe in slowly... 🌸'}
              {phase === 'hold' && 'Hold it... ✨'}
              {phase === 'exhale' && 'Breathe out slowly... 💨'}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          {!isActive ? (
            <button
              onClick={startBreathing}
              className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              ▶ Start
            </button>
          ) : (
            <button
              onClick={stopBreathing}
              className="bg-gray-400 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-gray-500 transition-all"
            >
              ⏹ Stop
            </button>
          )}
        </div>

        {/* Lofi vibes text */}
        <p className="text-xs text-purple-400 mt-3">
          🎧 Close your eyes and relax...
        </p>
      </div>
    </div>
  )
}

export default BreathingTimer
