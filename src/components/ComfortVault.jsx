import { useState, useEffect } from 'react'

const MESSAGES = [
  "Pelli cheskuntava baby nannu 😚♥️💫",
  "Nah bujji kadhu ❤️😘",
  "Everything will be alright baby, nenu unna kaa ♥️",
  "All I wanna do is to be with you ♥️",
  "Keep it up bujji 😘😘",
  "You are so strong and I love you more every day 💕",
  "Resting is not giving up — it's taking care of yourself 🌸",
]

const ComfortVault = ({ lastPeriod, cycleLength }) => {
  const [message, setMessage] = useState(null)

  const daysSince = Math.floor((new Date() - new Date(lastPeriod)) / 86400000)
  const cycleDay  = ((daysSince % cycleLength) + cycleLength) % cycleLength + 1
  const inPeriod  = cycleDay <= 5 && daysSince >= 0

  useEffect(() => {
    if (!inPeriod) {
      queueMicrotask(() => setMessage(null))
      return
    }
    const todayStr = new Date().toISOString().split('T')[0]
    const stored   = localStorage.getItem('comfortVaultDate')
    if (stored === todayStr) {
      const msg = localStorage.getItem('comfortVaultMsg')
      queueMicrotask(() => setMessage(msg))
    } else {
      const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
      localStorage.setItem('comfortVaultDate', todayStr)
      localStorage.setItem('comfortVaultMsg', msg)
      queueMicrotask(() => setMessage(msg))
    }
  }, [inPeriod])

  if (!inPeriod || !message) return null

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #C4798D 0%, #A85E72 100%)', boxShadow: '0 6px 28px rgba(196,121,141,0.30)' }}>
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.08)' }} />
      <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.06)' }} />

      <div className="relative">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
          A message for you 💝
        </p>
        <div className="rounded-xl p-4 mb-3" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <p className="font-display text-lg italic font-medium text-white leading-relaxed">
            "{message}"
          </p>
        </div>
        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Day {cycleDay} · A new message unlocks each day
        </p>
      </div>
    </div>
  )
}

export default ComfortVault
