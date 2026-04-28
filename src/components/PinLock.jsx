import { useState } from 'react'

const PinLock = ({ pinCode, onUnlock }) => {
  const [input, setInput]   = useState('')
  const [shake, setShake]   = useState(false)
  const [error, setError]   = useState('')

  const handleDigit = (d) => {
    if (input.length >= 4) return
    const next = input + d
    setInput(next)
    if (next.length === 4) {
      setTimeout(() => {
        if (next === pinCode) {
          onUnlock()
        } else {
          setShake(true)
          setError('Wrong PIN')
          setInput('')
          setTimeout(() => { setShake(false); setError('') }, 700)
        }
      }, 100)
    }
  }

  const handleDelete = () => setInput(p => p.slice(0, -1))

  const handleForgot = () => {
    if (window.confirm('This will clear ALL your data and remove the PIN. Continue?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0f0a1e] flex flex-col items-center justify-center p-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🌙</div>
        <h1 className="text-3xl font-extrabold text-white">LunaSync</h1>
        <p className="text-purple-300 text-sm mt-1">Enter your PIN to continue</p>
      </div>

      {/* Dots */}
      <div className={`flex gap-4 mb-6 ${shake ? 'animate-[wiggle_0.4s_ease-in-out]' : ''}`}
        style={shake ? { animation: 'shake 0.4s ease-in-out' } : {}}>
        {[0,1,2,3].map(i => (
          <div key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-150
              ${i < input.length
                ? 'bg-pink-400 border-pink-400 scale-110'
                : 'bg-transparent border-purple-500'}`}
          />
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-4 font-medium">{error}</p>}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((key, idx) => {
          if (key === '') return <div key={idx} />
          return (
            <button
              key={idx}
              onClick={() => key === '⌫' ? handleDelete() : handleDigit(String(key))}
              className={`w-16 h-16 rounded-full text-xl font-bold transition-all active:scale-90
                ${key === '⌫'
                  ? 'text-purple-400 hover:text-pink-400'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10 shadow-md'}`}
            >
              {key}
            </button>
          )
        })}
      </div>

      <button onClick={handleForgot} className="text-xs text-purple-500 underline mt-4">
        Forgot PIN?
      </button>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-8px); }
          80%      { transform: translateX(8px); }
        }
      `}</style>
    </div>
  )
}

export default PinLock
