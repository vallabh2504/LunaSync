import { useState } from 'react'

const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN
const CHAT_ID   = import.meta.env.VITE_CHAT_ID

const MissYou = () => {
  const [sending, setSending] = useState(false)
  const [status,  setStatus]  = useState('')

  const send = async () => {
    if (!BOT_TOKEN || !CHAT_ID) { setStatus('Not configured'); return }
    setSending(true)
    try {
      const res  = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ chat_id: CHAT_ID, text: "Bujji I'm missing you ra 💕" }),
      })
      const data = await res.json()
      setStatus(data.ok ? 'Sent! 💌' : 'Failed to send')
    } catch {
      setStatus('Error — check connection')
    }
    setSending(false)
    setTimeout(() => setStatus(''), 3000)
  }

  return (
    <div className="card p-5">
      <h3 className="font-bold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-widest">
        💌 Send Love
      </h3>
      <button onClick={send} disabled={sending}
        className={`w-full py-3.5 rounded-2xl text-white font-bold text-base shadow-lg transition-all active:scale-95
          ${sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 shadow-red-200 dark:shadow-pink-900/20'}`}>
        {sending ? 'Sending...' : 'Miss You ❤️'}
      </button>
      {status && (
        <p className="text-center text-sm mt-3 font-medium text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 p-2 rounded-xl">
          {status}
        </p>
      )}
    </div>
  )
}

export default MissYou
