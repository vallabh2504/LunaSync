import { useState, useEffect } from 'react'

const COMFORT_MESSAGES = [
  "Pelli cheskuntava baby nannu😚♥️💫",
  "Nah bujji kadhu ❤️😘",
  "Everything will be alright baby nenu unna kaa♥️",
  "All I wanna do is to be with you♥️",
  "Keep it up bujji😘😘"
]

function ComfortVault({ lastPeriod, cycleLength }) {
  const [todayMessage, setTodayMessage] = useState(null)
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    // Calculate if she's in period phase (typically 5 days from period start)
    const lastDate = new Date(lastPeriod)
    const today = new Date()
    const daysSincePeriod = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
    
    // Period phase: days 0-5 of cycle (first 5 days after period started)
    const isInPeriodPhase = daysSincePeriod >= 0 && daysSincePeriod <= 5

    if (!isInPeriodPhase) {
      setUnlocked(false)
      setTodayMessage(null)
      return
    }

    // Get stored data
    const todayStr = new Date().toISOString().split('T')[0]
    const lastUnlockDate = localStorage.getItem('comfortVaultLastUnlock')
    const storedMessage = localStorage.getItem('comfortVaultMessage')

    // Check if we already unlocked today
    if (lastUnlockDate === todayStr && storedMessage) {
      setUnlocked(true)
      setTodayMessage(storedMessage)
    } else {
      // Unlock a new message (rotate through the list)
      const messageIndex = Math.floor(Math.random() * COMFORT_MESSAGES.length)
      const newMessage = COMFORT_MESSAGES[messageIndex]
      
      localStorage.setItem('comfortVaultLastUnlock', todayStr)
      localStorage.setItem('comfortVaultMessage', newMessage)
      
      setUnlocked(true)
      setTodayMessage(newMessage)
    }
  }, [lastPeriod])

  // Only show during period phase
  const lastDate = new Date(lastPeriod)
  const today = new Date()
  const daysSincePeriod = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
  const isInPeriodPhase = daysSincePeriod >= 0 && daysSincePeriod <= 5

  if (!isInPeriodPhase) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-pink-300 via-rose-300 to-purple-300 rounded-2xl p-6 shadow-xl border-2 border-pink-200">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
          💝 Comfort Vault 💝
        </h2>
        <p className="text-white/80 text-sm mb-4">Your daily surprise message</p>
        
        {unlocked && todayMessage ? (
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 animate-pulse">
            <p className="text-lg font-semibold text-white drop-shadow-sm">
              {todayMessage}
            </p>
          </div>
        ) : (
          <div className="bg-white/30 rounded-xl p-4">
            <p className="text-white/70">Check back tomorrow! ✨</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ComfortVault
