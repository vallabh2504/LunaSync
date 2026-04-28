const REMEDIES = {
  Chocolate: '🍫 Try dark chocolate (70%+ cocoa) — rich in magnesium which helps cramps!',
  Salty:     '🥜 Opt for roasted nuts or popcorn instead of chips',
  Sweet:     '🍎 Fresh fruits or dates — natural sweetness with real nutrients',
  Carbs:     '🍞 Choose whole grain bread or oats for sustained energy',
  Spicy:     '🌶️ Ginger or turmeric tea helps with inflammation naturally',
  Healthy:   '🥗 Great choice! Keep nourishing your body 🌟',
}

const EMOJIS = { Chocolate:'🍫', Salty:'🍟', Sweet:'🍬', Carbs:'🍞', Spicy:'🌶️', Healthy:'🥗' }

const CravingsLibrary = ({ logs }) => {
  const counts = {}
  logs.forEach(l => (l.cravings || []).forEach(c => { counts[c] = (counts[c] || 0) + 1 }))
  const top = Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 3)

  if (!top.length) return null

  return (
    <div className="card p-5">
      <h3 className="text-base font-bold text-orange-500 dark:text-orange-300 mb-4 flex items-center gap-2">
        <span className="bg-orange-100 dark:bg-orange-900 p-1.5 rounded-xl text-lg">🍪</span> Cravings Library
      </h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Your most logged cravings</p>
      <div className="space-y-3">
        {top.map(([craving, count]) => (
          <div key={craving} className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-3 border border-orange-100 dark:border-orange-800/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <span className="text-2xl">{EMOJIS[craving] || '🍴'}</span>{craving}
              </span>
              <span className="bg-orange-200 dark:bg-orange-800/50 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full text-xs font-bold">
                {count}× logged
              </span>
            </div>
            <div className="bg-white/60 dark:bg-white/5 rounded-xl p-2 text-xs text-gray-600 dark:text-gray-400 italic">
              💡 {REMEDIES[craving] || 'Everything in moderation! 😊'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CravingsLibrary
