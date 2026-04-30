import { useState, useEffect } from 'react'

const RemedyCard = ({ symptoms, autoShow = true }) => {
  const [show,      setShow]      = useState(false)
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
    symptoms.cramps   >= 4 && '🫖 Ginger tea or a hot water bottle can ease cramps',
    symptoms.bloating >= 4 && '💧 Avoid salty foods and drink plenty of water',
    symptoms.headache >= 4 && '😴 Rest in a dark room and stay hydrated',
    symptoms.backPain >= 4 && '🧘 Gentle stretching or a heat pad for back pain',
    symptoms.nausea   >= 4 && '🌿 Ginger tea or peppermint helps with nausea',
  ].filter(Boolean)

  if (!show) return (
    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 border border-orange-100 dark:border-orange-800/30">
      <div className="flex items-center justify-between">
        <span className="text-orange-600 dark:text-orange-300 font-medium text-sm">Not feeling great? 😣</span>
        <button onClick={() => setShow(true)}
          className="bg-orange-400 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-orange-500 transition-colors active:scale-95">
          See remedy
        </button>
      </div>
    </div>
  )

  return (
    <div className="bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 rounded-2xl p-4 border border-orange-200 dark:border-orange-800/40 shadow-sm animate-fade-in">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-orange-600 dark:text-orange-300 flex items-center gap-2 text-sm">🌿 Remedy Suggestions</h4>
        <button onClick={() => { setShow(false); setDismissed(true) }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg leading-none">✕</button>
      </div>
      <div className="space-y-2">
        {tips.map((tip, i) => (
          <p key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</p>
        ))}
      </div>
    </div>
  )
}

export default RemedyCard
