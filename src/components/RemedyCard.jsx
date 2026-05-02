import { useState, useEffect } from 'react'

const RemedyCard = ({ symptoms, autoShow = true }) => {
  const [show, setShow]           = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const hasHigh = symptoms && (
    symptoms.cramps >= 4 || symptoms.bloating >= 4 || symptoms.headache >= 4 ||
    symptoms.backPain >= 4 || symptoms.nausea >= 4
  )

  useEffect(() => {
    if (autoShow && hasHigh && !dismissed) setShow(true)
  }, [hasHigh, autoShow, dismissed])

  if (!symptoms || !hasHigh) return null

  const tips = [
    symptoms.cramps   >= 4 && { icon: '🫖', text: 'Ginger tea or a hot water bottle can ease cramps' },
    symptoms.bloating >= 4 && { icon: '💧', text: 'Avoid salty foods and drink plenty of water' },
    symptoms.headache >= 4 && { icon: '😴', text: 'Rest in a dark room and stay hydrated' },
    symptoms.backPain >= 4 && { icon: '🧘', text: 'Gentle stretching or a heat pad for back pain' },
    symptoms.nausea   >= 4 && { icon: '🌿', text: 'Ginger tea or peppermint helps with nausea' },
  ].filter(Boolean)

  if (!show) return (
    <div className="rounded-2xl p-4 flex items-center justify-between"
      style={{ background: '#FFF8F6', border: '1px solid rgba(232,180,188,0.35)' }}>
      <div>
        <p className="text-sm font-semibold" style={{ color: '#3D3035' }}>Not feeling great?</p>
        <p className="text-xs mt-0.5" style={{ color: '#9E8E8E' }}>See remedies for your symptoms</p>
      </div>
      <button onClick={() => setShow(true)}
        className="px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
        style={{ background: '#F5DDE0', color: '#C4798D' }}>
        View tips
      </button>
    </div>
  )

  return (
    <div className="rounded-2xl p-4 animate-fade-in"
      style={{ background: '#FFFFFF', boxShadow: '0 2px 14px rgba(61,48,53,0.06)', border: '1px solid rgba(232,180,188,0.22)' }}>
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9E8E8E' }}>
          Remedy suggestions 🌿
        </p>
        <button onClick={() => { setShow(false); setDismissed(true) }}
          className="text-sm w-6 h-6 flex items-center justify-center rounded-full transition-all"
          style={{ color: '#9E8E8E', background: '#F5DDE0' }}>
          ✕
        </button>
      </div>
      <div className="space-y-2.5">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
            style={{ background: '#FAF5F2' }}>
            <span className="text-base flex-shrink-0">{tip.icon}</span>
            <p className="text-sm leading-relaxed" style={{ color: '#3D3035' }}>{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RemedyCard
