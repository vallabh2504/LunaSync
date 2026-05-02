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
    <div className="rounded-2xl p-4"
      style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9E8E8E' }}>
        Send love 💌
      </p>
      <button
        onClick={send}
        disabled={sending}
        className="w-full py-3.5 rounded-full font-bold text-sm transition-all active:scale-95"
        style={{
          background: sending ? '#E8B4BC' : 'linear-gradient(135deg, #C4798D, #A85E72)',
          color: '#FFFFFF',
          boxShadow: sending ? 'none' : '0 4px 16px rgba(196,121,141,0.30)',
          fontFamily: 'Nunito, sans-serif',
        }}>
        {sending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
            Sending...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            💝 Miss You
          </span>
        )}
      </button>

      {status && (
        <p className="text-center text-xs mt-3 font-semibold py-2 rounded-xl"
          style={{ background: '#F5DDE0', color: '#C4798D' }}>
          {status}
        </p>
      )}
    </div>
  )
}

export default MissYou
