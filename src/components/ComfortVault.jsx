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

  const daysSince  = Math.floor((new Date() - new Date(lastPeriod)) / 86400000)
  const cycleDay   = ((daysSince % cycleLength) + cycleLength) % cycleLength + 1
  const inPeriod   = cycleDay <= 5 && daysSince >= 0

  useEffect(() => {
    if (!inPeriod) { setMessage(null); return }
    const todayStr = new Date().toISOString().split('T')[0]
    const stored   = localStorage.getItem('comfortVaultDate')
    if (stored === todayStr) {
      setMessage(localStorage.getItem('comfortVaultMsg'))
    } else {
      const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
      localStorage.setItem('comfortVaultDate', todayStr)
      localStorage.setItem('comfortVaultMsg', msg)
      setMessage(msg)
    }
  }, [inPeriod])

  if (!inPeriod || !message) return null

  return (
    <div className="bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400 rounded-2xl p-6 shadow-xl">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-1">💝 Comfort Vault</h2>
        <p className="text-white/70 text-xs mb-4">Your message for today</p>
        <div className="bg-white/25 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-lg font-semibold text-white leading-relaxed">{message}</p>
        </div>
        <p className="text-white/60 text-xs mt-3">Day {cycleDay} • A new message unlocks each day 🌸</p>
      </div>
    </div>
  )
}

export default ComfortVault
