import { useState } from 'react'

const PinLock = ({ pinCode, onUnlock }) => {
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)
  const [error, setError] = useState('')

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
          setError('Wrong PIN — try again')
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
    <div className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: '#FAF5F2' }}>

      {/* Logo */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <path d="M14 4 C8 4 4 9 4 14 C4 19.5 8.5 24 14 24 C11 21 9.5 17.5 9.5 14 C9.5 9.5 12 6 14 4Z"
              fill="#C4798D" opacity="0.9" />
          </svg>
          <h1 className="font-display text-2xl font-semibold" style={{ color: '#C4798D' }}>LunaSync</h1>
        </div>
        <p className="text-sm" style={{ color: '#9E8E8E' }}>Enter your PIN to continue</p>
      </div>

      {/* Dots */}
      <div className={`flex gap-4 mb-6 ${shake ? '' : ''}`}
        style={shake ? { animation: 'shake 0.4s ease-in-out' } : {}}>
        {[0,1,2,3].map(i => (
          <div key={i} className="w-4 h-4 rounded-full border-2 transition-all duration-150"
            style={{
              background: i < input.length ? '#C4798D' : 'transparent',
              borderColor: i < input.length ? '#C4798D' : '#E8B4BC',
              transform: i < input.length ? 'scale(1.1)' : 'scale(1)',
            }} />
        ))}
      </div>

      {error && (
        <p className="text-sm mb-4 font-semibold" style={{ color: '#C4798D' }}>{error}</p>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((key, idx) => {
          if (key === '') return <div key={idx} />
          return (
            <button
              key={idx}
              onClick={() => key === '⌫' ? handleDelete() : handleDigit(String(key))}
              className="w-16 h-16 rounded-full text-xl font-bold transition-all active:scale-90"
              style={key === '⌫'
                ? { color: '#9E8E8E', background: 'transparent' }
                : { background: '#FFFFFF', color: '#3D3035', boxShadow: '0 2px 12px rgba(61,48,53,0.08)', border: '1px solid rgba(232,180,188,0.25)' }
              }
            >
              {key}
            </button>
          )
        })}
      </div>

      <button onClick={handleForgot} className="text-xs font-semibold underline"
        style={{ color: '#C4798D', opacity: 0.6 }}>
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
