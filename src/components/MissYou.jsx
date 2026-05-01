import { useState } from 'react'

const BOT_TOKEN = '8273528353:AAGOQJGIaNt2bK32YWXfwKzlX8K9PX41ykY'
const CHAT_ID   = '456109422'

const MESSAGES = [
  "Hey! Just wanted to let you know I'm thinking of you and I miss you ❤️ (Sent from LunaSync)",
  "Missing you so much right now 🥺💕 (Sent from LunaSync)",
  "Thinking of you, Bujji! Wish you were here 🌙❤️ (Sent from LunaSync)",
  "Just a little reminder that you're loved 💌✨ (Sent from LunaSync)",
]

const MissYou = () => {
  const [sending, setSending] = useState(false)
  const [status,  setStatus]  = useState('')

  const send = async () => {
    setSending(true)
    const text = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
    try {
      const res  = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ chat_id: CHAT_ID, text }),
      })
      const data = await res.json()
      setStatus(data.ok ? '💌 Sent with love!' : '❌ Failed to send')
    } catch {
      setStatus('❌ Check connection')
    }
    setSending(false)
    setTimeout(() => setStatus(''), 3000)
  }

  return (
    <div className="card p-5 card-in relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl pointer-events-none" />

      <h3 className="font-bold text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-2 text-xs uppercase tracking-widest">
        💌 Send Love
      </h3>

      <button
        onClick={send}
        disabled={sending}
        className={`btn-shimmer w-full py-4 rounded-2xl text-white font-black text-base shadow-lg transition-all duration-300 active:scale-95
          ${sending
            ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
            : 'bg-gradient-to-r from-red-400 via-pink-500 to-rose-400 shadow-pink-400/40 hover:shadow-pink-400/60 hover:scale-[1.02] pulse-glow'
          }`}
      >
        {sending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
            Sending...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span className="float">💝</span> Miss You
          </span>
        )}
      </button>

      {status && (
        <p className="text-center text-sm mt-3 font-semibold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-500/10 border border-pink-100 dark:border-pink-500/20 p-2.5 rounded-xl card-in">
          {status}
        </p>
      )}
    </div>
  )
}

export default MissYou
