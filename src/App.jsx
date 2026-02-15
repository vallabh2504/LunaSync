import { useState, useEffect } from 'react'

function App() {
  const [lastPeriod, setLastPeriod] = useState(() => {
    return localStorage.getItem('lastPeriod') || new Date().toISOString().split('T')[0]
  })
  const [cycleLength, setCycleLength] = useState(() => {
    return Number(localStorage.getItem('cycleLength')) || 28
  })
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  
  const [botToken, setBotToken] = useState(() => localStorage.getItem('botToken') || '')
  const [chatId, setChatId] = useState(() => localStorage.getItem('chatId') || '')

  useEffect(() => {
    localStorage.setItem('lastPeriod', lastPeriod)
    localStorage.setItem('cycleLength', cycleLength)
    localStorage.setItem('botToken', botToken)
    localStorage.setItem('chatId', chatId)
  }, [lastPeriod, cycleLength, botToken, chatId])

  const handleMissYou = async () => {
    if (!botToken || !chatId) {
      setMessage('⚠️ Please set Bot Token & Chat ID first!')
      return
    }
    setSending(true)
    setMessage('Sending...')
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: "I miss you! ❤️ (from LunaSync)",
        }),
      })
      const data = await response.json()
      if (data.ok) {
        setMessage('Message sent! 💌')
      } else {
        setMessage(`Failed: ${data.description}`)
      }
    } catch (error) {
      setMessage('Error sending message.')
    }
    setSending(false)
    setTimeout(() => setMessage(''), 3000)
  }

  const nextPeriod = new Date(new Date(lastPeriod).getTime() + cycleLength * 24 * 60 * 60 * 1000)
  const today = new Date()
  const diffTime = nextPeriod - today
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-pink-50 p-4 flex flex-col items-center justify-center font-sans text-gray-800">
      <h1 className="text-4xl font-extrabold text-pink-600 mb-6 drop-shadow-sm">LunaSync 🌙</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm border border-pink-100">
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Period Start</label>
          <input 
            type="date" 
            value={lastPeriod} 
            onChange={(e) => setLastPeriod(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cycle Length (Days)</label>
          <input 
            type="number" 
            value={cycleLength} 
            onChange={(e) => setCycleLength(Number(e.target.value))}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
        </div>

        <div className="text-center mb-6 py-4 bg-pink-50 rounded-xl border border-pink-100">
          <p className="text-gray-500 text-sm font-medium">Next Period In</p>
          <p className="text-6xl font-black text-pink-500 my-1">{daysUntil}</p>
          <p className="text-gray-500 text-sm font-medium">Days</p>
          <p className="text-xs text-pink-400 mt-2 font-semibold">{nextPeriod.toDateString()}</p>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-3">Telegram Integration</h2>
          <input 
            type="text" 
            placeholder="Bot Token" 
            value={botToken} 
            onChange={(e) => setBotToken(e.target.value)}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded mb-2 text-xs focus:ring-1 focus:ring-pink-300 outline-none"
          />
          <input 
            type="text" 
            placeholder="Chat ID" 
            value={chatId} 
            onChange={(e) => setChatId(e.target.value)}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded mb-4 text-xs focus:ring-1 focus:ring-pink-300 outline-none"
          />
          
          <button 
            onClick={handleMissYou}
            disabled={sending}
            className={`w-full py-3 rounded-xl text-white font-bold text-lg shadow-lg transform transition active:scale-95 duration-200 ${sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-pink-200'}`}
          >
            {sending ? 'Sending...' : 'Miss You ❤️'}
          </button>
          {message && <p className="text-center text-sm mt-3 font-medium text-pink-600 animate-pulse">{message}</p>}
        </div>
      </div>
    </div>
  )
}

export default App
